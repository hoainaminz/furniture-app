import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
    const token = sessionStorage.getItem('token');
    const roleId = sessionStorage.getItem('roleId');

    if (!token || roleId !== '2') {
        return <Navigate to="/login" />;
    }

    return children;
};

export default ProtectedRoute;