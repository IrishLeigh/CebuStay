import React, { useState, useEffect, useCallback } from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Container from "@mui/material/Container";
import Button from '@mui/material/Button';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DeleteIcon from '@mui/icons-material/Delete';
import { styled } from '@mui/material/styles';
import TextField from '@mui/material/TextField';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import { Grid, InputAdornment, MenuItem, Select } from '@mui/material';
import Cropper from 'react-easy-crop';
import Slider from '@mui/material/Slider';
import { getCroppedImg } from './cropImageHelper';

const debounce = (func, delay) => {
  let timeoutId;
  return (...args) => {
    if (timeoutId) clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      func.apply(null, args);
    }, delay);
  };
};

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: '100%'
});

const styles = {
  container: {
    fontFamily: 'Poppins, sans-serif',
  },
  sectionTitle: {
    fontWeight: 'bold',
    marginBottom: '1rem',
    fontFamily: 'Poppins, sans-serif',
    marginTop: '1rem',
  },
  sectionDescription: {
    marginBottom: '1.5rem',
    color: '#666',
    fontFamily: 'Poppins, sans-serif',
    textAlign: 'justify',
  },
  formField: {
    marginBottom: '1rem',
    '& .MuiOutlinedInput-root': {
      '& fieldset': {
        borderColor: '#ccc', // Border color
      },
      '&:hover fieldset': {
        borderColor: '#16B4DD', // Hovered border color
      },
      '&.Mui-focused fieldset': {
        borderColor: '#16B4DD', // Focused border color
      },
    },
  },
  imageUpload: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    border: '1px solid #ccc',
    borderRadius: '8px',
    padding: '1rem',
  },
  cropperContainer: {
    position: 'relative',
    width: 300,
    height: 300,
    backgroundColor: '#333',
    borderRadius: '50%',
    overflow: 'hidden',
    marginBottom: '16px',
  },
  zoomSlider: {
    marginBottom: '16px',
  },
  imageActions: {
    display: 'flex',
    gap: '16px',
  },
  button: {
    backgroundColor: '#16B4DD',
    color: 'white',
    '&:hover': {
      backgroundColor: '#15A1C6', // Darker shade of #16BDFF
      color: 'white',
    },
  },
  deleteButton: {
    backgroundColor: '#ff4d4d',
    color: 'white',
    '&:hover': {
      backgroundColor: '#e60000',
    },
  },
};
const countryCodes = [
  { code: '+1', label: 'United States' },
  { code: '+44', label: 'United Kingdom' },
  { code: '+63', label: 'Philippines' },
  // Add more country codes as needed
];

export default function IndividualHost({ onDataChange, parentData, isEditing, isCancelled }) {
  const [data, setData] = useState({
    id: null,
    propertyownershipid: null,
    FirstName: '',
    LastName: '',
    DateOfBirth: '',
    DisplayName: '',
    countryCode: '+63',
    PhoneNumber: '',
    Email: '',
    City: '',
    ZipCode: '',
    Street: '',
    Barangay: '',
    Describe: '',
  });
  const [errors, setErrors] = useState({});
  const [originalData, setOriginalData] = useState(null);

  useEffect(() => {
    // Check if parentData and parentData.property_owner exist before trying to access their properties
    if (parentData && parentData.property_owner) {
      const propertyOwner = parentData.property_owner;

      setOriginalData({
        id: propertyOwner.propertyownerid || null,
        propertyownershipid: parentData.property_ownership?.propertyownershipid || null,
        FirstName: propertyOwner.firstname || '',
        LastName: propertyOwner.lastname || '',
        DateOfBirth: propertyOwner.dateofbirth || '',
        DisplayName: propertyOwner.displayname || '',
        countryCode: propertyOwner.countrycode || '+63',
        PhoneNumber: propertyOwner.contactnumber || '',
        Email: propertyOwner.email || '',
        City: propertyOwner.city || '',
        ZipCode: propertyOwner.zipcode || '',
        Street: propertyOwner.street || '',
        Barangay: propertyOwner.barangay || '',
        Describe: propertyOwner.describe || '',
      });

      // Set data to the initial values from parentData
      setData({
        id: propertyOwner.propertyownerid || null,
        propertyownershipid: parentData.property_ownership?.propertyownershipid || null,
        FirstName: propertyOwner.firstname || '',
        LastName: propertyOwner.lastname || '',
        DateOfBirth: propertyOwner.dateofbirth || '',
        DisplayName: propertyOwner.displayname || '',
        countryCode: propertyOwner.countrycode || '+63',
        PhoneNumber: propertyOwner.contactnumber || '',
        Email: propertyOwner.email || '',
        City: propertyOwner.city || '',
        ZipCode: propertyOwner.zipcode || '',
        Street: propertyOwner.street || '',
        Barangay: propertyOwner.barangay || '',
        Describe: propertyOwner.describe || '',
      });
    } else {
      console.warn('parentData or parentData.property_owner is undefined or null');
    }
  }, [parentData]);

  useEffect(() => {
    // If isCancelled is true and originalData exists, reset data to originalData
    if (isCancelled && originalData) {
      setData(originalData);
    }
  }, [isCancelled, originalData]);
  
// Handle image file upload
const handleImageUpload = (event) => {
  const file = event.target.files[0];
  const reader = new FileReader();
  reader.onloadend = () => {
      setData((prevData) => ({
          ...prevData,
          imageSrc: reader.result, // Store imageSrc correctly
      }));
  };
  if (file) {
      reader.readAsDataURL(file);
  }
};

// Handle image cropping
const handleSaveImage = async () => {
  try {
      const croppedImage = await getCroppedImg(data.imageSrc, data.croppedAreaPixels); // Use imageSrc
      setData((prevData) => ({ ...prevData, imageSrc: URL.createObjectURL(croppedImage) }));
  } catch (e) {
      console.error(e);
  }
};

// Ensure the crop area is being stored correctly
const handleCropComplete = useCallback((_, croppedAreaPixels) => {
  setData((prevData) => ({ ...prevData, croppedAreaPixels })); // Save crop data
}, []);

  const handleDeleteImage = () => {
    setData((prevData) => ({ ...prevData, imageSrc: null }));
  };
  // Handle changes in text fields
  const handleChange = (event) => {
    const { id, value } = event.target;
    setData((prevData) => ({
      ...prevData,
      [id]: value,
    }));

  };
  const handleCountryCodeChange = (event) => {
    setData((prevData) => ({
      ...prevData,
      countryCode: event.target.value,
    }));

  };

  // Handle changes in the date picker
  const handleChangeDate = (date) => {
    setData((prevData) => ({
      ...prevData,
      DateOfBirth: date.isValid ? date.format('YYYY-MM-DD') : '',
    }));
 
  };
  console.log("Parent Data SA CHILD INDIVIDUAL DATA : ", parentData);
  const debouncedOnDataChange = useCallback(
    debounce((data) => {
      if (onDataChange) {
        onDataChange(data); // Call the original callback with the updated data
      }
    }, 300), // Adjust the delay as needed (300ms is a common choice)
    [onDataChange]
  );

  // Handle data changes and notify parent with delay
  useEffect(() => {
    debouncedOnDataChange(data); // Call the debounced function
  }, [data, debouncedOnDataChange]);

  console.log("Data: ", parentData);

  return (
    <div style={styles.container}>
      <Typography variant="h5" style={styles.sectionTitle}>
        Host Details
      </Typography>
        {/* Profile */}
        <Typography style={styles.sectionTitle}>Profile</Typography>
        
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              id="FirstName"
              label="First Name"
              value={data.FirstName}
              onChange={handleChange}
              fullWidth
              required
              disabled={!isEditing}
    
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
                id="LastName"
                label="Last Name"
                value={data.LastName}
                onChange={handleChange}
                fullWidth
                required
                disabled={!isEditing}
              />
          </Grid>

        </Grid>
            <TextField
              id="DisplayName"
              label="Display Name"
              value={data.DisplayName}
              onChange={handleChange}
              helperText="This is the name that will be shown on CebuStay website and app."
              fullWidth
              required
              disabled={!isEditing}
              sx = {{ marginTop: "1rem" }}
            />

          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              label="Date of Birth"
              value={data.DateOfBirth ? dayjs(data.DateOfBirth) : null}
              onChange={handleChangeDate}
              renderInput={(params) => <TextField {...params} fullWidth />}
              maxDate={dayjs().subtract(18, 'year')}
              sx = {{ marginTop: "1rem" }}
              required
              disabled={!isEditing}
            />
          </LocalizationProvider>
      {/* Contact Details */}
      <Typography style= {styles.sectionTitle}  mt={1} fontWeight="bold">
          Contact Details
        </Typography>
      <Grid container spacing={1}>
        <Grid item xs={12} sm={6}>
        <Select
          value={data.countryCode}
          onChange={handleCountryCodeChange}
          fullWidth
          style={styles.countryCodeSelect}
          label = "Country Code"
          required
          disabled
          helperText=" Only Philippine numbers allowed. Start with +63."
        >
          {countryCodes.map((country) => (
            <MenuItem key={country.code} value={country.code}>
              {country.label}
            </MenuItem>
          ))}
        </Select>

        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            id="PhoneNumber"
            label="Phone Number"
            value={data.PhoneNumber}
            onChange={handleChange}
            fullWidth
            disabled={!isEditing}
            required
            style={styles.formField}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  {data.countryCode}
                </InputAdornment>
              ),
            }}
            helperText=" Only Philippine numbers allowed. Start with +63."
            error={!!errors.PhoneNumber}
          />
        </Grid>
      </Grid>
            <TextField
              id="Email"
              label="Email"
              required
              value={data.Email}
              onChange={handleChange}
              style= {styles.formField}
              fullWidth
              disabled={!isEditing}

            />
      
      {/* Location Details */}
    
        <Typography sx={{ fontSize: "1.125rem" , fontFamily: "Poppins"}}  ml={1} fontWeight="bold">
          Location Details
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} md = {6}>
            <TextField id="Street" label="Street" value={data.Street} onChange={handleChange} fullWidth style={styles.formField} required  disabled={!isEditing}/>
          </Grid>
          <Grid item xs={12} md = {6}>
            <TextField id="Barangay" label="Barangay" value={data.Barangay} onChange={handleChange} fullWidth style={styles.formField}  required  disabled={!isEditing}/>
          </Grid>
        </Grid>
        <Grid container spacing={2}>
        <Grid item xs={12} md = {6}>
            <TextField id="City" label="Municipality / City" value={data.City} onChange={handleChange} fullWidth style={styles.formField} required  disabled={!isEditing}/>
          </Grid>
          <Grid item xs={12} md = {6}>
            <TextField type ="number" id="ZipCode" label="Zip Code" value={data.ZipCode} onChange={handleChange} fullWidth style={styles.formField} required  disabled={!isEditing} />
          </Grid>
        </Grid>
       
      {/* Describe YourSelf */}
      
       <Typography style={styles.sectionTitle}>Describe YourSelf As a Host</Typography>
      <TextField
        id="Describe"
        label="Description"
        value={data.Describe}
        onChange={handleChange}
        multiline
        rows={4}
        fullWidth
        style={styles.formField}
        required
        disabled={!isEditing}
      />
    </div>
  );
}
