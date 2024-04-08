import React, { useState } from 'react';
import logo from '../../public/assets/2936956.png';
import { Button, TextField } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import socket from '../socket';
import { Backdrop, CircularProgress } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { setLogin } from '../state/auth/authSlice';
import { setUpdateUser } from '../state/chats/chatSlice';
import toast from 'react-hot-toast';

const Login = () => {
  const [data, setData] = useState({ name: '' });
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = React.useState(false);
  const dispatch = useDispatch();
  const handleClose = () => {
    setOpen(false);
  };

  const navigate = useNavigate();

  const changeHandler = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const loginHandler = async () => {
    setOpen(true);
    setLoading(true);
    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
        },
      };
      const response = await axios.post(
        `${import.meta.env.VITE_REACT_API_URL}/auth/register`,
        data,
        config
      );
      // console.log('Login :', response);
      dispatch(setLogin({ user: response.data.user }));
      const socketData = {
        userId: response.data.user._id,
        online: response.data.user.online,
      };
      socket.emit('update-online', socketData);
      navigate('/app/users');
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div>
      {loading && (
        <Backdrop
          sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={open}
          onClick={handleClose}
        >
          <CircularProgress color='inherit' />
        </Backdrop>
      )}
      <div className='login-container'>
        <div className='image-container'>
          <img src={logo} alt='' className='welcome-logo' />
        </div>
        <div className='login-box'>
          <p className='login-text'>Enter your name to Chat</p>
          <TextField
            onChange={changeHandler}
            id='standard-basic'
            label='Enter Username'
            variant='outlined'
            name='name'
          />
          <Button variant='outlined' onClick={loginHandler}>
            Chat
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Login;
