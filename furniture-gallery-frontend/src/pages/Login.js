import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:5001/api/auth/login', { username, password });
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('username', response.data.username);
            localStorage.setItem('roleId', response.data.roleId);
            navigate('/');
            window.location.reload();
        } catch (err) {
            setError('Invalid credentials');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-8 rounded w-full max-w-md">
                <h2 className="text-2xl font-bold mb-6 text-center">Đăng nhập vào Nhựa Đại Việt</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-gray-700">Username</label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                            className="w-full p-2 border border-gray-300 rounded mt-1"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="w-full p-2 border border-gray-300 rounded mt-1"
                        />
                    </div>
                    {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
                    <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition duration-200">
                        Login
                    </button>
                </form>
                <div className="mt-4 flex justify-around">
                    <button
                        onClick={() => navigate('/register')}
                        className="w-full bg-gray-500 text-white p-2 rounded hover:bg-gray-600 transition duration-200 mr-1"
                    >
                        Đăng ký
                    </button>
                    <button
                        onClick={() => navigate('/')}
                        className="w-full bg-gray-500 text-white p-2 rounded hover:bg-gray-600 transition duration-200 ml-1"
                    >
                        Trở về trang chủ
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Login;
