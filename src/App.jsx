import { useEffect, useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import socket from './socket';
import MainContainer from './Components/MainContainer';
import Login from './Components/Login';
import Welcome from './Components/Welcome';
import ChatArea from './Components/ChatArea';
import CreateGroups from './Components/CreateGroups';
import Users from './Components/Users';
import Groups from './Components/Groups';
import { useSelector, useDispatch } from 'react-redux';
import {
  setUpdateUser,
  setCleanUp,
  setUpdateOnline,
} from './state/chats/chatSlice';
import PageNotFound from './Components/PageNotFound';
import { Toaster } from 'react-hot-toast';
import { setLogout } from './state/auth/authSlice';

import ServerErrorPage from './Components/ServerErrorPage';

function App() {
  const currentUser = useSelector((state) => state.auth.user);
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const [serverAvailable, setServerAvailable] = useState(true);
  const dispatch = useDispatch();

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (isAuthenticated) {
        const onlineStatus = !document.hidden;
        updateOnlineStatus(onlineStatus);
      }
    };

    if (isAuthenticated) {
      socket.emit('add-user', currentUser._id, (response) => {
        if (response.error) {
          console.error('Error adding user to socket:', response.error);
        }
      });
      socket.on('update-online', (data) => {
        dispatch(setUpdateOnline({ recipient: data }));
        dispatch(setUpdateUser({ user: data }));
      });
    }

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      socket.off('update-online');
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [isAuthenticated]);

  const updateOnlineStatus = async (onlineStatus) => {
    try {
      const data = {
        userId: currentUser._id,
        online: onlineStatus,
      };
      socket.emit('update-online', data);

      // if (currentUser._id != user.data.user._id) {
      // dispatch(setUpdateUser({ user: user.data.user }));
      // }
    } catch (error) {
      console.error('Error updating online status:', error);
    }
  };
  return (
    <div className='App'>
      {serverAvailable ? (
        <Routes>
          <Route
            path='/'
            element={isAuthenticated ? <Navigate to='/app/users' /> : <Login />}
          />
          <Route path='app' element={<MainContainer />}>
            <Route
              path='welcome'
              element={isAuthenticated ? <Welcome /> : <Navigate to='/' />}
            />
            <Route
              path='chat/:userId'
              element={isAuthenticated ? <ChatArea /> : <Navigate to='/' />}
            />
            <Route
              path='users'
              element={isAuthenticated ? <Users /> : <Navigate to='/' />}
            />
            <Route
              path='groups'
              element={isAuthenticated ? <Groups /> : <Navigate to='/' />}
            />
            <Route
              path='create-groups'
              element={isAuthenticated ? <CreateGroups /> : <Navigate to='/' />}
            />
          </Route>
          <Route path='*' element={<PageNotFound />} />
        </Routes>
      ) : (
        <ServerErrorPage />
      )}
      <Toaster position='top-center' reverseOrder={false} />
    </div>
  );
}

export default App;
