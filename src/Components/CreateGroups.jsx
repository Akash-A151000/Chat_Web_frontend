import { AddBoxRounded } from '@mui/icons-material';
import { IconButton } from '@mui/material';
import React from 'react';

const CreateGroups = () => {
  return (
    <div className='createGroups-container'>
      <input
        type='text'
        placeholder='Enter Group Name'
        className='search-box'
      />
      <IconButton>
        <AddBoxRounded />
      </IconButton>
    </div>
  );
};

export default CreateGroups;
