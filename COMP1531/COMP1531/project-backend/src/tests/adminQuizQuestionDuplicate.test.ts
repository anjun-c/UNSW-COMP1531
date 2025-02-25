import {
  httpAdminQuizQuestionDuplicate,
  httpClear,
  httpAdminAuthRegister,
  httpAdminQuizCreate,
  httpAdminQuizQuestionsCreate,
  httpAdminQuizInfo,
  httpAdminQuizQuestionDelete
} from './testHelper';

import { Question, Token } from '../dataStore';

describe('Fail cases', () => {
  beforeEach(() => {
    httpClear();
  });

  test('Token is Invalid', () => {
    const registerResult = httpAdminAuthRegister('vlad@gmail.com', 'testpassword1', 'Vlad', 'Klymenko');
    const token: Token = JSON.parse(registerResult.jsonBody.token as string);

    const quizResult = httpAdminQuizCreate(token, 'Test Quiz 1', 'Test Description 1');
    const quizId = quizResult.jsonBody.quizId as number;
    const badToken: Token = { sessionId: token.sessionId + '1' };

    // Duplicate question with bad token
    const duplicateResult = httpAdminQuizQuestionDuplicate(quizId, 1, badToken);
    expect(duplicateResult.statusCode).toBe(401);
    expect(duplicateResult.jsonBody.error).toStrictEqual(expect.any(String));
  });

  test('Token is empty', () => {
    const registerResult = httpAdminAuthRegister('vlad@gmail.com', 'testpassword1', 'Vlad', 'Klymenko');
    const quizResult = httpAdminQuizCreate(JSON.parse(registerResult.jsonBody.token as string), 'Test Quiz 1', 'Test Description 1');
    const quizId = quizResult.jsonBody.quizId as number;

    // Duplicate question with bad token
    const duplicateResult = httpAdminQuizQuestionDuplicate(quizId, 1, { sessionId: '' });
    expect(duplicateResult.statusCode).toBe(401);
    expect(duplicateResult.jsonBody.error).toStrictEqual(expect.any(String));
  });

  test('User is not owner', () => {
    const user1 = httpAdminAuthRegister('vlad@gmail.com', 'testpassword1', 'Vlad', 'Klymenko');
    const user2 = httpAdminAuthRegister('jon@gmail.com', 'testpassword1', 'Jon', 'Doe');
    const quizResult = httpAdminQuizCreate(JSON.parse(user2.jsonBody.token as string), 'Test Quiz 1', 'Test Description 1');
    const quizId = quizResult.jsonBody.quizId as number;
    const token = JSON.parse(user1.jsonBody.token as string);

    // Duplicate question by non-owner
    const duplicateResult = httpAdminQuizQuestionDuplicate(quizId, 1, token);
    expect(duplicateResult.statusCode).toBe(403);
    expect(duplicateResult.jsonBody.error).toStrictEqual(expect.any(String));
  });

  test('Invalid Question ID', () => {
    const registerResult = httpAdminAuthRegister('vlad@gmail.com', 'testpassword1', 'Vlad', 'Klymenko');
    const token:Token = JSON.parse(registerResult.jsonBody.token as string);

    const quizResult = httpAdminQuizCreate(token, 'Test Quiz 1', 'Test Description 1');
    const quizId = quizResult.jsonBody.quizId as number;

    // Duplicate invalid question
    const duplicateResult = httpAdminQuizQuestionDuplicate(quizId, -1, token);
    expect(duplicateResult.statusCode).toBe(400);
    expect(duplicateResult.jsonBody.error).toStrictEqual(expect.any(String));
  });

  test('Quiz ID does not exist', () => {
    const registerResult = httpAdminAuthRegister('vlad@gmail.com', 'testpassword1', 'Vlad', 'Klymenko');
    const token: Token = JSON.parse(registerResult.jsonBody.token as string);

    // Duplicate question with non-existent quiz ID
    const duplicateResult = httpAdminQuizQuestionDuplicate(-1, 1, token);
    expect(duplicateResult.statusCode).toBe(403);
    expect(duplicateResult.jsonBody.error).toStrictEqual(expect.any(String));
  });
});

describe('Sucess Cases', () => {
  beforeEach(() => {
    httpClear();
  });

  test('Duplicate question successfully', () => {
    const registerResult = httpAdminAuthRegister('vlad@gmail.com', 'testpassword1', 'Vlad', 'Klymenko');
    const token:Token = JSON.parse(registerResult.jsonBody.token as string);

    const quizResult = httpAdminQuizCreate(token, 'Test Quiz 1', 'Test Description 1');
    const quizId = quizResult.jsonBody.quizId as number;

    const questionBody = {
      question: 'Question 1',
      duration: 4,
      points: 5,
      answers: [{ answer: 'Answer 1', correct: true }, { answer: 'Answer 1 wrong', correct: false }]
    };

    const question = httpAdminQuizQuestionsCreate(token, quizId, questionBody);

    const duplicateResult = httpAdminQuizQuestionDuplicate(quizId, question.jsonBody.questionId as number, token);
    expect(duplicateResult.statusCode).toBe(200);
    expect(duplicateResult.jsonBody.newQuestionId).toStrictEqual(expect.any(Number));
  });

  test('timeLastEdited is updated after duplicating', () => {
    const registerResult = httpAdminAuthRegister('vlad@gmail.com', 'testpassword1', 'Vlad', 'Klymenko');
    const token:Token = JSON.parse(registerResult.jsonBody.token as string);

    const quizResult = httpAdminQuizCreate(token, 'Test Quiz 1', 'Test Description 1');
    const quizId = quizResult.jsonBody.quizId as number;

    const questionBody = {
      question: 'Question 1',
      duration: 4,
      points: 5,
      answers: [{ answer: 'Answer 1', correct: true }, { answer: 'Answer 1 wrong', correct: false }]
    };

    const question = httpAdminQuizQuestionsCreate(token, quizId, questionBody);

    const quizInfoBefore = httpAdminQuizInfo(token, quizId);

    const initialTimeLastEdited = quizInfoBefore.jsonBody.timeLastEdited as number | bigint;

    const duplicateResult = httpAdminQuizQuestionDuplicate(quizId, question.jsonBody.questionId as number, token);
    expect(duplicateResult.statusCode).toBe(200);
    expect(duplicateResult.jsonBody.newQuestionId).toStrictEqual(expect.any(Number));

    const quizInfoAfter = httpAdminQuizInfo(token, quizId);
    expect(quizInfoAfter.jsonBody.timeLastEdited).toBeGreaterThan(initialTimeLastEdited);
  });

  test('Correct order of questions after duplicating', () => {
    const registerResult = httpAdminAuthRegister('vlad@gmail.com', 'testpassword1', 'Vlad', 'Klymenko');
    const token:Token = JSON.parse(registerResult.jsonBody.token as string);

    const quizResult = httpAdminQuizCreate(token, 'Test Quiz 1', 'Test Description 1');
    const quizId = quizResult.jsonBody.quizId as number;

    const questionBody1 = {
      question: 'Question 1',
      duration: 4,
      points: 5,
      answers: [{ answer: 'Answer 1', correct: true }, { answer: 'Answer 1 wrong', correct: false }]
    };
    const questionBody2 = {
      question: 'Question 2',
      duration: 4,
      points: 5,
      answers: [{ answer: 'Answer 2', correct: true }, { answer: 'Answer 2 wrong', correct: false }]
    };

    const question1 = httpAdminQuizQuestionsCreate(token, quizId, questionBody1);
    httpAdminQuizQuestionsCreate(token, quizId, questionBody2);

    const duplicateResult = httpAdminQuizQuestionDuplicate(quizId, question1.jsonBody.questionId as number, token);
    expect(duplicateResult.statusCode).toBe(200);
    expect(duplicateResult.jsonBody.newQuestionId).toStrictEqual(expect.any(Number));

    const quizInfo = httpAdminQuizInfo(token, quizId);
    expect(quizInfo.statusCode).toBe(200);
    // Ensure questions property exists
    expect(quizInfo.jsonBody).toHaveProperty('questions');

    const questionArr = quizInfo.jsonBody.questions as Question[];
    const newQuestion = questionArr.find((q: Question) => q.questionId === duplicateResult.jsonBody.newQuestionId as number);
    expect(newQuestion).toBeDefined();
    expect(questionArr[1].questionId).toBe(duplicateResult.jsonBody.newQuestionId);
  });

  // New success cases
  test('Duplicated question has same content as original', () => {
    const registerResult = httpAdminAuthRegister('vlad@gmail.com', 'testpassword1', 'Vlad', 'Klymenko');
    const token:Token = JSON.parse(registerResult.jsonBody.token as string);

    const quizResult = httpAdminQuizCreate(token, 'Test Quiz 1', 'Test Description 1');
    const quizId = quizResult.jsonBody.quizId as number;

    const questionBody = {
      question: 'Question 1',
      duration: 4,
      points: 5,
      answers: [{ answer: 'Answer 1', correct: true }, { answer: 'Answer 1 wrong', correct: false }]
    };

    const question = httpAdminQuizQuestionsCreate(token, quizId, questionBody);

    const duplicateResult = httpAdminQuizQuestionDuplicate(quizId, question.jsonBody.questionId as number, token);
    expect(duplicateResult.statusCode).toBe(200);
    const newQuestionId = duplicateResult.jsonBody.newQuestionId;

    const quizInfo = httpAdminQuizInfo(token, quizId);
    const questionArr = quizInfo.jsonBody.questions as Question[];
    const originalQuestion = questionArr.find((q: Question) => q.questionId === question.jsonBody.questionId);
    const duplicatedQuestion = questionArr.find((q: Question) => q.questionId === newQuestionId);

    expect(duplicatedQuestion).toBeDefined();
    expect(duplicatedQuestion.question).toBe(originalQuestion.question);
    expect(duplicatedQuestion.duration).toBe(originalQuestion.duration);
    expect(duplicatedQuestion.points).toBe(originalQuestion.points);
    expect(duplicatedQuestion.answers).toEqual(originalQuestion.answers);
  });

  test('Delete original question does not affect duplicated question', () => {
    const registerResult = httpAdminAuthRegister('vlad@gmail.com', 'testpassword1', 'Vlad', 'Klymenko');
    const token:Token = JSON.parse(registerResult.jsonBody.token as string);

    const quizResult = httpAdminQuizCreate(token, 'Test Quiz 1', 'Test Description 1');
    const quizId = quizResult.jsonBody.quizId as number;

    const questionBody = {
      question: 'Question 1',
      duration: 4,
      points: 5,
      answers: [{ answer: 'Answer 1', correct: true }, { answer: 'Answer 1 wrong', correct: false }]
    };

    const question = httpAdminQuizQuestionsCreate(token, quizId, questionBody);

    const duplicateResult = httpAdminQuizQuestionDuplicate(quizId, question.jsonBody.questionId as number, token);
    expect(duplicateResult.statusCode).toBe(200);
    const newQuestionId = duplicateResult.jsonBody.newQuestionId;

    // Delete original question
    const deleteResult = httpAdminQuizQuestionDelete(token, quizId, question.jsonBody.questionId as number);
    expect(deleteResult.statusCode).toBe(200);

    const quizInfo = httpAdminQuizInfo(token, quizId);
    const questionArr = quizInfo.jsonBody.questions as Question[];
    const originalQuestion = questionArr.find((q: Question) => q.questionId === question.jsonBody.questionId);
    const duplicatedQuestion = questionArr.find((q: Question) => q.questionId === newQuestionId);

    expect(originalQuestion).toBeUndefined();
    expect(duplicatedQuestion).toBeDefined();
  });

  test('Multiple duplications maintain order', () => {
    const registerResult = httpAdminAuthRegister('vlad@gmail.com', 'testpassword1', 'Vlad', 'Klymenko');
    const token: Token = JSON.parse(registerResult.jsonBody.token as string);

    const quizResult = httpAdminQuizCreate(token, 'Test Quiz 1', 'Test Description 1');
    const quizId = quizResult.jsonBody.quizId as number;

    const questionBody = {
      question: 'Question 1',
      duration: 4,
      points: 5,
      answers: [{ answer: 'Answer 1', correct: true }, { answer: 'Answer 1 wrong', correct: false }]
    };

    const question = httpAdminQuizQuestionsCreate(token, quizId, questionBody);

    // Duplicate question twice
    const duplicateResult1 = httpAdminQuizQuestionDuplicate(quizId, question.jsonBody.questionId as number, token);
    const duplicateResult2 = httpAdminQuizQuestionDuplicate(quizId, question.jsonBody.questionId as number, token);
    expect(duplicateResult1.statusCode).toBe(200);
    expect(duplicateResult2.statusCode).toBe(200);

    const quizInfo = httpAdminQuizInfo(token, quizId);

    const questionArr = quizInfo.jsonBody.questions as Question[];
    const duplicatedQuestion1 = questionArr.find((q: Question) => q.questionId === duplicateResult1.jsonBody.newQuestionId);
    const duplicatedQuestion2 = questionArr.find((q: Question) => q.questionId === duplicateResult2.jsonBody.newQuestionId);

    expect(questionArr[2]).toMatchObject(duplicatedQuestion1);
    expect(questionArr[1]).toMatchObject(duplicatedQuestion2);
  });

  test('Duplicated question updates quiz details correctly', () => {
    const registerResult = httpAdminAuthRegister('vlad@gmail.com', 'testpassword1', 'Vlad', 'Klymenko');
    const token:Token = JSON.parse(registerResult.jsonBody.token as string);

    const quizResult = httpAdminQuizCreate(token, 'Test Quiz 1', 'Test Description 1');
    const quizId = quizResult.jsonBody.quizId as number;

    const questionBody = {
      question: 'Question 1',
      duration: 4,
      points: 5,
      answers: [{ answer: 'Answer 1', correct: true }, { answer: 'Answer 1 wrong', correct: false }]
    };

    const question = httpAdminQuizQuestionsCreate(token, quizId, questionBody);

    const quizDetailsBefore = httpAdminQuizInfo(token, quizId);
    const questionArr1 = quizDetailsBefore.jsonBody.questions as Question[];
    const questionsCountBefore = questionArr1.length;

    const duplicateResult = httpAdminQuizQuestionDuplicate(quizId, question.jsonBody.questionId as number, token);
    expect(duplicateResult.statusCode).toBe(200);

    const quizDetailsAfter = httpAdminQuizInfo(token, quizId);
    const questionArr2 = quizDetailsAfter.jsonBody.questions as Question[];
    const questionsCountAfter = questionArr2.length;

    expect(questionsCountAfter).toBe(questionsCountBefore + 1);
  });
});
