import React, { useState } from "react";
import { useDropzone } from "react-dropzone";
import { Paper, Typography, IconButton, Button } from "@mui/material";
import Grid from "@mui/material/Grid";
import Container from "@mui/material/Container";
import DeleteIcon from "@mui/icons-material/Delete";
import ImageIcon from "@mui/icons-material/Image";

const AccommodationUploadPhotos = () => {
  const [selectedImages, setSelectedImages] = useState([]);

  const handleImageChange = (event) => {
    const imageFiles = event.target.files;
    if (!imageFiles) return; // No images selected

    // Basic image size validation (optional)
    const oversizedImages = [];
    for (let i = 0; i < imageFiles.length; i++) {
      if (imageFiles[i].size > 1000 * 1000) {
        oversizedImages.push(imageFiles[i].name);
      }
    }
    if (oversizedImages.length > 0) {
      alert(`Image(s) ${oversizedImages.join(", ")} size cannot exceed 5MB`);
      return;
    }

    // Limit upload to 5 images
    const newImages = Array.from(imageFiles).slice(
      0,
      5 - selectedImages.length
    );

    // Filter out already selected images with the same name
    const uniqueImages = newImages.filter(
      (file) =>
        !selectedImages.some((selectedFile) => selectedFile.name === file.name)
    );

    setSelectedImages([...selectedImages, ...uniqueImages]);
  };

  const onDrop = (acceptedFiles) => {
    // Limit upload to 5 images
    const newImages = acceptedFiles.slice(0, 5 - selectedImages.length);

    // Filter out already selected images with the same name
    const uniqueImages = newImages.filter(
      (file) =>
        !selectedImages.some((selectedFile) => selectedFile.name === file.name)
    );

    setSelectedImages([...selectedImages, ...uniqueImages]);
  };

  const handleDeleteImage = (index) => {
    const updatedImages = [...selectedImages];
    updatedImages.splice(index, 1);
    setSelectedImages(updatedImages);
  };

  const handleDeleteAllImages = () => {
    setSelectedImages([]);
  };

  const { getRootProps, getInputProps } = useDropzone({
    accept: "image/*",
    onDrop,
  });

  const handleUpload = () => {
    // Handle upload functionality here
    console.log("Upload clicked");
  };

  return (
    <Container
      maxWidth="md"
      sx={{
        display: "flex",
        flexDirection: "column",
        marginTop: "2rem",
      }}
    >
      <Typography
        sx={{
          fontWeight: "bold",
          fontSize: "2rem",
          textAlign: "left",
          marginTop: "2rem",
        }}
      >
        Upload your photos
      </Typography>
      <Typography sx={{ fontSize: "1.3rem", textAlign: "left" }}>
        Upload at most 5 photos of your property. The more you upload, the more
        likely you are to get bookings. You can add more later.
      </Typography>
      <Grid container spacing={2}>
        <Paper
          elevation={3}
          sx={{
            height: "540px",
            width: "100%",
            padding: 3,
            marginTop: "2rem",
            position: "relative",
            marginLeft: "1rem",
          }}
        >
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
            {selectedImages.length === 0 ? (
              <>
                <input
                  {...getInputProps()}
                  onChange={handleImageChange}
                  multiple
                  style={{ display: "none" }}
                />
                <Typography variant="body1" align="center">
                  <ImageIcon sx={{ fontSize: 50 }} />
                  <br />
                  Drag & drop images here, or click to select
                </Typography>
              </>
            ) : (
              <Typography variant="body1" align="center">
                Drag & drop images here, or click to select
              </Typography>
            )}
          </div>

          <>
            <Typography align="left">Uploaded Files:</Typography>
            <ul
              style={{
                overflowY: "auto",
                maxHeight: "calc(100% - 150px)",
                listStyleType: "none",
                padding: 0,
              }}
            >
              {selectedImages.map((image, index) => (
                <li
                  key={index}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginBottom: "0.5rem",
                  }}
                >
                  <ImageIcon sx={{ fontSize: 20, paddingRight: 2 }} />
                  <Typography>{image.name}</Typography>
                  <IconButton
                    aria-label="delete"
                    onClick={() => handleDeleteImage(index)}
                    sx={{
                      marginLeft: "auto",
                      color: "red",
                    }}
                  >
                    <DeleteIcon />
                  </IconButton>
                </li>
              ))}
            </ul>
          </>
          <Button
            variant="contained"
            color="primary"
            onClick={handleUpload}
            style={{ marginTop: "5px" }}
            sx={{
              position: "absolute",
              bottom: "10px",
              right: "10px",
              marginRight: "17px",
            }}
          >
            Upload
          </Button>
        </Paper>
      </Grid>
    </Container>
  );
};

export default AccommodationUploadPhotos;
