import React, { useEffect, useState } from 'react';
import { Carousel } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './CustomCarousel.css'; // Your custom CSS for Carousel

function CarouselFadeExample({ photos, height, photoLength }) {
    const [index, setIndex] = useState(0);
    const images = ["/image1.png", "/image2.png", "/image3.png", "/image4.png"];

    const [imagesExtra, setImagesExtra] = useState([]);
    const numImages = images.length;

    useEffect(() => {
        setImagesExtra(photos);
    }, [photos]);


    console.log("photoLength", photoLength);

    console.log("photos", imagesExtra);

    const handleSelect = (selectedIndex, e) => {
        setIndex(selectedIndex >= photoLength ? 0 : selectedIndex);
    };
    console.log("height", height);
    return (
        <>
        {imagesExtra && (
            <Carousel activeIndex={index} onSelect={handleSelect} indicators={false}>
            {imagesExtra.map((image, idx) => (
                <Carousel.Item key={idx}>
                    <img className="d-block w-100" src={image.src} alt={`Slide ${idx + 1}`} style={{ height: height, objectFit: "cover" }}/>
                </Carousel.Item>
            ))}
            <ol className="carousel-indicators">
                {imagesExtra.map((image, idx) => (
                    <li
                        key={idx}
                        onClick={() => setIndex(idx)}
                        className={idx === index ? "active" : ""}
                    >
                        <img src={image.src} alt={`Slide ${idx + 1}`} />
                    </li>
                ))}
            </ol>
        </Carousel>
        )}
        </>
    );
}

export default CarouselFadeExample;
