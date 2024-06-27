import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import Masonry from 'react-masonry-css';
import { ChevronDoubleDownIcon } from '@heroicons/react/24/outline';
import '../styles/RelateItem.css';

const ItemListByCategory = () => {
    const { categoryId } = useParams();
    const location = useLocation();
    const [items, setItems] = useState([]);
    const [error, setError] = useState('');
    const categoryImage = location.state?.categoryImage;
    const categoryName = location.state?.categoryName;
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const userFromStorage = localStorage.getItem('username');
        const roleIdFromStorage = localStorage.getItem('roleId');
        if (userFromStorage) {
            setUser({ username: userFromStorage, roleId: roleIdFromStorage });
        }
    }, []);

    useEffect(() => {
        fetchItems(currentPage);
    }, [categoryId]);

    const fetchItems = async (page) => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`http://localhost:5001/api/categories/${categoryId}/items?page=${page}`, {
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

            if (response.data.length < 10) {
                setHasMore(false);
            }

            setItems((prevItems) => [...prevItems, ...itemsWithImages].filter((item, index, self) =>
                index === self.findIndex((t) => t.id === item.id)
            ));
            setCurrentPage(page + 1);
            setIsLoading(false);
        } catch (err) {
            navigate('/login');
        }
    };

    const loadMore = () => {
        if (hasMore) {
            fetchItems(currentPage);
        }
        if (isLoading) {
            return <div className="text-center justify-center content-center">Đang tải...</div>;
        }
    };

    const handleItemClick = (itemId) => {
        navigate(`/items/${itemId}`);
    };

    if (error) {
        return <p>{error}</p>;
    }

    return (
        <div>
            {categoryName && (
                <div className="relative text-white rounded-b-3xl overflow-hidden shadow-lg -mt-16">
                    <img src={`http://localhost:5001/uploads/${categoryImage}`} className="w-full object-cover" />
                    <div className="absolute top-0 left-0 right-0 p-4 gradient-overlay">
                        <div className="relative z-10 text-right">
                            <div className="text-sm">Bạn đang khám phá loại sản phẩm</div>
                            <div className="text-2xl font-bold">{categoryName}</div>
                        </div>
                    </div>
                </div>
            )}
            <div className="px-2 pb-24 pt-4">
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
                        <button onClick={loadMore}
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

export default ItemListByCategory;
