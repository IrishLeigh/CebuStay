import React, { useState } from "react";
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
  ImageList,
  ImageListItem,
  ImageListItemBar,
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

export default function Photos() {
  const [open, setOpen] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [coverPhotos, setCoverPhotos] = useState([
    { id: 1, src: "/image1.png", caption: "Caption 1" },
    { id: 2, src: "/image2.png", caption: "Caption 2" },
    { id: 3, src: "/image3.png", caption: "Caption 3" },
    { id: 4, src: "/image4.png", caption: "Caption 4" },
    { id: 5, src: "/image5.png", caption: "Caption 5" },
  ]);
  const [galleryPhotos, setGalleryPhotos] = useState([
    { id: 1, src: "/image6.png", caption: "Caption 6" },
    { id: 2, src: "/image7.png", caption: "Caption 7" },
  ]);
  const [currentPhotoType, setCurrentPhotoType] = useState("coverPhotos");
  const [isEditingCaption, setIsEditingCaption] = useState(false);
  const [editedCaption, setEditedCaption] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  const images = {
    coverPhotos,
    galleryPhotos,
  };

  const handleClickOpen = (index) => {
    setSelectedImageIndex(index);
    setIsEditingCaption(false);
    setEditedCaption(images[currentPhotoType][index].caption);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleNext = () => {
    setSelectedImageIndex((prevIndex) =>
      prevIndex === images[currentPhotoType].length - 1 ? 0 : prevIndex + 1
    );
    setIsEditingCaption(false);
    setEditedCaption(
      images[currentPhotoType][(selectedImageIndex + 1) % images[currentPhotoType].length].caption
    );
  };

  const handlePrev = () => {
    setSelectedImageIndex((prevIndex) =>
      prevIndex === 0 ? images[currentPhotoType].length - 1 : prevIndex - 1
    );
    setIsEditingCaption(false);
    setEditedCaption(
      images[currentPhotoType][(selectedImageIndex - 1 + images[currentPhotoType].length) % images[currentPhotoType].length].caption
    );
  };

  const handleAddCoverPhotos = (event) => {
    const files = Array.from(event.target.files);
    const newImagesWithCaptions = files.map((file, index) => ({
      id: coverPhotos.length + index + 1,
      src: URL.createObjectURL(file),
      caption: `Caption ${coverPhotos.length + index + 1}`,
    }));

    if (coverPhotos.length + newImagesWithCaptions.length > 5) {
      alert("You can only upload up to 5 cover photos.");
      return;
    }
    setCoverPhotos((prevPhotos) => [...prevPhotos, ...newImagesWithCaptions]);
  };

  const handleAddGalleryPhotos = (event) => {
    const files = Array.from(event.target.files);
    const newImagesWithCaptions = files.map((file, index) => ({
      id: galleryPhotos.length + index + 1,
      src: URL.createObjectURL(file),
      caption: `Caption ${galleryPhotos.length + index + 1}`,
    }));

    if (galleryPhotos.length + newImagesWithCaptions.length > 15) {
      alert("You can only upload up to 15 gallery photos.");
      return;
    }
    setGalleryPhotos((prevPhotos) => [...prevPhotos, ...newImagesWithCaptions]);
  };

  const handleDeleteImage = (index) => {
    const newImages = images[currentPhotoType].filter((_, i) => i !== index);
    if (currentPhotoType === "coverPhotos") {
      setCoverPhotos(newImages);
    } else {
      setGalleryPhotos(newImages);
    }
    setOpen(false);
  };

  const handleCaptionChange = (event) => {
    setEditedCaption(event.target.value);
  };

  const handleSaveCaption = () => {
    const updatedImages = [...images[currentPhotoType]];
    updatedImages[selectedImageIndex].caption = editedCaption;
    if (currentPhotoType === "coverPhotos") {
      setCoverPhotos(updatedImages);
    } else {
      setGalleryPhotos(updatedImages);
    }
    setIsEditingCaption(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  const handlePhotoTypeChange = (type) => {
    setCurrentPhotoType(type);
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "1rem" }}>
        {!isEditing && (
          <Button onClick={() => setIsEditing(true)} sx={{ marginRight: "1rem" }}>
            Edit
          </Button>
        )}
        {isEditing && (
          <Button onClick={handleCancel} sx={{ marginRight: "1rem" }}>
            Cancel
          </Button>
        )}
      </div>
      <Grid container spacing={2}>
        {/* Cover Photos */}
        <Grid item xs={12} sx={{ padding: "1rem" }}>
          <div className="info-title-cntr" onClick={() => handlePhotoTypeChange('coverPhotos')}>
            <ArrowRight sx={{ color: "#16B4DD" }} />
            <div>Cover Photos</div>
          </div>
          <Divider sx={{ width: "100%", color: "#ccc" }} />
          <ImageList variant="masonry" cols={3} gap={8}>
            {coverPhotos.map((image, index) => (
              <ImageListItem key={image.id} onClick={() => handleClickOpen(index)} style={{ position: 'relative', cursor: 'pointer' }}>
                <img
                  src={image.src}
                  alt={`Cover ${image.id}`}
                  style={{ objectFit: 'cover', height: '200px' }}
                />
                {isEditing && (
                  <IconButton
                    onClick={(e) => {
                      e.stopPropagation(); // Prevents the click event from firing on the ImageListItem
                      handleDeleteImage(index);
                    }}
                    sx={{
                      position: 'absolute',
                      top: 8,
                      right: 8,
                      color: 'white',
                      backgroundColor: 'rgba(0, 0, 0, 0.5)',
                      '&:hover': {
                        backgroundColor: 'rgba(0, 0, 0, 0.7)',
                      },
                    }}
                  >
                    <Delete />
                  </IconButton>
                )}
                <ImageListItemBar
                  title={image.caption}
                  position="below"
                />
              </ImageListItem>
            ))}
          </ImageList>
          {isEditing && (
            <div style={{ marginTop: "1rem" }}>
              <input
                accept="image/*"
                style={{ display: "none" }}
                id="upload-cover-button"
                multiple
                type="file"
                onChange={handleAddCoverPhotos}
              />
              <label htmlFor="upload-cover-button">
                <Button
                  variant="contained"
                  color="primary"
                  component="span"
                  startIcon={<AddAPhoto />}
                >
                  Upload Cover Photos
                </Button>
              </label>
            </div>
          )}
        </Grid>

        {/* Gallery Photos */}
        <Grid item xs={12} sx={{ padding: "1rem" }}>
          <div className="info-title-cntr" onClick={() => handlePhotoTypeChange('galleryPhotos')}>
            <ArrowRight sx={{ color: "#16B4DD" }} />
            <div>Gallery</div>
          </div>
          <Divider sx={{ width: "100%", color: "#ccc" }} />
          <ImageList variant="masonry" cols={3} gap={8}>
            {galleryPhotos.map((image, index) => (
              <ImageListItem key={image.id} onClick={() => handleClickOpen(index)} style={{ position: 'relative', cursor: 'pointer' }}>
                <img
                  src={image.src}
                  alt={`Gallery ${image.id}`}
                  style={{ objectFit: 'cover', height: '200px' }}
                />
                {isEditing && (
                  <IconButton
                    onClick={(e) => {
                      e.stopPropagation(); // Prevents the click event from firing on the ImageListItem
                      handleDeleteImage(index);
                    }}
                    sx={{
                      position: 'absolute',
                      top: 8,
                      right: 8,
                      color: 'white',
                      backgroundColor: 'rgba(0, 0, 0, 0.5)',
                      '&:hover': {
                        backgroundColor: 'rgba(0, 0, 0, 0.7)',
                      },
                    }}
                  >
                    <Delete />
                  </IconButton>
                )}
                <ImageListItemBar
                  title={image.caption}
                  position="below"
                />
              </ImageListItem>
            ))}
          </ImageList>
          {isEditing && (
            <div style={{ marginTop: "1rem" }}>
              <input
                accept="image/*"
                style={{ display: "none" }}
                id="upload-gallery-button"
                multiple
                type="file"
                onChange={handleAddGalleryPhotos}
              />
              <label htmlFor="upload-gallery-button">
                <Button
                  variant="contained"
                  color="primary"
                  component="span"
                  startIcon={<AddAPhoto />}
                >
                  Upload Gallery Photos
                </Button>
              </label>
            </div>
          )}
        </Grid>
      </Grid>

      {/* Dialog for editing image */}
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
        <DialogTitle>Edit Image</DialogTitle>
        <DialogContent>
          <Box>
            <img
              src={images[currentPhotoType][selectedImageIndex].src}
              alt={`Edit ${selectedImageIndex}`}
              style={{ width: "100%", height: "auto" }}
            />
            {isEditingCaption && (
              <TextField
                value={editedCaption}
                onChange={handleCaptionChange}
                fullWidth
                margin="normal"
                placeholder="Edit caption"
                autoFocus
              />
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Close
          </Button>
          {isEditingCaption ? (
            <Button onClick={handleSaveCaption} color="primary">
              Save
            </Button>
          ) : (
            <Button onClick={() => setIsEditingCaption(true)} color="primary">
              Edit Caption
            </Button>
          )}
          {isEditingCaption && (
            <Button onClick={() => setIsEditingCaption(false)} color="secondary">
              Cancel
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </div>
  );
}
