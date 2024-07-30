import React from 'react';
import './ImageGrid.css';  // We'll define the CSS for the grid layout here

const images = [
    `${process.env.PUBLIC_URL}/assets/singapore.jpg`,
    `${process.env.PUBLIC_URL}/assets/korea.png`,
    `${process.env.PUBLIC_URL}/assets/malaysia.jpg`,
    `${process.env.PUBLIC_URL}/assets/newyork.jpg`,
    `${process.env.PUBLIC_URL}/assets/spain.jpg`,
    `${process.env.PUBLIC_URL}/assets/australia.jpg`,
    `${process.env.PUBLIC_URL}/assets/california.jpeg`,
    `${process.env.PUBLIC_URL}/assets/iceland.jpg`,
    `${process.env.PUBLIC_URL}/assets/uk.jpeg`,
    `${process.env.PUBLIC_URL}/assets/hongkong.jpg`
];


const ImageGrid = () => {
  return (
    <div className="image-grid">
      {images.map((src, index) => (
        <img key={index} src={src} alt={`Image ${index + 1}`} />
      ))}
    </div>
  );
};

export default ImageGrid;
