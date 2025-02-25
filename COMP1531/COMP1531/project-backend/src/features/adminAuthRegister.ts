import { Token, setData, getData, Data } from '../dataStore';
import { generateToken } from '../helpers/generateToken';
import validator from 'validator';
import { hashPassword } from '../helpers/hashPassword';

/**
 * Registers a new user witht he provided details and logs them in for their first session
 * @param email The email of the new user
 * @param password The password of the new user
 * @param nameFirst The first name of the new user
 * @param nameLast The last name of the new user
 * @returns An object containing a token if login is successful, or an error message if not successful
 */
export function adminAuthRegister(email: string, password: string, nameFirst: string, nameLast: string): Token {
  const data: Data = getData();

  // Check if email is in use
  for (const user of data.users) {
    if (user.email === email) {
      throw new Error('Email already in use');
    }
  }

  // Verify email format
  if (validator.isEmail(email) === false) {
    throw new Error('Not a valid email');
  }

  // Check that there are no invalid characters in first name
  const regex = /[^a-zA-z \-'']/;
  if (regex.test(nameFirst) === true) {
    throw new Error('Only include letters, spaces, hyphens, and apostrophes in first name');
  }

  // Check that there are no invalid characters in last name
  if (regex.test(nameLast) === true) {
    throw new Error('Only include letters, spaces, hyphens, and apostrophes in last name');
  }

  // Check first name length
  if (nameFirst.length < 2 || nameFirst.length > 20) {
    throw new Error('First name must be between 2 and 20 characters');
  }

  // Check last name length
  if (nameLast.length < 2 || nameLast.length > 20) {
    throw new Error('Last name must be between 2 and 20 characters');
  }

  // Check password length
  if (password.length < 8) {
    throw new Error('Password is too short');
  }

  const letterRegex = /[a-zA-Z]/;
  const numRegex = /\d/;

  // Check that passwords contain at least 1 letter and 1 number
  if (letterRegex.test(password) === false || numRegex.test(password) === false) {
    throw new Error('Password must contain at least one number and one letter');
  }

  const tokenNum: string = generateToken();

  const passwordHash = hashPassword(password);

  // update data
  data.users.push({
    id: data.users.length + 1,
    name: {
      first: nameFirst,
      last: nameLast,
    },
    email: email,
    password: passwordHash,
    pastPasswords: [passwordHash],
    numFailedPasswordsSinceLastLogin: 0,
    numSuccessfulLogins: 1,
    numQuizzesMade: 0,
    sessions: [tokenNum]
  });

  setData(data);

  // Return token
  return { sessionId: tokenNum };
}
