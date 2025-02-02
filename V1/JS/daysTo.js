// Extend JS Date object with a method daysTo() which returns number of complete days between
// any pair of JS date objects: d1.daysTo(d2) should return quantity of complete days from d1 to
// d2.

Date.prototype.daysTo = function (otherDate) {
  if (!(otherDate instanceof Date)) {
    throw new TypeError("The argument must be an instance of Date");
  }
  const timeDifference = this - otherDate;
  let daysDifference = 0;
  if (timeDifference > 0) {
    daysDifference = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
  } else {
    daysDifference = Math.ceil(timeDifference / (1000 * 60 * 60 * 24));
  }

  return daysDifference;
};

// const d = new Date("275760-09-13");
// console.log(d.getTime());

// Edge cases:
// - different time zones: getTime parses to UTC by default
// - d1 > d2 => as amount of days can not be negative number abs is used

// range
// 8,640,000,000,000,000 milliseconds to either side of 01 January, 1970 UTC
// const d1 = new Date("1970-01-01");
// const d2 = new Date("275760-09-13");
const d2 = new Date("2025-01-01:10:00:00");
const d1 = new Date("2025-01-02");
console.log(d2.daysTo(d1));
