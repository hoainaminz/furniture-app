// src/pages/DesignStyleList.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const DesignStyleList = () => {
    const [designStyles, setDesignStyles] = useState([]);
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
        const fetchDesignStyles = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get('http://localhost:5001/api/designStyles', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                setDesignStyles(response.data);
            } catch (err) {
                navigate('/login');
            }
        };

        fetchDesignStyles();
    }, []);

    const handleDesignStyleClick = (designStyle) => {
        navigate(`/designStyles/${designStyle.id}/items`, { state: { designStyleImage: designStyle.imageUrl, designStyleName: designStyle.name } });
    };

    if (error) {
        return <p>{error}</p>;
    }

    return (
        <div>
            <div className="p-4 pb-12 -mt-16 text-right">
                <div className="text-xs">Vui lòng chọn</div>
                <div className="text-xl font-bold mb-2 text-blue-500">PHONG CÁCH NỘI THẤT</div>
            </div>
            <div className="p-4 pb-24 -mt-4 text-right">
                <div className="grid grid-cols-2 gap-4">
                    {designStyles.map((designStyle) => (
                        <div
                            key={designStyle.id}
                            className="rounded-lg overflow-hidden shadow-md cursor-pointer"
                            onClick={() => handleDesignStyleClick(designStyle)}
                        >
                            <img
                                src={`http://localhost:5001/uploads/${designStyle.imageUrl}`}
                                alt={designStyle.name}
                                className="w-full h-32 object-cover rounded-lg"
                            />
                            <div className="p-2 text-xs font-medium">{designStyle.name}</div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default DesignStyleList;
