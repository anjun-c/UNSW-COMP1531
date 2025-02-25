import { adminUserPasswordUpdate } from '../features/adminUserPasswordUpdate';
import { adminAuthRegister } from '../features/adminAuthRegister';
import { adminAuthLogin } from '../features/adminAuthLogin';
import { clear } from '../features/clear';

describe('adminUserPasswordUpdate unsuccessful password update tests', () => {
  test('Invalid User ID', () => {
    clear();
    adminAuthRegister('JonDoe@gmail.com', 'oldPassword1', 'John', 'Doe');
    const badToken = { sessionId: '0' };
    // const passwordUpdate = adminUserPasswordUpdate(badToken, 'oldPassword1', 'newPassword1');
    // expect(passwordUpdate).toStrictEqual({ error: expect.any(String) });
    expect(() => adminUserPasswordUpdate(badToken, 'oldPassword1', 'newPassword1')).toThrow(Error);
  });

  test('Old does not match New', () => {
    clear();
    const authUserId1 = adminAuthRegister('JonDoe@gmail.com', 'oldPassword1', 'John', 'Doe');
    // const passwordUpdate = adminUserPasswordUpdate(authUserId1, 'BadPassword1', 'newPassword1');
    // expect(passwordUpdate).toStrictEqual({ error: 'Old Password is not corect' });
    expect(() => adminUserPasswordUpdate(authUserId1, 'BadPassword1', 'newPassword1')).toThrow(Error);
  });

  test('New Password has already been used', () => {
    clear();
    const authUserId1 = adminAuthRegister('JonDoe@gmail.com', 'oldPassword1', 'John', 'Doe');
    adminUserPasswordUpdate(authUserId1, 'oldPassword1', 'newPassword1');
    // const passwordUpdate2 = adminUserPasswordUpdate(authUserId1, 'newPassword1', 'oldPassword1');
    // expect(passwordUpdate2).toStrictEqual({ error: 'Password Previously Used' });
    expect(() => adminUserPasswordUpdate(authUserId1, 'newPassword1', 'oldPassword1')).toThrow(Error);
  });

  test('New Password is the same as the old password', () => {
    clear();
    const authUserId1 = adminAuthRegister('JonDoe@gmail.com', 'oldPassword1', 'John', 'Doe');
    // const passwordUpdate = adminUserPasswordUpdate(authUserId1, 'oldPassword1', 'oldPassword1');
    // expect(passwordUpdate).toStrictEqual({ error: 'Password Previously Used' });
    expect(() => adminUserPasswordUpdate(authUserId1, 'oldPassword1', 'oldPassword1')).toThrow(Error);
  });

  test('New Password is less than 8 characters', () => {
    clear();
    const authUserId1 = adminAuthRegister('JonDoe@gmail.com', 'oldPassword1', 'John', 'Doe');
    // const passwordUpdate = adminUserPasswordUpdate(authUserId1, 'oldPassword1', 'new');
    // expect(passwordUpdate).toStrictEqual({ error: 'Invalid Password Length' });
    expect(() => adminUserPasswordUpdate(authUserId1, 'oldPassword1', 'new')).toThrow(Error);
  });

  test('NewPassword does NOT contain a number and letter', () => {
    clear();
    const authUserId1 = adminAuthRegister('JonDoe@gmail.com', 'oldPassword1', 'John', 'Doe');
    // let passwordUpdate = adminUserPasswordUpdate(authUserId1, 'oldPassword1', 'newPassword');
    // expect(passwordUpdate).toStrictEqual({ error: 'Invalid Password Characters' });
    expect(() => adminUserPasswordUpdate(authUserId1, 'oldPassword1', 'newPassword')).toThrow(Error);
    // passwordUpdate = adminUserPasswordUpdate(authUserId1, 'oldPassword1', '1234567890');
    // expect(passwordUpdate).toStrictEqual({ error: 'Invalid Password Characters' });
    expect(() => adminUserPasswordUpdate(authUserId1, 'oldPassword1', '1234567890')).toThrow(Error);
  });
});

describe('adminUserPasswordUpdate successful password update tests', () => {
  test('Successful password update', () => {
    clear();
    const authUserId1 = adminAuthRegister('JonDoe@gmail.com', 'oldPassword1', 'John', 'Doe');
    const passwordUpdate = adminUserPasswordUpdate(authUserId1, 'oldPassword1', 'newPassword1');
    expect(passwordUpdate).toStrictEqual({ });
    const loginResult = adminAuthLogin('JonDoe@gmail.com', 'newPassword1');
    // console.log('Login result' + loginResult);
    expect(loginResult).toHaveProperty('sessionId');
  });
});
