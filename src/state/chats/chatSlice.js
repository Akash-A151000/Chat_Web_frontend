import { createSlice } from '@reduxjs/toolkit';

const inititalState = {
  onlineUsers: [],
  chat: [],
  initiatedChats: [],
  recipient: null,
};

const chatSlice = createSlice({
  name: 'chat',
  initialState: inititalState,
  reducers: {
    setOnlineUsers: (state, action) => {
      state.onlineUsers = action.payload.users;
    },
    setUpdateUser: (state, action) => {
      let updateOnlineUsers = [];
      if (action.payload.user.online == false) {
        updateOnlineUsers = state.onlineUsers.filter((online) => {
          return online._id !== action.payload.user._id;
        });
      } else {
        updateOnlineUsers = [...state.onlineUsers, action.payload.user];
      }

      state.onlineUsers = updateOnlineUsers;
    },
    setInitiatedChats: (state, action) => {
      state.initiatedChats = action.payload.chats;
    },
    setUpdateInitiatedChats: (state, action) => {
      let updatedInitiatedChats = [];
      if (
        state.initiatedChats.find(
          (chat) => chat._id === action.payload.chat._id
        )
      ) {
        updatedInitiatedChats = state.initiatedChats.map((chat) => {
          if (chat._id === action.payload.chat._id) {
            return action.payload.chat;
          } else {
            return chat;
          }
        });

        const index = updatedInitiatedChats.findIndex(
          (chat) => chat._id === action.payload.chat._id
        );
        if (index !== -1) {
          const [movedChat] = updatedInitiatedChats.splice(index, 1);
          updatedInitiatedChats = [movedChat, ...updatedInitiatedChats];
        }
      } else {
        updatedInitiatedChats = [action.payload.chat, ...state.initiatedChats];
      }
      state.initiatedChats = updatedInitiatedChats;
    },
    setRecipient: (state, action) => {
      state.recipient = action.payload.user;
    },
    setChat: (state, action) => {
      state.chat = [...state.chat, action.payload.message];
    },
    setMessages: (state, action) => {
      state.chat = action.payload.messages;
    },
    setCleanUp: (state, action) => {
      state.onlineUsers = [];
      state.chat = [];
      state.initiatedChats = [];
      state.recipient = null;
    },
  },
});

export default chatSlice.reducer;
export const {
  setOnlineUsers,
  setUpdateUser,
  setRecipient,
  setChat,
  setMessages,
  setUpdateInitiatedChats,
  setInitiatedChats,
  setCleanUp,
} = chatSlice.actions;
