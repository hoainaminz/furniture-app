import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { PencilSquareIcon, TrashIcon } from '@heroicons/react/24/outline';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Modal } from 'react-responsive-modal';
import 'react-responsive-modal/styles.css';

const MyItemManager = () => {
    const [items, setItems] = useState([]);
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const itemsPerPage = 20;

    useEffect(() => {
        const fetchItems = async () => {
            try {
                const token = sessionStorage.getItem('token');
                const userId = sessionStorage.getItem('userId');
                const response = await axios.get(`http://localhost:5001/api/items/user/${userId}/items`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                const itemsWithImages = await Promise.all(response.data.map(async item => {
                    const imageResponse = await axios.get(`http://localhost:5001/api/items/${item.id}/images`, {
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    });
                    return { ...item, images: imageResponse.data };
                }));
                setItems(itemsWithImages);
            } catch (error) {
                console.error('Lỗi khi lấy danh sách sản phẩm:', error);
            }
        };
        fetchItems();
    }, []);

    const handleDelete = async (id) => {
        if (window.confirm('Bạn có chắc chắn muốn xoá sản phẩm này không?')) {
            try {
                const token = sessionStorage.getItem('token');
                await axios.delete(`http://localhost:5001/api/items/${id}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                setItems(items.filter(item => item.id !== id));
                closeModal();
                toast.warning('Đã xoá sản phẩm!');
            } catch (error) {
                console.error('Lỗi khi xoá sản phẩm:', error);
                toast.error('Không thể xoá sản phẩm.');
            }
        }
    };

    const openModal = (item) => {
        setSelectedItem(item);
        setModalIsOpen(true);
    };

    const closeModal = () => {
        setModalIsOpen(false);
        setSelectedItem(null);
    };

    const filteredItems = items.filter(item =>
        item.name.toLowerCase().includes(search.toLowerCase())
    );

    const paginatedItems = filteredItems.slice((page - 1) * itemsPerPage, page * itemsPerPage);

    const totalPages = Math.ceil(items.length / itemsPerPage);
    const pagination = generatePagination(page, totalPages);

    return (
        <div className="container mx-auto p-4 h-auto pb-24">
            <ToastContainer
                position="top-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                style={{ width: "80%", left: "20%" }}
            />
            <h1 className="text-2xl font-bold mb-4">Quản lý sản phẩm của tôi</h1>
            <div className="mb-4">
                <Link
                    to="/user/create-item"
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                >
                    Tạo sản phẩm mới
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
                        <th className="py-2 px-4 border-b-2 border-gray-300 text-left">Tên sản phẩm</th>
                        <th className="py-2 px-4 border-b-2 border-gray-300 text-left">Hình ảnh</th>
                        <th className="py-2 px-4 border-b-2 border-gray-300 sticky right-0 bg-white text-left">Hành động</th>
                    </tr>
                    </thead>
                    <tbody>
                    {paginatedItems.map(item => (
                        <tr key={item.id}>
                            <td className="py-2 px-4 border-b font-bold text-blue-500 cursor-pointer"
                                onClick={() => openModal(item)}>{item.name}</td>
                            <td className="py-2 px-4 border-b whitespace-nowrap" onClick={() => openModal(item)}>
                                <img src={`http://localhost:5001/uploads/${item.images[0]?.imageUrl}`} alt={item.name}
                                     className="w-16 h-16 object-cover"/>
                            </td>
                            <td className="py-2 px-4 border-b whitespace-nowrap sticky right-0 bg-white ">
                                <button
                                    onClick={() => openModal(item)}
                                    className="text-blue-500 hover:text-blue-700 mr-2"
                                >
                                    <PencilSquareIcon className="h-5 w-5 inline-block"/>
                                </button>
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
                {pagination.map((pageNumber, index) => (
                    <button
                        key={index}
                        onClick={() => setPage(pageNumber === '...' ? page : pageNumber)}
                        className={`mx-1 px-3 py-1 rounded ${page === pageNumber ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}
                        disabled={pageNumber === '...'}
                    >
                        {pageNumber}
                    </button>
                ))}
            </div>
            {selectedItem && (
                <Modal
                    open={modalIsOpen}
                    onClose={closeModal}
                    center
                    animationDuration={500}
                    classNames={{
                        overlay: 'customOverlay',
                        modal: 'customModal'
                    }}
                >
                    <h2>Hình ảnh sản phẩm</h2>
                    <div className="pt-4">
                        {selectedItem.images.map((image, index) => (
                            <div key={index} className="mb-2">
                                <img src={`http://localhost:5001/uploads/${image.imageUrl}`} alt={`Item image ${index + 1}`} className="mb-2 w-full"/>
                                <div className="flex justify-end">
                                    <Link
                                        to={`/user/edit-item/${selectedItem.id}`}
                                        className="text-blue-500 hover:text-blue-700 mr-2"
                                    >
                                        <PencilSquareIcon className="h-5 w-5 inline-block" />
                                    </Link>
                                    <button
                                        onClick={() => handleDelete(selectedItem.id)}
                                        className="text-red-500 hover:text-red-700"
                                    >
                                        <TrashIcon className="h-5 w-5 inline-block" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </Modal>
            )}
        </div>
    );
};

const generatePagination = (currentPage, totalPages) => {
    const delta = 2;
    const range = [];
    const rangeWithDots = [];
    let l;

    for (let i = 1; i <= totalPages; i++) {
        if (i === 1 || i === totalPages || i >= currentPage - delta && i <= currentPage + delta) {
            range.push(i);
        }
    }

    for (let i of range) {
        if (l) {
            if (i - l === 2) {
                rangeWithDots.push(l + 1);
            } else if (i - l !== 1) {
                rangeWithDots.push('...');
            }
        }
        rangeWithDots.push(i);
        l = i;
    }

    return rangeWithDots;
};

export default MyItemManager;
