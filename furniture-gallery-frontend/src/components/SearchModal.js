// src/components/SearchModal.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg -mt-44">
                <h2 className="text-2xl mb-4">Tìm kiếm</h2>
                <form onSubmit={handleSearch}>
                    <input
                        type="text"
                        value={keyword}
                        onChange={(e) => setKeyword(e.target.value)}
                        placeholder="Nhập từ khóa..."
                        className="border p-2 w-full mb-4"
                    />
                    <button type="submit" className="bg-blue-500 text-white p-2 rounded w-full">Tìm kiếm</button>
                </form>
                <button onClick={onClose} className="mt-4 text-red-500">Đóng</button>
            </div>
        </div>
    );
};

export default SearchModal;
