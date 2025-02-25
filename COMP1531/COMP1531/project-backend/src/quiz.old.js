import { getData } from './dataStore.ts';

// Update name of the relevant quiz
function adminQuizNameUpdate(authUserId, quizId, name) {
  const data = getData();

  // Check if name is valid
  if (!nameValidityCheck(name)) {
    return { error: 'Invalid name' };
  }

  // Find user by authUserId
  const user = data.users.find(user => user.id === authUserId);
  if (!user) {
    return { error: 'authUserId is not a valid user' };
  }

  // Find quiz by quizId
  const quiz = data.quizzes.find(quiz => quiz.quizId === quizId);
  if (!quiz) {
    return { error: 'Quiz ID does not refer to a valid quiz' };
  }

  // Check if user owns the qu
  if (quiz.authorId !== authUserId) {
    return { error: 'Quiz ID does not refer to a quiz that this user owns' };
  }

  // Check if name is already used by quizzes created by this user
  if (data.quizzes.some(q => q.authorId === authUserId && q.name === name)) {
    return { error: 'Name already used' };
  }

  // Update the quiz name
  quiz.name = name;
  return {};
}

// Helper function to test the validity of name

function nameValidityCheck(name) {
  if (name.length > 30 || name.length < 3) {
    return false;
  }

  const regex = /^[a-zA-Z0-9\s]*$/;
  return regex.test(name);
}

// Update the description of the relevant quiz
function adminQuizDescriptionUpdate(authUserId, quizId, description) {
  const data = getData();

  // Check if description is too long
  if (description.length > 100) {
    return { error: 'Invalid description' };
  }

  // Find the user
  const user = data.users.find(user => user.id === authUserId);
  if (!user) {
    return { error: 'authUserId is not a valid user' };
  }

  // Find the quiz
  const quiz = data.quizzes.find(quiz => quiz.quizId === quizId);
  if (!quiz) {
    return { error: 'Quiz ID does not refer to a valid quiz' };
  }

  // Check if user owns the quiz
  if (quiz.authorId !== authUserId) {
    return { error: 'Quiz ID does not refer to a quiz that this user owns' };
  }

  // Update quiz description
  quiz.description = description;
  return {};
}

// Given basic details about a quiz, creates one for logged in user
function adminQuizCreate(authUserId, name, description) {
  const data = getData();
  // Check if name length is valid
  if (name.length < 3 || name.length > 30) {
    return { error: 'Invalid Quiz Name Length' };
  }

  const regex = /^[a-zA-Z0-9 ]*$/;
  if (regex.test(name) === false) {
    return { error: 'Invalid Quiz Name Characters' };
  }

  // Check description length
  if (description.length > 100) {
    return { error: 'Invalid Quiz Description Length' };
  }

  // Check if user is valid
  let userFound = false;
  for (let i = 0; i < data.users.length; i++) {
    if (data.users[i].id === authUserId) {
      userFound = true;
      break;
    }
  }
  if (!userFound) {
    return { error: 'Invalid User ID' };
  }

  // Check if name is already taken by same user
  for (const quiz of data.quizzes) {
    if (quiz.authorId === authUserId && quiz.name === name) {
      return { error: 'Name is already taken by same user' };
    }
  }

  // Create quiz
  const authorId = authUserId;
  const quizId = data.quizzes.length + 1;
  const timeCreated = Date.now();
  const timeLastEdited = Date.now();
  const questions = [];

  data.quizzes.push({
    authorId: authorId,
    quizId: quizId,
    name: name,
    description: description,
    questions: questions,
    timeCreated: timeCreated,
    timeLastEdited: timeLastEdited,
  });

  return { quizId: quizId };
}

// Returns list of all quizzes owned by currently logged in user
function adminQuizList(authUserId) {
  const data = getData();
  // Check if user is valid
  let userFound = false;
  for (let i = 0; i < data.users.length; i++) {
    if (data.users[i].id === authUserId) {
      userFound = true;
      break;
    }
  }
  if (!userFound) {
    return { error: 'Invalid User ID' };
  }

  const quizzes = [];
  data.quizzes.forEach(quiz => {
    if (quiz.authorId === authUserId) {
      quizzes.push({
        quizId: quiz.quizId,
        name: quiz.name,
      });
    }
  });

  return { quizzes: quizzes };
}

/// ///////////////////////////////////////////////////////////////////
// Adrian's functions below this line
/// ///////////////////////////////////////////////////////////////////

// Removes a quiz from the dataStore
function adminQuizRemove(authUserId, quizId) {
  // Gets data from dataStore.js
  const data = getData();
  // Check if user is the author of the quiz using checkUserQuizValidity helper function
  if (checkUserQuizValidity(authUserId, quizId).error) { return checkUserQuizValidity(authUserId, quizId); }
  // Find the quiz
  data.quizzes.find(quiz => quiz.quizId === quizId);

  // Find the index of the quiz in the quizzes array and remove it
  const index = data.quizzes.findIndex(quiz => quiz.quizId === quizId);
  data.quizzes.splice(index, 1);
  return {};
}

// Returns the quiz info of a quiz
function adminQuizInfo(authUserId, quizId) {
  // Gets data from dataStore.js
  const data = getData();
  // Check if user is the author of the quiz using checkUserQuizValidity helper function
  if (checkUserQuizValidity(authUserId, quizId).error) { return checkUserQuizValidity(authUserId, quizId); }
  // Find the quiz
  const quiz = data.quizzes.find(quiz => quiz.quizId === quizId);

  // Return the quiz info
  return {
    quizId: quiz.quizId,
    name: quiz.name,
    timeCreated: quiz.timeCreated,
    timeLastEdited: quiz.timeLastEdited,
    description: quiz.description,
  };
}

// Takes an input of authUserId and quizId and checks whether it is valid
function checkUserQuizValidity(authUserId, quizId) {
  // Gets data from dataStore.js
  const data = getData();
  // Find the user
  const user = data.users.find(user => user.id === authUserId);
  // Check if user exists, else return error
  if (!user) {
    return { error: 'User not found.' };
  }
  // Find the quiz
  const quiz = data.quizzes.find(quiz => quiz.quizId === quizId);
  // Check if quiz exists, else return error
  if (!quiz) {
    return { error: 'Quiz not found.' };
  }
  // Check if user is the author of the quiz, else return error
  if (quiz.authorId !== authUserId) {
    return { error: 'Given user is not the author of this quiz.' };
  }
  // Return empty object if all checks pass -> authUserId and quizId are valid
  return {};
}

/// ///////////////////////////////////////////////////////////////////
// Adrian's functions above this line
/// ///////////////////////////////////////////////////////////////////

export { adminQuizInfo, adminQuizRemove, adminQuizList, adminQuizCreate, adminQuizDescriptionUpdate, adminQuizNameUpdate };
