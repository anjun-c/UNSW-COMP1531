import { Token, getData, Data } from '../dataStore';

/**
 * Checks if the given token corresponds to a valid user in the data store.
 *
 * @param token - The token containing the sessionId to be checked.
 * @returns {boolean} - Returns true if a user with the given sessionId exists in the data store, otherwise false.
 */
export function checkValidUser(token: Token): boolean {
  const data: Data = getData(); // Get data store

  // Check if there's any user with the given session ID in the data store
  for (const user of data.users) {
    for (const session of user.sessions) {
      if (session === token.sessionId) {
        return true; // Found a matching session ID, user is valid
      }
    }
  }

  return false; // No matching session ID found, user is not valid
}
