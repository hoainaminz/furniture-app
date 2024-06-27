import React, { useState, useEffect } from 'react';
import CategoryButtons from '../components/CategoryButtons';
import BannerCarousel from "../components/BannerCarousel";

import promote1 from '../assets/promote1.jpg';
import promote2 from '../assets/promote2.jpg';
import promote3 from '../assets/promote3.jpg';
const Home = () => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const userFromStorage = localStorage.getItem('username');
        const roleIdFromStorage = localStorage.getItem('roleId');
        const fullNameFromStorage = localStorage.getItem('fullName');
        const avatarFromStorage = localStorage.getItem('avatar');
        if (userFromStorage) {
            setUser({ username: userFromStorage, roleId: roleIdFromStorage, fullName:fullNameFromStorage, avatar:avatarFromStorage });
        }
    }, []);

    return (
        <div>
            <div className="pt-6">
                <BannerCarousel />
            </div>
            <CategoryButtons />
            <hr className="py-2 mx-4 border-gray-200" />
            <div className="flex flex-col gap-4 w-full px-4 items-center">
                <img src={promote1} alt="" className="rounded-lg"/>
                <img src={promote2} alt="" className="rounded-lg"/>
                <img src={promote3} alt="" className="rounded-lg"/>
            </div>

            <div className="text-xs text-center py-6">
                <p>
                    v.1.0.2 <strong className="text-blue-500">2024 Released</strong>
                </p>
            </div>
        </div>
    );
};

export default Home;
