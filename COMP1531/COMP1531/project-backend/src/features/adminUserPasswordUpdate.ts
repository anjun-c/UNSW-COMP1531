import { getData, setData, Token } from '../dataStore';
import { checkPassword, hashPassword } from '../helpers/hashPassword';
import { adminUserDetails } from './adminUserDetails';

export function adminUserPasswordUpdate(token:Token, oldPassword:string, newPassword:string) {
  const data = getData();

  const userDetails = adminUserDetails(token);
  if ('error' in userDetails) {
    throw new Error(userDetails.error);
  }
  const userId: number = userDetails.user.userId;

  // Check if old password is correct
  const user = data.users.find(user => user.id === userId);
  if (!checkPassword(oldPassword, user.password)) {
    throw new Error('Old Password is not correct');
  }

  // check if new password has already been used
  for (let i = 0; i < user.pastPasswords.length; i++) {
    if (checkPassword(newPassword, user.pastPasswords[i])) {
      throw new Error('Password Previously Used');
    }
  }

  // check if new password is over 7 characters
  if (newPassword.length < 8) {
    throw new Error('Invalid Password Length');
  }

  // check if new password contains a number and a letter
  const letterRegex = /[a-zA-Z]/;
  const numRegex = /\d/;

  if (letterRegex.test(newPassword) === false || numRegex.test(newPassword) === false) {
    // return { error: 'Invalid Password Characters' };
    throw new Error('Invalid Password Characters');
  }

  const hashPw = hashPassword(newPassword);

  user.password = hashPw;
  user.pastPasswords.push(hashPw);
  setData(data);
  return { };
}
