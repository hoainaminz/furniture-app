// src/pages/ColorList.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const ColorList = () => {
    const [colors, setColors] = useState([]);
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
        const fetchColors = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get('http://localhost:5001/api/colors', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                setColors(response.data);
            } catch (err) {
                // setError('Failed to fetch colors');
                navigate('/login');
            }
        };

        fetchColors();
    }, []);

    const handleColorClick = (color) => {
        navigate(`/colors/${color.id}/items`, { state: { colorImage: color.imageUrl, colorName: color.name } });
    };

    if (error) {
        return <p>{error}</p>;
    }

    return (
        <div>
            <div className="p-4 -mt-16 text-right">
                <div className="text-xs">Vui lòng chọn</div>
                <div className="text-xl font-bold text-blue-500">MÃ MÀU</div>
            </div>
            <div className="p-4 pb-24 -mt-4 text-right">

                <div className="grid grid-cols-2 gap-4">
                {colors.map((color) => (
                        <div
                            key={color.id}
                            className="cursor-pointer"
                            onClick={() => handleColorClick(color)}
                        >
                            <img
                                src={`http://localhost:5001/uploads/${color.imageUrl}`}
                                alt={color.name}
                                className="w-full object-cover rounded-lg"
                            />
                            <div className="p-2 text-xs font-medium">{color.name}</div>
                        </div>

                    ))}
                </div>
            </div>
        </div>
    );
};

export default ColorList;
