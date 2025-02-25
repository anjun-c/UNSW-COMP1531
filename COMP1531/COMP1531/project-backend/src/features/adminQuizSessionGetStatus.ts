import { getData, Quiz, Token } from '../dataStore';
import { checkUserQuizValidity } from '../helpers/checkUserQuizValidity';
import { getSessionFromId } from '../helpers/sessionHelpers';
import { stateToStr } from '../helpers/stringToEnum';
import { QuizInfoResponse } from './adminQuizInfo';
import { adminQuizInfo } from './adminQuizInfo';

interface SessionInfo {
    state: string;
    atQuestion: number;
    players: string[]; // Names!
    metadata: QuizInfoResponse;
}

/**
 *
 * @param token
 * @param quizId
 * @param sessionid
 * @returns
 */
export function adminQuizSessionGetStatus(token: Token, quizId: number, sessionid: number): SessionInfo {
  const data = getData();
  // Find the quiz and user

  const quiz: Quiz = data.quizzes.find(quiz => quiz.quizId === quizId);
  const user = data.users.find(user => user.sessions.includes(token.sessionId));
  const session = getSessionFromId(data, sessionid);

  // 401
  if (!user) {
    throw new Error('Token is empty or invalid');
  }

  // 403
  if (!quiz === undefined) {
    throw new Error('User does not own this quiz');
  }

  // 403
  const userQuizValid = checkUserQuizValidity(token, quizId);

  if ('error' in userQuizValid) {
    throw new Error('User does not own this quiz');
  }

  // 400 Session Id does not refer to a valid session within this quiz
  if (
    (quiz.activeSessions === undefined && quiz.inactiveSessions === undefined) ||
    (quiz.activeSessions.length === 0 && quiz.inactiveSessions.length === 0) ||
    !(quiz.activeSessions?.includes(sessionid) || quiz.inactiveSessions?.includes(sessionid))) {
    throw new Error('Session does not exist');
  }
  // Get players names list
  const playersList = session.players.map(player => player.name);
  const stateStr = stateToStr(session.quizState);
  const returnInfo: SessionInfo = {
    state: stateStr,
    atQuestion: session.atQuestion,
    players: playersList,
    metadata: adminQuizInfo(token, quizId)
  };

  return returnInfo;
}
