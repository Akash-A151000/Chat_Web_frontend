import { AttachFile, Delete, Send, Try } from '@mui/icons-material';
import { IconButton } from '@mui/material';
import { useParams } from 'react-router-dom';
import React, { useEffect, useRef, useState } from 'react';

import socket from '../socket';
import useSendMessage from '../hooks/useSendMessage';
import useGetMessages from '../hooks/useGetMessages';
import MessageOthers from './MessageOthers';
import MessageSelf from './MessageSelf';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import { setRecipient, setChat } from '../state/chats/chatSlice';
import CircularProgress from '@mui/material/CircularProgress';

const ChatArea = () => {
  const messageContainerRef = useRef(null);
  const dispatch = useDispatch();
  const [fileUploadProgress, setFileUploadProgress] = useState(0);

  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [textareaHeight, setTextareaHeight] = useState('40px');
  const chat = useSelector((state) => state.chat);
  const user = useSelector((state) => state.auth);
  const { userId } = useParams();

  const [selectedFile, setSelectedFile] = useState([]);

  const { loading } = useGetMessages(user, userId);
  const { sendMessage } = useSendMessage();

  useEffect(() => {
    fetchUser();
    socket.on('receive-message', (newMessage) => {
      dispatch(setChat({ message: newMessage }));
    });

    return () => {
      socket.off('receive-message');
    };
  }, [userId]);

  useEffect(() => {
    setTimeout(() => {
      scrollToBottom();
    }, 200);
  }, [chat.chat]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
  };
  const scrollToBottom = () => {
    if (messageContainerRef.current) {
      messageContainerRef.current.scrollTo({
        top: messageContainerRef.current.scrollHeight,
        behavior: 'smooth',
      });
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
    sendMessage(
      body,
      setMessage,
      selectedFile,
      setSelectedFile,
      setFileUploadProgress
    );
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

  const isDisabled = !message.trim() && !selectedFile;

  return (
    <>
      {!isLoading && !loading && (
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
                loading='lazy'
              />
            </p>
            <div className='header-text'>
              <p className='con-title'>{chat.recipient.name}</p>
              <p>{chat.recipient.online ? 'Online' : ''}</p>
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
                      file={message.file}
                      isFile={message.isFile}
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
                      file={message.file}
                      isFile={message.isFile}
                    />
                  );
                }
              })}
          </div>
          <div className='text-input-area'>
            <input
              type='file'
              id='fileInput'
              style={{ display: 'none' }}
              onChange={handleFileChange}
            />
            <label htmlFor='fileInput'>
              <IconButton component='span'>
                <AttachFile />
              </IconButton>
            </label>

            <span>
              {selectedFile && selectedFile.name}{' '}
              {selectedFile && (
                <CircularProgress
                  variant='determinate'
                  value={fileUploadProgress}
                />
              )}
            </span>

            <textarea
              onChange={changeHandler}
              value={message}
              placeholder='Type a message'
              className='search-box'
              name='chat'
              style={{
                minHeight: '20px',
                height: '40px',
                maxHeight: '80px',
                resize: 'vertical',
              }}
            />

            <IconButton onClick={handleClick} disabled={isDisabled}>
              <Send />
            </IconButton>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatArea;
