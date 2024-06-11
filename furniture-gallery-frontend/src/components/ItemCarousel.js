// src/components/ItemCarousel.js
import React, { useEffect, useState } from 'react';

const ItemCarousel = () => {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        // Giả sử bạn có một API để lấy danh sách sản phẩm
        fetch('/api/products')
            .then((response) => response.json())
            .then((data) => setProducts(data))
            .catch((error) => console.error('Error fetching products:', error));
    }, []);

    return (
        <div className="product-carousel">
            {products.length === 0 ? (
                <p>No products available</p>
            ) : (
                <div className="carousel">
                    {products.map((product) => (
                        <div key={product.id} className="carousel-item">
                            <img src={product.imageUrl} alt={product.name} />
                            <h3>{product.name}</h3>
                            <p>{product.description}</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ItemCarousel;
