// src/components/ImageUpload.js
import React, { useState } from 'react';

const ImageUpload = ({ onImageUpload }) => {
    const [image, setImage] = useState(null);

    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);
        setImage(files);
        onImageUpload(files);
    };

    return (
        <div className="image-upload">
            <input type="file" accept="image/*" onChange={handleFileChange} multiple />
            {image && image.map((img, index) => (
                <img key={index} src={URL.createObjectURL(img)} alt="Preview" className="h-32 mt-4" />
            ))}
        </div>
    );
};

export default ImageUpload;
