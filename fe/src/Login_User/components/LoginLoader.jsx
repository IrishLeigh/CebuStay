// LoginLoader.jsx
import React from 'react';
import './LoginLoader.css';

const LoginLoader = () => {
  return (
    <div className="login-loader">
      <svg viewBox="25 25 50 50">
        <circle r="20" cy="50" cx="50"></circle>
      </svg>
    </div>
  );
};

export default LoginLoader;
