import React, { useRef, useState, useEffect } from "react";
import {
  Paper,
  IconButton,
  Dialog,
  DialogContent,
  Box,
  ImageList,
  ImageListItem,
  useMediaQuery,
  useTheme,
} from "@mui/material";
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

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));

  useEffect(() => {
    if (propertyImages) {
      setPropertyImages(propertyImages);
    }
  }, [propertyImages]);

  const scrollGallery = (direction) => {
    galleryRef.current.scrollBy({ left: direction === 'left' ? -300 : 300, behavior: "smooth" });
  };

  const handleImageClick = (index) => {
    setCurrentImageIndex(index);
    setOpenDialog(true);
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
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    initialSlide: currentImageIndex,
    nextArrow: <CustomArrow type="next" />,
    prevArrow: <CustomArrow type="prev" />,
  };

  // Set number of columns based on screen size
  const getCols = () => {
    if (isMobile) return 1;  // Mobile: 1 image per row
    if (isTablet) return 2;  // Tablet: 2 images per row
    return 3;                // Desktop: 3 images per row
  };

  return (
    <Paper sx={{ borderRadius: 2, padding: 2, boxShadow: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: 2 }}>
        <ArrowBack sx={{ color: "#16B4DD", cursor: 'pointer' }} onClick={() => scrollGallery('left')} />
        <Box sx={{ flexGrow: 1, overflowX: 'auto' }} ref={galleryRef}>
          <ImageList cols={getCols()} gap={8} sx={{ display: 'flex', justifyContent: 'center' }}>
            {images.map((image, index) => (
              <ImageListItem key={image.id} sx={{ width: "100%", height: "auto" }}>
                <img
                  src={image.src}
                  alt={`Gallery ${image.id}`}
                  onClick={() => handleImageClick(index)}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    cursor: 'pointer',
                    borderRadius: 8,
                    transition: 'transform 0.2s ease-in-out',
                    '&:hover': { transform: 'scale(2.02)' },
                  }}
                />
              </ImageListItem>
            ))}
          </ImageList>
        </Box>
        <ArrowForward sx={{ color: "#16B4DD", cursor: 'pointer' }} onClick={() => scrollGallery('right')} />
      </Box>

      {/* Dialog for full-size image slideshow */}
      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        maxWidth="md"
        fullWidth
        sx={{ padding: 0 }}
      >
        <DialogContent sx={{ padding: 0, position: 'relative' }}>
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
          <Slider {...sliderSettings}>
            {images.map((image) => (
              <Box key={image.id} sx={{ position: "relative", width: "100%", height: "auto" }}>
                <img
                  src={image.src}
                  alt={`Gallery ${image.id}`}
                  style={{
                    width: "100%",
                    height: "auto",
                    objectFit: "contain",
                    aspectRatio: "16/9",
                    borderRadius: 8,
                  }}
                />
                <Box
                  sx={{
                    position: "absolute",
                    bottom: 16,
                    left: 16,
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
    </Paper>
  );
}
