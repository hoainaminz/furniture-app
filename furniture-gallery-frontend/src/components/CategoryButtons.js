import React from 'react';
import { useNavigate } from 'react-router-dom';

const CategoryButtons = () => {
    const navigate = useNavigate();

    return (
        <div className="flex flex-col items-center space-y-4 py-8">
            <div className="grid grid-cols-1 gap-4 w-full max-w-md px-4">
            <button onClick={() => navigate('/colors')}
                    className="w-full bg-blue-200 text-black py-10 rounded-lg text-2xl px-4 font-medium">
                Chọn theo mã màu
            </button>
            </div>
            <div className="grid grid-cols-2 gap-4 w-full max-w-md px-4">
                <button onClick={() => navigate('/roomtypes')}
                        className="bg-blue-100 text-black py-10 rounded-lg px-4 font-medium">
                    Chọn theo loại phòng
                </button>
                <button onClick={() => navigate('/categories')}
                        className="bg-blue-100 text-black py-10 rounded-lg px-4 font-medium">
                    Chọn theo loại sản phẩm
                </button>
                <button onClick={() => navigate('/designstyles')}
                        className="bg-blue-50 text-black py-10 rounded-lg px-4 font-medium">
                    Chọn theo phong cách thiết kế
                </button>
                <button onClick={() => navigate('/brands')}
                        className="bg-blue-50 text-black py-10 rounded-lg px-4 font-medium">
                    Chọn theo hãng
                </button>
            </div>
        </div>
    );
};

export default CategoryButtons;