/**
 * Datastore holding visitor events.
 * This has already been implemented for you.
 * You DO NOT need to modify this file.
 */

export interface VisitorEvent {
  eventId: number;
  visitorName: string;
  visitorAge: number;
  checkinTime: number;
  checkoutTime: number | null;
}

export interface ErrorObject {
  error: string;
}

export type EmptyObject = Record<never, never>;

interface DataStore {
  events: VisitorEvent[];
  // This number will increase when an event is created,
  // and is not affected by event deletions
  numEventsCreated: number;
}

const dataStore: DataStore = {
  events: [],
  numEventsCreated: 0,
};

export const getData = (): DataStore => dataStore;
