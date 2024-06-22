// src/pages/ItemListByDesignStyle.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useLocation, useNavigate } from 'react-router-dom';


const ItemListByDesignStyle = () => {
    const { designStyleId } = useParams();
    const location = useLocation();
    const [items, setItems] = useState([]);
    const [error, setError] = useState('');
    const designStyleImage = location.state?.designStyleImage;
    const designStyleName = location.state?.designStyleName;
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
        const fetchItems = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get(`http://localhost:5001/api/designStyles/${designStyleId}/items`, {
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
                    return { ...item, imageUrl: imageResponse.data[0]?.imageUrl };
                }));
                setItems(itemsWithImages);
            } catch (err) {
                navigate('/login');
            }
        };

        fetchItems();
    }, [designStyleId]);

    const handleItemClick = (itemId) => {
        navigate(`/items/${itemId}`);
    };

    if (error) {
        return <p>{error}</p>;
    }

    return (
        <div>

            {designStyleImage && (
                <div className="p-4 pb-24">
                    <div className="text-xs">Bạn đang khám phá theo phong cách nội thất</div>
                    <div className="text-xl font-bold mb-2">{designStyleName}</div>
                    <img src={`http://localhost:5001/uploads/${designStyleImage}`} alt="DesignStyle" className="w-full h-52 object-cover rounded-lg text-center"/>
                </div>
            )}
            <div className="p-4">
                <div className="masonry">
                    {items.map((item) => (
                        <div key={item.id} className="masonry-item" onClick={() => handleItemClick(item.id)}>
                            <img
                                src={`http://localhost:5001/uploads/${item.imageUrl}`}
                                alt={item.name}
                                className="w-full object-cover rounded-lg"
                            />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ItemListByDesignStyle;
