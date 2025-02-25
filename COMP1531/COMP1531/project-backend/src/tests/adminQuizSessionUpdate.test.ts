import {
  httpAdminQuizSessionUpdate,
  httpClear,
  httpAdminAuthRegister,
  httpAdminQuizCreateV2,
  httpAdminQuizSessionStart,
  httpAdminQuizQuestionsCreateV2,
  httpAdminQuizSessionGetStatus,
} from './testHelper';
import { Token } from '../dataStore';
import { QuizActions } from '../states';

describe('Success Case 200', () => {
  let token: Token;
  let quizId: number;
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

  const questionBody2 = {
    question: 'Test question2',
    duration: 3,
    points: 5,
    answers: [{ answer: 'Test Answer 1', correct: true },
      { answer: 'Test Answer 2', correct: false },
      { answer: 'Test Answer 3', correct: false },
      { answer: 'Test Answer 4', correct: false }
    ]
  };

  const questionBody3 = {
    question: 'Test question3',
    duration: 3,
    points: 5,
    answers: [{ answer: 'Test Answer 1', correct: true },
      { answer: 'Test Answer 2', correct: false },
      { answer: 'Test Answer 3', correct: false },
      { answer: 'Test Answer 4', correct: false }
    ]
  };
  beforeEach(() => {
    httpClear();
    const registerResult = httpAdminAuthRegister('oliver@unsw.edu.au', 'testpassword1', 'oliver', 'bowling');
    token = JSON.parse(registerResult.jsonBody.token as string);
    const quizCreateResult = httpAdminQuizCreateV2(token, 'My Quiz', 'Quiz Description');
    quizId = quizCreateResult.jsonBody.quizId as number;
  });

  test('Basic success case', () => {
    expect(httpAdminQuizQuestionsCreateV2(token, quizId, questionBody).statusCode).toBe(200);
    expect(httpAdminQuizQuestionsCreateV2(token, quizId, questionBody2).statusCode).toBe(200);
    expect(httpAdminQuizQuestionsCreateV2(token, quizId, questionBody3).statusCode).toBe(200);
    const sessionResult = httpAdminQuizSessionStart(token, quizId, 3);
    expect(sessionResult.statusCode).toBe(200);
    expect(sessionResult.jsonBody.sessionId).toEqual(expect.any(Number));
    const sessionId = sessionResult.jsonBody.sessionId as number;
    let sessionInfo = httpAdminQuizSessionGetStatus(token, quizId, sessionId);
    expect(sessionInfo.jsonBody.atQuestion).toStrictEqual(0);
    expect(sessionInfo.jsonBody.state).toStrictEqual('LOBBY');

    const sessionUpdateResult1 = httpAdminQuizSessionUpdate(token, quizId, sessionId, QuizActions.NEXT_QUESTION);
    sessionInfo = httpAdminQuizSessionGetStatus(token, quizId, sessionId); // Update sessionInfo
    expect(sessionUpdateResult1.statusCode).toBe(200);
    // Side effect testing
    expect(sessionInfo.jsonBody.atQuestion).toStrictEqual(1);
    expect(sessionInfo.jsonBody.state).toStrictEqual('QUESTION_COUNTDOWN');

    const sessionUpdateResult2 = httpAdminQuizSessionUpdate(token, quizId, sessionId, QuizActions.SKIP_COUNTDOWN);
    sessionInfo = httpAdminQuizSessionGetStatus(token, quizId, sessionId); // Update sessionInfo
    expect(sessionUpdateResult2.statusCode).toBe(200);
    // Side effect testing
    expect(sessionInfo.jsonBody.atQuestion).toStrictEqual(1);
    expect(sessionInfo.jsonBody.state).toStrictEqual('QUESTION_OPEN');
    // After 5 seconds
    const startTime = Date.now();
    let currentTime = Date.now();
    while (currentTime - startTime < 6000) {
      currentTime = Date.now();
    }
    sessionInfo = httpAdminQuizSessionGetStatus(token, quizId, sessionId); // Update sessionInfo
    expect(sessionInfo.jsonBody.state).toStrictEqual('QUESTION_CLOSE');

    const sessionUpdateResult3 = httpAdminQuizSessionUpdate(token, quizId, sessionId, QuizActions.GO_TO_ANSWER);
    sessionInfo = httpAdminQuizSessionGetStatus(token, quizId, sessionId); // Update sessionInfo
    expect(sessionUpdateResult3.statusCode).toBe(200);
    // Side effect testing
    expect(sessionInfo.jsonBody.state).toStrictEqual('ANSWER_SHOW');

    const sessionUpdateResult4 = httpAdminQuizSessionUpdate(token, quizId, sessionId, QuizActions.GO_TO_FINAL_RESULTS);
    sessionInfo = httpAdminQuizSessionGetStatus(token, quizId, sessionId); // Update sessionInfo
    expect(sessionUpdateResult4.statusCode).toBe(200);
    // Side effect testing
    expect(sessionInfo.jsonBody.state).toStrictEqual('FINAL_RESULTS');

    const sessionUpdateResult5 = httpAdminQuizSessionUpdate(token, quizId, sessionId, QuizActions.END);
    sessionInfo = httpAdminQuizSessionGetStatus(token, quizId, sessionId); // Update sessionInfo
    expect(sessionUpdateResult5.statusCode).toBe(200);
    // Side effect testing
    expect(sessionInfo.jsonBody.state).toStrictEqual('END');
  });
});

describe('QuizSessionUpdate 401 and 403', () => {
  let token: Token;
  let token2: Token;
  let quizId: number;
  let sessionId: number;
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

  const questionBody2 = {
    question: 'Test question2',
    duration: 3,
    points: 5,
    answers: [{ answer: 'Test Answer 1', correct: true },
      { answer: 'Test Answer 2', correct: false },
      { answer: 'Test Answer 3', correct: false },
      { answer: 'Test Answer 4', correct: false }
    ]
  };

  const questionBody3 = {
    question: 'Test question3',
    duration: 3,
    points: 6,
    answers: [{ answer: 'Test Answer 1', correct: true },
      { answer: 'Test Answer 2', correct: false },
      { answer: 'Test Answer 3', correct: false },
      { answer: 'Test Answer 4', correct: false }
    ]
  };

  beforeEach(() => {
    httpClear();
    const registerResult = httpAdminAuthRegister('oliver@unsw.edu.au', 'testpassword1', 'oliver', 'bowling');
    token = JSON.parse(registerResult.jsonBody.token as string);

    const registerResult2 = httpAdminAuthRegister('vlad@unsw.edu.au', 'testpassword1', 'vlad', 'klymenko');
    token2 = JSON.parse(registerResult2.jsonBody.token as string);

    const quizCreateResult = httpAdminQuizCreateV2(token, 'My Quiz', 'Quiz Description');
    quizId = quizCreateResult.jsonBody.quizId as number;

    const questionAddResult1 = httpAdminQuizQuestionsCreateV2(token, quizId, questionBody);
    expect(questionAddResult1.statusCode).toBe(200);
    const questionAddResult2 = httpAdminQuizQuestionsCreateV2(token, quizId, questionBody2);
    expect(questionAddResult2.statusCode).toBe(200);
    const questionAddResult3 = httpAdminQuizQuestionsCreateV2(token, quizId, questionBody3);
    expect(questionAddResult3.statusCode).toBe(200);

    const sessionResult = httpAdminQuizSessionStart(token, quizId, 2);
    sessionId = sessionResult.jsonBody.sessionId as number;
  });

  test('Valid token is provided, but quiz doesnt exist', () => {
    const fakeQuizId = 29;
    const updateResult = httpAdminQuizSessionUpdate(token, fakeQuizId, sessionId, QuizActions.NEXT_QUESTION);
    expect(updateResult.jsonBody.error).toStrictEqual(expect.any(String));
    expect(updateResult.statusCode).toBe(403);
  });

  test('Valid token is provided, but user doesnt own quiz', () => {
    const updateResult = httpAdminQuizSessionUpdate(token2, quizId, sessionId, QuizActions.NEXT_QUESTION);
    expect(updateResult.jsonBody.error).toStrictEqual(expect.any(String));
    expect(updateResult.statusCode).toBe(403);
  });

  test('Invalid token is provided', () => {
    const badToken = { sessionId: 'badToken' };
    const updateResult = httpAdminQuizSessionUpdate(badToken, quizId, sessionId, QuizActions.NEXT_QUESTION);
    expect(updateResult.jsonBody.error).toStrictEqual(expect.any(String));
    expect(updateResult.statusCode).toBe(401);
  });

  test('Empty token is provided', () => {
    const badToken = { sessionId: '' };
    const updateResult = httpAdminQuizSessionUpdate(badToken, quizId, sessionId, QuizActions.NEXT_QUESTION);
    expect(updateResult.jsonBody.error).toStrictEqual(expect.any(String));
    expect(updateResult.statusCode).toBe(401);
  });
});
describe('Error Case 400', () => {
  let token: Token;
  let quizId: number;
  let sessionId: number;
  beforeEach(() => {
    httpClear();
    const registerResult = httpAdminAuthRegister('oliver@unsw.edu.au', 'testpassword1', 'oliver', 'bowling');
    token = JSON.parse(registerResult.jsonBody.token as string);
    const quizCreateResult = httpAdminQuizCreateV2(token, 'My Quiz', 'Quiz Description');
    quizId = quizCreateResult.jsonBody.quizId as number;
    const sessionResult = httpAdminQuizSessionStart(token, quizId, 3);
    sessionId = sessionResult.jsonBody.sessionId as number;
  });

  test('Invalid session id', () => {
    const invalidSessionId = 999;
    const updateResult = httpAdminQuizSessionUpdate(token, quizId, invalidSessionId, QuizActions.NEXT_QUESTION);
    expect(updateResult.jsonBody.error).toStrictEqual(expect.any(String));
    expect(updateResult.statusCode).toBe(400);
  });

  test('Action cannot be applied in the current state', () => {
    // Start the quiz session
    httpAdminQuizSessionUpdate(token, quizId, sessionId, QuizActions.NEXT_QUESTION);
    // Try to skip countdown when the state is not QUESTION_COUNTDOWN
    const updateResult = httpAdminQuizSessionUpdate(token, quizId, sessionId, QuizActions.SKIP_COUNTDOWN);
    expect(updateResult.jsonBody.error).toStrictEqual(expect.any(String));
    expect(updateResult.statusCode).toBe(400);
  });
});
