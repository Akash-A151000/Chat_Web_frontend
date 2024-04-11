import { useEffect, useState } from 'react';
import { setMessages } from '../state/chats/chatSlice';
import axios from 'axios';
import { useDispatch } from 'react-redux';

const useGetMessages = (user, userId) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchMessages();
  }, [userId]);

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
      setLoading(false);
    }
  };

  return { loading };
};

export default useGetMessages;
