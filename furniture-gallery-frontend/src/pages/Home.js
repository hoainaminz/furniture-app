import React, { useState, useEffect } from 'react';
import CategoryButtons from '../components/CategoryButtons';
import BannerCarousel from "../components/BannerCarousel";

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
            <div className="pt-4">
                <BannerCarousel />
            </div>
            <CategoryButtons />
            <div className="text-xs text-center">
                <p>
                    v.1.0.0 <strong className="text-blue-500">2024 Released</strong>
                </p>
            </div>
        </div>
    );
};

export default Home;
