import React, { useRef, useState, useEffect } from "react";
import {
  Paper,
  IconButton,
  Dialog,
  DialogContent,
  Box,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import ArrowBack from "@mui/icons-material/ArrowBackIosNew";
import ArrowForward from "@mui/icons-material/ArrowForwardIos";
import Close from "@mui/icons-material/Close";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "../css/RoomGallery.css";

export default function RoomGallery({ propertyImages, galleryImages }) {
  const [images, setImages] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const galleryRef = useRef(null);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));
  const isSmallDesktop = useMediaQuery(theme.breakpoints.between("lg"));
  const isLargeScreen = useMediaQuery(theme.breakpoints.up("xl"));

  useEffect(() => {
    if (propertyImages) {
      setImages(propertyImages);
    }
    if (galleryImages) {
      setImages((prevImages) => [...prevImages, ...galleryImages]);
    }
  }, [propertyImages, galleryImages]);

  // Set number of columns based on screen size
  const getCols = () => {
    if (isMobile) return 1;  // Mobile: 1 image per row
    if (isTablet) return 2;  // Tablet: 2 images per row
    return 6;                // Desktop: 6 images per row
  };

  const scrollGallery = (direction) => {
    galleryRef.current.scrollBy({ left: direction === 'left' ? -300 : 300, behavior: "smooth" });
  };

  const handleImageClick = (index) => {
    setCurrentImageIndex(index);
    setOpenDialog(true);
  };
 // Set maxWidth based on screen size
 const getDialogMaxWidth = () => {
 
  if (isLargeScreen) return 'lg';  // For large screens (above 1500px)
  if (isSmallDesktop) return 'md';  // For medium screens (between 600px and 1500px)
 
  if(isMobile) return 'xs';
  if (isTablet) return 'sm';
  if (window.innerWidth < 320) return 'xs';

  return 'md';
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
        '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.7)' },
      }}
    >
      {type === 'next' ? <ArrowForward /> : <ArrowBack />}
    </IconButton>
  );

  const sliderSettings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    initialSlide: currentImageIndex,
    nextArrow: isMobile ? null :<CustomArrow type="next" />,
    prevArrow: isMobile ? null :<CustomArrow type="prev" />,
    backgroundColor: 'black'
  };

  return (
    <Paper sx={{ borderRadius: 2, padding: 2, boxShadow: 3, mt: 2 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <ArrowBack sx={{ color: "#16B4DD", cursor: 'pointer' }} onClick={() => scrollGallery('left')} />
        <Box
        sx={{ flexGrow: 1, overflowX: 'auto', width: '100%', display: 'flex', justifyContent: 'center' }}
        className="scrollmenu" // Ensure the class is applied here
        ref={galleryRef}
      >
          <div style={{ display: 'flex' }}>
            {images.map((image, index) => (
              <div key={index} style={{ padding: '0 4px' }}>
                <img
                  src={image.src} // Use the correct property here
                  alt={`Gallery ${index}`}
                  onClick={() => handleImageClick(index)}
                  style={{
                    width: '250px',  // Adjust the size as needed
                    height: '250px',
                    objectFit: 'cover', // Ensures the image covers the square without distortion
                    borderRadius: 8,
                    cursor: 'pointer',
                  }}
                />
              </div>
            ))}
          </div>
        </Box>
        <ArrowForward sx={{ color: "#16B4DD", cursor: 'pointer' }} onClick={() => scrollGallery('right')} />
      </Box>

      {/* Dialog for full-size image slideshow */}
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <Dialog
          open={openDialog}
          onClose={() => setOpenDialog(false)}
          maxWidth={getDialogMaxWidth()}
         
          sx={{ width : '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' ,}} // Centering dialog
        >
          <DialogContent sx={{ padding: 0, position: 'relative' }}>
            {!isMobile && (
               <IconButton
               onClick={() => setOpenDialog(false)}
               sx={{
                 position: 'absolute',
                 top: 8,
                 right: 8,
                 color: 'white',
                 zIndex: 1,
                 backgroundColor: 'rgba(0, 0, 0, 0.5)',
                 '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.7)' },
               }}
             >
               <Close />
             </IconButton>
              
            )}
           
            <Slider {...sliderSettings}>
              {images.map((image) => (
                <Box key={image.id} sx={{ position: "relative", width: "100%", height: "auto", backgroundColor: "black"  }}>
                  <img
                    className="gallery-image"
                    src={image.src}
                    alt={`Gallery ${image.id}`}
                    style={{
                      width: "100%",
                      height: "auto",
                      objectFit: "contain",
                      aspectRatio: isMobile ? '4/5' : '16/9',  // Adjust aspect ratio dynamically
                      borderRadius: 8,
                    }}
                  />
                  <Box
                    sx={{
                      position: "absolute",
                      top: 16,
                      left: isMobile ? 20 : 16,
                      backgroundColor: "rgba(0, 0, 0, 0.6)",
                      padding: "8px 16px",
                      borderRadius: 4,
                      color: "white",
                      fontSize: "0.875rem",
                    }}
                  >
                    {image.caption}
                  </Box>
                </Box>
              ))}
            </Slider>
          </DialogContent>
        </Dialog>
      </Box>
    </Paper>
  );
}
