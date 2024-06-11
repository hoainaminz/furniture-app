// src/components/ConfirmDeleteModal.js
import React from 'react';

const ConfirmDeleteModal = ({ isOpen, onClose, onConfirm, itemName }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-4 rounded shadow-lg">
                <h2 className="text-xl font-bold mb-4">Xác nhận xoá</h2>
                <p className="mb-4">Bạn có chắc chắn muốn xoá <strong>{itemName}</strong> không?</p>
                <div className="flex justify-end space-x-2">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-gray-300 text-black rounded hover:bg-gray-400"
                    >
                        Huỷ
                    </button>
                    <button
                        onClick={onConfirm}
                        className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                    >
                        Xoá
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmDeleteModal;
