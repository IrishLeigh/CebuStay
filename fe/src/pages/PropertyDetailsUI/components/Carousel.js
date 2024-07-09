import React, { useState } from 'react';
import { Carousel } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './CustomCarousel.css'; // Your custom CSS for Carousel

function CarouselFadeExample( height) {
    const [index, setIndex] = useState(0);
    const images = ["/image1.png", "/image2.png", "/image3.png", "/image4.png"]; // Array of image paths
    const numImages = images.length;

    const handleSelect = (selectedIndex, e) => {
        setIndex(selectedIndex >= numImages ? 0 : selectedIndex);
    };
    return (
        <Carousel activeIndex={index} onSelect={handleSelect} indicators={false}>
            {images.map((image, idx) => (
                <Carousel.Item key={idx}>
                    <img className="d-block w-100" src={image} alt={`Slide ${idx + 1}`} style={{ height: height.height, objectFit: "cover" }}/>
                </Carousel.Item>
            ))}
            <ol className="carousel-indicators">
                {images.map((image, idx) => (
                    <li
                        key={idx}
                        onClick={() => setIndex(idx)}
                        className={idx === index ? "active" : ""}
                    >
                        <img src={image} alt={`Slide ${idx + 1}`} />
                    </li>
                ))}
            </ol>
        </Carousel>
    );
}

export default CarouselFadeExample;
