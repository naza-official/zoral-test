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
 * @returns {Promise<{busyIntervals: {start: Date, end: Date}[], freeIntervals: {start: Date, end: Date}[]}>}
 */
function getFreeBusyTimeIntervals(calendarId, timeMin, timeMax) {
  return fetchICalData(
    new URL(
      `https://calendar.google.com/calendar/ical/${calendarId}/public/basic.ics`
    )
  )
    .then((icalData) => {
      const { busyEvents, freeEvents } = parseICalData(
        icalData,
        timeMin,
        timeMax
      );
      const busyIntervals = mergeEvents(busyEvents);
      const freeIntervals = mergeEvents(freeEvents);
      return { busyIntervals, freeIntervals };
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
          reject(
            new Error(`Failed to fetch iCal data: ${response.statusCode}`)
          );
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

//O(n)
function parseICalData(icalData, timeMin, timeMax) {
  const busyEvents = [];
  const freeEvents = [];
  let isBusy = null;
  const lines = icalData.split("\n");

  let event = null;
  for (const line of lines) {
    if (line.startsWith("BEGIN:VEVENT")) {
      event = {};
      isBusy = null;
    } else if (line.startsWith("END:VEVENT")) {
      if (event && event.start && event.end) {
        if (isBusy) busyEvents.push(event);
        else freeEvents.push(event);
      }
      event = null;
    } else if (event) {
      if (line.startsWith("DTSTART:")) {
        event.start = parseICalDate(line.replace("DTSTART:", "").trim());
      } else if (line.startsWith("DTEND:")) {
        event.end = parseICalDate(line.replace("DTEND:", "").trim());
      } else if (line.startsWith("TRANSP:")) {
        isBusy = line.replace("TRANSP:", "").trim() === "OPAQUE";
      }
    }
  }

  const filteredEvents = (eventList) =>
    eventList.filter((event) => {
      return event.start >= new Date(timeMin) && event.end <= new Date(timeMax);
    });

  return {
    busyEvents: filteredEvents(busyEvents),
    freeEvents: filteredEvents(freeEvents),
  };
}

// O(nlogn) because of sorting
function mergeEvents(events) {
  if (events.length === 0) return [];

  // event are not sorted by start date initially - they will be written in the order they was registeres in the iCal file
  events.sort((a, b) => a.start - b.start);

  const mergedEvents = [];
  let currentEvent = events[0];

  for (let i = 1; i < events.length; i++) {
    const event = events[i];
    if (event.start <= currentEvent.end) {
      currentEvent.end = new Date(Math.max(currentEvent.end, event.end));
    } else {
      mergedEvents.push(currentEvent);
      currentEvent = event;
    }
  }

  mergedEvents.push(currentEvent);

  return mergedEvents;
}

/**
 * Helper parser of iCal date string in the format 'YYYYMMDDTHHmmssZ' to a JavaScript Date object.
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
  const { busyIntervals, freeIntervals } = await getFreeBusyTimeIntervals(
    calendarId,
    timeMin,
    timeMax
  );

  console.log(`Busy intervals in calendar with Id = ${calendarId}: `);
  busyIntervals.forEach((event) => {
    console.log(`${event.start} - ${event.end}`);
  });
  console.log("===================================================");
  console.log(`Free intervals in calendar with Id = ${calendarId}: `);
  freeIntervals.forEach((event) => {
    console.log(`${event.start} - ${event.end}`);
  });
})();
