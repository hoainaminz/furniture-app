// src/components/Header.js
import React, { useState } from 'react';
import { Bars3Icon, MagnifyingGlassIcon, ArrowLeftIcon } from '@heroicons/react/24/outline';
import { useNavigate, useLocation } from 'react-router-dom';
import logo from '../assets/logo.png'; // Import logo từ thư mục assets
import Offcanvas from './Offcanvas';
import SearchModal from './SearchModal'; // Import SearchModal

const Header = ({ user }) => {
    const [isOffcanvasOpen, setIsOffcanvasOpen] = useState(false);
    const [isSearchModalOpen, setIsSearchModalOpen] = useState(false); // State cho modal tìm kiếm
    const navigate = useNavigate();
    const location = useLocation();

    return (
        <>
            <header className={`header rounded-lg sticky top-0 z-50 flex justify-between items-center p-4 ${location.pathname === '/' ? 'bg-white shadow-md' : 'bg-transparent w-1/2'}`}>
                {location.pathname === '/' ? (
                    <button onClick={() => setIsOffcanvasOpen(true)} className="p-2">
                        <Bars3Icon className="h-6 w-6 text-black" />
                    </button>
                ) : (
                    <button onClick={() => navigate(-1)} className="p-2 back-button">
                        <ArrowLeftIcon className="h-6 w-6 text-black" />
                    </button>
                )}
                {location.pathname === '/' && (
                    <div className="flex justify-center flex-grow">
                        <img
                            src={logo}
                            alt="Logo"
                            className="h-10 cursor-pointer"
                            onClick={() => navigate('/')}
                        />
                    </div>
                )}
                {location.pathname === '/' && (
                    <button onClick={() => setIsSearchModalOpen(true)} className="p-2"> {/* Mở modal tìm kiếm */}
                        <MagnifyingGlassIcon className="h-6 w-6 text-black" />
                    </button>
                )}
            </header>
            <Offcanvas isOpen={isOffcanvasOpen} onClose={() => setIsOffcanvasOpen(false)} user={user} />
            <SearchModal isOpen={isSearchModalOpen} onClose={() => setIsSearchModalOpen(false)} /> {/* Thêm modal tìm kiếm */}
        </>
    );
};

export default Header;
