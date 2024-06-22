import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
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
        <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Sản phẩm liên quan</h2>
            <div className="masonry">
                {relatedItems.map((item, index) => (
                    <div key={item.id} className={`masonry-item fade-in item-${index}`}>
                        <Link to={`/items/${item.id}`}>
                            {item.images && item.images.length > 0 && (
                                <img className="w-full object-cover rounded-lg" src={`http://localhost:5001/uploads/${item.images[0].imageUrl}`} alt={item.name} />
                            )}
                        </Link>
                    </div>
                ))}
            </div>
            {hasMore && (
                <button onClick={loadMore} className="load-more px-4 py-2 bg-blue-500 text-white rounded-md mt-4 ">
                    Tải thêm
                </button>
            )}
        </div>
    );
};

export default RelateItem;
