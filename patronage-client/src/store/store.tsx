import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import errorReducer from './errorSlice';
import { errorMiddleware } from './middleware/errorMiddleware';

const store = configureStore({
  reducer: {
    auth: authReducer,
    error: errorReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }).concat(errorMiddleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export { store };