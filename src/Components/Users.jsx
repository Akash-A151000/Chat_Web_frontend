import React, { useEffect, useState } from 'react';
import './myStyle.css';
import socket from '../socket';
import { Link } from 'react-router-dom';
import logo from '../../public/assets/2936956.png';
import { IconButton } from '@mui/material';
import { Search } from '@mui/icons-material';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import {
  setOnlineUsers,
  setUpdateInitiatedChats,
} from '../state/chats/chatSlice';

const Users = () => {
  const dispatch = useDispatch();
  const [searchQuery, setSearchQuery] = useState('');
  const _id = useSelector((state) => state.auth.user._id);
  const users = useSelector((state) => state.chat.onlineUsers);
  useEffect(() => {
    getUsers();
  }, [users]);

  const handleClick = async (senderId, recipientId) => {
    try {
      const createChat = await axios.post(
        `${import.meta.env.VITE_REACT_API_URL}/users/chat`,
        {
          senderId,
          recipientId,
        }
      );
      dispatch(setUpdateInitiatedChats({ chat: createChat.data.chat }));
    } catch (error) {
      console.log(error);
    }
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getUsers = async () => {
    try {
      const onlineUsers = await axios.get(
        `${import.meta.env.VITE_REACT_API_URL}/users/online/${_id}`
      );

      dispatch(setOnlineUsers({ users: onlineUsers.data.online }));
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className='list-container'>
      <div className='ug-header'>
        <img src={logo} style={{ height: '2rem', width: '2rem' }} alt='' />
        <p className='ug-title'>Online Users</p>
      </div>
      <div className='sb-search'>
        <IconButton>
          <Search />
        </IconButton>
        <input
          placeholder='search'
          value={searchQuery}
          onChange={handleSearch}
          className='search-box'
        />
      </div>
      <div className='ug-list'>
        {filteredUsers.length > 0 &&
          filteredUsers.map((user) => {
            return (
              <div className='list-item' key={user._id}>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  <p className='con-icon'>
                    <img
                      src={`${
                        import.meta.env.VITE_REACT_API_URL
                      }/public/assets/${user.icon}.jpg`}
                      height={'55px'}
                      width={'55px'}
                      style={{ borderRadius: '50%' }}
                      alt=''
                    />
                  </p>
                  <p className='con-title'>{user.name} </p>
                </div>
                <div style={{ margin: '15px' }}>
                  <Link
                    to={`/app/chat/${user._id}`}
                    style={{
                      backgroundColor: '#088F8F',
                      textDecoration: 'none',
                      padding: '10px',
                      borderRadius: '4px',
                      cursor: 'pointer',
                    }}
                    onClick={() => handleClick(_id, user._id)}
                  >
                    Chat
                  </Link>
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default Users;
