import { httpAdminQuizQuestionsCreate, httpAdminUserDetails, httpAdminAuthRegister, httpAdminQuizCreate, httpAdminQuizTransfer, httpClear } from './testHelper';
import { Token } from '../dataStore';

describe('Testing POST - adminQuizTransfer', () => {
  beforeEach(() => {
    httpClear();
  });

  test('Correct status code for valid transfer', () => {
    const registerResult = httpAdminAuthRegister('oliver@unsw.edu.au', 'testpassword1', 'oliver', 'bowling');
    expect(registerResult.statusCode).toBe(200);
    const token1: Token = JSON.parse(registerResult.jsonBody.token as string);
    expect(token1).toBeDefined();
    expect(httpAdminUserDetails(token1).jsonBody.error).toBeUndefined();

    const userEmail = 'newUser@unsw.edu.au';
    const newUserResult = httpAdminAuthRegister(userEmail, 'testPassword2', 'New', 'User');
    expect(newUserResult.statusCode).toBe(200);
    const newUserToken = JSON.parse(newUserResult.jsonBody.token as string);
    expect(httpAdminUserDetails(newUserToken).jsonBody.error).toBeUndefined();

    const createQuizResult = httpAdminQuizCreate(token1, 'Sample Quiz', 'This is a test quiz');
    expect(createQuizResult.statusCode).toBe(200);
    const quizId = createQuizResult.jsonBody.quizId as number;
    expect(quizId).toBeDefined();

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

    // Test side effect - making sure the quiz actually moved owners by seeing if the user can make a question
    expect(httpAdminQuizQuestionsCreate(token1, quizId, questionBody).jsonBody.questionId).toBeDefined();

    const transferResult = httpAdminQuizTransfer(quizId, token1, userEmail);
    expect(transferResult.statusCode).toBe(200);
    expect(transferResult.jsonBody).toEqual({});

    // Make sure that only the new user owns the quiz (can add questions)
    httpAdminQuizQuestionsCreate(newUserToken, quizId, questionBody);
    expect(httpAdminQuizQuestionsCreate(newUserToken, quizId, questionBody).jsonBody.questionId).toBeDefined();
    expect(httpAdminQuizQuestionsCreate(token1, quizId, questionBody).jsonBody.error).toBeDefined();
  });

  test('Correct status code for invalid token', () => {
    const invalidToken: Token = { sessionId: 'invalidToken' };
    const userEmail = 'newUser@unsw.edu.au';

    const quizId = 1;
    const transferResult = httpAdminQuizTransfer(quizId, invalidToken, userEmail);
    expect(transferResult.statusCode).toBe(401);
    expect(transferResult.jsonBody.error).toEqual(expect.any(String));
  });

  test('Correct status code for user not found', () => {
    const registerResult = httpAdminAuthRegister('oliver@unsw.edu.au', 'testpassword1', 'oliver', 'bowling');
    expect(registerResult.statusCode).toBe(200);
    const token: Token = JSON.parse(registerResult.jsonBody.token as string);
    expect(token).toBeDefined();

    const createQuizResult = httpAdminQuizCreate(token, 'Sample Quiz', 'This is a test quiz');
    expect(createQuizResult.statusCode).toBe(200);
    const quizId = createQuizResult.jsonBody.quizId as number;
    expect(quizId).toBeDefined();

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

    expect(httpAdminQuizQuestionsCreate(token, quizId, questionBody).jsonBody.questionId).toBeDefined();

    const userEmail = 'nonexistentuser@unsw.edu.au';
    const transferResult = httpAdminQuizTransfer(quizId, token, userEmail);
    expect(transferResult.statusCode).toBe(400);
    expect(transferResult.jsonBody.error).toEqual(expect.any(String));
  });

  test('Correct status code for email belongs to current user', () => {
    const registerResult = httpAdminAuthRegister('oliver@unsw.edu.au', 'testpassword1', 'oliver', 'bowling');
    expect(registerResult.statusCode).toBe(200);
    const token: Token = JSON.parse(registerResult.jsonBody.token as string);
    expect(token).toBeDefined();

    const createQuizResult = httpAdminQuizCreate(token, 'Sample Quiz', 'This is a test quiz');
    expect(createQuizResult.statusCode).toBe(200);
    const quizId = createQuizResult.jsonBody.quizId as number;
    expect(quizId).toBeDefined();

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

    expect(httpAdminQuizQuestionsCreate(token, quizId, questionBody).jsonBody.questionId).toBeDefined();

    const userEmail = 'oliver@unsw.edu.au';
    const transferResult = httpAdminQuizTransfer(quizId, token, userEmail);
    expect(transferResult.statusCode).toBe(400);
    expect(transferResult.jsonBody.error).toEqual(expect.any(String));
  });

  test('Correct status code for user already owns a quiz with this name', () => {
    const registerResult = httpAdminAuthRegister('oliver@unsw.edu.au', 'testpassword1', 'oliver', 'bowling');
    expect(registerResult.statusCode).toBe(200);
    const token: Token = JSON.parse(registerResult.jsonBody.token as string);
    expect(token).toBeDefined();

    const userEmail = 'newUser@unsw.edu.au';
    const newUserResult = httpAdminAuthRegister(userEmail, 'testPassword2', 'New', 'User');
    const newUserToken = JSON.parse(newUserResult.jsonBody.token as string);
    expect(newUserResult.statusCode).toBe(200);

    const createQuizResult = httpAdminQuizCreate(token, 'Sample Quiz', 'This is a test quiz');
    expect(createQuizResult.statusCode).toBe(200);
    const quizId = createQuizResult.jsonBody.quizId as number;
    expect(quizId).toBeDefined();

    const questionBody = {
      question: 'Test question 1',
      duration: 4,
      points: 5,
      answers: [{ answer: 'Test Answer 1', correct: true },
        { answer: 'Test Answer 2', correct: false },
        { answer: 'Test Answer 3', correct: false },
        { answer: 'Test Answer 4', correct: false }
      ]
    };

    expect(httpAdminQuizQuestionsCreate(token, quizId, questionBody).jsonBody.questionId).toBeDefined();

    const createQuizResultForNewUser = httpAdminQuizCreate(newUserToken, 'Sample Quiz', 'This is another test quiz');
    expect(createQuizResultForNewUser.statusCode).toBe(200);

    const questionBody2 = {
      question: 'Test question 2',
      duration: 4,
      points: 5,
      answers: [{ answer: 'Test Answer 1', correct: true },
        { answer: 'Test Answer 2', correct: false },
        { answer: 'Test Answer 3', correct: false },
        { answer: 'Test Answer 4', correct: false }
      ]
    };

    expect(httpAdminQuizQuestionsCreate(newUserToken, createQuizResultForNewUser.jsonBody.quizId as number, questionBody2).jsonBody.questionId).toBeDefined();

    const transferResult = httpAdminQuizTransfer(quizId, token, userEmail);
    expect(transferResult.statusCode).toBe(400);
    expect(transferResult.jsonBody.error).toEqual(expect.any(String));

    const questionBody3 = {
      question: 'Test question 3',
      duration: 4,
      points: 5,
      answers: [{ answer: 'Test Answer 1', correct: true },
        { answer: 'Test Answer 2', correct: false },
        { answer: 'Test Answer 3', correct: false },
        { answer: 'Test Answer 4', correct: false }
      ]
    };

    expect(httpAdminQuizQuestionsCreate(newUserToken, quizId, questionBody3).jsonBody.questionId).toBeUndefined();
    expect(httpAdminQuizQuestionsCreate(token, quizId, questionBody3).jsonBody.questionId).toBeDefined();
  });

  test('Correct status code for user does not own a quiz with this quizId', () => {
    const registerResult = httpAdminAuthRegister('oliver@unsw.edu.au', 'testpassword1', 'oliver', 'bowling');
    expect(registerResult.statusCode).toBe(200);
    const token: Token = JSON.parse(registerResult.jsonBody.token as string);
    expect(token).toBeDefined();

    const userEmail = 'newUser@unsw.edu.au';
    const newUserResult = httpAdminAuthRegister(userEmail, 'testPassword2', 'New', 'User');
    expect(newUserResult.statusCode).toBe(200);

    const invalidQuizId = 999;
    const transferResult = httpAdminQuizTransfer(invalidQuizId, token, userEmail);
    expect(transferResult.statusCode).toBe(403);
    expect(transferResult.jsonBody.error).toEqual(expect.any(String));
  });

  test('Empty or invalid token (error code 401) is given as first error with all invalid inputs', () => {
    const transferResult = httpAdminQuizTransfer(1234567, { sessionId: 'InvalidToken' }, 'UnknownUserEmail@unsw.edu.au');
    expect(transferResult.statusCode).toBe(401);
  });

  test('User not owning a quiz/quiz not existing (error code 403) is given as first error with two invalid inputs', () => {
    const registerResult = httpAdminAuthRegister('oliver@unsw.edu.au', 'testpassword1', 'oliver', 'bowling');
    const transferResult = httpAdminQuizTransfer(1234567, JSON.parse(registerResult.jsonBody.token as string), 'UnknownUserEmail@unsw.edu.au');
    expect(transferResult.statusCode).toBe(403);
  });
});
