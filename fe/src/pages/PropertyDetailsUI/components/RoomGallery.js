import { Divider, Paper, IconButton } from "@mui/material";
import React, { useRef } from "react";
import ArrowRight from '@mui/icons-material/Send';

import ArrowBack from '@mui/icons-material/ArrowBackIosNew';
import ArrowForward from '@mui/icons-material/ArrowForwardIos';

export default function RoomGallery() {
  const galleryRef = useRef(null);

  const images = [
    { id: 1, src: "/image1.png" },
    { id: 2, src: "/image2.png" },
    { id: 3, src: "/image3.png" },
    { id: 4, src: "/image4.png" },
    { id: 5, src: "/image5.png" },
    { id: 6, src: "/image7.png" },
  ];

  const scrollLeft = () => {
    galleryRef.current.scrollBy({ left: -300, behavior: 'smooth' });
  };

  const scrollRight = () => {
    galleryRef.current.scrollBy({ left: 300, behavior: 'smooth' });
  };

  return (
    <Paper className="info-cntr" sx={{ borderRadius: '12px' }}>
      <div className="info-title-cntr">
        <ArrowRight sx={{ color: "#16B4DD" }} />
        <div>Gallery</div>
      </div>
      <Divider sx={{ width: "100%", color: "#ccc" }} />
      <div className="gallery-wrapper">
        <IconButton onClick={scrollLeft} className="scroll-button left">
          <ArrowBack />
        </IconButton>
        <div className="rooms-gallery-cntr" ref={galleryRef}>
          {images.map((image) => (
            <img key={image.id} src={image.src} alt={`Gallery ${image.id}`} className="gallery-image" />
          ))}
        </div>
        <IconButton onClick={scrollRight} className="scroll-button right">
          <ArrowForward />
        </IconButton>
      </div>
    </Paper>
  );
}
