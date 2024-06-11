// src/components/Header.js
import React, { useState } from 'react';
import { Bars3Icon, MagnifyingGlassIcon, ArrowLeftIcon } from '@heroicons/react/24/outline';
import { useNavigate, useLocation } from 'react-router-dom';
import logo from '../assets/logo.png'; // Import logo từ thư mục assets
import Offcanvas from './Offcanvas';

const Header = ({ user }) => {
    const [isOffcanvasOpen, setIsOffcanvasOpen] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    return (
        <>
            <header className="flex justify-between items-center p-4 bg-white shadow-md">
                {location.pathname === '/' ? (
                    <button onClick={() => setIsOffcanvasOpen(true)} className="p-2">
                        <Bars3Icon className="h-6 w-6 text-black" />
                    </button>
                ) : (
                    <button onClick={() => navigate(-1)} className="p-2">
                        <ArrowLeftIcon className="h-6 w-6 text-black" />
                    </button>
                )}
                <div className="flex justify-center flex-grow">
                    <img
                        src={logo}
                        alt="Logo"
                        className="h-8 cursor-pointer"
                        onClick={() => navigate('/')}
                    />
                </div>
                <button className="p-2">
                    <MagnifyingGlassIcon className="h-6 w-6 text-black" />
                </button>
            </header>
            <Offcanvas isOpen={isOffcanvasOpen} onClose={() => setIsOffcanvasOpen(false)} user={user} />
        </>
    );
};

export default Header;
