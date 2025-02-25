import { adminQuizCreate } from '../features/adminQuizCreate';
import { adminQuizNameUpdate } from '../features/adminQuizNameUpdate';
import { adminAuthRegister } from '../features/adminAuthRegister';
import { clear } from '../features/clear';

describe('adminQuizNameUpdate', () => {
  test('authUserId is not a valid user', () => {
    clear();
    const token = adminAuthRegister('testEmail@gmail.com', 'testPwd123', 'testNameFirst', 'testNameLast');
    const badToken = { sessionId: token.sessionId + '1' };
    const quizId1 = adminQuizCreate(token, 'testName', 'testDescription');

    expect(() => adminQuizNameUpdate(badToken, quizId1.quizId, 'NewName')).toThrow(Error);
  });

  test('Quiz ID does not refer to a valid quiz', () => {
    clear();
    const token = adminAuthRegister('testEmail@gmail.com', 'testPwd123', 'testNameFirst', 'testNameLast');
    const quizId1 = adminQuizCreate(token, 'testName', 'testDescription');

    expect(() => adminQuizNameUpdate(token, quizId1.quizId + 1, 'NewName')).toThrow(Error);
  });

  test('Quiz ID does not refer to a quiz that this user owns', () => {
    clear();
    const Token1 = adminAuthRegister('testEmail1@gmail.com', 'testPwd1231', 'testNameFirstOne', 'testNameLastOne');
    const Token2 = adminAuthRegister('testEmail2@gmail.com', 'testPwd1232', 'testNameFirstTwo', 'testNameLastTwo');
    adminQuizCreate(Token1, 'testName1', 'testDescription1');
    const quizId2 = adminQuizCreate(Token2, 'testName2', 'testDescription2');

    expect(() => adminQuizNameUpdate(Token1, quizId2.quizId, 'NewName')).toThrow(Error);
  });

  test('Name contains invalid characters. Valid characters are alphanumeric and spaces, and is must be between 3 and 30 characters long', () => {
    clear();
    const token = adminAuthRegister('testEmail1@gmail.com', 'testPwd1231', 'testNameFirstOne', 'testNameLastOne');
    const quizId1 = adminQuizCreate(token, 'testName1', 'testDescription1');

    expect(adminQuizNameUpdate(token, quizId1.quizId, 'Hello123')).toStrictEqual({});
    expect(adminQuizNameUpdate(token, quizId1.quizId, 'Spaces are fine')).toStrictEqual({});
    expect(adminQuizNameUpdate(token, quizId1.quizId, 'Valid String 123')).toStrictEqual({});
    expect(() => adminQuizNameUpdate(token, quizId1.quizId, 'Special@Characters')).toThrow(Error);
    expect(() => adminQuizNameUpdate(token, quizId1.quizId, 'thisnameisververylong1234567890')).toThrow(Error);
    expect(() => adminQuizNameUpdate(token, quizId1.quizId, '')).toThrow(Error);
    expect(() => adminQuizNameUpdate(token, quizId1.quizId, '1')).toThrow(Error);
    expect(() => adminQuizNameUpdate(token, quizId1.quizId, '12')).toThrow(Error);
  });

  test('Name is already used by the current logged in user for another quiz', () => {
    clear();
    const token = adminAuthRegister('testEmail@gmail.com', 'testPwd123', 'testNameFirst', 'testNameLast');
    const quizId1 = adminQuizCreate(token, 'testName', 'testDescription');

    expect(() => adminQuizNameUpdate(token, quizId1.quizId, 'testName')).toThrow(Error);
  });

  test('Successful name change', () => {
    clear();
    const token = adminAuthRegister('testEmail@gmail.com', 'testPwd123', 'testNameFirst', 'testNameLast');
    const quizId1 = adminQuizCreate(token, 'testName', 'testDescription');

    expect(adminQuizNameUpdate(token, quizId1.quizId, 'newName')).toStrictEqual({ });
  });
});
