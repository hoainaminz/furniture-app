// src/pages/BrandList.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const BrandList = () => {
    const [brands, setBrands] = useState([]);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const [user, setUser] = useState(null);

    useEffect(() => {
        const userFromStorage = localStorage.getItem('username');
        const roleIdFromStorage = localStorage.getItem('roleId');
        if (userFromStorage) {
            setUser({ username: userFromStorage, roleId: roleIdFromStorage });
        }
    }, []);

    useEffect(() => {
        const fetchBrands = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get('http://localhost:5001/api/brands', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                setBrands(response.data);
            } catch (err) {
                navigate('/login');
            }
        };

        fetchBrands();
    }, []);

    const handleBrandClick = (brand) => {
        navigate(`/brands/${brand.id}/items`, { state: { brandImage: brand.imageUrl, brandName: brand.name } });
    };

    if (error) {
        return <p>{error}</p>;
    }

    return (
        <div>
            <div className="p-4 pb-24 -mt-16 text-right">
                <div className="text-xs">Vui lòng chọn</div>
                <div className="text-xl font-bold mb-2 text-blue-500">HÃNG VẬT LIỆU</div>
                <div className="grid grid-cols-1 gap-4">
                    {brands.map((brand) => (
                        <div
                            key={brand.id}
                            className="rounded-lg overflow-hidden shadow-md cursor-pointer"
                            onClick={() => handleBrandClick(brand)}
                        >
                            <img
                                src={`http://localhost:5001/uploads/${brand.imageUrl}`}
                                alt={brand.name}
                                className="w-full h-32 object-cover"
                            />
                            {/*<div className="p-2">{brand.name}</div>*/}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default BrandList;
