import React from 'react';
import { useNavigate } from 'react-router-dom';
import { PaintBrushIcon, InboxIcon, HomeModernIcon, CheckBadgeIcon, CubeIcon } from '@heroicons/react/24/outline';
import btnColors from '../assets/btnColors.jpg';
import btnCat from '../assets/btnCat.jpg';
import btnRoomType from '../assets/btnRoomType.jpg';
import btnDesignStyle from '../assets/btnDesignStyle.jpg';
import btnBrands from '../assets/btnBrands.jpg';

const CategoryButtons = () => {
    const navigate = useNavigate();

    return (
        <div className="flex flex-col items-center space-y-4 py-4">
            <div className="grid grid-cols-1 gap-4 w-full px-4">
                <button onClick={() => navigate('/colors')} className="relative bg-cover bg-center rounded-lg overflow-hidden p-3"
                     style={{backgroundImage: `url(${btnColors})`}}>
                    <div className="absolute inset-0 bg-black opacity-30"></div>
                    <div className="relative flex flex-col items-center justify-center h-full text-white p-4">
                        <PaintBrushIcon className="h-8 w-8 mb-2"/>
                        <h2 className="text-xs font-bold">CHỌN THEO MÃ MÀU</h2>
                    </div>
                </button>
            </div>
            <div className="grid grid-cols-2 gap-4 w-full px-4">
                <button onClick={() => navigate('/roomtypes')}
                        className="relative bg-cover bg-center rounded-lg overflow-hidden p-3"
                        style={{backgroundImage: `url(${btnRoomType})`}}>
                    <div className="absolute inset-0 bg-black opacity-30"></div>
                    <div className="relative flex flex-col items-center justify-center h-full text-white p-2">
                        <HomeModernIcon className="h-8 w-8 mb-2"/>
                        <h2 className="text-xs font-bold">CHỌN THEO LOẠI PHÒNG</h2>
                    </div>
                </button>
                <button onClick={() => navigate('/categories')}
                        className="relative bg-cover bg-center rounded-lg overflow-hidden p-3"
                        style={{backgroundImage: `url(${btnCat})`}}>
                    <div className="absolute inset-0 bg-black opacity-30"></div>
                    <div className="relative flex flex-col items-center justify-center h-full text-white p-2">
                        <InboxIcon className="h-8 w-8 mb-2"/>
                        <h2 className="text-xs font-bold">CHỌN THEO LOẠI SẢN PHẨM</h2>
                    </div>
                </button>
                <button onClick={() => navigate('/designstyles')}
                        className="relative bg-cover bg-center rounded-lg overflow-hidden p-3"
                        style={{backgroundImage: `url(${btnDesignStyle})`}}>
                    <div className="absolute inset-0 bg-black opacity-30"></div>
                    <div className="relative flex flex-col items-center justify-center h-full text-white p-2">
                        <CubeIcon className="h-8 w-8 mb-2"/>
                        <h2 className="text-xs font-bold">CHỌN THEO PHONG CÁCH THIẾT KẾ</h2>
                    </div>
                </button>
                <button onClick={() => navigate('/brands')}
                        className="relative bg-cover bg-center rounded-lg overflow-hidden p-3"
                        style={{backgroundImage: `url(${btnBrands})`}}>
                    <div className="absolute inset-0 bg-black opacity-30"></div>
                    <div className="relative flex flex-col items-center justify-center h-full text-white p-2">
                        <CheckBadgeIcon className="h-8 w-8 mb-2"/>
                        <h2 className="text-xs font-bold">CHỌN THEO HÃNG</h2>
                    </div>
                </button>
            </div>
        </div>
    );
};

export default CategoryButtons;