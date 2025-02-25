import { httpAdminUserDetails, httpAdminAuthLogout, httpAdminAuthRegister, httpAdminAuthLogin, httpClear } from './testHelper';
import { Token } from '../dataStore';

describe('Testing POST - adminAuthLogout', () => {
  beforeEach(() => {
    httpClear();
  });

  test('Correct status code for valid logout', () => {
    httpClear();

    const registerResult = httpAdminAuthRegister('oliver@unsw.edu.au', 'testpassword1', 'Oliver', 'Bowling');
    expect(registerResult.statusCode).toBe(200);
    const token: Token = JSON.parse(registerResult.jsonBody.token as string);
    expect(token).toBeDefined();

    // Making sure the user does exist after register
    expect(httpAdminUserDetails(token).jsonBody.error).toBeUndefined();

    const logoutResult = httpAdminAuthLogout(token);
    expect(logoutResult.statusCode).toBe(200);
    expect(logoutResult.jsonBody).toEqual({});

    // Making sure the token no longer works as a valid user
    expect(httpAdminUserDetails(token).jsonBody.error).toBeDefined();
  });

  test('Correct status code for invalid token logout with no registered users', () => {
    const invalidToken: Token = { sessionId: 'invalidToken' };

    expect(httpAdminUserDetails(invalidToken).jsonBody.error).toBeDefined();

    const logoutResult = httpAdminAuthLogout(invalidToken);
    expect(logoutResult.statusCode).toBe(401);
    expect(logoutResult.jsonBody.error).toEqual(expect.any(String));

    expect(httpAdminUserDetails(invalidToken).jsonBody.error).toBeDefined();
  });

  test('Correct status code for invalid token logout with one registered user', () => {
    const registerResult = httpAdminAuthRegister('oliver@unsw.edu.au', 'testpassword1', 'Oliver', 'Bowling');
    const token = JSON.parse(registerResult.jsonBody.token as string);

    expect(httpAdminUserDetails(token).jsonBody.error).toBeUndefined();

    const invalidToken: Token = { sessionId: 'invalidToken' };

    const logoutResult = httpAdminAuthLogout(invalidToken);
    expect(logoutResult.statusCode).toBe(401);
    expect(logoutResult.jsonBody.error).toEqual(expect.any(String));

    // ensure original user was not affected by the logout
    expect(httpAdminUserDetails(token).jsonBody.error).toBeUndefined();
  });

  test('Logout with a token that was already logged out', () => {
    const registerResult = httpAdminAuthRegister('oliver@unsw.edu.au', 'testpassword1', 'Oliver', 'Bowling');
    expect(registerResult.statusCode).toBe(200);

    const token: Token = JSON.parse(registerResult.jsonBody.token as string);
    expect(token).toBeDefined();
    expect(httpAdminUserDetails(token).jsonBody.error).toBeUndefined();

    const logoutResult1 = httpAdminAuthLogout(token);
    expect(logoutResult1.statusCode).toBe(200);
    expect(logoutResult1.jsonBody).toEqual({});

    expect(httpAdminUserDetails(token).jsonBody.error).toBeDefined();

    const logoutResult2 = httpAdminAuthLogout(token);
    expect(logoutResult2.statusCode).toBe(401);
    expect(logoutResult2.jsonBody.error).toEqual(expect.any(String));

    expect(httpAdminUserDetails(token).jsonBody.error).toBeDefined();
  });

  test('Multiple users logout in a different order to register', () => {
    const registerResult1 = httpAdminAuthRegister('oliver1@unsw.edu.au', 'testpassword1', 'Oliver', 'Bowling');
    expect(registerResult1.statusCode).toBe(200);
    const token1: Token = JSON.parse(registerResult1.jsonBody.token as string);
    expect(token1).toBeDefined();
    expect(httpAdminUserDetails(token1).jsonBody.error).toBeUndefined();

    const registerResult2 = httpAdminAuthRegister('oliver2@unsw.edu.au', 'testpassword1', 'Oliver', 'Bowling');
    expect(registerResult2.statusCode).toBe(200);
    const token2: Token = JSON.parse(registerResult2.jsonBody.token as string);
    expect(token2).toBeDefined();
    expect(httpAdminUserDetails(token2).jsonBody.error).toBeUndefined();

    const logoutResult1 = httpAdminAuthLogout(token2);
    expect(logoutResult1.statusCode).toBe(200);
    expect(logoutResult1.jsonBody).toEqual({});
    expect(httpAdminUserDetails(token2).jsonBody.error).toBeDefined();

    const logoutResult2 = httpAdminAuthLogout(token1);
    expect(logoutResult2.statusCode).toBe(200);
    expect(logoutResult2.jsonBody).toEqual({});
    expect(httpAdminUserDetails(token1).jsonBody.error).toBeDefined();
  });

  test('Logout with an empty token and no registered users', () => {
    const logoutResult = httpAdminAuthLogout({ sessionId: '' });
    expect(logoutResult.statusCode).toBe(401);
    expect(logoutResult.jsonBody.error).toEqual(expect.any(String));
  });

  test('Logout with an empty token and one registered user', () => {
    const registerResult = httpAdminAuthRegister('oliver@unsw.edu.au', 'testpassword1', 'Oliver', 'Bowling');
    expect(registerResult.statusCode).toBe(200);
    const token: Token = JSON.parse(registerResult.jsonBody.token as string);
    expect(token).toBeDefined();
    expect(httpAdminUserDetails(token).jsonBody.error).toBeUndefined();

    const logoutResult = httpAdminAuthLogout({ sessionId: '' });
    expect(logoutResult.statusCode).toBe(401);
    expect(logoutResult.jsonBody.error).toEqual(expect.any(String));
  });

  test('Multiple registrations and logouts', () => {
    const registerResult1 = httpAdminAuthRegister('oliver1@unsw.edu.au', 'testpassword1', 'Oliver', 'Bowling');
    expect(registerResult1.statusCode).toBe(200);
    const token1: Token = JSON.parse(registerResult1.jsonBody.token as string);
    expect(token1).toBeDefined();
    expect(httpAdminUserDetails(token1).jsonBody.error).toBeUndefined();

    const logoutResult1 = httpAdminAuthLogout(token1);
    expect(logoutResult1.statusCode).toBe(200);
    expect(logoutResult1.jsonBody).toEqual({});
    expect(httpAdminUserDetails(token1).jsonBody.error).toBeDefined();

    const registerResult2 = httpAdminAuthRegister('oliver2@unsw.edu.au', 'testpassword1', 'Oliver', 'Bowling');
    expect(registerResult2.statusCode).toBe(200);
    const token2: Token = JSON.parse(registerResult2.jsonBody.token as string);
    expect(token2).toBeDefined();
    expect(httpAdminUserDetails(token2).jsonBody.error).toBeUndefined();

    const logoutResult2 = httpAdminAuthLogout(token2);
    expect(logoutResult2.statusCode).toBe(200);
    expect(logoutResult2.jsonBody).toEqual({});
    expect(httpAdminUserDetails(token2).jsonBody.error).toBeDefined();
  });

  test('Simultaneous logins and logouts', () => {
    const registerResult1 = httpAdminAuthRegister('user1@unsw.edu.au', 'password1', 'User', 'One');
    const registerResult2 = httpAdminAuthRegister('user2@unsw.edu.au', 'password2', 'User', 'Two');
    const registerResult3 = httpAdminAuthRegister('user3@unsw.edu.au', 'password3', 'User', 'Three');
    const registerResult4 = httpAdminAuthRegister('user4@unsw.edu.au', 'password4', 'User', 'Four');

    expect(registerResult1.statusCode).toBe(200);
    expect(registerResult2.statusCode).toBe(200);
    expect(registerResult3.statusCode).toBe(200);
    expect(registerResult4.statusCode).toBe(200);

    const token1: Token = JSON.parse(registerResult1.jsonBody.token as string);
    const token2: Token = JSON.parse(registerResult2.jsonBody.token as string);
    const token3: Token = JSON.parse(registerResult3.jsonBody.token as string);
    const token4: Token = JSON.parse(registerResult4.jsonBody.token as string);

    const logoutResult1 = httpAdminAuthLogout(token1);
    const logoutResult2 = httpAdminAuthLogout(token2);
    const logoutResult3 = httpAdminAuthLogout(token3);
    const logoutResult4 = httpAdminAuthLogout(token4);

    expect(logoutResult1.statusCode).toBe(200);
    expect(logoutResult1.jsonBody).toEqual({});
    expect(logoutResult2.statusCode).toBe(200);
    expect(logoutResult2.jsonBody).toEqual({});
    expect(logoutResult3.statusCode).toBe(200);
    expect(logoutResult3.jsonBody).toEqual({});
    expect(logoutResult4.statusCode).toBe(200);
    expect(logoutResult4.jsonBody).toEqual({});
  });

  test('Register, then logout, then login and logout again', () => {
    const registerResult = httpAdminAuthRegister('oliver@unsw.edu.au', 'testpassword1', 'Oliver', 'Bowling');
    expect(registerResult.statusCode).toBe(200);
    const registerToken: Token = JSON.parse(registerResult.jsonBody.token as string);
    expect(registerToken).toBeDefined();
    expect(httpAdminUserDetails(registerToken).jsonBody.error).toBeUndefined();

    const logoutResult1 = httpAdminAuthLogout(registerToken);
    expect(logoutResult1.statusCode).toBe(200);
    expect(logoutResult1.jsonBody).toEqual({});
    expect(httpAdminUserDetails(registerToken).jsonBody.error).toBeDefined();

    const loginResult = httpAdminAuthLogin('oliver@unsw.edu.au', 'testpassword1');

    expect(loginResult.statusCode).toBe(200);
    const loginToken: Token = JSON.parse(loginResult.jsonBody.token as string);
    expect(loginToken).toBeDefined();
    expect(httpAdminUserDetails(loginToken).jsonBody.error).toBeUndefined();

    const logoutResult2 = httpAdminAuthLogout(loginToken);
    expect(logoutResult2.statusCode).toBe(200);
    expect(logoutResult2.jsonBody).toEqual({});
    expect(httpAdminUserDetails(loginToken).jsonBody.error).toBeDefined();
  });
});
