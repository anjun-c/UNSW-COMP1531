import { clear } from '../features/clear';
import { adminAuthRegister } from '../features/adminAuthRegister';
import { adminUserDetails } from '../features/adminUserDetails';

describe('clear', () => {
  test('check successful deletion', () => {
    clear();
    const token = adminAuthRegister('testEmail1@gmail.com', 'testPwd123', 'testNameFirst', 'testNameLast');
    expect(adminUserDetails(token)).toStrictEqual({
      user: {
        userId: expect.any(Number),
        name: 'testNameFirst testNameLast',
        email: 'testEmail1@gmail.com',
        numSuccessfulLogins: 1,
        numFailedPasswordsSinceLastLogin: 0,
      }
    });
    clear();
    // expect(adminUserDetails(token)).toStrictEqual({ error: expect.any(String) });
    expect(() => adminUserDetails(token)).toThrow(Error);
  });
});
