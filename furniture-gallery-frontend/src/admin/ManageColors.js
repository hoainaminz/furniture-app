import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { PencilSquareIcon, TrashIcon } from '@heroicons/react/24/outline';

const ManageColors = () => {
    const [colors, setColors] = useState([]);
    const [search, setSearch] = useState('');
    const [name, setName] = useState('');
    const [image, setImage] = useState(null);
    const [editingColorId, setEditingColorId] = useState(null);

    useEffect(() => {
        const fetchColors = async () => {
            try {
                const token = sessionStorage.getItem('token');
                const response = await axios.get('http://localhost:5001/api/colors', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                setColors(response.data);
            } catch (error) {
                console.error('Lỗi khi lấy danh sách màu:', error);
            }
        };
        fetchColors();
    }, []);

    const handleAddColor = async () => {
        if (!name || !image) return;
        const formData = new FormData();
        formData.append('name', name);
        formData.append('image', image);

        try {
            const token = sessionStorage.getItem('token');
            await axios.post('http://localhost:5001/api/colors', formData, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'
                }
            });
            // Reload lại trang sau khi thêm thành công
            window.location.reload();
        } catch (error) {
            console.error('Lỗi khi thêm màu mới:', error);
        }
    };

    const handleUpdateColor = async () => {
        if (!editingColorId || !name) return;
        const formData = new FormData();
        formData.append('name', name);
        if (image) formData.append('image', image);

        try {
            const token = sessionStorage.getItem('token');
            await axios.put(`http://localhost:5001/api/colors/${editingColorId}`, formData, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'
                }
            });
            // Reload lại trang sau khi cập nhật thành công
            window.location.reload();
        } catch (error) {
            console.error('Lỗi khi cập nhật màu:', error);
        }
    };

    const handleDeleteColor = async (id) => {
        if (window.confirm('Bạn có chắc chắn muốn xoá màu này không?')) {
            try {
                const token = sessionStorage.getItem('token');
                await axios.delete(`http://localhost:5001/api/colors/${id}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                setColors(colors.filter(color => color.id !== id));
            } catch (error) {
                console.error('Lỗi khi xoá màu:', error);
            }
        }
    };

    const handleEditColor = (color) => {
        setName(color.name);
        setEditingColorId(color.id);
    };

    const handleCancelUpdate = () => {
        setName('');
        setImage(null);
        setEditingColorId(null);
    };

    const filteredColors = colors.filter(color =>
        color && color.name && color.name.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="container mx-auto p-4 h-auto pb-24">
            <h1 className="text-2xl font-bold mb-4">Quản lý mã màu</h1>

            <div className="mb-4 flex flex-col">
                <input
                    type="text"
                    placeholder="Tên màu"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mr-2 "
                />
                <input
                    type="file"
                    onChange={(e) => setImage(e.target.files[0])}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline my-2"
                />
                {editingColorId ? (
                    <>
                        <button
                            onClick={handleUpdateColor}
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                        >
                            Cập nhật màu
                        </button>
                        <button
                            onClick={handleCancelUpdate}
                            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline my-2"
                        >
                            Hủy
                        </button>
                    </>
                ) : (
                    <button
                        onClick={handleAddColor}
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    >
                        Thêm màu
                    </button>
                )}
            </div>
            <div className="mb-4">
                <input
                    type="text"
                    placeholder="Tìm kiếm màu sắc"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
            </div>
            <table className="min-w-full bg-white">
                <thead>
                <tr>
                    <th className="py-2 px-4 border-b-2 border-gray-300">ID</th>
                    <th className="py-2 px-4 border-b-2 border-gray-300">Tên màu</th>
                    <th className="py-2 px-4 border-b-2 border-gray-300">Hình ảnh</th>
                    <th className="py-2 px-4 border-b-2 border-gray-300">Hành động</th>
                </tr>
                </thead>
                <tbody>
                {filteredColors.map(color => (
                    <tr key={color.id}>
                        <td className="py-2 px-4 border-b">{color.id}</td>
                        <td className="py-2 px-4 border-b">{color.name}</td>
                        <td className="py-2 px-4 border-b">
                            {color.imageUrl &&
                                <img src={`http://localhost:5001/uploads/${color.imageUrl}`} alt={color.name}
                                     className="h-12 w-12 object-cover"/>}
                        </td>
                        <td className="py-2 px-4 border-b">
                            <button
                                onClick={() => handleEditColor(color)}
                                className="text-blue-500 hover:text-blue-700"
                            >
                                <PencilSquareIcon className="h-5 w-5 inline-block"/>
                            </button>
                            <button
                                onClick={() => handleDeleteColor(color.id)}
                                className="ml-2 text-red-500 hover:text-red-700"
                            >
                                <TrashIcon className="h-5 w-5 inline-block"/>
                            </button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};

export default ManageColors;
