import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Container from "@mui/material/Container";
import { Divider, Grid, RadioGroup, FormControlLabel, Radio, Button, useTheme, useMediaQuery } from '@mui/material';

import { Crop } from '@mui/icons-material';
import { Last } from 'react-bootstrap/esm/PageItem';
import TemplateFrameEdit from './TemplateFrame';
import IndividualHost from './EditIndividualHost';
import CompanyHost from './EditCompanyHost';
import axios from 'axios';

export default function EditPartnerVerification({ parentPartnerData, onSaveStatusChange, propertyid}) {
  const [hostType, setHostType] = useState('');
  const [individualData, setIndividualData] = useState();
  const [companyData, setCompanyData] = useState();
  const [ isEditing, setIsEditing ] = useState(false);
  const [ hasChanges, setHasChanges ] = useState(false);
  const [ isSaved, setIsSaved] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm')); 

  const [isCancelled, setIsCancelled] = useState(false);

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
    setHasChanges(true);
    console.log ("haschnage sin handleCHange", hasChanges)
  };

  const handleHasChangesChange = (hasChanges) => {
    setHasChanges(hasChanges);
  }
  const handleIndividualDataChange = (data) => {
    setIndividualData(data);
    setHasChanges(true);
    console.log ("haschnage sin handleIdntialDataChange", hasChanges)
  };

  const handleCompanyDataChange = (data) => {
    setCompanyData(data);
    setHasChanges(true);
  };

  // useEffect(() => {
  //   const dataToSend = hostType === 'Individual' ? { hostType, ...individualData } : { hostType, ...companyData };
  //   onHostDataChange(dataToSend);
  // }, [hostType, individualData, companyData, onHostDataChange]);
  
  const handleEditingChange = (editing) => {
    if (editing === true) {
      setIsEditing(editing);
      setIsCancelled(false);
      setHasChanges(false);
    }else if (editing === false) {
      handleCancel();
      setIsCancelled(true);
      
    }
   
    console.log(`Editing mode changed: ${editing}`); // Log or use this state as needed
  };


  const validateAndProceed = () => {
    // Mapping of field keys to user-friendly names
    const fieldLabels = {
      firstName: "First Name",
      lastName: "Last Name",
      Email: "Email Address",
      PhoneNumber: "Phone Number",
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
    const phoneWithCountryCode = `${individualData.countryCode}${individualData.PhoneNumber || companyData.PhoneNumber}`;
    
    // Define phone number patterns based on country code
    const phonePatterns = {
      '+1': /^\+1\d{10}$/, // USA/Canada (1 country code and 10 digits)
      '+63': /^\+63\d{10}$/, // Philippines (63 country code and 10 digits)
      '+44': /^\+44\d{10}$/, // UK (44 country code and 10 digits)
      // Add more country codes and patterns as needed
    };
  
    const pattern = phonePatterns[individualData.countryCode] || /^\+[1-9]\d{1,14}$/;  // Default for other countries
  
    // Check email validity
    if (!emailPattern.test(individualData.Email || companyData.email)) {
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
  const onSubmitIndividual = async () => {
    if (!validateAndProceed()) {
      return;
    }
    setIsLoading(true);
    setIsEditing(false);
    // Gather the data to be sent to the API
    const dataToSend = hostType === 'Individual' ? { hostType, ...individualData } : { hostType, ...companyData };
   //propertyowner
   console.log("WHAT TO SEND?",dataToSend);
   
    try {
      const propertyownerid = dataToSend.id;
      const res = await axios.post(
        `http://127.0.0.1:8000/api/property-owners/${propertyownerid},`,
        {

          propertyownershipid: dataToSend.propertyownershipid,
          firstname: dataToSend.FirstName,
          lastname: dataToSend.LastName,
          displayname: dataToSend.DisplayName,
          dateofbirth: dataToSend.DateOfBirth,
          email: dataToSend.Email,
          contactnumber: dataToSend.phoneNumber,
          street: dataToSend.Street,
          barangay: dataToSend.Barangay,
          city : dataToSend.City,
          zipcode : dataToSend.Zipcode,
          describe : dataToSend.Describe,
          calendar: "",
          primary_address:"address",
        }
      );
      if (res.data.status === "success") {
        console.log(res.data);

        setIsSaved(true);
        onSaveStatusChange('Saved');
        setHasChanges(false); 
        setIsEditing(false);
        setIsCancelled(false);
        setIsLoading(false);
        setOpenSnackbar(true);
        console.log("success");
      }
    } catch (error) {
      console.error(error);
    }
   
  };
  const onSubmitCompany = async () => {
    setIsLoading(true);
    setIsEditing(false);
  
    // Gather the data to be sent to the API
    const dataToSend = hostType === 'Individual' ? { hostType, ...individualData } : { hostType, ...companyData };
  
    console.log("WHAT TO SEND SA COMPANY?", dataToSend);
  
    try {
      const companyid = dataToSend.companyid;
      console.log("companyid", companyid);
  
      // Send the company data
      const res = await axios.post(
        `http://127.0.0.1:8000/api/property-companies/${companyid}`,
        {
          propertyownershipid: dataToSend.propertyownershipid,
          legal_business_name: dataToSend.LegalBusinessName,
          company_description: dataToSend.describe,
          street: dataToSend.Street,
          email: dataToSend.Email,
          barangay: dataToSend.Barangay,
          city: dataToSend.City,
          zipcode: dataToSend.Zipcode,
        }
      );
  
      if (res.data) {
        console.log("SUCCESS:", res.data);
      } else {
        console.error('Error saving company:', res.data);
      }
  
      // Send the legal representatives data
    const legalRepresentatives = dataToSend.legalrepresentatives || []; // Ensure it's an array
      console.log("legalRepresentatives  SA COMPANY?", legalRepresentatives);
    // Using Promise.all to handle all legal representatives requests
    const legalPromises = legalRepresentatives.map(async (representative) => {
      try {
        const res2 = await axios.post(
          `http://127.0.0.1:8000/api/legal-representative/${representative.id}`,
          {
            propertycompanyid: companyid,
            firstname: representative.firstname,
            lastname: representative.lastname,
            phone_number: representative.phone,
            email: representative.email,
            position: representative.position,
          }
        );

        if (res2.data) {
          console.log('Legal representative saved successfully:', res2.data);
        } else {
          console.error('Error saving legal representative:', res2.data);
        }
      } catch (error) {
        console.error('Error saving legal representative:', error);
      }
    });

    // Wait for all legal representatives to be processed
    await Promise.all(legalPromises);
  
      // Set the status to saved after all operations
      setIsSaved(true);
      onSaveStatusChange('Saved');
      setHasChanges(false);
      setIsEditing(false);
      setIsCancelled(false);
      setOpenSnackbar(true);
      console.log("All operations completed successfully.");
  
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false); // Ensure loading state is reset
    }
  };
  
  const handleSave = () => {
     // Gather the data to be sent to the API
     const dataToSend = hostType === 'Individual' ? { hostType, ...individualData } : { hostType, ...companyData };
     if (hostType === 'Individual') {
       onSubmitIndividual();
       
     }else if (hostType === 'Company') {
       onSubmitCompany();
     }
  }

  
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
  console.log ("hasCHnages", hasChanges);


  return (
    <>
    <TemplateFrameEdit onEditChange={handleEditingChange} saved={isSaved}  onSave={handleSave} hasChanges={hasChanges}  cancel={handleCancel}/>
     
      <Paper
        style={{
          width: "auto",
          padding:isMobile ? "1rem" : "4rem",
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

        {/* <RadioGroup
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
        </RadioGroup> */}
        <Divider sx={{ my: 2 }} />
        {hostType === 'Individual' && <IndividualHost onDataChange={handleIndividualDataChange}  parentData={parentPartnerData} isEditing={isEditing}  isCancelled={isCancelled}/>}
        {hostType === 'Company' && <CompanyHost onDataChange={handleCompanyDataChange} parentData={parentPartnerData}  isEditing={isEditing}  isCancelled={isCancelled}/>}
      </Paper>

    </>
  );
}
