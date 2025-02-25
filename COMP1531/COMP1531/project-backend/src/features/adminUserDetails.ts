import { getData, Token } from '../dataStore';

// Define the return type for the function
export interface UserDetailsResponse {
  user?: {
    userId: number;
    name: string;
    email: string;
    numSuccessfulLogins: number;
    numFailedPasswordsSinceLastLogin: number;
  };
  error?: string;
}

/**
 * Returns a user details
 * @param token The token object containing sessionId to identify the session
 * @returns user details if successful otherwise an error
 */
// Returns User Details

export function adminUserDetails(token: Token): UserDetailsResponse {
  // Retrieves user data
  const data = getData();

  // Checks whether UserId exists
  const sessionId = token.sessionId;

  function getUserFromSessionId(sessionId:string) {
    for (const user of data.users) {
      if (user.sessions.includes(sessionId)) {
        return user;
      }
    }
    return null;
  }

  const user = getUserFromSessionId(sessionId);

  if (!user) {
    // Returns error message when UserId provided does not exist.
    // return { error: 'UserId is not a valid user.' };
    throw new Error('UserId is not a valid user.');
  }

  // Returns User Details
  return {
    user: {
      userId: user.id,
      name: `${user.name.first} ${user.name.last}`,
      email: user.email,
      numSuccessfulLogins: user.numSuccessfulLogins,
      numFailedPasswordsSinceLastLogin: user.numFailedPasswordsSinceLastLogin,
    }
  };
}
