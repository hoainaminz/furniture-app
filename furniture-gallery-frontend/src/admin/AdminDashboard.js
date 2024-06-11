// src/admin/AdminDashboard.js
import React from 'react';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('username');
        localStorage.removeItem('roleId');
        window.location.reload();
        navigate('/login');
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
            <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
            <div className="space-y-4">
                <button onClick={() => navigate('/admin/users')}
                        className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition duration-200">
                    Manage Users
                </button>
                <button onClick={() => navigate('/admin/items')}
                        className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition duration-200">
                    Manage Items
                </button>
                <button onClick={handleLogout}
                        className="w-full bg-red-500 text-white p-2 rounded hover:bg-red-600 transition duration-200">
                    Logout
                </button>
            </div>
        </div>
    );
};

export default AdminDashboard;
