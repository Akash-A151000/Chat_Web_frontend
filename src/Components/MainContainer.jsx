import React, { useState } from 'react';
import './myStyle.css';
import Sidebar from './Sidebar';
import WorkArea from './WorkArea';
import ChatArea from './ChatArea';
import Welcome from './Welcome';
import CreateGroups from './CreateGroups';

import { Outlet } from 'react-router-dom';
const MainContainer = () => {
  return (
    <div className='main-container'>
      <Sidebar />
      <Outlet />
    </div>                                                                                        
  );
};

export default MainContainer;
