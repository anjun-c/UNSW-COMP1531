import { httpAdminAuthRegister, httpClear, httpAdminQuizQuestionsCreate, httpAdminQuizCreate, httpAdminQuizQuestionDelete, httpAdminQuizInfo } from './testHelper';
import { Token } from '../dataStore';

describe('adminQuizQuestionDelete', () => {
  beforeEach(() => {
    httpClear();
  });

  test('Question Id does not refer to a valid question within this quiz', () => {
    const registerResult = httpAdminAuthRegister('oliver@unsw.edu.au', 'testpassword1', 'Oliver', 'Bowling');
    expect(registerResult.statusCode).toBe(200);
    const token: Token = JSON.parse(registerResult.jsonBody.token as string);
    expect(token).toBeDefined();

    const createQuizResult = httpAdminQuizCreate(token, 'Test Quiz 1', 'Test Description 1');
    expect(createQuizResult.statusCode).toBe(200);
    const quizId: number = createQuizResult.jsonBody.quizId as number;

    const questionBody = {
      question: 'Test Question 1',
      duration: 3,
      points: 1,
      answers: [
        { answer: 'Test Answer 1', correct: true },
        { answer: 'Test Answer 2', correct: false },
        { answer: 'Test Answer 3', correct: false },
        { answer: 'Test Answer 4', correct: false }
      ]
    };

    const createQuestionResult = httpAdminQuizQuestionsCreate(token, quizId, questionBody);
    expect(createQuestionResult.statusCode).toBe(200);
    const questionId = createQuestionResult.jsonBody.questionId as number;

    const quizInfoResult = httpAdminQuizInfo(token, quizId);
    expect(quizInfoResult.statusCode).toBe(200);
    expect(quizInfoResult.jsonBody.numQuestions).toStrictEqual(1);

    const deleteResult = httpAdminQuizQuestionDelete(token, quizId, questionId + 1);
    expect(deleteResult.statusCode).toBe(400);
    expect(deleteResult.jsonBody).toStrictEqual({ error: expect.any(String) });
  });

  test('Token is empty or invalid (does not refer to valid logged in user session)', () => {
    const registerResult = httpAdminAuthRegister('oliver@unsw.edu.au', 'testpassword1', 'Oliver', 'Bowling');
    expect(registerResult.statusCode).toBe(200);
    const token: Token = JSON.parse(registerResult.jsonBody.token as string);
    expect(token).toBeDefined();

    const badToken: Token = { sessionId: token.sessionId + '1' };

    const createQuizResult = httpAdminQuizCreate(token, 'Test Quiz 1', 'Test Description 1');
    expect(createQuizResult.statusCode).toBe(200);
    const quizId: number = createQuizResult.jsonBody.quizId as number;

    const questionBody = {
      question: 'Test Question 1',
      duration: 3,
      points: 1,
      answers: [
        { answer: 'Test Answer 1', correct: true },
        { answer: 'Test Answer 2', correct: false },
        { answer: 'Test Answer 3', correct: false },
        { answer: 'Test Answer 4', correct: false }
      ]
    };

    const createQuestionResult = httpAdminQuizQuestionsCreate(token, quizId, questionBody);
    expect(createQuestionResult.statusCode).toBe(200);
    const questionId = createQuestionResult.jsonBody.questionId as number;

    const quizInfoResult = httpAdminQuizInfo(token, quizId);
    expect(quizInfoResult.statusCode).toBe(200);
    expect(quizInfoResult.jsonBody.numQuestions).toStrictEqual(1);

    const deleteResult = httpAdminQuizQuestionDelete(badToken, quizId, questionId);
    expect(deleteResult.statusCode).toBe(401);
    expect(deleteResult.jsonBody).toStrictEqual({ error: expect.any(String) });
  });

  test("Valid token is provided, but user is not an owner of this quiz or quiz doesn't exist", () => {
    const registerResult1 = httpAdminAuthRegister('oliver@unsw.edu.au', 'testpassword1', 'Oliver', 'Bowling');
    expect(registerResult1.statusCode).toBe(200);
    const token1: Token = JSON.parse(registerResult1.jsonBody.token as string);
    expect(token1).toBeDefined();

    const registerResult2 = httpAdminAuthRegister('alex@unsw.edu.au', 'testpassword2', 'Alex', 'Yecies');
    expect(registerResult2.statusCode).toBe(200);
    const token2: Token = JSON.parse(registerResult2.jsonBody.token as string);
    expect(token2).toBeDefined();

    const createQuizResult = httpAdminQuizCreate(token1, 'Test Quiz 1', 'Test Description 1');
    expect(createQuizResult.statusCode).toBe(200);
    const quizId: number = createQuizResult.jsonBody.quizId as number;

    const questionBody1 = {
      question: 'Test Question 1',
      duration: 3,
      points: 1,
      answers: [
        { answer: 'Test Answer 1', correct: true },
        { answer: 'Test Answer 2', correct: false },
        { answer: 'Test Answer 3', correct: false },
        { answer: 'Test Answer 4', correct: false }
      ]
    };

    const createQuestionResult = httpAdminQuizQuestionsCreate(token1, quizId, questionBody1);
    expect(createQuestionResult.statusCode).toBe(200);
    const questionId = createQuestionResult.jsonBody.questionId as number;

    const deleteResult = httpAdminQuizQuestionDelete(token2, quizId, questionId);
    expect(deleteResult.statusCode).toBe(403);
    expect(deleteResult.jsonBody).toStrictEqual({ error: expect.any(String) });
  });

  test('Question is succesfully deleted', () => {
    const registerResult = httpAdminAuthRegister('oliver@unsw.edu.au', 'testpassword1', 'Oliver', 'Bowling');
    expect(registerResult.statusCode).toBe(200);
    const token: Token = JSON.parse(registerResult.jsonBody.token as string);
    expect(token).toBeDefined();

    const createQuizResult = httpAdminQuizCreate(token, 'Test Quiz 1', 'Test Description 1');
    expect(createQuizResult.statusCode).toBe(200);
    const quizId: number = createQuizResult.jsonBody.quizId as number;

    const questionBody = {
      question: 'Test Question 1',
      duration: 3,
      points: 1,
      answers: [
        { answer: 'Test Answer 1', correct: true },
        { answer: 'Test Answer 2', correct: false },
        { answer: 'Test Answer 3', correct: false },
        { answer: 'Test Answer 4', correct: false }
      ]
    };

    const createQuestionResult = httpAdminQuizQuestionsCreate(token, quizId, questionBody);
    expect(createQuestionResult.statusCode).toBe(200);
    const questionId = createQuestionResult.jsonBody.questionId as number;

    let quizInfoResult = httpAdminQuizInfo(token, quizId);
    expect(quizInfoResult.statusCode).toBe(200);
    expect(quizInfoResult.jsonBody.numQuestions).toStrictEqual(1);
    expect(quizInfoResult.jsonBody.duration).toStrictEqual(3);

    const deleteResult = httpAdminQuizQuestionDelete(token, quizId, questionId);
    expect(deleteResult.statusCode).toBe(200);

    quizInfoResult = httpAdminQuizInfo(token, quizId);
    expect(quizInfoResult.statusCode).toBe(200);
    expect(quizInfoResult.jsonBody.numQuestions).toStrictEqual(0);
  });

  test('Multiple questions are succesfully deleted', () => {
    const registerResult = httpAdminAuthRegister('oliver@unsw.edu.au', 'testpassword1', 'Oliver', 'Bowling');
    expect(registerResult.statusCode).toBe(200);
    const token: Token = JSON.parse(registerResult.jsonBody.token as string);
    expect(token).toBeDefined();

    const createQuizResult = httpAdminQuizCreate(token, 'Test Quiz 1', 'Test Description 1');
    expect(createQuizResult.statusCode).toBe(200);
    const quizId: number = createQuizResult.jsonBody.quizId as number;

    const questionBody1 = {
      question: 'Test Question 1',
      duration: 3,
      points: 1,
      answers: [
        { answer: 'Test Answer 1', correct: true },
        { answer: 'Test Answer 2', correct: false },
        { answer: 'Test Answer 3', correct: false },
        { answer: 'Test Answer 4', correct: false }
      ]
    };

    const questionBody2 = {
      question: 'Test Question 2',
      duration: 3,
      points: 1,
      answers: [
        { answer: 'Test Answer 1', correct: false },
        { answer: 'Test Answer 2', correct: true },
        { answer: 'Test Answer 3', correct: false },
        { answer: 'Test Answer 4', correct: false }
      ]
    };

    // create questions
    const createQuestionResult1 = httpAdminQuizQuestionsCreate(token, quizId, questionBody1);
    expect(createQuestionResult1.statusCode).toBe(200);
    const questionId1 = createQuestionResult1.jsonBody.questionId as number;

    const createQuestionResult2 = httpAdminQuizQuestionsCreate(token, quizId, questionBody2);
    expect(createQuestionResult2.statusCode).toBe(200);
    const questionId2 = createQuestionResult2.jsonBody.questionId as number;

    let quizInfoResult = httpAdminQuizInfo(token, quizId);
    expect(quizInfoResult.statusCode).toBe(200);
    expect(quizInfoResult.jsonBody.duration).toStrictEqual(6);
    expect(quizInfoResult.jsonBody.numQuestions).toStrictEqual(2);

    // delete 1st
    const deleteResult1 = httpAdminQuizQuestionDelete(token, quizId, questionId1);
    expect(deleteResult1.statusCode).toBe(200);

    quizInfoResult = httpAdminQuizInfo(token, quizId);
    expect(quizInfoResult.statusCode).toBe(200);
    expect(quizInfoResult.jsonBody.duration).toStrictEqual(3);
    expect(quizInfoResult.jsonBody.numQuestions).toStrictEqual(1);

    // delete 2nd
    const deleteResult2 = httpAdminQuizQuestionDelete(token, quizId, questionId2);
    expect(deleteResult2.statusCode).toBe(200);

    quizInfoResult = httpAdminQuizInfo(token, quizId);
    expect(quizInfoResult.statusCode).toBe(200);
    expect(quizInfoResult.jsonBody.numQuestions).toStrictEqual(0);
  });
});
