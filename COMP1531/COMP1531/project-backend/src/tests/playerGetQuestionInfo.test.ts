import { httpPlayerGetQuestionInfo, httpAdminQuizSessionStart, httpAdminAuthRegister, httpClear, httpAdminQuizCreateV2, httpAdminQuizQuestionsCreateV2, httpPlayerJoinSession, httpAdminQuizSessionUpdate } from './testHelper';
import { Token } from '../dataStore';
import { QuizActions } from '../states';

describe('Get Player Question Tests', () => {
  let token: Token;
  let quizId: number;
  let sessionId: number;
  let playerId: number;

  beforeEach(() => {
    httpClear();
    const registerResult = httpAdminAuthRegister('oliver@unsw.edu.au', 'testpassword1', 'oliver', 'bowling');
    token = JSON.parse(registerResult.jsonBody.token as string);

    const quizCreateResult = httpAdminQuizCreateV2(token, 'My Quiz', 'Quiz Description');
    quizId = quizCreateResult.jsonBody.quizId as number;

    const questionBody1 = {
      question: 'Test Quiz 1',
      duration: 3,
      points: 1,
      answers: [
        { answer: 'Test Answer 1', correct: true, colour: 'red' },
        { answer: 'Test Answer 2', correct: false, colour: 'blue' },
        { answer: 'Test Answer 3', correct: false, colour: 'green' },
        { answer: 'Test Answer 4', correct: false, colour: 'yellow' }
      ]
    };

    const questionBody2 = {
      question: 'Test Quiz 2',
      duration: 3,
      points: 1,
      answers: [
        { answer: 'Test Answer 1', correct: true, colour: 'red' },
        { answer: 'Test Answer 2', correct: false, colour: 'blue' },
        { answer: 'Test Answer 3', correct: false, colour: 'green' },
        { answer: 'Test Answer 4', correct: false, colour: 'yellow' }
      ]
    };

    httpAdminQuizQuestionsCreateV2(token, quizId, questionBody1);
    httpAdminQuizQuestionsCreateV2(token, quizId, questionBody2);
    const sessionStartResult = httpAdminQuizSessionStart(token, quizId, 1);
    sessionId = sessionStartResult.jsonBody.sessionId as number;

    const playerJoinResult = httpPlayerJoinSession(sessionId, 'Hayden Smith');
    playerId = playerJoinResult.jsonBody.playerId as number;
  });

  test('Get question information successfully', () => {
    httpAdminQuizSessionUpdate(token, quizId, sessionId, QuizActions.NEXT_QUESTION);
    httpAdminQuizSessionUpdate(token, quizId, sessionId, QuizActions.SKIP_COUNTDOWN);
    httpAdminQuizSessionUpdate(token, quizId, sessionId, QuizActions.GO_TO_ANSWER);
    httpAdminQuizSessionUpdate(token, quizId, sessionId, QuizActions.NEXT_QUESTION);
    httpAdminQuizSessionUpdate(token, quizId, sessionId, QuizActions.SKIP_COUNTDOWN);
    const result = httpPlayerGetQuestionInfo(playerId, 2);
    expect(result.statusCode).toBe(200);
    expect(result.jsonBody.questionId).toStrictEqual(expect.any(Number));
    expect(result.jsonBody.question).toBe('Test Quiz 2');
  });

  test('Invalid player ID returns 400', () => {
    const result = httpPlayerGetQuestionInfo(9999, 1);
    expect(result.statusCode).toBe(400);
    expect(result.jsonBody.error).toStrictEqual(expect.any(String));
  });

  test('Invalid question position returns 400', () => {
    const result = httpPlayerGetQuestionInfo(playerId, 9999);
    expect(result.statusCode).toBe(400);
    expect(result.jsonBody.error).toStrictEqual(expect.any(String));
  });

  test('Session is not currently on this question', () => {
    httpAdminQuizSessionUpdate(token, quizId, sessionId, QuizActions.NEXT_QUESTION);
    httpAdminQuizSessionUpdate(token, quizId, sessionId, QuizActions.SKIP_COUNTDOWN);
    httpAdminQuizSessionUpdate(token, quizId, sessionId, QuizActions.GO_TO_ANSWER);
    httpAdminQuizSessionUpdate(token, quizId, sessionId, QuizActions.NEXT_QUESTION);
    httpAdminQuizSessionUpdate(token, quizId, sessionId, QuizActions.SKIP_COUNTDOWN);
    const result = httpPlayerGetQuestionInfo(playerId, 1);
    expect(result.statusCode).toBe(400);
    expect(result.jsonBody.error).toStrictEqual(expect.any(String));
  });

  // Additional test cases for other error conditions will be added similarly
});
