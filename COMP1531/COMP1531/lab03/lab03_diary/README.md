<div align="center">

![Lab Title](assets/logo.svg)

![Estimated completion time](https://img.shields.io/badge/Estimated%20Time-3%20hours-7FFF7F)
&nbsp;
![Overall Difficulty](https://img.shields.io/badge/Overall%20Difficulty-⭐%20⭐-3498DB)
&nbsp;
![Code Assessed](https://img.shields.io/badge/Code%20Assessed-yes-darkgreen)
&nbsp;
![Eslint Assessed](https://img.shields.io/badge/Style%20Assessed-no-FFC0CB)
&nbsp;
![Test Quality Assessed](https://img.shields.io/badge/Test%20Quality%20Assessed-yes-FEDC56)
&nbsp;

---

</div>

[TOC]

# Due Date

Week 4 Monday 6:00 pm [Sydney Local Time](https://www.timeanddate.com/worldclock/australia/sydney)

# Background

## Rationale

Writing diary entries is a great way to reduce our anxieties and relieve our nerves in stressful situations.

In this lab, you will learn about how we can store and operate on a collection of data (our diary entries) as well as writing blackbox tests
to validate our work based on the given specification.

## Getting Started

- If you are working on a CSE machine (e.g. via VLAB), ensure that you've run the command `1531 setup`. You only need to do this once at the beginning of the course.
- Please make sure you have completed `lab03_password` prior.
- Copy the SSH clone link from Gitlab and clone this repository on either VLAB or your local machine.
- In your terminal, change your directory (using the `cd` command) into the newly cloned lab. To check if you have done this correctly, type `ls` in this new directory to see if you can see the relevant files (including [diary.js](diary.js)).

## Package Installation

1. Open [package.json](package.json) and look under the key `"devDependencies"`. We have added these development packages from `lab03_password` for you:
    ```json
    "devDependencies": {
      "@babel/preset-env": "^7.17.10",
      "jest": "^28.1.0"
    }
    ```

1. Use the command below to install all `"devDependencies"` (and also `"dependencies"`, although none is needed in this lab):
    ```shell
    $ npm install # shortcut: npm i
    ```

1. Under `"scripts"`, make the following changes:
    ```json
    "scripts": {
        "test": "jest"
    }
    ```

1. Use git status, add, commit and push your [package.json](package.json) and [package-lock.json](package-lock.json).

## Interface: Functions

For error cases, choose an appropriate error message. The automarking will allow for any string.
```javascript
return { error: 'a relevant error message of your choice.' }
```

Be wary of the input and output of each function below.
- Parenthesis, `()`, denotes the parameters for each function
- Curly braces, `{}`, denotes an Object return type
    - what you see inside of `{}` are the properties expected in the object. You can find the value of these properties further below in the [Interface: Data Types](#interface-data-types) section. For example, The return type of `viewDiaryEntry` is `{entry}`, meaning a valid return statement could look like:
        ```js
        return {
          entry: {
            entryId: 999,
            title: 'Day 1',
            content: "Today I don't feel like doing anything",
            timestamp: 1716194323,
          }
        }
        ```
        be careful with the double object nesting as seen above - this is an intentionally challenging aspect of this lab!

<table>
  <tr>
    <th>Name & Description</th>
    <th>Parameters</th>
    <th>Return Type (Object)</th>
    <th>Errors</th>
  </tr>
  <tr>
    <td>
        <code>clear</code><br /><br />
        Remove all entries in the diary and returns an empty object
        <br/><br/><b>Difficulty</b>: ⭐
    </td>
    <td>
        <code>()</code>
    </td>
    <td>
        <code>{}</code>
    </td>
    <td>
      N/A
    </td>
  </tr>
  <tr>
    <td>
        <code>addDiaryEntry</code><br /><br />
        Creates a new diary entry, returning an object containing a unique entryId.
        <br />
        <br/><br/><b>Difficulty</b>: ⭐
    </td>
    <td>
        <code>(title, content)</code>
    </td>
    <td>
        <code>{entryId}</code>
    </td>
    <td>
        Return the object <code>{error}</code> if:
        <ul>
            <li>The <code>title</code> is an empty string, <code>""</code></li>
            <li>The <code>content</code> is an empty string, <code>""</code></li>
        </ul>
    </td>
  </tr>
  <tr>
    <td>
        <code>viewDiaryEntry</code><br /><br />
        Returns the full detail of a diary entry corresponding to the input id.
        <br />
        Please refer to the Return Type (Object) column
        <br />
        <br/><br/><b>Difficulty</b>: ⭐
    </td>
    <td>
        <code>(entryId)</code>
    </td>
    <td>
        <code>{entry}</code>
    </td>
    <td>
        Return the object <code>{error}</code> if:
        <ul>
            <li>The <code>entryId</code> does not refer to an existing diary entry</li>
        </ul>
    </td>
  </tr>
  <tr>
    <td>
        <code>listDiaryEntries</code><br /><br />
        Returns brief details about all diary entries.
        <br />
        Please refer to the Return Type (Object) column.
        <br />
        Entries should appear in the order they were created, i.e. [e1, e2, e3]
        <br />
        <br/><br/><b>Difficulty</b>: ⭐
    </td>
    <td>
        <code>()</code>
    </td>
    <td>
        <code>{entries}</code>
    </td>
    <td>
      N/A
    </td>
  </tr>
  <tr>
    <td>
        <code>editDiaryEntry</code><br /><br />
        Edits the title and content of a diary entry and returns an empty object.
        <br />
        You do not need to update the timestamp.
        <br />
        <br/><br/><b>Difficulty</b>: ⭐⭐
    </td>
    <td>
        <code>(entryId, title, content)</code>
    </td>
    <td>
        <code>{}</code>
    </td>
    <td>
        Return the object <code>{error}</code> if:
        <ul>
            <li>The <code>entryId</code> does not refer to an existing entry created with <code>addDiaryEntry</code></li>
            <li>The <code>title</code> is an empty string, <code>""</code></li>
            <li>The <code>content</code> is an empty string, <code>""</code></li>
        </ul>
    </td>
  </tr>
  <tr>
    <td>
        <code>searchDiary</code><br /><br />
        Search through the diary for all entries whose title or content
        contains the given substring.
        <br />
        You can simply use the <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/includes" target="_blank">built-in <code>includes</code> method for strings</a>
        <br />
        Entries should appear in the order they were created, i.e. [e1, e2, e3]
        <br/><br/><b>Difficulty</b>: ⭐⭐
    </td>
    <td>
        <code>(substring)</code>
    </td>
    <td>
        <code>{entries}</code>
    </td>
    <td>
        Return the object <code>{error}</code> if:
        <ul>
            <li>The <code>substring</code> is an empty string, <code>""</code></li>
        </ul>
    </td>
  </tr>
</table>

## Interface: Data Types

This is only regarding the input/output of the functions in the [Interface: Functions](#interface-functions) and has no relation to the data object (implementation). Sometimes the implementation data types will very closely align, but there is no expectation they do.

<table>
  <tr>
    <th>Variable name</th>
    <th>Type</th>
  </tr>
  <tr>
    <td>named exactly <b>error</b></td>
    <td><code>string</code>, with the value being a relevant error message of your choice</td>
  </tr>
  <tr>
    <td>named exactly <b>entryId</b></td>
    <td><code>number</code>, specifically integer</td>
  </tr>
  <tr>
    <td>named exactly <b>title</b></td>
    <td><code>string</code></td>
  </tr>
  <tr>
    <td>named exactly <b>content</b></td>
    <td><code>string</code></td>
  </tr>
  <tr>
    <td>named exactly <b>timestamp</b></td>
    <td><code>number</code>, specifically a <a href="https://flaviocopes.com/how-to-get-timestamp-javascript" target="_blank">UNIX timestamp</a> in seconds (not milliseconds!)</td>
  </tr>
  <tr>
    <td>named exactly <b>substring</b></td>
    <td><code>string</code></td>
  </tr>
  <tr>
    <td>(outputs only) named exactly <b>entries</b></td>
    <td><code>Array</code> of objects, where each <code>Object</code> is of type <code>{ entryId, title }</code></td>
  </tr>
  <tr>
    <td>(outputs only) named exactly <b>entry</b></td>
    <td><code>Object</code> containing keys <code>{entryId, title, content, timestamp}</code></td>
  </tr>
</table>

# Task

## Testing

- This should be done before designing your database or implementing your functions.
- In the file [diary.test.js](academic.test.js), write tests for all functions in [Interface: Functions](#interface-functions).
You should expect most of your tests to fail on your implementation initially!

**IMPORTANT**: Your tests should **not** make assumptions about:
- how data is stored
- how IDs are generated. For example,
    - one student's implementation could have the diary's `entryId` begin at id -1000 and decrease by 5 for each new `entryId`, i.e. -1000, -1005,-1010, etc.
    - another student could randomise the ID (while still ensuring uniqueness).
    - hint: look into `expect.any`.
- which helper functions (i.e. not in the [Interface: Functions](#interface-functions)) are available.

In your tests, you should only be importing functions from [Interface: Functions](#interface-functions) and write your tests using only the knowledge of the input parameters, return values and the description of the function.

### Tips

Each test should be independent of the other. To achieve this
- we use [Setup and Teardown](https://jestjs.io/docs/setup-teardown) to streamline your code
- for example, the `clear` function is called at the very beginning of every tests (inside `beforeEach`) in the starter test code we've given you

## Database

The database is now black-boxed to us - you can design it however you like! We will have zero knowledge of your data structure when auto-marking. See more details in the [Testing](#testing) section.

However, you may want to design your database such that the same information isn't stored/duplicated in multiple places. Consider the case where an academic may want to change their name in the future:
- will this be easily achieved by changing one data entry (e.g. the value of an object key) in your code, or will you have to find and change their name in multiple places?

## Implementation

1. Open the file [diary.js](./diary.js) in your preferred text editor. The stub code for each function has been provided for you.

1. Complete each function in [Interface: Functions](#interface-functions).

1. Test your code with your previously-written tests with
    ```shell
    $ npm test diary.test.js
    ```

1. Fix up any errors in your implementation.

### Recommendation

You are encouraged to use Javascript built-in features (e.g. `for-of` loop) rather than traditional c-style loops using indices. Other array features such as `.find()`, `.filter()` and `.reduce()` are also encouraged and will be explored in further details in later weeks.

While this is not worth any marks (as labs are auto-marked for correctness only), it will help to simplify your code and is good practice for your group project.

# Submission

- Use `git` to `add`, `commit`, and `push` your changes on your master branch.
- Check that your code has been uploaded to your Gitlab repository on this website (you may need to refresh the page).

**If you have pushed your latest changes to master on Gitlab no further action is required! At the due date and time, we automatically collect your work from what's on your master branch on Gitlab.**

Afterwards, assuming you are working on a CSE machine (e.g. via VLAB), we strongly recommend that you remove your `node_modules` directory with the command:
```shell
$ rm -rf node_modules
```
This is because CSE machines only allow each user to have a maximum of 2GB, so you will eventually run out of storage space. It is always possible to `npm install` your packages again!

# Additional Information

## Sample package.json

<details>

<summary>Click to view our sample package.json</summary>

**Note**:
1. The main keys to pay attention to are `"scripts"`, `"dependencies"` and `"devDependencies"`.
1. It is fine if the versions of your packages are newer.

```json
{
  "name": "lab03_diary",
  "version": "1.0.0",
  "description": "[TOC]",
  "type": "module",
  "main": "diary.js",
  "scripts": {
    "test": "jest"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "devDependencies": {
    "@babel/preset-env": "^7.17.10",
    "jest": "^28.1.0"
  }
}
```

</details>
