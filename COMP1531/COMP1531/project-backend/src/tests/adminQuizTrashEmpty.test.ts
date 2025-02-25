import {
  httpAdminAuthRegister,
  httpClear,
  httpAdminQuizCreateV2,
  httpAdminQuizRemoveV2,
  httpAdminQuizTrashEmpty,
} from './testHelper';
import { Token } from '../dataStore';
import { RequestHelperReturnType } from './testHelper';

describe('Testing DELETE - adminQuizTrashEmpty', () => {
  let user1: RequestHelperReturnType, user2: RequestHelperReturnType, user3: RequestHelperReturnType,
    quiz1: RequestHelperReturnType, quiz2: RequestHelperReturnType, quiz3: RequestHelperReturnType,
    quiz4: RequestHelperReturnType, quiz5: RequestHelperReturnType;
  beforeEach(() => {
    httpClear();
    user1 = httpAdminAuthRegister('test1@email.com', 'TestPassword123', 'Firstone', 'Lastone');
    user2 = httpAdminAuthRegister('test2@email.com', 'TestPassword123', 'Firsttwo', 'Lasttwo');
    user3 = httpAdminAuthRegister('test3@email.com', 'TestPassword123', 'Firstthree', 'Lastthree');
    quiz1 = httpAdminQuizCreateV2(JSON.parse(user1.jsonBody.token as string), 'Quiz1', 'Quiz1 description');
    quiz2 = httpAdminQuizCreateV2(JSON.parse(user2.jsonBody.token as string), 'Quiz2', 'Quiz2 description');
    quiz3 = httpAdminQuizCreateV2(JSON.parse(user3.jsonBody.token as string), 'Quiz3', 'Quiz3 description');
    quiz4 = httpAdminQuizCreateV2(JSON.parse(user1.jsonBody.token as string), 'Quiz4', 'Quiz4 description');
    quiz5 = httpAdminQuizCreateV2(JSON.parse(user1.jsonBody.token as string), 'Quiz5', 'Quiz5 description');
    httpAdminQuizRemoveV2(JSON.parse(user1.jsonBody.token as string), quiz1.jsonBody.quizId as number);
    httpAdminQuizRemoveV2(JSON.parse(user2.jsonBody.token as string), quiz2.jsonBody.quizId as number);
    httpAdminQuizRemoveV2(JSON.parse(user1.jsonBody.token as string), quiz4.jsonBody.quizId as number);
    httpAdminQuizRemoveV2(JSON.parse(user1.jsonBody.token as string), quiz5.jsonBody.quizId as number);
  });

  describe('Invalid input', () => {
    describe('Invalid token', () => {
      test('Token is empty', () => {
        const response = httpAdminQuizTrashEmpty({ sessionId: 'j' }, JSON.stringify([quiz1.jsonBody.quizId]));
        expect(response.statusCode).toBe(401);
        expect(response.jsonBody.error).toStrictEqual(expect.any(String));
      });

      test('Token is invalid (does not refer to valid logged in user session', () => {
        const response = httpAdminQuizTrashEmpty({ sessionId: 'InvalidToken' }, JSON.stringify([quiz1.jsonBody.quizId]));
        expect(response.statusCode).toBe(401);
        expect(response.jsonBody.error).toStrictEqual(expect.any(String));
      });
    });

    describe('Invalid quizIds', () => {
      test('One quizId is invalid', () => {
        const token: Token = JSON.parse(user1.jsonBody.token as string);
        expect(token).toBeDefined();
        const response = httpAdminQuizTrashEmpty(token, JSON.stringify([-1]));
        expect(response.statusCode).toBe(403);
        expect(response.jsonBody.error).toStrictEqual(expect.any(String));
      });

      test('Multiple quizIds are invalid', () => {
        const response = httpAdminQuizTrashEmpty(JSON.parse(user1.jsonBody.token as string), JSON.stringify([-3, -1, -2]));
        expect(response.statusCode).toBe(403);
        expect(response.jsonBody.error).toStrictEqual(expect.any(String));
      });
    });

    describe('Valid token is provided, but one or more quizIds are not owned by the user', () => {
      test('quizIds is empty', () => {
        const response = httpAdminQuizTrashEmpty(JSON.parse(user1.jsonBody.token as string), '[]');
        expect(response.statusCode).toBe(403);
        expect(response.jsonBody.error).toStrictEqual(expect.any(String));
      });

      test('One quizId is not owned by the user', () => {
        const response = httpAdminQuizTrashEmpty(JSON.parse(user1.jsonBody.token as string), JSON.stringify([quiz2.jsonBody.quizId]));
        expect(response.statusCode).toBe(403); // 400
        expect(response.jsonBody.error).toStrictEqual(expect.any(String));
      });

      test('Multiple quizIds are not owned by the user', () => {
        const response = httpAdminQuizTrashEmpty(JSON.parse(user1.jsonBody.token as string), JSON.stringify([quiz2.jsonBody.quizId, quiz3.jsonBody.quizId]));
        expect(response.statusCode).toBe(403);
        expect(response.jsonBody.error).toStrictEqual(expect.any(String));
      });
    });

    describe('Valid quizIds are provided, but quizzes are not in trash', () => {
      test('Quiz is not in trash', () => {
        const response = httpAdminQuizTrashEmpty(JSON.parse(user3.jsonBody.token as string), JSON.stringify([quiz3.jsonBody.quizId]));
        expect(response.statusCode).toBe(400);// 403
        expect(response.jsonBody.error).toStrictEqual(expect.any(String));
      });
    });
  });

  describe('Valid input', () => {
    test('Empty one quiz', () => {
      const response = httpAdminQuizTrashEmpty(JSON.parse(user1.jsonBody.token as string), JSON.stringify([quiz1.jsonBody.quizId]));
      expect(response.statusCode).toBe(200);
      expect(response.jsonBody).toStrictEqual({});
    });

    test('Empty two quizzes', () => {
      const response = httpAdminQuizTrashEmpty(JSON.parse(user1.jsonBody.token as string), JSON.stringify([quiz1.jsonBody.quizId, quiz4.jsonBody.quizId]));
      expect(response.statusCode).toBe(200);
      expect(response.jsonBody).toStrictEqual({});
    });

    test('Empty three quizzes', () => {
      const response = httpAdminQuizTrashEmpty(JSON.parse(user1.jsonBody.token as string), JSON.stringify([quiz1.jsonBody.quizId, quiz4.jsonBody.quizId, quiz5.jsonBody.quizId]));
      expect(response.statusCode).toBe(200);
      expect(response.jsonBody).toStrictEqual({});
    });
  });
});
