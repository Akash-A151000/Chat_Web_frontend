import React from 'react';

const PageNotFound = () => {
  return (
    <div style={styles.container}>
      <h1 style={styles.title}>404 - Page Not Found</h1>
      <p style={styles.message}>The page you are looking for does not exist.</p>
    </div>
  );
};

const styles = {
  container: {
    textAlign: 'center',
    marginTop: '100px',
  },
  title: {
    fontSize: '24px',
    marginBottom: '20px',
  },
  message: {
    fontSize: '16px',
    marginBottom: '20px',
  },
  link: {
    color: 'blue',
    textDecoration: 'underline',
  },
};

export default PageNotFound;
