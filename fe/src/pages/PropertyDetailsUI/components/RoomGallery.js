import React, { useRef, useState, useEffect } from "react";
import { Paper, IconButton, Dialog, DialogContent, Box, ImageList, ImageListItem } from "@mui/material";
import ArrowBack from "@mui/icons-material/ArrowBackIosNew";
import ArrowForward from "@mui/icons-material/ArrowForwardIos";
import Close from "@mui/icons-material/Close";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

export default function RoomGallery({ propertyImages }) {
  const [images, setPropertyImages] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const galleryRef = useRef(null);

  useEffect(() => {
    setPropertyImages(propertyImages);
  }, [propertyImages]);

  const scrollLeft = () => {
    galleryRef.current.scrollBy({ left: -300, behavior: "smooth" });
  };

  const scrollRight = () => {
    galleryRef.current.scrollBy({ left: 300, behavior: "smooth" });
  };

  const handleImageClick = (index) => {
    setCurrentImageIndex(index);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };
  const CustomArrow = ({ type, onClick }) => (
    <IconButton
      onClick={onClick}
      sx={{
        position: 'absolute',
        top: '50%',
        [type === 'next' ? 'right' : 'left']: 0,
        zIndex: 1,
        color: 'white',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        borderRadius: '50%',
        '&:hover': {
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
        },
      }}
    >
      {type === 'next' ? <ArrowForward /> : <ArrowBack />}
    </IconButton>
  );

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    initialSlide: currentImageIndex,
    arrows: true, // Show navigation arrows
    nextArrow: <CustomArrow type="next" />,
    prevArrow: <CustomArrow type="prev" />,
  };

 

  return (
    <Paper sx={{ borderRadius: "12px", padding: 2 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: 2 }}>
        <ArrowBack sx={{ color: "#16B4DD", cursor: 'pointer' }} onClick={scrollLeft} />
        <Box sx={{ flexGrow: 1, overflowX: 'auto' }} ref={galleryRef}>
          <ImageList cols={images.length} sx={{ display: 'flex' }}>
            {images.map((image, index) => (
              <ImageListItem key={image.id} sx={{ width: 300, height: 200 }}>
                <img
                  src={image.src}
                  alt={`Gallery ${image.id}`}
                  onClick={() => handleImageClick(index)}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', cursor: 'pointer' }}
                />
              </ImageListItem>
            ))}
          </ImageList>
        </Box>
        <ArrowForward sx={{ color: "#16B4DD", cursor: 'pointer' }} onClick={scrollRight} />
      </Box>

      {/* Dialog for full-size image with carousel */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
        sx={{ padding: 0 }}
      >
        <DialogContent sx={{ padding: 0, position: 'relative' }}>
          <IconButton
            onClick={handleCloseDialog}
            sx={{
              position: 'absolute',
              top: 8,
              right: 8,
              color: 'white',
              zIndex: 1
            }}
          >
            <Close />
          </IconButton>
          <Slider {...settings} >
            {images.map((image) => (
              <div key={image.id}>
                <img
                  src={image.src}
                  style={{ width: "100%", objectFit: "cover" }}
                
                />
              </div>
            ))}
          </Slider>
        </DialogContent>
      </Dialog>
    </Paper>
  );
}
