import React, { useState, useEffect, useCallback } from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Container from "@mui/material/Container";
import { RadioGroup } from '@mui/material';
import FormControlLabel from '@mui/material/FormControlLabel';
import Radio from '@mui/material/Radio';
import IndividualHost from './EditIndividualHost';
import CompanyHost from './EditCompanyHost';
import Button from '@mui/material/Button';


export default function EditPartnerVerification({parentPartnerData }) {
  const [hostType, setHostType] = useState('');
  const [individualData, setIndividualData] = useState({});
  const [companyData, setCompanyData] = useState({});
  const [originalData, setOriginalData] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    if (parentPartnerData) {
      setHostType(parentPartnerData.property_ownership.ownershiptype || '');
      console.log("INDIVIDUAL NI:",parentPartnerData.property_ownership.ownershiptype);
      if (parentPartnerData.property_ownership.ownershiptype === 'Individual') {
        setIndividualData(parentPartnerData.parentPartnerData_owner);
      } else if (parentPartnerData.property_ownership.ownershiptype === 'Company') {
        setCompanyData(parentPartnerData.parentPartnerData_owner);
        console.log("COMPANY NI NI:",parentPartnerData.property_ownership.ownershiptype);
      }
    }
    setOriginalData({ ...parentPartnerData });
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

  const handleCancel = () => {
    setIsEditing(false);
    setHasChanges(false);
    setHostType(originalData.hostType || '');
    if (originalData.hostType === 'Individual') {
      setIndividualData(originalData);
    } else if (originalData.hostType === 'Company') {
      setCompanyData(originalData);
    }

  };

  console.log("INDIVVIDUAL DATA:", individualData);
  console.log("Host Type:", hostType);

  return (
    <>
     <Paper style={{ width: "auto", padding: "4rem", borderRadius: "0.8rem", alignItems: "center" }}>
     <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "1rem" }}>
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
       
          <Box
            component="form"
            sx={{
              '& > :not(style)': { my: 1, width: "100%" }
            }}
            autoComplete="off"
          >
            <div>
              <Typography sx={{ fontSize: "1.125rem", fontFamily: "Poppins, sans-serif" }} mb={4} >
                To ensure compliance with legal and regulatory standards, we require some information about you and your property.
              </Typography>
              <Typography sx={{ fontSize: "1.125rem",fontFamily: "Poppins, sans-serif" }} mb={2} fontWeight="bold">
                Accommodation Ownership
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
                    <Typography sx={{ fontSize: "1.125rem" }}>
                      I am the host representing myself.
                    </Typography>
                  }
                />

                <FormControlLabel
                  value="Company"
                  control={<Radio />}
                  label={
                    <Typography sx={{ fontSize: "1.125rem" }}>
                      I represent a company.
                    </Typography>
                  }
                />
              </RadioGroup>
            </div>

            <div>
              {hostType === 'Individual' && (
                <IndividualHost onDataChange={handleIndividualDataChange} isEditing={isEditing}  parentIndividualData={individualData}/>  
              )}
              {hostType === 'Company' && (
                <CompanyHost onDataChange={handleCompanyDataChange} />
              )}
            </div>
          </Box>
        </Paper>
      
    </>
      
    
  );
}
