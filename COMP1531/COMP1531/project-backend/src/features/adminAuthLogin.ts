import { Token, Data, getData, setData } from '../dataStore';
import { generateToken } from '../helpers/generateToken';
import { checkPassword } from '../helpers/hashPassword';

/**
 * Logs in a user with the provided email and password
 * @param email The email of the user trying to log in
 * @param password The password of the user trying to log in
 * @returns An object containing a token if login is successful, or an error message if not successful
 */
export function adminAuthLogin(email: string, password: string): Token {
  const data: Data = getData();

  const tokenNum: string = generateToken();

  for (const user of data.users) {
    // If email is found, check for correct password
    if (user.email === email) {
      if (checkPassword(password, user.password)) {
        // If correct password and email, log the user in
        user.numSuccessfulLogins++;
        user.numFailedPasswordsSinceLastLogin = 0;
        user.sessions.push(tokenNum);
        setData(data);
        return { sessionId: tokenNum };
      } else {
        // Return an error if the incorrect password is entered
        user.numFailedPasswordsSinceLastLogin++;
        setData(data);
        throw new Error('Incorrect password');
      }
    }
  }

  // Return an error if the email isn't found
  throw new Error('Email does not exist');
}
