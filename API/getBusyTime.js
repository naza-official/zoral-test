const https = require("https");
const { URL } = require("node:url");

const calendarId =
  "a2f28b5b18eeaae6748d838abe646185d933079038ea1096c3e1c8149c06e883@group.calendar.google.com";
const timeMin = "2023-10-01T00:00:00Z";
const timeMax = "2025-10-31T23:59:59Z";

/**
 * Fetches busy time intervals from a public Google Calendar.
 * @param {string} calendarId - The ID of the Google Calendar.
 * @param {string} timeMin - The start time in ISO format.
 * @param {string} timeMax - The end time in ISO format.
 */
function getBusyTimeIntervals(calendarId, timeMin, timeMax) {
  return fetchICalData(
    new URL(
      `https://calendar.google.com/calendar/ical/${calendarId}/public/basic.ics`
    )
  )
    .then((icalData) => {
      return parseICalData(icalData, timeMin, timeMax);
    })
    .catch((error) => {
      throw new Error(
        `Failed to get busy time intervals: ${error.message || error}`
      );
    });
}

/**
 * performing api request - NO PROXY SUPPORT
 * @param {string|URL} icalUrl
 */
function fetchICalData(icalUrl) {
  return new Promise((resolve, reject) => {
    https
      .get(icalUrl, (response) => {
        if (response.statusCode !== 200) {
          reject(`Failed to fetch iCal data: ${response.statusCode}`);
          return;
        }

        let data = "";
        response.on("data", (chunk) => {
          data += chunk;
        });

        response.on("end", () => {
          resolve(data);
        });
      })
      .on("error", (error) => {
        reject(new Error(`Network error: ${error.message}`));
      });
  });
}

function parseICalData(icalData, timeMin, timeMax) {
  const events = [];
  const lines = icalData.split("\n");

  let event = null;
  for (const line of lines) {
    if (line.startsWith("BEGIN:VEVENT")) {
      event = {};
    } else if (line.startsWith("END:VEVENT")) {
      if (event && event.start && event.end) {
        events.push(event);
      }
      event = null;
    } else if (event) {
      if (line.startsWith("DTSTART:")) {
        event.start = parseICalDate(line.replace("DTSTART:", "").trim());
      } else if (line.startsWith("DTEND:")) {
        event.end = parseICalDate(line.replace("DTEND:", "").trim());
      }
    }
  }

  const filteredEvents = events.filter((event) => {
    return event.start >= new Date(timeMin) && event.end <= new Date(timeMax);
  });

  return filteredEvents;
}

/**
 * Parses an iCal date string in the format 'YYYYMMDDTHHmmssZ' to a JavaScript Date object.
 * @param {string} icalDate - The iCal date string.
 * @returns {Date} - The parsed Date object.
 */
function parseICalDate(icalDate) {
  const year = icalDate.substring(0, 4);
  const month = icalDate.substring(4, 6) - 1;
  const day = icalDate.substring(6, 8);
  const hour = icalDate.substring(9, 11);
  const minute = icalDate.substring(11, 13);
  const second = icalDate.substring(13, 15);

  return new Date(Date.UTC(year, month, day, hour, minute, second));
}

(async () => {
  const result = await getBusyTimeIntervals(calendarId, timeMin, timeMax);
  console.log(`Busy intervals in calendar with Id = ${calendarId}: `);
  result.forEach((event) => {
    console.log(`${event.start} - ${event.end}`);
  });
})();
