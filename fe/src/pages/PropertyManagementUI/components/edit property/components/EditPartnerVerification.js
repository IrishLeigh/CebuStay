import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Container from "@mui/material/Container";
import { Divider, Grid, RadioGroup, FormControlLabel, Radio, Button } from '@mui/material';
import IndividualHost from './individualHost';
import CompanyHost from './companyHost';
import { Crop } from '@mui/icons-material';
import { Last } from 'react-bootstrap/esm/PageItem';
import TemplateFrameEdit from './TemplateFrame';

export default function EditPartnerVerification({ parentPartnerData}) {
  const [hostType, setHostType] = useState('');
  const [individualData, setIndividualData] = useState({});
  const [companyData, setCompanyData] = useState({});
  const [ isEditing, setIsEditing ] = useState(false);
  const [ hasChanges, setHasChanges ] = useState(false);
  const [ isSaved, setIsSaved] = useState(false);

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
      // handleCancel();
      
    }
   
    
  };
  console.log("Parent partner data in edit partner veriofication", parentPartnerData);

  const validateAndProceed = () => {
    // Mapping of field keys to user-friendly names
    const fieldLabels = {
      firstName: "First Name",
      lastName: "Last Name",
      email: "Email Address",
      phoneNumber: "Phone Number",
      FirstName: "First Name",
      LastName: "Last Name",
      croppedAreaPixels : "Image",
      imageSrc : "Image",
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
  
    // If no validation errors, proceed to submit the data
    const dataToSend = hostType === 'Individual' ? { hostType, ...individualData } : { hostType, ...companyData };
    // onHostDataChange(dataToSend);
    // openModal();
    alert("Successfully submitted!");
  };
  
  
  console.log ("hostType", hostType);
  console.log ("individualData", parentPartnerData);
  console.log ("companyData", parentPartnerData);


  return (
  <>
  {/* <TemplateFrameEdit onEditChange={handleEditingChange} saved={isSaved}  onSave={handleSave} hasChanges={hasChanges}  cancel={handleCancel}/> */}
     
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
                />
                <FormControlLabel
                  value="Company"
                  control={<Radio />}
                  label={
                    <Typography sx={{ fontFamily: "Poppins, sans-serif", }}>
                      I represent a company.
                    </Typography>
                  }
                />
              </RadioGroup>
              <Divider sx={{ my: 2 }} />
              {hostType === 'Individual' && <IndividualHost onDataChange={handleIndividualDataChange}  parentData={parentPartnerData}/>}
              {hostType === 'Company' && <CompanyHost onDataChange={handleCompanyDataChange} parentData={parentPartnerData} />}
          
          </Paper>

    </>
  );
}
