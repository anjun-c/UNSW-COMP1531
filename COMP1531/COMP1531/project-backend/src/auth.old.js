import { getData, setData } from './dataStore.ts';

import validator from 'validator';

// Registers users and provides them with a UserId
function adminAuthRegister(email, password, nameFirst, nameLast) {
  const data = getData();

  // Check if email is in use
  for (const user of data.users) {
    if (user.email === email) {
      return { error: 'Email already in use' };
    }
  }

  // Verify email format
  if (validator.isEmail(email) === false) {
    return { error: 'Not a valid email' };
  }

  // Check that there are no invalid characters in first name
  const regex = /[^a-zA-z \-'']/;
  if (regex.test(nameFirst) === true) {
    return { error: 'Only include letters, spaces, hyphens, and apostrophes in first name' };
  }

  // Check that there are no invalid characters in last name
  if (regex.test(nameLast) === true) {
    return { error: 'Only include letters, spaces, hyphens, and apostrophes in last name' };
  }

  // Check first name length
  if (nameFirst.length < 2 || nameFirst.length > 20) {
    return { error: 'First name must be between 2 and 20 characters' };
  }

  // Check last name length
  if (nameLast.length < 2 || nameLast.length > 20) {
    return { error: 'Last name must be between 2 and 20 characters' };
  }

  // Check password length
  if (password.length < 8) {
    return { error: 'Password is too short' };
  }

  const letterRegex = /[a-zA-Z]/;
  const numRegex = /\d/;

  // Check that passwords contain at least 1 letter and 1 number
  if (letterRegex.test(password) === false || numRegex.test(password) === false) {
    return { error: 'Password must contain at least one number and one letter' };
  }

  // update data
  data.users.push({
    id: data.users.length + 1,
    name: {
      first: nameFirst,
      last: nameLast,
    },
    email: email,
    password: password,
    pastPasswords: [password],
    numFailedPasswordsSinceLastLogin: 0,
    numSuccessfulLogins: 1,
    numQuizzesMade: 0,
  });

  // Return user ID
  return {
    authUserId: data.users.length
  };
}

// Returns UserId when Login details provided exist
function adminAuthLogin(email, password) {
  const data = getData();

  for (const user of data.users) {
    // If email is found, check for correct password
    if (user.email === email) {
      if (user.password === password) {
        // If correct password and email, log the user in
        user.numSuccessfulLogins++;
        user.numFailedPasswordsSinceLastLogin = 0;
        return { authUserId: user.id };
      } else {
        // Return an error if the incorrect password is entered
        user.numFailedPasswordsSinceLastLogin++;
        return { error: 'Incorrect password' };
      }
    }
  }

  // Return an error if the email isn't found
  return {
    error: 'Email does not exist'
  };
}

// Updates password for user
function adminUserPasswordUpdate(authUserId, oldPassword, newPassword) {
  const data = getData();

  // Check if user is valid
  let userFound = false;
  for (let i = 0; i < data.users.length; i++) {
    if (data.users[i].id === authUserId.authUserId) {
      userFound = true;
      break;
    }
  }
  if (!userFound) {
    return { error: 'Invalid User ID' };
  }

  // Check if old password is correct
  const user = data.users.find(user => user.id === authUserId.authUserId);
  if (user.password !== oldPassword) {
    return { error: 'Old Password is not corect' };
  }

  // check if new password has already been used
  if (user.pastPasswords.includes(newPassword)) {
    return { error: 'Password Previously Used' };
  }

  // check if new password is over 7 characters
  if (newPassword.length < 8) {
    return { error: 'Invalid Password Length' };
  }

  // check if new password contains a number and a letter
  const letterRegex = /[a-zA-Z]/;
  const numRegex = /\d/;

  if (letterRegex.test(newPassword) === false || numRegex.test(newPassword) === false) {
    return { error: 'Invalid Password Characters' };
  }

  user.password = newPassword;
  user.pastPasswords.push(newPassword);
  setData(data);
  return { };
}

// Returns User Details
function adminUserDetails(authUserId) {
  // Retrieves user data
  const data = getData();

  // Checks whether UserId exists
  const user = data.users.find(user => user.id === authUserId);
  if (!user) {
    // Returns error message when UserId provided does not exist.
    return { error: 'UserId is not a valid user.' };
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

// Updates user details
function adminUserDetailsUpdate(authUserId, email, nameFirst, nameLast) {
  const data = getData();

  const user = data.users.find(user => user.id === authUserId);
  if (!user) {
    return { error: 'UserId is not a valid user.' };
  }

  // Validate email
  if (!validator.isEmail(email)) {
    return { error: 'Invalid email format.' };
  }

  // Check if email is already used by another user
  const emailUsed = data.users.some(u => u.email === email && u.id !== authUserId);
  if (emailUsed) {
    return { error: 'Email is already used by another user.' };
  }

  // Validate nameFirst and nameLast
  const regex = /[^a-zA-Z \-']/;
  if (regex.test(nameFirst)) {
    return { error: 'First name contains invalid characters.' };
  }

  if (regex.test(nameLast)) {
    return { error: 'Last name contains invalid characters.' };
  }

  if (nameFirst.length < 2 || nameFirst.length > 20) {
    return { error: 'First name must be between 2 and 20 characters.' };
  }

  if (nameLast.length < 2 || nameLast.length > 20) {
    return { error: 'Last name must be between 2 and 20 characters.' };
  }

  // Update user details
  user.email = email;
  user.name.first = nameFirst;
  user.name.last = nameLast;

  setData(data);

  return {};
}

export { adminAuthRegister, adminAuthLogin, adminUserDetails, adminUserDetailsUpdate, adminUserPasswordUpdate };
