//
// import React, { useState } from 'react';
//
// const ImageUpload = ({ onImageUpload, existingImages }) => {
//     const [selectedImages, setSelectedImages] = useState(existingImages || []);
//
//     const handleFileChange = (e) => {
//         const files = Array.from(e.target.files);
//         setSelectedImages(files.map(file => ({
//             preview: URL.createObjectURL(file),
//             name: file.name,
//             file
//         })));
//         onImageUpload(files);
//     };
//
//     return (
//         <div>
//             <input
//                 type="file"
//                 multiple
//                 onChange={handleFileChange}
//                 className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
//             />
//             <div className="mt-4 grid grid-cols-2 gap-4">
//                 {selectedImages.map((image, index) => (
//                     <div key={index} className="relative">
//                         <img
//                             src={image.preview}
//                             alt={image.name}
//                             className="object-cover w-full h-32 rounded-md"
//                         />
//                     </div>
//                 ))}
//             </div>
//         </div>
//     );
// };
//
// export default ImageUpload;
import React, { useState } from 'react';
import imageCompression from 'browser-image-compression';

const ImageUpload = ({ onImageUpload, existingImages }) => {
    const [selectedImages, setSelectedImages] = useState(existingImages || []);

    const convertToJPG = async (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (event) => {
                const img = new Image();
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    const ctx = canvas.getContext('2d');
                    canvas.width = img.width;
                    canvas.height = img.height;
                    ctx.drawImage(img, 0, 0);
                    canvas.toBlob((blob) => {
                        resolve(new File([blob], file.name.replace(/\.\w+$/, '.jpg'), { type: 'image/jpeg' }));
                    }, 'image/jpeg', 0.8);  // Adjust quality as needed
                };
                img.src = event.target.result;
            };
            reader.onerror = (error) => reject(error);
            reader.readAsDataURL(file);
        });
    };

    const handleFileChange = async (e) => {
        const files = Array.from(e.target.files);
        const compressedFiles = await Promise.all(files.map(async (file) => {
            const options = {
                maxSizeMB: 2,
                maxWidthOrHeight: 1280,
                useWebWorker: true
            };
            try {
                const compressedFile = await imageCompression(file, options);
                const jpgFile = await convertToJPG(compressedFile);
                return {
                    preview: URL.createObjectURL(jpgFile),
                    name: jpgFile.name,
                    file: jpgFile
                };
            } catch (error) {
                console.error('Error during image compression', error);
                return {
                    preview: URL.createObjectURL(file),
                    name: file.name,
                    file
                };
            }
        }));
        setSelectedImages(compressedFiles);
        onImageUpload(compressedFiles.map(img => img.file));
    };

    return (
        <div>
            <input
                type="file"
                multiple
                onChange={handleFileChange}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
            <div className="mt-4 grid grid-cols-2 gap-4">
                {selectedImages.map((image, index) => (
                    <div key={index} className="relative">
                        <img
                            src={image.preview}
                            alt={image.name}
                            className="object-cover w-full h-32 rounded-md"
                        />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ImageUpload;
