const http = require("http");
const https = require("https");

class HttpError extends Error {
  constructor(message, status, headers, body) {
    super(message);
    this.status = status;
    this.headers = headers;
    this.body = body;
  }
}

function httpRequest(method, url, options = {}) {
  return new Promise((resolve, reject) => {
    const {
      params = {},
      headers = {},
      body = null,
      fullResponse = false,
      timeout = 10000,
      retries = 0,
      retryAfter = 10000,
    } = options;

    let attempts = 0;

    const parsedUrl = new URL(url);
    Object.keys(params).forEach((key) =>
      parsedUrl.searchParams.append(key, params[key])
    );

    const isHttps = parsedUrl.protocol === "https:";

    const requestOptions = {
      method: method.toUpperCase(),
      hostname: parsedUrl.hostname,
      port: parsedUrl.port || (isHttps ? 443 : 80),
      path: `${parsedUrl.pathname}${parsedUrl.search}`,
      headers,
    };

    function makeRequest() {
      attempts++;

      const requestFn = isHttps ? https.request : http.request;

      const req = requestFn(requestOptions, (response) => {
        let data = "";

        response.on("data", (chunk) => {
          data += chunk;
        });

        response.on("end", () => {
          console[response.statusCode < 400 ? "log" : "error"](
            `[${method.toUpperCase()}] - ${parsedUrl} - ${response.statusCode}`
          );

          if (response.statusCode === 429 && attempts <= retries) {
            const retryAfterHeader =
              parseInt(response.headers["retry-after"], 10) * 1000 ||
              retryAfter;
            setTimeout(makeRequest, retryAfterHeader);
            return;
          }

          if (response.statusCode >= 400) {
            reject(
              new HttpError(
                `URL: ${parsedUrl}`,
                response.statusCode,
                response.headers,
                data
              )
            );
            return;
          }

          // Parse JSON if Content-Type is application/json
          let parsedBody = data;
          if (
            response.headers["content-type"] &&
            response.headers["content-type"].includes("application/json")
          ) {
            try {
              parsedBody = JSON.parse(data);
            } catch (error) {
              reject(new Error("Failed to parse JSON response"));
              return;
            }
          }

          resolve(
            fullResponse
              ? {
                  status: response.statusCode,
                  headers: response.headers,
                  body: parsedBody,
                }
              : parsedBody
          );
        });
      });

      req.on("error", (error) => {
        if (attempts <= retries) {
          console.error(
            `Network error: ${JSON.stringify(
              error
            )}. Retry after ${retryAfter} seconds`
          );
          setTimeout(makeRequest, retryAfter);
        } else {
          reject(
            new Error(
              `Network error after ${attempts} attempts: ${error.message} (${method} ${url})`
            )
          );
        }
      });

      req.setTimeout(timeout, () => {
        req.destroy();
        reject(new Error("Request timed out"));
      });

      if (body) {
        req.write(typeof body === "string" ? body : JSON.stringify(body));
      }

      req.end();
    }

    makeRequest();
  });
}

module.exports = {
  httpRequest,
  HttpError,
};
