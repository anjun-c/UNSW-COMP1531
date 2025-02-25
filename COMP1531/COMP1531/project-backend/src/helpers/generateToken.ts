import { getData, Data, User } from '../dataStore';

/**
 * Generates a unique token containing a sessionId.
 *
 * @returns { sessionId } - A randomly generated sessionId string.
 */
export function generateToken(): string {
  const min: number = 10000000;
  const max: number = 99999999;
  const data: Data = getData();

  let sessionId: string;
  let foundUniqueSessionId: boolean = false;

  while (!foundUniqueSessionId) {
    const tokenNumber: number = Math.floor(Math.random() * (max - min + 1)) + min;
    sessionId = tokenNumber.toString();

    foundUniqueSessionId = !sessionIdExists(sessionId, data.users);
  }

  return sessionId;
}

/**
 * Checks if a given sessionId already exists among the user sessions.
 *
 * @param sessionId - The sessionId to check for existence.
 * @param users - The list of users to search through.
 * @returns {boolean} - Returns true if the sessionId exists, otherwise false.
 */
function sessionIdExists(sessionId: string, users: User[]): boolean {
  for (const user of users) {
    for (const session of user.sessions) {
      if (session === sessionId) {
        return true;
      }
    }
  }
  return false;
}
