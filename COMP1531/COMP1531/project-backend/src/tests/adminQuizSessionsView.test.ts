import { Token } from '../dataStore';
import { QuizActions } from '../states';
import { httpAdminAuthRegister, httpAdminQuizCreateV2, httpAdminQuizQuestionsCreateV2, httpAdminQuizSessionGetStatus, httpAdminQuizSessionStart, httpAdminQuizSessionsView, httpAdminQuizSessionUpdate, httpClear } from './testHelper';

describe('QuizSessionsView 401', () => {
  let token: Token;
  let quizId: number;
  beforeEach(() => {
    httpClear();
    const registerResult = httpAdminAuthRegister('oliver@unsw.edu.au', 'testpassword1', 'oliver', 'bowling');
    token = JSON.parse(registerResult.jsonBody.token as string);

    const quizCreateResult = httpAdminQuizCreateV2(token, 'My Quiz', 'Quiz Description');
    quizId = quizCreateResult.jsonBody.quizId as number;

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
    httpAdminQuizSessionStart(token, quizId, 3);
  });

  test('Invalid token', () => {
    const invalidToken = { sessionId: 'hello' };
    const viewSessionResult = httpAdminQuizSessionsView(invalidToken, quizId);
    expect(viewSessionResult.statusCode).toBe(401);
    expect(viewSessionResult.jsonBody.error).toStrictEqual(expect.any(String));
  });

  test('Empty token', () => {
    const emptyToken = { sessionId: '' };
    const viewSessionResult = httpAdminQuizSessionsView(emptyToken, quizId);
    expect(viewSessionResult.statusCode).toBe(401);
    expect(viewSessionResult.jsonBody.error).toStrictEqual(expect.any(String));
  });

  test('401 and 403 error - checking that 401 is thrown first as required', () => {
    const invalidToken = { sessionId: 'hello' };
    const invalidQuizId = 0;
    const viewSessionResult = httpAdminQuizSessionsView(invalidToken, invalidQuizId);
    expect(viewSessionResult.statusCode).toBe(401);
    expect(viewSessionResult.jsonBody.error).toStrictEqual(expect.any(String));
  });
});

describe('QuizSessionsView 403', () => {
  let token: Token;
  let token2: Token;
  let quizId: number;
  beforeEach(() => {
    httpClear();
    const registerResult = httpAdminAuthRegister('oliver@unsw.edu.au', 'testpassword1', 'oliver', 'bowling');
    token = JSON.parse(registerResult.jsonBody.token as string);

    const registerResult2 = httpAdminAuthRegister('oliver2@unsw.edu.au', 'testpassword2', 'henry', 'bowling');
    token2 = JSON.parse(registerResult2.jsonBody.token as string);

    const quizCreateResult = httpAdminQuizCreateV2(token, 'My Quiz', 'Quiz Description');
    quizId = quizCreateResult.jsonBody.quizId as number;

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
    httpAdminQuizSessionStart(token, quizId, 3);
  });

  test('User does not own this quiz', () => {
    const viewSessionResult = httpAdminQuizSessionsView(token2, quizId);
    expect(viewSessionResult.jsonBody.error).toStrictEqual(expect.any(String));
    expect(viewSessionResult.statusCode).toBe(403);
  });

  test('Quiz does not exist', () => {
    const fakeQuizId = 0;
    const viewSessionResult = httpAdminQuizSessionsView(token, fakeQuizId);
    expect(viewSessionResult.jsonBody.error).toStrictEqual(expect.any(String));
    expect(viewSessionResult.statusCode).toBe(403);
  });
});

describe('QuizSessionsView success cases', () => {
  let token: Token;
  let quizId: number;
  let sessionIds: number[];
  beforeEach(() => {
    httpClear();
    const registerResult = httpAdminAuthRegister('oliver@unsw.edu.au', 'testpassword1', 'oliver', 'bowling');
    token = JSON.parse(registerResult.jsonBody.token as string);

    const quizCreateResult = httpAdminQuizCreateV2(token, 'My Quiz', 'Quiz Description');
    quizId = quizCreateResult.jsonBody.quizId as number;

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
    sessionIds = [];
    for (let i = 0; i < 3; i++) {
      const sessionResult = httpAdminQuizSessionStart(token, quizId, 3);
      sessionIds.push(sessionResult.jsonBody.sessionId as number);
    }
  });

  test('Success case for active sessions - ensure none are in END state and are in ascending order', () => {
    const viewSessionResult = httpAdminQuizSessionsView(token, quizId);
    const resultBody = viewSessionResult.jsonBody;

    expect(resultBody).toHaveProperty('activeSessions');
    expect(Array.isArray(resultBody.activeSessions)).toBe(true);

    const activeSessions = resultBody.activeSessions as number[];

    for (let i = 0; i < activeSessions.length; i++) {
      const state = httpAdminQuizSessionGetStatus(token, quizId, activeSessions[i]).jsonBody.state;
      expect(state).not.toBe('END');
    }

    for (let i = 1; i < activeSessions.length; i++) {
      expect(activeSessions[i]).toBeGreaterThan(activeSessions[i - 1]);
    }
  });

  test('Success case for inactive sessions - ensure all are in END state and are in ascending order', () => {
    for (let i = 0; i < sessionIds.length; i++) {
      httpAdminQuizSessionUpdate(token, quizId, sessionIds[i], QuizActions.END);
    }

    const viewSessionResult = httpAdminQuizSessionsView(token, quizId);
    const resultBody = viewSessionResult.jsonBody;

    expect(resultBody).toHaveProperty('inactiveSessions');
    expect(Array.isArray(resultBody.inactiveSessions)).toBe(true);

    const inactiveSessions = resultBody.inactiveSessions as number[];
    expect(inactiveSessions.length).toBe(3);

    for (let i = 0; i < inactiveSessions.length; i++) {
      const statusReturn = httpAdminQuizSessionGetStatus(token, quizId, inactiveSessions[i]).jsonBody;
      expect(statusReturn.state).toBe('END');
    }

    for (let i = 1; i < inactiveSessions.length; i++) {
      expect(inactiveSessions[i]).toBeGreaterThan(inactiveSessions[i - 1]);
    }
  });
});

describe('QuizSessionView no sessions made', () => {
  let token: Token;
  let quizId: number;
  beforeEach(() => {
    httpClear();
    const registerResult = httpAdminAuthRegister('oliver@unsw.edu.au', 'testpassword1', 'oliver', 'bowling');
    token = JSON.parse(registerResult.jsonBody.token as string);

    const quizCreateResult = httpAdminQuizCreateV2(token, 'My Quiz', 'Quiz Description');
    quizId = quizCreateResult.jsonBody.quizId as number;

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
  });

  test('No sessions made at all', () => {
    const viewSessionResult = httpAdminQuizSessionsView(token, quizId);
    const resultBody = viewSessionResult.jsonBody;
    expect(viewSessionResult.statusCode).toStrictEqual(200);
    expect(resultBody.activeSessions).toStrictEqual([]);
    expect(resultBody.inactiveSessions).toStrictEqual([]);
  });

  test('No inactive sessions with 1 active session', () => {
    const sessionResult = httpAdminQuizSessionStart(token, quizId, 1);
    const sessionId = sessionResult.jsonBody.sessionId as number;

    const viewSessionResult = httpAdminQuizSessionsView(token, quizId);
    const resultBody = viewSessionResult.jsonBody;

    expect(viewSessionResult.statusCode).toStrictEqual(200);
    expect(resultBody.activeSessions).toStrictEqual([sessionId]);
    expect(resultBody.inactiveSessions).toStrictEqual([]);
  });

  test('No active sessions with 1 inactive session', () => {
    const sessionResult = httpAdminQuizSessionStart(token, quizId, 1);
    const sessionId = sessionResult.jsonBody.sessionId as number;

    httpAdminQuizSessionUpdate(token, quizId, sessionId, QuizActions.END);

    const viewSessionResult = httpAdminQuizSessionsView(token, quizId);
    const resultBody = viewSessionResult.jsonBody;

    expect(viewSessionResult.statusCode).toStrictEqual(200);
    expect(resultBody.activeSessions).toStrictEqual([]);
    expect(resultBody.inactiveSessions).toStrictEqual([sessionId]);
  });
});
