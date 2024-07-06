import React from 'react';
import { Navigate } from 'react-router-dom';
import authService from '../Config/authService';

const PrivateRoute = ({ children }) => {
    return authService.getCurrentUser() ? children : <Navigate to="/login" />;
};

export default PrivateRoute;
