const { httpRequest, HttpError } = require("./helpers/http.js");

const API_KEY = "AIzaSyCXcCK8ilHCWr96R8sJTsNBgIn-l4DR7yc";
// const calendarId =
//   "a2f28b5b18eeaae6748d838abe646185d933079038ea1096c3e1c8149c06e883@group.calendar.google.com";
const calendarId = "fa6ggft0hja55o11f3gec5oaq0@group.calendar.google.com";
const timeMin = "2014-02-24T00:00:00Z";
const timeMax = "2025-10-31T23:59:59Z";

function splitTimeInterval(start, end) {
  const intervals = [];
  let currentStart = new Date(start);
  const endDate = new Date(end);

  if (
    currentStart >= endDate ||
    (currentStart.getMonth() === endDate.getMonth() &&
      currentStart.getFullYear() === endDate.getFullYear())
  ) {
    intervals.push({
      start: currentStart.toISOString(),
      end: endDate.toISOString(),
    });
    return intervals;
  }

  while (currentStart < endDate) {
    let currentEnd = new Date(currentStart);
    currentEnd.setMonth(currentEnd.getMonth() + 1);

    if (currentEnd > endDate) {
      currentEnd = endDate;
    }

    intervals.push({
      start: currentStart.toISOString(),
      end: currentEnd.toISOString(),
    });

    currentStart = currentEnd;
  }

  return intervals;
}

function createFreeBusyRequests(calendarId, intervals) {
  return intervals.map((interval) => {
    const requestBody = {
      timeMin: interval.start,
      timeMax: interval.end,
      items: [{ id: calendarId }],
    };

    return httpRequest(
      "POST",
      `https://www.googleapis.com/calendar/v3/freeBusy`,
      {
        headers: {
          "Content-Type": "application/json",
          "X-goog-api-key": API_KEY,
        },
        body: requestBody,
      }
    );
  });
}

function mergeIntervals(events) {
  if (events.length === 0) return [];

  // event are sorted by start date initially
  // events.sort((a, b) => a.start - b.start);

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

async function getBusyIntervals(calendarId, timeMin, timeMax) {
  const intervals = splitTimeInterval(timeMin, timeMax);
  const allRequests = createFreeBusyRequests(calendarId, intervals);
  let busyIntervals = [];

  // Process requests in batches of 12
  const batchSize = 12;
  for (let i = 0; i < allRequests.length; i += batchSize) {
    const batch = allRequests.slice(i, i + batchSize);
    const responses = await Promise.all(batch);
    for (const response of responses) {
      const errors = response.calendars?.[calendarId]?.errors ?? null;
      if (errors)
        throw new Error(
          `Computation error occured for ID ${calendarId} - ${JSON.stringify(
            errors,
            null,
            2
          )}`
        );
      const busy = response.calendars?.[calendarId]?.busy ?? [];
      busyIntervals.push(...busy);
    }
  }

  busyIntervals = mergeIntervals(busyIntervals);
  return busyIntervals;
}

function getFreeIntervals(busyIntervals, timeMin, timeMax) {
  if (busyIntervals.length === 0) {
    return [{ start: timeMin, end: timeMax }];
  }

  const freeIntervals = [];
  busyIntervals.sort((a, b) => new Date(a.start) - new Date(b.start));

  if (new Date(busyIntervals[0].start) > new Date(timeMin)) {
    freeIntervals.push({ start: timeMin, end: busyIntervals[0].start });
  }

  for (let i = 0; i < busyIntervals.length - 1; i++) {
    if (new Date(busyIntervals[i].end) < new Date(busyIntervals[i + 1].start)) {
      freeIntervals.push({
        start: busyIntervals[i].end,
        end: busyIntervals[i + 1].start,
      });
    }
  }

  if (
    new Date(busyIntervals[busyIntervals.length - 1].end) < new Date(timeMax)
  ) {
    freeIntervals.push({
      start: busyIntervals[busyIntervals.length - 1].end,
      end: timeMax,
    });
  }

  return freeIntervals;
}

(async () => {
  const busyIntervals = await getBusyIntervals(calendarId, timeMin, timeMax);
  console.log(
    "==================================================================================="
  );

  console.log(`[INFO] Found ${busyIntervals.length} busy intervals.`);
  console.log("[INFO] Busy Intervals:", busyIntervals);

  console.log(
    "==================================================================================="
  );
  const freeIntervals = getFreeIntervals(busyIntervals, timeMin, timeMax);
  console.log(`[INFO] Found ${freeIntervals.length} free intervals.`);
  console.log("[INFO] Free Intervals:", freeIntervals);
})();
