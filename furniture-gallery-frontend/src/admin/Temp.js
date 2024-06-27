import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ImageUpload from '../components/ImageUpload';
import { useNavigate, useParams } from 'react-router-dom';
import Select from 'react-select';

const UpdateItem = () => {
    const { id } = useParams();
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

                const [
                    itemRes,
                    categoryRes,
                    colorRes,
                    brandRes,
                    roomTypeRes,
                    designStyleRes,
                    itemColorsRes,
                    itemBrandRes,
                    itemRoomTypeRes,
                    itemDesignStyleRes,
                    itemImagesRes
                ] = await Promise.all([
                    axios.get(`http://localhost:5001/api/items/${id}`, { headers: { 'Authorization': `Bearer ${token}` } }),
                    axios.get('http://localhost:5001/api/categories', { headers: { 'Authorization': `Bearer ${token}` } }),
                    axios.get('http://localhost:5001/api/colors', { headers: { 'Authorization': `Bearer ${token}` } }),
                    axios.get('http://localhost:5001/api/brands', { headers: { 'Authorization': `Bearer ${token}` } }),
                    axios.get('http://localhost:5001/api/roomTypes', { headers: { 'Authorization': `Bearer ${token}` } }),
                    axios.get('http://localhost:5001/api/designStyles', { headers: { 'Authorization': `Bearer ${token}` } }),
                    axios.get(`http://localhost:5001/api/items/${id}/colors`, { headers: { 'Authorization': `Bearer ${token}` } }),
                    axios.get(`http://localhost:5001/api/items/${id}/brand`, { headers: { 'Authorization': `Bearer ${token}` } }),
                    axios.get(`http://localhost:5001/api/items/${id}/roomType`, { headers: { 'Authorization': `Bearer ${token}` } }),
                    axios.get(`http://localhost:5001/api/items/${id}/designStyle`, { headers: { 'Authorization': `Bearer ${token}` } }),
                    axios.get(`http://localhost:5001/api/items/${id}/images`, { headers: { 'Authorization': `Bearer ${token}` } }),
                ]);

                const item = itemRes.data;
                setName(item.name);
                setDescription(item.description);

                // Set options cho Select
                setCategories(categoryRes.data.map(cat => ({ value: cat.id, label: cat.name })));
                setColors(colorRes.data.map(color => ({ value: color.id, label: color.name })));
                setBrands(brandRes.data.map(brand => ({ value: brand.id, label: brand.name })));
                setRoomTypes(roomTypeRes.data.map(roomType => ({ value: roomType.id, label: roomType.name })));
                setDesignStyles(designStyleRes.data.map(designStyle => ({ value: designStyle.id, label: designStyle.name })));

                // Set giá trị cho các state
                setCategory(categoryRes.data.find(cat => cat.id === item.categoryId)
                    ? { value: item.categoryId, label: categoryRes.data.find(cat => cat.id === item.categoryId).name }
                    : null
                );

                setSelectedColors(colorRes.data
                    .filter(color => itemColorsRes.data.some(itemColor => itemColor.colorId === color.id))
                    .map(color => ({ value: color.id, label: color.name }))
                );

                // Giả sử API itemBrandRes trả về một array,
                // chúng ta lấy brand đầu tiên (nếu có)
                const fetchedBrand = itemBrandRes.data[0];
                if (fetchedBrand) {
                    setBrand({ value: fetchedBrand.id, label: fetchedBrand.name });
                }

                // Tương tự cho roomType
                const fetchedRoomType = itemRoomTypeRes.data[0];
                if (fetchedRoomType) {
                    setRoomType({ value: fetchedRoomType.id, label: fetchedRoomType.name });
                }

                // Tương tự cho designStyle
                const fetchedDesignStyle = itemDesignStyleRes.data[0];
                if (fetchedDesignStyle) {
                    setDesignStyle({ value: fetchedDesignStyle.id, label: fetchedDesignStyle.name });
                }

                setImages(itemImagesRes.data.map(image => ({
                    preview: `http://localhost:5001/uploads/${image.imageUrl}`,
                    name: image.imageUrl.split('/').pop(),
                    file: null,
                })));
            } catch (error) {
                console.error('Lỗi khi lấy dữ liệu:', error);
            }
        };

        fetchData();
    }, [id]);

    const handleImageUpload = (files) => {
        setImages(files.map(file => ({
            preview: URL.createObjectURL(file),
            name: file.name,
            file
        })));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('name', name);
        formData.append('categoryId', category ? category.value : '');
        formData.append('description', description);
        formData.append('brand', brand ? brand.value : '');
        formData.append('roomType', roomType ? roomType.value : '');
        formData.append('designStyle', designStyle ? designStyle.value : '');
        selectedColors.forEach((color) => {
            formData.append('colors[]', color.value);
        });
        images.forEach((image) => {
            if (image.file) {
                formData.append('images', image.file);
            }
        });

        try {
            const token = localStorage.getItem('token');
            await axios.put(`http://localhost:5001/api/items/${id}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${token}`
                }
            });
            setSuccess(true);
        } catch (error) {
            console.error(error);
            setError('Failed to update item');
        }
    };

    return (
        <div className="container mx-auto p-4 relative">
            <h1 className="text-2xl font-bold mb-4">Cập nhật sản phẩm</h1>
            {error && <p className="text-red-500 mb-4">{error}</p>}
            {success && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-4 rounded shadow-md text-center">
                        <p className="text-green-500 mb-4">Cập nhật sản phẩm thành công</p>
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
                    <ImageUpload onImageUpload={handleImageUpload} existingImages={images} />
                </div>
                <button
                    type="submit"
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                >
                    Cập nhật sản phẩm
                </button>
            </form>
        </div>
    );
};

export default UpdateItem;
















import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ImageUpload from '../components/ImageUpload';
import { useNavigate, useParams } from 'react-router-dom';
import Select from 'react-select';

const UpdateItem = () => {
    const { id } = useParams();
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

                const [
                    itemRes,
                    categoryRes,
                    colorRes,
                    brandRes,
                    roomTypeRes,
                    designStyleRes,
                    itemColorsRes,
                    itemBrandRes,
                    itemRoomTypeRes,
                    itemDesignStyleRes,
                    itemImagesRes
                ] = await Promise.all([
                    axios.get(`http://localhost:5001/api/items/${id}`, { headers: { 'Authorization': `Bearer ${token}` } }),
                    axios.get('http://localhost:5001/api/categories', { headers: { 'Authorization': `Bearer ${token}` } }),
                    axios.get('http://localhost:5001/api/colors', { headers: { 'Authorization': `Bearer ${token}` } }),
                    axios.get('http://localhost:5001/api/brands', { headers: { 'Authorization': `Bearer ${token}` } }),
                    axios.get('http://localhost:5001/api/roomTypes', { headers: { 'Authorization': `Bearer ${token}` } }),
                    axios.get('http://localhost:5001/api/designStyles', { headers: { 'Authorization': `Bearer ${token}` } }),
                    axios.get(`http://localhost:5001/api/items/${id}/colors`, { headers: { 'Authorization': `Bearer ${token}` } }),
                    axios.get(`http://localhost:5001/api/items/${id}/brand`, { headers: { 'Authorization': `Bearer ${token}` } }),
                    axios.get(`http://localhost:5001/api/items/${id}/roomType`, { headers: { 'Authorization': `Bearer ${token}` } }),
                    axios.get(`http://localhost:5001/api/items/${id}/designStyle`, { headers: { 'Authorization': `Bearer ${token}` } }),
                    axios.get(`http://localhost:5001/api/items/${id}/images`, { headers: { 'Authorization': `Bearer ${token}` } }),
                ]);

                const item = itemRes.data;
                setName(item.name);
                setDescription(item.description);

                setCategory(categoryRes.data.find(cat => cat.id === item.categoryId) ? { value: item.categoryId, label: categoryRes.data.find(cat => cat.id === item.categoryId).name } : null);

                setSelectedColors(colorRes.data
                    .filter(color => itemColorsRes.data.some(itemColor => itemColor.colorId === color.id))
                    .map(color => ({ value: color.id, label: color.name }))
                );

                setBrand(brandRes.data.find(brand => itemBrandRes.data.some(itemBrand => itemBrand.brandId === brand.id)) ? { value: itemBrandRes.data.find(itemBrand => itemBrand.brandId === brand.id).brandId, label: brandRes.data.find(brand => brand.id === itemBrandRes.data.find(itemBrand => itemBrand.brandId === brand.id).brandId).name } : null);

                setRoomType(roomTypeRes.data.find(roomType => itemRoomTypeRes.data.some(itemRoom => itemRoom.roomTypeId === roomType.id)) ? { value: itemRoomTypeRes.data.find(itemRoom => itemRoom.roomTypeId === roomType.id).roomTypeId, label: roomTypeRes.data.find(roomType => roomType.id === itemRoomTypeRes.data.find(itemRoom => itemRoom.roomTypeId === roomType.id).roomTypeId).name } : null);

                setDesignStyle(designStyleRes.data.find(designStyle => itemDesignStyleRes.data.some(itemDesign => itemDesign.designStyleId === designStyle.id)) ? { value: itemDesignStyleRes.data.find(itemDesign => itemDesign.designStyleId === designStyle.id).designStyleId, label: designStyleRes.data.find(designStyle => designStyle.id === itemDesignStyleRes.data.find(itemDesign => itemDesign.designStyleId === designStyle.id).designStyleId).name } : null);

                setImages(itemImagesRes.data.map(image => ({
                    preview: `http://localhost:5001/uploads/${image.imageUrl}`,
                    name: image.imageUrl.split('/').pop(),
                    file: null,  // Để trống vì đây là hình ảnh đã tồn tại
                })));

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
    }, [id]);

    const handleImageUpload = (files) => {
        setImages(files.map(file => ({
            preview: URL.createObjectURL(file),
            name: file.name,
            file
        })));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('name', name);
        formData.append('categoryId', category ? category.value : '');
        formData.append('description', description);
        formData.append('brand', brand ? brand.value : '');
        formData.append('roomType', roomType ? roomType.value : '');
        formData.append('designStyle', designStyle ? designStyle.value : '');
        selectedColors.forEach((color) => {
            formData.append('colors[]', color.value);
        });
        images.forEach((image) => {
            if (image.file) {
                formData.append('images', image.file);
            }
        });

        try {
            const token = localStorage.getItem('token');
            await axios.put(`http://localhost:5001/api/items/${id}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${token}`
                }
            });
            setSuccess(true);
        } catch (error) {
            console.error(error);
            setError('Failed to update item');
        }
    };

    return (
        <div className="container mx-auto p-4 relative">
            <h1 className="text-2xl font-bold mb-4">Cập nhật sản phẩm</h1>
            {error && <p className="text-red-500 mb-4">{error}</p>}
            {success && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-4 rounded shadow-md text-center">
                        <p className="text-green-500 mb-4">Cập nhật sản phẩm thành công</p>
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
                    <ImageUpload onImageUpload={handleImageUpload} existingImages={images} />
                </div>
                <button
                    type="submit"
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                >
                    Cập nhật sản phẩm
                </button>
            </form>
        </div>
    );
};

export default UpdateItem;
