<div align="center">

![Lab Title](assets/logo.svg)

![Estimated completion time](https://img.shields.io/badge/Estimated%20Time-2.5%20hours-7FFF7F)
&nbsp;
![Overall Difficulty](https://img.shields.io/badge/Overall%20Difficulty-⭐%20⭐-3498DB)
&nbsp;
![Code Assessed](https://img.shields.io/badge/Code%20Assessed-yes-darkgreen)
&nbsp;
![Eslint Assessed](https://img.shields.io/badge/Style%20Assessed-yes-FFC0CB)
&nbsp;
![Test Quality Assessed](https://img.shields.io/badge/Test%20Quality%20Assessed-yes-FEDC56)
&nbsp;

---

</div>

[TOC]

# Due Date

Week 9 Monday 6:00 pm [Sydney Local Time](https://www.timeanddate.com/worldclock/australia/sydney)

# Background

## Rationale

Snap News Inc has a legacy backend service that they use to send announcements (currently on version 1).

They have reached out to you, a software engineer freelancer, with the following requirements for version 2:
1. Migrate the existing system to transmit API token (secrets) securely, instead of in query strings
1. Ensure that all lines of codes in the server infrastructure are fully tested
1. Automate/schedule the deletion of old announcements
1. Maintain backwards compatibility with the previous version 1 API as other legacy system still relies on them

In this lab, we will touch on API versioning, measure server coverage with [nyc](https://github.com/istanbuljs/nyc) instead of the regular `jest --coverage`,
schedule background tasks with [JavaScript timers](https://nodejs.org/en/learn/asynchronous-work/discover-javascript-timers) and transmit sensitive
information securely in headers.

## Getting Started
- Please ensure that you have completed lab08_objection prior.
- Copy the SSH clone link from Gitlab and clone this repository on either VLAB or your local machine.
- In your terminal, change your directory (using the `cd` command) into the newly cloned lab.

## Package Installation

1. Open [package.json](package.json) and look at existing packages in `"dependencies"` and `"devDependencies"`. Install them with:
    ```shell
    $ npm install
    ```

1. Install [nyc](https://www.npmjs.com/package/nyc) to measure server coverage:
    ```shell
    $ npm install --save-dev nyc
    ```

1. Open your [package.json](package.json) and add the following scripts:
    ```json
    "scripts": {
        "ts-node": "ts-node",
        "ts-node-coverage": "nyc --reporter=text --reporter=lcov ts-node",
        "test": "jest",
        "tsc": "tsc --noEmit",
        "lint": "eslint '**/*.ts'"
        // Any other scripts you want here
    }
    ```

1. Notice in the `ts-node-coverage` script we have added `nyc --reporter=text --reporter=lcov` before running `ts-node`:
    - `nyc` - to measure our server code coverage.
    - `--reporter=text` - display coverage results to the terminal when the server closes.
    - `--reporter=lcov` - also generates a `coverage/lcov-report/index.html` file for us to open in our browser.
    - Further instructions on server coverage can be found in the [Testing](#testing) section.

1. To check that you have completed the steps correctly, compare your [package.json](package.json) with our sample package.json in the [Additional Information](#additional-information) section.

1. Use `git` to `add`, `commit` and `push` your [package.json](package.json) and [package-lock.json](package-lock.json).

1. (Optional) Update [.gitlab-ci.yml](.gitlab-ci.yml) with testing and linting.

1. (Optional) Bonus Tips: you may find the following scripts helpful:
    ```json
    "start": "ts-node src/server.ts",
    "start-dev": "ts-node-dev src/server.ts",
    "start-coverage": "nyc --reporter=text --reporter=lcov ts-node src/server.ts",
    ```

## Interface

See [swagger.yaml](swagger.yaml).

# Task

## Testing

A test suite for this lab has been provided to you in [src/snapnews.test.ts](src/snapnews.test.ts).
Writing additional tests for this lab is not a direct requirement - however, **you must ensure that you have 100% coverage**.

To test your code and *view the coverage results*, we will need to **measure the coverage on the server side** and not the test side.
This is because your tests runs on a separate instance of NodeJS, and has no knowledge of your server implementation.

The steps for measuring tests on the server side using `nyc` is summarised below:

<table>
    <tr>
        <th><b>Terminal 1 - Server</b></th>
        <th><b>Terminal 2 - Test</b></th>
    </tr>
    <tr>
        <td>
            Step 1: <code>npm run ts-node-coverage src/server.ts</code>
            <br/><br/>
        </td>
        <td>
        </td>
    </tr>
    <tr>
        <td>
        </td>
        <td>
            Step 2: <code>npm test</code>
        </td>
    </tr>
    <tr>
        <td>
            Step 3: <code>Ctrl+C</code> to close the server. Brief coverage details should be displayed.
        </td>
        <td>
        </td>
    </tr>
    <tr>
        <td>
            Step 4: Open <code>coverage/lcov-report/index.html</code> in a browser (e.g. Firefox/Google Chrome)
        </td>
        <td>
        </td>
    </tr>
</table>

### TIP
- Step 4 only needs to be done once, you can refresh the `index.html` page after repeating steps 1-3 to get updated results.

## Implementation

Look through the following files:
- [src/dataStore.ts](src/dataStore.ts) (completed)
- [src/auth.ts](src/auth.ts) (completed)
- [src/snapnews.ts](src/snapnews.ts) (partially completed)
- [src/server.ts](src/server.ts) (partially completed)

### Tasks

### Task 1: Adding v2 API endpoints

When the input or output of an existing route changes, it is good practice to release them under a new version prefix, e.g.
- from: `/v1/announcements/create`
- to: `/v2/announcements/create`
This will allow other services/application that relies on the `/v1` route to behave as expected, and other developers can slowly migrate to using your new version.

With Snap News, the change we want to make is to fix a vulnerability with the `lab08snapnewstoken` being sent in the `query` string
for `GET` and `DELETE` requests. This is bad practice since query strings are visible when requests are logged. It is more secure
to place the token inside the request **`headers`** when sending them to the server.

For consistency, we will also move the `lab08snapnewstoken` from `body` to **`headers`** in any `PUT` or `POST` routes.

In [src/server.ts](src/server.ts), implement all /v2/ routes from [swagger.yaml](swagger.yaml). Similar to `query` and `body`, you
can extract values from the request headers as follows
```ts
app.post('/v2/announcements/create', (req: Request, res: Response) => {
  const lab08snapnewstoken = req.headers.lab08snapnewstoken as string;
  // ...
});
```

Note that your application must still support all old `/v1` routes (i.e. all old tests should still pass).

### Task 2:

In [src/server.ts](src/server.ts) and [src/snapnews.ts](src/snapnews.ts), implement the logic for the following new routes:
- `DELETE` `/v1/announcements/{announcementid}/schedule`
- `POST` `/v1/announcements/{announcementid}/schedule/abort`

If you are using `setTimeout` in the implementation, please note that you will also need to update `/v1/clear` to call
`clearTimeout` on all existing timers. See the `clear()` function in [src/snapnews.ts](src/snapnews.ts) further notes
on Task 2. The version should remain as `/v1` for `/v1/clear` because there is no changes to the input or output of
the API (only the underlying logic changes).

#### Schedule and Timer (setTimeout, clearTimeout)

One way to tackle this problem is to use the [setTimeout](https://developer.mozilla.org/en-US/docs/Web/API/setTimeout)
and [clearTimeout](https://developer.mozilla.org/en-US/docs/Web/API/clearTimeout) global functions.

The guides and documentation for setTimeout in NodeJS is available below:
- https://nodejs.org/en/learn/asynchronous-work/discover-javascript-timers#settimeout
- https://nodejs.org/api/timers.html#settimeoutcallback-delay-args

If you need to specify a type for the returned value of `setTimeout`, we recommend using `ReturnType<typeof setTimeout>` instead of `NodeJS.Timeout`. For example,

```typescript
const myTimeout: ReturnType<typeof setTimeout> = setTimeout(() => {
  console.log('Printing message after 3 seconds!');
}, 3000);
console.log('This prints first, and then...');
```

This is because the return type differs depending on whether we are using JavaScript in a browser or NodeJS.

Moreover, it is very important that we handle all errors in the setTimeout callback. This is because we have
set up our server to be Synchronous in COMP1531, so any exceptions thrown in a callback of setTimeout will
crash (stop) the server completely. An example of how we can handle errors inside our callback function is
shown below:

```typescript
const timer = setTimeout(() => {
  try {
    performActionThatMayThrowException();
  } catch {
    // Catch and handle error/exception silently and gracefully.
    console.log(`Handle error gracefully to avoid crashing server`);
  }
}, 2 * 1000);
```

#### Curl code 7 (Server Crash)

**Important**: ensure that any code you write inside a function being passed into `setTimeout` as the argument does not throw any error, or has the potential to cause any error (e.g. TypeError, illegal index, accessing propertites of `undefined`), etc.

This is because, in simple terms, `setTimeout` runs the callback function in the background, so errors in your callback function will not be caught by the [Express's default error handler](https://expressjs.com/en/guide/error-handling.html). This will cause the server to crash.
Subsequent HTTP tests, which sends HTTP requests, will have nowhere to go or connect to. As a result, these tests will fail with Curl Code 7 - CURLE_COULDNT_CONNECT as per its description [here](https://curl.se/libcurl/c/libcurl-errors.html).

To avoid having your callback functions throwing errors and crashing the server, we recommend that you use a combination of:
- handling any error-checking before setTimeout
- wraping the callback function logic inside a `try`/`catch` block
- abstracting core logic to error-free helper functions and use those in the "main functions" after handling errors


## Swagger API

A [swagger.yaml](swagger.yaml) file is also available in this repository. This is simply for your convenience and may contain mistakes.

Please also revisit lab05_forum regarding this section!

</details>

## API Clients

Please revisit lab05_checkins or lab05_forum regarding this section!

# Submission

- Use `git` to `add`, `commit`, and `push` your changes on your master branch.
- Check that your code has been uploaded to your Gitlab repository on this website (you may need to refresh the page).

**If you have pushed your latest changes to master on Gitlab no further action is required! At the due date and time, we automatically collect your work from what's on your master branch on Gitlab.**

# Additional Information

Afterwards, assuming you are working on a CSE machine (e.g. via VLAB), we strongly recommend that you remove your `node_modules` directory with the command:
```shell
$ rm -rf node_modules
```
This is because CSE machines only allow each user to have a maximum of 2GB, so you will eventually run out of storage space. It is always possible to `npm install` your packages again!

## Sample package.json

<details>

<summary>Click to view our sample package.json</summary><br/>

**Note**:
1. The main keys to pay attention to are `"scripts"`, `"dependencies"` and `"devDependencies"`.
1. It is fine if the versions of your packages are newer.

```json
{
  "name": "lab08_snapnews",
  "version": "1.0.0",
  "description": "[TOC]",
  "main": "src/server.ts",
  "scripts": {
    "ts-node": "ts-node",
    "ts-node-coverage": "nyc --reporter=text --reporter=lcov ts-node",
    "test": "jest",
    "tsc": "tsc --noEmit",
    "lint": "eslint src/**.ts"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "devDependencies": {
    "@types/cors": "^2.8.17",
    "@types/express": "^4.17.21",
    "@types/jest": "^29.5.12",
    "@types/morgan": "^1.9.9",
    "@typescript-eslint/eslint-plugin": "^6.20.0",
    "@typescript-eslint/parser": "^6.20.0",
    "eslint": "^8.56.0",
    "eslint-plugin-jest": "^27.6.3",
    "jest": "^29.7.0",
    "nyc": "^15.1.0",
    "sync-request-curl": "^2.1.11",
    "ts-jest": "^29.1.2",
    "ts-node": "^10.9.2",
    "ts-node-dev": "^2.0.0",
    "typescript": "^5.3.3"
  },
  "dependencies": {
    "cors": "^2.8.5",
    "express": "^4.18.2",
    "morgan": "^1.10.0",
    "slync": "^1.0.2"
  }
}
```

</details>
