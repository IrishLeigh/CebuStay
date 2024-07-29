import React, { useState, useRef } from "react";
import {
  Grid,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Divider,
  Box,
  TextField,
  Tooltip,
} from "@mui/material";
import {
  ArrowBack,
  ArrowForward,
  Close,
  Delete,
  AddAPhoto,
  Edit,
  Save,
  ArrowRight,
} from "@mui/icons-material";

export default function Photos({ isEditing }) {
  const galleryRef = useRef(null);
  const [open, setOpen] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [images, setImages] = useState([
    { id: 1, src: "/image1.png", caption: "Caption 1" },
    { id: 2, src: "/image2.png", caption: "Caption 2" },
    { id: 3, src: "/image3.png", caption: "Caption 3" },
    { id: 4, src: "/image4.png", caption: "Caption 4" },
    { id: 5, src: "/image5.png", caption: "Caption 5" },
    { id: 6, src: "/image6.png", caption: "Caption 6" },
  ]);
  const [isEditingCaption, setIsEditingCaption] = useState(false);
  const [editedCaption, setEditedCaption] = useState("");

  const scrollLeft = () => {
    galleryRef.current.scrollBy({ left: -300, behavior: "smooth" });
  };

  const scrollRight = () => {
    galleryRef.current.scrollBy({ left: 300, behavior: "smooth" });
  };

  const handleClickOpen = (index) => {
    setSelectedImageIndex(index);
    setIsEditingCaption(false);
    setEditedCaption(images[index].caption);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleNext = () => {
    setSelectedImageIndex((prevIndex) =>
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
    setIsEditingCaption(false);
    setEditedCaption(images[(selectedImageIndex + 1) % images.length].caption);
  };

  const handlePrev = () => {
    setSelectedImageIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
    setIsEditingCaption(false);
    setEditedCaption(
      images[(selectedImageIndex - 1 + images.length) % images.length].caption
    );
  };

  const handleAddImages = (event) => {
    const files = Array.from(event.target.files);
    const newImagesWithCaptions = files.map((file, index) => ({
      id: images.length + index + 1,
      src: URL.createObjectURL(file),
      caption: `Caption ${images.length + index + 1}`,
    }));
    setImages((prevImages) => {
      if (prevImages.length + newImagesWithCaptions.length > 5) {
        alert("You can only upload up to 5 cover photos.");
        return prevImages;
      }
      return [...prevImages, ...newImagesWithCaptions];
    });
  };

  const handleDeleteImage = (index) => {
    const newImages = images.filter((_, i) => i !== index);
    setImages(newImages);
    setOpen(false);
  };

  const handleCaptionChange = (event) => {
    setEditedCaption(event.target.value);
  };

  const handleSaveCaption = () => {
    const newImages = [...images];
    newImages[selectedImageIndex].caption = editedCaption;
    setImages(newImages);
    setIsEditingCaption(false);
  };

  return (
    <div>
      <Grid container spacing={2}>
        <Grid item xs={12} sx={{ padding: "1rem" }}>
          <div className="info-title-cntr">
            <ArrowRight sx={{ color: "#16B4DD" }} />
            <div>Cover Photos</div>
          </div>
          <Divider sx={{ width: "100%", color: "#ccc" }} />
          <div className="gallery-wrapper">
            <IconButton onClick={scrollLeft} className="scroll-button left">
              <ArrowBack />
            </IconButton>
            <div className="rooms-gallery-cntr" ref={galleryRef}>
              {images.map((image, index) => (
                <img
                  key={image.id}
                  src={image.src}
                  alt={`Gallery ${image.id}`}
                  className="gallery-image"
                  onClick={() => handleClickOpen(index)}
                />
              ))}
            </div>
            <IconButton onClick={scrollRight} className="scroll-button right">
              <ArrowForward />
            </IconButton>
          </div>
          {isEditing && (
            <div style={{ marginTop: "1rem" }}>
              <input
                accept="image/*"
                style={{ display: "none" }}
                id="upload-button"
                multiple
                type="file"
                onChange={handleAddImages}
              />
              <label htmlFor="upload-button">
                <Button
                  variant="contained"
                  color="primary"
                  component="span"
                  startIcon={<AddAPhoto />}
                >
                  Upload Photos
                </Button>
              </label>
            </div>
          )}
        </Grid>
        <Grid item xs={12} sx={{ padding: "1rem" }}>
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
              {images.map((image, index) => (
                <img
                  key={image.id}
                  src={image.src}
                  alt={`Gallery ${image.id}`}
                  className="gallery-image"
                  onClick={() => handleClickOpen(index)}
                />
              ))}
            </div>
            <IconButton onClick={scrollRight} className="scroll-button right">
              <ArrowForward />
            </IconButton>
          </div>
          {isEditing && (
            <div style={{ marginTop: "1rem" }}>
              <input
                accept="image/*"
                style={{ display: "none" }}
                id="upload-button"
                multiple
                type="file"
                onChange={handleAddImages}
              />
              <label htmlFor="upload-button">
                <Button
                  variant="contained"
                  color="primary"
                  component="span"
                  startIcon={<AddAPhoto />}
                >
                  Upload Photos
                </Button>
              </label>
            </div>
          )}
        </Grid>
      </Grid>

      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth sx={{ overflowX: "hidden" }}>
        <DialogTitle>
          Image {selectedImageIndex + 1}
          <IconButton
            edge="end"
            color="inherit"
            onClick={handleClose}
            aria-label="close"
            sx={{ position: "absolute", right: 8, top: 8 }}
          >
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <img
            src={images[selectedImageIndex].src}
            alt={`Gallery ${images[selectedImageIndex].id}`}
            style={{ width: "100%", maxHeight: "70vh", objectFit: "contain" }}
          />
          {isEditingCaption ? (
            <TextField
              fullWidth
              value={editedCaption}
              onChange={handleCaptionChange}
              variant="outlined"
              sx={{ marginTop: "1rem" }}
            />
          ) : (
            <Box
              sx={{
                marginTop: "1rem",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Box>{images[selectedImageIndex].caption}</Box>
              <Tooltip title="Edit Caption">
                <IconButton onClick={() => setIsEditingCaption(true)}>
                  <Edit />
                </IconButton>
              </Tooltip>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <IconButton onClick={handlePrev}>
            <ArrowBack />
          </IconButton>
          <IconButton onClick={handleNext}>
            <ArrowForward />
          </IconButton>
          {isEditingCaption && (
            <Button
              onClick={handleSaveCaption}
              variant="contained"
              color="primary"
              startIcon={<Save />}
            >
              Save
            </Button>
          )}
          {isEditing && (
            <Button
              onClick={() => handleDeleteImage(selectedImageIndex)}
              variant="contained"
              color="secondary"
              startIcon={<Delete />}
            >
              Delete
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </div>
  );
}
