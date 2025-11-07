import React from "react";

const ImageGallery = ({ images = [], mainImage, setMainImage }) => {
  if (!images || images.length === 0) return <p className="text-center text-gray-500">No Images</p>;

  return (
    <div className="flex flex-col w-full max-w-4xl mx-auto">
      {/* Main Image */}
      <div className="border rounded-lg overflow-hidden mb-4 bg-gray-100 flex items-center justify-center relative group">
        <img
          src={mainImage || images[0]}
          alt="Product"
          className="w-full h-[300px] sm:h-[400px] md:h-[500px] object-cover transition-transform duration-500 ease-in-out transform group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-25 transition-opacity duration-300"></div>
      </div>

      {/* Thumbnails */}
      <div className="flex gap-3 overflow-x-auto px-1 py-2 scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200">
        {images.map((img, idx) => (
          <div
            key={idx}
            className={`flex-shrink-0 border-2 rounded-lg p-1 cursor-pointer transition-all duration-300 transform hover:scale-105 hover:shadow-lg ${
              img === mainImage
                ? "border-blue-500 shadow-lg"
                : "border-gray-300 hover:border-blue-400"
            }`}
            onClick={() => setMainImage(img)}
          >
            <img
              src={img}
              alt={`Thumbnail ${idx + 1}`}
              className="h-20 w-20 sm:h-24 sm:w-24 md:h-28 md:w-28 object-cover rounded"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ImageGallery;
