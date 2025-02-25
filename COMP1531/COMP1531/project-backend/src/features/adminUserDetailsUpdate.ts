import { getData, setData, Token } from '../dataStore';
import validator from 'validator';
import { adminUserDetails } from './adminUserDetails';
import { checkValidUser } from '../helpers/checkValidUser';

// Define the return type for the function
interface UpdateResponse {
  error?: string;
}

/**
 * Updates a user's details
 * @param token The token object containing sessionId to identify the session
 * @param email The email of the user
 * @param nameFirst The first name of the user
 * @param nameLast The last name of the user
 * @returns Empty object if successful otherwise an error
 */
// Updates user details
export function adminUserDetailsUpdate(
  token: Token,
  email: string,
  nameFirst: string,
  nameLast: string
): UpdateResponse {
  const data = getData();

  const userDetails = adminUserDetails(token);
  if (!checkValidUser(token)) {
    // return { error: userDetails.error.toString() + ' Code: 401' };
    throw new Error('UserId is not a valid user.');
  }

  const userId: number = userDetails.user.userId;
  const user = data.users.find(user => user.id === userId);

  // Validate email
  if (!validator.isEmail(email)) {
    // return { error: 'Invalid email format. Code 400' };
    throw new Error('Invalid email format.');
  }

  // Check if email is already used by another user
  const emailUsed = data.users.some(u => u.email === email && u.id !== userId);
  if (emailUsed) {
    // return { error: 'Email is already used by another user. Code: 400' };
    throw new Error('Email is already used by another user.');
  }

  // Validate nameFirst and nameLast
  const regex = /[^a-zA-Z \-']/;
  if (regex.test(nameFirst)) {
    // return { error: 'First name contains invalid characters. Code: 400' };
    throw new Error('First name contains invalid characters.');
  }

  if (regex.test(nameLast)) {
    // return { error: 'Last name contains invalid characters. Code: 400' };
    throw new Error('Last name contains invalid characters.');
  }

  if (nameFirst.length < 2 || nameFirst.length > 20) {
    // return { error: 'First name must be between 2 and 20 characters. Code 400' };
    throw new Error('First name must be between 2 and 20 characters.');
  }

  if (nameLast.length < 2 || nameLast.length > 20) {
    // return { error: 'Last name must be between 2 and 20 characters. Code 400' };
    throw new Error('Last name must be between 2 and 20 characters.');
  }

  // Update user details
  user.email = email;
  user.name.first = nameFirst;
  user.name.last = nameLast;

  setData(data);

  return {};
}
