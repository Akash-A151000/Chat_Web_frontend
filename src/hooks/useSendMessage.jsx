import { setChat, setUpdateInitiatedChats } from '../state/chats/chatSlice';
import { useDispatch } from 'react-redux';
import axios from 'axios';

const useSendMessage = () => {
  const dispatch = useDispatch();
  const sendMessage = async (
    data,
    setMessage,
    selectedFile,
    setSelectedFile,
    setFileUploadProgress
  ) => {
    console.log(data);
    console.log(setMessage);
    console.log(selectedFile);
    if (selectedFile != null) {
      try {
        const formData = new FormData();
        formData.append('selectedfile', selectedFile);
        formData.append('file', selectedFile.name);
        formData.append('sender', data.sender);
        formData.append('recipient', data.recipient);
        formData.append('content', data.content);
        const xhr = new XMLHttpRequest();

        const onProgress = (event) => {
          if (event.lengthComputable) {
            const percentage = (event.loaded / event.total) * 100;
            console.log(percentage);
            setFileUploadProgress(Math.floor(percentage));
            if (percentage >= 100) {
              xhr.upload.removeEventListener('progress', onProgress);
              setSelectedFile(null);
            }
          }
        };

        xhr.upload.addEventListener('progress', onProgress);

        xhr.addEventListener('load', () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            const response = xhr.responseText;
            const jsonResponse = JSON.parse(response);
            // console.log('Message:', jsonResponse.message);
            dispatch(setChat({ message: jsonResponse.message }));
          } else {
            console.error(
              'File upload failed. Status:',
              xhr.status,
              xhr.statusText
            );
          }
        });

        xhr.addEventListener('error', () => {
          console.error('An error occurred during the file upload.');
        });

        xhr.open(
          'POST',
          `${import.meta.env.VITE_REACT_API_URL}/users/messages/file`
        );
        xhr.send(formData);
      } catch (error) {
        console.log(error);
      } finally {
      }
    } else {
      try {
        const body = {
          sender: data.sender,
          recipient: data.recipient,
          content: data.content,
        };
        const res = await axios.post(
          `${import.meta.env.VITE_REACT_API_URL}/users/message`,
          body
        );
        dispatch(setChat({ message: res.data.message }));
        dispatch(setUpdateInitiatedChats({ chat: res.data.chat }));
        setMessage('');
      } catch (error) {
        console.log(error);
      }
    }
  };

  return { sendMessage };
};

export default useSendMessage;
