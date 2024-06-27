import React, {useState} from 'react';
import { HomeIcon, UserIcon, MagnifyingGlassIcon, PhoneIcon, MapPinIcon } from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom';
import SearchModal from './SearchModal'; // Import SearchModal

const Footer = () => {
    const navigate = useNavigate();
    const [isSearchModalOpen, setIsSearchModalOpen] = useState(false); // State cho modal tìm kiếm
    return (
        <footer
            className="fixed bottom-0 left-0 w-full bg-white shadow-lg p-4 flex justify-between items-center rounded-lg custom-shadow">
            <button onClick={() => setIsSearchModalOpen(true)} className="p-2"> {/* Mở modal tìm kiếm */}
                <MagnifyingGlassIcon className="h-6 w-6 text-black"/>
            </button>
            <button onClick={() => navigate('/profile')} className="p-2">
                <UserIcon className="h-6 w-6 text-black"/>
            </button>
            <button onClick={() => navigate('/')} className="p-4 -m-2 bg-blue-500 rounded-xl">
                <HomeIcon className="h-6 w-6 text-white"/>
            </button>
            <button onClick={() => navigate('/contact')} className="p-2">
                <PhoneIcon className="h-6 w-6 text-black"/>
            </button>
            <button onClick={() => navigate('/address')} className="p-2">
                <MapPinIcon className="h-6 w-6 text-black"/>
            </button>
            <SearchModal isOpen={isSearchModalOpen}
                         onClose={() => setIsSearchModalOpen(false)}/> {/* Thêm modal tìm kiếm */}
        </footer>
    );
};

export default Footer;
