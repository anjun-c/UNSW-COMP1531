import { getData, setData, Token } from '../dataStore';
import { checkUserQuizValidity } from '../helpers/checkUserQuizValidity';

interface adminQuizDescriptionUpdateResponse {}

/**
 * Updates the description of the quiz
 * @param token The token object containing sessionId to identify the session
 * @param quizId The Id of the quiz to update
 * @param description The new description of the quiz
 * @returns Empty object if successful otherwise an error
 */
export function adminQuizDescriptionUpdate(token: Token, quizId: number, description: string): adminQuizDescriptionUpdateResponse {
  const data = getData();

  // check validity
  if ('error' in checkUserQuizValidity(token, quizId)) {
    // return { error: checkUserQuizValidity(token, quizId).error };
    throw new Error(checkUserQuizValidity(token, quizId).error);
  }

  if (description.length > 100) {
    // return { error: 'Invalid description' };
    throw new Error('Invalid description');
  }

  // find the quiz
  const quiz = data.quizzes.find(quiz => quiz.quizId === quizId);

  // Update quiz description
  quiz.description = description;
  quiz.timeLastEdited = Date.now();
  setData(data);
  return {};
}
