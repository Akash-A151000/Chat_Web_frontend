import React from 'react';
import formatDate from '../utils/Time';

const MessageSelf = ({ content, createdAt }) => {
  return (
    <div className='self-message-container'>
      <div className='messageBox'>
        <p>{content}</p>
        <p className='self-timeStamp'>{formatDate(createdAt)}</p>
      </div>
    </div>
  );
};

export default MessageSelf;
