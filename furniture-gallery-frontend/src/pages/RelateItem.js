// src/pages/RelateItem.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const RelateItem = ({ itemId }) => {
    const [relatedItems, setRelatedItems] = useState([]);

    const fetchRelatedItems = async () => {
        try {
            const token = localStorage.getItem('token');
            const config = {
                headers: { Authorization: `Bearer ${token}` }
            };
            const response = await axios.get(`http://localhost:5001/api/items/${itemId}/related`, config);
            const relatedItemsData = response.data;

            // Fetch images for related items
            const itemsWithImages = await Promise.all(relatedItemsData.map(async (item) => {
                const imagesResponse = await axios.get(`http://localhost:5001/api/items/${item.id}/images`, config);
                const images = imagesResponse.data;
                return { ...item, images };
            }));

            setRelatedItems(itemsWithImages);
        } catch (error) {
            console.error('Error fetching related items:', error);
        }
    };

    useEffect(() => {
        fetchRelatedItems();
    }, [itemId]);

    return (
        <div>
            <h2 className="text-2xl font-bold mb-4">Sản phẩm liên quan</h2>
            <div className="masonry">
                {relatedItems.map(item => (
                    <div key={item.id} className="masonry-item">
                        <Link to={`/items/${item.id}`}>
                            {item.images && item.images.length > 0 && (
                                <img className="w-full object-cover rounded-lg" src={`/uploads/${item.images[0].imageUrl}`} alt={item.name} />
                            )}
                        </Link>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default RelateItem;
