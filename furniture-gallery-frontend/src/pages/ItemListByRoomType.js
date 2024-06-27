// ItemListByRoomType.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import Masonry from "react-masonry-css";
import {ChevronDoubleDownIcon} from "@heroicons/react/24/outline";

const ItemListByRoomType = () => {
    const { roomTypeId } = useParams();
    const location = useLocation();
    const [items, setItems] = useState([]);
    const [error, setError] = useState('');
    const roomTypeImage = location.state?.roomTypeImage;
    const roomTypeName = location.state?.roomTypeName;
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);

    useEffect(() => {
        const userFromStorage = localStorage.getItem('username');
        const roleIdFromStorage = localStorage.getItem('roleId');
        if (userFromStorage) {
            setUser({ username: userFromStorage, roleId: roleIdFromStorage });
        }
    }, []);

    useEffect(() => {
        fetchItems(page);
    }, [roomTypeId, page]);

        const fetchItems = async (page) => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get(`http://localhost:5001/api/roomTypes/${roomTypeId}/items`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    },
                    params: {
                        page
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
                setItems(prevItems => {
                    const newItems = [...prevItems, ...itemsWithImages];
                    const uniqueItems = Array.from(new Set(newItems.map(a => a.id)))
                        .map(id => newItems.find(a => a.id === id));
                    return uniqueItems;
                });
                setHasMore(response.data.length > 0);
            } catch (err) {
                setError('Failed to fetch items');
                navigate('/login');
            }
        };

        const handleLoadMore = () => {
            setPage(prevPage => prevPage + 1);
        };

    const handleItemClick = (itemId) => {
        navigate(`/items/${itemId}`);
    };

    return (
        <div>
            {roomTypeImage && (

            <div className="relative text-white rounded-b-3xl overflow-hidden shadow-lg -mt-16">
                <img src={`http://localhost:5001/uploads/${roomTypeImage}`} className="w-full object-cover"/>
                <div
                    className="absolute top-0 left-0 right-0 p-4 gradient-overlay">
                    <div className="relative z-10 text-right">
                        <div className="text-sm">Bạn đang khám phá loại phòng</div>
                        <div className="text-2xl font-bold">{roomTypeName}</div>
                    </div>
                </div>
            </div>
            )}
            <div className="pt-4 px-2 pb-24">
                <Masonry
                    breakpointCols={2}
                    className="my-masonry-grid"
                    columnClassName="my-masonry-grid_column"
                >
                    {items.map((item) => (
                        <div key={item.id} className="masonry-item px-2" onClick={() => handleItemClick(item.id)}>
                            <img
                                src={`http://localhost:5001/uploads/${item.imageUrl}`}
                                alt={item.name}
                                className="w-full object-cover rounded-lg"
                                style={{ maxHeight: '300px' }} // Optimize image size
                            />
                        </div>
                    ))}
                </Masonry>
                {hasMore && (
                    <div className="px-2">
                        <button onClick={handleLoadMore}
                                className="flex flex-col items-center w-full bg-gray-200 py-2 rounded-lg">
                            <span className="w-full">Tải thêm</span>
                            <ChevronDoubleDownIcon className="h-6 w-6" />
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ItemListByRoomType;
