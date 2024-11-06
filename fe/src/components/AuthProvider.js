import { createContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState(() => {
    const token = localStorage.getItem("auth_token");
    return token ? { token, user : null } : { token: null, user: null };
  });

  useEffect(() => {
    // Optionally, you can sync state back to local storage if needed
    if (auth.token) {
      localStorage.setItem("auth_token", auth.token);
    } else {
      localStorage.removeItem("auth_token");
    }
  }, [auth.token]);

  return (
    <AuthContext.Provider value={{ auth, setAuth }}>
      {children}
    </AuthContext.Provider> 
  );
};

export default AuthContext;
