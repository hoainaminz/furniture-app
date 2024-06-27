import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Masonry from 'react-masonry-css';
import { ChevronDoubleDownIcon } from '@heroicons/react/24/outline';
import '../styles/RelateItem.css'; // Tạo file CSS để thêm các hiệu ứng

const RelateItem = ({ itemId }) => {
    const [relatedItems, setRelatedItems] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);

    const fetchRelatedItems = async (page) => {
        try {
            const token = localStorage.getItem('token');
            const config = {
                headers: { Authorization: `Bearer ${token}` }
            };
            const response = await axios.get(`http://localhost:5001/api/items/${itemId}/related?page=${page}`, config);
            const relatedItemsData = response.data;

            if (relatedItemsData.length < 10) {
                setHasMore(false);
            }

            // Fetch images for related items
            const itemsWithImages = await Promise.all(relatedItemsData.map(async (item) => {
                const imagesResponse = await axios.get(`http://localhost:5001/api/items/${item.id}/images`, config);
                const images = imagesResponse.data;
                return { ...item, images };
            }));

            setRelatedItems([...relatedItems, ...itemsWithImages]);
            setCurrentPage(page + 1);
        } catch (error) {
            console.error('Error fetching related items:', error);
        }
    };

    useEffect(() => {
        fetchRelatedItems(currentPage);
    }, [itemId]);

    const loadMore = () => {
        if (hasMore) {
            fetchRelatedItems(currentPage);
        }
    };

    return (
        <div className="px-2 pb-24">
            <h2 className="text mb-2 mt-2 px-2">Sản phẩm liên quan</h2>
            <Masonry
                breakpointCols={2}
                className="my-masonry-grid"
                columnClassName="my-masonry-grid_column"
            >
                {relatedItems.map((item) => (
                    <div key={item.id} className="masonry-item px-2">
                        <Link to={`/items/${item.id}`}>
                            {item.images && item.images.length > 0 && (
                                <img className="w-full object-cover rounded-lg" src={`http://localhost:5001/uploads/${item.images[0].imageUrl}`} alt={item.name} />
                            )}
                        </Link>
                    </div>
                ))}
            </Masonry>
            {hasMore && (
                <div className="px-2">
                    <button onClick={loadMore}
                            className="flex flex-col items-center w-full bg-gray-200 py-2 rounded-lg">
                        <span className="w-full">Tải thêm</span>
                        <ChevronDoubleDownIcon className="h-6 w-6"/>
                    </button>
                </div>

            )}
        </div>
    );
};

export default RelateItem;
