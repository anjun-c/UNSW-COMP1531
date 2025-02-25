import { adminQuizList } from '../features/adminQuizList';
import { adminQuizCreate } from '../features/adminQuizCreate';
import { clear } from '../features/clear';
import { adminAuthRegister } from '../features/adminAuthRegister';
import { Token } from '../dataStore';

describe('adminQuizList Errors', () => {
  test('Invalid authUserId', () => {
    clear();
    const badToken: Token = { sessionId: 'badToken' };
    expect(() => adminQuizList(badToken)).toThrow(Error);
  });
});

describe('adminQuizList Correct Inputs', () => {
  test('Empty list', () => {
    clear();
    const token = adminAuthRegister('JonDoe@gmail.com', 'testpassword1', 'John', 'Doe');
    const quizList = adminQuizList(token);
    expect(quizList).toStrictEqual({ quizzes: [] });
  });

  test('One quiz in list', () => {
    clear();
    const token = adminAuthRegister('JonDoe@gmail.com', 'testpassword1', 'John', 'Doe');
    const quizId1 = adminQuizCreate(token, 'Quiz 1', 'Quiz Description');
    const quizList = adminQuizList(token);
    expect(quizList).toStrictEqual({ quizzes: [{ quizId: quizId1.quizId, name: 'Quiz 1' }] });
  });

  test('Multiple quizzes in list by multiple authors', () => {
    clear();
    const token1 = adminAuthRegister('JonDoe@gmail.com', 'testpassword1', 'John', 'Doe');
    const token2 = adminAuthRegister('JaneDoe@gmail.com', 'testpassword1', 'Jane', 'Doe');
    const quizId1 = adminQuizCreate(token1, 'Quiz 1', 'Johns quiz');
    const quizId2 = adminQuizCreate(token2, 'Quiz 2', 'Janes quiz');
    const quizId3 = adminQuizCreate(token1, 'Quiz 3', 'Johns second quiz');
    const quizListJohn = adminQuizList(token1);
    expect(quizListJohn).toStrictEqual({
      quizzes: [
        { quizId: quizId1.quizId, name: 'Quiz 1' },
        { quizId: quizId3.quizId, name: 'Quiz 3' }
      ]
    });

    const quizListJane = adminQuizList(token2);
    expect(quizListJane).toStrictEqual({
      quizzes: [
        { quizId: quizId2.quizId, name: 'Quiz 2' }
      ]
    });
  });
});
