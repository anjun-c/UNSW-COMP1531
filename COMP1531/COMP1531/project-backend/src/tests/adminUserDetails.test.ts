import { clear } from '../features/clear';
import { Token } from '../dataStore';
import { adminAuthLogin } from '../features/adminAuthLogin';
import { adminAuthRegister } from '../features/adminAuthRegister';
import { adminUserDetails } from '../features/adminUserDetails';

beforeEach(() => {
  clear();
});

describe('adminUserDetails tests', () => {
  test('Returns correct details for a registered user', () => {
    const token = adminAuthRegister('validemail@gmail.com', '123abc!@#', 'Makeen', 'Alaeddin');
    const userDetails = adminUserDetails(token);
    expect(userDetails).toStrictEqual({
      user: {
        userId: expect.any(Number),
        name: 'Makeen Alaeddin',
        email: 'validemail@gmail.com',
        numSuccessfulLogins: 1,
        numFailedPasswordsSinceLastLogin: 0,
      }
    });
  });
  test('Returns correct details for a registered user that has logged in multiple times, then entered incorrect password', () => {
    const token = adminAuthRegister('validemail@gmail.com', '123abc!@#', 'Makeen', 'Alaeddin');
    let i = 0;
    while (i < 4) {
      adminAuthLogin('validemail@gmail.com', '123abc!@#');
      i++;
    }
    expect(() => adminAuthLogin('validemail@gmail.com', 'wrongpassword')).toThrow(Error);
    const userDetails = adminUserDetails(token);
    expect(userDetails).toStrictEqual({
      user: {
        userId: expect.any(Number),
        name: 'Makeen Alaeddin',
        email: 'validemail@gmail.com',
        numSuccessfulLogins: 5,
        numFailedPasswordsSinceLastLogin: 1,
      }
    });
  });
  test('Returns an error for an invalid UserId - Average case', () => {
    const badToken: Token = { sessionId: 'badToken' };
    // const userDetails = adminUserDetails(badToken);
    // expect(userDetails).toStrictEqual({ error: expect.any(String) });
    expect(() => adminUserDetails(badToken)).toThrow(Error);
  });
  test('Returns an error for an invalid UserId - Edge case -1', () => {
    adminAuthRegister('validemail@gmail.com', '123abc!@#', 'Makeen', 'Alaeddin');
    const badToken: Token = { sessionId: '-1' };
    // const userDetails = adminUserDetails(badToken);
    // expect(userDetails).toStrictEqual({ error: expect.any(String) });
    expect(() => adminUserDetails(badToken)).toThrow(Error);
  });
  test('Returns an error for an invalid UserId - Edge Case 0', () => {
    adminAuthRegister('validemail@gmail.com', '123abc!@#', 'Makeen', 'Alaeddin');
    // const userDetails = adminUserDetails({ sessionId: '0' });
    // expect(userDetails).toStrictEqual({ error: expect.any(String) });
    expect(() => adminUserDetails({ sessionId: '0' })).toThrow(Error);
  });
});
