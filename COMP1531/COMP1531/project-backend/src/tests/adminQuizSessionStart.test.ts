import { Token } from '../dataStore';
import { httpAdminQuizSessionStart, httpAdminAuthRegister, httpClear, httpAdminQuizCreateV2, httpAdminQuizQuestionsCreateV2, httpAdminQuizRemoveV2, httpAdminQuizSessionsView } from './testHelper';

describe('QuizSessionStart 401 and 403', () => {
  let token: Token;
  let token2: Token;
  let quizId: number;
  beforeEach(() => {
    httpClear();
    const registerResult = httpAdminAuthRegister('oliver@unsw.edu.au', 'testpassword1', 'oliver', 'bowling');
    token = JSON.parse(registerResult.jsonBody.token as string);

    const registerResult2 = httpAdminAuthRegister('vlad@unsw.edu.au', 'testpassword1', 'vlad', 'klymenko');
    token2 = JSON.parse(registerResult2.jsonBody.token as string);

    const quizCreateResult = httpAdminQuizCreateV2(token, 'My Quiz', 'Quiz Description');
    quizId = quizCreateResult.jsonBody.quizId as number;
  });

  test('Valid token is provided, but quiz doesnt exist', () => {
    const fakeQuizId = 29;
    const sessionResult = httpAdminQuizSessionStart(token, fakeQuizId, 1);
    expect(sessionResult.jsonBody.error).toStrictEqual(expect.any(String));
    expect(sessionResult.statusCode).toBe(403);
  });

  test('Valid token is provided, but user doesnt own quiz', () => {
    const sessionResult = httpAdminQuizSessionStart(token2, quizId, 1);
    expect(sessionResult.jsonBody.error).toStrictEqual(expect.any(String));
    expect(sessionResult.statusCode).toBe(403);
  });

  test('Invalid token is provided', () => {
    const badToken = { sessionId: 'badToken' };
    const sessionResult = httpAdminQuizSessionStart(badToken, quizId, 1);
    expect(sessionResult.jsonBody.error).toStrictEqual(expect.any(String));
    expect(sessionResult.statusCode).toBe(401);
  });

  test('Empty token is provided', () => {
    const badToken = { sessionId: '' };
    const sessionResult = httpAdminQuizSessionStart(badToken, quizId, 1);
    expect(sessionResult.jsonBody.error).toStrictEqual(expect.any(String));
    expect(sessionResult.statusCode).toBe(401);
  });
});

describe('QuizSessionStart 400', () => {
  let token: Token;
  let quizId: number;
  beforeEach(() => {
    httpClear();
    const registerResult = httpAdminAuthRegister('oliver@unsw.edu.au', 'testpassword1', 'oliver', 'bowling');
    token = JSON.parse(registerResult.jsonBody.token as string);

    const quizCreateResult = httpAdminQuizCreateV2(token, 'My Quiz', 'Quiz Description');
    quizId = quizCreateResult.jsonBody.quizId as number;
  });

  test('AutoStartNumber is over 50', () => {
    const questionBody = {
      question: 'Test question',
      duration: 4,
      points: 5,
      answers: [{ answer: 'Test Answer 1', correct: true },
        { answer: 'Test Answer 2', correct: false },
        { answer: 'Test Answer 3', correct: false },
        { answer: 'Test Answer 4', correct: false }
      ]
    };

    expect(httpAdminQuizQuestionsCreateV2(token, quizId, questionBody).jsonBody.questionId).toBeDefined();

    const sessionResult = httpAdminQuizSessionStart(token, quizId, 51);
    expect(sessionResult.jsonBody.error).toStrictEqual(expect.any(String));
    expect(sessionResult.statusCode).toBe(400);
  });

  test('Too many active sessions', () => {
    const questionBody = {
      question: 'Test question',
      duration: 4,
      points: 5,
      answers: [{ answer: 'Test Answer 1', correct: true },
        { answer: 'Test Answer 2', correct: false },
        { answer: 'Test Answer 3', correct: false },
        { answer: 'Test Answer 4', correct: false }
      ]
    };

    expect(httpAdminQuizQuestionsCreateV2(token, quizId, questionBody).jsonBody.questionId).toBeDefined();
    for (let i = 10; i < 20; i++) {
      httpAdminQuizSessionStart(token, quizId, 10);
    }
    const sessionResult = httpAdminQuizSessionStart(token, quizId, 10);
    expect(sessionResult.jsonBody.error).toStrictEqual(expect.any(String));
    expect(sessionResult.statusCode).toBe(400);
  });

  test('Quiz has no questions', () => {
    const sessionResult = httpAdminQuizSessionStart(token, quizId, 1);
    expect(sessionResult.jsonBody.error).toStrictEqual(expect.any(String));
    expect(sessionResult.statusCode).toBe(400);
  });

  test('The quiz is in trash', () => {
    httpAdminQuizRemoveV2(token, quizId);
    const sessionResult = httpAdminQuizSessionStart(token, quizId, 1);
    expect(sessionResult.jsonBody.error).toStrictEqual(expect.any(String));
    expect(sessionResult.statusCode).toBe(400);
  });
});

describe('Success Case 200', () => {
  let token: Token;
  let quizId: number;
  beforeEach(() => {
    httpClear();
    const registerResult = httpAdminAuthRegister('oliver@unsw.edu.au', 'testpassword1', 'oliver', 'bowling');
    token = JSON.parse(registerResult.jsonBody.token as string);
    const quizCreateResult = httpAdminQuizCreateV2(token, 'My Quiz', 'Quiz Description');
    quizId = quizCreateResult.jsonBody.quizId as number;
  });

  test('Basic success case', () => {
    const questionBody = {
      question: 'Test question',
      duration: 4,
      points: 5,
      answers: [{ answer: 'Test Answer 1', correct: true },
        { answer: 'Test Answer 2', correct: false },
        { answer: 'Test Answer 3', correct: false },
        { answer: 'Test Answer 4', correct: false }
      ]
    };

    httpAdminQuizQuestionsCreateV2(token, quizId, questionBody);
    const sessionResult = httpAdminQuizSessionStart(token, quizId, 3);
    const sessionId = sessionResult.jsonBody.sessionId;

    expect(sessionId).toBeDefined();
    expect(sessionResult.statusCode).toBe(200);

    const viewSessionResult = httpAdminQuizSessionsView(token, quizId);
    const activeSessions = viewSessionResult.jsonBody.activeSessions as number[];
    expect(activeSessions).toContain(sessionId);
    expect(sessionId).toEqual(expect.any(Number));
  });
});
