import React from "react";
import ImageList from "@mui/material/ImageList";
import ImageListItem from "@mui/material/ImageListItem";
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

export default function ImageGallery ({ images }){
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // Calculate rowHeight dynamically based on screen height
  const rowHeight = isMobile ? Math.floor(window.innerHeight / 8) : Math.floor(window.innerHeight / 4);

  return (
    <ImageList
      variant="quilted"
      cols={4}
      rowHeight={rowHeight}
      style={{ width: "100%" }}
    >
      {images.map((image) => (
        <ImageListItem
          key={image.id}
          cols={image.cols || 1}
          rows={image.rows || 1}
        >
          <img
            src={image.src}
            alt={`Property Image ${image.id}`}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        </ImageListItem>
      ))}
    </ImageList>
  );
};
