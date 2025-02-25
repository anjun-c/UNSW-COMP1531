import {
  httpAdminQuizQuestionMove,
  httpClear,
  httpAdminAuthRegister,
  httpAdminQuizCreate,
  httpAdminQuizQuestionsCreate,
  httpAdminQuizInfo,
  httpAdminQuizList,
  httpAdminUserDetailsUpdate
} from './testHelper';

import { Token } from '../dataStore';

describe('Fail Cases', () => {
  beforeEach(() => {
    httpClear();
  });

  test('Token is Invalid', () => {
    const registerResult = httpAdminAuthRegister('vlad@gmail.com', 'testpassword1', 'Vlad', 'Klymenko');
    const token:Token = JSON.parse(registerResult.jsonBody.token as string);

    const quizResult = httpAdminQuizCreate(token, 'Test Quiz 1', 'Test Description 1');
    const quizId = quizResult.jsonBody.quizId as number;
    const badToken: Token = { sessionId: 'invalid' };

    // Create two questions
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

    // Move Question 1 from index 0 to 1
    const question1 = httpAdminQuizQuestionsCreate(token, quizId, questionBody1);
    httpAdminQuizQuestionsCreate(token, quizId, questionBody2);
    const moveResult = httpAdminQuizQuestionMove(quizId, question1.jsonBody.questionId as number, badToken, 1);
    expect(moveResult.statusCode).toBe(401);
    expect(moveResult.jsonBody.error).toStrictEqual(expect.any(String));
  });

  test('Token is Empty', () => {
    const registerResult = httpAdminAuthRegister('vlad@gmail.com', 'testpassword1', 'Vlad', 'Klymenko');
    const token:Token = JSON.parse(registerResult.jsonBody.token as string);

    const quizResult = httpAdminQuizCreate(token, 'Test Quiz 1', 'Test Description 1');
    const quizId = quizResult.jsonBody.quizId as number;

    // Create two questions
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

    // Move Question 1 from index 0 to 1
    const question1 = httpAdminQuizQuestionsCreate(token, quizId, questionBody1);
    httpAdminQuizQuestionsCreate(token, quizId, questionBody2);
    const moveResult = httpAdminQuizQuestionMove(quizId, question1.jsonBody.questionId as number, { sessionId: '' }, 1);
    expect(moveResult.statusCode).toBe(401);
    expect(moveResult.jsonBody.error).toStrictEqual(expect.any(String));
  });

  test('User is not owner', () => {
    const user1 = httpAdminAuthRegister('vlad@gmail.com', 'testpassword1', 'Vlad', 'Klymenko');
    const user2 = httpAdminAuthRegister('jon@gmail.com', 'testpassword1', 'Jon', 'Doe');
    const token = JSON.parse(user1.jsonBody.token as string);

    const quizResult = httpAdminQuizCreate(JSON.parse(user2.jsonBody.token as string), 'Test Quiz 1', 'Test Description 1');
    const quizId = quizResult.jsonBody.quizId as number;

    // Move question from index 1 to 2
    const moveResult = httpAdminQuizQuestionMove(quizId, 1, token, 2);
    expect(moveResult.statusCode).toBe(403);
    expect(moveResult.jsonBody.error).toStrictEqual(expect.any(String));
  });

  test('Invalid Quiz ID', () => {
    const registerResult = httpAdminAuthRegister('vlad@gmail.com', 'testpassword1', 'Vlad', 'Klymenko');
    const token = JSON.parse(registerResult.jsonBody.token as string);

    // Move question in non-existent quiz
    const moveResult = httpAdminQuizQuestionMove(-1, 1, token, 2);
    expect(moveResult.statusCode).toBe(403);
    expect(moveResult.jsonBody.error).toStrictEqual(expect.any(String));
  });

  test('Invalid Question ID', () => {
    const registerResult = httpAdminAuthRegister('vlad@gmail.com', 'testpassword1', 'Vlad', 'Klymenko');
    const token:Token = JSON.parse(registerResult.jsonBody.token as string);

    const quizResult = httpAdminQuizCreate(token, 'Test Quiz 1', 'Test Description 1');
    const quizId = quizResult.jsonBody.quizId as number;

    // Move question from index -1 to 2
    const moveResult = httpAdminQuizQuestionMove(quizId, -1, token, 2);
    expect(moveResult.statusCode).toBe(400);
    expect(moveResult.jsonBody.error).toStrictEqual(expect.any(String));
  });

  test('Moving Question to Same Position', () => {
    const registerResult = httpAdminAuthRegister('vlad@gmail.com', 'testpassword1', 'Vlad', 'Klymenko');
    const token:Token = JSON.parse(registerResult.jsonBody.token as string);

    const quizResult = httpAdminQuizCreate(token, 'Test Quiz 1', 'Test Description 1');
    const quizId = quizResult.jsonBody.quizId as number;

    // Create a question
    const questionBody1 = {
      question: 'Question 1',
      duration: 4,
      points: 5,
      answers: [{ answer: 'Answer 1', correct: true }, { answer: 'Answer 1 wrong', correct: false }]
    };

    const question1 = httpAdminQuizQuestionsCreate(token, quizId, questionBody1);

    // Attempt to move the question to the same position
    const moveResult = httpAdminQuizQuestionMove(quizId, question1.jsonBody.questionId as number, token, 0);
    expect(moveResult.statusCode).toBe(400);
    expect(moveResult.jsonBody.error).toStrictEqual(expect.any(String));
  });

  test('Moving Question Beyond Bounds', () => {
    const registerResult = httpAdminAuthRegister('vlad@gmail.com', 'testpassword1', 'Vlad', 'Klymenko');
    const token:Token = JSON.parse(registerResult.jsonBody.token as string);

    const quizResult = httpAdminQuizCreate(token, 'Test Quiz 1', 'Test Description 1');
    const quizId = quizResult.jsonBody.quizId as number;

    // Create a question
    const questionBody1 = {
      question: 'Question 1',
      duration: 4,
      points: 5,
      answers: [{ answer: 'Answer 1', correct: true }, { answer: 'Answer 1 wrong', correct: false }]
    };

    const question1 = httpAdminQuizQuestionsCreate(token, quizId, questionBody1);

    // Attempt to move the question to a position beyond bounds
    const moveResult = httpAdminQuizQuestionMove(quizId, question1.jsonBody.questionId as number, token, 10);
    expect(moveResult.statusCode).toBe(400);
    expect(moveResult.jsonBody.error).toStrictEqual(expect.any(String));
  });

  test('Move to invalid position (less than 0)', () => {
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

    const question1 = httpAdminQuizQuestionsCreate(token, quizId, questionBody1);

    const moveResult = httpAdminQuizQuestionMove(quizId, question1.jsonBody.questionId as number, token, -1); // Move question to an invalid position
    expect(moveResult.statusCode).toBe(400);
    expect(moveResult.jsonBody.error).toStrictEqual(expect.any(String));
  });
});

describe('Success Cases', () => {
  beforeEach(() => {
    httpClear();
  });

  test('Success Question Move from index 0 to 1, alongside successful operation of side effects', () => {
    const registerResult = httpAdminAuthRegister('vlad@gmail.com', 'testpassword1', 'Vlad', 'Klymenko');
    const token:Token = JSON.parse(registerResult.jsonBody.token as string);

    const quizResult = httpAdminQuizCreate(token, 'Test Quiz 1', 'Test Description 1');
    const quizId = quizResult.jsonBody.quizId as number;

    // Create two questions
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

    // Move the first question to the second position
    const moveResult = httpAdminQuizQuestionMove(quizId, question1.jsonBody.questionId as number, token, 1);
    expect(moveResult.statusCode).toBe(200);
    expect(moveResult.jsonBody).toStrictEqual({});

    // Correctly lists Quiz
    const listResult = httpAdminQuizList(token);
    expect(listResult.statusCode).toBe(200);

    // Correctly updates user details
    const result = httpAdminUserDetailsUpdate(token, 'vlad@gmail.com', 'Vlad', 'Klymenko');
    expect(result.statusCode).toBe(200);
  });

  test('Moving Question in a Large Quiz', () => {
    const registerResult = httpAdminAuthRegister('vlad@gmail.com', 'testpassword1', 'Vlad', 'Klymenko');
    const token:Token = JSON.parse(registerResult.jsonBody.token as string);

    const quizResult = httpAdminQuizCreate(token, 'Test Quiz 1', 'Test Description 1');
    const quizId = quizResult.jsonBody.quizId as number;

    // Create multiple questions
    const questionBody = {
      question: 'Question ',
      duration: 4,
      points: 5,
      answers: [{ answer: 'Answer', correct: true }, { answer: 'Answer wrong', correct: false }]
    };

    for (let i = 0; i < 10; i++) {
      questionBody.question = `Question ${i + 1}`;
      httpAdminQuizQuestionsCreate(token, quizId, questionBody);
    }

    // Move the first question to the last position
    const moveResult = httpAdminQuizQuestionMove(quizId, 0, token, 9);
    expect(moveResult.statusCode).toBe(200);
    expect(moveResult.jsonBody).toStrictEqual({});
  });

  test('Moving a question multiple times successfully', () => {
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
    const questionBody3 = {
      question: 'Question 3',
      duration: 4,
      points: 5,
      answers: [{ answer: 'Answer 3', correct: true }, { answer: 'Answer 3 wrong', correct: false }]
    };

    const question1 = httpAdminQuizQuestionsCreate(token, quizId, questionBody1);
    httpAdminQuizQuestionsCreate(token, quizId, questionBody2);
    httpAdminQuizQuestionsCreate(token, quizId, questionBody3);

    // Move the first question to the second position, then to the third position
    let moveResult = httpAdminQuizQuestionMove(quizId, question1.jsonBody.questionId as number, token, 1);
    expect(moveResult.statusCode).toBe(200);
    expect(moveResult.jsonBody).toStrictEqual({});

    moveResult = httpAdminQuizQuestionMove(quizId, question1.jsonBody.questionId as number, token, 2);
    expect(moveResult.statusCode).toBe(200);
    expect(moveResult.jsonBody).toStrictEqual({});
  });

  test('Moving multiple questions', () => {
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
    const questionBody3 = {
      question: 'Question 3',
      duration: 4,
      points: 5,
      answers: [{ answer: 'Answer 3', correct: true }, { answer: 'Answer 3 wrong', correct: false }]
    };

    const question1 = httpAdminQuizQuestionsCreate(token, quizId, questionBody1);
    httpAdminQuizQuestionsCreate(token, quizId, questionBody2);
    const question3 = httpAdminQuizQuestionsCreate(token, quizId, questionBody3);

    // Move the first question to the second position
    let moveResult = httpAdminQuizQuestionMove(quizId, question1.jsonBody.questionId as number, token, 1);
    expect(moveResult.statusCode).toBe(200);
    expect(moveResult.jsonBody).toStrictEqual({});

    // Move the third question to the first position
    moveResult = httpAdminQuizQuestionMove(quizId, question3.jsonBody.questionId as number, token, 0);
    expect(moveResult.statusCode).toBe(200);
    expect(moveResult.jsonBody).toStrictEqual({});
  });

  test('Correct order of questions after moving', () => {
    const registerResult = httpAdminAuthRegister('vlad@gmail.com', 'testpassword1', 'Vlad', 'Klymenko');
    const token:Token = JSON.parse(registerResult.jsonBody.token as string);

    const quizResult = httpAdminQuizCreate(token, 'Test Quiz 1', 'Test Description 1');
    const quizId = quizResult.jsonBody.quizId as number;

    // Create three questions
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
    const questionBody3 = {
      question: 'Question 3',
      duration: 4,
      points: 5,
      answers: [{ answer: 'Answer 3', correct: true }, { answer: 'Answer 3 wrong', correct: false }]
    };
    // Expected responses
    const expect1 = {
      question: 'Question 1',
      duration: 4,
      points: 5,
      answers: [{ answerId: expect.any(Number), answer: 'Answer 1', correct: true, colour: 'red' }, { answerId: expect.any(Number), answer: 'Answer 1 wrong', correct: false, colour: 'blue' }]
    };
    const expect2 = {
      question: 'Question 2',
      duration: 4,
      points: 5,
      answers: [{ answerId: expect.any(Number), answer: 'Answer 2', correct: true, colour: 'red' }, { answerId: expect.any(Number), answer: 'Answer 2 wrong', correct: false, colour: 'blue' }]
    };
    const expect3 = {
      question: 'Question 3',
      duration: 4,
      points: 5,
      answers: [{ answerId: expect.any(Number), answer: 'Answer 3', correct: true, colour: 'red' }, { answerId: expect.any(Number), answer: 'Answer 3 wrong', correct: false, colour: 'blue' }]
    };

    const question1 = httpAdminQuizQuestionsCreate(token, quizId, questionBody1);
    const question2 = httpAdminQuizQuestionsCreate(token, quizId, questionBody2);
    const question3 = httpAdminQuizQuestionsCreate(token, quizId, questionBody3);

    // Initial order: [question1, question2, question3]
    let quizInfo = httpAdminQuizInfo(token, quizId);
    expect(quizInfo.jsonBody.questions).toEqual([
      { questionId: question1.jsonBody.questionId, ...expect1 },
      { questionId: question2.jsonBody.questionId, ...expect2 },
      { questionId: question3.jsonBody.questionId, ...expect3 }
    ]);

    // Move the first question to the second position
    let moveResult = httpAdminQuizQuestionMove(quizId, question1.jsonBody.questionId as number, token, 1);
    expect(moveResult.statusCode).toBe(200);
    expect(moveResult.jsonBody).toStrictEqual({});

    // New order: [question2, question1, question3]
    quizInfo = httpAdminQuizInfo(token, quizId);
    expect(quizInfo.jsonBody.questions).toEqual([
      { questionId: question2.jsonBody.questionId, ...expect2 },
      { questionId: question1.jsonBody.questionId, ...expect1 },
      { questionId: question3.jsonBody.questionId, ...expect3 }
    ]);

    // Move the third question to the first position
    moveResult = httpAdminQuizQuestionMove(quizId, question3.jsonBody.questionId as number, token, 0);
    expect(moveResult.statusCode).toBe(200);
    expect(moveResult.jsonBody).toStrictEqual({});

    // Final order: [question3, question2, question1]
    quizInfo = httpAdminQuizInfo(token, quizId);
    expect(quizInfo.jsonBody.questions).toEqual([
      { questionId: question3.jsonBody.questionId, ...expect3 },
      { questionId: question2.jsonBody.questionId, ...expect2 },
      { questionId: question1.jsonBody.questionId, ...expect1 }
    ]);
  });
  test('timeLastEdited is updated', () => {
    const registerResult = httpAdminAuthRegister('vlad@gmail.com', 'testpassword1', 'Vlad', 'Klymenko');
    const token:Token = JSON.parse(registerResult.jsonBody.token as string);

    const quizResult = httpAdminQuizCreate(token, 'Test Quiz 1', 'Test Description 1');
    const quizId = quizResult.jsonBody.quizId as number;

    // Create two questions
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
    const initialQuizInfo = httpAdminQuizInfo(token, quizId);

    // Move the first question to the second position
    const moveResult = httpAdminQuizQuestionMove(quizId, question1.jsonBody.questionId as number, token, 1);
    expect(moveResult.statusCode).toBe(200);
    expect(moveResult.jsonBody).toStrictEqual({});

    const updatedQuizInfo = httpAdminQuizInfo(token, quizId);
    const timeEdited = initialQuizInfo.jsonBody.timeLastEdited as number | bigint;
    expect(updatedQuizInfo.jsonBody.timeLastEdited).toBeGreaterThan(timeEdited);
  });
});
