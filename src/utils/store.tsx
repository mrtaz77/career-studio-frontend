import { configureStore } from '@reduxjs/toolkit';
import authSlice from './authSlice';

//import configSlice from "./configSlice";

const store = configureStore({
  reducer: {
    authenticate: authSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;
