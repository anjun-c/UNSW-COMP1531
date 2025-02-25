import {
  httpAdminQuizQuestionsCreate,
  httpClear,
  httpAdminAuthRegister,
  httpAdminQuizCreate,
  httpAdminQuizInfo
} from './testHelper';

import { Question, Token } from '../dataStore';

describe('Error Due to Bad Token Or Bad Quiz ID - QuizQuestionCreate', () => {
  beforeEach(() => {
    httpClear();
  });

  test('Token is Invalid', () => {
    const registerResult = httpAdminAuthRegister('vlad@gmail.com', 'testpassword1', 'Vlad', 'Klymenko');
    const token:Token = JSON.parse(registerResult.jsonBody.token as string);

    const quizResult = httpAdminQuizCreate(token, 'Test Quiz 1', 'Test Description 1');
    const quizId = quizResult.jsonBody.quizId as number;

    const badToken:Token = { sessionId: token.sessionId + '1' };
    const questionBody = {
      question: 'Test Question 1',
      duration: 4,
      points: 5,
      answers: [{ answer: 'Test Answer 1', correct: true }]
    };
    const questionResult = httpAdminQuizQuestionsCreate(badToken, quizId, questionBody);
    expect(questionResult.statusCode).toBe(401);
    expect(questionResult.jsonBody.error).toStrictEqual(expect.any(String));
  });

  test('User is not owner', () => {
    const user1 = httpAdminAuthRegister('vlad@gmail.com', 'testpassword1', 'Vlad', 'Klymenko');
    const user2 = httpAdminAuthRegister('jon@gmail.com', 'testpassword1', 'jone', 'doe');
    const quizResult = httpAdminQuizCreate(JSON.parse(user2.jsonBody.token as string), 'Test Quiz 1', 'Test Description 1');
    const quizId = quizResult.jsonBody.quizId as number;
    const token = JSON.parse(user1.jsonBody.token as string);
    const questionBody = {
      question: 'Test Question 1',
      duration: 4,
      points: 5,
      answers: [{ answer: 'Test Answer 1', correct: true }]
    };
    const questionResult = httpAdminQuizQuestionsCreate(token, quizId, questionBody);
    expect(questionResult.statusCode).toBe(403);
    expect(questionResult.jsonBody.error).toStrictEqual(expect.any(String));
  });
});

describe('Error Due to Bad Question Body - QuizQuestionCreate', () => {
  beforeEach(() => {
    httpClear();
  });
  test('Question string is less than 5 characters in length', () => {
    const registerResult = httpAdminAuthRegister('vlad@gmail.com', 'testpassword1', 'Vlad', 'Klymenko');
    const token:Token = JSON.parse(registerResult.jsonBody.token as string);

    const quizResult = httpAdminQuizCreate(token, 'Test Quiz 1', 'Test Description 1');
    const quizId = quizResult.jsonBody.quizId as number;

    const questionBody = {
      question: 'smol',
      duration: 4,
      points: 5,
      answers: [{ answer: 'Test Answer 1', correct: true },
        { answer: 'Test Answer 2', correct: false },
        { answer: 'Test Answer 3', correct: false },
        { answer: 'Test Answer 4', correct: false }
      ]
    };
    const questionResult = httpAdminQuizQuestionsCreate(token, quizId, questionBody);
    expect(questionResult.statusCode).toBe(400);
    expect(questionResult.jsonBody.error).toStrictEqual(expect.any(String));
  });

  test('Question string is greater than 50 characters in length', () => {
    const registerResult = httpAdminAuthRegister('vlad@gmail.com', 'testpassword1', 'Vlad', 'Klymenko');
    const token:Token = JSON.parse(registerResult.jsonBody.token as string);

    const quizResult = httpAdminQuizCreate(token, 'Test Quiz 1', 'Test Description 1');
    const quizId = quizResult.jsonBody.quizId as number;

    const questionBody = {
      question: 'Extremely long string that is the question for the quiz thats over 50',
      duration: 4,
      points: 5,
      answers: [{ answer: 'Test Answer 1', correct: true },
        { answer: 'Test Answer 2', correct: false },
        { answer: 'Test Answer 3', correct: false },
        { answer: 'Test Answer 4', correct: false }
      ]
    };
    const questionResult = httpAdminQuizQuestionsCreate(token, quizId, questionBody);
    expect(questionResult.statusCode).toBe(400);
    expect(questionResult.jsonBody.error).toStrictEqual(expect.any(String));
  });

  test('The question has more than 6 answers', () => {
    const registerResult = httpAdminAuthRegister('vlad@gmail.com', 'testpassword1', 'Vlad', 'Klymenko');
    const token:Token = JSON.parse(registerResult.jsonBody.token as string);

    const quizResult = httpAdminQuizCreate(token, 'Test Quiz 1', 'Test Description 1');
    const quizId = quizResult.jsonBody.quizId as number;

    const questionBody = {
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
    const questionResult = httpAdminQuizQuestionsCreate(token, quizId, questionBody);
    expect(questionResult.statusCode).toBe(400);
    expect(questionResult.jsonBody.error).toStrictEqual(expect.any(String));
  });

  test('The question less than 2 answers', () => {
    const registerResult = httpAdminAuthRegister('vlad@gmail.com', 'testpassword1', 'Vlad', 'Klymenko');
    const token:Token = JSON.parse(registerResult.jsonBody.token as string);

    const quizResult = httpAdminQuizCreate(token, 'Test Quiz 1', 'Test Description 1');
    const quizId = quizResult.jsonBody.quizId as number;

    const questionBody = {
      question: 'Test Quiz 1',
      duration: 4,
      points: 5,
      answers: [{ answer: 'Test Answer 1', correct: true },
      ]
    };
    const questionResult = httpAdminQuizQuestionsCreate(token, quizId, questionBody);
    expect(questionResult.statusCode).toBe(400);
    expect(questionResult.jsonBody.error).toStrictEqual(expect.any(String));
  });

  test('Question Duration is not a positive number', () => {
    const registerResult = httpAdminAuthRegister('vlad@gmail.com', 'testpassword1', 'Vlad', 'Klymenko');
    const token:Token = JSON.parse(registerResult.jsonBody.token as string);

    const quizResult = httpAdminQuizCreate(token, 'Test Quiz 1', 'Test Description 1');
    const quizId = quizResult.jsonBody.quizId as number;

    const questionBody = {
      question: 'Test Quiz 1',
      duration: -1,
      points: 5,
      answers: [{ answer: 'Test Answer 1', correct: true },
        { answer: 'Test Answer 2', correct: false },
        { answer: 'Test Answer 3', correct: false },
        { answer: 'Test Answer 4', correct: false }
      ]
    };
    const questionResult = httpAdminQuizQuestionsCreate(token, quizId, questionBody);
    expect(questionResult.statusCode).toBe(400);
    expect(questionResult.jsonBody.error).toStrictEqual(expect.any(String));
  });

  // test('Sum of the question durations in the quiz exceeds 3 minutes', () => {
  //   const registerResult = httpAdminAuthRegister('vlad@gmail.com', 'testpassword1', 'Vlad', 'Klymenko');
  //   const quizResult = httpAdminQuizCreate(registerResult.jsonBody.token, 'Test Quiz 1', 'Test Description 1');
  //   const quizId = quizResult.jsonBody.quizId;
  //   const token = registerResult.jsonBody.token;
  //   const questionBody = {
  //     question: 'Test Quiz 1',
  //     duration: 5,
  //     points: 5,
  //     answers: [{ answer: 'Test Answer 1', correct: true },
  //       { answer: 'Test Answer 2', correct: false },
  //       { answer: 'Test Answer 3', correct: false },
  //       { answer: 'Test Answer 4', correct: false }
  //     ]
  //   };
  //   const questionResult1 = httpAdminQuizQuestionsCreate(token, quizId, questionBody);
  //   console.log(questionResult1);
  //   expect(questionResult1.statusCode).toBe(200);
  //   const questionBody2 = {
  //     question: 'Test Quiz Q2',
  //     duration: 170,
  //     points: 5,
  //     answers: [{ answer: 'Test Answer 1', correct: true },
  //       { answer: 'Test Answer 2', correct: false },
  //       { answer: 'Test Answer 3', correct: false },
  //       { answer: 'Test Answer 4', correct: false }
  //     ]
  //   };
  //   const questionResult = httpAdminQuizQuestionsCreate(token, quizId, questionBody2);
  //   expect(questionResult.statusCode).toBe(400);
  //   expect(questionResult.jsonBody.error).toStrictEqual(expect.any(String));
  // });

  test('Points awarded for the question are less than 0', () => {
    const registerResult = httpAdminAuthRegister('vlad@gmail.com', 'testpassword1', 'Vlad', 'Klymenko');
    const token:Token = JSON.parse(registerResult.jsonBody.token as string);

    const quizResult = httpAdminQuizCreate(token, 'Test Quiz 1', 'Test Description 1');
    const quizId = quizResult.jsonBody.quizId as number;

    const questionBody = {
      question: 'Test Quiz 1',
      duration: 3,
      points: -1,
      answers: [{ answer: 'Test Answer 1', correct: true },
        { answer: 'Test Answer 2', correct: false },
        { answer: 'Test Answer 3', correct: false },
        { answer: 'Test Answer 4', correct: false }
      ]
    };
    const questionResult = httpAdminQuizQuestionsCreate(token, quizId, questionBody);
    expect(questionResult.statusCode).toBe(400);
    expect(questionResult.jsonBody.error).toStrictEqual(expect.any(String));
  });

  test('Points awarded for the question are greater than 10', () => {
    const registerResult = httpAdminAuthRegister('vlad@gmail.com', 'testpassword1', 'Vlad', 'Klymenko');
    const token:Token = JSON.parse(registerResult.jsonBody.token as string);

    const quizResult = httpAdminQuizCreate(token, 'Test Quiz 1', 'Test Description 1');
    const quizId = quizResult.jsonBody.quizId as number;

    const questionBody = {
      question: 'Test Quiz 1',
      duration: 3,
      points: 20,
      answers: [{ answer: 'Test Answer 1', correct: true },
        { answer: 'Test Answer 2', correct: false },
        { answer: 'Test Answer 3', correct: false },
        { answer: 'Test Answer 4', correct: false }
      ]
    };
    const questionResult = httpAdminQuizQuestionsCreate(token, quizId, questionBody);
    expect(questionResult.statusCode).toBe(400);
    expect(questionResult.jsonBody.error).toStrictEqual(expect.any(String));
  });

  test('Points awarded for the question are less than 1', () => {
    const registerResult = httpAdminAuthRegister('vlad@gmail.com', 'testpassword1', 'Vlad', 'Klymenko');
    const token:Token = JSON.parse(registerResult.jsonBody.token as string);

    const quizResult = httpAdminQuizCreate(token, 'Test Quiz 1', 'Test Description 1');
    const quizId = quizResult.jsonBody.quizId as number;

    const questionBody = {
      question: 'Test Quiz 1',
      duration: 3,
      points: 0.5,
      answers: [{ answer: 'Test Answer 1', correct: true },
        { answer: 'Test Answer 2', correct: false },
        { answer: 'Test Answer 3', correct: false },
        { answer: 'Test Answer 4', correct: false }
      ]
    };
    const questionResult = httpAdminQuizQuestionsCreate(token, quizId, questionBody);
    expect(questionResult.statusCode).toBe(400);
    expect(questionResult.jsonBody.error).toStrictEqual(expect.any(String));
  });

  test('The length of any answer is shorter than 1 character long', () => {
    const registerResult = httpAdminAuthRegister('vlad@gmail.com', 'testpassword1', 'Vlad', 'Klymenko');
    const token:Token = JSON.parse(registerResult.jsonBody.token as string);

    const quizResult = httpAdminQuizCreate(token, 'Test Quiz 1', 'Test Description 1');
    const quizId = quizResult.jsonBody.quizId as number;

    const questionBody = {
      question: 'Test Quiz 1',
      duration: 3,
      points: 1,
      answers: [{ answer: '', correct: true },
        { answer: 'Test Answer 2', correct: false },
        { answer: 'Test Answer 3', correct: false },
        { answer: 'Test Answer 4', correct: false }
      ]
    };
    const questionResult = httpAdminQuizQuestionsCreate(token, quizId, questionBody);
    expect(questionResult.statusCode).toBe(400);
    expect(questionResult.jsonBody.error).toStrictEqual(expect.any(String));
  });

  test('The length of any answer is longer than 30 character long', () => {
    const registerResult = httpAdminAuthRegister('vlad@gmail.com', 'testpassword1', 'Vlad', 'Klymenko');
    const token:Token = JSON.parse(registerResult.jsonBody.token as string);

    const quizResult = httpAdminQuizCreate(token, 'Test Quiz 1', 'Test Description 1');
    const quizId = quizResult.jsonBody.quizId as number;

    const questionBody = {
      question: 'Test Quiz 1',
      duration: 3,
      points: 1,
      answers: [{ answer: 'Extremely long question answer field is not compatible', correct: true },
        { answer: 'Test Answer 2', correct: false },
        { answer: 'Test Answer 3', correct: false },
        { answer: 'Test Answer 4', correct: false }
      ]
    };
    const questionResult = httpAdminQuizQuestionsCreate(token, quizId, questionBody);
    expect(questionResult.statusCode).toBe(400);
    expect(questionResult.jsonBody.error).toStrictEqual(expect.any(String));
  });

  test('Any answer strings are duplicates of one another (within the same question)', () => {
    const registerResult = httpAdminAuthRegister('vlad@gmail.com', 'testpassword1', 'Vlad', 'Klymenko');
    const token:Token = JSON.parse(registerResult.jsonBody.token as string);

    const quizResult = httpAdminQuizCreate(token, 'Test Quiz 1', 'Test Description 1');
    const quizId = quizResult.jsonBody.quizId as number;

    const questionBody = {
      question: 'Test Quiz 1',
      duration: 3,
      points: 1,
      answers: [{ answer: 'Duplicate', correct: true },
        { answer: 'Duplicate', correct: false },
        { answer: 'Test Answer 3', correct: false },
        { answer: 'Test Answer 4', correct: false }
      ]
    };
    const questionResult = httpAdminQuizQuestionsCreate(token, quizId, questionBody);
    expect(questionResult.statusCode).toBe(400);
    expect(questionResult.jsonBody.error).toStrictEqual(expect.any(String));
  });

  test('There are no correct answers', () => {
    const registerResult = httpAdminAuthRegister('vlad@gmail.com', 'testpassword1', 'Vlad', 'Klymenko');
    const token:Token = JSON.parse(registerResult.jsonBody.token as string);

    const quizResult = httpAdminQuizCreate(token, 'Test Quiz 1', 'Test Description 1');
    const quizId = quizResult.jsonBody.quizId as number;

    const questionBody = {
      question: 'Test Quiz 1',
      duration: 3,
      points: 1,
      answers: [{ answer: 'Test Answer 1', correct: false },
        { answer: 'Duplicate', correct: false },
        { answer: 'Test Answer 3', correct: false },
        { answer: 'Test Answer 4', correct: false }
      ]
    };
    const questionResult = httpAdminQuizQuestionsCreate(token, quizId, questionBody);
    expect(questionResult.statusCode).toBe(400);
    expect(questionResult.jsonBody.error).toStrictEqual(expect.any(String));
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
        { answer: 'Test Answer 2', correct: false },
        { answer: 'Test Answer 3', correct: false },
        { answer: 'Test Answer 4', correct: false }
      ]
    };
    const questionResult = httpAdminQuizQuestionsCreate(token, quizId, questionBody);
    expect(questionResult.statusCode).toBe(200);
    const quizInfo = httpAdminQuizInfo(token, quizId);
    expect(quizInfo.statusCode).toBe(200);
    const expectedResponse = {
      questionId: expect.any(Number),
      question: 'Test Quiz 1',
      duration: 3,
      points: 1,
      answers: [{ answerId: expect.any(Number), answer: 'Test Answer 1', correct: true, colour: 'red' },
        { answerId: expect.any(Number), answer: 'Test Answer 2', correct: false, colour: 'blue' },
        { answerId: expect.any(Number), answer: 'Test Answer 3', correct: false, colour: 'yellow' },
        { answerId: expect.any(Number), answer: 'Test Answer 4', correct: false, colour: 'green' }
      ]
    };
    const questionArr = quizInfo.jsonBody.questions as Question[];
    expect(questionArr[0]).toStrictEqual(expectedResponse);
  });
});
