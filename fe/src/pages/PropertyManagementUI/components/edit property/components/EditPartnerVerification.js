import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Container from "@mui/material/Container";
import { Divider, Grid, RadioGroup, FormControlLabel, Radio, Button } from '@mui/material';

import { Crop } from '@mui/icons-material';
import { Last } from 'react-bootstrap/esm/PageItem';
import TemplateFrameEdit from './TemplateFrame';
import IndividualHost from './EditIndividualHost';
import CompanyHost from './EditCompanyHost';

export default function EditPartnerVerification({ parentPartnerData, onSaveStatusChange}) {
  const [hostType, setHostType] = useState('');
  const [individualData, setIndividualData] = useState();
  const [companyData, setCompanyData] = useState();
  const [ isEditing, setIsEditing ] = useState(false);
  const [ hasChanges, setHasChanges ] = useState(false);
  const [ isSaved, setIsSaved] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [ originalIndividualData, setOriginalIndividualData ] = useState({});
  const [ originalCompanyData, setOriginalCompanyData ] = useState({});

  useEffect(() => {
    if (parentPartnerData) {
      setHostType(parentPartnerData.property_ownership.ownershiptype || '');
      if (parentPartnerData.hostType === 'Individual') {
        setIndividualData(parentPartnerData);
       
      } else if (parentPartnerData.hostType === 'Company') {
        setCompanyData(parentPartnerData);
       
      }
    }
  }, [parentPartnerData]);

  const handleChange = (event) => {
    setHostType(event.target.value);
  };

  const handleHasChangesChange = (hasChanges) => {
    setHasChanges(hasChanges);
  }
  const handleIndividualDataChange = (data) => {
    setIndividualData(data);
  };

  const handleCompanyDataChange = (data) => {
    setCompanyData(data);
  };

  // useEffect(() => {
  //   const dataToSend = hostType === 'Individual' ? { hostType, ...individualData } : { hostType, ...companyData };
  //   onHostDataChange(dataToSend);
  // }, [hostType, individualData, companyData, onHostDataChange]);
  
  const handleEditingChange = (editing) => {
    if (editing === true) {
      setIsEditing(editing);
    }else if (editing === false) {
      handleCancel();
      
    }
   
    console.log(`Editing mode changed: ${editing}`); // Log or use this state as needed
  };
  console.log("Parent partner data in edit partner veriofication", parentPartnerData);

  const validateAndProceed = () => {
    // Mapping of field keys to user-friendly names
    const fieldLabels = {
      firstName: "First Name",
      lastName: "Last Name",
      email: "Email Address",
      phoneNumber: "Phone Number",
      DateOfBirth: "Date of Birth",
      DisplayName: "Display Name",
      // Add more fields as necessary
    };
  
    // Helper function to check for empty fields and map to friendly names
    const getEmptyFields = (data) => {
      if (Object.keys(data).length === 0) {
        return ['No information has been filled out yet. Please complete the required fields before proceeding.'];
      }
      return Object.keys(data).filter(key => !data[key]).map(key => fieldLabels[key] || key);
    };
  
    // Validate Individual host data
    if (hostType === 'Individual') {
      const emptyFields = getEmptyFields(individualData);
      if (emptyFields.length > 0) {
        alert(`Please fill in the following required information for the individual host: ${emptyFields.join(', ')}.`);
        return;
      }
    }
  
    // Validate Company host data
    if (hostType === 'Company') {
      const emptyFields = getEmptyFields(companyData);
      if (emptyFields.length > 0) {
        alert(`Please provide the following required details for the company host: ${emptyFields.join(', ')}.`);
        return;
      }
    }
  
    // Validate phone number and email for both types
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.(com|org|net|edu|gov|info|io|co)$/;
    const phoneWithCountryCode = `${individualData.countryCode}${individualData.phoneNumber || companyData.phoneNumber}`;
    
    // Define phone number patterns based on country code
    const phonePatterns = {
      '+1': /^\+1\d{10}$/, // USA/Canada (1 country code and 10 digits)
      '+63': /^\+63\d{10}$/, // Philippines (63 country code and 10 digits)
      '+44': /^\+44\d{10}$/, // UK (44 country code and 10 digits)
      // Add more country codes and patterns as needed
    };
  
    const pattern = phonePatterns[individualData.countryCode] || /^\+[1-9]\d{1,14}$/;  // Default for other countries
  
    // Check email validity
    if (!emailPattern.test(individualData.email || companyData.email)) {
      alert('Invalid email address. Please enter a valid email.');
      return;
    }
  
    // Check phone number validity
    if (!pattern.test(phoneWithCountryCode)) {
      alert('Invalid phone number. Please enter a valid phone number.');
      return;
    }
  
    // If no validation errors, proceed to submit the data
    const dataToSend = hostType === 'Individual' ? { hostType, ...individualData } : { hostType, ...companyData };
    // onHostDataChange(dataToSend);
    // openModal();
    alert("Successfully submitted!");
  };
  //handle Save for Edit
  const handleSave = async () => {
    setIsLoading(true);
    setIsEditing(false);
    // Gather the data to be sent to the API
    const dataToSend = hostType === 'Individual' ? { hostType, ...individualData } : { hostType, ...companyData };
   
    try {
      console.log("Saving data:", dataToSend);
      //After saving data, set isSaved to true
      setIsSaved(true);
      setIsEditing(false);
      setOpenSnackbar(true);
      onSaveStatusChange('Saved');
      setIsLoading(false);
        
      
    } catch (error) {
      console.log("Error saving data:", error);
    }
  

  };
  const handleCancel = () => {
    if (hasChanges) {
      const confirmDiscard = window.confirm("You have unsaved changes. Are you sure you want to discard them?");
      if (confirmDiscard) {
        // Reset the form data to the initial state
        if (hostType === 'Individual') {
          setIndividualData(parentPartnerData);
        } else if (hostType === 'Company') {
          setCompanyData(parentPartnerData);
        }
        setHasChanges(false);
        setIsEditing(false);  // Exit edit mode
      }
    } else {
      // No changes, just exit edit mode
      setIsEditing(false);
    }
  };
  console.log ("hostType", hostType);
  console.log ("individualData", individualData);
  console.log ("companyData", companyData);


  return (
    <>
    <TemplateFrameEdit onEditChange={handleEditingChange} saved={isSaved}  onSave={handleSave} hasChanges={hasChanges}  cancel={handleCancel}/>
     
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
                Accommodation Ownership
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
          
          To ensure compliance with legal and regulatory standards, we require some information about you and your property.
        </Typography>

        <RadioGroup
          aria-labelledby="Host"
          name="host"
          value={hostType}
          onChange={handleChange}
          
        >
          <FormControlLabel
            value="Individual"
            control={<Radio />}
            label={
              <Typography sx={{ fontFamily: "Poppins, sans-serif", }}>
                I am the host representing myself.
              </Typography>
            }
            disabled = {!isEditing}
          />
          <FormControlLabel
            value="Company"
            control={<Radio />}
            label={
              <Typography sx={{ fontFamily: "Poppins, sans-serif", }}>
                I represent a company.
              </Typography>
            }
            disabled = {!isEditing}
          />
        </RadioGroup>
        <Divider sx={{ my: 2 }} />
        {hostType === 'Individual' && <IndividualHost onDataChange={handleIndividualDataChange}  parentData={parentPartnerData} isEditing={isEditing}  />}
        {hostType === 'Company' && <CompanyHost onDataChange={handleCompanyDataChange} parentData={parentPartnerData} />}
      </Paper>

    </>
  );
}
