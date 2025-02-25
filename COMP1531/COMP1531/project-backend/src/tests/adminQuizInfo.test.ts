import { adminQuizCreate } from '../features/adminQuizCreate';
import { adminQuizInfo } from '../features/adminQuizInfo';
import { adminAuthRegister } from '../features/adminAuthRegister';
import { clear } from '../features/clear';
import { Token } from '../dataStore';

beforeEach(() => {
  clear();
});

describe('adminQuizInfo tests', () => {
  describe('adminQuizInfo tests with invalid input', () => {
    let authUserIdTest: Token;
    let quizIdTest: number;
    beforeEach(() => {
      const user = adminAuthRegister('test@gmail.com', '123abc!@#', 'First', 'Last');
      authUserIdTest = user;
      const quiz = adminQuizCreate(authUserIdTest, 'Test Quiz', 'Description');
      quizIdTest = quiz.quizId;
    });

    test('Invalid input is given for authUserId: -1', () => {
      const badToken: Token = { sessionId: '-1' };
      expect(() => adminQuizInfo(badToken, quizIdTest)).toThrow(Error);
    });

    test('Invalid input is given to authUserId: 0', () => {
      const badToken: Token = { sessionId: '0' };
      expect(() => adminQuizInfo(badToken, quizIdTest)).toThrow(Error);
    });

    test('authUserId does not refer to a valid user', () => {
      const badSessionId: string = (parseInt(authUserIdTest.sessionId) + 1).toString();
      const badToken: Token = { sessionId: badSessionId };
      expect(() => adminQuizInfo(badToken, quizIdTest)).toThrow(Error);
    });

    test('Invalid negative input is given for quizId: -1', () => {
      expect(() => adminQuizInfo(authUserIdTest, -1)).toThrow(Error);
    });

    test('Invalid negative input is given for quizId: 0', () => {
      expect(() => adminQuizInfo(authUserIdTest, 0)).toThrow(Error);
    });

    test('quizId does not refer to a valid quiz', () => {
      expect(() => adminQuizInfo(authUserIdTest, quizIdTest + 1)).toThrow(Error);
    });

    test('quizId does not refer to a quiz that this user owns', () => {
      const user2 = adminAuthRegister('test2@gmail.com', '123abc!@#', 'FirstTwo', 'LastTwo');
      const authUserIdTest2 = user2;
      const quizid2 = adminQuizCreate(authUserIdTest2, 'Test Quiz2', 'Description2');
      expect(() => adminQuizInfo(authUserIdTest, quizid2.quizId)).toThrow(Error);
    });

    test('Quiz is not in the end state', () => {

    });
  });

  describe('adminQuizInfo tests with valid input', () => {
    let authUserIdTest1: Token, quizIdTest1: number, authUserIdTest2: Token, quizIdTest2: number,
      authUserIdTest3: Token, quizIdTest3: number, quizIdTest4: number;
    beforeEach(() => {
      const user1 = adminAuthRegister('test1@gmail.com', '123abc!@#', 'FirstOne', 'LastOne');
      authUserIdTest1 = user1;
      const quiz1 = adminQuizCreate(authUserIdTest1, 'Test Quiz 1', 'Description1');
      quizIdTest1 = quiz1.quizId;
      const user2 = adminAuthRegister('test2@gmail.com', '123abc!@#', 'FirstTwo', 'LastTwo');
      authUserIdTest2 = user2;
      const quiz2 = adminQuizCreate(authUserIdTest2, 'Test Quiz 2', 'Description2');
      quizIdTest2 = quiz2.quizId;
      const user3 = adminAuthRegister('test3@gmail.com', '123abc!@#', 'FirstThree', 'LastThree');
      authUserIdTest3 = user3;
      const quiz3 = adminQuizCreate(authUserIdTest3, 'Test Quiz 3', 'Description3');
      quizIdTest3 = quiz3.quizId;
      const quiz4 = adminQuizCreate(authUserIdTest1, 'Test Quiz 4', 'Description4');
      quizIdTest4 = quiz4.quizId;
    });

    test("Valid input is given (first test user's quiz)", () => {
      expect(adminQuizInfo(authUserIdTest1, quizIdTest1)).toStrictEqual({
        quizId: quizIdTest1,
        name: 'Test Quiz 1',
        timeCreated: expect.any(Number),
        timeLastEdited: expect.any(Number),
        description: 'Description1',
        numQuestions: 0,
        duration: 0,
        questions: [],
        thumbnailUrl: expect.any(String),
      });
    });

    test("Valid input is given (second test user's quiz)", () => {
      expect(adminQuizInfo(authUserIdTest2, quizIdTest2)).toStrictEqual({
        quizId: quizIdTest2,
        name: 'Test Quiz 2',
        timeCreated: expect.any(Number),
        timeLastEdited: expect.any(Number),
        description: 'Description2',
        numQuestions: 0,
        duration: 0,
        questions: [],
        thumbnailUrl: expect.any(String),
      });
    });

    test("Valid input is given (third test user's quiz)", () => {
      expect(adminQuizInfo(authUserIdTest3, quizIdTest3)).toStrictEqual({
        quizId: quizIdTest3,
        name: 'Test Quiz 3',
        timeCreated: expect.any(Number),
        timeLastEdited: expect.any(Number),
        description: 'Description3',
        numQuestions: 0,
        duration: 0,
        questions: [],
        thumbnailUrl: expect.any(String),
      });
    });

    test("Valid input is given (first test user's second quiz)", () => {
      expect(adminQuizInfo(authUserIdTest1, quizIdTest4)).toStrictEqual({
        quizId: quizIdTest4,
        name: 'Test Quiz 4',
        timeCreated: expect.any(Number),
        timeLastEdited: expect.any(Number),
        description: 'Description4',
        numQuestions: 0,
        duration: 0,
        questions: [],
        thumbnailUrl: expect.any(String),
      });
    });
  });
});
