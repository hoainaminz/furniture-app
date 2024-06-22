import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ProfileManager = () => {
    const [profile, setProfile] = useState({
        fullName: '',
        email: '',
        phone: '',
        address: '',
        avatar: ''
    });
    const [newProfile, setNewProfile] = useState({
        fullName: '',
        phone: '',
        address: '',
        avatar: null
    });
    const [passwords, setPasswords] = useState({
        oldPassword: '',
        newPassword: '',
        confirmNewPassword: ''
    });
    const [message, setMessage] = useState('');

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get('http://localhost:5001/api/profile/me', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setProfile(response.data);
                setNewProfile({
                    fullName: response.data.fullName,
                    phone: response.data.phone,
                    address: response.data.address
                });
            } catch (error) {
                console.error('Error fetching profile:', error);
            }
        };

        fetchProfile();
    }, []);

    const handleProfileChange = (e) => {
        setNewProfile({ ...newProfile, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e) => {
        setNewProfile({ ...newProfile, avatar: e.target.files[0] });
    };

    const handleProfileSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            const formData = new FormData();
            formData.append('fullName', newProfile.fullName);
            formData.append('phone', newProfile.phone);
            formData.append('address', newProfile.address);
            if (newProfile.avatar) {
                formData.append('avatar', newProfile.avatar);
            }
            const response = await axios.put('http://localhost:5001/api/profile/update', formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'
                }
            });
            setMessage(response.data.message);
        } catch (error) {
            console.error('Error updating profile:', error);
        }
    };

    const handlePasswordChange = (e) => {
        setPasswords({ ...passwords, [e.target.name]: e.target.value });
    };

    const handlePasswordSubmit = async (e) => {
        e.preventDefault();
        if (passwords.newPassword !== passwords.confirmNewPassword) {
            setMessage('Mật khẩu mới không khớp.');
            return;
        }
        try {
            const token = localStorage.getItem('token');
            const response = await axios.put('http://localhost:5001/api/profile/change-password', {
                oldPassword: passwords.oldPassword,
                newPassword: passwords.newPassword
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setMessage(response.data.message);
        } catch (error) {
            console.error('Error changing password:', error);
        }
    };

    return (
        <div className="max-w-2xl mx-auto p-4 pb-24">
            <h2 className="text-2xl font-bold mb-4">Profile Manager</h2>
            <p className="mb-4 text-green-500">{message}</p>
            <h3 className="text-xl font-semibold mb-2">Thông tin cá nhân</h3>
            <form onSubmit={handleProfileSubmit} className="space-y-4">
                <div className="flex flex-col">
                    <label className="font-medium">Họ Tên:</label>
                    <input
                        type="text"
                        name="fullName"
                        value={newProfile.fullName}
                        onChange={handleProfileChange}
                        className="border p-2 rounded"
                    />
                </div>
                <div className="flex flex-col">
                    <label className="font-medium">Email:</label>
                    <input
                        type="email"
                        name="email"
                        value={profile.email}
                        readOnly
                        className="border p-2 rounded bg-gray-100"
                    />
                </div>
                <div className="flex flex-col">
                    <label className="font-medium">Địa chỉ:</label>
                    <input
                        type="text"
                        name="address"
                        value={newProfile.address}
                        onChange={handleProfileChange}
                        className="border p-2 rounded"
                    />
                </div>
                <div className="flex flex-col">
                    <label className="font-medium">Điện thoại:</label>
                    <input
                        type="text"
                        name="phone"
                        value={newProfile.phone}
                        onChange={handleProfileChange}
                        className="border p-2 rounded"
                    />
                </div>
                <div className="flex flex-col">
                    <label className="font-medium">Avatar:</label>
                    <input
                        type="file"
                        name="avatar"
                        onChange={handleFileChange}
                        className="border p-2 rounded"
                    />
                </div>
                <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
                    Cập nhật thông tin cá nhân
                </button>
            </form>
            <h3 className="text-xl font-semibold mt-6 mb-2">Đổi mật khẩu</h3>
            <form onSubmit={handlePasswordSubmit} className="space-y-4">
                <div className="flex flex-col">
                    <label className="font-medium">Mật khẩu cũ:</label>
                    <input
                        type="password"
                        name="oldPassword"
                        value={passwords.oldPassword}
                        onChange={handlePasswordChange}
                        className="border p-2 rounded"
                    />
                </div>
                <div className="flex flex-col">
                    <label className="font-medium">Mật khẩu mới:</label>
                    <input
                        type="password"
                        name="newPassword"
                        value={passwords.newPassword}
                        onChange={handlePasswordChange}
                        className="border p-2 rounded"
                    />
                </div>
                <div className="flex flex-col">
                    <label className="font-medium">Nhập lại mật khẩu mới:</label>
                    <input
                        type="password"
                        name="confirmNewPassword"
                        value={passwords.confirmNewPassword}
                        onChange={handlePasswordChange}
                        className="border p-2 rounded"
                    />
                </div>
                <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
                    Đổi mật khẩu
                </button>
            </form>
        </div>
    );
};

export default ProfileManager;
