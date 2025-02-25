/**
 * @see password
 * @module password.test
 *
 * TIP: you are highly encouraged to look into test.each, test.only, test.skip, test.todo
 * from the jest documentations: https://jestjs.io/docs/api
 */

import { checkPassword } from './password';



// You can remove or replace this with your own tests.
// TIP: you may want to explore "test.each"
describe('poor passwords', () => {
  test('aaaaa', () => {
    expect(checkPassword('aaaaa')).toEqual('Poor Password');
  });

  test('testing', () => {
    expect(checkPassword('testing')).toEqual('Poor Password');
  });
});
describe('horrible passwords', () => {
  test('123456', () => {
    expect(checkPassword('123456')).toEqual('Horrible Password');
  });

  test('123456789', () => {
    expect(checkPassword('123456789')).toEqual('Horrible Password');
  });

  test('12345', () => {
    expect(checkPassword('12345')).toEqual('Horrible Password');
  });

  test('qwerty', () => {
    expect(checkPassword('qwerty')).toEqual('Horrible Password');
  });

  test('password', () => {
    expect(checkPassword('password')).toEqual('Horrible Password');
  });
});

describe('strong passwords', () => {
  test('Random123!', () => {
    expect(checkPassword('Randommmm123!')).toEqual('Strong Password');
  });
  test('MySecurePassword123', () => {
    expect(checkPassword('MySecurePassword123')).toEqual('Strong Password');
  });
  test('W@llah1br0ther', () => {
    expect(checkPassword('W@llah1br0ther')).toEqual('Strong Password');
  });
});

describe('moderate passwords', () => {
  test('abc123', () => {
    expect(checkPassword('abcdefg1')).toEqual('Moderate Password');
  });
  test('Password123', () => {
    expect(checkPassword('PASSs123')).toEqual('Moderate Password');
  });
  test('Test1234', () => {
    expect(checkPassword('testttttttttt1')).toEqual('Moderate Password');
  });
});


