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
        <div className="min-h-screen flex flex-col items-center pt-12 px-6">
            <h1 className="text-3xl font-bold mb-6">Trang quản trị viên</h1>
            <div className="space-y-4">
                <button onClick={() => navigate('/admin/items')}
                        className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition duration-200">
                    Quản lý sản phẩm
                </button>
                <button onClick={() => navigate('/admin/categories')}
                        className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition duration-200">
                    Qua lý danh mục
                </button>
                <button onClick={() => navigate('/admin/designstyles')}
                        className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition duration-200">
                    Quản lý phong cách thiết kế
                </button>
                <button onClick={() => navigate('/admin/roomtypes')}
                        className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition duration-200">
                   Quản lý phòng
                </button>
                <button onClick={() => navigate('/admin/brands')}
                        className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition duration-200">
                    Quản lý hãng vật liệu
                </button>
                <button onClick={() => navigate('/admin/colors')}
                        className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition duration-200">
                    Quản lý mã màu
                </button>
                <button onClick={handleLogout}
                        className="w-full bg-red-500 text-white p-2 rounded hover:bg-red-600 transition duration-200">
                    Đăng xuất
                </button>
            </div>
        </div>
    );
};

export default AdminDashboard;
