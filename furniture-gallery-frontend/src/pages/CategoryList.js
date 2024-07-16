import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const CategoryList = () => {
    const [categories, setCategories] = useState([]);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const [user, setUser] = useState(null);

    useEffect(() => {
        const userFromStorage = sessionStorage.getItem('username');
        const roleIdFromStorage = sessionStorage.getItem('roleId');
        if (userFromStorage) {
            setUser({ username: userFromStorage, roleId: roleIdFromStorage });
        }
    }, []);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const token = sessionStorage.getItem('token');
                const response = await axios.get('http://localhost:5001/api/categories', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                setCategories(response.data);
            } catch (err) {
                navigate('/login');
            }
        };

        fetchCategories();
    }, []);

    const handleCategoryClick = (category) => {
        navigate(`/categories/${category.id}/items`, { state: {categoryImage: category.imageUrl, categoryName: category.name } });
    };

    if (error) {
        return <p>{error}</p>;
    }

    return (
        <div>
            <div className="p-4 pb-6 text-right -mt-16">
                <div className="text-xs">Vui lòng chọn</div>
                <div className="text-xl font-bold mb-6 text-blue-500">LOẠI SẢN PHẨM</div>
            </div>
            <div className="p-4 pb-24 -mt-4 text-right">
                <div className="grid grid-cols-2 gap-4">
                    {categories.map((category) => (
                        <div
                            key={category.id}
                            className="rounded-lg overflow-hidden shadow-md cursor-pointer"
                            onClick={() => handleCategoryClick(category)}
                        >
                            <img
                                src={`http://localhost:5001/uploads/${category.imageUrl}`}
                                alt={category.name}
                                className="w-full h-32 object-cover rounded-lg"
                            />
                            <div className="p-2 font-medium">{category.name}</div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default CategoryList;
