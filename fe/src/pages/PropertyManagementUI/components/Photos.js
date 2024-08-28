import React, { useEffect, useState, useRef } from "react";
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
  Paper,
  Typography,
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
  const [openCoverPhotoDialog, setOpenCoverPhotoDialog] = useState(false);
  const [openGalleryPhotoDialog, setOpenGalleryPhotoDialog] = useState(false);
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
  const [hasChanges, setHasChanges] = useState(false);

// Inside your component
const originalData = useRef({
  coverPhotos: [...coverPhotos],
  galleryPhotos: [...galleryPhotos],
});
  useEffect(() => {
    // Check for changes by comparing the current data with the original data
    const hasDataChanged =
      JSON.stringify({ coverPhotos, galleryPhotos }) !==
      JSON.stringify(originalData.current);
    setHasChanges(hasDataChanged);
  }, [coverPhotos, galleryPhotos]);

  const handleClickOpen = (index, type) => {
    setSelectedImageIndex(index);
    setCurrentPhotoType(type);
    setEditedCaption(
      type === "coverPhotos"
        ? coverPhotos[index].caption
        : galleryPhotos[index].caption
    );
    if (type === "coverPhotos") {
      setOpenCoverPhotoDialog(true);
    } else {
      setOpenGalleryPhotoDialog(true);
    }
  };

  const handleClose = () => {
    setOpenCoverPhotoDialog(false);
    setOpenGalleryPhotoDialog(false);
  };

  const handleNext = () => {
    const photos = currentPhotoType === "coverPhotos" ? coverPhotos : galleryPhotos;
    setSelectedImageIndex((prevIndex) =>
      prevIndex === photos.length - 1 ? 0 : prevIndex + 1
    );
    setIsEditingCaption(false);
    setEditedCaption(
      photos[(selectedImageIndex + 1) % photos.length].caption
    );
  };

  const handlePrev = () => {
    const photos = currentPhotoType === "coverPhotos" ? coverPhotos : galleryPhotos;
    setSelectedImageIndex((prevIndex) =>
      prevIndex === 0 ? photos.length - 1 : prevIndex - 1
    );
    setIsEditingCaption(false);
    setEditedCaption(
      photos[(selectedImageIndex - 1 + photos.length) % photos.length].caption
    );
  };

  const handleAddPhotos = (event, type) => {
    const files = Array.from(event.target.files);
    const newImagesWithCaptions = files.map((file, index) => ({
      id: (type === "coverPhotos" ? coverPhotos.length : galleryPhotos.length) + index + 1,
      src: URL.createObjectURL(file),
      caption: `Caption ${(type === "coverPhotos" ? coverPhotos.length : galleryPhotos.length) + index + 1}`,
    }));

    if (type === "coverPhotos" && coverPhotos.length + newImagesWithCaptions.length > 5) {
      alert("You can only upload up to 5 cover photos.");
      return;
    }
    if (type === "galleryPhotos" && galleryPhotos.length + newImagesWithCaptions.length > 15) {
      alert("You can only upload up to 15 gallery photos.");
      return;
    }

    if (type === "coverPhotos") {
      setCoverPhotos((prevPhotos) => [...prevPhotos, ...newImagesWithCaptions]);
    } else {
      setGalleryPhotos((prevPhotos) => [...prevPhotos, ...newImagesWithCaptions]);
    }
  };

  const handleDeleteCoverPhoto = (index) => {
    setCoverPhotos(coverPhotos.filter((_, i) => i !== index));
    handleClose();
  };

  const handleDeleteGalleryPhoto = (index) => {
    setGalleryPhotos(galleryPhotos.filter((_, i) => i !== index));
    handleClose();
  };

  const handleDeleteImage = () => {
    if (currentPhotoType === "coverPhotos") {
      handleDeleteCoverPhoto(selectedImageIndex);
    } else if (currentPhotoType === "galleryPhotos") {
      handleDeleteGalleryPhoto(selectedImageIndex);
    }
  };

  const handleCaptionChange = (event) => {
    setEditedCaption(event.target.value);
  };

  const handleSaveCaption = () => {
    const updatedImages = currentPhotoType === "coverPhotos" ? [...coverPhotos] : [...galleryPhotos];
    updatedImages[selectedImageIndex].caption = editedCaption;
    if (currentPhotoType === "coverPhotos") {
      setCoverPhotos(updatedImages);
    } else {
      setGalleryPhotos(updatedImages);
    }
    setIsEditingCaption(false);
  };

  const handlePhotoTypeChange = (type) => {
    setCurrentPhotoType(type);
  };

  const handleSave = () => {
    setIsEditing(false);
    alert("Photos saved successfully");
  };

  const handleCancel = () => {
    setCoverPhotos(originalData.current.coverPhotos);
    setGalleryPhotos(originalData.current.galleryPhotos);
    setHasChanges(false);
    setIsEditing(false);
  };
  
  const photosToDisplay = currentPhotoType === "coverPhotos" ? coverPhotos : galleryPhotos;

  return (
    <Paper style={{ width: "auto", padding: "4rem", borderRadius: "0.8rem", alignItems: "center" }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "1rem" }}>
        <Typography sx={{ fontFamily: "Poppins, sans-serif", fontSize: "1.125rem" , fontWeight: "bold"}}>
          Photos and Details
        </Typography>
        <div>
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
      </div>
      <Typography sx={{ fontFamily: "Poppins, sans-serif", fontSize: "0.875rem", color: "#6b7280", marginBottom: "2rem" }}>
      Manage your property's cover and gallery photos here. You can add, edit, and delete images, as well as adjust captions. Ensure your photos are up-to-date to attract more guests.
    </Typography>

      <Grid container spacing={2}>
        {/* Cover Photos */}
        <Grid item xs={12} sx={{ padding: "1rem" }}>
          <div className="info-title-cntr" onClick={() => handlePhotoTypeChange('coverPhotos')}>
            <ArrowRight sx={{ color: "#16B4DD" }} />
            <div style={{ fontSize: "1.125rem"}}>Cover Photos</div>
           
          </div>
          <Divider sx={{ width: "100%", color: "#ccc" }} />
          <ImageList variant="masonry" cols={5} gap={5}>
            {coverPhotos.map((image, index) => (
              <ImageListItem key={image.id} onClick={() => handleClickOpen(index, 'coverPhotos')} style={{ position: 'relative', cursor: 'pointer' }}>
                <img
                  src={image.src}
                  alt={`Cover ${image.id}`}
                  style={{ objectFit: 'cover', height: '200px' }}
                />
                {isEditing && (
                  <IconButton
                    onClick={(e) => {
                      e.stopPropagation(); // Prevents the click event from firing on the ImageListItem
                      handleDeleteCoverPhoto(index);
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
                onChange={(e) => handleAddPhotos(e, 'coverPhotos')}
              />
              <label htmlFor="upload-cover-button">
                <Button
                  variant="contained"
                  color="primary"
                  component="span"
                  startIcon={<AddAPhoto />}
                >
                  Add Cover Photos
                </Button>
              </label>
            </div>
          )}
        </Grid>

        {/* Gallery Photos */}
        <Grid item xs={12} sx={{ padding: "1rem" }}>
          <div className="info-title-cntr" onClick={() => handlePhotoTypeChange('galleryPhotos')}>
            <ArrowRight sx={{ color: "#16B4DD" }} />
            <div>Gallery Photos</div>
          </div>
          <Divider sx={{ width: "100%", color: "#ccc" }} />
          <ImageList variant="masonry" cols={5} gap={5}>
            {galleryPhotos.map((image, index) => (
              <ImageListItem key={image.id} onClick={() => handleClickOpen(index, 'galleryPhotos')} style={{ position: 'relative', cursor: 'pointer' }}>
                <img
                  src={image.src}
                  alt={`Gallery ${image.id}`}
                  style={{ objectFit: 'cover', height: '200px' }}
                />
                {isEditing && (
                  <IconButton
                    onClick={(e) => {
                      e.stopPropagation(); // Prevents the click event from firing on the ImageListItem
                      handleDeleteGalleryPhoto(index);
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
                onChange={(e) => handleAddPhotos(e, 'galleryPhotos')}
              />
              <label htmlFor="upload-gallery-button">
                <Button
                  variant="contained"
                  color="primary"
                  component="span"
                  startIcon={<AddAPhoto />}
                >
                  Add Gallery Photos
                </Button>
              </label>
            </div>
          )}
        </Grid>
      </Grid>

      {/* Cover Photo Dialog */}
      <Dialog open={openCoverPhotoDialog} onClose={handleClose}>
        <DialogTitle>Cover Photo</DialogTitle>
        <DialogContent>
          <Box sx={{ position: 'relative' }}>
            <img
              src={coverPhotos[selectedImageIndex]?.src}
              alt={`Selected Cover Photo`}
              style={{ width: '100%', maxHeight: '400px', objectFit: 'cover' }}
            />
            {isEditingCaption && (
              <TextField
                autoFocus
                margin="dense"
                label="Caption"
                type="text"
                fullWidth
                value={editedCaption}
                onChange={handleCaptionChange}
                onBlur={handleSaveCaption}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleSaveCaption();
                  }
                }}
              />
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          {isEditingCaption ? (
            <>
              <Button onClick={handleSaveCaption}>Save</Button>
              <Button onClick={() => setIsEditingCaption(false)}>Cancel</Button>
            </>
          ) : (
            <>
              <Button onClick={handlePrev}>Previous</Button>
              <Button onClick={handleNext}>Next</Button>
              <Button onClick={() => setIsEditingCaption(true)}>Edit Caption</Button>
              <Button onClick={handleDeleteImage}>Delete</Button>
            </>
          )}
          <Button onClick={handleClose}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Gallery Photo Dialog */}
      <Dialog open={openGalleryPhotoDialog} onClose={handleClose}>
        <DialogTitle>Gallery Photo</DialogTitle>
        <DialogContent>
          <Box sx={{ position: 'relative' }}>
            <img
              src={galleryPhotos[selectedImageIndex]?.src}
              alt={`Selected Gallery Photo`}
              style={{ width: '100%', maxHeight: '400px', objectFit: 'cover' }}
            />
            {isEditingCaption && (
              <TextField
                autoFocus
                margin="dense"
                label="Caption"
                type="text"
                fullWidth
                value={editedCaption}
                onChange={handleCaptionChange}
                onBlur={handleSaveCaption}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleSaveCaption();
                  }
                }}
              />
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          {isEditingCaption ? (
            <>
              <Button onClick={handleSaveCaption}>Save</Button>
              <Button onClick={() => setIsEditingCaption(false)}>Cancel</Button>
            </>
          ) : (
            <>
              <Button onClick={handlePrev}>Previous</Button>
              <Button onClick={handleNext}>Next</Button>
              <Button onClick={() => setIsEditingCaption(true)}>Edit Caption</Button>
              <Button onClick={handleDeleteImage}>Delete</Button>
            </>
          )}
          <Button onClick={handleClose}>Close</Button>
        </DialogActions>
      </Dialog>

      {isEditing && (
        <div style={{ marginTop: "1rem" }}>
          <Button onClick={handleCancel} sx={{ marginRight: "1rem" }}>
            Revert Changes
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={handleSave}
            disabled={!hasChanges}
            startIcon={<Save />}
          >
            Save Changes
          </Button>
        </div>
      )}
    </Paper>
  );
}