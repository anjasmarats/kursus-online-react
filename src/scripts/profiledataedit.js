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
    set_name: (state, action) => {
      state.name = action.payload; // <-- Perubahan di sini: Langsung akses properti state
    },
    set_email: (state, action) => {
      state.email = action.payload; // <-- Perubahan di sini
    },
    set_start_time: (state, action) => {
      state.start_time = action.payload; // <-- Perubahan di sini
    },
    set_duration: (state, action) => {
      state.duration = action.payload; // <-- Perubahan di sini
    },
    set_photo: (state, action) => { // <-- Menambahkan reducer untuk 'photo'
      state.photo = action.payload;
    },
    set_role: (state, action) => { // <-- Menambahkan reducer untuk 'photo'
      state.role = action.payload;
    },
  },
});

export const { set_role,set_name, set_email, set_start_time, set_duration, set_photo } = editProfileData.actions;

export default editProfileData.reducer;