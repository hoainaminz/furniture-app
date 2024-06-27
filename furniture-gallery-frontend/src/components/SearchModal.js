// src/components/SearchModal.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { XMarkIcon } from '@heroicons/react/24/outline'; // Import icon đóng

const SearchModal = ({ isOpen, onClose }) => {
    const [keyword, setKeyword] = useState('');
    const navigate = useNavigate();

    const handleSearch = (e) => {
        e.preventDefault();
        if (keyword.trim()) {
            navigate(`/search?keyword=${keyword}`);
            onClose();
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black flex justify-center pt-40 z-50">
            <button onClick={onClose} className="absolute top-4 right-4 text-white">
                <XMarkIcon className="h-6 w-6" />
            </button>
            <div className="bg-black text-white w-full max-w-md p-8 rounded-lg">
                <h2 className="text-2xl mb-4">Nhập từ khóa cần tìm</h2>
                <form onSubmit={handleSearch}>
                    <input
                        type="text"
                        value={keyword}
                        onChange={(e) => setKeyword(e.target.value)}
                        placeholder="Nhập từ khóa..."
                        className="border-b border-gray-300 bg-black text-white p-2 w-full mb-4 focus:outline-none"
                    />
                    <button type="submit" className="bg-white text-black py-2 px-4 rounded w-full">Tìm kiếm</button>
                </form>
            </div>
        </div>
    );
};

export default SearchModal;
