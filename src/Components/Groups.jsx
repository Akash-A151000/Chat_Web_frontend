import React from 'react';
import './myStyle.css';
import logo from '../../public/assets/2936956.png';
import { IconButton } from '@mui/material';
import { Search } from '@mui/icons-material';

const Groups = () => {
  return (
    <div className='list-container'>
      <div className='ug-header'>
        <img src={logo} style={{ height: '2rem', width: '2rem' }} alt='' />
        <p className='ug-title'>Availabe Groups</p>
      </div>
      <div className='sb-search'>
        <IconButton>
          <Search />
        </IconButton>
        <input placeholder='search' className='search-box' />
      </div>
      <div className='ug-list'>
        <div className='list-item'>
          <p className='con-icon'>T</p>
          <p className='con-title'>Test User </p>
        </div>
        <div className='list-item'>
          <p className='con-icon'>T</p>
          <p className='con-title'>Test User </p>
        </div>
        <div className='list-item'>
          <p className='con-icon'>T</p>
          <p className='con-title'>Test User </p>
        </div>
        <div className='list-item'>
          <p className='con-icon'>T</p>
          <p className='con-title'>Test User </p>
        </div>
        <div className='list-item'>
          <p className='con-icon'>T</p>
          <p className='con-title'>Test User </p>
        </div>
        <div className='list-item'>
          <p className='con-icon'>T</p>
          <p className='con-title'>Test User </p>
        </div>
        <div className='list-item'>
          <p className='con-icon'>T</p>
          <p className='con-title'>Test User </p>
        </div>
      </div>
    </div>
  );
};

export default Groups;
