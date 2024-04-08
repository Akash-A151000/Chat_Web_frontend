import { configureStore } from '@reduxjs/toolkit';
import authReducer from './state/auth/authSlice';
import chatReducer from './state/chats/chatSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    chat: chatReducer,
  },
});

export default store;
