import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import Download from "yet-another-react-lightbox/plugins/download";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import RelateItem from './RelateItem'; // Import the RelateItem component
import { ArrowsPointingOutIcon } from '@heroicons/react/24/outline';

const ItemDetail = () => {
    const { id } = useParams();

    const [item, setItem] = useState(null);
    const [images, setImages] = useState([]);
    const [colors, setColors] = useState([]);
    const [brand, setBrand] = useState('');
    const [roomType, setRoomType] = useState('');
    const [designStyle, setDesignStyle] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [open, setOpen] = useState(false);
    const [user, setUser] = useState(null);

    useEffect(() => {
        const userFromStorage = localStorage.getItem('username');
        const roleIdFromStorage = localStorage.getItem('roleId');
        if (userFromStorage) {
            setUser({ username: userFromStorage, roleId: roleIdFromStorage });
        }
    }, []);

    const fetchItem = async () => {
        try {
            const token = localStorage.getItem('token');
            const config = {
                headers: { Authorization: `Bearer ${token}` }
            };
            const itemResponse = await axios.get(`http://localhost:5001/api/items/${id}`, config);
            setItem(itemResponse.data);

            const imagesResponse = await axios.get(`http://localhost:5001/api/items/${id}/images`, config);
            setImages(imagesResponse.data.map(image => `http://localhost:5001/uploads/${image.imageUrl}`));

            const brandResponse = await axios.get(`http://localhost:5001/api/items/${id}/brand`, config);
            setBrand(brandResponse.data.map(brand => brand.name).join(', '));

            const colorsResponse = await axios.get(`http://localhost:5001/api/items/${id}/colors`, config);
            setColors(colorsResponse.data.map(color => color.name));

            const roomTypeResponse = await axios.get(`http://localhost:5001/api/items/${id}/roomType`, config);
            setRoomType(roomTypeResponse.data.map(roomType => roomType.name).join(', '));

            const designStyleResponse = await axios.get(`http://localhost:5001/api/items/${id}/designStyle`, config);
            setDesignStyle(designStyleResponse.data.map(designStyle => designStyle.name).join(', '));

            setIsLoading(false);
        } catch (error) {
            console.error('Error fetching item details:', error);
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchItem();
    }, [id]);

    if (isLoading) {
        return <div className="text-center justify-center content-center">Đang tải...</div>;
    }

    return (
        <div>
            <div className="-mt-16">
                {item && (
                    <>
                        <div className="mb-4 relative">
                            <button
                                className="absolute right-2 bg-white rounded-full p-2 shadow-lg mt-4 mr-2 opacity-60"
                                type="button" onClick={() => setOpen(true)}>
                                <ArrowsPointingOutIcon className="h-6 w-6 text-black"/>
                            </button>
                            <img className="w-full h-full object-cover rounded-b-3xl"
                                 src={images.length > 0 ? images[0] : "/uploads/default.jpg"} alt={item.name}/>

                            <div className="text-l font-medium px-4 mt-4 text-blue-500">{item.name}</div>
                            <div className="px-4">
                                <p className="text-gray-700 text-xs">{item.description}</p>
                            </div>
                            <Lightbox
                                open={open}
                                close={() => setOpen(false)}
                                slides={images.map((image) => ({
                                    src: image,
                                    alt: item.name,
                                    width: 3840,
                                    height: 2560,
                                }))}
                                plugins={[Zoom, Download]}
                                animation={{zoom: 500}}
                                zoom={{
                                    maxZoomPixelRatio: 3,
                                    zoomInMultiplier: 1.2,
                                    doubleTapDelay: 300,
                                }}
                            />
                        </div>
                        <div className="tags flex flex-wrap items-center px-4">
                            {brand && (
                                <div className="mb-4">
                                    <span
                                        className="bg-blue-100 text-blue-800 text-xs font-medium me-2 px-2.5 py-1 rounded dark:bg-blue-900 dark:text-blue-300">{brand}</span>
                                </div>
                            )}
                            {roomType && (
                                <div className="mb-4">
                                    <span
                                        className="bg-blue-100 text-blue-800 text-xs font-medium me-2 px-2.5 py-1 rounded dark:bg-blue-900 dark:text-blue-300">{roomType}</span>
                                </div>
                            )}
                            {designStyle && (
                                <div className="mb-4">
                                    <span
                                        className="bg-blue-100 text-blue-800 text-xs font-medium me-2 px-2.5 py-1 rounded dark:bg-blue-900 dark:text-blue-300">{designStyle}</span>
                                </div>
                            )}
                            {colors && colors.map((color, index) => (
                                <div className="mb-4" key={index}>
                                    <span className="bg-blue-100 text-blue-800 text-xs font-medium me-2 px-2.5 py-1 rounded dark:bg-blue-900 dark:text-blue-300">{color}</span>
                                </div>
                            ))}
                        </div>

                    </>
                )}
                <hr className="mx-4 border-t border-gray-300 mt-6" />
                <RelateItem itemId={id}/> {/* Integrate the RelateItem component */}
            </div>
        </div>
    );
};

export default ItemDetail;
