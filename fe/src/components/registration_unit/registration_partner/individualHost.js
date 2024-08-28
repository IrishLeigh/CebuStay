import React, { useState, useEffect } from 'react';
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



export default function IndividualHost({ onDataChange }) {
  const [data, setData] = useState({
    FirstName: '',
    LastName: '',
    DateOfBirth: '',
    DisplayName: '',
    PhoneNumber: '',
    Email: '',
    City: '',
    Province: '',
    ZipCode: '',
    PrimaryAddress: '',
    Describe: '',
    CalendarLink: '',
    UploadedImage: null,
    
  });
  const [uploadedImage, setUploadedImage] = useState(null);




  useEffect(() => {
    onDataChange(data); // Callback to parent component when data changes
  }, [data, onDataChange]);

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    setData((prevData) => ({
      ...prevData,
      UploadedImage: file,
    }));
  };
  



  const handleDeleteImage = () => {
    setUploadedImage(null);
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
    DateOfBirth: date.isValid ? date.format('YYYY-MM-DD') : '', // Update DateOfBirth field with formatted date
  }));
};

  return (
    <div>
      <Typography sx={{ fontSize: "1.5rem" }} mb={2} mt={6} fontWeight="bold">
        Host Details
      </Typography>
      {/* Upload Image */}
      <div style={{
        border: '2px dashed #ccc',
        padding: '1rem',
        borderRadius: '0.8rem',
        marginBottom: '1rem',
      }}>
        <Typography sx={{ fontSize: "1.125rem" }}>
          Upload your profile photo
        </Typography>
        <Button
          component="label"
          role={undefined}
          variant="contained"
          tabIndex={-1}
          startIcon={<CloudUploadIcon />}
          sx={{width:'100%'}}
        >
          Upload file
          <VisuallyHiddenInput type="file" onChange={handleImageUpload} />
        </Button>
        {uploadedImage && (
          <div>
            <div style={{display:'flex', alignItems:'center'}}>
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
        border: '2px dashed #cacaca',
        padding: '1rem',
        borderRadius: '10px',
        mt:3
      }}
      >
        <Typography sx={{ fontSize: "1.125rem" }}  ml={1} fontWeight="bold">
          Profile
        </Typography>
        <Box
          component="form"
          sx={{
            '& .MuiTextField-root': { m: 1, width: '25ch' },
          }}
          noValidate
          autoComplete="off"
        >
          <div>
            <TextField
              id="FirstName"
              label="First Name"
              value={data.FirstName}
              onChange={handleChange}
            />
            <TextField
              id="LastName"
              label="Last Name"
              value={data.LastName}
              onChange={handleChange}
            />
          </div>
          <div>
            <Typography sx={{ fontSize: "1rem" ,ml:1, mt:2}}>This is the name that will be shown on CebuStay website and app.</Typography>
            <TextField
              id="DisplayName"
              label="Display Name"
              value={data.DisplayName}
              onChange={handleChange}
            />
          </div>
          <div>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DemoContainer components={['DatePicker']}>
            <DatePicker 
              id = "DateOfBirth"
              label="Date of Birth"
              value={data.DateOfBirth ? dayjs(data.DateOfBirth) : null}
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
        border: '2px dashed #cacaca',
        padding: '1rem',
        borderRadius: '10px',
        mt:3
      }}
      >
        <Typography sx={{ fontSize: "1.125rem" }}  ml={1} fontWeight="bold">
          Contact Details
        </Typography>
        <Box
          component="form"
          sx={{
            '& .MuiTextField-root': { m: 1, width: '25ch' },
          }}
          noValidate
          autoComplete="off"
        >
          <div>
            <TextField
              id="PhoneNumber"
              label="Phone Number"
              sx={{width:'30%'}}
              value={data.PhoneNumber}
              onChange={handleChange}
            />
            <TextField
              id="Email"
              label="Email"
              sx={{width:'50%'}}
              value={data.Email}
              onChange={handleChange}
            />
          </div>
        </Box>
      </div>
      {/* Location Details */}
      <div 
      style={{
        border: '2px dashed #cacaca',
        padding: '1rem',
        borderRadius: '10px',
        mt:3
      }}
      >
        <Typography sx={{ fontSize: "1.125rem" }}  ml={1} fontWeight="bold">
          Location Details
        </Typography>
        <Box
          component="form"
          sx={{
            '& .MuiTextField-root': { m: 1 },
          }}
          noValidate
          autoComplete="off"
        >
          <div>
            <div>
              <Typography sx={{ fontSize: "1rem" ,ml:1, mt:2}}>Where You Live</Typography>
              <TextField
                id="City"
                label="City"
                value={data.City}
                onChange={handleChange}
              />
              <TextField
              id="Province"
              label="Province"
              value={data.Province}
              onChange={handleChange}
              
            />
            <TextField
              id="ZipCode"
              label="Zip Code"
              value={data.ZipCode}
              onChange={handleChange}
              
            />
            </div>
              <TextField
                id="PrimaryAddress"
                label="Primary Address"
                value={data.PrimaryAddress}
                onChange={handleChange}
                fullWidth
              />
          </div>
        </Box>
      </div>
      {/* Describe YourSelf */}
      <div 
      style={{
        border: '2px dashed #cacaca',
        padding: '1rem',
        borderRadius: '10px',
        mt:3
      }}
      >
        <Typography sx={{ fontSize: "1.125rem" }}  ml={1} mb={2} fontWeight="bold">
          Describe Yourself
        </Typography>
        <Box
          component="form"
          sx={{
            '& .MuiTextField-root': { ml: 1, mr:1 },
          }}
          noValidate
          autoComplete="off"
        >
            <TextField
              id="Describe"
              label = "Say something about yourself as a host "
              multiline
              rows={6}
              value={data.Describe}
              onChange={handleChange}
              fullWidth
            />
        </Box>
      </div>
      {/* Calendar */}
      <div 
      style={{
        border: '2px dashed #cacaca',
        padding: '1rem',
        borderRadius: '10px',
        mt:3
      }}
      >
        <Typography sx={{ fontSize: "1.125rem" }}  ml={1} mb={2} fontWeight="bold">
          Calendar Sync
        </Typography>
        <Typography sx={{ fontSize: "1rem" }}  ml={1} mb={1} >
           Provide URLs for importing your calendars from our supported company list, and we’ll automatically update your property’s availability on Agoda Homes with information from each.
        </Typography>
        <Box
          component="form"
          sx={{
            '& .MuiTextField-root': { ml: 1, mr:1 },
          }}
          noValidate
          autoComplete="off"
        >
            <TextField
              id="CalendarLink"
              label = "Calendar Link"
              value={data.CalendarLink}
              onChange={handleChange}
              fullWidth
            />
        </Box>
      </div>
    </div>
  );
}
