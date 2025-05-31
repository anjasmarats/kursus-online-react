import { useDispatch, useSelector } from 'react-redux';

// Gunakan ini di seluruh aplikasi Anda alih-alih `useDispatch` dan `useSelector` biasa
export const useAppDispatch = () => useDispatch();
export const useAppSelector = useSelector;