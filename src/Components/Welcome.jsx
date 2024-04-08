import React from 'react';
import logo from '../../public/assets/2936956.png';

const Welcome = () => {
  return (
    <div className='welcome-container'>
      <img src={logo} className='welcome-logo' alt='' />
      <p>View and text directly to people present in the chat rooms.</p>
    </div>
  );
};

export default Welcome;
