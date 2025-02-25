import { getData, setData, Token } from '../dataStore';
import { checkUserQuizValidity } from '../helpers/checkUserQuizValidity';
import { adminUserDetails } from './adminUserDetails';

export interface QuizNameUpdateResponse {
    error?: string;
}

/**
 * Updates the name of the quiz
 * @param token The token object containing sessionId to identify the session
 * @param quizId The Id of the quiz to be edited
 * @param name The new name of the quiz
 * @returns Empty object if successful otherwise an error
 */
export function adminQuizNameUpdate(token: Token, quizId: number, name: string): QuizNameUpdateResponse {
  const data = getData();

  const userDetails = adminUserDetails(token);
  if ('error' in userDetails) {
    // return { error: userDetails.error };
    throw new Error(userDetails.error);
  }
  const userId: number = userDetails.user.userId;

  // Check if name is valid
  if (!nameValidityCheck(name)) {
    // return { error: 'Invalid name' };
    throw new Error('Invalid name');
  }

  // quiz validty check
  if ('error' in checkUserQuizValidity(token, quizId)) {
    // return { error: checkUserQuizValidity(token, quizId).error };
    throw new Error(checkUserQuizValidity(token, quizId).error);
  }

  // Check if name is already used by quizzes created by this user
  if (data.quizzes.some(q => q.authorId === userId && q.name === name)) {
    // return { error: 'Name already used' };
    throw new Error('Name already used');
  }

  // find the quiz
  const quiz = data.quizzes.find(quiz => quiz.quizId === quizId);

  // Update the quiz name
  quiz.name = name;
  quiz.timeLastEdited = Date.now();
  setData(data);
  return {};
}

// Helper function to test the validity of name
function nameValidityCheck(name: string): boolean {
  if (name.length > 30 || name.length < 3) {
    return false;
  }

  const regex = /^[a-zA-Z0-9\s]*$/;
  return regex.test(name);
}
