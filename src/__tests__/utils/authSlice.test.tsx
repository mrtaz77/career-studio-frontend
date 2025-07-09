import { addUser, removeUser } from '../../utils/authSlice';

describe('authSlice', () => {
  test('addUser should return action with payload', () => {
    const userData = {
      uid: 'test-uid',
      email: 'test@example.com',
      name: 'Test User',
      photoURL: 'https://example.com/photo.jpg',
    };

    const action = addUser(userData);

    expect(action.type).toBe('authenticate/addUser');
    expect(action.payload).toEqual(userData);
  });

  test('removeUser should return action without payload', () => {
    const action = removeUser();

    expect(action.type).toBe('authenticate/removeUser');
    expect(action.payload).toBeUndefined();
  });

  test('addUser handles partial user data', () => {
    const userData = {
      uid: 'test-uid',
      email: 'test@example.com',
    };

    const action = addUser(userData);

    expect(action.type).toBe('authenticate/addUser');
    expect(action.payload).toEqual(userData);
  });

  test('addUser handles empty object', () => {
    const userData = {};

    const action = addUser(userData);

    expect(action.type).toBe('authenticate/addUser');
    expect(action.payload).toEqual({});
  });

  test('action creators are functions', () => {
    expect(typeof addUser).toBe('function');
    expect(typeof removeUser).toBe('function');
  });
});
