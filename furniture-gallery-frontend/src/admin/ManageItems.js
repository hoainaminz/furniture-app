// src/admin/ManageItems.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ConfirmDeleteModal from '../components/ConfirmDeleteModal';

const ManageItems = () => {
    const [items, setItems] = useState([]);
    const [selectedItem, setSelectedItem] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [error, setError] = useState('');

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
            } catch (err) {
                setError('Failed to fetch items');
            }
        };
        fetchItems();
    }, []);

    const handleDeleteItem = async () => {
        try {
            const token = localStorage.getItem('token');
            await axios.delete(`http://localhost:5001/api/items/${selectedItem.id}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            setItems(items.filter(item => item.id !== selectedItem.id));
            setIsModalOpen(false);
            setSelectedItem(null);
        } catch (err) {
            setError('Failed to delete item');
            setIsModalOpen(false);
            setSelectedItem(null);
        }
    };

    const openDeleteModal = (item) => {
        setSelectedItem(item);
        setIsModalOpen(true);
    };

    const closeDeleteModal = () => {
        setSelectedItem(null);
        setIsModalOpen(false);
    };

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">Quản lý sản phẩm</h1>
            {error && <p className="text-red-500">{error}</p>}
            <table className="w-full border-collapse">
                <thead>
                <tr>
                    <th className="border p-2">ID</th>
                    <th className="border p-2">Tên</th>
                    <th className="border p-2">Hành động</th>
                </tr>
                </thead>
                <tbody>
                {items.map(item => (
                    <tr key={item.id}>
                        <td className="border p-2">{item.id}</td>
                        <td className="border p-2">{item.name}</td>
                        <td className="border p-2">
                            <button
                                onClick={() => openDeleteModal(item)}
                                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                            >
                                Xoá
                            </button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
            <ConfirmDeleteModal
                isOpen={isModalOpen}
                onClose={closeDeleteModal}
                onConfirm={handleDeleteItem}
                itemName={selectedItem?.name}
            />
        </div>
    );
};

export default ManageItems;
