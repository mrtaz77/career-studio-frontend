import { createSlice } from '@reduxjs/toolkit';

const authSlice = createSlice({
  name: 'authenticate',
  initialState: {
    uid: null,
    email: null,
    name: null,
    photoURL: null,
  },

  reducers: {
    addUser: (state, action) => {
      return action.payload;
    },
    removeUser: () => {
      return {
        uid: null,
        email: null,
        name: null,
        photoURL: null,
      };
    },
  },
});

export const { addUser, removeUser } = authSlice.actions;
export default authSlice.reducer;
