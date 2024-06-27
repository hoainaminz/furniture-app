import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { PencilSquareIcon, TrashIcon } from '@heroicons/react/24/outline';

const ManageItems = () => {
    const [items, setItems] = useState([]);
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);
    const itemsPerPage = 20;
    const navigate = useNavigate();

    useEffect(() => {
        const fetchItems = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get('http://localhost:5001/api/items', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                setItems(response.data);
            } catch (error) {
                console.error('Lỗi khi lấy danh sách sản phẩm:', error);
            }
        };
        fetchItems();
    }, []);

    const handleDelete = async (id) => {
        if (window.confirm('Bạn có chắc chắn muốn xoá sản phẩm này không?')) {
            try {
                const token = localStorage.getItem('token');
                await axios.delete(`http://localhost:5001/api/items/${id}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                setItems(items.filter(item => item.id !== id));
            } catch (error) {
                console.error('Lỗi khi xoá sản phẩm:', error);
            }
        }
    };

    const filteredItems = items.filter(item =>
        item.name.toLowerCase().includes(search.toLowerCase())
    );

    const paginatedItems = filteredItems.slice((page - 1) * itemsPerPage, page * itemsPerPage);

    return (
        <div className="container mx-auto p-4 h-auto pb-24">
            <h1 className="text-2xl font-bold mb-4">Quản lý sản phẩm</h1>
            <div className="mb-4">
                <Link
                    to="/admin/create-item"
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                >
                    Thêm mới
                </Link>
            </div>
            <div className="mb-4">
                <input
                    type="text"
                    placeholder="Tìm kiếm sản phẩm"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
            </div>
            <div className="overflow-x-auto">
                <table className="min-w-full bg-white">
                    <thead>
                    <tr>
                        <th className="py-2 px-4 border-b-2 border-gray-300">ID</th>
                        <th className="py-2 px-4 border-b-2 border-gray-300">Tên sản phẩm</th>
                        {/*<th className="py-2 px-4 border-b-2 border-gray-300">Hình ảnh</th>*/}
                        {/*<th className="py-2 px-4 border-b-2 border-gray-300">Mã màu</th>*/}
                        <th className="py-2 px-4 border-b-2 border-gray-300 sticky right-0 bg-white">Hành động</th>
                    </tr>
                    </thead>
                    <tbody>
                    {paginatedItems.map(item => (
                        <tr key={item.id}>
                            <td className="py-2 px-4 border-b whitespace-nowrap">{item.id}</td>
                            <td className="py-2 px-4 border-b whitespace-nowrap">{item.name}</td>
                            {/*<td className="py-2 px-4 border-b whitespace-nowrap">{item.imageUrl}</td>*/}
                            {/*<td className="py-2 px-4 border-b whitespace-nowrap">{item.colorCode}</td>*/}
                            <td className="py-2 px-4 border-b whitespace-nowrap sticky right-0 bg-white flex">
                                <Link
                                    to={`/admin/edit-item/${item.id}`}
                                    className="text-blue-500 hover:text-blue-700"
                                >
                                    <PencilSquareIcon className="h-5 w-5 inline-block"/>
                                </Link>
                                <button
                                    onClick={() => handleDelete(item.id)}
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
            <div className="mt-4 flex justify-center">
                {Array.from({ length: Math.ceil(filteredItems.length / itemsPerPage) }, (_, i) => (
                    <button
                        key={i + 1}
                        onClick={() => setPage(i + 1)}
                        className={`mx-1 px-3 py-1 rounded ${page === i + 1 ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}
                    >
                        {i + 1}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default ManageItems;
