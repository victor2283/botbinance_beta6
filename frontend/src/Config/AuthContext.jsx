// AuthContext.js

import React, { createContext, useContext, useState } from 'react';

// Creamos el contexto de autenticación
const AuthContext = createContext();

// Hook personalizado para usar el contexto de autenticación
export const useAuth = () => useContext(AuthContext);

// Proveedor del contexto de autenticación
export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const login = () => {
    // Lógica para iniciar sesión (por ejemplo, verificación de credenciales)
    setIsAuthenticated(true);
    // Aquí podrías guardar el token en localStorage o cookies, según tu implementación
  };

  const logout = () => {
    // Lógica para cerrar sesión
    setIsAuthenticated(false);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    // Limpiar el token de localStorage o cookies
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
