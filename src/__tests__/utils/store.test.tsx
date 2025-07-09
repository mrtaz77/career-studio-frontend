import store from '../../utils/store';
import { addUser, removeUser } from '../../utils/authSlice';

describe('Redux Store', () => {
  test('store should be defined', () => {
    expect(store).toBeDefined();
    expect(typeof store.dispatch).toBe('function');
    expect(typeof store.getState).toBe('function');
    expect(typeof store.subscribe).toBe('function');
  });

  test('store should have initial state', () => {
    const initialState = store.getState();

    expect(initialState).toBeDefined();
    expect(initialState.authenticate).toBeDefined();
  });

  test('store should handle addUser action', () => {
    const userData = {
      uid: 'test-uid',
      email: 'test@example.com',
      name: 'Test User',
      photoURL: 'https://example.com/photo.jpg',
    };

    store.dispatch(addUser(userData));
    const state = store.getState();

    expect(state.authenticate).toEqual(userData);
  });

  test('store should handle removeUser action', () => {
    // First add a user
    const userData = {
      uid: 'test-uid',
      email: 'test@example.com',
      name: 'Test User',
    };

    store.dispatch(addUser(userData));
    let state = store.getState();
    expect(state.authenticate).toEqual(userData);

    // Then remove the user
    store.dispatch(removeUser());
    state = store.getState();
    expect(state.authenticate).toEqual({
      uid: null,
      email: null,
      name: null,
      photoURL: null,
    });
  });

  test('store should handle multiple dispatches', () => {
    const userData1 = {
      uid: 'test-uid-1',
      email: 'test1@example.com',
      name: 'Test User 1',
    };

    const userData2 = {
      uid: 'test-uid-2',
      email: 'test2@example.com',
      name: 'Test User 2',
      photoURL: 'https://example.com/photo2.jpg',
    };

    // Add first user
    store.dispatch(addUser(userData1));
    let state = store.getState();
    expect(state.authenticate).toEqual(userData1);

    // Add second user (should overwrite)
    store.dispatch(addUser(userData2));
    state = store.getState();
    expect(state.authenticate).toEqual(userData2);
  });

  test('store should allow subscription to state changes', () => {
    const mockListener = jest.fn();
    const unsubscribe = store.subscribe(mockListener);

    expect(typeof unsubscribe).toBe('function');

    // Dispatch an action to trigger the listener
    store.dispatch(addUser({ uid: 'test' }));

    expect(mockListener).toHaveBeenCalled();

    // Clean up
    unsubscribe();
  });

  test('store should maintain state consistency', () => {
    // Clear state
    store.dispatch(removeUser());

    const userData = {
      uid: 'consistency-test',
      email: 'consistency@example.com',
    };

    store.dispatch(addUser(userData));
    const state1 = store.getState();
    const state2 = store.getState();

    expect(state1).toEqual(state2);
    expect(state1.authenticate).toEqual(userData);
  });
});
