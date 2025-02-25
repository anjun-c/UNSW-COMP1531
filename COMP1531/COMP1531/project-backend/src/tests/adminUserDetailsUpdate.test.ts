import { adminUserDetails } from '../features/adminUserDetails';
import { adminAuthRegister } from '../features/adminAuthRegister';
import { adminUserDetailsUpdate } from '../features/adminUserDetailsUpdate';
import { clear } from '../features/clear';
import { Token } from '../dataStore';

beforeEach(() => {
  clear();
});

describe('adminUserDetailsUpdate tests', () => {
  test('Successfully updates user details', () => {
    const token = adminAuthRegister('validemail@gmail.com', '123abc!@#', 'Jake', 'Renzella');
    const updateResult = adminUserDetailsUpdate(token, 'newemail@gmail.com', 'John', 'Doe');
    expect(updateResult).toStrictEqual({});

    const userDetails = adminUserDetails(token);
    expect(userDetails).toStrictEqual({
      user: {
        userId: expect.any(Number),
        name: 'John Doe',
        email: 'newemail@gmail.com',
        numSuccessfulLogins: 1,
        numFailedPasswordsSinceLastLogin: 0,
      }
    });
  });

  test('Returns error for invalid authUserId', () => {
    const badToken: Token = { sessionId: '999' };
    // const updateResult = adminUserDetailsUpdate(badToken, 'newemail@gmail.com', 'John', 'Doe');
    // expect(updateResult).toStrictEqual({ error: expect.any(String) });
    expect(() => adminUserDetailsUpdate(badToken, 'newemail@gmail.com', 'John', 'Doe')).toThrow(Error);
  });

  test('Returns error for invalid email', () => {
    const token = adminAuthRegister('validemail@gmail.com', '123abc!@#', 'Jake', 'Renzella');
    expect(() => adminUserDetailsUpdate(token, 'invalidemail', 'John', 'Doe')).toThrow(Error);
  });

  test('Returns error for nameFirst with invalid characters', () => {
    const token = adminAuthRegister('validemail@gmail.com', '123abc!@#', 'Jake', 'Renzella');
    expect(() => adminUserDetailsUpdate(token, 'newemail@gmail.com', 'John123', 'Doe')).toThrow(Error);
  });

  test('Returns error for nameLast with invalid characters', () => {
    const token = adminAuthRegister('validemail@gmail.com', '123abc!@#', 'Jake', 'Renzella');
    expect(() => adminUserDetailsUpdate(token, 'newemail@gmail.com', 'John', 'Doe@123')).toThrow(Error);
  });

  test('Returns error for nameFirst being too short', () => {
    const token = adminAuthRegister('validemail@gmail.com', '123abc!@#', 'Jake', 'Renzella');
    expect(() => adminUserDetailsUpdate(token, 'newemail@gmail.com', 'J', 'Doe')).toThrow(Error);
  });

  test('Returns error for nameFirst being too long', () => {
    const token = adminAuthRegister('validemail@gmail.com', '123abc!@#', 'Jake', 'Renzella');
    expect(() => adminUserDetailsUpdate(token, 'newemail@gmail.com', 'JohnathanJohnathanJohnathan', 'Doe')).toThrow(Error);
  });

  test('Returns error for nameLast being too short', () => {
    const token = adminAuthRegister('validemail@gmail.com', '123abc!@#', 'Jake', 'Renzella');
    expect(() => adminUserDetailsUpdate(token, 'newemail@gmail.com', 'John', 'D')).toThrow(Error);
  });

  test('Returns error for nameLast being too long', () => {
    const token = adminAuthRegister('validemail@gmail.com', '123abc!@#', 'Jake', 'Renzella');
    expect(() => adminUserDetailsUpdate(token, 'newemail@gmail.com', 'John', 'DoeDoeDoeDoeDoeDoeDoeDoeDoeDoe')).toThrow(Error);
  });
});
