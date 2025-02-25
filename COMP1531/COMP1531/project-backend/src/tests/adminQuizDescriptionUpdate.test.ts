import { adminQuizCreate } from '../features/adminQuizCreate';
import { adminQuizDescriptionUpdate } from '../features/adminQuizDescriptionUpdate';
import { adminAuthRegister } from '../features/adminAuthRegister';
import { clear } from '../features/clear';

describe('adminQuizDescriptionUpdate', () => {
  test('userId is not a valid user', () => {
    clear();
    const token = adminAuthRegister('testEmail@gmail.com', 'testPwd123', 'testNameFirst', 'testNameLast');
    const quizId1 = adminQuizCreate(token, 'testName', 'testDescription');
    const badToken = { sessionId: token.sessionId + '1' };
    expect(() => adminQuizDescriptionUpdate(badToken, quizId1.quizId, 'NewDescription')).toThrow(Error);
  });

  test('Quiz ID does not refer to a valid quiz', () => {
    clear();
    const token = adminAuthRegister('testEmail@gmail.com', 'testPwd123', 'testNameFirst', 'testNameLast');
    const quizId1 = adminQuizCreate(token, 'testName', 'testDescription');
    expect(() => adminQuizDescriptionUpdate(token, quizId1.quizId + 1, 'NewDescription')).toThrow(Error);
  });

  test('Quiz ID does not refer to a quiz that this user owns', () => {
    clear();
    const Token1 = adminAuthRegister('testEmail1@gmail.com', 'testPwd1231', 'testNameFirstOne', 'testNameLastOne');
    const Token2 = adminAuthRegister('testEmail2@gmail.com', 'testPwd1232', 'testNameFirstTwo', 'testNameLastOne');
    adminQuizCreate(Token1, 'testName1', 'testDescription1');
    const quizId2 = adminQuizCreate(Token2, 'testName2', 'testDescription2');
    expect(() => adminQuizDescriptionUpdate(Token1, quizId2.quizId, 'NewDescription')).toThrow(Error);
  });

  test('Description is more than 100 characters in length', () => {
    clear();
    const token = adminAuthRegister('testEmail@gmail.com', 'testPwd123', 'testNameFirst', 'testNameLast');
    const quizId1 = adminQuizCreate(token, 'testName', 'testDescription');

    expect(() => adminQuizDescriptionUpdate(token, quizId1.quizId,
      'this description is more than one hundred characters long this description is more than one 100 chara')).toThrow(Error);
  });

  test('Successful description update', () => {
    clear();
    const token = adminAuthRegister('testEmail@gmail.com', 'testPwd123', 'testNameFirst', 'testNameLast');
    const quizId1 = adminQuizCreate(token, 'testName', 'testDescription');

    expect(adminQuizDescriptionUpdate(token, quizId1.quizId, 'NewDescription')).toStrictEqual({ });
  });
});
