const formatDate = (dateString) => {
  const date = new Date(dateString);
  const formattedTime = date.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
  return formattedTime;
};

export default formatDate;
