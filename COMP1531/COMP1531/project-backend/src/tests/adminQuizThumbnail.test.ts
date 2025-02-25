import {
  httpClear,
  httpAdminQuizThumbnail,
  httpAdminAuthRegister,
  httpAdminQuizCreateV2,
  httpAdminQuizInfoV2
} from './testHelper';
import { Token } from '../dataStore';

describe('Success Case', () => {
  let token: Token;
  let quizId: number;
  let imgUrl: string;
  beforeEach(() => {
    httpClear();
    token = JSON.parse(httpAdminAuthRegister('vlad@unsw.edu.au', 'testpassword1', 'vlad', 'klymenko').jsonBody.token as string);
    quizId = httpAdminQuizCreateV2(token, 'My Quiz', 'Quiz Description').jsonBody.quizId as number;
    imgUrl = 'https://www.kernel.org/theme/images/logos/tux.png';
  });

  test('Successful Case', () => {
    const result = httpAdminQuizThumbnail(token, quizId, imgUrl);
    const timeNow = Date.now();
    expect(result.statusCode).toBe(200);
    const quizInfo = httpAdminQuizInfoV2(token, quizId);
    expect(quizInfo.jsonBody.thumbnailUrl).toBe(imgUrl);
    expect(quizInfo.jsonBody.timeLastEdited).toBeGreaterThan(timeNow - 1000);
    expect(quizInfo.jsonBody.timeLastEdited).toBeLessThan(timeNow + 1000);
  });
});

describe('QuizThumbnail 401 and 403', () => {
  let token: Token;
  let token2: Token;
  let quizId: number;
  let imgUrl: string;
  beforeEach(() => {
    httpClear();
    const registerResult = httpAdminAuthRegister('oliver@unsw.edu.au', 'testpassword1', 'oliver', 'bowling');
    token = JSON.parse(registerResult.jsonBody.token as string);

    const registerResult2 = httpAdminAuthRegister('vlad@unsw.edu.au', 'testpassword1', 'vlad', 'klymenko');
    token2 = JSON.parse(registerResult2.jsonBody.token as string);

    const quizCreateResult = httpAdminQuizCreateV2(token, 'My Quiz', 'Quiz Description');
    quizId = quizCreateResult.jsonBody.quizId as number;

    imgUrl = 'https://www.kernel.org/theme/images/logos/tux.png';
  });

  test('Valid token is provided, but quiz doesnt exist', () => {
    const fakeQuizId = 29;
    const sessionResult = httpAdminQuizThumbnail(token, fakeQuizId, imgUrl);
    expect(sessionResult.jsonBody.error).toStrictEqual(expect.any(String));
    expect(sessionResult.statusCode).toBe(403);
  });

  test('Valid token is provided, but user doesnt own quiz', () => {
    const sessionResult = httpAdminQuizThumbnail(token2, quizId, imgUrl);
    expect(sessionResult.jsonBody.error).toStrictEqual(expect.any(String));
    expect(sessionResult.statusCode).toBe(403);
  });

  test('Invalid token is provided', () => {
    const badToken = { sessionId: 'badToken' };
    const sessionResult = httpAdminQuizThumbnail(badToken, quizId, imgUrl);
    expect(sessionResult.jsonBody.error).toStrictEqual(expect.any(String));
    expect(sessionResult.statusCode).toBe(401);
  });

  test('Empty token is provided', () => {
    const badToken = { sessionId: '' };
    const sessionResult = httpAdminQuizThumbnail(badToken, quizId, imgUrl);
    expect(sessionResult.jsonBody.error).toStrictEqual(expect.any(String));
    expect(sessionResult.statusCode).toBe(401);
  });
});

describe('QuizThumbnail 400', () => {
  let token: Token;
  let quizId: number;
  beforeEach(() => {
    httpClear();
    token = JSON.parse(httpAdminAuthRegister('vlad@unsw.edu.au', 'testpassword1', 'vlad', 'klymenko').jsonBody.token as string);
    quizId = httpAdminQuizCreateV2(token, 'My Quiz', 'Quiz Description').jsonBody.quizId as number;
  });

  test('imgUrl has bad file name extension', () => {
    const badImgUrl = 'https://www.kernel.org/theme/images/logos/tux.gif';
    const result = httpAdminQuizThumbnail(token, quizId, badImgUrl);
    expect(result.statusCode).toBe(400);
    expect(result.jsonBody.error).toStrictEqual(expect.any(String));
  });

  test('imgUrl is not HTTP URL', () => {
    const badImgUrl = 'ftp://kernel.org/tux.png';
    const result = httpAdminQuizThumbnail(token, quizId, badImgUrl);
    expect(result.statusCode).toBe(400);
    expect(result.jsonBody.error).toStrictEqual(expect.any(String));
  });
});
