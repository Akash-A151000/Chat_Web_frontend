import React, { useState } from 'react';
import formatDate from '../utils/Time';
import './myStyle.css';
const MessageOthers = ({ icon, name, content, createdAt, file, isFile }) => {
  const [downloadProgress, setDownloadProgress] = useState(0);

  const handleClick = () => {
    const fileUrl = `${
      import.meta.env.VITE_REACT_API_URL
    }/public/assets/upload/${file}`;

    const xhr = new XMLHttpRequest();

    xhr.open('GET', fileUrl, true);
    xhr.responseType = 'blob';

    xhr.addEventListener('loadstart', () => {
      console.log('Download has started.');
      setDownloadProgress(0);
    });

    xhr.addEventListener('progress', (event) => {
      if (event.lengthComputable) {
        const progress = (event.loaded / event.total) * 100;
        console.log(`Progress: ${progress}%`);
        setDownloadProgress(Math.round(progress));
      } else {
        console.log('Progress information is not computable.');
      }
    });

    xhr.addEventListener('load', () => {
      if (xhr.status === 200) {
        const blob = xhr.response;

        const objectUrl = URL.createObjectURL(blob);

        const link = document.createElement('a');
        link.href = objectUrl;
        link.download = file;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        URL.revokeObjectURL(objectUrl);

        setDownloadProgress(0);
      } else {
        console.error('File download failed:', xhr.statusText);
      }
    });

    xhr.addEventListener('error', () => {
      console.error('An error occurred during the file download.');
    });

    xhr.send();
  };

  return (
    <div className='other-message-container'>
      {isFile ? (
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
            <p
              className='con-lastMessage'
              style={{
                maxWidth: '300px',
                minWidth: '100px',
                wordWrap: 'break-word',
                whiteSpace: 'pre-wrap',
              }}
            >
              {file}
            </p>
            <button className='download' onClick={handleClick}>
              download
              {downloadProgress > 0 && ` (${downloadProgress}%)`}
            </button>
            <p className='self-timeStamp'>{formatDate(createdAt)}</p>
          </div>
        </div>
      ) : (
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
            <p
              className='con-lastMessage'
              style={{
                maxWidth: '300px',
                minWidth: '100px',
                wordWrap: 'break-word',
                whiteSpace: 'pre-wrap',
              }}
            >
              {content}
            </p>
            <p className='self-timeStamp'>{formatDate(createdAt)}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default MessageOthers;
