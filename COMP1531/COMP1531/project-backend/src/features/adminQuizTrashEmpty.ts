import { Token, getData, setData } from '../dataStore';
import { checkUserTrashQuizValidity } from '../helpers/checkUserTrashQuizValidity';

// The response structure of the adminQuizTrashEmpty function
export interface adminQuizTrashEmptyResponse {
    error?: string;
}

/**
 * Moves a question
 * @param quizIds An array of quizIds to delete
 * @param token The token object containing sessionId to identify the session
 * @returns Empty object if successful otherwise an error
 */
export const adminQuizTrashEmpty = (token: Token, quizIds: string): adminQuizTrashEmptyResponse => {
  // Gets data
  const data = getData();
  // Turns the quizIds string into an array
  const quizIdArray: number[] = JSON.parse(quizIds);
  // return error if array is empty
  if (!quizIdArray || quizIdArray.length === 0) {
    throw new Error('No quizIds provided.');
    // return { error: 'No quizIds provided.' };
  }
  // Check if user is the author of the quiz using checkUserTrashQuizValidity helper function
  for (const quizId of quizIdArray) {
    if ('error' in checkUserTrashQuizValidity(token, quizId)) {
      throw new Error(checkUserTrashQuizValidity(token, quizId).error);
    }
  }
  // Find the quiz
  for (const quizId of quizIdArray) {
    const quiz = data.trash.find((quiz) => quiz.quizId === quizId);
    // Find the index of the quiz in the quizzes array and remove it
    if (quiz) {
      data.trash.splice(data.trash.indexOf(quiz), 1);
    }
  }
  setData(data);
  return {};
};
