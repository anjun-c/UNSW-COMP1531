import { Token, setData, getData } from '../dataStore';
import { checkUserTrashQuizValidity } from '../helpers/checkUserTrashQuizValidity';

export interface adminQuizRestoreResponse {
    error?: string;
}
/**
 * Restores a quiz from the trash
 * @param token The token object containing sessionId to identify the session
 * @param quizId The Id of the quiz to help identify
 * @returns Empty object if successful otherwise an error
 */
export function adminQuizRestore(token: Token, quizId: number): adminQuizRestoreResponse {
  const data = getData();

  // quiz validty check
  const validityResponse = checkUserTrashQuizValidity(token, quizId);
  if ('error' in validityResponse) {
    // return validityResponse;
    throw new Error(validityResponse.error);
  }

  // Find the quiz in the trash
  const quizIndex = data.trash.findIndex(quiz => quiz.quizId === quizId);
  const quiz = data.trash[quizIndex];

  // Check if there is already an active quiz with the same name by the same user
  for (const sameQuiz of data.quizzes) {
    if (sameQuiz.name === quiz.name) {
      // return { error: 'Name is already taken by another active quiz' };
      throw new Error('Name is already taken by another active quiz');
    }
  }

  data.trash.splice(quizIndex, 1);
  data.quizzes.push(quiz);
  quiz.timeLastEdited = Date.now();

  setData(data);
  return {};
}
