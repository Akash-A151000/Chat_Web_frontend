import socket from '../socket';
import React, { useEffect, useState } from 'react';
import './myStyle.css';
import {
  AccountCircle,
  PersonAdd,
  GroupAdd,
  AddCircle,
  Nightlight,
  ArrowBack,
} from '@mui/icons-material';
import toast from 'react-hot-toast';
import { IconButton } from '@mui/material';
import ConverstionItems from './ConverstionItems';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useSelector, useDispatch } from 'react-redux';
import {
  setInitiatedChats,
  setUpdateInitiatedChats,
  setCleanUp,
} from '../state/chats/chatSlice';
import { setLogout } from '../state/auth/authSlice';

const Sidebar = () => {
  const initiatedChats = useSelector((state) => state.chat.initiatedChats);
  const [userAccountOpen, setUserAccountOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  useEffect(() => {
    fetchChats();
    socket.on('receive-chat', (response) => {
      dispatch(setUpdateInitiatedChats({ chat: response }));
    });
    return () => {
      socket.off('receive-chat');
    };
  }, []);

  const handleClick = async () => {
    try {
      const res = await axios.delete(
        `${import.meta.env.VITE_REACT_API_URL}/auth/delete/${user._id}`
      );
      toast.error(res.data.message);
      dispatch(setCleanUp());
      dispatch(setLogout());
      navigate('/');
    } catch (error) {
      console.log(error);
    }
  };

  const fetchChats = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_REACT_API_URL}/users/chats/${user._id}`
      );
      dispatch(setInitiatedChats({ chats: res.data.chats }));
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='sidebar-container'>
      <div className='sb-header'>
        <div>
          <IconButton onClick={() => setUserAccountOpen(!userAccountOpen)}>
            <AccountCircle />
          </IconButton>
        </div>

        <div>
          <IconButton
            onClick={() => {
              navigate('users');
            }}
          >
            <PersonAdd />
          </IconButton>
          <IconButton
            onClick={() => {
              navigate('groups');
            }}
          >
            <GroupAdd />
          </IconButton>
          <IconButton
            onClick={() => {
              navigate('create-groups');
            }}
          >
            <AddCircle />
          </IconButton>
          <IconButton>
            <Nightlight />
          </IconButton>
        </div>
      </div>

      {userAccountOpen ? (
        <div className='user-accounts'>
          <div>
            <IconButton onClick={() => setUserAccountOpen(!userAccountOpen)}>
              <ArrowBack />
              Go back
            </IconButton>
          </div>
          <div className='con-icon'>
            {user && user.icon ? (
              <img
                src={`${import.meta.env.VITE_REACT_API_URL}/public/assets/${
                  user.icon
                }.jpg`}
                height={'55px'}
                width={'55px'}
                style={{ borderRadius: '50%' }}
                alt=''
              />
            ) : null}
          </div>
          <div>
            <p className='user-name'>{user && user.name}</p>
          </div>
          <div>
            <button className='user-button' onClick={handleClick}>
              Delete User
            </button>
          </div>
        </div>
      ) : (
        <div className='sb-conversations'>
          {initiatedChats.length > 0 && !loading ? (
            initiatedChats.map((chat) => {
              return <ConverstionItems key={chat._id} props={chat} />;
            })
          ) : (
            <div className='no-chats'>No Chats</div>
          )}
        </div>
      )}
    </div>
  );
};

export default Sidebar;
