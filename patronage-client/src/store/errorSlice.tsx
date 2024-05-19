import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ErrorState {
  message: string | null;
}

const initialState: ErrorState = {
  message: null,
};

const errorSlice = createSlice({
  name: 'error',
  initialState,
  reducers: {
    showError(state, action: PayloadAction<string>) {
      state.message = action.payload;
    },
    hideError(state) {
      state.message = null;
    },
  },
});

export const { showError, hideError } = errorSlice.actions;
export default errorSlice.reducer;
