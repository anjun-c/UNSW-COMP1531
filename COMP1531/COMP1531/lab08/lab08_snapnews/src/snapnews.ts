/**
 * Placeholder file for defining your feature functions
 * Feel free to add, edit, ignore or remove this file and create your own files if you wish.
 */
import { checkAuthToken } from './auth';
import { Announcement, getData } from './dataStore';

// ========================================================================= //

/*
TASK 2: Suggestion

We recommend keeping track of the scheduled deletion for each timer as a global
object in memory, or as a map, below this multiline comment.

Example object:
- properties are announcementIds
- values are timers returned from setTimeout
```
const announcementIdToTimerObject: Record<number, ReturnType<typeof setTimeout>> = {};
```

Please see the specification (README.md) for further advise on using setTimeout
and clearTimeout.
*/

// TODO: add your object/map to link an announcementId to a timer from setTimeout:
// ...

// ========================================================================= //

/**
 * Reset the application to the initial state
 *
 * @returns {Record<never, never>}
 */
export const clear = (): Record<never, never> => {
  getData().announcements = [];

  // Task 2 TODO:
  // [IMPORTANT]: If you are using setTimeout, you must clear all existing timers.
  // One side effect of not clearing timeouts is that the result of a previous test
  // could affect the next test (due to any timer/delays from setTimeout)
  return {};
};

/**
 * Create a new, active announcement
 *
 * @param {string} title
 * @param {string} description
 * @returns
 */
export const createAnnouncement = (title: string, description: string) => {
  if (!title) {
    throw new Error('Error: invalid title');
  }
  if (!description) {
    throw new Error('Error: invalid description');
  }

  const data = getData();
  const announcementId = data.announcements.length;

  data.announcements.push({
    announcementId,
    title,
    description,
    createdAt: Math.floor(Date.now() / 1000),
  });

  return { announcementId };
};

/**
 * Delete the announcement corresponding to the given ID.
 *
 * @param {number} announcementId
 * @returns {Record<never, never>}
 */
export const deleteAnnouncement = (announcementId: number): Record<never, never> => {
  let foundAnnouncementToDelete = false;
  getData().announcements = getData().announcements.filter((a) => {
    if (a.announcementId === announcementId) {
      foundAnnouncementToDelete = true;
      return false;
    }
    return true;
  });
  if (!foundAnnouncementToDelete) {
    throw new Error(`No such announcement with id: ${announcementId}`);
  }
  return {};
};

/**
 * List all available announcements
 *
 * @returns {{ announcements: Announcement[] }}
 */
export const listAnnouncements = (): { announcements: Announcement[] } => {
  return { announcements: getData().announcements };
};

// ========================================================================= //
/**
 * Schedule Routes
 * ---
 * You may use the functions below, remove them and write new ones, etc.
 * Functions are considered black-boxed in the tests - we only care about
 * whether your routes (in server.ts) has the output.
 */

/**
 * Schedule an announcement for removal
 *
 * @param {number} announcementId
 * @param {number} secondsFromNow
 * @returns {Record<never, never>}
 */
export const scheduleDeleteAnnouncement = (announcementId: number, secondsFromNow: number): Record<never, never> => {
  if (secondsFromNow < 0) {
    throw new Error('secondsFromNow must be a positive integer');
  }
  const data = getData();
  const announcement = data.announcements.find((a) => a.announcementId === announcementId);
  if (!announcementId) {
    throw new Error(`No such announcement with id: ${announcementId}`);
  }
  
};

/**
 * Abort any scheduled announcements for removal
 *
 * @param {number} announcementId
 * @returns {Record<never, never>}
 */
export const abortScheduleDeleteAnnouncement = (announcementId: number) => {
  return { error: 'Not implemented', hint: 'You may need to implement this in Task 2' };
};
