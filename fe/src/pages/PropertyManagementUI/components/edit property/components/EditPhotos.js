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
  InputLabel,
  Snackbar,
  Alert,
  useMediaQuery,
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
import TemplateFrameEdit from "./TemplateFrame";
import CloseIcon from "@mui/icons-material/Close";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Cancel";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import LoadingModal from "../modal/LoadingModal";
import { createTheme, ThemeProvider, useTheme } from "@mui/material/styles";

export default function EditPhotos({
  isSingleUnit,
  propertyImages,
  propertyid,
  galleryImages,
  setCoverP,
  setGalleryP,
  onSaveStatusChange,
}) {
  const [openCoverPhotoDialog, setOpenCoverPhotoDialog] = useState(false);
  const [openGalleryPhotoDialog, setOpenGalleryPhotoDialog] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [coverPhotos, setCoverPhotos] = useState(propertyImages || []);
  const [toDeleteCP, setToDeleteCP] = useState([]);
  const [toAddCP, setToAddCP] = useState([]);
  const [toDeleteGP, setToDeleteGP] = useState([]);
  const [toAddGP, setToAddGP] = useState([]);
  const [galleryPhotos, setGalleryPhotos] = useState(galleryImages || []);
  const [currentPhotoType, setCurrentPhotoType] = useState("coverPhotos");
  const [isEditingCaption, setIsEditingCaption] = useState(false);
  const [editedCaption, setEditedCaption] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [originalData, setOriginalData] = useState({
    coverPhotos: propertyImages || [],
    galleryPhotos: galleryImages || [],
  });
  const [isSaved, setIsSaved] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [hasError, setHasError] = useState(false);
  const theme = createTheme({
    breakpoints: {
      values: {
        xs: 0,
        sm: 600,
        md: 960,
        lg: 1280,
        xl: 1920,
      },
    },
  });

  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const isMediumScreen = useMediaQuery(theme.breakpoints.down("md"));

  // Determine the number of columns based on screen size
  const cols = isSmallScreen ? 1 : isMediumScreen ? 2 : 5;

  // Initialize originalData and sync with props
  useEffect(() => {
    setIsSaved(false);
    setOriginalData({
      coverPhotos: propertyImages ? [...propertyImages] : [],
      galleryPhotos: galleryImages ? [...galleryImages] : [],
    });
    setCoverPhotos(propertyImages);
    setGalleryPhotos(galleryImages);
  }, [propertyImages, galleryImages]);

  // Check for changes between current and original data
  useEffect(() => {
    const hasDataChanged =
      JSON.stringify({ coverPhotos, galleryPhotos }) !==
      JSON.stringify(originalData);
    setHasChanges(hasDataChanged);
  }, [coverPhotos, galleryPhotos, originalData]);

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
        const res = await axios.post(
          "https://whitesmoke-shark-473197.hostingersite.com/api/addcaption",
          {
            id,
            caption,
            iscover: 1,
          }
        );
        console.log(res.data);
        if (res.data.status === "success") {
          setHasError(false);
          setSnackbarMessage("Caption added successfully");
          setOpenSnackbar(true);
          setCoverPhotos(res.data.coverPhotos);
          setCoverP(res.data.coverPhotos);
          setTimeout(() => {
            setIsEditingCaption(false);
          }, 500);
        }
      } catch (error) {
        console.log(error);
        setHasError(true);
        setSnackbarMessage("Save the Images first before adding captions");
        setOpenSnackbar(true);
      }
    } else {
      try {
        const res = await axios.post(
          "https://whitesmoke-shark-473197.hostingersite.com/api/addcaption",
          {
            id,
            caption,
            iscover: 0,
          }
        );
        console.log(res.data);
        if (res.data.status === "success") {
          setHasError(false);
          setSnackbarMessage("Caption added successfully");
          setOpenSnackbar(true);

          setGalleryPhotos(res.data.coverPhotos);
          setGalleryP(res.data.coverPhotos);
          setTimeout(() => {
            setIsEditingCaption(false);
          }, 500);
        }
      } catch (error) {
        console.log(error);
        setOpenSnackbar(true);
        setSnackbarMessage("Save the Images first before adding captions");
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

  const validateForm = () => {
    if (coverPhotos.length < 5) {
      setHasError(true);
      setSnackbarMessage("Please provide a total of 5 cover photos.");
      setOpenSnackbar(true);
      return false; // Validation failed
    } else if (coverPhotos.length > 5) {
      setHasError(true);
      setSnackbarMessage("You can only upload up to 5 cover photos.");
      setOpenSnackbar(true);
      return false; // Validation failed
    }
    return true; // Validation passed
  };

  const handleSave = async () => {
    if (!validateForm()) {
      return; // Stop save process if validation fails
    }

    setIsLoading(true); // Start loading

    console.log("Gallery Photos list", galleryPhotos);

    if (toDeleteCP.length === toAddCP.length) {
      console.log(coverPhotos);
      console.log("To be deleted cover Photos", toDeleteCP);
      console.log("To be added cover Photos", toAddCP);

      const formdata = new FormData();
      formdata.append("toDelete", JSON.stringify(toDeleteCP));

      for (const item of toAddCP) {
        const file = await fetchBlobAsFile(item.src, "photo.jpg");
        formdata.append("files[]", file);
      }

      try {
        const res = await axios.post(
          `https://whitesmoke-shark-473197.hostingersite.com/api/updatepropertyfiles-singleunit/${propertyid}`,
          formdata,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

        if (res.data) {
          const formdata = new FormData();
          formdata.append("toDelete", JSON.stringify(toDeleteGP));

          for (const item of toAddGP) {
            const file = await fetchBlobAsFile(item.src, "photo.jpg");
            formdata.append("files[]", file);
          }

          const res2 = await axios.post(
            `https://whitesmoke-shark-473197.hostingersite.com/api/updatepropertyfiles-gallerysingleunit/${propertyid}`,
            formdata,
            {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            }
          );

          if (
            res2.data &&
            (res.data.status === "success" || res2.data.status === "success")
          ) {
            setIsSaved(true);
            setHasError(false);
            setSnackbarMessage("Photos updated successfully");
          } else if (
            res2.data.status === "null" &&
            res.data.status === "null"
          ) {
            console.log("No changes made");
            setSnackbarMessage("No changes made");
          }
        }
      } catch (error) {
        console.log(error);
      } finally {
        onSaveStatusChange("Saved");
        setIsSaved(true);
        setIsLoading(false);
        setOpenSnackbar(true);
      }
    } else {
      setSnackbarMessage("Please provide 5 cover photos.");
    }
  };

  // Helper function to convert Blob URL to File object
  async function fetchBlobAsFile(blobUrl, fileName) {
    const response = await fetch(blobUrl);
    const blob = await response.blob();
    return new File([blob], fileName, { type: blob.type });
  }

  const handleCancel = () => {
    setCoverPhotos(originalData.coverPhotos);
    setGalleryPhotos(originalData.galleryPhotos);
    setToAddCP([]);
    setToDeleteCP([]);
    setHasChanges(false);
    setIsEditing(false);
  };
  const handleEditingChange = (editing) => {
    if (editing === true) {
      setIsEditing(editing);
    } else if (editing === false) {
      handleCancel();
    }

    console.log(`Editing mode changed: ${editing}`); // Log or use this state as needed
  };
  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  // const photosToDisplay =
  //   currentPhotoType === "coverPhotos" ? coverPhotos : galleryPhotos;
  //   // Loading indicator component
  // const LoadingIndicator = () => (
  //   <div className="loading-indicator">
  //     Saving, please wait...
  //   </div>
  // );

  return (
    <ThemeProvider theme={theme}>
      <TemplateFrameEdit
        onEditChange={handleEditingChange}
        saved={isSaved}
        onSave={handleSave}
        hasChanges={hasChanges}
        cancel={handleCancel}
      />
      <Paper
        style={{
          width: "auto",
          padding: isSmallScreen ? "1rem" : "4rem",
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
        </div>
        <Typography
          sx={{
            fontFamily: "Poppins, sans-serif",
            fontSize: "0.875rem",
            color: "#6b7280",
            marginBottom: "2rem",
          }}
        >
          Manage your property's cover and gallery photos here. You can add,
          edit, and delete images, as well as adjust captions. Ensure your
          photos are up-to-date to attract more guests.
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
            <ImageList variant="masonry" cols={cols} gap={5}>
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

          <Grid item xs={12} sx={{ padding: "1rem" }}>
            <div
              className="info-title-cntr"
              onClick={() => handlePhotoTypeChange("galleryPhotos")}
            >
              <ArrowRight sx={{ color: "#16B4DD" }} />
              <div>Gallery Photos</div>
            </div>
            <Divider
              sx={{ width: "100%", color: "#ccc", marginBottom: "1rem" }}
            />

            {galleryPhotos.length === 0 ? (
              <div
                style={{
                  textAlign: "center",
                  padding: "2rem",
                  color: "#888",
                  border: "1px solid #ccc",
                  height: "fit-content",
                  borderRadius: "0.8rem",
                }}
              >
                No Photos Added, Please Add Photos
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
                        fullWidth
                        startIcon={<AddAPhoto />}
                      >
                        Add Gallery Photos
                      </Button>
                    </label>
                  </div>
                )}
              </div>
            ) : (
              <>
                <ImageList variant="masonry" cols={cols} gap={5}>
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
              </>
            )}
          </Grid>
        </Grid>

        {/* Cover Photo Dialog */}

        <Dialog
          open={openCoverPhotoDialog}
          onClose={handleClose}
          fullScreen
          sx={{ padding: 0 }}
        >
          <DialogTitle
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "1rem",
              borderBottom: "1px solid #ccc",
            }}
          >
            Cover Photo
            <IconButton
              edge="end"
              color="inherit"
              onClick={handleClose}
              sx={{ position: "absolute", right: 16, top: 16 }}
            >
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          <DialogContent
            sx={{
              padding: 0,
              display: "flex",
              height: "100vh",
              overflow: "hidden",
              flexDirection: { xs: "column", md: "row" }, // Stack on small screens
            }}
          >
            <Box
              sx={{
                flex: { xs: "1 1 auto", md: "1 1 70%" },
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                height: { xs: "50vh", md: "100%" }, // Adjust height for smaller screens
                overflow: "hidden",
              }}
            >
              <img
                src={coverPhotos[selectedImageIndex]?.src}
                alt="Selected Cover Photo"
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
              />
            </Box>
            <Box
              sx={{
                flex: { xs: "1 1 auto", md: "1 1 30%" },
                display: "flex",
                flexDirection: "column",
                padding: { xs: "1rem", md: "2rem" }, // Smaller padding on small screens
                borderLeft: { xs: "none", md: "1px solid #ccc" }, // Remove border on small screens
                borderTop: { xs: "1px solid #ccc", md: "none" }, // Add top border for stacked view
                overflowY: "auto",
              }}
            >
              {isEditingCaption ? (
                <>
                  <InputLabel htmlFor="caption">Edit Caption</InputLabel>
                  <TextField
                    autoFocus
                    fullWidth
                    value={editedCaption}
                    onChange={handleCaptionChange}
                    variant="outlined"
                    sx={{ marginBottom: "1rem" }}
                  />
                  <Box sx={{ display: "flex", gap: "8px" }}>
                    <Button
                      onClick={() =>
                        handleSaveCaption(coverPhotos[selectedImageIndex], true)
                      }
                      color="primary"
                      variant="contained"
                      startIcon={<SaveIcon />}
                    >
                      Save
                    </Button>
                    <Button
                      onClick={() => setIsEditingCaption(false)}
                      color="secondary"
                      variant="contained"
                      startIcon={<CancelIcon />}
                    >
                      Cancel
                    </Button>
                  </Box>
                </>
              ) : (
                <>
                  <InputLabel htmlFor="caption">Caption</InputLabel>
                  <Typography
                    variant="h6"
                    paragraph
                    sx={{
                      padding: "16px",
                      backgroundColor: "#f9f9f9",
                      borderRadius: "8px",
                      fontStyle: "italic",
                      color: "#333",
                    }}
                  >
                    {coverPhotos[selectedImageIndex]?.caption ||
                      "No caption available"}
                  </Typography>
                  <Box sx={{ display: "flex", gap: "8px", marginTop: "16px" }}>
                    <Button
                      onClick={() => setIsEditingCaption(true)}
                      variant="outlined"
                      color="primary"
                      startIcon={<EditIcon />}
                    >
                      Edit Caption
                    </Button>
                    {/* <Button
                      onClick={handleDeleteImage}
                      variant="outlined"
                      color="error"
                      startIcon={<DeleteIcon />}
                    >
                      Delete Photo
                    </Button> */}
                  </Box>
                </>
              )}
            </Box>
          </DialogContent>
          <DialogActions
            sx={{
              justifyContent: "space-between",
              padding: "1rem",
              backgroundColor: "#f5f5f5",
              borderTop: "1px solid #ccc",
            }}
          >
            <Button
              onClick={handlePrev}
              variant="contained"
              startIcon={<ArrowBackIcon />}
              sx={{ backgroundColor: "#1976d2", color: "#fff" }}
            >
              Previous
            </Button>
            <Button
              onClick={handleNext}
              variant="contained"
              endIcon={<ArrowForwardIcon />}
              sx={{ backgroundColor: "#1976d2", color: "#fff" }}
            >
              Next
            </Button>
          </DialogActions>
        </Dialog>

        {/* Gallery Photo Dialog 1 */}

        <Dialog
          open={openGalleryPhotoDialog}
          onClose={handleClose}
          fullScreen
          sx={{ padding: 0 }}
        >
          <DialogTitle
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "1rem",
              borderBottom: "1px solid #ccc",
            }}
          >
            Gallery Photo
            <IconButton
              edge="end"
              color="inherit"
              onClick={handleClose}
              sx={{ position: "absolute", right: 16, top: 16 }}
            >
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          <DialogContent
            sx={{
              padding: 0,
              display: "flex",
              height: "100vh",
              overflow: "hidden",
              flexDirection: { xs: "column", md: "row" }, // Stack on small screens
            }}
          >
            <Box
              sx={{
                flex: { xs: "1 1 auto", md: "1 1 70%" },
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                height: { xs: "50vh", md: "100%" }, // Adjust height for smaller screens
                overflow: "hidden",
              }}
            >
              <img
                src={galleryPhotos[selectedImageIndex]?.src}
                alt="Selected Gallery Photo"
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
              />
            </Box>
            <Box
              sx={{
                flex: { xs: "1 1 auto", md: "1 1 30%" },
                display: "flex",
                flexDirection: "column",
                padding: { xs: "1rem", md: "2rem" }, // Smaller padding on small screens
                borderLeft: { xs: "none", md: "1px solid #ccc" }, // Remove border on small screens
                borderTop: { xs: "1px solid #ccc", md: "none" }, // Add top border for stacked view
                overflowY: "auto",
              }}
            >
              {isEditingCaption ? (
                <>
                  <InputLabel htmlFor="caption">Edit Caption</InputLabel>
                  <TextField
                    autoFocus
                    fullWidth
                    value={editedCaption}
                    onChange={handleCaptionChange}
                    variant="outlined"
                    sx={{ marginBottom: "1rem" }}
                  />
                  <Box sx={{ display: "flex", gap: "8px" }}>
                    <Button
                      onClick={() =>
                        handleSaveCaption(
                          galleryPhotos[selectedImageIndex],
                          true
                        )
                      }
                      color="primary"
                      variant="contained"
                      startIcon={<SaveIcon />}
                    >
                      Save
                    </Button>
                    <Button
                      onClick={() => setIsEditingCaption(false)}
                      color="secondary"
                      variant="contained"
                      startIcon={<CancelIcon />}
                    >
                      Cancel
                    </Button>
                  </Box>
                </>
              ) : (
                <>
                  <InputLabel htmlFor="caption">Caption</InputLabel>
                  <Typography
                    variant="h6"
                    paragraph
                    sx={{
                      padding: "16px",
                      backgroundColor: "#f9f9f9",
                      borderRadius: "8px",
                      fontStyle: "italic",
                      color: "#333",
                    }}
                  >
                    {galleryPhotos[selectedImageIndex]?.caption ||
                      "No caption available"}
                  </Typography>
                  <Box sx={{ display: "flex", gap: "8px", marginTop: "16px" }}>
                    <Button
                      onClick={() => setIsEditingCaption(true)}
                      variant="outlined"
                      color="primary"
                      startIcon={<EditIcon />}
                    >
                      Edit Caption
                    </Button>
                    <Button
                      onClick={handleDeleteImage}
                      variant="outlined"
                      color="error"
                      startIcon={<DeleteIcon />}
                    >
                      Delete Photo
                    </Button>
                  </Box>
                </>
              )}
            </Box>
          </DialogContent>
          <DialogActions
            sx={{
              justifyContent: "space-between",
              padding: "1rem",
              backgroundColor: "#f5f5f5",
              borderTop: "1px solid #ccc",
            }}
          >
            <Button
              onClick={handlePrev}
              variant="contained"
              startIcon={<ArrowBackIcon />}
              sx={{ backgroundColor: "#1976d2", color: "#fff" }}
            >
              Previous
            </Button>
            <Button
              onClick={handleNext}
              variant="contained"
              endIcon={<ArrowForwardIcon />}
              sx={{ backgroundColor: "#1976d2", color: "#fff" }}
            >
              Next
            </Button>
          </DialogActions>
        </Dialog>

        {/* Gallery Photo Dialog 2 */}
        {/* <Dialog
  open={openCoverPhotoDialog}
  onClose={handleClose}
  fullScreen
  sx={{ padding: 0 }}
>
  <DialogTitle
    sx={{
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: "1rem",
      borderBottom: "1px solid #ccc",
    }}
  >
    Cover Photo
    <IconButton
      edge="end"
      color="inherit"
      onClick={handleClose}
      sx={{ position: "absolute", right: 16, top: 16 }}
    >
      <CloseIcon />
    </IconButton>
  </DialogTitle>
  <DialogContent
    sx={{
      padding: 0,
      display: 'flex',
      height: '100vh',
      overflow: 'hidden',
      flexDirection: { xs: 'column', md: 'row' }, // Stack on small screens
    }}
  >
    <Box
      sx={{
        flex: { xs: '1 1 auto', md: '1 1 70%' },
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: { xs: '50vh', md: '100%' }, // Adjust height for smaller screens
        overflow: 'hidden',
      }}
    >
      <img
        src={coverPhotos[selectedImageIndex]?.src}
        alt="Selected Cover Photo"
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
        }}
      />
    </Box>
    <Box
      sx={{
        flex: { xs: '1 1 auto', md: '1 1 30%' },
        display: 'flex',
        flexDirection: 'column',
        padding: { xs: '1rem', md: '2rem' }, // Smaller padding on small screens
        borderLeft: { xs: 'none', md: '1px solid #ccc' }, // Remove border on small screens
        borderTop: { xs: '1px solid #ccc', md: 'none' }, // Add top border for stacked view
        overflowY: 'auto',
      }}
    >
      {isEditingCaption ? (
        <>
          <InputLabel htmlFor="caption">Edit Caption</InputLabel>
          <TextField
            autoFocus
            fullWidth
            value={editedCaption}
            onChange={handleCaptionChange}
            variant="outlined"
            sx={{ marginBottom: '1rem' }}
          />
          <Box sx={{ display: 'flex', gap: '8px' }}>
            <Button
              onClick={() => handleSaveCaption(coverPhotos[selectedImageIndex], true)}
              color="primary"
              variant="contained"
              startIcon={<SaveIcon />}
            >
              Save
            </Button>
            <Button
              onClick={() => setIsEditingCaption(false)}
              color="secondary"
              variant="contained"
              startIcon={<CancelIcon />}
            >
              Cancel
            </Button>
          </Box>
        </>
      ) : (
        <>
          <InputLabel htmlFor="caption">Caption</InputLabel>
          <Typography
            variant="h6"
            paragraph
            sx={{
              padding: '16px',
              backgroundColor: '#f9f9f9',
              borderRadius: '8px',
              fontStyle: 'italic',
              color: '#333',
            }}
          >
            {coverPhotos[selectedImageIndex]?.caption || "No caption available"}
          </Typography>
          <Box sx={{ display: 'flex', gap: '8px', marginTop: '16px' }}>
            <Button
              onClick={() => setIsEditingCaption(true)}
              variant="outlined"
              color="primary"
              startIcon={<EditIcon />}
            >
              Edit Caption
            </Button>
            <Button
              onClick={handleDeleteImage}
              variant="outlined"
              color="error"
              startIcon={<DeleteIcon />}
            >
              Delete Photo
            </Button>
          </Box>
        </>
      )}
    </Box>
  </DialogContent>
  <DialogActions
    sx={{
      justifyContent: "space-between",
      padding: '1rem',
      backgroundColor: '#f5f5f5',
      borderTop: '1px solid #ccc',
    }}
  >
    <Button
      onClick={handlePrev}
      variant="contained"
      startIcon={<ArrowBackIcon />}
      sx={{ backgroundColor: '#1976d2', color: '#fff' }}
    >
      Previous
    </Button>
    <Button
      onClick={handleNext}
      variant="contained"
      endIcon={<ArrowForwardIcon />}
      sx={{ backgroundColor: '#1976d2', color: '#fff' }}
    >
      Next
    </Button>
  </DialogActions>
</Dialog> */}
      </Paper>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={hasError ? "error" : "success"}
          sx={{ width: "100%" }}
          variant="filled"
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
      <LoadingModal open={isLoading} />
    </ThemeProvider>
  );
}
