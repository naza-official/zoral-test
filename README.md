## Object Projection

_./V2/projection.js_

```bash
npm run v2:js:projection
```

### Concerns and edge cases

> [!NOTE] Task
> Develop a program “Object Projection”. Input: any JSON object; **prototype object**. Output: projected object. Projected object structure shall be intersection of source object and prototype object structures. Values of properties in projected object shall be the same as values of respective properties in source object.

- В умові чітко не вказано чи буде являтись прототип JSON object-ом.
- Якщо прототип не JSON object, то додаються вимоги на обробку: - циклічних структур (реалізовано в поточній версії) - non-plain objects - non-enumerable properties - JS Symbol (не серіалізується в JSON - не значимо в нашому випадку)
  які випадки з цього покривати питання відкрите.

## Google Calendar API

_./V2/freeBusyAPI.js_

```bash
npm run v2:api:freeBusy
```

**Input:**

```javascript
const calendarId = "fa6ggft0hja55o11f3gec5oaq0@group.calendar.google.com";

const timeMin = "2014-02-24T00:00:00Z";

const timeMax = "2025-10-31T23:59:59Z";
```

**Output:**

```bash
[INFO] Found 25 busy intervals.
[INFO] Busy Intervals: [
  { start: '2018-10-09T23:00:00Z', end: '2018-10-10T00:30:00Z' },
  { start: '2018-10-10T01:00:00Z', end: '2018-10-10T05:45:00Z' },
  { start: '2018-10-10T06:00:00Z', end: '2018-10-10T15:00:00Z' },
  { start: '2018-10-29T10:00:00Z', end: '2018-10-29T11:00:00Z' },
  { start: '2018-11-02T14:30:00Z', end: '2018-11-02T21:45:00Z' },
  { start: '2020-03-11T11:00:00Z', end: '2020-03-11T12:00:00Z' },
  { start: '2020-03-11T13:00:00Z', end: '2020-03-11T14:00:00Z' },
  { start: '2020-03-13T12:00:00Z', end: '2020-03-13T13:00:00Z' },
  { start: '2020-10-05T07:00:00Z', end: '2020-10-05T08:00:00Z' },
  { start: '2020-10-05T13:00:00Z', end: '2020-10-05T14:00:00Z' },
  { start: '2020-10-06T09:15:00Z', end: '2020-10-06T11:30:00Z' },
  { start: '2021-03-23T15:30:00Z', end: '2021-03-23T16:30:00Z' },
  { start: '2021-03-29T15:30:00Z', end: '2021-03-29T17:00:00Z' },
  { start: '2021-05-26T08:00:00Z', end: '2021-05-26T09:00:00Z' },
  { start: '2021-10-15T10:30:00Z', end: '2021-10-15T11:30:00Z' },
  { start: '2021-11-15T10:00:00Z', end: '2021-11-15T15:00:00Z' },
  { start: '2022-05-03T09:00:00Z', end: '2022-05-03T10:00:00Z' },
  { start: '2023-01-20T12:00:00Z', end: '2023-01-20T15:00:00Z' },
  { start: '2023-01-24T12:00:00Z', end: '2023-01-24T16:30:00Z' },
  { start: '2023-01-24T21:30:00Z', end: '2023-01-25T04:00:00Z' },
  { start: '2023-03-29T07:30:00Z', end: '2023-03-29T11:00:00Z' },
  { start: '2023-04-06T08:30:00Z', end: '2023-04-06T12:30:00Z' },
  { start: '2023-04-20T08:30:00Z', end: '2023-04-20T12:30:00Z' },
  { start: '2023-06-14T08:00:00Z', end: '2023-06-14T11:00:00Z' },
  { start: '2024-02-13T09:30:00Z', end: '2024-02-13T12:00:00Z' }
]
===================================================================================
[INFO] Found 26 free intervals.
[INFO] Free Intervals: [
  { start: '2014-02-24T00:00:00Z', end: '2018-10-09T23:00:00Z' },
  { start: '2018-10-10T00:30:00Z', end: '2018-10-10T01:00:00Z' },
  { start: '2018-10-10T05:45:00Z', end: '2018-10-10T06:00:00Z' },
  { start: '2018-10-10T15:00:00Z', end: '2018-10-29T10:00:00Z' },
  { start: '2018-10-29T11:00:00Z', end: '2018-11-02T14:30:00Z' },
  { start: '2018-11-02T21:45:00Z', end: '2020-03-11T11:00:00Z' },
  { start: '2020-03-11T12:00:00Z', end: '2020-03-11T13:00:00Z' },
  { start: '2020-03-11T14:00:00Z', end: '2020-03-13T12:00:00Z' },
  { start: '2020-03-13T13:00:00Z', end: '2020-10-05T07:00:00Z' },
  { start: '2020-10-05T08:00:00Z', end: '2020-10-05T13:00:00Z' },
  { start: '2020-10-05T14:00:00Z', end: '2020-10-06T09:15:00Z' },
  { start: '2020-10-06T11:30:00Z', end: '2021-03-23T15:30:00Z' },
  { start: '2021-03-23T16:30:00Z', end: '2021-03-29T15:30:00Z' },
  { start: '2021-03-29T17:00:00Z', end: '2021-05-26T08:00:00Z' },
  { start: '2021-05-26T09:00:00Z', end: '2021-10-15T10:30:00Z' },
  { start: '2021-10-15T11:30:00Z', end: '2021-11-15T10:00:00Z' },
  { start: '2021-11-15T15:00:00Z', end: '2022-05-03T09:00:00Z' },
  { start: '2022-05-03T10:00:00Z', end: '2023-01-20T12:00:00Z' },
  { start: '2023-01-20T15:00:00Z', end: '2023-01-24T12:00:00Z' },
  { start: '2023-01-24T16:30:00Z', end: '2023-01-24T21:30:00Z' },
  { start: '2023-01-25T04:00:00Z', end: '2023-03-29T07:30:00Z' },
  { start: '2023-03-29T11:00:00Z', end: '2023-04-06T08:30:00Z' },
  { start: '2023-04-06T12:30:00Z', end: '2023-04-20T08:30:00Z' },
  { start: '2023-04-20T12:30:00Z', end: '2023-06-14T08:00:00Z' },
  { start: '2023-06-14T11:00:00Z', end: '2024-02-13T09:30:00Z' },
  { start: '2024-02-13T12:00:00Z', end: '2025-10-31T23:59:59Z' }
]
```
