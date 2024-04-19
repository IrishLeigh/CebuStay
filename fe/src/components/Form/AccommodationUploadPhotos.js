import React, { useState } from "react";
import { useDropzone } from "react-dropzone";
import { Paper, Typography } from "@mui/material";
import { ImageList, ImageListItem } from "@mui/material";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";

const AccommodationUploadPhotos = () => {
  const [selectedImages, setSelectedImages] = useState([]);

  const handleImageChange = (event) => {
    const imageFiles = event.target.files;
    if (!imageFiles) return; // No images selected

    // Basic image size validation (optional)
    const oversizedImages = [];
    for (let i = 0; i < imageFiles.length; i++) {
      if (imageFiles[i].size > 1024 * 1024 * 5) {
        oversizedImages.push(imageFiles[i].name);
      }
    }
    if (oversizedImages.length > 0) {
      alert(`Image(s) ${oversizedImages.join(", ")} size cannot exceed 5MB`);
      return;
    }

    setSelectedImages([...selectedImages, ...imageFiles]);
  };

  const onDrop = (acceptedFiles) => {
    // Handle dropped images here
    setSelectedImages([...selectedImages, ...acceptedFiles]);
  };

  const { getRootProps, getInputProps } = useDropzone({
    accept: "image/*",
    onDrop,
  });

  return (
    <Box
      sx={{
        height: "90vh",
      }}
    >
      <Grid
        container
        spacing={2}
        sx={{
          height: "100%",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Grid item xs={6} sx={{ textAlign: "left" }}>
          <Typography variant="h4">Upload your photos</Typography>
          <Typography variant="body1" sx={{ fontSize: 18 }}>
            Upload at least 5 photos of your property. The more you upload, the
            more likely you are to get bookings. You can add more later.
          </Typography>
          <Paper elevation={3} sx={{ height: "500px", padding: 3 }}>
            <div
              {...getRootProps()}
              style={{
                border: "2px dashed #ccc",
                padding: "30px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: "calc(100% - 60px)",
                height: "30%",
              }}
            >
              {selectedImages.length === 0 && (
                <>
                  <input
                    {...getInputProps()}
                    onChange={handleImageChange}
                    multiple
                    style={{ display: "none" }}
                  />
                  <Typography variant="body1" align="center">
                    <img
                      src="upload.png"
                      alt="Drag & drop or browse"
                      style={{ width: "40px", height: "50px" }}
                    />
                    <br />
                    Drag & drop images here, or click to select
                  </Typography>
                </>
              )}
            </div>
            <ImageList sx={{ paddingTop: 0 }} rowHeight={160} cols={4} gap={1}>
              {selectedImages.map((image, index) => (
                <ImageListItem key={index}>
                  <img
                    src={URL.createObjectURL(image)}
                    alt={`Selected ${index + 1}`}
                    style={{ width: "80%" }}
                  />
                </ImageListItem>
              ))}
            </ImageList>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AccommodationUploadPhotos;
