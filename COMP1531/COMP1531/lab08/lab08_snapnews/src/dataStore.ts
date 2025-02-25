/**
 * Placeholder file for defining your data store
 * Feel free to add, edit, ignore or remove this file and create your own files if you wish.
 *
 * However, for Task 2, we recommend storing timer objects (from setTimeout) outside of your
 * dataStore. This is because timer objects are not JSON-serialisable, meaning they cannot
 * be returned from your server, and if you implement persistence in the form of JSON, they
 * cannot be written to a file. See src/snapnews.ts for further tips.
 */

export interface Announcement {
  announcementId: number;
  title: string;
  description: string;
  createdAt: number;
}

interface DataStore {
  announcements: Announcement[];
}

const dataStore: DataStore = {
  announcements: [],
};

export const getData = () => dataStore;
