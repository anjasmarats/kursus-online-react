import { configureStore } from '@reduxjs/toolkit';
import editProfileDataReducer from '../scripts/profiledataedit';
import { store } from 'redux-persist/lib/storage'

export const store = configureStore({
  reducer: {
    account_data: editProfileDataReducer,
  },
});