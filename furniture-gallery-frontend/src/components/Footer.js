// src/components/Footer.js
import React from 'react';
import { HomeIcon, UserIcon, MagnifyingGlassIcon, PhoneIcon, MapPinIcon } from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom';

const Footer = () => {
    const navigate = useNavigate();

    return (
        <footer className="fixed bottom-0 left-0 w-full bg-white shadow-md p-4 flex justify-between items-center">
            <button onClick={() => navigate('/')} className="p-2">
                <HomeIcon className="h-6 w-6 text-black" />
            </button>
            <button onClick={() => navigate('/search')} className="p-2">
                <MagnifyingGlassIcon className="h-6 w-6 text-black" />
            </button>
            <button onClick={() => navigate('/profile')} className="p-2">
                <UserIcon className="h-6 w-6 text-black" />
            </button>
            <button onClick={() => navigate('/contact')} className="p-2">
                <PhoneIcon className="h-6 w-6 text-black" />
            </button>
            <button onClick={() => navigate('/address')} className="p-2">
                <MapPinIcon className="h-6 w-6 text-black" />
            </button>
        </footer>
    );
};

export default Footer;
