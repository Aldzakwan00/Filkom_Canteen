import React, { createContext, useContext, useState } from "react";

// Membuat AuthContext menggunakan createContext
export const AuthContext = createContext();

// Hook untuk mengakses AuthContext
export const useAuth = () => {
  return useContext(AuthContext);
};

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const login = (userData) => {
    setUser(userData); // Simpan data user
    localStorage.setItem("token", userData.token); // Simpan token di localStorage
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("token");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
