import { combineReducers, configureStore } from '@reduxjs/toolkit';
import editProfileDataReducer from '../scripts/profiledataedit';
import storage from 'redux-persist/lib/storage'
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist';

// Konfigurasi untuk redux-persist
const persistConfig = {
  key: 'root', // Kunci utama untuk data yang disimpan di storage
  version: 1, // Versi dari state (berguna untuk migrasi jika struktur state berubah)
  storage, // Engine storage yang akan digunakan (localStorage, sessionStorage, dll.)
  // Opsional: Whitelist atau Blacklist
  // whitelist: ['user'], // Hanya slice 'user' yang akan di-persist
  // blacklist: ['someTemporarySlice'], // Slice 'someTemporarySlice' tidak akan di-persist
};

// Gabungkan semua reducer aplikasi Anda di sini
const rootReducer = combineReducers({
  account_data: editProfileDataReducer,
  // tambahkan reducer lain di sini jika ada
  // cart: cartReducer,
  // product: productReducer,
});

// Buat reducer yang sudah di-persist
const persistedReducer = persistReducer(persistConfig, rootReducer);

// export const store = configureStore({
//   reducer: {
//     account_data: editProfileDataReducer,
//   },
// });

export const store = configureStore({
  reducer: persistedReducer,
  middleware:(getDefaultMiddleware)=>getDefaultMiddleware({
    serializableCheck:{
      ignoreActions:[FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER]
    }
  })
});

export const persistor = persistStore(store)