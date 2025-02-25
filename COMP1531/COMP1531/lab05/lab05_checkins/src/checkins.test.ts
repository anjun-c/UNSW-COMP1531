/**
 * The test suite below uses raw requests to test your server
 *
 * One improvement could be to define helper/wrapper functions
 * to simplify and increase the reusability of your test code
 */

import request from 'sync-request-curl';
import { port, url } from './config.json';

const SERVER_URL = `${url}:${port}`;
const TIMEOUT_MS = 5 * 1000;

beforeEach(() => {
  request('DELETE', SERVER_URL + '/clear', { timeout: TIMEOUT_MS });
});

describe('DELETE /clear', () => {
  test('has the correct return type', () => {
    const res = request('DELETE', SERVER_URL + '/clear', { timeout: TIMEOUT_MS });
    expect(JSON.parse(res.body.toString())).toStrictEqual({});
  });
});

describe('POST /events/checkin', () => {
  test.each([
    { visitorName: '', visitorAge: 1 },
    { visitorName: 'valid', visitorAge: -1 },
  ])('error for visitorName="$visitorName", visitorAge=$visitorAge', ({ visitorName, visitorAge }) => {
    const res = request('POST', SERVER_URL + '/events/checkin', { json: { visitorName, visitorAge }, timeout: TIMEOUT_MS });
    expect(JSON.parse(res.body.toString())).toStrictEqual({ error: expect.any(String) });
    expect(res.statusCode).toStrictEqual(400);
  });

  test('has the correct return type', () => {
    const res = request('POST', SERVER_URL + '/events/checkin', { json: { visitorName: 'Tam', visitorAge: 23 }, timeout: TIMEOUT_MS });
    expect(JSON.parse(res.body.toString())).toStrictEqual({ eventId: expect.any(Number) });
  });
});

describe('GET /events/list', () => {
  test('error when minAge is negative', () => {
    const res = request('GET', SERVER_URL + '/events/list', { qs: { minAge: -1 }, timeout: TIMEOUT_MS });
    expect(JSON.parse(res.body.toString())).toStrictEqual({ error: expect.any(String) });
    expect(res.statusCode).toStrictEqual(400);
  });

  test('returns { events: [] } when no checkins has occurred', () => {
    const res = request('GET', SERVER_URL + '/events/list', { qs: { minAge: 0 }, timeout: TIMEOUT_MS });
    expect(JSON.parse(res.body.toString())).toStrictEqual({ events: [] });
  });

  test('correctly list one event', () => {
    const checkinRes = request('POST', SERVER_URL + '/events/checkin', { json: { visitorName: 'adrian', visitorAge: 23 }, timeout: TIMEOUT_MS });
    const event = JSON.parse(checkinRes.body.toString());
    const listRes = request('GET', SERVER_URL + '/events/list', { qs: { minAge: 0 }, timeout: TIMEOUT_MS });
    expect(JSON.parse(listRes.body.toString())).toStrictEqual({
      events: [
        {
          eventId: event.eventId,
          visitorName: 'adrian',
          visitorAge: 23,
          checkinTime: expect.any(Number),
          checkoutTime: null
        }
      ],
    });
  });

  test('correctly list multiple events', () => {
    const checkinRes1 = request('POST', SERVER_URL + '/events/checkin', { json: { visitorName: 'adrian', visitorAge: 23 }, timeout: TIMEOUT_MS });
    const event1 = JSON.parse(checkinRes1.body.toString());
    const checkinRes2 = request('POST', SERVER_URL + '/events/checkin', { json: { visitorName: 'makeen', visitorAge: 40 }, timeout: TIMEOUT_MS });
    const event2 = JSON.parse(checkinRes2.body.toString());
    const listRes = request('GET', SERVER_URL + '/events/list', { qs: { minAge: 0 }, timeout: TIMEOUT_MS });
    expect(JSON.parse(listRes.body.toString())).toStrictEqual({
      events: [
        {
          eventId: event1.eventId,
          visitorName: 'adrian',
          visitorAge: 23,
          checkinTime: expect.any(Number),
          checkoutTime: null
        },
        {
          eventId: event2.eventId,
          visitorName: 'makeen',
          visitorAge: 40,
          checkinTime: expect.any(Number),
          checkoutTime: null
        }
      ],
    });
  });

  test('correctly filter multiple events by minAge', () => {
    const checkinRes1 = request('POST', SERVER_URL + '/events/checkin', { json: { visitorName: 'adrian', visitorAge: 23 }, timeout: TIMEOUT_MS });
    const event1 = JSON.parse(checkinRes1.body.toString());
    const checkinRes2 = request('POST', SERVER_URL + '/events/checkin', { json: { visitorName: 'makeen', visitorAge: 40 }, timeout: TIMEOUT_MS });
    const event2 = JSON.parse(checkinRes2.body.toString());
    const listRes = request('GET', SERVER_URL + '/events/list', { qs: { minAge: 25 }, timeout: TIMEOUT_MS });
    expect(JSON.parse(listRes.body.toString())).toStrictEqual({
      events: [
        {
          eventId: event2.eventId,
          visitorName: 'makeen',
          visitorAge: 40,
          checkinTime: expect.any(Number),
          checkoutTime: null
        }
      ],
    });
  });
});

describe('POST /events/:eventid/checkout', () => {
  test('failed to checkout when no checkins has occurred', () => {
    const res = request('POST', SERVER_URL + '/events/0/checkout', { timeout: TIMEOUT_MS });
    expect(JSON.parse(res.body.toString())).toStrictEqual({ error: expect.any(String) });
    expect(res.statusCode).toStrictEqual(400);
  });

  describe('when a valid checkin exists', () => {
    let event: { eventId: number };
    beforeEach(() => {
      const res = request('POST', SERVER_URL + '/events/checkin', { json: { visitorName: 'Tam', visitorAge: 23 }, timeout: TIMEOUT_MS });
      event = JSON.parse(res.body.toString());
    });

    test('error when checkout with an invalid id', () => {
      const res = request('POST', SERVER_URL + `/events/${event.eventId + 1}/checkout`, { timeout: TIMEOUT_MS });
      expect(JSON.parse(res.body.toString())).toStrictEqual({ error: expect.any(String) });
      expect(res.statusCode).toStrictEqual(400);
    });

    test('checkout has correct return type', () => {
      const res = request('POST', SERVER_URL + `/events/${event.eventId}/checkout`, { timeout: TIMEOUT_MS });
      expect(JSON.parse(res.body.toString())).toStrictEqual({});
      expect(res.statusCode).toStrictEqual(200);
    });

    test('checkout updates timestamp', () => {
      const listRes1 = request('GET', SERVER_URL + '/events/list', { qs: { minAge: 23 }, timeout: TIMEOUT_MS });
      expect(JSON.parse(listRes1.body.toString())).toStrictEqual({
        events: [
          {
            eventId: event.eventId,
            visitorName: 'Tam',
            visitorAge: 23,
            checkinTime: expect.any(Number),
            checkoutTime: null
          },
        ]
      });
      request('POST', SERVER_URL + `/events/${event.eventId}/checkout`, { timeout: TIMEOUT_MS });
      const listRes2 = request('GET', SERVER_URL + '/events/list', { qs: { minAge: 23 }, timeout: TIMEOUT_MS });
      expect(JSON.parse(listRes2.body.toString())).toStrictEqual({
        events: [
          {
            eventId: event.eventId,
            visitorName: 'Tam',
            visitorAge: 23,
            checkinTime: expect.any(Number),
            checkoutTime: expect.any(Number),
          },
        ]
      });
    });

    test('checkout twice results in 400 error', () => {
      request('POST', SERVER_URL + `/events/${event.eventId}/checkout`, { timeout: TIMEOUT_MS });
      const res = request('POST', SERVER_URL + `/events/${event.eventId}/checkout`, { timeout: TIMEOUT_MS });
      expect(JSON.parse(res.body.toString())).toStrictEqual({ error: expect.any(String) });
      expect(res.statusCode).toStrictEqual(400);
    });
  });
});

describe('PUT /events/:eventid', () => {
  test('failed to edit when no checkins has occurred', () => {
    const res = request('PUT', SERVER_URL + '/events/0', { json: { visitorName: 'edit', visitorAge: 999 }, timeout: TIMEOUT_MS });
    expect(JSON.parse(res.body.toString())).toStrictEqual({ error: expect.any(String) });
    expect(res.statusCode).toStrictEqual(400);
  });

  describe('when a valid checkin exists', () => {
    let event: { eventId: number };
    beforeEach(() => {
      const res = request('POST', SERVER_URL + '/events/checkin', { json: { visitorName: 'Tam', visitorAge: 23 }, timeout: TIMEOUT_MS });
      event = JSON.parse(res.body.toString());
    });

    test.each([
      { visitorName: '', visitorAge: 1 },
      { visitorName: 'valid', visitorAge: -1 },
    ])('error updating visitorName="$visitorName", visitorAge=$visitorAge', ({ visitorName, visitorAge }) => {
      const res = request('PUT', SERVER_URL + `/events/${event.eventId}`, { json: { visitorName, visitorAge }, timeout: TIMEOUT_MS });
      expect(JSON.parse(res.body.toString())).toStrictEqual({ error: expect.any(String) });
      expect(res.statusCode).toStrictEqual(400);
    });

    test('error when editing with an invalid id', () => {
      const res = request('PUT', SERVER_URL + `/events/${event.eventId + 1}`, { json: { visitorName: 'Edited', visitorAge: 999 }, timeout: TIMEOUT_MS });
      expect(JSON.parse(res.body.toString())).toStrictEqual({ error: expect.any(String) });
      expect(res.statusCode).toStrictEqual(400);
    });

    test('editing has correct return type', () => {
      const res = request('PUT', SERVER_URL + `/events/${event.eventId}`, { json: { visitorName: 'edit', visitorAge: 999 }, timeout: TIMEOUT_MS });
      expect(JSON.parse(res.body.toString())).toStrictEqual({ });
      expect(res.statusCode).toStrictEqual(200);
    });

    test('editing correctly changes values (side effects)', () => {
      const listRes1 = request('GET', SERVER_URL + '/events/list', { qs: { minAge: 23 }, timeout: TIMEOUT_MS });
      expect(JSON.parse(listRes1.body.toString())).toStrictEqual({
        events: [
          {
            eventId: event.eventId,
            visitorName: 'Tam',
            visitorAge: 23,
            checkinTime: expect.any(Number),
            checkoutTime: null
          },
        ]
      });
      request('PUT', SERVER_URL + `/events/${event.eventId}`, { json: { visitorName: 'Edited', visitorAge: 999 }, timeout: TIMEOUT_MS });
      const listRes2 = request('GET', SERVER_URL + '/events/list', { qs: { minAge: 23 }, timeout: TIMEOUT_MS });
      expect(JSON.parse(listRes2.body.toString())).toStrictEqual({
        events: [
          {
            eventId: event.eventId,
            visitorName: 'Edited',
            visitorAge: 999,
            checkinTime: expect.any(Number),
            checkoutTime: null,
          },
        ]
      });
    });
  });
});

describe('DELETE /events/:eventid', () => {
  test('failed to delete when no checkins has occurred', () => {
    const res = request('DELETE', SERVER_URL + '/events/0', { timeout: TIMEOUT_MS });
    expect(JSON.parse(res.body.toString())).toStrictEqual({ error: expect.any(String) });
    expect(res.statusCode).toStrictEqual(400);
  });

  describe('when a valid checkin exists', () => {
    let event: { eventId: number };
    beforeEach(() => {
      const res = request('POST', SERVER_URL + '/events/checkin', { json: { visitorName: 'Tam', visitorAge: 23 }, timeout: TIMEOUT_MS });
      event = JSON.parse(res.body.toString());
    });

    test('error when deleting with an invalid id', () => {
      const res = request('DELETE', SERVER_URL + '/events/999', { timeout: TIMEOUT_MS });
      expect(JSON.parse(res.body.toString())).toStrictEqual({ error: expect.any(String) });
      expect(res.statusCode).toStrictEqual(400);
    });

    test('deleting has correct return type', () => {
      const res = request('DELETE', SERVER_URL + `/events/${event.eventId}`, { timeout: TIMEOUT_MS });
      expect(JSON.parse(res.body.toString())).toStrictEqual({});
    });

    test('deleted events will not appear in GET /events/list', () => {
      request('DELETE', SERVER_URL + `/events/${event.eventId}`, { timeout: TIMEOUT_MS });
      const res = request('GET', SERVER_URL + '/events/list', { qs: { minAge: 0 }, timeout: TIMEOUT_MS });
      expect(JSON.parse(res.body.toString())).toStrictEqual({ events: [] });
    });

    test('deleted events will not have their IDs re-used', () => {
      request('DELETE', SERVER_URL + `/events/${event.eventId}`, { timeout: TIMEOUT_MS });
      const res = request('POST', SERVER_URL + '/events/checkin', { json: { visitorName: 'Tam', visitorAge: 23 }, timeout: TIMEOUT_MS });
      const newEvent = JSON.parse(res.body.toString());
      expect(newEvent).toStrictEqual({ eventId: expect.any(Number) });
      expect(newEvent.eventId).not.toStrictEqual(event.eventId);
    });
  });
});
