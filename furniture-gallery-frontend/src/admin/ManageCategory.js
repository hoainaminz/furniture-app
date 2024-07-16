import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { PencilSquareIcon, TrashIcon } from '@heroicons/react/24/outline';

const ManageCategory = () => {
    const [categories, setCategories] = useState([]);
    const [name, setName] = useState('');
    const [image, setImage] = useState(null);
    const [search, setSearch] = useState('');
    const [editId, setEditId] = useState(null);

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const response = await axios.get('http://localhost:5001/api/categories', {
                headers: {
                    'Authorization': `Bearer ${sessionStorage.getItem('token')}`
                }
            });
            setCategories(response.data);
        } catch (error) {
            console.error('Lỗi khi lấy danh sách danh mục:', error);
        }
    };

    const handleAddCategory = async () => {
        const formData = new FormData();
        formData.append('name', name);
        if (image) {
            formData.append('imageUrl', image);
        }

        try {
            const response = editId
                ? await axios.put(`http://localhost:5001/api/categories/${editId}`, formData, {
                    headers: {
                        'Authorization': `Bearer ${sessionStorage.getItem('token')}`,
                        'Content-Type': 'multipart/form-data'
                    }
                })
                : await axios.post('http://localhost:5001/api/categories', formData, {
                    headers: {
                        'Authorization': `Bearer ${sessionStorage.getItem('token')}`,
                        'Content-Type': 'multipart/form-data'
                    }
                });

            fetchCategories();
            setName('');
            setImage(null);
            setEditId(null);
        } catch (error) {
            console.error('Lỗi khi thêm/cập nhật danh mục:', error);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Bạn có chắc chắn muốn xoá danh mục này không?')) {
            try {
                await axios.delete(`http://localhost:5001/api/categories/${id}`, {
                    headers: {
                        'Authorization': `Bearer ${sessionStorage.getItem('token')}`
                    }
                });
                fetchCategories();
            } catch (error) {
                console.error('Lỗi khi xoá danh mục:', error);
            }
        }
    };

    const handleEdit = (category) => {
        setName(category.name);
        setImage(null); // Reset image input
        setEditId(category.id);
    };

    const handleCancel = () => {
        setName('');
        setImage(null);
        setEditId(null);
    };

    const filteredCategories = categories.filter(category =>
        category.name.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="container mx-auto p-4 h-auto">
            <h1 className="text-2xl font-bold mb-4">Quản lý danh mục</h1>
            <div className="mb-4">
                <input
                    type="text"
                    placeholder="Tên danh mục"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mb-2"
                />
                <input
                    type="file"
                    onChange={(e) => setImage(e.target.files[0])}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mb-2"
                />
                <button
                    onClick={handleAddCategory}
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                >
                    {editId ? 'Cập nhật danh mục' : 'Thêm danh mục'}
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
                    placeholder="Tìm kiếm danh mục"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
            </div>
            <table className="min-w-full bg-white">
                <thead>
                <tr>
                    <th className="py-2 px-4 border-b-2 border-gray-300">ID</th>
                    <th className="py-2 px-4 border-b-2 border-gray-300">Tên danh mục</th>
                    <th className="py-2 px-4 border-b-2 border-gray-300">Hình ảnh</th>
                    <th className="py-2 px-4 border-b-2 border-gray-300">Hành động</th>
                </tr>
                </thead>
                <tbody>
                {filteredCategories.map(category => (
                    <tr key={category.id}>
                        <td className="py-2 px-4 border-b">{category.id}</td>
                        <td className="py-2 px-4 border-b">{category.name}</td>
                        <td className="py-2 px-4 border-b">
                            {category.imageUrl && (
                                <img src={`http://localhost:5001/uploads/${category.imageUrl}`} alt={category.name} className="h-16" />
                            )}
                        </td>
                        <td className="py-2 px-4 border-b">
                            <button
                                onClick={() => handleEdit(category)}
                                className="text-blue-500 hover:text-blue-700 mr-2"
                            >
                                <PencilSquareIcon className="h-5 w-5 inline-block" />
                            </button>
                            <button
                                onClick={() => handleDelete(category.id)}
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

export default ManageCategory;
