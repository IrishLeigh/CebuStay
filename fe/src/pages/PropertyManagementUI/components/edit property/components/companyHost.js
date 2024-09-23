import React, { useState, useCallback, useEffect } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DeleteIcon from '@mui/icons-material/Delete';
import Cropper from 'react-easy-crop';
import Slider from '@mui/material/Slider';
import { getCroppedImg } from './cropImageHelper';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { Grid, InputAdornment, MenuItem, Select } from '@mui/material';
import dayjs from 'dayjs' 

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
  legalRepContainer: {
    display: 'flex',
    flexDirection: 'column',
    border: '1px solid #ccc',
    borderRadius: '8px',
    padding: '1rem',
    marginBottom: '16px',
  },
  button: {
    backgroundColor: '#16B4DD',
    color: 'white',
    '&:hover': {
      backgroundColor: '#15A1C6', // Darker shade of #16BDFF
      color: 'white',
    },
  },
  legalRepTitle: {
    fontWeight: 'bold',
    fontFamily: 'Poppins, sans-serif',
    marginBottom: '1rem',
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
export default function CompanyHost( {onDataChange, parentData}) {
  const [data, setData] = useState({
    LegalBusinessName: '',
    Describe: '',
    City: '',
    ZipCode: '',
    Street: '',
    Barangay: '',
    imageSrc: null,
    croppedAreaPixels: null,
    crop: { x: 0, y: 0 },
    zoom: 1,
    legalRepresentatives: [
      { id: 1, firstName: '', lastName: '', email: '', phone: '', position: '', dob: null , countryCode: '+63'}
    ]
  });
  const [errors, setErrors] = useState({});
  // Calculate the minDate for 18 years ago
  const minDate = dayjs().subtract(18, 'year');
  const [originalData, setOriginalData] = useState(null);
  
  const formatDate = (dateString) => {
    if (!dateString) return null; // Handle empty date
    const [year, month, day] = dateString.split('-');
    return `${month}/${day}/${year}`;  // Return in MM/DD/YYYY format
  };
  
  useEffect(() => {
    if (parentData) {
      console.log("Parent Data:", parentData);  // Log parentData for debugging
      
      // Ensure the legal representative data is mapped correctly, including the date
      const formattedRepresentatives = (parentData.legal_representative || []).map(rep => ({
        id: rep.legalrepresentativeid || 1,
        firstName: rep.firstname || '',
        lastName: rep.lastname || '',
        email: rep.email || '',
        phone: rep.phone_number || '',
        position: rep.position || '',
        dob: formatDate(rep.date_of_birth) || '',  // Format the date correctly
        countryCode: '+63',
      }));
  
      setData({
        LegalBusinessName: parentData.property_company.legal_business_name || '',
        Describe: parentData.property_company.company_description || '',
        City: parentData.property_company.city || '',
        ZipCode: parentData.property_company.zipcode || '',
        Street: parentData.property_company.street || '',
        Barangay: parentData.property_company.barangay || '',
        imageSrc: parentData.imageSrc || null,
        croppedAreaPixels: parentData.croppedAreaPixels || null,
        crop: parentData.crop || { x: 0, y: 0 },
        zoom: parentData.zoom || 1,
        legalRepresentatives: formattedRepresentatives || null,  // Use the formatted legal representatives array
      });
  
      setOriginalData(parentData);  // Set the original data as well
    }
  }, [parentData]);

// Function to handle cancel changes and reset form data to originalData
const handleCancelChanges = () => {
  setData(originalData);  // Revert to the original data
};
  const handleCropComplete = useCallback((_, croppedAreaPixels) => {
    setData((prevData) => ({ ...prevData, croppedAreaPixels }));
  }, []);

  const handleDateChange = (newValue) => {
    setData((prevData) => ({ ...prevData, DateOfBirth: newValue }));
  };
  const addLegalRepresentative = () => {
    setData((prevData) => ({
      ...prevData,
      legalRepresentatives: [
        ...prevData.legalRepresentatives,
        { id: prevData.legalRepresentatives.length + 1, firstName: '', lastName: '', email: '', phone: '', position: '', dob: null }
      ]
    }));
  };

 const handleImageUpload = (event) => {
  const file = event.target.files[0];
  if (file) {
    // Check file type (e.g., only allow image types)
    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file');
      return;
    }

    // Check file size (example: limit to 5MB)
    const maxSizeMB = 5;
    if (file.size > maxSizeMB * 1024 * 1024) {
      alert(`File size exceeds ${maxSizeMB}MB limit`);
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setData((prevData) => ({ ...prevData, imageSrc: reader.result }));
    };
    reader.readAsDataURL(file);
  }
};


  const handleSaveImage = async () => {
    try {
      const croppedImage = await getCroppedImg(data.imageSrc, data.croppedAreaPixels);
      setData((prevData) => ({ ...prevData, imageSrc: URL.createObjectURL(croppedImage) }));
    } catch (e) {
      console.error(e);
    }
  };

  const handleDeleteImage = () => {
    setData((prevData) => ({ ...prevData, imageSrc: null }));
  };

  const handleChange = (event) => {
    const { id, value } = event.target;
    setData((prevData) => ({
      ...prevData,
      [id]: value,
    }));
  };

  const handleLegalRepChange = (id, field, value) => {
    if (field === 'dob') {
      value = dayjs(value).format('MM-DD-YYYY'); // Format the date to mm-dd-yyyy
    }
    setData((prevData) => ({
      ...prevData,
      legalRepresentatives: prevData.legalRepresentatives.map((rep) =>
        rep.id === id ? { ...rep, [field]: value } : rep
      ),
    }));
  };
const handleCountryCodeChange = (id, newCountryCode) => {
  setData((prevData) => ({
    ...prevData,
    legalRepresentatives: prevData.legalRepresentatives.map((rep) =>
      rep.id === id ? { ...rep, countryCode: newCountryCode } : rep
    ),
  }));
};

  const handleDeleteLegalRep = (id) => {
    // Prevent deletion of the first legal representative
    if (id === 1) {
      alert("You cannot delete Legal Representative 1");
      return;
    }
  
    setData((prevData) => ({
      ...prevData,
      legalRepresentatives: prevData.legalRepresentatives.filter((rep) => rep.id !== id),
    }));
  };
  

  useEffect(() => {
    const validateData = () => {
      const newErrors = { phone: '', email: '', dateOfBirth: '' };
  
      data.legalRepresentatives.forEach((rep) => {
        if (!rep.phone || rep.phone.length < 10) {
          newErrors.phone = 'Invalid phone number';
        }
  
        if (!rep.email || !/\S+@\S+\.\S+/.test(rep.email)) {
          newErrors.email = 'Invalid email address';
        }
      });
  
      setErrors(newErrors);
      // Return true if no errors
      return !Object.values(newErrors).some(error => error);
    };
  
    // Always send data, but validate it before.
    onDataChange(data); // This will send data regardless of validation.
    
    // You can keep the validation for display purposes
    validateData();
  
  }, [data ]);
  
 console.log ("data", data);


  return (
    <div style={styles.container}>
      
      <Typography variant="h5" style={styles.sectionTitle}>
        Company Details
      </Typography>

      <Typography style={styles.sectionTitle}>Legal Business Name</Typography>
      <TextField
        id="LegalBusinessName"
        label="Name"
        value={data.LegalBusinessName}
        onChange={handleChange}
        fullWidth
        sx={{ mb: 2 }}
        style={styles.formField}
      />
      
      <Typography style={styles.sectionTitle}>Company Description</Typography>
      <TextField
        id="Describe"
        label="Description"
        value={data.Describe}
        onChange={handleChange}
        multiline
        rows={4}
        fullWidth
        style={styles.formField}
      />

      <Typography style={styles.sectionTitle}>Upload Company Photo</Typography>
      <div style={styles.imageUpload}>
        {data.imageSrc ? (
          <Box style={styles.cropperContainer}>
            <Cropper
              image={data.imageSrc}
              crop={data.crop}
              zoom={data.zoom}
              aspect={1}
              cropShape="round"
              onCropChange={(newCrop) => setData((prevData) => ({ ...prevData, crop: newCrop }))}
              onCropComplete={handleCropComplete}
              onZoomChange={(newZoom) => setData((prevData) => ({ ...prevData, zoom: newZoom }))}
            />
          </Box>
        ) : (
          <Button
            variant="outlined"
            component="label"
            startIcon={<CloudUploadIcon />}
            fullWidth
          >
            Upload Image
            <input type="file" accept="image/*" hidden onChange={handleImageUpload} />
          </Button>
        )}

        {data.imageSrc && (
          <>
            <Box style={styles.zoomSlider}>
              <Typography>Zoom</Typography>
              <Slider
                value={data.zoom}
                min={1}
                max={3}
                step={0.1}
                onChange={(e, newValue) => setData((prevData) => ({ ...prevData, zoom: newValue }))}
              />
            </Box>
            <Box style={styles.imageActions}>
              <Button variant="contained" onClick={handleSaveImage} style={styles.button}>
                Save Image
              </Button>
              <Button
                variant="contained"
                color="error"
                onClick={handleDeleteImage}
                startIcon={<DeleteIcon />}
                style={styles.deleteButton}
              >
                Delete Image
              </Button>
            </Box>
          </>
        )}
      </div>

      <Typography style={styles.sectionTitle}>Registered Business Address</Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} md = {6}>
          <TextField id="Street" label="Street" value={data.Street} onChange={handleChange} fullWidth style={styles.formField} />
        </Grid>
        <Grid item xs={12} md = {6}>
          <TextField id="Barangay" label="Barangay" value={data.Barangay} onChange={handleChange} fullWidth style={styles.formField} />
        </Grid>
      </Grid>
      <Grid container spacing={2}>
       <Grid item xs={12} md = {6}>
          <TextField id="City" label="Municipality / City" value={data.City} onChange={handleChange} fullWidth style={styles.formField} />
        </Grid>
        <Grid item xs={12} md = {6}>
          <TextField type ="number" id="ZipCode" label="Zip Code" value={data.ZipCode} onChange={handleChange} fullWidth style={styles.formField} />
        </Grid>
      </Grid>

      <Typography style={styles.sectionTitle}>Legal Representative Information</Typography>
      <Typography style={styles.sectionDescription}>
        Providing the details of your company's legal representatives is crucial for regulatory compliance and ensuring accurate business records. This information helps us verify the legitimacy of your business and establish a point of contact for any official communications or legal matters.
      </Typography>

      {data.legalRepresentatives.map((rep, index) => (
      <Box key={rep.id} style={styles.legalRepContainer}>
        <Typography variant="h6" style={styles.legalRepTitle}>
          Legal Representative {index + 1}
        </Typography>
        <TextField
          label="First Name"
          value={rep.firstName}
          onChange={(e) => handleLegalRepChange(rep.id, 'firstName', e.target.value)}
          fullWidth
          style={styles.formField}
        />
        <TextField
          label="Last Name"
          value={rep.lastName}
          onChange={(e) => handleLegalRepChange(rep.id, 'lastName', e.target.value)}
          fullWidth
          style={styles.formField}
        />
        <TextField
          label="Email"
          value={rep.email}
          onChange={(e) => handleLegalRepChange(rep.id, 'email', e.target.value)}
          fullWidth
          style={styles.formField}
          helperText={errors.email}
          error={!!errors.email}
        />
        <Grid container spacing={1}>
          <Grid item xs={4}>
            <Select
              value={rep.countryCode}
              onChange={(e) => handleCountryCodeChange(rep.id, e.target.value)}
              fullWidth
              style={styles.countryCodeSelect}
            >
              {countryCodes.map((country) => (
                <MenuItem key={country.code} value={country.code}>
                  {country.label}
                </MenuItem>
              ))}
            </Select>
          </Grid>
          <Grid item xs={8}>
            <TextField
              label="Phone Number"
              value={rep.phone}
              onChange={(e) => handleLegalRepChange(rep.id, 'phone', e.target.value)}
              fullWidth
              style={styles.formField}
              InputProps={{
                startAdornment: <InputAdornment position="start">{rep.countryCode}</InputAdornment>,
              }}
              helperText={errors.phone}
              error={!!errors.phone}
            />
          </Grid>
        </Grid>
        <TextField
          label="Position"
          value={rep.position}
          onChange={(e) => handleLegalRepChange(rep.id, 'position', e.target.value)}
          fullWidth
          style={styles.formField}
        />
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            label="Date of Birth"
            value={rep.dob ? dayjs(rep.dob, 'MM-DD-YYYY') : null}
            onChange={(newDate) => handleLegalRepChange(rep.id, 'dob', newDate)}
            renderInput={(params) => <TextField {...params} fullWidth />}
            maxDate={minDate}
          />
        </LocalizationProvider>

        {index > 0 && (
          <Button
            variant="contained"
            color="error"
            onClick={() => handleDeleteLegalRep(rep.id)}
            startIcon={<DeleteIcon />}
            style={styles.deleteButton}
          >
            Delete Legal Representative
          </Button>
        )}
      </Box>
    ))}


      <Button
        variant="contained"
        onClick={addLegalRepresentative}
        style={styles.button}
      >
        Add New Legal Representative
      </Button>
    </div>
  );
}