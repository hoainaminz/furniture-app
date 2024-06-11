import React, { useState } from 'react';

const ImageUpload = ({ onImageUpload }) => {
    const [image, setImage] = useState(null);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        const reader = new FileReader();

        reader.onloadend = () => {
            setImage(reader.result);
            onImageUpload(file);
        };

        if (file) {
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className="image-upload">
            <input type="file" accept="image/*" onChange={handleFileChange} />
            {image && <img src={image} alt="Preview" className="h-32 mt-4" />}
        </div>
    );
};

export default ImageUpload;
