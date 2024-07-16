import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { PencilSquareIcon, TrashIcon } from '@heroicons/react/24/outline';

const ManageDesignStyle = () => {
    const [designStyles, setDesignStyles] = useState([]);
    const [name, setName] = useState('');
    const [imageUrl, setImageUrl] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [editId, setEditId] = useState(null);

    useEffect(() => {
        fetchDesignStyles();
    }, []);

    const fetchDesignStyles = async () => {
        try {
            const response = await axios.get('http://localhost:5001/api/designstyles', {
                headers: {
                    Authorization: `Bearer ${sessionStorage.getItem('token')}`
                }
            });
            setDesignStyles(response.data);
        } catch (error) {
            console.error('Error fetching design styles:', error);
        }
    };

    const handleAddDesignStyle = async () => {
        if (!name || !imageUrl) {
            alert('Please provide all required fields.');
            return;
        }

        const formData = new FormData();
        formData.append('name', name);
        formData.append('imageUrl', imageUrl);

        try {
            if (editId) {
                await axios.put(`http://localhost:5001/api/designstyles/${editId}`, formData, {
                    headers: {
                        Authorization: `Bearer ${sessionStorage.getItem('token')}`,
                        'Content-Type': 'multipart/form-data'
                    }
                });
            } else {
                await axios.post('http://localhost:5001/api/designstyles', formData, {
                    headers: {
                        Authorization: `Bearer ${sessionStorage.getItem('token')}`,
                        'Content-Type': 'multipart/form-data'
                    }
                });
            }
            fetchDesignStyles();
            setName('');
            setImageUrl(null);
            setEditId(null);
        } catch (error) {
            console.error('Error adding/updating design style:', error);
        }
    };

    const handleEdit = (designStyle) => {
        setName(designStyle.name);
        setImageUrl(designStyle.imageUrl);
        setEditId(designStyle.id);
    };

    const handleDelete = async (id) => {
        const confirmDelete = window.confirm("Bạn có chắc chắn muốn xóa phong cách thiết kế này?");
        if (confirmDelete) {
            try {
                await axios.delete(`http://localhost:5001/api/designstyles/${id}`, {
                    headers: {
                        Authorization: `Bearer ${sessionStorage.getItem('token')}`
                    }
                });
                fetchDesignStyles();
            } catch (error) {
                console.error('Error deleting design style:', error);
            }
        }
    };

    const handleCancel = () => {
        setName('');
        setImageUrl(null);
        setEditId(null);
    };

    const filteredDesignStyles = designStyles.filter((style) =>
        style.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="container mx-auto p-4 h-auto pb-24">
            <h1 className="text-2xl font-bold mb-4">Quản lý phong cách thiết kế</h1>
            <div className="mb-4">
                <input
                    type="text"
                    placeholder="Tên phong cách"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mb-2"
                />
                <input
                    type="file"
                    onChange={(e) => setImageUrl(e.target.files[0])}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mb-2"
                />
                <button
                    onClick={handleAddDesignStyle}
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                >
                    {editId ? 'Cập nhật phong cách' : 'Thêm phong cách'}
                </button>
                {editId && (
                    <button
                        onClick={handleCancel}
                        className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ml-2"
                    >
                        Hủy
                    </button>
                )}
            </div>
            <div className="mb-4">
                <input
                    type="text"
                    placeholder="Tìm kiếm phong cách"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
            </div>
            <table className="min-w-full bg-white">
                <thead>
                <tr>
                    <th className="py-2 px-4 border-b-2 border-gray-300">ID</th>
                    <th className="py-2 px-4 border-b-2 border-gray-300">Tên phong cách</th>
                    <th className="py-2 px-4 border-b-2 border-gray-300">Hình ảnh</th>
                    <th className="py-2 px-4 border-b-2 border-gray-300">Hành động</th>
                </tr>
                </thead>
                <tbody>
                {filteredDesignStyles.map((style) => (
                    <tr key={style.id}>
                        <td className="py-2 px-4 border-b">{style.id}</td>
                        <td className="py-2 px-4 border-b">{style.name}</td>
                        <td className="py-2 px-4 border-b">
                            {style.imageUrl && (
                                <img src={`http://localhost:5001/uploads/${style.imageUrl}`} alt={style.name} className="h-16" />
                            )}
                        </td>
                        <td className="py-2 px-4 border-b">
                            <button
                                onClick={() => handleEdit(style)}
                                className="text-blue-500 hover:text-blue-700 mr-2"
                            >
                                <PencilSquareIcon className="h-5 w-5 inline-block" />
                            </button>
                            <button
                                onClick={() => handleDelete(style.id)}
                                className="text-red-500 hover:text-red-700"
                            >
                                <TrashIcon className="h-5 w-5 inline-block" />
                            </button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};

export default ManageDesignStyle;
