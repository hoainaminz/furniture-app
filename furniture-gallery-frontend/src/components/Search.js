// src/pages/Search.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import Masonry from 'react-masonry-css';
import { ChevronDoubleDownIcon } from '@heroicons/react/24/outline';
import '../styles/RelateItem.css';

const Search = () => {
    const [items, setItems] = useState([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [loading, setLoading] = useState(false);
    const location = useLocation();
    const query = new URLSearchParams(location.search).get('keyword');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchItems = async () => {
            try {
                setLoading(true);
                const token = localStorage.getItem('token'); // Assuming you are storing the token in localStorage
                const response = await axios.get(`http://localhost:5001/api/search?keyword=${query}&page=${page}&limit=10`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                if (response.data.length < 10) {
                    setHasMore(false);
                }
                setItems(prevItems => {
                    const newItems = response.data.filter(newItem => !prevItems.some(item => item.id === newItem.id));
                    return [...prevItems, ...newItems];
                });
                setLoading(false);
            } catch (error) {
                console.error('Error fetching search results:', error);
                setLoading(false);
            }
        };
        if (query) {
            fetchItems();
        }
    }, [query, page]);

    const handleLoadMore = () => {
        setPage(prevPage => prevPage + 1);
    };

    const handleItemClick = (itemId) => {
        navigate(`/items/${itemId}`);
    };

    return (
        <div className="p-4 pb-24">
            <h1 className="text-2xl mb-4">Kết quả tìm kiếm cho "{query}"</h1>
            {items.length === 0 ? (
                <p>Không tìm thấy kết quả nào</p>
            ) : (
                <div>

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

                    {hasMore && !loading && (
                        <div className="px-2">
                            <button onClick={handleLoadMore}
                                    className="flex flex-col items-center w-full bg-gray-200 py-2 rounded-lg">
                                <span className="w-full">Tải thêm</span>
                                <ChevronDoubleDownIcon className="h-6 w-6"/>
                            </button>
                        </div>
                    )}
                    {loading && (
                        <p>Đang tải...</p>
                    )}
                </div>
            )}
        </div>
    );
};

export default Search;
