import { adminAuthRegister } from '../features/adminAuthRegister';
import { clear } from '../features/clear';

describe('adminAuthRegister errors due to email', () => {
  beforeEach(() => {
    clear();
  });

  test('Check for error due to duplicate email', () => {
    adminAuthRegister('oliver@unsw.edu.au', 'testpassword1', 'Oliver', 'Bowling');
    // const authUserId2 = adminAuthRegister('oliver@unsw.edu.au', 'testpassword1', 'Oliver', 'Bowling');
    // expect(authUserId2).toStrictEqual({ error: 'Email already in use' });
    expect(() => adminAuthRegister('oliver@unsw.edu.au', 'testpassword1', 'Oliver', 'Bowling')).toThrow(Error);
  });

  test('Check for error due to invalid email', () => {
    // const authUserId1 = adminAuthRegister('oliver', 'testpassword1', 'Oliver', 'Bowling');
    // expect(authUserId1).toStrictEqual({ error: 'Not a valid email' });
    // const authUserId2 = adminAuthRegister('', 'testpassword1', 'Oliver', 'Bowling');
    // expect(authUserId2).toStrictEqual({ error: 'Not a valid email' });
    // const authUserId3 = adminAuthRegister('12345', 'testpassword1', 'Oliver', 'Bowling');
    // expect(authUserId3).toStrictEqual({ error: 'Not a valid email' });
    // const authUserId4 = adminAuthRegister('@unsw.edu.au', 'testpassword1', 'Oliver', 'Bowling');
    // expect(authUserId4).toStrictEqual({ error: 'Not a valid email' });
    // const authUserId5 = adminAuthRegister('oliver@.com', 'testpassword1', 'Oliver', 'Bowling');
    // expect(authUserId5).toStrictEqual({ error: 'Not a valid email' });
    expect(() => adminAuthRegister('oliver', 'testpassword1', 'Oliver', 'Bowling')).toThrow(Error);
    expect(() => adminAuthRegister('', 'testpassword1', 'Oliver', 'Bowling')).toThrow(Error);
    expect(() => adminAuthRegister('12345', 'testpassword1', 'Oliver', 'Bowling')).toThrow(Error);
    expect(() => adminAuthRegister('@unsw.edu.au', 'testpassword1', 'Oliver', 'Bowling')).toThrow(Error);
    expect(() => adminAuthRegister('oliver@.com', 'testpassword1', 'Oliver', 'Bowling')).toThrow(Error);
  });
});

describe('adminAuthRegister errors due to name', () => {
  beforeEach(() => {
    clear();
  });

  test('Check for error due to invalid characters in first name', () => {
    // clear();
    // const authUserId1 = adminAuthRegister('oliver@unsw.edu.au', 'testpassword1', 'Oliver1', 'Bowling');
    // expect(authUserId1).toStrictEqual({ error: 'Only include letters, spaces, hyphens, and apostrophes in first name' });
    // const authUserId2 = adminAuthRegister('oliver@unsw.edu.au', 'testpassword1', 'Oli~ver', 'Bowling');
    // expect(authUserId2).toStrictEqual({ error: 'Only include letters, spaces, hyphens, and apostrophes in first name' });
    // const authUserId3 = adminAuthRegister('oliver@unsw.edu.au', 'testpassword1', 'Oli/ver', 'Bowling');
    // expect(authUserId3).toStrictEqual({ error: 'Only include letters, spaces, hyphens, and apostrophes in first name' });
    // const authUserId4 = adminAuthRegister('oliver@unsw.edu.au', 'testpassword1', '12345', 'Bowling');
    // expect(authUserId4).toStrictEqual({ error: 'Only include letters, spaces, hyphens, and apostrophes in first name' });
    expect(() => adminAuthRegister('oliver@unsw.edu.au', 'testpassword1', 'Oliver1', 'Bowling')).toThrow(Error);
    expect(() => adminAuthRegister('oliver@unsw.edu.au', 'testpassword1', 'Oli~ver', 'Bowling')).toThrow(Error);
    expect(() => adminAuthRegister('oliver@unsw.edu.au', 'testpassword1', 'Oli/ver', 'Bowling')).toThrow(Error);
    expect(() => adminAuthRegister('oliver@unsw.edu.au', 'testpassword1', '12345', 'Bowling')).toThrow(Error);
  });

  test('Check for error due to invalid length of first name', () => {
    // clear();
    // const authUserId1 = adminAuthRegister('oliver@unsw.edu.au', 'testpassword1', '', 'Bowling');
    // expect(authUserId1).toStrictEqual({ error: 'First name must be between 2 and 20 characters' });
    // const authUserId2 = adminAuthRegister('oliver@unsw.edu.au', 'testpassword1', 'O', 'Bowling');
    // expect(authUserId2).toStrictEqual({ error: 'First name must be between 2 and 20 characters' });
    // const authUserId3 = adminAuthRegister('oliver@unsw.edu.au', 'testpassword1', 'oliverOliverOliverOli', 'Bowling');
    // expect(authUserId3).toStrictEqual({ error: 'First name must be between 2 and 20 characters' });
    expect(() => adminAuthRegister('oliver@unsw.edu.au', 'testpassword1', '', 'Bowling')).toThrow(Error);
    expect(() => adminAuthRegister('oliver@unsw.edu.au', 'testpassword1', 'O', 'Bowling')).toThrow(Error);
    expect(() => adminAuthRegister('oliver@unsw.edu.au', 'testpassword1', 'oliverOliverOliverOli', 'Bowling')).toThrow(Error);
  });

  test('Check for error due to invalid characters in last name', () => {
    // clear();
    // const authUserId1 = adminAuthRegister('oliver@unsw.edu.au', 'testpassword1', 'Oliver', 'Bowling1');
    // expect(authUserId1).toStrictEqual({ error: 'Only include letters, spaces, hyphens, and apostrophes in last name' });
    // const authUserId2 = adminAuthRegister('oliver@unsw.edu.au', 'testpassword1', 'Oliver', 'Bow~ling');
    // expect(authUserId2).toStrictEqual({ error: 'Only include letters, spaces, hyphens, and apostrophes in last name' });
    // const authUserId3 = adminAuthRegister('oliver@unsw.edu.au', 'testpassword1', 'Oliver', 'Bow/ling');
    // expect(authUserId3).toStrictEqual({ error: 'Only include letters, spaces, hyphens, and apostrophes in last name' });
    // const authUserId4 = adminAuthRegister('oliver@unsw.edu.au', 'testpassword1', 'Oliver', '12345');
    // expect(authUserId4).toStrictEqual({ error: 'Only include letters, spaces, hyphens, and apostrophes in last name' });
    expect(() => adminAuthRegister('oliver@unsw.edu.au', 'testpassword1', 'Oliver', 'Bowling1')).toThrow(Error);
    expect(() => adminAuthRegister('oliver@unsw.edu.au', 'testpassword1', 'Oliver', 'Bow~ling')).toThrow(Error);
    expect(() => adminAuthRegister('oliver@unsw.edu.au', 'testpassword1', 'Oliver', 'Bow/ling')).toThrow(Error);
    expect(() => adminAuthRegister('oliver@unsw.edu.au', 'testpassword1', 'Oliver', '12345')).toThrow(Error);
  });

  test('Check for error due to invalid length of last name', () => {
    // clear();
    // const authUserId1 = adminAuthRegister('oliver@unsw.edu.au', 'testpassword1', 'Oliver', '');
    // expect(authUserId1).toStrictEqual({ error: 'Last name must be between 2 and 20 characters' });
    // const authUserId2 = adminAuthRegister('oliver@unsw.edu.au', 'testpassword1', 'Oliver', 'B');
    // expect(authUserId2).toStrictEqual({ error: 'Last name must be between 2 and 20 characters' });
    // const authUserId3 = adminAuthRegister('oliver@unsw.edu.au', 'testpassword1', 'Oliver', 'BowlingBowlingBowling');
    // expect(authUserId3).toStrictEqual({ error: 'Last name must be between 2 and 20 characters' });
    expect(() => adminAuthRegister('oliver@unsw.edu.au', 'testpassword1', 'Oliver', '')).toThrow(Error);
    expect(() => adminAuthRegister('oliver@unsw.edu.au', 'testpassword1', 'Oliver', 'B')).toThrow(Error);
    expect(() => adminAuthRegister('oliver@unsw.edu.au', 'testpassword1', 'Oliver', 'BowlingBowlingBowling')).toThrow(Error);
  });
});

describe('adminAuthRegister errors due to password', () => {
  beforeEach(() => {
    clear();
  });

  test('Check for error due to short password', () => {
    // clear();
    // const authUserId1 = adminAuthRegister('oliver@unsw.edu.au', '', 'Oliver', 'Bowling');
    // expect(authUserId1).toStrictEqual({ error: 'Password is too short' });
    // const authUserId2 = adminAuthRegister('oliver@unsw.edu.au', '1', 'Oliver', 'Bowling');
    // expect(authUserId2).toStrictEqual({ error: 'Password is too short' });
    // const authUserId3 = adminAuthRegister('oliver@unsw.edu.au', '12', 'Oliver', 'Bowling');
    // expect(authUserId3).toStrictEqual({ error: 'Password is too short' });
    // const authUserId4 = adminAuthRegister('oliver@unsw.edu.au', '123', 'Oliver', 'Bowling');
    // expect(authUserId4).toStrictEqual({ error: 'Password is too short' });
    // const authUserId5 = adminAuthRegister('oliver@unsw.edu.au', '1234', 'Oliver', 'Bowling');
    // expect(authUserId5).toStrictEqual({ error: 'Password is too short' });
    // const authUserId6 = adminAuthRegister('oliver@unsw.edu.au', '12345', 'Oliver', 'Bowling');
    // expect(authUserId6).toStrictEqual({ error: 'Password is too short' });
    // const authUserId7 = adminAuthRegister('oliver@unsw.edu.au', '123456', 'Oliver', 'Bowling');
    // expect(authUserId7).toStrictEqual({ error: 'Password is too short' });
    // const authUserId8 = adminAuthRegister('oliver@unsw.edu.au', '1234567', 'Oliver', 'Bowling');
    // expect(authUserId8).toStrictEqual({ error: 'Password is too short' });
    expect(() => adminAuthRegister('oliver@unsw.edu.au', '', 'Oliver', 'Bowling')).toThrow(Error);
    expect(() => adminAuthRegister('oliver@unsw.edu.au', '1', 'Oliver', 'Bowling')).toThrow(Error);
    expect(() => adminAuthRegister('oliver@unsw.edu.au', '12', 'Oliver', 'Bowling')).toThrow(Error);
    expect(() => adminAuthRegister('oliver@unsw.edu.au', '123', 'Oliver', 'Bowling')).toThrow(Error);
    expect(() => adminAuthRegister('oliver@unsw.edu.au', '1234', 'Oliver', 'Bowling')).toThrow(Error);
    expect(() => adminAuthRegister('oliver@unsw.edu.au', '12345', 'Oliver', 'Bowling')).toThrow(Error);
    expect(() => adminAuthRegister('oliver@unsw.edu.au', '123456', 'Oliver', 'Bowling')).toThrow(Error);
    expect(() => adminAuthRegister('oliver@unsw.edu.au', '1234567', 'Oliver', 'Bowling')).toThrow(Error);
  });

  test('Check for error due to password not containing letters and numbers', () => {
    // const authUserId1 = adminAuthRegister('oliver@unsw.edu.au', 'testpassword', 'Oliver', 'Bowling');
    // expect(authUserId1).toStrictEqual({ error: 'Password must contain at least one number and one letter' });
    // const authUserId2 = adminAuthRegister('oliver@unsw.edu.au', '12345678', 'Oliver', 'Bowling');
    // expect(authUserId2).toStrictEqual({ error: 'Password must contain at least one number and one letter' });
    // const authUserId3 = adminAuthRegister('oliver@unsw.edu.au', '~~~~~~~~', 'Oliver', 'Bowling');
    // expect(authUserId3).toStrictEqual({ error: 'Password must contain at least one number and one letter' });
    expect(() => adminAuthRegister('oliver@unsw.edu.au', 'testpassword', 'Oliver', 'Bowling')).toThrow(Error);
    expect(() => adminAuthRegister('oliver@unsw.edu.au', '12345678', 'Oliver', 'Bowling')).toThrow(Error);
    expect(() => adminAuthRegister('oliver@unsw.edu.au', '~~~~~~~~', 'Oliver', 'Bowling')).toThrow(Error);
  });
});

describe('adminAuthRegister successful runs', () => {
  beforeEach(() => {
    clear();
  });

  test('Check that valid inputs return an authUserId', () => {
    const testResult = adminAuthRegister('oliver@unsw.edu.au', 'testpassword1', 'Oliver', 'Bowling');
    expect(testResult).toHaveProperty('sessionId');
    expect(typeof testResult.sessionId).toBe('string');
    // expect(testResult.token.sessionId).toBe(1); Deprecated since tokenisation
  });

  test('Check registering multiple users', () => {
    const testResult = adminAuthRegister('oliver@unsw.edu.au', 'testpassword1', 'Oliver', 'Bowling');
    expect(testResult).toHaveProperty('sessionId');
    expect(typeof testResult.sessionId).toBe('string');
    // expect(testResult.authUserId).toBe(1); Deprecated since tokenisation

    const testResult2 = adminAuthRegister('oliverTest2@unsw.edu.au', 'testpassword2', 'Carl', 'Test');
    expect(testResult2).toHaveProperty('sessionId');
    expect(typeof testResult2.sessionId).toBe('string');
    // expect(testResult2.authUserId).toBe(2); Deorecated since tokenisation
  });
});
