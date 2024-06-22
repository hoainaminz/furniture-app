import React from 'react';
import { useNavigate } from 'react-router-dom';

const Offcanvas = ({ isOpen, onClose, user }) => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('username');
        localStorage.removeItem('roleId');
        localStorage.removeItem('fullName');
        localStorage.removeItem('avatar');
        navigate('/');
        onClose();
        window.location.reload(); // Làm mới trang sau khi đăng xuất
    };

    const handleOverlayClick = (e) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    return (
        <div
            className={`fixed inset-0 z-50 bg-black bg-opacity-50 transition-opacity ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
            onClick={handleOverlayClick}
        >
            <div className={`fixed top-0 left-0 w-full bg-white h-full shadow-md transition-transform ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                <div className="p-4">
                    <button onClick={onClose} className="text-black mb-4">✕</button>
                    <ul className="space-y-4">
                        {user && (
                            <>
                                <li>
                                    <div className="flex items-center gap-3 border-2 border-blue-950 rounded-xl py-4 px-4">
                                        <div className="h-20 w-20">
                                            <img
                                                className="h-full w-full rounded-full object-cover object-center ring ring-white"
                                                src={`http://localhost:5001/uploads/${user.avatar}`}
                                                alt="Avatar"
                                            />
                                        </div>
                                        <div>
                                            <div className="text-xs text-gray-500">Xin chào:</div>
                                            <div className="text-lg font-medium text-black">{user.fullName}</div>
                                        </div>
                                    </div>
                                </li>
                                <li>
                                    <button
                                        onClick={() => {
                                            navigate('/profile');
                                            onClose();
                                        }}
                                        className="block w-full text-left border-2 border-blue-950 rounded-xl py-2 px-4"
                                    >
                                        Quản lý thông tin cá nhân
                                    </button>
                                </li>
                                <li>
                                    <button
                                        onClick={() => {
                                            navigate('/');
                                            onClose();
                                        }}
                                        className="block w-full text-left border-2 border-blue-950 rounded-xl py-2 px-4"
                                    >
                                        Trang chủ
                                    </button>
                                </li>
                                {user.roleId === '1' && (
                                    <li>
                                        <button
                                            onClick={() => {
                                                navigate('/admin');
                                                onClose();
                                            }}
                                            className="block w-full text-left border-2 border-blue-950 rounded-xl py-2 px-4"
                                        >
                                            Admin Dashboard
                                        </button>
                                    </li>
                                )}
                                <li>
                                    <button
                                        onClick={handleLogout}
                                        className="block w-full text-left border-2 border-blue-950 rounded-xl py-2 px-4"
                                    >
                                        Đăng xuất
                                    </button>
                                </li>
                            </>
                        )}

                        {!user && (
                            <>
                                <li>
                                    <button
                                        onClick={() => {
                                            navigate('/login');
                                            onClose();
                                        }}
                                        className="block w-full text-left border-2 border-blue-950 rounded-xl py-2 px-4"
                                    >
                                        Đăng nhập
                                    </button>
                                </li>
                                <li>
                                    <button
                                        onClick={() => {
                                            navigate('/register');
                                            onClose();
                                        }}
                                        className="block w-full text-left border-2 border-blue-950 rounded-xl py-2 px-4"
                                    >
                                        Đăng ký
                                    </button>
                                </li>
                            </>
                        )}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default Offcanvas;
