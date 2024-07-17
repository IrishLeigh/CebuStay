import React, { useState, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import { Paper, Typography, IconButton, Button } from "@mui/material";
import Grid from "@mui/material/Grid";
import Container from "@mui/material/Container";
import DeleteIcon from "@mui/icons-material/Delete";
import ImageIcon from "@mui/icons-material/Image";
import { Box } from "@mui/material";
import AnimatePage from "./AnimatedPage";


const UploadPhotos = ({ onImagesChange, parentImages, handleNext, handleBack }) => {
  const [selectedImages, setSelectedImages] = useState([]);
  const [errors, setErrors] = useState([]);

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
      if (file.size > 5 * 1024 * 1024) {
        oversizedImages.push(file.name);
        return null;
      }
      return {
        name: file.name,
        url: URL.createObjectURL(file),
      };
    });

    if (oversizedImages.length > 0) {
      setErrors([
        ...errors,
        `Image(s) ${oversizedImages.join(", ")} size cannot exceed 5MB`,
      ]);
    }

    const filteredImages = newImages.filter((image) => image !== null);
    const uniqueImages = filteredImages.slice(0, 5 - selectedImages.length);

    const updatedImages = [...selectedImages, ...uniqueImages];
    setSelectedImages(updatedImages);
  };

  const onDrop = (acceptedFiles) => {
    const newImages = acceptedFiles.slice(0, 5 - selectedImages.length);

    const uniqueImages = newImages
      .filter(
        (file) =>
          !selectedImages.some((selectedFile) => selectedFile.name === file.name)
      )
      .map((file) => ({
        name: file.name,
        url: URL.createObjectURL(file),
      }));

    const updatedImages = [...selectedImages, ...uniqueImages];
    setSelectedImages(updatedImages);
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

  const validateImages = () => {
    const newErrors = [];
    selectedImages.forEach((image) => {
      if (image.size > 5 * 1024 * 1024) {
        newErrors.push(`Image ${image.name} size cannot exceed 5MB`);
      }
    });
    setErrors(newErrors);
    return newErrors.length === 0;
  };

  const handleNextStep = () => {
    if (validateImages()) {
      onImagesChange(selectedImages);
      handleNext();
    }
  };

  return (
    <Box
    >
      <Container maxWidth="lg" className="centered-container">
        <AnimatePage>
          <Grid container spacing={2} justifyContent="center">
            <Grid item xs={12} md={6}>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "left",
                  padding: "1rem",
                  width: "100%",
                  boxSizing: "border-box",
                }}
              >
                <Typography
                  variant="h4"
                  sx={{
                    fontWeight: "bold",
                    marginBottom: "1rem",
                  }}
                  align="left"
                >
                  Upload your photos
                </Typography>
                <Typography align="left">
                  Upload at most 5 photos of your property. The more you upload,
                  the more likely you are to get bookings. You can add more later.
                </Typography>
                <Paper
                  elevation={3}
                  sx={{
                    width: "100%",
                    maxWidth: "32rem",
                    padding: "1rem",
                    marginTop: "2rem",
                    boxSizing: "border-box",
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
                      height: "10rem",
                      marginBottom: "1rem",
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
                        maxHeight: "200px",
                        listStyleType: "none",
                        padding: 0,
                        margin: 0,
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
                          <ImageIcon
                            sx={{ fontSize: 20, paddingRight: 2 }}
                          />
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
                {errors.length > 0 && (
                  <Paper
                    elevation={3}
                    sx={{
                      width: "100%",
                      maxWidth: "32rem",
                      padding: "1rem",
                      marginTop: "2rem",
                      boxSizing: "border-box",
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
        <Button  onClick={handleBack} className="stepperPrevious">
          Back
        </Button>
        <Button  onClick={handleNextStep} className="stepperNext" disabled={selectedImages.length === 0}>
          Next
        </Button>
      </div>
      {/* <Box mt={4} display="flex" justifyContent="space-between">
        <Button variant="contained" onClick={handleBack}>
          Back
        </Button>
        <Button
          variant="contained"
          onClick={handleNextStep}
          disabled={selectedImages.length === 0}
        >
          Next
        </Button>
      </Box> */}
    </Box>
  );
};

export default UploadPhotos;
