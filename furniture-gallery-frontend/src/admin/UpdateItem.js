import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const UpdateItem = () => {
    const { id } = useParams();
    const [name, setName] = useState('');
    const [categoryId, setCategoryId] = useState('');
    const [description, setDescription] = useState('');
    const [images, setImages] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchItem = async () => {
            try {
                const response = await axios.get(`http://localhost:5001/api/items/${id}`, {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                });
                setName(response.data.name);
                setCategoryId(response.data.categoryId);
                setDescription(response.data.description);
            } catch (error) {
                console.error('Error fetching item:', error);
            }
        };

        fetchItem();
    }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('name', name);
        formData.append('categoryId', categoryId);
        formData.append('description', description);
        for (let i = 0; i < images.length; i++) {
            formData.append('images', images[i]);
        }

        try {
            await axios.put(`http://localhost:5001/api/items/${id}`, formData, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'multipart/form-data'
                }
            });
            navigate('/admin/items');
        } catch (error) {
            console.error('Error updating item:', error);
        }
    };

    return (
        <div>
            <h2>Cập nhật sản phẩm</h2>
            <form onSubmit={handleSubmit}>
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Tên sản phẩm" />
                <input type="text" value={categoryId} onChange={(e) => setCategoryId(e.target.value)} placeholder="Category ID" />
                <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Mô tả"></textarea>
                <input type="file" multiple onChange={(e) => setImages(e.target.files)} />
                <button type="submit">Cập nhật</button>
            </form>
        </div>
    );
};

export default UpdateItem;
