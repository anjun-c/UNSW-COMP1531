import { httpAdminAuthRegister, httpClear, httpAdminQuizCreate } from './testHelper';

test('adminAuthRegister successful registration', () => {
  httpClear();
  const registerResult = httpAdminAuthRegister('oliver@unsw.edu.au', 'testpassword1', 'oliver', 'bowling');
  const token = JSON.parse(registerResult.jsonBody.token as string);
  const quizResponse = httpAdminQuizCreate(token, 'Quiz 1', 'Quiz Description');
  const quizId1 = quizResponse.jsonBody.quizId;
  expect(quizId1).toStrictEqual(expect.any(Number));
});
