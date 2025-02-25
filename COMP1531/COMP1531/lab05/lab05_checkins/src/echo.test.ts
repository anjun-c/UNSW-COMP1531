import request from 'sync-request-curl';
import { port, url } from './config.json';

const SERVER_URL = `${url}:${port}`;
const TIMEOUT_MS = 5 * 1000;

// We're only importing the SERVER_URL from config.
// No functions that you've written should be imported,
// as all tests should be done through HTTP requests.

// We can write a test that sends a request directly
test('success direct', () => {
  const res = request(
    'GET',
    SERVER_URL + '/echo/echo',
    {
      // Note that for PUT/POST requests, you should
      // use the key 'json' instead of the query string 'qs'
      qs: {
        message: 'direct',
      },

      // In case our server doesn't return a response, abort the request
      // after TIMEOUT_MS milliseconds
      timeout: TIMEOUT_MS,
    }
  );
  const data = JSON.parse(res.body.toString());
  expect(data).toStrictEqual({ message: 'direct' });
});

// Alternatively, we can define wrapper functions to help us
// send requests to the echo route:
function requestEcho(message: string) {
  const res = request(
    'GET',
    SERVER_URL + '/echo/echo',
    {
      // Note that for PUT/POST requests, you should
      // use the key 'json' instead of the query string 'qs'
      qs: {
        message
      },
      timeout: TIMEOUT_MS,
    }
  );
  // NOTE: information about status code can also be checked/returned
  // if necessary, through res.statusCode
  return JSON.parse(res.body.toString());
}

// Then use our wrapper as follow:
test('success wrapper', () => {
  expect(requestEcho('wrapper')).toStrictEqual({ message: 'wrapper' });
});

test('failure, echo echo', () => {
  expect(requestEcho('echo')).toStrictEqual({ error: expect.any(String) });
});

// It may also be possible to extend these helper/wrapper functions to work
// for different methods, routes, etc.
