import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
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

export default function Photos({
  isSingleUnit,
  propertyImages,
  propertyid,
  galleryImages,
  setCoverP,
  setGalleryP,
}) {
  const [openCoverPhotoDialog, setOpenCoverPhotoDialog] = useState(false);
  const [openGalleryPhotoDialog, setOpenGalleryPhotoDialog] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [coverPhotos, setCoverPhotos] = useState(propertyImages || []);
  const [toDeleteCP, setToDeleteCP] = useState([]);
  const [toAddCP, setToAddCP] = useState([]);
  const [toDeleteGP, setToDeleteGP] = useState([]);
  const [toAddGP, setToAddGP] = useState([]);
  // const [coverPhotos, setCoverPhotos] = useState([
  //   { id: 1, src: "/image1.png", caption: "Caption 1" },
  //   { id: 2, src: "/image2.png", caption: "Caption 2" },
  //   { id: 3, src: "/image3.png", caption: "Caption 3" },
  //   { id: 4, src: "/image4.png", caption: "Caption 4" },
  //   { id: 5, src: "/image5.png", caption: "Caption 5" },
  // ]);
  const [galleryPhotos, setGalleryPhotos] = useState(galleryImages || []);
  // const [galleryPhotos, setGalleryPhotos] = useState([
  //   { id: 1, src: "/image6.png", caption: "Caption 6" },
  //   { id: 2, src: "/image7.png", caption: "Caption 7" },
  // ]);
  const [currentPhotoType, setCurrentPhotoType] = useState("coverPhotos");
  const [isEditingCaption, setIsEditingCaption] = useState(false);
  const [editedCaption, setEditedCaption] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  useEffect(() => {
    setCoverP(coverPhotos);
    setGalleryP(galleryPhotos);
  }, [coverPhotos, galleryPhotos]);
  // Inside your component
  const originalData = useRef({
    coverPhotos: [...coverPhotos],
    galleryPhotos: [...galleryPhotos],
  });
  // useEffect(() => {
  //   setCoverPhotos(propertyImages);
  // }, [propertyImages]);
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
    const photos =
      currentPhotoType === "coverPhotos" ? coverPhotos : galleryPhotos;
    setSelectedImageIndex((prevIndex) =>
      prevIndex === photos.length - 1 ? 0 : prevIndex + 1
    );
    setIsEditingCaption(false);
    setEditedCaption(photos[(selectedImageIndex + 1) % photos.length].caption);
  };

  const handlePrev = () => {
    const photos =
      currentPhotoType === "coverPhotos" ? coverPhotos : galleryPhotos;
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
      id:
        (type === "coverPhotos" ? coverPhotos.length : galleryPhotos.length) +
        index +
        1,
      src: URL.createObjectURL(file),
      caption: "",
    }));

    if (
      type === "coverPhotos" &&
      coverPhotos.length + newImagesWithCaptions.length > 5
    ) {
      alert("You can only upload up to 5 cover photos.");
      return;
    }
    if (
      type === "galleryPhotos" &&
      galleryPhotos.length + newImagesWithCaptions.length > 15
    ) {
      alert("You can only upload up to 15 gallery photos.");
      return;
    }

    if (type === "coverPhotos") {
      setCoverPhotos((prevPhotos) => [...prevPhotos, ...newImagesWithCaptions]);
      setToAddCP([...toAddCP, ...newImagesWithCaptions]);
    } else {
      setGalleryPhotos((prevPhotos) => [
        ...prevPhotos,
        ...newImagesWithCaptions,
      ]);
      setToAddGP([...toAddGP, ...newImagesWithCaptions]);
    }
  };

  const handleDeleteCoverPhoto = (index, image) => {
    console.log(image);
    console.log(index);
    // setCoverPhotos(coverPhotos.filter((_, i) => i !== index));
    const newCoverPhotos = coverPhotos.filter((_, i) => i !== index);
    setToDeleteCP([...toDeleteCP, image]);
    setCoverPhotos(newCoverPhotos);
    console.log(newCoverPhotos);
    handleClose();
    setHasChanges(true);
  };

  const handleDeleteGalleryPhoto = (index, image) => {
    // setGalleryPhotos(galleryPhotos.filter((_, i) => i !== index));
    console.log("Image to delete:", image);
    const newGalleryPhotos = galleryPhotos.filter((_, i) => i !== index);
    setToDeleteGP([...toDeleteGP, image]);
    setGalleryPhotos(newGalleryPhotos);
    console.log(newGalleryPhotos);
    handleClose();
    setHasChanges(true);
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

  const handleSaveCaption = async (img, isCoverPhoto) => {
    console.log(img);
    const id = img.id;
    const caption = editedCaption;
    console.log("id, caption:", id, caption);
    if (isCoverPhoto) {
      try {
        const res = await axios.post("http://127.0.0.1:8000/api/addcaption", {
          id,
          caption,
          iscover: 1,
        });
        console.log(res.data);
        if (res.data.status === "success") {
          alert("Caption added successfully");
          setCoverPhotos(res.data.coverPhotos);
          setCoverP(res.data.coverPhotos);
          setTimeout(() => {
            setIsEditingCaption(false);
          }, 500);
        }
      } catch (error) {
        console.log(error);
        alert("Save the Images first before adding captions");
      }
    } else {
      try {
        const res = await axios.post("http://127.0.0.1:8000/api/addcaption", {
          id,
          caption,
          iscover: 0,
        });
        console.log(res.data);
        if (res.data.status === "success") {
          alert("Caption added successfully");
          setGalleryPhotos(res.data.coverPhotos);
          setGalleryP(res.data.coverPhotos);
          setTimeout(() => {
            setIsEditingCaption(false);
          }, 500);
        }
      } catch (error) {
        console.log(error);
        alert("Save the Images first before adding captions");
      }
    }
    // const updatedImages =
    //   currentPhotoType === "coverPhotos"
    //     ? [...coverPhotos]
    //     : [...galleryPhotos];
    // updatedImages[selectedImageIndex].caption = editedCaption;
    // if (currentPhotoType === "coverPhotos") {
    //   setCoverPhotos(updatedImages);
    // } else {
    //   setGalleryPhotos(updatedImages);
    // }

    // setIsEditingCaption(false);
  };

  const handlePhotoTypeChange = (type) => {
    setCurrentPhotoType(type);
  };

  const handleSave = async () => {
    // console.log("To add", toAddCP);
    // console.log("To delete", toDeleteCP);
    console.log("Gallery Photos list", galleryPhotos);
    // console.log("To add gallery photos", toAddGP);
    if (toDeleteCP.length === toAddCP.length) {
      setIsEditing(false);
      console.log(coverPhotos);
      console.log("To be deleted cover Photos", toDeleteCP);
      console.log("To be added cover Photos", toAddCP);

      // Create a FormData object
      const formdata = new FormData();

      // Append toDeleteCP as JSON string
      formdata.append("toDelete", JSON.stringify(toDeleteCP));

      // Convert Blob URLs to File objects and append to FormData
      for (const item of toAddCP) {
        const file = await fetchBlobAsFile(item.src, "photo.jpg"); // You can dynamically assign file names if needed
        formdata.append("files[]", file);
      }

      try {
        const res = await axios.post(
          `http://127.0.0.1:8000/api/updatepropertyfiles-singleunit/${propertyid}`,
          formdata,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        console.log(res.data);
        if (res.data) {
          const formdata = new FormData();
          formdata.append("toDelete", JSON.stringify(toDeleteGP));
          for (const item of toAddGP) {
            const file = await fetchBlobAsFile(item.src, "photo.jpg"); // You can dynamically assign file names if needed
            formdata.append("files[]", file);
          }
          const res2 = await axios.post(
            `http://127.0.0.1:8000/api/updatepropertyfiles-gallerysingleunit/${propertyid}`,
            formdata,
            {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            }
          );
          console.log(res2.data);
          if (res2.data) {
            if (res2.data.status === "success") {
              setGalleryPhotos(res2.data.galleryPhotos);
              setGalleryP(res2.data.galleryPhotos);
              setToAddGP([]);
              setToDeleteGP([]);
            }
            if (res.data.status === "success") {
              setCoverPhotos(res.data.coverPhotos);
              setCoverP(res.data.coverPhotos);
              setToAddCP([]);
              setToDeleteCP([]);
            }
          }

          if (res.data.status === "success" || res2.data.status === "success") {
            alert("Photos updated successfully");
          }
          if (res2.data.status === "null" && res.data.status === "null") {
            alert("No changes made");
          }
        }
      } catch (error) {
        console.log(error);
      }
    } else {
      alert("You must add at least 5 cover photos");
    }
  };

  // Helper function to convert Blob URL to File object
  async function fetchBlobAsFile(blobUrl, fileName) {
    const response = await fetch(blobUrl);
    const blob = await response.blob();
    return new File([blob], fileName, { type: blob.type });
  }

  const handleCancel = () => {
    setCoverPhotos(originalData.current.coverPhotos);
    setGalleryPhotos(originalData.current.galleryPhotos);
    setToAddCP([]);
    setToDeleteCP([]);
    setHasChanges(false);
    setIsEditing(false);
  };

  const photosToDisplay =
    currentPhotoType === "coverPhotos" ? coverPhotos : galleryPhotos;

  return (
    <Paper
      style={{
        width: "auto",
        padding: "4rem",
        borderRadius: "0.8rem",
        alignItems: "center",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "1rem",
        }}
      >
        <Typography
          sx={{
            fontFamily: "Poppins, sans-serif",
            fontSize: "1.125rem",
            fontWeight: "bold",
          }}
        >
          Photos and Details
        </Typography>
        <div>
          {!isEditing && (
            <Button
              onClick={() => setIsEditing(true)}
              sx={{ marginRight: "1rem" }}
            >
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
      <Typography
        sx={{
          fontFamily: "Poppins, sans-serif",
          fontSize: "0.875rem",
          color: "#6b7280",
          marginBottom: "2rem",
        }}
      >
        Manage your property's cover and gallery photos here. You can add, edit,
        and delete images, as well as adjust captions. Ensure your photos are
        up-to-date to attract more guests.
      </Typography>

      <Grid container spacing={2}>
        {/* Cover Photos */}
        <Grid item xs={12} sx={{ padding: "1rem" }}>
          <div
            className="info-title-cntr"
            onClick={() => handlePhotoTypeChange("coverPhotos")}
          >
            <ArrowRight sx={{ color: "#16B4DD" }} />
            <div style={{ fontSize: "1.125rem" }}>Cover Photos</div>
          </div>
          <Divider sx={{ width: "100%", color: "#ccc" }} />
          <ImageList variant="masonry" cols={5} gap={5}>
            {coverPhotos.map((image, index) => (
              <ImageListItem
                key={image.id}
                onClick={() => handleClickOpen(index, "coverPhotos")}
                style={{ position: "relative", cursor: "pointer" }}
              >
                <img
                  src={image.src}
                  alt={`Cover ${image.id}`}
                  style={{ objectFit: "cover", height: "200px" }}
                />
                {isEditing && (
                  <IconButton
                    onClick={(e) => {
                      e.stopPropagation(); // Prevents the click event from firing on the ImageListItem
                      handleDeleteCoverPhoto(index, image);
                    }}
                    sx={{
                      position: "absolute",
                      top: 8,
                      right: 8,
                      color: "white",
                      backgroundColor: "rgba(0, 0, 0, 0.5)",
                      "&:hover": {
                        backgroundColor: "rgba(0, 0, 0, 0.7)",
                      },
                    }}
                  >
                    <Delete />
                  </IconButton>
                )}
                <ImageListItemBar title={image.caption} position="below" />
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
                onChange={(e) => handleAddPhotos(e, "coverPhotos")}
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
        {isSingleUnit && (
          // Gallery Photos
          <Grid item xs={12} sx={{ padding: "1rem" }}>
            <div
              className="info-title-cntr"
              onClick={() => handlePhotoTypeChange("galleryPhotos")}
            >
              <ArrowRight sx={{ color: "#16B4DD" }} />
              <div>Gallery Photos</div>
            </div>
            <Divider sx={{ width: "100%", color: "#ccc" }} />
            <ImageList variant="masonry" cols={5} gap={5}>
              {galleryPhotos.map((image, index) => (
                <ImageListItem
                  key={image.id}
                  onClick={() => handleClickOpen(index, "galleryPhotos")}
                  style={{ position: "relative", cursor: "pointer" }}
                >
                  <img
                    src={image.src}
                    alt={`Gallery ${image.id}`}
                    style={{ objectFit: "cover", height: "200px" }}
                  />
                  {isEditing && (
                    <IconButton
                      onClick={(e) => {
                        e.stopPropagation(); // Prevents the click event from firing on the ImageListItem
                        handleDeleteGalleryPhoto(index, image);
                      }}
                      sx={{
                        position: "absolute",
                        top: 8,
                        right: 8,
                        color: "white",
                        backgroundColor: "rgba(0, 0, 0, 0.5)",
                        "&:hover": {
                          backgroundColor: "rgba(0, 0, 0, 0.7)",
                        },
                      }}
                    >
                      <Delete />
                    </IconButton>
                  )}
                  <ImageListItemBar title={image.caption} position="below" />
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
                  onChange={(e) => handleAddPhotos(e, "galleryPhotos")}
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
        )}
      </Grid>

      {/* Cover Photo Dialog */}
      <Dialog open={openCoverPhotoDialog} onClose={handleClose}>
        <DialogTitle>Cover Photo</DialogTitle>
        <DialogContent>
          <Box sx={{ position: "relative" }}>
            <img
              src={coverPhotos[selectedImageIndex]?.src}
              alt={`Selected Cover Photo`}
              style={{ width: "100%", maxHeight: "400px", objectFit: "cover" }}
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
                // onBlur={() =>
                //   handleSaveCaption(coverPhotos[selectedImageIndex], true)
                // }
                // onKeyDown={(e) => {
                //   if (e.key === "Enter") {
                //     handleSaveCaption(coverPhotos[selectedImageIndex], true);
                //   }
                // }}
              />
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          {isEditingCaption ? (
            <>
              <Button
                onClick={() =>
                  handleSaveCaption(coverPhotos[selectedImageIndex], true)
                }
              >
                Save
              </Button>
              <Button onClick={() => setIsEditingCaption(false)}>Cancel</Button>
            </>
          ) : (
            <>
              <Button onClick={handlePrev}>Previous</Button>
              <Button onClick={handleNext}>Next</Button>
              <Button onClick={() => setIsEditingCaption(true)}>
                Edit Caption
              </Button>
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
          <Box sx={{ position: "relative" }}>
            <img
              src={galleryPhotos[selectedImageIndex]?.src}
              alt={`Selected Gallery Photo`}
              style={{ width: "100%", maxHeight: "400px", objectFit: "cover" }}
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
                // onBlur={() =>
                //   handleSaveCaption(coverPhotos[selectedImageIndex], false)
                // }
                // onKeyDown={(e) => {
                //   if (e.key === "Enter") {
                //     handleSaveCaption(coverPhotos[selectedImageIndex], false);
                //   }
                // }}
              />
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          {isEditingCaption ? (
            <>
              <Button
                onClick={() =>
                  handleSaveCaption(galleryPhotos[selectedImageIndex], false)
                }
              >
                Save
              </Button>
              <Button onClick={() => setIsEditingCaption(false)}>Cancel</Button>
            </>
          ) : (
            <>
              <Button onClick={handlePrev}>Previous</Button>
              <Button onClick={handleNext}>Next</Button>
              <Button onClick={() => setIsEditingCaption(true)}>
                Edit Caption
              </Button>
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
            // disabled={!hasChanges}
            startIcon={<Save />}
          >
            Save Changes
          </Button>
        </div>
      )}
    </Paper>
  );
}
