// src/pages/Search.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useLocation, Link, useNavigate } from 'react-router-dom';

const Search = () => {
    const [items, setItems] = useState([]);
    const location = useLocation();
    const query = new URLSearchParams(location.search).get('keyword');
    const navigate = useNavigate();
    const handleItemClick = (itemId) => {
        navigate(`/items/${itemId}`);
    };
    useEffect(() => {
        const fetchItems = async () => {
            try {
                const token = localStorage.getItem('token'); // Assuming you are storing the token in localStorage
                const response = await axios.get(`http://localhost:5001/api/search?keyword=${query}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setItems(response.data);
            } catch (error) {
                console.error('Error fetching search results:', error);
            }
        };
        if (query) {
            fetchItems();
        }
    }, [query]);

    return (
        <div className="p-4">
            <h1 className="text-2xl mb-4">Kết quả tìm kiếm cho "{query}"</h1>
            {items.length === 0 ? (
                <p>Không tìm thấy kết quả nào</p>
            ) : (
                <ul>
                    {items.map((item) => (
                        <li key={item.id}>
                            <Link to={`/items/${item.id}`} className="block p-2 border-b">
                                {item.name}
                            </Link>
                        </li>
                    ))}
                </ul>
            )}
        {/*    <div className="p-4 pb-24">*/}
        {/*        <div className="masonry">*/}
        {/*    {items.length === 0 ? (*/}
        {/*        <p>Không tìm thấy kết quả nào</p>*/}
        {/*    ) : (*/}
        {/*        <ul>*/}
        {/*            {items.map((item) => (*/}
        {/*                <div key={item.id} className="masonry-item" onClick={() => handleItemClick(item.id)}>*/}
        {/*            <img*/}
        {/*                src={`http://localhost:5001/uploads/${item.imageUrl}`}*/}
        {/*                alt={item.name}*/}
        {/*                className="w-full object-cover rounded-lg"*/}
        {/*            />*/}
        {/*        </div>*/}
        {/*    ))}*/}
        {/*        </ul>*/}
        {/*        )}*/}
        {/*    </div>*/}
        {/*</div>*/}
</div>
)
    ;
};

export default Search;
