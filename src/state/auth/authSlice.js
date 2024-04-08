import { createSlice } from '@reduxjs/toolkit';

const storedUser = JSON.parse(localStorage.getItem('user'));

const initialState = {
  user: storedUser || null,
  isAuthenticated: !!localStorage.getItem('user'),
  chats: localStorage.getItem('chats'),
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setLogout: (state) => {
      localStorage.removeItem('user');
      localStorage.removeItem('chats');
      state.user = null;
      state.isAuthenticated = false;
      state.chats = [];
    },
    setLogin: (state, action) => {
      localStorage.setItem('user', JSON.stringify(action.payload.user));
      localStorage.setItem('chats', 0);
      state.user = action.payload.user;
      state.isAuthenticated = true;
      state.chats = 0;
    },
    setChats: (state, action) => {
      state.chats = chats + 1;
    },
  },
});

export default authSlice.reducer;
export const { setLogin, setChats, setLogout } = authSlice.actions;
