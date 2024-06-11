import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useLocation,useNavigate } from 'react-router-dom';


const ItemListByColor = () => {
    const { colorId } = useParams();
    const location = useLocation();
    const [items, setItems] = useState([]);
    const [error, setError] = useState('');
    const colorImage = location.state?.colorImage;
    const colorName = location.state?.colorName;
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
                const response = await axios.get(`http://localhost:5001/api/colors/${colorId}/items`, {
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
    }, [colorId]);
    const handleItemClick = (itemId) => {
        navigate(`/items/${itemId}`);
    };
    if (error) {
        return <p>{error}</p>;
    }

    return (
        <div>

            {colorImage && (
                <div className="p-4 ">
                    <div className="text-xs">Bạn đang khám phá màu</div>
                    <div className="text-xl font-bold mb-2">{colorName}</div>
                    <img src={`/uploads/${colorImage}`} alt="Color" className="w-full h-52 object-cover rounded-lg text-center"/>
                </div>
            )}
            <div className="p-4">
            <div className="masonry">
                    {items.map((item) => (
                        <div key={item.id} className="masonry-item" onClick={() => handleItemClick(item.id)}>
                            <img
                                src={`/uploads/${item.imageUrl}`}
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

export default ItemListByColor;
