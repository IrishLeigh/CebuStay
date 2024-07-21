import React, { useState, useEffect, useCallback } from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Container from "@mui/material/Container";
import { RadioGroup } from '@mui/material';
import FormControlLabel from '@mui/material/FormControlLabel';
import Radio from '@mui/material/Radio';
import IndividualHost from './individualHost';
import CompanyHost from './companyHost';
import Button from '@mui/material/Button';
import '../../../components/Button/NextButton.css';

export default function PartnerVerification({ onHostDataChange, parentPartnerData, handleSubmit, handleBack,openModal }) {
  const [hostType, setHostType] = useState('');
  const [individualData, setIndividualData] = useState({});
  const [companyData, setCompanyData] = useState({});

  useEffect(() => {
    if (parentPartnerData) {
      setHostType(parentPartnerData.hostType || '');
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

  const memoizedOnHostDataChange = useCallback(onHostDataChange, []);

  useEffect(() => {
    const dataToSend = hostType === 'Individual' ? { hostType, ...individualData } : { hostType, ...companyData };
    memoizedOnHostDataChange(dataToSend);
  }, [hostType, individualData, companyData, memoizedOnHostDataChange]);

  const validateAndProceed = () => {
    if ((hostType === 'Individual' && Object.keys(individualData).length > 0) ||
        (hostType === 'Company' && Object.keys(companyData).length > 0)) {
      const dataToSend = hostType === 'Individual' ? { hostType, ...individualData } : { hostType, ...companyData };
      onHostDataChange(dataToSend);
      openModal();
  
    } else {
      alert("Please provide the necessary information.");
    }
  };

  return (
    <Container
      maxWidth="lg"
      className='centered-container'
    >
      <Box
       
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <Typography sx={{ fontSize: "2rem" }} fontWeight="bold">
              Compliance and Trust
            </Typography>

            <Typography sx={{ fontSize: "1.5rem", width: "100%" }} mb={2} >
              For verification, please tell us who you are.
            </Typography>
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
      <div className="stepperFooter">
        <Button onClick={handleBack} className="stepperPrevious">
          Back
        </Button>
        <Button onClick={validateAndProceed} className="stepperNext">
          Finish
        </Button>
      </div>
    </Container>
  );
}
