import { adminQuizCreate } from '../features/adminQuizCreate';
import { adminAuthRegister } from '../features/adminAuthRegister';
import { adminQuizInfo } from '../features/adminQuizInfo';
import { clear } from '../features/clear';

test('Invalid User ID', () => {
  clear();
  const token = adminAuthRegister('JonDoe@gmail.com', 'testpassword1', 'John', 'Doe');
  const badToken = { sessionId: token.sessionId + '1' };
  expect(() => adminQuizCreate(badToken, 'Quiz 1', 'Quiz Description')).toThrow('UserId is not a valid user.');
});

test('Invalid Quiz Name Length', () => {
  clear();
  const token = adminAuthRegister('JonDoe@gmail.com', 'testpassword1', 'John', 'Doe');
  expect(() => adminQuizCreate(token, '', 'Quiz Description')).toThrow('Invalid Quiz Name Length');
  expect(() => adminQuizCreate(token, 'he', 'Quiz Description')).toThrow('Invalid Quiz Name Length');
  expect(() => adminQuizCreate(token, 'Extremely Long Name That Should Not Pass', 'Quiz Description')).toThrow('Invalid Quiz Name Length');
});

test('Invalid Quiz Name Characters', () => {
  clear();
  const token = adminAuthRegister('JonDoe@gmail.com', 'testpassword1', 'John', 'Doe');
  expect(() => adminQuizCreate(token, 'Quiz 1!', 'Quiz Description')).toThrow('Invalid Quiz Name Characters');
  expect(() => adminQuizCreate(token, 'Quiz 1@', 'Quiz Description')).toThrow('Invalid Quiz Name Characters');
  expect(() => adminQuizCreate(token, 'Quiz 1×', 'Quiz Description')).toThrow('Invalid Quiz Name Characters');
  expect(() => adminQuizCreate(token, '♀ⱥ╜╣☼╘', 'Quiz Description')).toThrow('Invalid Quiz Name Characters');
});

test('Invalid Quiz Description Length', () => {
  clear();
  const longText = 'x'.repeat(102);
  const token = adminAuthRegister('JonDoe@gmail.com', 'testpassword1', 'John', 'Doe');
  expect(() => adminQuizCreate(token, 'Quiz 1', longText)).toThrow('Invalid Quiz Description Length');
});

test('Name is already taken by same user', () => {
  clear();
  const token = adminAuthRegister('JonDoe@gmail.com', 'testpassword1', 'John', 'Doe');
  const quizId1 = adminQuizCreate(token, 'Quiz 1', 'Quiz Description');
  expect(quizId1).toStrictEqual({ quizId: expect.any(Number) });
  expect(() => adminQuizCreate(token, 'Quiz 1', 'Duplicate description')).toThrow('Name is already taken by same user');
});

test('Valid Quiz Creation', () => {
  clear();
  const token = adminAuthRegister('JonDoe@gmail.com', 'testpassword1', 'John', 'Doe');
  const quizId1 = adminQuizCreate(token, 'My Quiz', 'Quiz Description');
  expect(quizId1).toStrictEqual({ quizId: expect.any(Number) });
  const quizId1Info = adminQuizInfo(token, quizId1.quizId);
  expect(quizId1Info).toStrictEqual({
    quizId: quizId1.quizId,
    name: 'My Quiz',
    timeCreated: expect.any(Number),
    timeLastEdited: expect.any(Number),
    description: 'Quiz Description',
    numQuestions: 0,
    questions: [],
    duration: 0,
    thumbnailUrl: expect.any(String),
  });
});
