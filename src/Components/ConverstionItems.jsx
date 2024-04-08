import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import formatDate from '../utils/Time';
import axios from 'axios';

const ConverstionItems = ({ props }) => {
  const user = useSelector((state) => state.auth.user);
  const [loading, setLoading] = useState(true);
  const [recipientUser, setRecipientUser] = useState({
    _id: '',
    icon: '',
    name: '',
  });

  const navigate = useNavigate();
  let name, icon, _id;

  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    try {
      if (user._id == props.recipient) {
        const user = await axios.get(
          `${import.meta.env.VITE_REACT_API_URL}/auth/user`,
          {
            params: { userId: props.sender },
          }
        );
        setRecipientUser(user.data.user);
      } else {
        const user = await axios.get(
          `${import.meta.env.VITE_REACT_API_URL}/auth/user`,
          {
            params: { userId: props.recipient },
          }
        );
        setRecipientUser(user.data.user);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  if (props.lastMessage) {
    if (props.lastMessage.recipient._id === user._id) {
      _id = props.lastMessage.sender._id;
      name = props.lastMessage.sender.name;
      icon = props.lastMessage.sender.icon;
    } else {
      _id = props.lastMessage.recipient._id;
      name = props.lastMessage.recipient.name;
      icon = props.lastMessage.recipient.icon;
    }
  }

  return (
    <>
      {!loading && (
        <>
          <div
            className='conversation-container'
            onClick={() => {
              navigate(
                `/app/chat/${props.lastMessage ? _id : recipientUser._id}`
              );
            }}
          >
            <p className='con-icon'>
              <img
                src={`${import.meta.env.VITE_REACT_API_URL}/public/assets/${
                  props.lastMessage ? icon : recipientUser.icon
                }.jpg`}
                height={'55px'}
                width={'55px'}
                style={{ borderRadius: '50%' }}
                alt=''
              />
            </p>
            <p className='con-title'>
              {props.lastMessage ? name : recipientUser.name}
            </p>
            <p className='con-lastMessage'>
              {props.lastMessage && props.lastMessage.content.length > 0
                ? props.lastMessage.content
                : 'No Messages Yet'}
            </p>
            <p className='con-timeStamp'>
              {props.lastMessage && formatDate(props.lastMessage.createdAt)}
            </p>
          </div>
        </>
      )}
    </>
  );
};

export default ConverstionItems;
