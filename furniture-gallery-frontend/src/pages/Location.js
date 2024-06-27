// src/pages/Location.js
import React from 'react';
import { MapPinIcon } from '@heroicons/react/24/outline';

const locations = [
    {
        id: 1,
        title: 'Văn phòng đại diện',
        address: 'Tầng 8, tòa Thăng Long Tower, 98A Ngụy Như Kon Tum, Thanh Xuân, Hà Nội.'
    },
    {
        id: 2,
        title: 'Nhà Máy 1',
        address: 'Lô CN1C CCN Quất Động mở rộng, Xã Nguyễn Trãi, H.Thường Tín, TP.Hà Nội'
    },
    {
        id: 3,
        title: 'Nhà Máy 2',
        address: 'Khu Công Nghiệp Châu Sơn, TP. Phủ Lý, Hà Nam'
    },
    {
        id: 4,
        title: 'Nhà Máy 3',
        address: 'Khu Công Nghiệp Gia Lập, Huyện Gia Viễn, Tỉnh Ninh Bình'
    }
];

const Location = () => {
    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-12 text-right -mt-16 pt-1">Địa chỉ</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {locations.map(location => (
                    <div key={location.id} className="bg-white shadow-lg rounded-lg overflow-hidden p-4 flex items-start">
                        <MapPinIcon className="h-8 w-8 text-blue-500 mr-4 flex-shrink-0" />
                        <div>
                            <h2 className="text-xl font-bold mb-2">{location.title}</h2>
                            <p className="text-gray-700">{location.address}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};


export default Location;
