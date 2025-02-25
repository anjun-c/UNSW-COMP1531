import request from 'sync-request-curl';
import { port, url } from './config.json';

const SERVER_URL = `${url}:${port}`;
const TIMEOUT_MS = 5 * 1000;

test("success root: '/'", () => {
  const res = request(
    'GET',
    SERVER_URL + '/',

    {
      // Not necessary, since it's empty, though reminder that
      // GET/DELETE is `qs`, PUT/POST is `json`
      qs: {},

      // In case our server doesn't return a response, abort the request
      // after TIMEOUT_MS milliseconds
      timeout: TIMEOUT_MS,
    }
  );
  const data = JSON.parse(res.body.toString());
  expect(data).toStrictEqual({ message: expect.any(String) });
  expect(res.statusCode).toStrictEqual(200);
});

test("404 error if wrong method for root route, '/'", () => {
  const res = request(
    'POST',
    SERVER_URL + '/',
    { json: {}, timeout: TIMEOUT_MS }
  );
  expect(JSON.parse(res.body.toString())).toStrictEqual({ error: expect.any(String) });
  expect(res.statusCode).toStrictEqual(404);
});