import { Token, User, getData, Quiz, Data, setData } from '../dataStore';
import { adminUserDetails } from './adminUserDetails';

export interface adminQuizTransferResponse {
    error?: string;
}

/**
 * Transfers ownership of a quiz from the current user to another user specified by email.
 *
 * @param quizId - The ID of the quiz to be transferred.
 * @param token - The token of the current user initiating the transfer.
 * @param userEmail - The email of the user to whom the quiz will be transferred.
 * @returns {adminQuizTransferResponse} - An object containing an error message if the transfer fails, otherwise an empty object.
 */
export function adminQuizTransfer(quizId: number, token: Token, userEmail: string): adminQuizTransferResponse {
  const data: Data = getData();
  let currentUser: User | undefined;
  let newUser: User | undefined;
  let quizToTransfer: Quiz | undefined;
  let quizWithSameName: Quiz | undefined;

  // Find the current user by token
  for (const user of data.users) {
    for (const session of user.sessions) {
      if (session === token.sessionId) {
        currentUser = user;
        break;
      }
    }
    if (currentUser) break;
  }

  if (!currentUser) {
    // return { error: 'Invalid token' };
    throw new Error('Invalid token');
  }

  const userDetails = adminUserDetails(token);
  const userId: number = userDetails.user.userId;

  // Find the new user by email
  for (const user of data.users) {
    if (user.email === userEmail) {
      newUser = user;
      break;
    }
  }

  // Check if the current user owns the quiz
  for (const quiz of data.quizzes) {
    if (quiz.quizId === quizId && quiz.authorId === userId) {
      quizToTransfer = quiz;
      break;
    }
  }

  if (!quizToTransfer) {
    // return { error: 'User does not own a quiz with this quizId' };
    throw new Error('User does not own a quiz with this quizId');
  }

  // Check if the new user exists
  if (!newUser) {
    // return { error: 'Email not found' };
    throw new Error('Email not found');
  }

  // Check if the email belongs to the current user
  if (newUser.id === currentUser.id) {
    // return { error: 'Email belongs to current user' };
    throw new Error('Email belongs to current user');
  }

  // Check if the new user already owns a quiz with the same name
  for (const quiz of data.quizzes) {
    if (quiz.name === quizToTransfer.name && quiz.authorId === newUser.id) {
      quizWithSameName = quiz;
      break;
    }
  }

  if (quizWithSameName) {
    // return { error: 'User already owns a quiz with this name' };
    throw new Error('User already owns a quiz with this name');
  }

  quizToTransfer.authorId = newUser.id;
  setData(data);

  return {};
}
