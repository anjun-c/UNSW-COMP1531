import { adminAuthLogin } from '../features/adminAuthLogin';
import { adminAuthRegister } from '../features/adminAuthRegister';
import { adminUserDetails } from '../features/adminUserDetails';
import { clear } from '../features/clear';

describe('adminAuthLogin unsuccessful login tests', () => {
  beforeEach(() => {
    clear();
  });

  test('Check for error due to email not existing', () => {
    clear();
    adminAuthRegister('oliver@unsw.edu.au', 'testpassword1', 'Oliver', 'Bowling');
    expect(() => adminAuthLogin('testEmail@unsw.edu.au', 'testpassword1')).toThrow();
  });

  test('Check for error due to incorrect password', () => {
    clear();
    adminAuthRegister('oliver@unsw.edu.au', 'testpassword1', 'Oliver', 'Bowling');
    expect(() => adminAuthLogin('oliver@unsw.edu.au', 'incorrectpassword')).toThrow();
  });
});

describe('adminAuthLogin successful login tests', () => {
  beforeEach(() => {
    clear();
  });

  test('Check for valid login', () => {
    clear();
    adminAuthRegister('oliver@unsw.edu.au', 'testpassword1', 'Oliver', 'Bowling');
    const testResult = adminAuthLogin('oliver@unsw.edu.au', 'testpassword1');
    expect(testResult).toHaveProperty('sessionId');
    expect(typeof testResult.sessionId).toBe('string');
  });

  test('Check for valid login with multiple users', () => {
    clear();
    adminAuthRegister('oliver@unsw.edu.au', 'testpassword1', 'Oliver', 'Bowling');
    adminAuthRegister('oliver2@unsw.edu.au', 'testpassword2', 'Oliver', 'Bowling');
    const testResult = adminAuthLogin('oliver@unsw.edu.au', 'testpassword1');
    expect(testResult).toHaveProperty('sessionId');
    expect(typeof testResult.sessionId).toBe('string');

    clear();
    adminAuthRegister('oliver@unsw.edu.au', 'testpassword1', 'Oliver', 'Bowling');
    adminAuthRegister('oliver2@unsw.edu.au', 'testpassword2', 'Oliver', 'Bowling');
    const testResult2 = adminAuthLogin('oliver2@unsw.edu.au', 'testpassword2');
    expect(testResult2).toHaveProperty('sessionId');
    expect(typeof testResult2.sessionId).toBe('string');
  });
});

describe('adminAuthLogin successful login tests', () => {
  beforeEach(() => {
    clear();
  });

  test('Check number of successful logins', () => {
    clear();
    const authUserId1 = adminAuthRegister('oliver@unsw.edu.au', 'testpassword1', 'Oliver', 'Bowling');
    expect(adminUserDetails(authUserId1).user.numSuccessfulLogins).toBe(1);
    const testLogin1 = adminAuthLogin('oliver@unsw.edu.au', 'testpassword1');
    expect(adminUserDetails(testLogin1).user.numSuccessfulLogins).toBe(2);
    const testLogin2 = adminAuthLogin('oliver@unsw.edu.au', 'testpassword1');
    expect(adminUserDetails(testLogin2).user.numSuccessfulLogins).toBe(3);
  });

  test('Check number of failed passwords since last login', () => {
    const authUserId1 = adminAuthRegister('oliver@unsw.edu.au', 'testpassword1', 'Oliver', 'Bowling');
    expect(() => adminAuthLogin('oliver@unsw.edu.au', 'incorrectTestPW1')).toThrow(Error);
    expect(() => adminAuthLogin('oliver@unsw.edu.au', 'incorrectTestPW1')).toThrow(Error);
    expect(adminUserDetails(authUserId1).user.numFailedPasswordsSinceLastLogin).toBe(2);
    const testLogin2 = adminAuthLogin('oliver@unsw.edu.au', 'testpassword1');
    expect(adminUserDetails(testLogin2).user.numFailedPasswordsSinceLastLogin).toBe(0);
  });
});
