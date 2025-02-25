import { getData, setData, Token } from '../dataStore';
import { checkUserQuizValidity } from '../helpers/checkUserQuizValidity';
import { QuizState } from '../states';

// The response structure of the adminQuizRemove function
export interface adminQuizRemoveResponse {
    error?: string;
    statusCode?: number;
}

/**
 * Moves a quiz to trash
 * @param quizId The Id of the quiz to remove
 * @param token The token object containing sessionId to identify the session
 * @returns Empty object if successful otherwise an error
 */
export function adminQuizRemove(token: Token, quizId: number): adminQuizRemoveResponse {
  // Gets data from dataStore.js
  const data = getData();
  // Check if user is the author of the quiz using checkUserQuizValidity helper function
  if ('error' in checkUserQuizValidity(token, quizId)) {
    throw new Error(checkUserQuizValidity(token, quizId).error);
  }
  const quizArray = data.quizzes.filter(quiz => quiz.quizId === quizId);
  for (const quiz of quizArray) {
    if (quiz.quizState && quiz.quizState !== QuizState.END) {
      throw new Error('Quiz is not in the end state');
    }
  }
  // Find the index of the quiz in the quizzes array and remove it
  const indices = data.quizzes.map((quiz, index) => quiz.quizId === quizId ? index : -1).filter(index => index !== -1);
  // Move the quiz to trash
  for (const index of indices) {
    data.trash.push(data.quizzes[index]);
    data.quizzes.splice(index, 1);
  }
  setData(data);
  return {};
}
