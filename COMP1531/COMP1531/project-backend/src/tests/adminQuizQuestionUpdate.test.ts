import {
  httpAdminQuizQuestionsCreate,
  httpClear,
  httpAdminAuthRegister,
  httpAdminQuizCreate,
  httpAdminQuizQuestionUpdate,
  httpAdminQuizInfo
} from './testHelper';

import { Token } from '../dataStore';

describe('Error due to Bad Token Or Bad Quiz ID - QuizQuestionUpdate', () => {
  beforeEach(() => {
    httpClear();
  });

  test('Token is Invalid', () => {
    const registerResult = httpAdminAuthRegister('vlad@gmail.com', 'testpassword1', 'Vlad', 'Klymenko');
    const token:Token = JSON.parse(registerResult.jsonBody.token as string);

    const quizResult = httpAdminQuizCreate(token, 'Test Quiz 1', 'Test Description 1');
    const quizId = quizResult.jsonBody.quizId as number;

    const badToken:Token = { sessionId: 'Hello!' };
    const questionBody = {
      question: 'Test Question 1',
      duration: 4,
      points: 5,
      answers: [{ answer: 'Test Answer 1', correct: true }, { answer: 'Test Answer 3', correct: false }, { answer: 'Test Answer 2', correct: false }]
    };
    const questionResult = httpAdminQuizQuestionsCreate(token, quizId, questionBody);
    const questionId = questionResult.jsonBody.questionId as number;
    const newBody = {
      question: 'New Title',
      duration: 5,
      points: 3,
      answers: [{ answer: 'Test Answer 1', correct: true }, { answer: 'Test Answer 3', correct: false }, { answer: 'Test Answer 2', correct: false }]
    };
    const questionUpdate = httpAdminQuizQuestionUpdate(badToken, quizId, questionId, newBody);
    expect(questionUpdate.statusCode).toBe(401);
    expect(questionUpdate.jsonBody.error).toStrictEqual(expect.any(String));
  });

  test('User is not owner', () => {
    const user1 = httpAdminAuthRegister('vlad@gmail.com', 'testpassword1', 'Vlad', 'Klymenko');
    const tokenU1:Token = JSON.parse(user1.jsonBody.token as string);

    const user2 = httpAdminAuthRegister('jon@gmail.com', 'testpassword1', 'jone', 'doe');
    const tokenU2:Token = JSON.parse(user2.jsonBody.token as string);

    const quizResult = httpAdminQuizCreate(tokenU2, 'Test Quiz 1', 'Test Description 1');
    const quizId = quizResult.jsonBody.quizId as number;

    const questionBody = {
      question: 'Test Question 1',
      duration: 4,
      points: 5,
      answers: [{ answer: 'Test Answer 1', correct: true }]
    };
    const questionCreate = httpAdminQuizQuestionsCreate(tokenU2, quizId, questionBody);
    const questionId = questionCreate.jsonBody.questionId as number;
    const newBody = {
      question: 'New Title',
      duration: 5,
      points: 3,
      answers: [{ answer: 'Test Answer 1', correct: true }]
    };
    const questionUpdate = httpAdminQuizQuestionUpdate(tokenU1, quizId, questionId, newBody);
    expect(questionUpdate.statusCode).toBe(403);
    expect(questionUpdate.jsonBody.error).toStrictEqual(expect.any(String));
  });
});

describe('Error Due to Bad Question Body - QuizQuestionUpdate', () => {
  beforeEach(() => {
    httpClear();
  });

  test('Question string is less than 5 characters in length', () => {
    const registerResult = httpAdminAuthRegister('vlad@gmail.com', 'testpassword1', 'Vlad', 'Klymenko');
    const token:Token = JSON.parse(registerResult.jsonBody.token as string);

    const quizResult = httpAdminQuizCreate(token, 'Test Quiz 1', 'Test Description 1');
    const quizId = quizResult.jsonBody.quizId as number;

    const questionBody = {
      question: 'Good Question',
      duration: 4,
      points: 5,
      answers: [{ answer: 'Test Answer 1', correct: true },
        { answer: 'Test Answer 2', correct: false },
        { answer: 'Test Answer 3', correct: false },
        { answer: 'Test Answer 4', correct: false }
      ]
    };
    const questionResult = httpAdminQuizQuestionsCreate(token, quizId, questionBody);
    const questionId = questionResult.jsonBody.questionId as number;
    const newQuestion = {
      question: 'smol',
      duration: 4,
      points: 5,
      answers: [{ answer: 'Test Answer 1', correct: true },
        { answer: 'Test Answer 2', correct: false },
        { answer: 'Test Answer 3', correct: false },
        { answer: 'Test Answer 4', correct: false }
      ]
    };
    const updateResult = httpAdminQuizQuestionUpdate(token, quizId, questionId, newQuestion);
    expect(updateResult.statusCode).toBe(400);
    expect(updateResult.jsonBody.error).toStrictEqual(expect.any(String));
  });

  test('Question string is greater than 50 characters in length', () => {
    const registerResult = httpAdminAuthRegister('vlad@gmail.com', 'testpassword1', 'Vlad', 'Klymenko');
    const token:Token = JSON.parse(registerResult.jsonBody.token as string);

    const quizResult = httpAdminQuizCreate(token, 'Test Quiz 1', 'Test Description 1');
    const quizId = quizResult.jsonBody.quizId as number;

    const questionBody = {
      question: 'Good Question',
      duration: 4,
      points: 5,
      answers: [{ answer: 'Test Answer 1', correct: true },
        { answer: 'Test Answer 2', correct: false },
        { answer: 'Test Answer 3', correct: false },
        { answer: 'Test Answer 4', correct: false }
      ]
    };
    const questionResult = httpAdminQuizQuestionsCreate(token, quizId, questionBody);
    const questionId = questionResult.jsonBody.questionId as number;
    const newQuestion = {
      question: 'Extremely long string that is the question for the quiz thats over 50',
      duration: 4,
      points: 5,
      answers: [{ answer: 'Test Answer 1', correct: true },
        { answer: 'Test Answer 2', correct: false },
        { answer: 'Test Answer 3', correct: false },
        { answer: 'Test Answer 4', correct: false }
      ]
    };
    const updateResult = httpAdminQuizQuestionUpdate(token, quizId as number, questionId, newQuestion);
    expect(updateResult.statusCode).toBe(400);
    expect(updateResult.jsonBody.error).toStrictEqual(expect.any(String));
  });

  test('The question has more than 6 answers', () => {
    const registerResult = httpAdminAuthRegister('vlad@gmail.com', 'testpassword1', 'Vlad', 'Klymenko');
    const token:Token = JSON.parse(registerResult.jsonBody.token as string);

    const quizResult = httpAdminQuizCreate(token, 'Test Quiz 1', 'Test Description 1');
    const quizId = quizResult.jsonBody.quizId as number;

    const questionBody = {
      question: 'Good Question',
      duration: 4,
      points: 5,
      answers: [{ answer: 'Test Answer 1', correct: true },
        { answer: 'Test Answer 2', correct: false },
        { answer: 'Test Answer 3', correct: false },
        { answer: 'Test Answer 4', correct: false }
      ]
    };
    const questionResult = httpAdminQuizQuestionsCreate(token, quizId, questionBody);
    const questionId = questionResult.jsonBody.questionId as number;
    const newQuestion = {
      question: 'Test Quiz 1',
      duration: 4,
      points: 5,
      answers: [{ answer: 'Test Answer 1', correct: true },
        { answer: 'Test Answer 2', correct: false },
        { answer: 'Test Answer 3', correct: false },
        { answer: 'Test Answer 4', correct: false },
        { answer: 'Test Answer 5', correct: false },
        { answer: 'Test Answer 6', correct: false },
        { answer: 'Test Answer 7', correct: false },
        { answer: 'Test Answer 8', correct: false }
      ]
    };
    const updateResult = httpAdminQuizQuestionUpdate(token, quizId, questionId, newQuestion);
    expect(updateResult.statusCode).toBe(400);
    expect(updateResult.jsonBody.error).toStrictEqual(expect.any(String));
  });

  test('The question less than 2 answers', () => {
    const registerResult = httpAdminAuthRegister('vlad@gmail.com', 'testpassword1', 'Vlad', 'Klymenko');
    const token:Token = JSON.parse(registerResult.jsonBody.token as string);

    const quizResult = httpAdminQuizCreate(token, 'Test Quiz 1', 'Test Description 1');
    const quizId = quizResult.jsonBody.quizId as number;

    const questionBody = {
      question: 'Good Question',
      duration: 4,
      points: 5,
      answers: [{ answer: 'Test Answer 1', correct: true },
        { answer: 'Test Answer 2', correct: false },
        { answer: 'Test Answer 3', correct: false },
        { answer: 'Test Answer 4', correct: false }
      ]
    };
    const questionResult = httpAdminQuizQuestionsCreate(token, quizId, questionBody);
    const questionId = questionResult.jsonBody.questionId as number;
    const newQuestion = {
      question: 'Test Quiz 1',
      duration: 4,
      points: 5,
      answers: [{ answer: 'Test Answer 1', correct: true },
      ]
    };
    const updateResult = httpAdminQuizQuestionUpdate(token, quizId, questionId, newQuestion);
    expect(updateResult.statusCode).toBe(400);
    expect(updateResult.jsonBody.error).toStrictEqual(expect.any(String));
  });
  test('Question Duration is not a positive number', () => {
    const registerResult = httpAdminAuthRegister('vlad@gmail.com', 'testpassword1', 'Vlad', 'Klymenko');
    const token:Token = JSON.parse(registerResult.jsonBody.token as string);

    const quizResult = httpAdminQuizCreate(token, 'Test Quiz 1', 'Test Description 1');
    const quizId = quizResult.jsonBody.quizId as number;

    const questionBody = {
      question: 'Good Question',
      duration: 4,
      points: 5,
      answers: [{ answer: 'Test Answer 1', correct: true },
        { answer: 'Test Answer 2', correct: false },
        { answer: 'Test Answer 3', correct: false },
        { answer: 'Test Answer 4', correct: false }
      ]
    };
    const questionResult = httpAdminQuizQuestionsCreate(token, quizId, questionBody);
    const questionId = questionResult.jsonBody.questionId as number;
    const newQuestion = {
      question: 'Test Quiz 1',
      duration: -1,
      points: 5,
      answers: [{ answer: 'Test Answer 1', correct: true },
        { answer: 'Test Answer 2', correct: false },
        { answer: 'Test Answer 3', correct: false },
        { answer: 'Test Answer 4', correct: false }
      ]
    };
    const updateResult = httpAdminQuizQuestionUpdate(token, quizId, questionId, newQuestion);
    expect(updateResult.statusCode).toBe(400);
    expect(updateResult.jsonBody.error).toStrictEqual(expect.any(String));
  });

  test('Question Duration is not a positive number', () => {
    const registerResult = httpAdminAuthRegister('vlad@gmail.com', 'testpassword1', 'Vlad', 'Klymenko');
    const token:Token = JSON.parse(registerResult.jsonBody.token as string);

    const quizResult = httpAdminQuizCreate(token, 'Test Quiz 1', 'Test Description 1');
    const quizId = quizResult.jsonBody.quizId as number;

    const questionBody = {
      question: 'Good Question',
      duration: 9,
      points: 5,
      answers: [{ answer: 'Test Answer 1', correct: true },
        { answer: 'Test Answer 2', correct: false },
        { answer: 'Test Answer 3', correct: false },
        { answer: 'Test Answer 4', correct: false }
      ]
    };
    const questionBody2 = {
      question: 'Test Quiz Q2',
      duration: 170,
      points: 5,
      answers: [{ answer: 'Test Answer 1', correct: true },
        { answer: 'Test Answer 2', correct: false },
        { answer: 'Test Answer 3', correct: false },
        { answer: 'Test Answer 4', correct: false }
      ]
    };
    httpAdminQuizQuestionsCreate(token, quizId, questionBody2);
    const questionResult = httpAdminQuizQuestionsCreate(token, quizId, questionBody);
    const questionId = questionResult.jsonBody.questionId as number;
    const newQuestion = {
      question: 'Test Quiz 1',
      duration: 20,
      points: 5,
      answers: [{ answer: 'Test Answer 1', correct: true },
        { answer: 'Test Answer 2', correct: false },
        { answer: 'Test Answer 3', correct: false },
        { answer: 'Test Answer 4', correct: false }
      ]
    };
    const updateResult = httpAdminQuizQuestionUpdate(token, quizId, questionId, newQuestion);
    expect(updateResult.statusCode).toBe(400);
    expect(updateResult.jsonBody.error).toStrictEqual(expect.any(String));
  });

  test('Points awarded for the question are less than 1 or greater than 10', () => {
    const registerResult = httpAdminAuthRegister('vlad@gmail.com', 'testpassword1', 'Vlad', 'Klymenko');
    const token:Token = JSON.parse(registerResult.jsonBody.token as string);

    const quizResult = httpAdminQuizCreate(token, 'Test Quiz 1', 'Test Description 1');
    const quizId = quizResult.jsonBody.quizId as number;

    const questionBody = {
      question: 'Good Question',
      duration: 4,
      points: 5,
      answers: [{ answer: 'Test Answer 1', correct: true },
        { answer: 'Test Answer 2', correct: false },
        { answer: 'Test Answer 3', correct: false },
        { answer: 'Test Answer 4', correct: false }
      ]
    };
    const questionResult = httpAdminQuizQuestionsCreate(token, quizId, questionBody);
    const questionId = questionResult.jsonBody.questionId as number;
    const newQuestion = {
      question: 'Test Quiz 1',
      duration: 0.5,
      points: 5,
      answers: [{ answer: 'Test Answer 1', correct: true },
        { answer: 'Test Answer 2', correct: false },
        { answer: 'Test Answer 3', correct: false },
        { answer: 'Test Answer 4', correct: false }
      ]
    };
    const updateResult = httpAdminQuizQuestionUpdate(token, quizId, questionId, newQuestion);
    expect(updateResult.statusCode).toBe(400);
    expect(updateResult.jsonBody.error).toStrictEqual(expect.any(String));
  });

  test('Points awarded for the question are greater than 10', () => {
    const registerResult = httpAdminAuthRegister('vlad@gmail.com', 'testpassword1', 'Vlad', 'Klymenko');
    const token:Token = JSON.parse(registerResult.jsonBody.token as string);

    const quizResult = httpAdminQuizCreate(token, 'Test Quiz 1', 'Test Description 1');
    const quizId = quizResult.jsonBody.quizId as number;

    const questionBody = {
      question: 'Good Question',
      duration: 4,
      points: 5,
      answers: [{ answer: 'Test Answer 1', correct: true },
        { answer: 'Test Answer 2', correct: false },
        { answer: 'Test Answer 3', correct: false },
        { answer: 'Test Answer 4', correct: false }
      ]
    };
    const questionResult = httpAdminQuizQuestionsCreate(token, quizId, questionBody);
    const questionId = questionResult.jsonBody.questionId as number;
    const newQuestion = {
      question: 'Test Quiz 1',
      duration: 20,
      points: 5,
      answers: [{ answer: 'Test Answer 1', correct: true },
        { answer: 'Test Answer 2', correct: false },
        { answer: 'Test Answer 3', correct: false },
        { answer: 'Test Answer 4', correct: false }
      ]
    };
    const updateResult = httpAdminQuizQuestionUpdate(token, quizId, questionId, newQuestion);
    expect(updateResult.statusCode).toBe(400);
    expect(updateResult.jsonBody.error).toStrictEqual(expect.any(String));
  });

  test('The length of any answer is shorter than 1 character long', () => {
    const registerResult = httpAdminAuthRegister('vlad@gmail.com', 'testpassword1', 'Vlad', 'Klymenko');
    const token:Token = JSON.parse(registerResult.jsonBody.token as string);

    const quizResult = httpAdminQuizCreate(token, 'Test Quiz 1', 'Test Description 1');
    const quizId = quizResult.jsonBody.quizId as number;

    const questionBody = {
      question: 'Good Question',
      duration: 4,
      points: 5,
      answers: [{ answer: 'Test Answer 1', correct: true },
        { answer: 'Test Answer 2', correct: false },
        { answer: 'Test Answer 3', correct: false },
        { answer: 'Test Answer 4', correct: false }
      ]
    };
    const questionResult = httpAdminQuizQuestionsCreate(token, quizId, questionBody);
    const questionId = questionResult.jsonBody.questionId as number;
    const newQuestion = {
      question: 'Test Quiz 1',
      duration: 3,
      points: 1,
      answers: [{ answer: '', correct: true },
        { answer: 'Test Answer 2', correct: false },
        { answer: 'Test Answer 3', correct: false },
        { answer: 'Test Answer 4', correct: false }
      ]
    };
    const updateResult = httpAdminQuizQuestionUpdate(token, quizId, questionId, newQuestion);
    expect(updateResult.statusCode).toBe(400);
    expect(updateResult.jsonBody.error).toStrictEqual(expect.any(String));
  });

  test('The length of any answer is longer than 30 character long', () => {
    const registerResult = httpAdminAuthRegister('vlad@gmail.com', 'testpassword1', 'Vlad', 'Klymenko');
    const token:Token = JSON.parse(registerResult.jsonBody.token as string);

    const quizResult = httpAdminQuizCreate(token, 'Test Quiz 1', 'Test Description 1');
    const quizId = quizResult.jsonBody.quizId as number;

    const questionBody = {
      question: 'Good Question',
      duration: 4,
      points: 5,
      answers: [{ answer: 'Test Answer 1', correct: true },
        { answer: 'Test Answer 2', correct: false },
        { answer: 'Test Answer 3', correct: false },
        { answer: 'Test Answer 4', correct: false }
      ]
    };
    const questionResult = httpAdminQuizQuestionsCreate(token, quizId, questionBody);
    const questionId = questionResult.jsonBody.questionId as number;
    const newQuestion = {
      question: 'Test Quiz 1',
      duration: 3,
      points: 1,
      answers: [{ answer: 'Extremely long question answer field is not compatible', correct: true },
        { answer: 'Test Answer 2', correct: false },
        { answer: 'Test Answer 3', correct: false },
        { answer: 'Test Answer 4', correct: false }
      ]
    };
    const updateResult = httpAdminQuizQuestionUpdate(token, quizId, questionId, newQuestion);
    expect(updateResult.statusCode).toBe(400);
    expect(updateResult.jsonBody.error).toStrictEqual(expect.any(String));
  });

  test('Any answer strings are duplicates of one another (within the same question)', () => {
    const registerResult = httpAdminAuthRegister('vlad@gmail.com', 'testpassword1', 'Vlad', 'Klymenko');
    const token:Token = JSON.parse(registerResult.jsonBody.token as string);

    const quizResult = httpAdminQuizCreate(token, 'Test Quiz 1', 'Test Description 1');
    const quizId = quizResult.jsonBody.quizId as number;

    const questionBody = {
      question: 'Good Question',
      duration: 4,
      points: 5,
      answers: [{ answer: 'Test Answer 1', correct: true },
        { answer: 'Test Answer 2', correct: false },
        { answer: 'Test Answer 3', correct: false },
        { answer: 'Test Answer 4', correct: false }
      ]
    };
    const questionResult = httpAdminQuizQuestionsCreate(token, quizId, questionBody);
    const questionId = questionResult.jsonBody.questionId as number;
    const newQuestion = {
      question: 'Test Quiz 1',
      duration: 3,
      points: 1,
      answers: [{ answer: 'Duplicate', correct: true },
        { answer: 'Duplicate', correct: false },
        { answer: 'Test Answer 3', correct: false },
        { answer: 'Test Answer 4', correct: false }
      ]
    };
    const updateResult = httpAdminQuizQuestionUpdate(token, quizId, questionId, newQuestion);
    expect(updateResult.statusCode).toBe(400);
    expect(updateResult.jsonBody.error).toStrictEqual(expect.any(String));
  });

  test('Any answer strings are duplicates of one another (within the same question)', () => {
    const registerResult = httpAdminAuthRegister('vlad@gmail.com', 'testpassword1', 'Vlad', 'Klymenko');
    const token:Token = JSON.parse(registerResult.jsonBody.token as string);

    const quizResult = httpAdminQuizCreate(token, 'Test Quiz 1', 'Test Description 1');
    const quizId = quizResult.jsonBody.quizId as number;

    const questionBody = {
      question: 'Good Question',
      duration: 4,
      points: 5,
      answers: [{ answer: 'Test Answer 1', correct: true },
        { answer: 'Test Answer 2', correct: false },
        { answer: 'Test Answer 3', correct: false },
        { answer: 'Test Answer 4', correct: false }
      ]
    };
    const questionResult = httpAdminQuizQuestionsCreate(token, quizId, questionBody);
    const questionId = questionResult.jsonBody.questionId as number;
    const newQuestion = {
      question: 'Test Quiz 1',
      duration: 3,
      points: 1,
      answers: [{ answer: 'Test Answer 1', correct: false },
        { answer: 'Duplicate', correct: false },
        { answer: 'Test Answer 3', correct: false },
        { answer: 'Test Answer 4', correct: false }
      ]
    };
    const updateResult = httpAdminQuizQuestionUpdate(token, quizId, questionId, newQuestion);
    expect(updateResult.statusCode).toBe(400);
    expect(updateResult.jsonBody.error).toStrictEqual(expect.any(String));
  });
});

describe('Successful Question Creation', () => {
  beforeEach(() => {
    httpClear();
  });

  test('Success', () => {
    const registerResult = httpAdminAuthRegister('vlad@gmail.com', 'testpassword1', 'Vlad', 'Klymenko');
    const token:Token = JSON.parse(registerResult.jsonBody.token as string);

    const quizResult = httpAdminQuizCreate(token, 'Test Quiz 1', 'Test Description 1');
    const quizId = quizResult.jsonBody.quizId as number;

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
    const questionResult = httpAdminQuizQuestionsCreate(token, quizId, questionBody);
    expect(questionResult.statusCode).toBe(200);
    const questionId = questionResult.jsonBody.questionId as number;
    const newQuestion = {
      question: 'Test Question 2',
      duration: 3,
      points: 1,
      answers: [{ answer: 'Test Answer 1', correct: true },
        { answer: 'Test Answer 2', correct: false },
        { answer: 'Test Answer 3', correct: false },
        { answer: 'Test Answer 4', correct: false }
      ]
    };
    const updateResult = httpAdminQuizQuestionUpdate(token, quizId, questionId, newQuestion);
    expect(updateResult.statusCode).toBe(200);
    const quizInfo = httpAdminQuizInfo(token, quizId);
    expect(quizInfo.statusCode).toBe(200);
    const expectedResponse = [{
      questionId: expect.any(Number),
      question: 'Test Question 2',
      duration: 3,
      points: 1,
      answers: [{ answer: 'Test Answer 1', correct: true },
        { answer: 'Test Answer 2', correct: false },
        { answer: 'Test Answer 3', correct: false },
        { answer: 'Test Answer 4', correct: false }
      ]
    }];
    expect(quizInfo.jsonBody.questions).toStrictEqual(expectedResponse);
  });
});
