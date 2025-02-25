test.todo('Remove this test and uncomment the test suite below.');

// TIP: since some routes are not implemented in the starter code, you should use
// describe.only or test.only to only run specific tests instead of everything at
// the same time.

/*

import sleepSync from 'slync';
import request from 'sync-request-curl';
import { port, url } from './config.json';

const SERVER_URL = `${url}:${port}`;

const lab08snapnewstoken = 'LAB08_SNAPNEWS_TOKEN_SECRET';
const TIMEOUT_MS = 5 * 1000;

beforeEach(() => {
  request('DELETE', SERVER_URL + '/v1/clear', {});
});

describe('GET /', () => {
  test('has the correct return type', () => {
    const res = request('GET', SERVER_URL + '/', { timeout: TIMEOUT_MS });
    expect(JSON.parse(res.body.toString())).toStrictEqual({ message: expect.any(String) });
  });

  test('404 when wrong method', () => {
    const res = request('POST', SERVER_URL + '/', { timeout: TIMEOUT_MS });
    expect(JSON.parse(res.body.toString())).toStrictEqual({ error: expect.any(String) });
  });
});

describe('DELETE /v1/clear', () => {
  test('has the correct return type', () => {
    const res = request('DELETE', SERVER_URL + '/v1/clear', { timeout: TIMEOUT_MS });
    expect(JSON.parse(res.body.toString())).toStrictEqual({});
  });
});

// ========================================================================= //
// Tests for /v1/
// ========================================================================= //

describe('POST /v1/announcements/create', () => {
  test.each([
    { title: 'valid', description: '' },
    { title: '', description: 'valid' },
    { title: '', description: '' },
  ])('400 for invalid announcement inputs where title="$title" and description="$description"', ({ title, description }) => {
    const res = request('POST', SERVER_URL + '/v1/announcements/create', { json: { title, description, lab08snapnewstoken }, timeout: TIMEOUT_MS });
    expect(JSON.parse(res.body.toString())).toStrictEqual({ error: expect.any(String) });
    expect(res.statusCode).toStrictEqual(400);
  });

  test('401 for invalid token', () => {
    const res = request('POST', SERVER_URL + '/v1/announcements/create', { json: { title: 'valid', description: 'valid', lab08snapnewstoken: 'invalid' }, timeout: TIMEOUT_MS });
    expect(JSON.parse(res.body.toString())).toStrictEqual({ error: expect.any(String) });
    expect(res.statusCode).toStrictEqual(401);
  });

  test('has the correct return type', () => {
    const res = request('POST', SERVER_URL + '/v1/announcements/create', { json: { title: 'hello', description: 'world', lab08snapnewstoken }, timeout: TIMEOUT_MS });
    expect(JSON.parse(res.body.toString())).toStrictEqual({ announcementId: expect.any(Number) });
    expect(res.statusCode).toStrictEqual(200);
  });

  test('two announcements with the same details have different IDs', () => {
    const res1 = request('POST', SERVER_URL + '/v1/announcements/create', { json: { title: 'hello', description: 'world', lab08snapnewstoken }, timeout: TIMEOUT_MS });
    const res2 = request('POST', SERVER_URL + '/v1/announcements/create', { json: { title: 'hello', description: 'world', lab08snapnewstoken }, timeout: TIMEOUT_MS });
    const a1 = JSON.parse(res1.body.toString());
    const a2 = JSON.parse(res2.body.toString());
    expect(a1).toStrictEqual({ announcementId: expect.any(Number) });
    expect(a2).toStrictEqual({ announcementId: expect.any(Number) });
    expect(a1.announcementId).not.toStrictEqual(a2.announcementId);
  });
});

describe('GET /v1/announcements/list', () => {
  test('401 for invalid token', () => {
    const res = request('GET', SERVER_URL + '/v1/announcements/list', { qs: { lab08snapnewstoken: 'invalid' }, timeout: TIMEOUT_MS });
    expect(JSON.parse(res.body.toString())).toStrictEqual({ error: expect.any(String) });
    expect(res.statusCode).toStrictEqual(401);
  });

  test('Listing is empty', () => {
    const res = request('GET', SERVER_URL + '/v1/announcements/list', { qs: { lab08snapnewstoken }, timeout: TIMEOUT_MS });
    expect(JSON.parse(res.body.toString())).toStrictEqual({ announcements: [] });
    expect(res.statusCode).toStrictEqual(200);
  });

  test('Correctly list one item', () => {
    const expectedTimestamp = Math.floor(Date.now() / 1000);
    const createRes = request('POST', SERVER_URL + '/v1/announcements/create', { json: { title: 'hello', description: 'world', lab08snapnewstoken }, timeout: TIMEOUT_MS });
    const announcement = JSON.parse(createRes.body.toString());
    const listRes = request('GET', SERVER_URL + '/v1/announcements/list', { qs: { lab08snapnewstoken }, timeout: TIMEOUT_MS });
    const announcementList = JSON.parse(listRes.body.toString());
    expect(announcementList).toStrictEqual({
      announcements: [
        {
          announcementId: announcement.announcementId,
          title: 'hello',
          description: 'world',
          createdAt: expect.any(Number),
        }
      ]
    });
    // checking timestamp, accounting for potential network delays
    const createdAt = announcementList.announcements[0].createdAt;
    expect(createdAt).toBeGreaterThanOrEqual(expectedTimestamp);
    expect(createdAt).toBeLessThanOrEqual(expectedTimestamp + 2);
  });

  test('Correctly list multiple items', () => {
    const createRes1 = request('POST', SERVER_URL + '/v1/announcements/create', { json: { title: 't1', description: 'd1', lab08snapnewstoken }, timeout: TIMEOUT_MS });
    const createRes2 = request('POST', SERVER_URL + '/v1/announcements/create', { json: { title: 't2', description: 'd2', lab08snapnewstoken }, timeout: TIMEOUT_MS });
    const createRes3 = request('POST', SERVER_URL + '/v1/announcements/create', { json: { title: 't3', description: 'd3', lab08snapnewstoken }, timeout: TIMEOUT_MS });
    const a1 = JSON.parse(createRes1.body.toString());
    const a2 = JSON.parse(createRes2.body.toString());
    const a3 = JSON.parse(createRes3.body.toString());
    const listRes = request('GET', SERVER_URL + '/v1/announcements/list', { qs: { lab08snapnewstoken }, timeout: TIMEOUT_MS });
    expect(JSON.parse(listRes.body.toString())).toStrictEqual({
      announcements: [
        {
          announcementId: a1.announcementId,
          title: 't1',
          description: 'd1',
          createdAt: expect.any(Number),
        },
        {
          announcementId: a2.announcementId,
          title: 't2',
          description: 'd2',
          createdAt: expect.any(Number),
        },
        {
          announcementId: a3.announcementId,
          title: 't3',
          description: 'd3',
          createdAt: expect.any(Number),
        },
      ],
    });
  });
});

describe('DELETE /v1/announcements/:announcementid', () => {
  test('400 attempting to delete when no announcement has been created', () => {
    const deleteRes = request('DELETE', SERVER_URL + '/v1/announcements/0', { qs: { lab08snapnewstoken }, timeout: TIMEOUT_MS });
    expect(JSON.parse(deleteRes.body.toString())).toStrictEqual({ error: expect.any(String) });
    expect(deleteRes.statusCode).toStrictEqual(400);
  });

  describe('when one announcement exists', () => {
    let announcement: { announcementId: number };
    beforeEach(() => {
      const res = request('POST', SERVER_URL + '/v1/announcements/create', { json: { title: 'hello', description: 'world', lab08snapnewstoken }, timeout: TIMEOUT_MS });
      expect(res.statusCode).toStrictEqual(200);
      announcement = JSON.parse(res.body.toString());
      expect(announcement).toStrictEqual({ announcementId: expect.any(Number) });
    });

    test('401 attempting to delete an announcement using an invalid token', () => {
      const deleteRes = request('DELETE', SERVER_URL + `/v1/announcements/${announcement.announcementId}`, { qs: { lab08snapnewstoken: 'invalid' }, timeout: TIMEOUT_MS });
      expect(JSON.parse(deleteRes.body.toString())).toStrictEqual({ error: expect.any(String) });
      expect(deleteRes.statusCode).toStrictEqual(401);
    });

    test('400 attempting to delete an invalid announcement', () => {
      const deleteRes = request('DELETE', SERVER_URL + `/v1/announcements/${announcement.announcementId + 1}`, { qs: { lab08snapnewstoken }, timeout: TIMEOUT_MS });
      expect(JSON.parse(deleteRes.body.toString())).toStrictEqual({ error: expect.any(String) });
      expect(deleteRes.statusCode).toStrictEqual(400);
    });

    test('correct return type', () => {
      const deleteRes = request('DELETE', SERVER_URL + `/v1/announcements/${announcement.announcementId}`, { qs: { lab08snapnewstoken }, timeout: TIMEOUT_MS });
      expect(JSON.parse(deleteRes.body.toString())).toStrictEqual({});
      expect(deleteRes.statusCode).toStrictEqual(200);
    });

    test('correct side-effect when listing', () => {
      const listBeforeDeleteRes = request('GET', SERVER_URL + '/v1/announcements/list', { qs: { lab08snapnewstoken }, timeout: TIMEOUT_MS });
      expect(JSON.parse(listBeforeDeleteRes.body.toString())).toStrictEqual({
        announcements: [
          {
            announcementId: announcement.announcementId,
            title: 'hello',
            description: 'world',
            createdAt: expect.any(Number),
          }
        ]
      });
      const deleteRes = request('DELETE', SERVER_URL + `/v1/announcements/${announcement.announcementId}`, { qs: { lab08snapnewstoken }, timeout: TIMEOUT_MS });
      expect(JSON.parse(deleteRes.body.toString())).toStrictEqual({});
      expect(deleteRes.statusCode).toStrictEqual(200);
      const listAfterDeleteRes = request('GET', SERVER_URL + '/v1/announcements/list', { qs: { lab08snapnewstoken }, timeout: TIMEOUT_MS });
      expect(JSON.parse(listAfterDeleteRes.body.toString())).toStrictEqual({ announcements: [] });
    });
  });
});

// ========================================================================= //
// Tests for /v2/
// ========================================================================= //

describe('POST /v2/announcements/create', () => {
  test.each([
    { title: 'valid', description: '' },
    { title: '', description: 'valid' },
    { title: '', description: '' },
  ])('400 for invalid announcement inputs where title="$title" and description="$description"', ({ title, description }) => {
    const res = request('POST', SERVER_URL + '/v2/announcements/create', { json: { title, description }, headers: { lab08snapnewstoken }, timeout: TIMEOUT_MS });
    expect(JSON.parse(res.body.toString())).toStrictEqual({ error: expect.any(String) });
    expect(res.statusCode).toStrictEqual(400);
  });

  test('401 for invalid token', () => {
    const res = request('POST', SERVER_URL + '/v2/announcements/create', { json: { title: 'valid', description: 'valid' }, headers: { lab08snapnewstoken: 'invalid' }, timeout: TIMEOUT_MS });
    expect(JSON.parse(res.body.toString())).toStrictEqual({ error: expect.any(String) });
    expect(res.statusCode).toStrictEqual(401);
  });

  test('has the correct return type', () => {
    const res = request('POST', SERVER_URL + '/v2/announcements/create', { json: { title: 'hello', description: 'world' }, headers: { lab08snapnewstoken }, timeout: TIMEOUT_MS });
    expect(JSON.parse(res.body.toString())).toStrictEqual({ announcementId: expect.any(Number) });
    expect(res.statusCode).toStrictEqual(200);
  });

  test('two announcements with the same details have different IDs', () => {
    const res1 = request('POST', SERVER_URL + '/v2/announcements/create', { json: { title: 'hello', description: 'world' }, headers: { lab08snapnewstoken }, timeout: TIMEOUT_MS });
    const res2 = request('POST', SERVER_URL + '/v2/announcements/create', { json: { title: 'hello', description: 'world' }, headers: { lab08snapnewstoken }, timeout: TIMEOUT_MS });
    const a1 = JSON.parse(res1.body.toString());
    const a2 = JSON.parse(res2.body.toString());
    expect(a1).toStrictEqual({ announcementId: expect.any(Number) });
    expect(a2).toStrictEqual({ announcementId: expect.any(Number) });
    expect(a1.announcementId).not.toStrictEqual(a2.announcementId);
  });
});

describe('GET /v2/announcements/list', () => {
  test('401 for invalid token', () => {
    const res = request('GET', SERVER_URL + '/v2/announcements/list', { headers: { lab08snapnewstoken: 'invalid' }, timeout: TIMEOUT_MS });
    expect(JSON.parse(res.body.toString())).toStrictEqual({ error: expect.any(String) });
    expect(res.statusCode).toStrictEqual(401);
  });

  test('Listing is empty', () => {
    const res = request('GET', SERVER_URL + '/v2/announcements/list', { headers: { lab08snapnewstoken }, timeout: TIMEOUT_MS });
    expect(JSON.parse(res.body.toString())).toStrictEqual({ announcements: [] });
    expect(res.statusCode).toStrictEqual(200);
  });

  test('Correctly list one item', () => {
    const expectedTimestamp = Math.floor(Date.now() / 1000);
    const createRes = request('POST', SERVER_URL + '/v2/announcements/create', { json: { title: 'hello', description: 'world' }, headers: { lab08snapnewstoken }, timeout: TIMEOUT_MS });
    const announcement = JSON.parse(createRes.body.toString());
    const listRes = request('GET', SERVER_URL + '/v2/announcements/list', { headers: { lab08snapnewstoken }, timeout: TIMEOUT_MS });
    const announcementList = JSON.parse(listRes.body.toString());
    expect(announcementList).toStrictEqual({
      announcements: [
        {
          announcementId: announcement.announcementId,
          title: 'hello',
          description: 'world',
          createdAt: expect.any(Number),
        }
      ]
    });
    // checking timestamp, accounting for potential network delays
    const createdAt = announcementList.announcements[0].createdAt;
    expect(createdAt).toBeGreaterThanOrEqual(expectedTimestamp);
    expect(createdAt).toBeLessThanOrEqual(expectedTimestamp + 2);
  });

  test('Correctly list multiple items', () => {
    const createRes1 = request('POST', SERVER_URL + '/v2/announcements/create', { json: { title: 't1', description: 'd1' }, headers: { lab08snapnewstoken }, timeout: TIMEOUT_MS });
    const createRes2 = request('POST', SERVER_URL + '/v2/announcements/create', { json: { title: 't2', description: 'd2' }, headers: { lab08snapnewstoken }, timeout: TIMEOUT_MS });
    const createRes3 = request('POST', SERVER_URL + '/v2/announcements/create', { json: { title: 't3', description: 'd3' }, headers: { lab08snapnewstoken }, timeout: TIMEOUT_MS });
    const a1 = JSON.parse(createRes1.body.toString());
    const a2 = JSON.parse(createRes2.body.toString());
    const a3 = JSON.parse(createRes3.body.toString());
    const listRes = request('GET', SERVER_URL + '/v2/announcements/list', { headers: { lab08snapnewstoken }, timeout: TIMEOUT_MS });
    expect(JSON.parse(listRes.body.toString())).toStrictEqual({
      announcements: [
        {
          announcementId: a1.announcementId,
          title: 't1',
          description: 'd1',
          createdAt: expect.any(Number),
        },
        {
          announcementId: a2.announcementId,
          title: 't2',
          description: 'd2',
          createdAt: expect.any(Number),
        },
        {
          announcementId: a3.announcementId,
          title: 't3',
          description: 'd3',
          createdAt: expect.any(Number),
        },
      ],
    });
  });
});

describe('DELETE /v2/announcements/:announcementid', () => {
  test('400 attempting to delete when no announcement has been created', () => {
    const deleteRes = request('DELETE', SERVER_URL + '/v2/announcements/0', { headers: { lab08snapnewstoken }, timeout: TIMEOUT_MS });
    expect(JSON.parse(deleteRes.body.toString())).toStrictEqual({ error: expect.any(String) });
    expect(deleteRes.statusCode).toStrictEqual(400);
  });

  describe('when one announcement exists', () => {
    let announcement: { announcementId: number };
    beforeEach(() => {
      const res = request('POST', SERVER_URL + '/v2/announcements/create', { json: { title: 'hello', description: 'world' }, headers: { lab08snapnewstoken }, timeout: TIMEOUT_MS });
      expect(res.statusCode).toStrictEqual(200);
      announcement = JSON.parse(res.body.toString());
      expect(announcement).toStrictEqual({ announcementId: expect.any(Number) });
    });

    test('401 attempting to delete an announcement using an invalid token', () => {
      const deleteRes = request('DELETE', SERVER_URL + `/v2/announcements/${announcement.announcementId}`, { headers: { lab08snapnewstoken: 'invalid' }, timeout: TIMEOUT_MS });
      expect(JSON.parse(deleteRes.body.toString())).toStrictEqual({ error: expect.any(String) });
      expect(deleteRes.statusCode).toStrictEqual(401);
    });

    test('400 attempting to delete an invalid announcement', () => {
      const deleteRes = request('DELETE', SERVER_URL + `/v2/announcements/${announcement.announcementId + 1}`, { headers: { lab08snapnewstoken }, timeout: TIMEOUT_MS });
      expect(JSON.parse(deleteRes.body.toString())).toStrictEqual({ error: expect.any(String) });
      expect(deleteRes.statusCode).toStrictEqual(400);
    });

    test('correct return type', () => {
      const deleteRes = request('DELETE', SERVER_URL + `/v2/announcements/${announcement.announcementId}`, { headers: { lab08snapnewstoken }, timeout: TIMEOUT_MS });
      expect(JSON.parse(deleteRes.body.toString())).toStrictEqual({});
      expect(deleteRes.statusCode).toStrictEqual(200);
    });

    test('correct side-effect when listing', () => {
      const listBeforeDeleteRes = request('GET', SERVER_URL + '/v2/announcements/list', { headers: { lab08snapnewstoken }, timeout: TIMEOUT_MS });
      expect(JSON.parse(listBeforeDeleteRes.body.toString())).toStrictEqual({
        announcements: [
          {
            announcementId: announcement.announcementId,
            title: 'hello',
            description: 'world',
            createdAt: expect.any(Number),
          }
        ]
      });
      const deleteRes = request('DELETE', SERVER_URL + `/v2/announcements/${announcement.announcementId}`, { headers: { lab08snapnewstoken }, timeout: TIMEOUT_MS });
      expect(JSON.parse(deleteRes.body.toString())).toStrictEqual({});
      expect(deleteRes.statusCode).toStrictEqual(200);
      const listAfterDeleteRes = request('GET', SERVER_URL + '/v2/announcements/list', { headers: { lab08snapnewstoken }, timeout: TIMEOUT_MS });
      expect(JSON.parse(listAfterDeleteRes.body.toString())).toStrictEqual({ announcements: [] });
    });
  });
});

// ========================================================================= //
// Tests for /v1/ new routes
// ========================================================================= //

describe('DELETE /v1/announcements/:announcementId/schedule', () => {
  test('400 attempting to schedule delete when no announcement has been created', () => {
    const scheduledDeleteRes = request('DELETE', SERVER_URL + '/v1/announcements/0/schedule', { qs: { secondsFromNow: 2 }, headers: { lab08snapnewstoken }, timeout: TIMEOUT_MS });
    expect(JSON.parse(scheduledDeleteRes.body.toString())).toStrictEqual({ error: expect.any(String) });
    expect(scheduledDeleteRes.statusCode).toStrictEqual(400);
  });

  describe('when one announcement exists', () => {
    let announcement: { announcementId: number };
    beforeEach(() => {
      const res = request('POST', SERVER_URL + '/v2/announcements/create', { json: { title: 'hello', description: 'world' }, headers: { lab08snapnewstoken }, timeout: TIMEOUT_MS });
      expect(res.statusCode).toStrictEqual(200);
      announcement = JSON.parse(res.body.toString());
      expect(announcement).toStrictEqual({ announcementId: expect.any(Number) });
    });

    test('401 attempting to schedule delete an announcement using an invalid token', () => {
      const scheduledDeleteRes = request('DELETE', SERVER_URL + `/v1/announcements/${announcement.announcementId}/schedule`, { qs: { secondsFromNow: 2 }, headers: { lab08snapnewstoken: 'invalid' }, timeout: TIMEOUT_MS });
      expect(JSON.parse(scheduledDeleteRes.body.toString())).toStrictEqual({ error: expect.any(String) });
      expect(scheduledDeleteRes.statusCode).toStrictEqual(401);
    });

    test('400 attempting to schedule delete an invalid announcement', () => {
      const scheduledDeleteRes = request('DELETE', SERVER_URL + `/v1/announcements/${announcement.announcementId + 1}/schedule`, { qs: { secondsFromNow: 2 }, headers: { lab08snapnewstoken }, timeout: TIMEOUT_MS });
      expect(JSON.parse(scheduledDeleteRes.body.toString())).toStrictEqual({ error: expect.any(String) });
      expect(scheduledDeleteRes.statusCode).toStrictEqual(400);
    });

    test('400 attempting to schedule delete with a negative secondsFromNow', () => {
      const scheduledDeleteRes = request('DELETE', SERVER_URL + `/v1/announcements/${announcement.announcementId}/schedule`, { qs: { secondsFromNow: -1 }, headers: { lab08snapnewstoken }, timeout: TIMEOUT_MS });
      expect(JSON.parse(scheduledDeleteRes.body.toString())).toStrictEqual({ error: expect.any(String) });
      expect(scheduledDeleteRes.statusCode).toStrictEqual(400);
    });

    test('correct return type', () => {
      const scheduledDeleteRes = request('DELETE', SERVER_URL + `/v1/announcements/${announcement.announcementId}/schedule`, { qs: { secondsFromNow: 2 }, headers: { lab08snapnewstoken }, timeout: TIMEOUT_MS });
      expect(JSON.parse(scheduledDeleteRes.body.toString())).toStrictEqual({});
      expect(scheduledDeleteRes.statusCode).toStrictEqual(200);
    });

    test('400 when scheduling twice', () => {
      request('DELETE', SERVER_URL + `/v1/announcements/${announcement.announcementId}/schedule`, { qs: { secondsFromNow: 2 }, headers: { lab08snapnewstoken }, timeout: TIMEOUT_MS });
      const secondRes = request('DELETE', SERVER_URL + `/v1/announcements/${announcement.announcementId}/schedule`, { qs: { secondsFromNow: 2 }, headers: { lab08snapnewstoken }, timeout: TIMEOUT_MS });
      expect(JSON.parse(secondRes.body.toString())).toStrictEqual({ error: expect.any(String) });
      expect(secondRes.statusCode).toStrictEqual(400);
    });

    test('correct side-effect when listing', () => {
      const listBeforeDeleteRes = request('GET', SERVER_URL + '/v2/announcements/list', { headers: { lab08snapnewstoken }, timeout: TIMEOUT_MS });
      const expectedInitialList = [
        {
          announcementId: announcement.announcementId,
          title: 'hello',
          description: 'world',
          createdAt: expect.any(Number),
        }
      ];
      expect(JSON.parse(listBeforeDeleteRes.body.toString())).toStrictEqual({ announcements: expectedInitialList });

      const scheduledDeleteRes = request('DELETE', SERVER_URL + `/v1/announcements/${announcement.announcementId}/schedule`, { qs: { secondsFromNow: 2 }, headers: { lab08snapnewstoken }, timeout: TIMEOUT_MS });
      expect(JSON.parse(scheduledDeleteRes.body.toString())).toStrictEqual({});
      expect(scheduledDeleteRes.statusCode).toStrictEqual(200);

      // Should not be deleted yet since it is scheduled for 2 seconds
      const listImmediatelyAfterSchedule = request('GET', SERVER_URL + '/v2/announcements/list', { headers: { lab08snapnewstoken }, timeout: TIMEOUT_MS });
      expect(JSON.parse(listImmediatelyAfterSchedule.body.toString())).toStrictEqual({ announcements: expectedInitialList });

      // Wait for 2000 milliseconds (2 seconds)
      sleepSync(2 * 1000);

      const listAfter2Seconds = request('GET', SERVER_URL + '/v2/announcements/list', { headers: { lab08snapnewstoken }, timeout: TIMEOUT_MS });
      expect(JSON.parse(listAfter2Seconds.body.toString())).toStrictEqual({ announcements: [] });
    });

    test('scheduled deletion with announcement deleted immediately afterwards (this test should not crash your server if exceptions are handled in all callbacks)', () => {
      const scheduledDeleteRes = request('DELETE', SERVER_URL + `/v1/announcements/${announcement.announcementId}/schedule`, { qs: { secondsFromNow: 2 }, headers: { lab08snapnewstoken }, timeout: TIMEOUT_MS });
      expect(JSON.parse(scheduledDeleteRes.body.toString())).toStrictEqual({});
      expect(scheduledDeleteRes.statusCode).toStrictEqual(200);

      const immediateDeleteRes = request('DELETE', SERVER_URL + `/v2/announcements/${announcement.announcementId}`, { headers: { lab08snapnewstoken }, timeout: TIMEOUT_MS });
      expect(JSON.parse(immediateDeleteRes.body.toString())).toStrictEqual({});
      expect(immediateDeleteRes.statusCode).toStrictEqual(200);

      sleepSync(2 * 1000);

      const listRes = request('GET', SERVER_URL + '/v2/announcements/list', { headers: { lab08snapnewstoken }, timeout: TIMEOUT_MS });
      expect(JSON.parse(listRes.body.toString())).toStrictEqual({ announcements: [] });
      expect(listRes.statusCode).toStrictEqual(200);
    })
  });
});

describe('POST /v1/announcements/:announcementId/schedule/abort', () => {
  test('400 attempting to abort schedule delete when no announcement has been created', () => {
    const abortRes = request('POST', SERVER_URL + '/v1/announcements/0/schedule/abort', { headers: { lab08snapnewstoken }, timeout: TIMEOUT_MS });
    expect(JSON.parse(abortRes.body.toString())).toStrictEqual({ error: expect.any(String) });
    expect(abortRes.statusCode).toStrictEqual(400);
  });

  describe('when one announcement exists', () => {
    let announcement: { announcementId: number };
    beforeEach(() => {
      const res = request('POST', SERVER_URL + '/v2/announcements/create', { json: { title: 'hello', description: 'world' }, headers: { lab08snapnewstoken }, timeout: TIMEOUT_MS });
      expect(res.statusCode).toStrictEqual(200);
      announcement = JSON.parse(res.body.toString());
      expect(announcement).toStrictEqual({ announcementId: expect.any(Number) });
    });

    test('401 attempting to abort schedule delete an announcement using an invalid token', () => {
      request('DELETE', SERVER_URL + `/v1/announcements/${announcement.announcementId}/schedule`, { qs: { secondsFromNow: 2 }, headers: { lab08snapnewstoken }, timeout: TIMEOUT_MS });
      const abortRes = request('POST', SERVER_URL + `/v1/announcements/${announcement.announcementId}/schedule/abort`, { headers: { lab08snapnewstoken: 'invalid' }, timeout: TIMEOUT_MS });
      expect(JSON.parse(abortRes.body.toString())).toStrictEqual({ error: expect.any(String) });
      expect(abortRes.statusCode).toStrictEqual(401);
    });

    test('400 attempting to abort schedule delete an invalid announcement', () => {
      request('DELETE', SERVER_URL + `/v1/announcements/${announcement.announcementId}/schedule`, { qs: { secondsFromNow: 2 }, headers: { lab08snapnewstoken }, timeout: TIMEOUT_MS });
      const abortRes = request('POST', SERVER_URL + `/v1/announcements/${announcement.announcementId + 1}/schedule/abort`, { headers: { lab08snapnewstoken }, timeout: TIMEOUT_MS });
      expect(JSON.parse(abortRes.body.toString())).toStrictEqual({ error: expect.any(String) });
      expect(abortRes.statusCode).toStrictEqual(400);
    });

    test('400 attempting to abort when not scheduled', () => {
      const abortRes = request('POST', SERVER_URL + `/v1/announcements/${announcement.announcementId}/schedule/abort`, { headers: { lab08snapnewstoken }, timeout: TIMEOUT_MS });
      expect(JSON.parse(abortRes.body.toString())).toStrictEqual({ error: expect.any(String) });
      expect(abortRes.statusCode).toStrictEqual(400);
    });

    test('400 attempting to abort twice', () => {
      request('DELETE', SERVER_URL + `/v1/announcements/${announcement.announcementId}/schedule`, { qs: { secondsFromNow: 2 }, headers: { lab08snapnewstoken }, timeout: TIMEOUT_MS });
      request('POST', SERVER_URL + `/v1/announcements/${announcement.announcementId}/schedule/abort`, { headers: { lab08snapnewstoken }, timeout: TIMEOUT_MS });
      const secondRes = request('POST', SERVER_URL + `/v1/announcements/${announcement.announcementId}/schedule/abort`, { headers: { lab08snapnewstoken }, timeout: TIMEOUT_MS });
      expect(JSON.parse(secondRes.body.toString())).toStrictEqual({ error: expect.any(String) });
      expect(secondRes.statusCode).toStrictEqual(400);
    });

    test('correct return type', () => {
      request('DELETE', SERVER_URL + `/v1/announcements/${announcement.announcementId}/schedule`, { qs: { secondsFromNow: 2 }, headers: { lab08snapnewstoken }, timeout: TIMEOUT_MS });
      const abortRes = request('POST', SERVER_URL + `/v1/announcements/${announcement.announcementId}/schedule/abort`, { headers: { lab08snapnewstoken }, timeout: TIMEOUT_MS });
      expect(JSON.parse(abortRes.body.toString())).toStrictEqual({});
      expect(abortRes.statusCode).toStrictEqual(200);
    });

    test('correct side-effect when aborting', () => {
      const listBeforeDeleteRes = request('GET', SERVER_URL + '/v2/announcements/list', { headers: { lab08snapnewstoken }, timeout: TIMEOUT_MS });
      const expectedInitialList = [
        {
          announcementId: announcement.announcementId,
          title: 'hello',
          description: 'world',
          createdAt: expect.any(Number),
        }
      ];
      expect(JSON.parse(listBeforeDeleteRes.body.toString())).toStrictEqual({ announcements: expectedInitialList });

      const scheduledDeleteRes = request('DELETE', SERVER_URL + `/v1/announcements/${announcement.announcementId}/schedule`, { qs: { secondsFromNow: 2 }, headers: { lab08snapnewstoken }, timeout: TIMEOUT_MS });
      expect(JSON.parse(scheduledDeleteRes.body.toString())).toStrictEqual({});
      expect(scheduledDeleteRes.statusCode).toStrictEqual(200);

      // Should not be deleted yet since it is scheduled for 2 seconds
      const listImmediatelyAfterSchedule = request('GET', SERVER_URL + '/v2/announcements/list', { headers: { lab08snapnewstoken }, timeout: TIMEOUT_MS });
      expect(JSON.parse(listImmediatelyAfterSchedule.body.toString())).toStrictEqual({ announcements: expectedInitialList });

      // Aborting deletion
      request('POST', SERVER_URL + `/v1/announcements/${announcement.announcementId}/schedule/abort`, { headers: { lab08snapnewstoken }, timeout: TIMEOUT_MS });
      // Wait for 2000 milliseconds (2 seconds)
      sleepSync(2 * 1000);

      const listAfter2Seconds = request('GET', SERVER_URL + '/v2/announcements/list', { headers: { lab08snapnewstoken }, timeout: TIMEOUT_MS });
      // Should be the same since we aborted the deltion
      expect(JSON.parse(listAfter2Seconds.body.toString())).toStrictEqual({ announcements: expectedInitialList });
    });
  });
});

*/
