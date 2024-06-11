import React, { useState } from 'react';
import axios from 'axios';
import ImageUpload from '../components/ImageUpload';
import { useNavigate } from 'react-router-dom';

const Register = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [retypePassword, setRetypePassword] = useState('');
    const [phone, setPhone] = useState('');
    const [address, setAddress] = useState('');
    const [avatar, setAvatar] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const validateEmail = (email) => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(String(email).toLowerCase());
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (username.trim() === '') {
            setError('Vui lòng điền tên đăng nhập');
            return;
        }
        if (!validateEmail(email)) {
            setError('Vui lòng nhập một địa chỉ email hợp lệ');
            return;
        }
        if (password !== retypePassword) {
            setError('Mật khẩu không khớp');
            return;
        }
        if (!username || !email || !password || !retypePassword || !phone) {
            setError('Vui lòng điền vào tất cả các trường bắt buộc');
            return;
        }

        try {
            const formData = new FormData();
            formData.append('username', username);
            formData.append('email', email);
            formData.append('password', password);
            formData.append('phone', phone);
            formData.append('address', address || ' ');
            formData.append('avatar', avatar);

            await axios.post('http://localhost:5001/api/auth/register', formData);
            navigate('/login');
        } catch (err) {
            setError('Đăng ký thất bại. Vui lòng thử lại.');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-8 pb-20 rounded shadow-md w-full max-w-md">
                <h2 className="text-2xl font-bold mb-6 text-center">Đăng ký</h2>
                <form onSubmit={handleSubmit} noValidate>
                    <div className="mb-4">
                        <label className="block text-gray-700">
                            Tên đăng nhập<span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                            className="w-full p-2 border border-gray-300 rounded mt-1"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700">
                            Email<span className="text-red-500">*</span>
                        </label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="w-full p-2 border border-gray-300 rounded mt-1"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700">
                            Mật khẩu<span className="text-red-500">*</span>
                        </label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="w-full p-2 border border-gray-300 rounded mt-1"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700">
                            Nhập lại mật khẩu<span className="text-red-500">*</span>
                        </label>
                        <input
                            type="password"
                            value={retypePassword}
                            onChange={(e) => setRetypePassword(e.target.value)}
                            required
                            className="w-full p-2 border border-gray-300 rounded mt-1"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700">
                            Điện thoại<span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            required
                            className="w-full p-2 border border-gray-300 rounded mt-1"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700">Địa chỉ</label>
                        <input
                            type="text"
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded mt-1"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700">Ảnh đại diện</label>
                        <ImageUpload onImageUpload={setAvatar}/>
                        {avatar && (
                            <div className="mt-4">
                                <img src={avatar} alt="Avatar Preview" className="h-32"/>
                            </div>
                        )}
                    </div>
                    {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
                    <button type="submit"
                            className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition duration-200">
                        Đăng ký
                    </button>
                </form>
                <button
                    onClick={() => navigate('/login')}
                    className="w-full bg-gray-500 text-white p-2 rounded hover:bg-gray-600 transition duration-200 mt-2"
                >
                    Đã có tài khoản?, Đăng nhập
                </button>
            </div>
        </div>
    );
};

export default Register;
