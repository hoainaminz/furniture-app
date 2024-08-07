import React from 'react';
import { Navigate } from 'react-router-dom';
import { jwtDecode } from "jwt-decode";

const ProtectedRoute = ({ children, allowedRoles }) => {
    const token = localStorage.getItem('token');
    const roleId = localStorage.getItem('roleId');

    if (!token) {
        return <Navigate to="/login" />;
    }

    try {
        const decoded = jwtDecode(token);

        // Check if the roleId in localStorage is 1 and decoded.isAdmin is true
        if (roleId === '1' && decoded.isAdmin) {
            return children;
        }

        if (!allowedRoles.includes(decoded.isAdmin)) {
            return <Navigate to="/login" />;
        }

        return children;
    } catch (error) {
        console.error("Invalid token", error);
        return <Navigate to="/login" />;
    }
};

export default ProtectedRoute;
