import { createSlice } from '@reduxjs/toolkit';

// Define initial state for the profile data
const initialState = {
  name: "",
  email: "",
  start_time: "",
  duration: "",
  photo: "",
  role:""
};

export const editProfileData = createSlice({
  name: 'account_data',
  initialState, // <-- Perubahan di sini: Menggunakan initialState
  reducers: {
    set_name: (state, action) => { // <-- Menambahkan reducer untuk 'photo'
      state.name = action.payload;
    },
    set_email: (state, action) => { // <-- Menambahkan reducer untuk 'photo'
      state.email = action.payload;
    },
    set_start_time: (state, action) => {
      state.start_time = action.payload; // <-- Perubahan di sini
    },
    set_duration: (state, action) => {
      state.duration = action.payload; // <-- Perubahan di sini
    },
    set_role: (state, action) => { // <-- Menambahkan reducer untuk 'photo'
      state.role = action.payload;
    },
  },
});

export const { set_role,set_name, set_email, set_start_time, set_duration } = editProfileData.actions;

export const profile_data = (state) => state.account_data

export default editProfileData.reducer;