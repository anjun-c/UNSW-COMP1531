import { Token } from '../dataStore';
import { httpPlayerJoinSession, httpAdminQuizSessionStart, httpAdminAuthRegister, httpClear, httpAdminQuizCreateV2, httpAdminQuizQuestionsCreateV2, httpAdminQuizSessionUpdate } from './testHelper';
import { QuizActions } from '../states';

describe('PlayerJoinSession Tests', () => {
  let token: Token;
  let quizId: number;
  let sessionId: number;

  beforeEach(() => {
    httpClear();
    const registerResult = httpAdminAuthRegister('oliver@unsw.edu.au', 'testpassword1', 'oliver', 'bowling');
    token = JSON.parse(registerResult.jsonBody.token as string);

    const quizCreateResult = httpAdminQuizCreateV2(token, 'My Quiz', 'Quiz Description');
    quizId = quizCreateResult.jsonBody.quizId as number;

    const questionBody = {
      question: 'Test Quiz 1',
      duration: 3,
      points: 1,
      answers: [{ answer: 'Test Answer 1', correct: true },
        { answer: 'Test Answe 2', correct: false },
        { answer: 'Test Answer 3', correct: false },
        { answer: 'Test Answer 4', correct: false }
      ]
    };

    httpAdminQuizQuestionsCreateV2(token, quizId, questionBody);
    const sessionStartResult = httpAdminQuizSessionStart(token, quizId, 1);
    sessionId = sessionStartResult.jsonBody.sessionId as number;
  });

  test('Successful player join', () => {
    const result = httpPlayerJoinSession(sessionId, 'Hayden Smith');
    expect(result.statusCode).toBe(200);
    expect(result.jsonBody.playerId).toStrictEqual(expect.any(Number));
  });

  test('Join with empty name should generate random name', () => {
    const result = httpPlayerJoinSession(sessionId, '');
    expect(result.statusCode).toBe(200);
    expect(result.jsonBody.playerId).toStrictEqual(expect.any(Number));
  });

  test('Duplicate name should return 400', () => {
    httpPlayerJoinSession(sessionId, 'Hayden Smith');
    const result2 = httpPlayerJoinSession(sessionId, 'Hayden Smith');
    expect(result2.statusCode).toBe(400);
    expect(result2.jsonBody.error).toStrictEqual(expect.any(String));
  });

  test('Invalid session id should return 400', () => {
    const result = httpPlayerJoinSession(9999, 'Hayden Smith');
    expect(result.statusCode).toBe(400);
    expect(result.jsonBody.error).toStrictEqual(expect.any(String));
  });

  test('Session not in LOBBY state should return 400', () => {
    httpAdminQuizSessionUpdate(token, quizId, sessionId, QuizActions.NEXT_QUESTION);
    const result = httpPlayerJoinSession(sessionId, 'Hayden Smith');
    expect(result.statusCode).toBe(400);
    expect(result.jsonBody.error).toStrictEqual(expect.any(String));
  });
});
