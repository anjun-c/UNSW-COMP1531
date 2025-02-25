import { Token } from '../dataStore';
import { quizTrashInfo } from '../features/adminQuizTrashView';
import { httpAdminAuthRegister, httpClear, httpAdminQuizRestore, httpAdminQuizCreate, httpAdminQuizRemove, httpAdminQuizInfo, httpAdminQuizTrashView } from './testHelper';

describe('Testing POST - adminQuizRestore', () => {
  beforeEach(() => {
    httpClear();
  });

  test('Quiz name of the restored quiz is already used by another active quiz', () => {
    const registerResult = httpAdminAuthRegister('oliver@unsw.edu.au', 'testpassword1', 'Oliver', 'Bowling');
    expect(registerResult.statusCode).toBe(200);
    const token: Token = (JSON.parse(registerResult.jsonBody.token as string));
    expect(token).toBeDefined();

    const createQuizResult = httpAdminQuizCreate(token, 'Test Quiz 1', 'Test Description 1');
    expect(createQuizResult.statusCode).toBe(200);
    const quizId: number = createQuizResult.jsonBody.quizId as number;

    const quizRemoveResult = httpAdminQuizRemove(token, quizId);
    expect(quizRemoveResult.statusCode).toBe(200);

    const viewResult = httpAdminQuizTrashView(token);
    expect(viewResult.statusCode).toBe(200);
    const quizzesArr = viewResult.jsonBody.quizzes as quizTrashInfo[];
    expect(quizzesArr.length).toStrictEqual(1);

    const createQuizResult2 = httpAdminQuizCreate(token, 'Test Quiz 1', 'Test Description 1');
    expect(createQuizResult2.statusCode).toBe(200);

    const restoreResult = httpAdminQuizRestore(token, quizId);
    expect(restoreResult.statusCode).toBe(400);
    expect(restoreResult.jsonBody).toStrictEqual({ error: expect.any(String) });
  });

  test('Quiz ID refers to a quiz that is not currently in the trash', () => {
    const registerResult = httpAdminAuthRegister('oliver@unsw.edu.au', 'testpassword1', 'Oliver', 'Bowling');
    expect(registerResult.statusCode).toBe(200);
    const token: Token = JSON.parse(registerResult.jsonBody.token as string);
    expect(token).toBeDefined();

    const createQuizResult = httpAdminQuizCreate(token, 'Test Quiz 1', 'Test Description 1');
    expect(createQuizResult.statusCode).toBe(200);
    const quizId: number = createQuizResult.jsonBody.quizId as number;

    const restoreResult = httpAdminQuizRestore(token, quizId);
    expect(restoreResult.statusCode).toBe(400);
    expect(restoreResult.jsonBody).toStrictEqual({ error: expect.any(String) });
  });

  test('Token is invalid', () => {
    const registerResult = httpAdminAuthRegister('oliver@unsw.edu.au', 'testpassword1', 'Oliver', 'Bowling');
    expect(registerResult.statusCode).toBe(200);
    const token: Token = JSON.parse(registerResult.jsonBody.token as string);
    expect(token).toBeDefined();

    const badToken: Token = { sessionId: token.sessionId + '1' };

    const createQuizResult = httpAdminQuizCreate(token, 'Test Quiz 1', 'Test Description 1');
    expect(createQuizResult.statusCode).toBe(200);
    const quizId: number = createQuizResult.jsonBody.quizId as number;

    const quizRemoveResult = httpAdminQuizRemove(token, quizId);
    expect(quizRemoveResult.statusCode).toBe(200);

    const restoreResult = httpAdminQuizRestore(badToken, quizId);
    expect(restoreResult.statusCode).toBe(401);
    expect(restoreResult.jsonBody).toStrictEqual({ error: expect.any(String) });
  });

  test('Valid token is provided, but user is not an owner of this quiz', () => {
    const registerResult1 = httpAdminAuthRegister('oliver@unsw.edu.au', 'testpassword1', 'Oliver', 'Bowling');
    expect(registerResult1.statusCode).toBe(200);
    const token1: Token = JSON.parse(registerResult1.jsonBody.token as string);
    expect(token1).toBeDefined();

    const registerResult2 = httpAdminAuthRegister('alex@unsw.edu.au', 'testpassword2', 'Alex', 'Yecies');
    expect(registerResult2.statusCode).toBe(200);
    const token2: Token = JSON.parse(registerResult2.jsonBody.token as string);
    expect(token2).toBeDefined();

    const createQuizResult = httpAdminQuizCreate(token1, 'Test Quiz 1', 'Test Description 1');
    expect(createQuizResult.statusCode).toBe(200);
    const quizId1: number = createQuizResult.jsonBody.quizId as number;

    const quizRemoveResult = httpAdminQuizRemove(token1, quizId1);
    expect(quizRemoveResult.statusCode).toBe(200);

    const restoreResult = httpAdminQuizRestore(token2, quizId1);
    expect(restoreResult.statusCode).toBe(403);
    expect(restoreResult.jsonBody).toStrictEqual({ error: expect.any(String) });
  });

  test('Successful restoration', () => {
    const registerResult = httpAdminAuthRegister('oliver@unsw.edu.au', 'testpassword1', 'Oliver', 'Bowling');
    expect(registerResult.statusCode).toBe(200);
    const token: Token = JSON.parse(registerResult.jsonBody.token as string);
    expect(token).toBeDefined();

    const createQuizResult = httpAdminQuizCreate(token, 'Test Quiz 1', 'Test Description 1');
    expect(createQuizResult.statusCode).toBe(200);
    const quizId: number = createQuizResult.jsonBody.quizId as number;

    const quizRemoveResult = httpAdminQuizRemove(token, quizId);
    expect(quizRemoveResult.statusCode).toBe(200);

    const viewResult = httpAdminQuizTrashView(token);
    expect(viewResult.statusCode).toBe(200);
    const quizArr = viewResult.jsonBody.quizzes as quizTrashInfo[];
    expect(quizArr.length).toStrictEqual(1);

    const restoreResult = httpAdminQuizRestore(token, quizId);
    expect(restoreResult.statusCode).toBe(200);

    const viewResult1 = httpAdminQuizTrashView(token);
    expect(viewResult1.statusCode).toBe(200);
    const quizArr1 = viewResult1.jsonBody.quizzes as quizTrashInfo[];
    expect(quizArr1.length).toStrictEqual(0);

    const quizInfoResult1 = httpAdminQuizInfo(token, quizId);
    expect(quizInfoResult1.statusCode).toBe(200);
  });

  test('multiple restorations', () => {
    const registerResult = httpAdminAuthRegister('oliver@unsw.edu.au', 'testpassword1', 'Oliver', 'Bowling');
    expect(registerResult.statusCode).toBe(200);
    const token: Token = JSON.parse(registerResult.jsonBody.token as string);
    expect(token).toBeDefined();

    const createQuizResult1 = httpAdminQuizCreate(token, 'Test Quiz 1', 'Test Description 1');
    expect(createQuizResult1.statusCode).toBe(200);
    const quizId1: number = createQuizResult1.jsonBody.quizId as number;

    const createQuizResult2 = httpAdminQuizCreate(token, 'Test Quiz 2', 'Test Description 2');
    expect(createQuizResult2.statusCode).toBe(200);
    const quizId2: number = createQuizResult2.jsonBody.quizId as number;

    const quizRemoveResult1 = httpAdminQuizRemove(token, quizId1);
    expect(quizRemoveResult1.statusCode).toBe(200);

    const quizRemoveResult2 = httpAdminQuizRemove(token, quizId2);
    expect(quizRemoveResult2.statusCode).toBe(200);

    const viewResult = httpAdminQuizTrashView(token);
    expect(viewResult.statusCode).toBe(200);
    const quizArr = viewResult.jsonBody.quizzes as quizTrashInfo[];
    expect(quizArr.length).toStrictEqual(2);

    const restoreResult1 = httpAdminQuizRestore(token, quizId1);
    expect(restoreResult1.statusCode).toBe(200);

    const viewResult1 = httpAdminQuizTrashView(token);
    expect(viewResult1.statusCode).toBe(200);
    const quizArr1 = viewResult1.jsonBody.quizzes as quizTrashInfo[];
    expect(quizArr1.length).toStrictEqual(1);
    expect(quizArr1).toStrictEqual([{ quizId: quizId2, name: 'Test Quiz 2' }]);

    const restoreResult = httpAdminQuizRestore(token, quizId2);
    expect(restoreResult.statusCode).toBe(200);

    const viewResult2 = httpAdminQuizTrashView(token);
    expect(viewResult2.statusCode).toBe(200);
    const quizArr2 = viewResult2.jsonBody.quizzes as quizTrashInfo[];
    expect(quizArr2.length).toStrictEqual(0);

    const quizInfoResult1 = httpAdminQuizInfo(token, quizId1);
    expect(quizInfoResult1.statusCode).toBe(200);

    const quizInfoResult2 = httpAdminQuizInfo(token, quizId2);
    expect(quizInfoResult2.statusCode).toBe(200);
  });
});
