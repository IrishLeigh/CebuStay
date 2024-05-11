import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Container from "@mui/material/Container";
import { RadioGroup } from '@mui/material';
import FormControlLabel from '@mui/material/FormControlLabel';
import Radio from '@mui/material/Radio';
import Button from '@mui/material/Button'; // Add this import 
import IndividualHost from './individualHost';
import CompanyHost from './companyHost';

export default function PartnerVerification({ onHostDataChange }) {
  const [hostType, setHostType] = useState('');
  const [individualData, setIndividualData] = useState({});
  const [companyData, setCompanyData] = useState({});

  const handleChange = (event) => {
    setHostType(event.target.value);
  };

  const handleIndividualDataChange = (data) => {
    setIndividualData(data);
  };

  const handleCompanyDataChange = (data) => {
    setCompanyData(data);
  };

  const handleSave = () => {
    const dataToSend = hostType === 'Individual' ? { hostType, ...individualData } : { hostType, ...companyData };
    console.log("Data to send", dataToSend);
    onHostDataChange(dataToSend);
  };


  return (
    <Container
      maxWidth="md"
      sx={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          textAlign: "left",
          mt: 12,
          mb: 12
        }}
      >
        <Box sx={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
          <div>
            <Typography sx={{ fontSize: "2rem" }} fontWeight="bold">
              Compliance and Trust
            </Typography>

            <Typography sx={{ fontSize: "1.5rem",width: "100%" }} mb={2} >
              For verification, please tell us who you are.
            </Typography>
          </div>
          <div>
            <Button variant="contained" onClick={handleSave}>Save</Button>
          </div>
        </Box>

        <Paper elevation={3} sx={{ p: "2rem", width: "100%" }}>
          <Box
            component="form"
            sx={{
              '& > :not(style)': { my: 1, width: "100%" }
            }}
            autoComplete="off"
          >
            <div>
              <Typography sx={{ fontSize: "1.125rem" }} mb={4} >
                To ensure compliance with legal and regulatory standards, we require some information about you and your property.
              </Typography>
              <Typography sx={{ fontSize: "1.5rem" }} mb={2} fontWeight="bold">
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
                <IndividualHost onDataChange={handleIndividualDataChange} />  
              )}
              {hostType === 'Company' && (
                <CompanyHost onDataChange={handleCompanyDataChange} />
              )}
            </div>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
}
