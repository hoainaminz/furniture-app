// src/pages/RoomTypeList.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const RoomTypeList = () => {
    const [roomTypes, setRoomTypes] = useState([]);
    const [error, setError] = useState('');
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
        const fetchRoomTypes = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get('http://localhost:5001/api/roomTypes', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                setRoomTypes(response.data);
            } catch (err) {
                navigate('/login');
            }
        };

        fetchRoomTypes();
    }, []);

    const handleRoomTypeClick = (roomType) => {
        navigate(`/roomTypes/${roomType.id}/items`, { state: { roomTypeImage: roomType.imageUrl, roomTypeName: roomType.name } });
    };

    if (error) {
        return <p>{error}</p>;
    }

    return (
        <div>
            <div className="p-4 pb-24">
                <div className="text-xs">Vui lòng chọn</div>
                <div className="text-xl font-bold mb-2">CHỌN THEO LOẠI PHÒNG</div>
                <div className="grid grid-cols-2 gap-4">
                    {roomTypes.map((roomType) => (
                        <div
                            key={roomType.id}
                            className="rounded-lg overflow-hidden shadow-md cursor-pointer"
                            onClick={() => handleRoomTypeClick(roomType)}
                        >
                            <img
                                src={`http://localhost:5001/uploads/${roomType.imageUrl}`}
                                alt={roomType.name}
                                className="w-full h-32 object-cover"
                            />
                            <div className="p-2 text-center font-bold">{roomType.name}</div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default RoomTypeList;
