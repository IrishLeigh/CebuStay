import React, { useState, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import { Paper, Typography, IconButton, Button, Box, Grid, Container, Card, CardMedia, Snackbar, Alert, useTheme, useMediaQuery } from "@mui/material";
import { Delete as DeleteIcon, Image as ImageIcon } from "@mui/icons-material";
import AnimatePage from "./AnimatedPage";

const UploadPhotos = ({ onImagesChange, parentImages, handleNext, handleBack }) => {
  const [selectedImages, setSelectedImages] = useState([]);
  const [errors, setErrors] = useState([]);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md')); // Check if the screen size is mobile

  useEffect(() => {
    window.scrollTo(0, 0);
    if (parentImages && parentImages.length > 0) {
      setSelectedImages(parentImages);
    }
  }, [parentImages]);

  const handleImageChange = (event) => {
    const imageFiles = event.target.files;
    if (!imageFiles) return;

    const oversizedImages = [];
    const newImages = Array.from(imageFiles).map((file) => {
      // Adjust the size limit to 2MB (2 * 1024 * 1024 bytes)
      if (file.size > 2 * 1024 * 1024) {
        oversizedImages.push(file.name);
        return null;
      }
      return {
        name: file.name,
        url: URL.createObjectURL(file),
        size: file.size,
      };
    });

    if (oversizedImages.length > 0) {
      setSnackbarMessage(`The following image(s) exceed the 2MB size limit: ${oversizedImages.join(", ")}`);
      setSnackbarOpen(true);
    }

    const validImages = newImages.filter((image) => image !== null);
    const totalImages = validImages.length + selectedImages.length;

    if (totalImages > 5) {
      setSnackbarMessage("You can only upload a maximum of 5 images.");
      setSnackbarOpen(true);
      return;
    }

    const imagesToAdd = validImages.slice(0, 5 - selectedImages.length);
    setSelectedImages((prevImages) => [...prevImages, ...imagesToAdd]);
  };

  const onDrop = (acceptedFiles) => {
    const newImages = acceptedFiles
      .filter(
        (file) => !selectedImages.some((selected) => selected.name === file.name)
      )
      .map((file) => ({
        name: file.name,
        url: URL.createObjectURL(file),
        size: file.size,
      }));

    const totalImages = newImages.length + selectedImages.length;

    if (totalImages > 5) {
      setSnackbarMessage("You can only upload a maximum of 5 images.");
      setSnackbarOpen(true);
      return;
    }

    const imagesToAdd = newImages.slice(0, 5 - selectedImages.length);
    setSelectedImages((prevImages) => [...prevImages, ...imagesToAdd]);
  };

  const handleDeleteImage = (index) => {
    setSelectedImages((prevImages) => prevImages.filter((_, i) => i !== index));
  };

  const { getRootProps, getInputProps } = useDropzone({
    accept: "image/*",
    onDrop,
  });

  const validateImages = () => {
    const validationErrors = selectedImages
      .filter((image) => image.size > 5 * 1024 * 1024)
      .map((image) => `Image "${image.name}" exceeds the 5MB size limit.`);

    setErrors(validationErrors);
    return validationErrors.length === 0;
  };

  const handleNextStep = () => {
    // Check if there are exactly 5 images
    if (selectedImages.length !== 5) {
      setSnackbarMessage("Please upload exactly 5 images.");
      setSnackbarOpen(true);
      return;
    }

    // Validate image sizes
    if (validateImages()) {
      onImagesChange(selectedImages);
      handleNext();
    } else {
      setSnackbarMessage("Please ensure all images are under the 5MB size limit.");
      setSnackbarOpen(true);
    }
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  return (
    <Box >
      <Container maxWidth="md" className="centered-container">
        <AnimatePage>
          <Grid container justifyContent="center">
            <Grid item xs={12} md={12}>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-start",
                  padding: "1rem",
                }}
              >
                <Paper
                  elevation={3}
                  sx={{
                    padding: isMobile ? "1rem" : "2rem", // No padding for mobile
                    width: "100%",
                    borderRadius: "0.8rem",
                   
                  }}
                >
                  <Typography variant="h4" sx={{ fontWeight: "bold", marginBottom: "1rem" }}>
                    Upload Up to 5 Stunning Cover Photos
                  </Typography>
                  {/* Conditionally render Typography based on isMobile */}
                  {!isMobile && (
                    <Typography
                      sx={{
                        marginBottom: "1rem",
                        color: '#333',
                        lineHeight: 1.5,
                        fontFamily: "Poppins, sans-serif",
                        fontSize: "1.125rem"
                      }}
                    >
                      Showcase the best features of your property with high-quality images. These photos will be the first thing guests see, so make sure they highlight what makes your place special. You can always add more room photos later. Let your property shine and attract guests with captivating visuals!
                    </Typography>
                  )}
                  <div
                    {...getRootProps()}
                    style={{
                      border: "2px dashed #ccc",
                      padding: "30px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      height: "10rem",
                      marginBottom: "1rem",
                    }}
                  >
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
                  </div>
                  <Typography variant="h6">Uploaded Files:</Typography>
                  <Grid container spacing={2}>
                    {selectedImages.map((image, index) => (
                      <Grid item xs={6} sm={4} md={3} key={index}>
                        <Card sx={{ position: 'relative' }}>
                          <CardMedia
                            component="img"
                            alt={image.name}
                            height="140"
                            image={image.url}
                          />
                          <IconButton
                            aria-label="delete"
                            onClick={() => handleDeleteImage(index)}
                            sx={{
                              position: 'absolute',
                              top: 8,
                              right: 8,
                              color: 'red',
                              backgroundColor: 'rgba(255, 255, 255, 0.7)',
                            }}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Card>
                      </Grid>
                    ))}
                  </Grid>
                </Paper>
                {errors.length > 0 && (
                  <Paper
                    elevation={3}
                    sx={{
                      padding: "1rem",
                      marginTop: "2rem",
                      backgroundColor: "#f8d7da",
                      borderColor: "#f5c6cb",
                      color: "#721c24",
                    }}
                  >
                    {errors.map((error, index) => (
                      <Typography key={index} variant="body1">
                        {error}
                      </Typography>
                    ))}
                  </Paper>
                )}
              </Box>
            </Grid>
          </Grid>
        </AnimatePage>
      </Container>
      <div className="stepperFooter">
        <Button onClick={handleBack} className="stepperPrevious" sx={{ backgroundColor: '#6c757d', color: '#fff' }}>
          Back
        </Button>
        <Button onClick={handleNextStep} className="stepperNext">
          Next
        </Button>
      </div>

      {/* <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleSnackbarClose}>
        <Alert onClose={handleSnackbarClose} severity="warning" sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar> */}
      <Snackbar
        open={snackbarOpen}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        autoHideDuration={3000}
      >
        <Alert onClose={handleSnackbarClose} severity="error" sx={{ width: '100%' }}>
        {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default UploadPhotos;
