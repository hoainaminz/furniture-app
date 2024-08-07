import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ImageUpload from '../components/ImageUpload';
import { useNavigate } from 'react-router-dom';
import Select from 'react-select';
import { jwtDecode } from "jwt-decode";

const CreateItem = () => {
    const [name, setName] = useState('');
    const [category, setCategory] = useState(null);
    const [description, setDescription] = useState('');
    const [images, setImages] = useState([]);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [categories, setCategories] = useState([]);
    const [colors, setColors] = useState([]);
    const [brands, setBrands] = useState([]);
    const [roomTypes, setRoomTypes] = useState([]);
    const [designStyles, setDesignStyles] = useState([]);
    const [selectedColors, setSelectedColors] = useState([]);
    const [brand, setBrand] = useState(null);
    const [roomType, setRoomType] = useState(null);
    const [designStyle, setDesignStyle] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem('token');
                const [categoryRes, colorRes, brandRes, roomTypeRes, designStyleRes] = await Promise.all([
                    axios.get('http://localhost:5001/api/categories', { headers: { 'Authorization': `Bearer ${token}` } }),
                    axios.get('http://localhost:5001/api/colors', { headers: { 'Authorization': `Bearer ${token}` } }),
                    axios.get('http://localhost:5001/api/brands', { headers: { 'Authorization': `Bearer ${token}` } }),
                    axios.get('http://localhost:5001/api/roomTypes', { headers: { 'Authorization': `Bearer ${token}` } }),
                    axios.get('http://localhost:5001/api/designStyles', { headers: { 'Authorization': `Bearer ${token}` } }),
                ]);

                setCategories(categoryRes.data.map(cat => ({ value: cat.id, label: cat.name })));
                setColors(colorRes.data.map(color => ({ value: color.id, label: color.name })));
                setBrands(brandRes.data.map(brand => ({ value: brand.id, label: brand.name })));
                setRoomTypes(roomTypeRes.data.map(roomType => ({ value: roomType.id, label: roomType.name })));
                setDesignStyles(designStyleRes.data.map(designStyle => ({ value: designStyle.id, label: designStyle.name })));
            } catch (error) {
                console.error('Lỗi khi lấy dữ liệu:', error);
            }
        };

        fetchData();
    }, []);

    const handleImageUpload = (files) => {
        setImages(files);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('name', name);
        formData.append('category', category ? category.value : '');
        formData.append('description', description);
        formData.append('brand', brand ? brand.value : '');
        formData.append('roomType', roomType ? roomType.value : '');
        formData.append('designStyle', designStyle ? designStyle.value : '');
        selectedColors.forEach((color) => {
            formData.append('colors[]', color.value);
        });
        images.forEach((image) => {
            formData.append('images', image);
        });

        try {
            const token = localStorage.getItem('token');
            const decoded = jwtDecode(token);
            const pending = decoded.isAdmin ? 0 : 1;
            formData.append('pending', pending);
            await axios.post('http://localhost:5001/api/items', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${token}`
                }
            });
            setSuccess(true);
        } catch (error) {
            console.error(error);
            setError('Failed to create item');
        }
    };

    return (
        <div className="container mx-auto p-4 relative">
            <h1 className="text-2xl font-bold mb-4">Tạo sản phẩm mới</h1>
            {error && <p className="text-red-500 mb-4">{error}</p>}
            {success && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-4 rounded shadow-md text-center">
                        <p className="text-green-500 mb-4">Tạo sản phẩm thành công</p>
                        <button
                            onClick={() => navigate('/admin/items')}
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                        >
                            Quay lại trang quản lý sản phẩm
                        </button>
                    </div>
                </div>
            )}
            <form onSubmit={handleSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">Tên sản phẩm:</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">Category:</label>
                    <Select
                        options={categories}
                        value={category}
                        onChange={setCategory}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        placeholder="Chọn danh mục"
                        isClearable
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">Màu sắc:</label>
                    <Select
                        options={colors}
                        value={selectedColors}
                        onChange={setSelectedColors}
                        isMulti
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        placeholder="Chọn màu sắc"
                        isClearable
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">Thương hiệu:</label>
                    <Select
                        options={brands}
                        value={brand}
                        onChange={setBrand}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        placeholder="Chọn thương hiệu"
                        isClearable
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">Loại phòng:</label>
                    <Select
                        options={roomTypes}
                        value={roomType}
                        onChange={setRoomType}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        placeholder="Chọn loại phòng"
                        isClearable
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">Phong cách thiết kế:</label>
                    <Select
                        options={designStyles}
                        value={designStyle}
                        onChange={setDesignStyle}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        placeholder="Chọn phong cách thiết kế"
                        isClearable
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">Mô tả:</label>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    ></textarea>
                </div>
                <div className="mb-4">
                    <ImageUpload onImageUpload={handleImageUpload} />
                </div>
                <button
                    type="submit"
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                >
                    Thêm sản phẩm
                </button>
            </form>
        </div>
    );
};

export default CreateItem;
