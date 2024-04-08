import { Delete, Send, Try } from '@mui/icons-material';
import { IconButton } from '@mui/material';
import { useParams } from 'react-router-dom';
import React, { useEffect, useRef, useState } from 'react';

import socket from '../socket';

import MessageOthers from './MessageOthers';
import MessageSelf from './MessageSelf';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import {
  setRecipient,
  setChat,
  setMessages,
  setUpdateInitiatedChats,
} from '../state/chats/chatSlice';

const ChatArea = () => {
  const messageContainerRef = useRef(null);
  const [isMounted, setIsMounted] = useState(false);
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMessages, setIsLoadingMessages] = useState(true);
  const [message, setMessage] = useState('');
  const chat = useSelector((state) => state.chat);

  const user = useSelector((state) => state.auth);

  const { userId } = useParams();

  useEffect(() => {
    scrollToBottom();
  }, []);

  useEffect(() => {
    fetchUser();
    fetchMessages();
    // socket.emit('add-user', user.user._id, (response) => {
    //   if (response.error) {
    //     console.error('Error adding user to socket:', response.error);
    //   }
    // });
    socket.on('receive-message', (newMessage) => {
      dispatch(setChat({ message: newMessage }));
    });

    setIsMounted(true);
    return () => {
      socket.off('receive-message');
    };
  }, [userId]);

  useEffect(() => {
    scrollToBottom();
  }, [chat.chat]);

  const scrollToBottom = () => {
    if (isMounted && messageContainerRef.current) {
      setTimeout(() => {
        messageContainerRef.current.scrollTop =
          messageContainerRef.current.scrollHeight;
      }, 1000);
    }
  };

  const changeHandler = (e) => {
    setMessage(e.target.value);
  };

  const handleClick = async () => {
    const msg = message;
    const body = {
      sender: user.user._id,
      recipient: userId,
      content: msg,
    };
    const res = await axios.post(
      `${import.meta.env.VITE_REACT_API_URL}/users/message`,
      body
    );
    dispatch(setChat({ message: res.data.message }));
    dispatch(setUpdateInitiatedChats({ chat: res.data.chat }));
    setMessage('');
  };

  const fetchUser = async () => {
    try {
      const user = await axios.get(
        `${import.meta.env.VITE_REACT_API_URL}/auth/user`,
        {
          params: { userId: userId },
        }
      );

      dispatch(setRecipient({ user: user.data.user }));
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchMessages = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_REACT_API_URL}/users/messages`,
        {
          params: {
            senderId: user.user._id,
            recipientId: userId,
          },
        }
      );
      dispatch(setMessages({ messages: response.data.messages }));
    } catch (error) {
      console.log('This is the fetch messages error:', error);
    } finally {
      setIsLoadingMessages(false);
    }
  };

  return (
    <>
      {!isLoading && !isLoadingMessages && (
        <div className='chatArea-container'>
          <div className='chatArea-header'>
            <p className='con-icon'>
              <img
                src={`${import.meta.env.VITE_REACT_API_URL}/public/assets/${
                  chat.recipient.icon
                }.jpg`}
                height={'55px'}
                width={'55px'}
                style={{ borderRadius: '50%' }}
                alt=''
              />
            </p>
            <div className='header-text'>
              <p className='con-title'>{chat.recipient.name}</p>
            </div>
            <IconButton>
              <Delete />
            </IconButton>
          </div>

          <div ref={messageContainerRef} className='message-container'>
            {chat.chat.length > 0 &&
              chat.chat.map((message) => {
                if (message.sender == user.user._id) {
                  return (
                    <MessageSelf
                      key={message._id}
                      content={message.content}
                      createdAt={message.createdAt}
                    />
                  );
                } else {
                  return (
                    <MessageOthers
                      key={message._id}
                      content={message.content}
                      createdAt={message.createdAt}
                      icon={chat.recipient.icon}
                      name={chat.recipient.name}
                    />
                  );
                }
              })}
          </div>
          <div className='text-input-area'>
            <input
              onChange={changeHandler}
              value={message}
              type='text'
              placeholder='Type a message'
              className='search-box'
              name='chat'
            />
            <IconButton onClick={handleClick} disabled={!message.trim()}>
              <Send />
            </IconButton>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatArea;
