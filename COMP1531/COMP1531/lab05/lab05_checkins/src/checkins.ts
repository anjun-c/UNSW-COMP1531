/**
 * The backend implementation below has already been completed for you.
 * You DO NOT need to make any modifications to the code below.
 */

import { EmptyObject, ErrorObject, VisitorEvent, getData } from './dataStore';

const generateTimestamp = () => Math.floor(Date.now() / 1000);

export const clear = (): EmptyObject => {
  const data = getData();
  data.events = [];
  data.numEventsCreated = 0;
  return {};
};

export const checkinVisitorEvent = (visitorName: string, visitorAge: number): { eventId: number } | ErrorObject => {
  const data = getData();
  if (!visitorName) {
    return { error: 'Visitor name not given' };
  }
  if (!(visitorAge >= 0)) {
    return { error: 'Age must be 0 or greater.' };
  }

  const eventId = ++data.numEventsCreated;
  const event: VisitorEvent = {
    eventId,
    visitorName,
    visitorAge,
    checkinTime: generateTimestamp(),
    checkoutTime: null,
  };
  data.events.push(event);
  return { eventId };
};

export const listVisitorEvents = (minAge: number): { events: VisitorEvent[] } | ErrorObject => {
  if (!(minAge >= 0)) {
    return { error: 'Min age must be 0 or greater' };
  }
  const events = getData().events.filter((e) => e.visitorAge >= minAge);
  return { events };
};

export const checkoutVisitorEvent = (eventId: number): EmptyObject | ErrorObject => {
  const data = getData();
  const event = data.events.find((e) => e.eventId === eventId);
  if (!event) {
    return { error: `No such event with id: ${eventId}` };
  }
  if (event.checkoutTime) {
    return { error: `You have already checked out from the event with id: ${eventId}` };
  }
  event.checkoutTime = generateTimestamp();
  return {};
};

export const updateVisitorEvent = (eventId: number, visitorName: string, visitorAge: number): EmptyObject | ErrorObject => {
  if (!visitorName) {
    return { error: 'New visitor name must be given' };
  }
  if (!(visitorAge >= 0)) {
    return { error: 'New age must be 0 or greater.' };
  }

  const data = getData();
  const event = data.events.find((e) => e.eventId === eventId);
  if (!event) {
    return { error: `No such event with id: ${eventId}` };
  }
  event.visitorName = visitorName;
  event.visitorAge = visitorAge;
  return {};
};

export const deleteVisitorEvent = (eventId: number): EmptyObject | ErrorObject => {
  const data = getData();
  let hasEventToDelete = false;
  data.events = data.events.filter((e) => {
    if (e.eventId === eventId) {
      hasEventToDelete = true;
      return false;
    }
    return true;
  });

  if (!hasEventToDelete) {
    return { error: `No such event with id: ${eventId}` };
  }
  return {};
};
