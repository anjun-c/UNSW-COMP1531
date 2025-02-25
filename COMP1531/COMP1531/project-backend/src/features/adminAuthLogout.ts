import { Token, getData, Data, setData, EmptyObject } from '../dataStore';

/**
 * Logs out a user session that is identified by the token provided in the parameter
 * @param token The token object containing sessionId to identify the session to logout
 * @returns An object that indicates success (empty) or failure (error message)
 */
export function adminAuthLogout(token: Token): EmptyObject {
  const data: Data = getData();

  // Loop through users
  for (let i = 0; i < data.users.length; i++) {
    const user = data.users[i];

    // Loop through all sessions of each user
    for (let j = 0; j < user.sessions.length; j++) {
      const session = user.sessions[j];

      if (session === token.sessionId) {
        // Remove session from the valid sessions array for the user
        user.sessions.splice(j, 1);
        setData(data);
        return {};
      }
    }
  }

  throw new Error('Session not found');
}
