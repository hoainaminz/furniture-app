import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
// import Header from "../components/Header";
import RelateItem from './RelateItem';  // Import the RelateItem component

const ItemDetail = () => {
    const { id } = useParams();
    const [item, setItem] = useState(null);
    const [images, setImages] = useState([]);
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
            setImages(imagesResponse.data.map(image => `/uploads/${image.imageUrl}`));

            const brandResponse = await axios.get(`http://localhost:5001/api/items/${id}/brand`, config);
            setBrand(brandResponse.data.map(brand => brand.name).join(', '));

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
        return <div>Loading...</div>;
    }

    return (
        <div>
            {/*<Header user={user} />*/}
            <div className="p-4">
                {item && (
                    <>
                        <div className="mb-4 text-center">
                            <button className="w-full" type="button" onClick={() => setOpen(true)}>
                                <img className="w-full h-64 object-cover rounded-lg" src={images.length > 0 ? images[0] : "/uploads/default.jpg"} alt={item.name}/>
                            </button>
                            <div className="text-xl font-medium mb-4">{item.name}</div>
                            <Lightbox
                                open={open}
                                close={() => setOpen(false)}
                                slides={images.map((image) => ({
                                    src: image,
                                    alt: item.name,
                                    width: 3840,
                                    height: 2560,
                                }))}
                                plugins={[Zoom]}
                                animation={{zoom: 500}}
                                zoom={{
                                    maxZoomPixelRatio: 3,
                                    zoomInMultiplier: 1.2,
                                    doubleTapDelay: 300,
                                }}
                            />
                        </div>
                        <div className="flex flex-wrap items-center">
                            <div className="mb-4">
                                <span className="bg-blue-100 text-blue-800 text-xs font-medium me-2 px-2.5 py-1 rounded dark:bg-blue-900 dark:text-blue-300">{brand}</span>
                            </div>
                            <div className="mb-4">
                                <span className="bg-blue-100 text-blue-800 text-xs font-medium me-2 px-2.5 py-1 rounded dark:bg-blue-900 dark:text-blue-300">{roomType}</span>
                            </div>
                            <div className="mb-4">
                                <span className="bg-blue-100 text-blue-800 text-xs font-medium me-2 px-2.5 py-1 rounded dark:bg-blue-900 dark:text-blue-300">{designStyle}</span>
                            </div>
                        </div>
                    </>
                )}
                <RelateItem itemId={id} /> {/* Integrate the RelateItem component */}
            </div>
        </div>
    );
};

export default ItemDetail;
