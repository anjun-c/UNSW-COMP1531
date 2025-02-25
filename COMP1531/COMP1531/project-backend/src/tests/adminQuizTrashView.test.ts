import {
  httpAdminQuizTrashView,
  httpClear,
  httpAdminAuthRegister,
  httpAdminQuizCreateV2,
  httpAdminQuizRemoveV2
} from './testHelper';

import { Token } from '../dataStore';

describe('Fail Cases', () => {
  beforeEach(() => {
    httpClear();
  });

  test('Token is Invalid', () => {
    const registerResult = httpAdminAuthRegister('vlad@gmail.com', 'testpassword1', 'Vlad', 'Klymenko');
    const token:Token = JSON.parse(registerResult.jsonBody.token as string);

    const badToken: Token = { sessionId: token.sessionId + '1' };

    const trashViewResult = httpAdminQuizTrashView(badToken);
    expect(trashViewResult.statusCode).toBe(401);
    expect(trashViewResult.jsonBody.error).toStrictEqual(expect.any(String));
  });
});

describe('Success Cases', () => {
  beforeEach(() => {
    httpClear();
  });

  test('View empty trash', () => {
    const registerResult = httpAdminAuthRegister('vlad@gmail.com', 'testpassword1', 'Vlad', 'Klymenko');
    const token:Token = JSON.parse(registerResult.jsonBody.token as string);

    const trashViewResult = httpAdminQuizTrashView(token);
    expect(trashViewResult.statusCode).toBe(200);
    expect(trashViewResult.jsonBody.quizzes).toEqual([]);
  });

  test('View quizzes in trash', () => {
    const registerResult = httpAdminAuthRegister('vlad@gmail.com', 'testpassword1', 'Vlad', 'Klymenko');
    const token:Token = JSON.parse(registerResult.jsonBody.token as string);

    const quiz1 = httpAdminQuizCreateV2(token, 'Test Quiz 1', 'Test Description 1');
    const quiz2 = httpAdminQuizCreateV2(token, 'Test Quiz 2', 'Test Description 2');

    httpAdminQuizRemoveV2(token, quiz1.jsonBody.quizId as number);
    httpAdminQuizRemoveV2(token, quiz2.jsonBody.quizId as number);

    const trashViewResult = httpAdminQuizTrashView(token);
    expect(trashViewResult.statusCode).toBe(200);
    expect(trashViewResult.jsonBody.quizzes).toEqual([
      { quizId: quiz1.jsonBody.quizId, name: 'Test Quiz 1' },
      { quizId: quiz2.jsonBody.quizId, name: 'Test Quiz 2' }
    ]);
  });

  test('View specific quiz in trash', () => {
    const registerResult = httpAdminAuthRegister('vlad@gmail.com', 'testpassword1', 'Vlad', 'Klymenko');
    const token:Token = JSON.parse(registerResult.jsonBody.token as string);

    const quiz1 = httpAdminQuizCreateV2(token, 'Test Quiz 1', 'Test Description 1'); // eslint-disable-line @typescript-eslint/no-unused-vars
    const quiz2 = httpAdminQuizCreateV2(token, 'Test Quiz 2', 'Test Description 2');
    const quiz3 = httpAdminQuizCreateV2(token, 'Test Quiz 3', 'Test Description 3'); // eslint-disable-line @typescript-eslint/no-unused-vars

    httpAdminQuizRemoveV2(token, quiz2.jsonBody.quizId as number);

    const trashViewResult = httpAdminQuizTrashView(token);
    expect(trashViewResult.statusCode).toBe(200);
    expect(trashViewResult.jsonBody.quizzes).toEqual([
      { quizId: quiz2.jsonBody.quizId, name: 'Test Quiz 2' }
    ]);
  });
});
