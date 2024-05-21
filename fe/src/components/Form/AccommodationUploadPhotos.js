import React, { useState, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import { Paper, Typography, IconButton } from "@mui/material";
import Grid from "@mui/material/Grid";
import Container from "@mui/material/Container";
import DeleteIcon from "@mui/icons-material/Delete";
import ImageIcon from "@mui/icons-material/Image";
import { Box } from "@mui/material";

const AccommodationUploadPhotos = ({ onImagesChange }) => {
  const [selectedImages, setSelectedImages] = useState([]);

  // Load images from local storage on component mount
  useEffect(() => {
    const savedImages = JSON.parse(localStorage.getItem("selectedImages")) || [];
    setSelectedImages(savedImages);
  }, []);

  const handleImageChange = (event) => {
    const imageFiles = event.target.files;
    if (!imageFiles) return;

    const oversizedImages = [];
    const newImages = Array.from(imageFiles).map((file) => {
      if (file.size > 1000 * 1000) {
        oversizedImages.push(file.name);
        return null;
      }
      return {
        name: file.name,
        url: URL.createObjectURL(file),
      };
    });
    if (oversizedImages.length > 0) {
      alert(`Image(s) ${oversizedImages.join(", ")} size cannot exceed 5MB`);
    }

    const filteredImages = newImages.filter((image) => image !== null);
    const uniqueImages = filteredImages.slice(0, 5 - selectedImages.length);

    const updatedImages = [...selectedImages, ...uniqueImages];
    setSelectedImages(updatedImages);
    localStorage.setItem("selectedImages", JSON.stringify(updatedImages));
  };

  const onDrop = (acceptedFiles) => {
    const newImages = acceptedFiles.slice(0, 5 - selectedImages.length);

    const uniqueImages = newImages.filter(
      (file) =>
        !selectedImages.some((selectedFile) => selectedFile.name === file.name)
    ).map((file) => ({
      name: file.name,
      url: URL.createObjectURL(file),
    }));

    const updatedImages = [...selectedImages, ...uniqueImages];
    setSelectedImages(updatedImages);
    localStorage.setItem("selectedImages", JSON.stringify(updatedImages));
  };

  const handleDeleteImage = (index) => {
    const updatedImages = [...selectedImages];
    updatedImages.splice(index, 1);
    setSelectedImages(updatedImages);
    localStorage.setItem("selectedImages", JSON.stringify(updatedImages));
  };

  const handleDeleteAllImages = () => {
    setSelectedImages([]);
    localStorage.removeItem("selectedImages");
  };

  const { getRootProps, getInputProps } = useDropzone({
    accept: "image/*",
    onDrop,
  });

  useEffect(() => {
    onImagesChange(selectedImages);
  }, [selectedImages, onImagesChange]);

  return (
    <Box>
      <Container maxWidth="lg">
        <Grid container spacing={2} justifyContent="center">
          <Grid item xs={12} md={6}>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "left",
                minHeight: "100vh",
                padding: "1rem",
                mt: -2,
                mb: 12,
              }}
            >
              <Typography
                variant="h4"
                sx={{
                  fontWeight: "bold",
                  marginBottom: "1rem",
                }}
              >
                Upload your photos
              </Typography>
              <Typography>
                Upload at most 5 photos of your property. The more you upload, the
                more likely you are to get bookings. You can add more later.
              </Typography>
              <Paper
                elevation={3}
                sx={{
                  height: "auto",
                  padding: 3,
                  marginTop: "2rem",
                  position: "relative",
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
                  <Typography variant="h6">Uploaded Files:</Typography>
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
              </Paper>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default AccommodationUploadPhotos;
