import { Quiz, Token, getData, setData } from '../dataStore';
import { checkUserQuizValidity } from '../helpers/checkUserQuizValidity';
import { generateSessionId } from '../helpers/sessionHelpers';
import { adminQuizInfo } from './adminQuizInfo';
import { QuizState } from '../states';
export interface adminQuizSessionStartResponse {
  sessionId?: number;
}
/**
 * Starts a quiz session and returns a sessionId as well as adding it to the quiz
 * @param token  The token object containing sessionId to identify the session
 * @param quizId The Id of the quiz to create a copy/active session of
 * @param autoStartNum The number of people required for the quiz to auto start
 * @returns
 */
export function adminQuizSessionStart (token: Token, quizId: number, autoStartNum: number): adminQuizSessionStartResponse {
  const data = getData();

  // Find the quiz and user
  const originalQuiz: Quiz = data.quizzes.find(quiz => quiz.quizId === quizId);
  const quizTrash: Quiz | undefined = data.trash.find(quiz => quiz.quizId === quizId);
  const user = data.users.find(user => user.sessions.includes(token.sessionId));

  // 401
  if (!user) {
    throw new Error('Token is invalid');
  }

  // 403
  if (!originalQuiz && quizTrash === undefined) {
    throw new Error('Quiz does not exist');
  }

  // 403
  const userQuizValid = checkUserQuizValidity(token, quizId);

  if ('error' in userQuizValid && quizTrash === undefined) {
    throw new Error('User does not own this quiz');
  }

  // 400
  if (quizTrash) {
    console.log('in the if statement');
    throw new Error('The quiz is in trash');
  }

  // 400
  if (autoStartNum > 50) {
    throw new Error('Player threshold cannot be greater than 50');
  }

  // 400
  if (originalQuiz.numQuestions === 0 || originalQuiz.questions.length === 0) {
    throw new Error('This quiz has no questions');
  }

  // 400
  if (originalQuiz.activeSessions && originalQuiz.activeSessions.length >= 10) {
    throw new Error('There are too many active sessions for this quiz');
  }

  // Create copy of quiz
  const parentQuizInfo = adminQuizInfo(token, quizId);
  const copiedQuiz = JSON.parse(JSON.stringify(parentQuizInfo));

  copiedQuiz.authorId = originalQuiz.authorId;

  copiedQuiz.players = [];
  copiedQuiz.atQuestion = 0;
  copiedQuiz.messages = [];

  // Give it a parent id of the quiz id
  copiedQuiz.parentQuizId = quizId;

  // generate a session id
  const quizSessionId: number = generateSessionId();
  copiedQuiz.sessionId = quizSessionId;

  // set the starter values for the session
  copiedQuiz.autoStartNum = autoStartNum;
  copiedQuiz.quizState = QuizState.LOBBY;

  // Add it to the sessions array
  if (!originalQuiz.activeSessions) {
    originalQuiz.activeSessions = [];
  }
  originalQuiz.activeSessions.push(quizSessionId);
  if (!originalQuiz.inactiveSessions) {
    originalQuiz.inactiveSessions = [];
  }
  data.quizzes.push(copiedQuiz);
  setData(data);

  // Return the sessionId
  return { sessionId: quizSessionId };
}
