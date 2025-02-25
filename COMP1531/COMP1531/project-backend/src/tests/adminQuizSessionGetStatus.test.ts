import { Token } from '../dataStore';
import { QuizActions } from '../states';
import { httpAdminQuizSessionGetStatus, httpAdminAuthRegister, httpAdminQuizCreateV2, httpAdminQuizQuestionsCreateV2, httpAdminQuizSessionStart, httpClear, httpAdminQuizSessionUpdate } from './testHelper';

describe('AdminQuizSessionGetStatus 401', () => {
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
    sessionId = sessionResult.jsonBody.sessionId as number;
  });

  test('Invalid token', () => {
    const invalidToken = { sessionId: 'hello' };
    const getSessionResult = httpAdminQuizSessionGetStatus(invalidToken, quizId, sessionId);
    expect(getSessionResult.statusCode).toBe(401);
    expect(getSessionResult.jsonBody.error).toStrictEqual(expect.any(String));
  });

  test('Empty token', () => {
    const emptyToken = { sessionId: '' };
    const getSessionResult = httpAdminQuizSessionGetStatus(emptyToken, quizId, sessionId);
    expect(getSessionResult.statusCode).toBe(401);
    expect(getSessionResult.jsonBody.error).toStrictEqual(expect.any(String));
  });

  test('401 and 403 error - checking that 401 is thrown first as required', () => {
    const invalidToken = { sessionId: 'hello' };
    const invalidQuizId = 0;
    const getSessionResult = httpAdminQuizSessionGetStatus(invalidToken, invalidQuizId, sessionId);
    expect(getSessionResult.statusCode).toBe(401);
    expect(getSessionResult.jsonBody.error).toStrictEqual(expect.any(String));
  });
});

describe('QuizSessionsView 403', () => {
  let token: Token;
  let token2: Token;
  let quizId: number;
  let sessionId: number;
  beforeEach(() => {
    httpClear();
    const registerResult = httpAdminAuthRegister('oliver@unsw.edu.au', 'testpassword1', 'oliver', 'bowling');
    token = JSON.parse(registerResult.jsonBody.token as string);
    const quizCreateResult = httpAdminQuizCreateV2(token, 'My Quiz', 'Quiz Description');
    quizId = quizCreateResult.jsonBody.quizId as number;

    const registerResult2 = httpAdminAuthRegister('vlad@unsw.edu.au', 'testpassword1', 'vlad', 'klymenhko');
    token2 = JSON.parse(registerResult2.jsonBody.token as string);

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
    sessionId = sessionResult.jsonBody.sessionId as number;
  });

  test('User does not own this quiz', () => {
    const getSessionResult = httpAdminQuizSessionGetStatus(token2, quizId, sessionId);
    expect(getSessionResult.jsonBody.error).toStrictEqual(expect.any(String));
    expect(getSessionResult.statusCode).toBe(403);
  });

  test('Quiz does not exist', () => {
    const fakeQuizId = 0;
    const getSessionResult = httpAdminQuizSessionGetStatus(token, fakeQuizId, sessionId);
    expect(getSessionResult.jsonBody.error).toStrictEqual(expect.any(String));
    expect(getSessionResult.statusCode).toBe(403);
  });
});

describe('Success Case ', () => {
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
    sessionId = sessionResult.jsonBody.sessionId as number;
  });

  test('User does not own this quiz', () => {
    let state: QuizActions;
    let getSessionResult = httpAdminQuizSessionGetStatus(token, quizId, sessionId);
    expect(getSessionResult.statusCode).toBe(200);
    state = getSessionResult.jsonBody.state as QuizActions;
    expect(state).toStrictEqual('LOBBY');
    const sessionUpdateResult = httpAdminQuizSessionUpdate(token, quizId, sessionId, QuizActions.NEXT_QUESTION);
    expect(sessionUpdateResult.statusCode).toBe(200);

    getSessionResult = httpAdminQuizSessionGetStatus(token, quizId, sessionId); // update state
    state = getSessionResult.jsonBody.state as QuizActions;
    expect(state).toStrictEqual('QUESTION_COUNTDOWN');
    // My status should automatically change in the next 4 second
    // set a var to current time and then do nothing in a while loop until current time is 4 seconds later
    // then check the status again
    let startTime = Date.now();
    let currentTime = Date.now();
    while (currentTime - startTime < 3000) {
      currentTime = Date.now();
    }
    getSessionResult = httpAdminQuizSessionGetStatus(token, quizId, sessionId);
    state = getSessionResult.jsonBody.state as QuizActions;
    expect(state).toStrictEqual('QUESTION_OPEN');

    startTime = Date.now();
    currentTime = Date.now();
    while (currentTime - startTime < 5000) {
      currentTime = Date.now();
    }
    getSessionResult = httpAdminQuizSessionGetStatus(token, quizId, sessionId);
    state = getSessionResult.jsonBody.state as QuizActions;
    expect(state).toStrictEqual('QUESTION_CLOSE');
  });
});
