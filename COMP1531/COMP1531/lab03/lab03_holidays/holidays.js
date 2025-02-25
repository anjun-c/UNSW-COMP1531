import { format } from 'date-fns';
// TODO: add more imports here
import { getValentinesDay } from 'date-fns-holiday-us';
import { getChristmas } from 'date-fns-holiday-us';
import { getEaster } from 'date-fns-holiday-us';
import promptSync from 'prompt-sync';

/**
 * Given a starting year and an ending year:
 * - If `start` is not at least 325, return an empty array.
 * - If `start` is strictly greater than `end`, return an empty array.
 * - Otherwise, return an array of objects containing information about the valentine,
 * easter and christmas date strings in the given (inclusive) range.
 *
 * An example format for christmas in 1970 is
 * - Friday, 25.12.1970
 *
 * @param {number} start - starting year, inclusive
 * @param {number} end - ending year, inclusive
 * @returns {Array<{valentinesDay: string, easter: string, christmas: string}>}
 */
export function holidaysInRange(start, end) {
  if (start < 325 || start > end) {
    return [];
  }
  const holidays = [];
  for (let year = start; year <= end; year++) {
    const valentinesDay = format(getValentinesDay(year), 'eeee, dd.MM.yyyy');
    const easter = format(getEaster(year), 'eeee, dd.MM.yyyy');
    const christmas = format(getChristmas(year), 'eeee, dd.MM.yyyy');
    holidays.push({ valentinesDay, easter, christmas });
  }
  return holidays;
}

/**
 * TODO: Implement the two lines in the "main" function below.
 * This function is imported and called in main.js
 */
export function main() {
  const prompt = promptSync();
  const start = parseInt(prompt('Enter start: '));
  const end = parseInt(prompt('Enter end: '));
  const holidays = holidaysInRange(start, end);
  console.log(holidays);
}


/**
 * Do not call the main function in this file - it is already imported
 * and called in main.js. Please revisit the specificaiton about this.
 */