import React from 'react';
import formatDate from '../utils/Time';

const MessageOthers = ({ icon, name, content, createdAt }) => {
  return (
    <div className='other-message-container'>
      <div className='message-other'>
        <p className='con-icon'>
          <img
            src={`${
              import.meta.env.VITE_REACT_API_URL
            }/public/assets/${icon}.jpg`}
            height={'55px'}
            width={'55px'}
            style={{ borderRadius: '50%' }}
            alt=''
          />
        </p>
        <div className='other-text-content'>
          <p className='con-title'>{name}</p>
          <p className='con-lastMessage'>{content}</p>
          <p className='self-timeStamp'>{formatDate(createdAt)}</p>
        </div>
      </div>
    </div>
  );
};

export default MessageOthers;
