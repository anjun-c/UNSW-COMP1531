import { Token } from '../dataStore';

/**
 * Returns the results of the specific session of a given quiz
 * @param token - Token identifying the user
 * @param quizId - Unique number identifying the quiz
 * @param sessionId - Unique number identifying the specific session of the quiz to find results for
 * @returns An array of players ranked by score if successful, otherwise throws an appropriate error
 */
export function adminQuizSessionResults(token: Token, quizId: number, sessionId: number) {
  return {};
}
