import { configureStore } from '@reduxjs/toolkit';
import editProfileDataReducer from '../scripts/profiledataedit';

export const store = configureStore({
  reducer: {
    account_data: editProfileDataReducer,
  },
});