// src/pages/Contact.js
import React from 'react';
import { PhoneIcon } from '@heroicons/react/24/outline';
import contact1 from '../assets/contact1.jpg';
import contact2 from '../assets/contact2.jpg';

const contacts = [
    {
        id: 1,
        name: 'CSKH ECOPLAST',
        image: contact1,
        phone: '0865502296',
    },
    {
        id: 2,
        name: 'CSKH CASARY',
        image: contact2,
        phone: '0911291588',
    },
    // Thêm nhiều liên hệ khác nếu cần
];

const Contact = () => {
    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-12 text-right -mt-16 pt-1">Liên hệ CSKH</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {contacts.map(contact => (
                    <div key={contact.id} className="bg-white shadow-lg rounded-lg overflow-hidden">
                        <img src={contact.image} alt={contact.name} className="w-full h-48 object-cover" />
                        <div className="p-4">
                            <h2 className="text-xl mb-2">{contact.name}</h2>
                            <a href={`tel:${contact.phone}`} className="inline-flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-700 transition-colors duration-300">
                                <PhoneIcon className="h-5 w-5 mr-2" />
                                {contact.phone}
                            </a>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Contact;
