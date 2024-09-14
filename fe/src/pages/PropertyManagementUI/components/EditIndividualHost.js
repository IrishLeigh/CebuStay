import React, { useState, useEffect, useCallback } from "react";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Button from "@mui/material/Button";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import DeleteIcon from "@mui/icons-material/Delete";
import { styled } from "@mui/material/styles";
import TextField from "@mui/material/TextField";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import { Dialog, Slider } from "@mui/material";
import Cropper from "react-easy-crop";

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: "100%",
});

export default function IndividualHost({
  onDataChange,
  isEditing,
  parentIndividualData,
}) {
  const [data, setData] = useState({});
  const [uploadedImage, setUploadedImage] = useState(null);
  const [imageSrc, setImageSrc] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedArea, setCroppedArea] = useState(null);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    console.log("parentPartnerData");
    console.log(parentIndividualData);
    setData(parentIndividualData);
  }, []);
  useEffect(() => {
    onDataChange(data); // Callback to parent component when data changes
  }, [data, onDataChange]);

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    setData((prevData) => ({
      ...prevData,
      UploadedImage: file,
    }));
    setUploadedImage(file);
  };

  const handleDeleteImage = () => {
    setUploadedImage(null);
    setData((prevData) => ({
      ...prevData,
      UploadedImage: null,
    }));
  };

  // Function to handle changes in text fields
  const handleChange = (event) => {
    const { id, value } = event.target;
    setData((prevData) => ({
      ...prevData,
      [id]: value,
    }));
  };

  // Function to handle changes in the date picker
  const handleChangeDate = (date) => {
    setData((prevData) => ({
      ...prevData,
      DateOfBirth: date.isValid ? date.format("YYYY-MM-DD") : "", // Update DateOfBirth field with formatted date
    }));
  };

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      const imageDataUrl = await readFile(file);
      setImageSrc(imageDataUrl);
      setOpen(true);
    }
  };

  const readFile = (file) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.addEventListener("load", () => resolve(reader.result));
      reader.readAsDataURL(file);
    });
  };

  const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedArea(croppedAreaPixels);
  }, []);

  const handleSave = () => {
    // Here you can convert the cropped area into an image file and save it
    setOpen(false);
  };

  return (
    <div>
      <Typography sx={{ fontSize: "1.125rem" }} mb={2} mt={6} fontWeight="bold">
        Host Details
      </Typography>
      {/* Upload Image */}
      <div
        style={{
          border: "2px dashed #ccc",
          padding: "1rem",
          borderRadius: "0.8rem",
          marginBottom: "1rem",
        }}
      >
        <Typography sx={{ fontSize: "1.125rem" }}>
          Upload your profile photo
        </Typography>
        <Button
          component="label"
          role={undefined}
          variant="contained"
          tabIndex={-1}
          startIcon={<CloudUploadIcon />}
          sx={{ width: "100%" }}
        >
          Upload file
          <VisuallyHiddenInput type="file" onChange={handleFileChange} />
        </Button>
        {uploadedImage && (
          <div>
            <div style={{ display: "flex", alignItems: "center" }}>
              <Typography sx={{ fontSize: "1rem" }}>
                {uploadedImage.name}
              </Typography>
              <Button onClick={handleDeleteImage}>
                <DeleteIcon />
              </Button>
            </div>
          </div>
        )}
      </div>
      {/* Profile */}
      <div
        style={{
          border: "2px dashed #cacaca",
          padding: "1rem",
          borderRadius: "10px",
          marginTop: "1rem",
        }}
      >
        <Typography sx={{ fontSize: "1.125rem" }} ml={1} fontWeight="bold">
          Profile
        </Typography>
        <Box
          component="form"
          sx={{
            "& .MuiTextField-root": { m: 1, width: "25ch" },
          }}
          noValidate
          autoComplete="off"
        >
          <div>
            <TextField
              id="firstname"
              label="First Name"
              value={data.firstname || ""} // Ensure it's never undefined or null
              onChange={handleChange}
              InputLabelProps={{
                shrink: Boolean(data.firstname), // Float the label if there's a value
              }}
            />

            <TextField
              id="lastName"
              label="Last Name"
              value={data.lastname || ""}
              onChange={handleChange}
              InputLabelProps={{
                shrink: Boolean(data.lastname),
              }}
            />
          </div>
          <div>
            <Typography sx={{ fontSize: "1rem", ml: 1, mt: 2 }}>
              This is the name that will be shown on CebuStay website and app.
            </Typography>
            <TextField
              id="displayname"
              label="Display Name"
              value={data.displayname || ""}
              onChange={handleChange}
              InputLabelProps={{
                shrink: Boolean(data.displayname),
              }}
            />
          </div>
          <div>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DemoContainer components={["DatePicker"]}>
                <DatePicker
                  id="dateofbirth"
                  label="Date of Birth"
                  value={data.dateofbirth ? dayjs(data.dateofbirth) : null}
                  onChange={handleChangeDate}
                />
              </DemoContainer>
            </LocalizationProvider>
          </div>
        </Box>
      </div>
      {/* Contact Details */}
      <div
        style={{
          border: "2px dashed #cacaca",
          padding: "1rem",
          borderRadius: "10px",
          marginTop: "1rem",
        }}
      >
        <Typography sx={{ fontSize: "1.125rem" }} ml={1} fontWeight="bold">
          Contact Details
        </Typography>
        <Box
          component="form"
          sx={{
            "& .MuiTextField-root": { m: 1, width: "25ch" },
          }}
          noValidate
          autoComplete="off"
        >
          <div>
            <TextField
              id="contactnumber"
              label="Phone Number"
              sx={{ width: "30%" }}
              value={data.contactnumber}
              onChange={handleChange}
            />
            <TextField
              id="email"
              label="Email"
              sx={{ width: "50%" }}
              value={data.email}
              onChange={handleChange}
            />
          </div>
        </Box>
      </div>
      {/* Location Details */}
      <div
        style={{
          border: "2px dashed #cacaca",
          padding: "1rem",
          borderRadius: "10px",
          marginTop: "1rem",
        }}
      >
        <Typography sx={{ fontSize: "1.125rem" }} ml={1} fontWeight="bold">
          Location Details
        </Typography>
        <Box
          component="form"
          sx={{
            "& .MuiTextField-root": { m: 1 },
          }}
          noValidate
          autoComplete="off"
        >
          <div>
            <TextField
              id="city"
              label="City"
              value={data.city}
              onChange={handleChange}
              fullWidth
            />
            <TextField
              id="province"
              label="Province"
              value={data.province}
              onChange={handleChange}
              fullWidth
            />
          </div>
          <div>
            <TextField
              id="zipcode"
              label="Zip Code"
              value={data.zipcode}
              onChange={handleChange}
              fullWidth
            />
            <TextField
              id="primary_address"
              label="Primary Address"
              value={data.primary_address}
              onChange={handleChange}
              fullWidth
            />
          </div>
        </Box>
      </div>
      {/* Description */}
      <div
        style={{
          border: "2px dashed #cacaca",
          padding: "1rem",
          borderRadius: "10px",
          marginTop: "1rem",
        }}
      >
        <Typography sx={{ fontSize: "1.125rem" }} ml={1} fontWeight="bold">
          Description
        </Typography>
        <TextField
          id="describe"
          label="Describe Your Accommodation"
          multiline
          rows={4}
          value={data.describe}
          onChange={handleChange}
          fullWidth
        />
      </div>
      {/* Calendar */}
      <div
        style={{
          border: "2px dashed #cacaca",
          padding: "1rem",
          borderRadius: "10px",
          marginTop: "1rem",
        }}
      >
        <Typography sx={{ fontSize: "1.125rem" }} ml={1} fontWeight="bold">
          Calendar
        </Typography>
        <TextField
          id="calendar"
          label="Calendar Link"
          value={data.calendar}
          onChange={handleChange}
          fullWidth
        />
      </div>
      {/* Image Cropping Dialog */}
      {/* Crop Dialog */}
      <Dialog open={open} onClose={() => setOpen(false)}>
        <Box
          sx={{
            position: "relative",
            width: 400,
            height: 400,
            backgroundColor: "#333",
          }}
        >
          <Cropper
            image={imageSrc}
            crop={crop}
            zoom={zoom}
            aspect={1}
            cropShape="round"
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={onCropComplete}
          />
        </Box>
        <Box sx={{ mt: 2, px: 2 }}>
          <Slider
            value={zoom}
            min={1}
            max={3}
            step={0.1}
            aria-labelledby="Zoom"
            onChange={(e, zoom) => setZoom(zoom)}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleSave}
            fullWidth
          >
            Save
          </Button>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
        </Box>
      </Dialog>
    </div>
  );
}
