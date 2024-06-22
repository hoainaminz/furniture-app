import React from 'react';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';

// Import trực tiếp hình ảnh
import banner1 from '../assets/banner1.jpg';
import banner2 from '../assets/banner2.jpg';
import banner3 from '../assets/banner3.jpg';

const banners = [
    { id: 1, src: banner1, alt: 'Banner 1' },
    { id: 2, src: banner2, alt: 'Banner 2' },
    { id: 3, src: banner3, alt: 'Banner 3' },
];

const BannerCarousel = () => {
    return (
        <Carousel autoPlay infiniteLoop showThumbs={false}>
            {banners.map((banner) => (
                <div key={banner.id} className="px-4">
                    <img src={banner.src} alt={banner.alt} className="rounded-lg"/>
                </div>
            ))}
        </Carousel>
    );
};

export default BannerCarousel;
