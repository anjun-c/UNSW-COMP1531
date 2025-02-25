import { Data, getData, Token } from '../dataStore';
import { checkUserQuizValidity } from '../helpers/checkUserQuizValidity';
import { checkValidUser } from '../helpers/checkValidUser';

/**
 * Returns the active and inactive sessions for a specified quiz
 * @param token - The token identifying the user
 * @param quizId - The unique number identifying the quiz
 * @returns An object containing 2 arrays, one of inactive and one of active sessions if successful.
 *          Otherwise throws an appropriate error
 */
export function adminQuizSessionsView(token: Token, quizId: number): object {
  const data: Data = getData();

  if (token.sessionId === '') {
    throw new Error('Token is empty');
  }

  const userValid = checkValidUser(token);
  if (userValid === false) {
    throw new Error('Token is invalid');
  }

  const userQuizValid = checkUserQuizValidity(token, quizId);
  if ('error' in userQuizValid) {
    throw new Error('User does not own a quiz with this name');
  }

  const quiz = data.quizzes.find(q => q.quizId === quizId);

  let activeSessions: number[] = [];
  let inactiveSessions: number[] = [];

  if (quiz.activeSessions) {
    activeSessions = quiz.activeSessions;
    activeSessions.sort(function(a, b) {
      return a - b;
    });
  }

  if (quiz.inactiveSessions) {
    inactiveSessions = quiz.inactiveSessions;
    inactiveSessions.sort(function(a, b) {
      return a - b;
    });
  }

  const sessions = {
    activeSessions: activeSessions,
    inactiveSessions: inactiveSessions
  };

  return sessions;
}
