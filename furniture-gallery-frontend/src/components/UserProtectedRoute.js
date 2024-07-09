import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
    const token = localStorage.getItem('token');
    const roleId = localStorage.getItem('roleId');

    if (!token || roleId !== '2') {
        return <Navigate to="/login" />;
    }

    return children;
};

export default ProtectedRoute;