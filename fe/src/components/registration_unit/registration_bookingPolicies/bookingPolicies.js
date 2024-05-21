import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Checkbox from '@mui/material/Checkbox';
import TextField from '@mui/material/TextField';
import TextFieldOutlineShort from "../../textfield_short_withOutline";
import LightbulbTwoToneIcon from '@mui/icons-material/LightbulbTwoTone';

export default function Policies({ onPoliciesDataChange }) {
  const [policiesData, setPoliciesData] = useState(() => {
    const savedData = localStorage.getItem('policiesData');
    return savedData ? JSON.parse(savedData) : {
      standardCancellation: false,
      nonRefundableRate: false,
      modificationPlan: false,
      offerDiscounts: false,
      cancellationDays: ''
    };
  });

  useEffect(() => {
    localStorage.setItem('policiesData', JSON.stringify(policiesData));
    onPoliciesDataChange(policiesData);
  }, [policiesData, onPoliciesDataChange]);

  const handleDaysChange = (newValue) => {
    setPoliciesData(prevData => ({
      ...prevData,
      cancellationDays: newValue // Update cancellationDays in policiesData
    }));
  };

  const handleCheckboxChange = (event) => {
    const { name, checked } = event.target;
    setPoliciesData(prevData => ({
      ...prevData,
      [name]: checked
    }));
  };

  return (
    <Box>
      <Grid
        container
        spacing={2}
        sx={{
          height: "100%",
          alignItems: "center",
          justifyContent: "center",
          // mt: 12
        }}
      >
        <Grid item xs={6} sx={{ textAlign: "left" }}>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              textAlign: "left",
              mt: 12,
              mb: 12
            }}
          >
            <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 2}}>
              Booking Policies and Payment Methods
            </Typography>
            <Typography sx={{ fontSize: 18, mb: 2 }}>
              Embark on a smooth booking adventure with our reservation policies and flexible payment options
            </Typography>
            <Paper 
              elevation={3} 
              sx={{ p: 2, display: "flex", flexDirection: "column", alignItems: "left" }}
            >
              {/*Rate Plans*/}
              <form>
                <Box>
                  <Typography sx={{ fontWeight: 'bold', fontSize: 18, m: 2 }}>
                    Reservation Options
                  </Typography>

                  <Checkbox
                    name="standardCancellation"
                    checked={policiesData.standardCancellation}
                    onChange={handleCheckboxChange}
                    color="secondary"
                  /> Standard Cancellation Plan

                  <br />
                  {policiesData.standardCancellation && (
                    <Box sx={{ border: '1px dotted black', p: 2, width:'500px', m:2, height: 'auto' }}>
                      {/* Details of Cancellation Plan */}
                      <Typography>
                        Within how many days prior to their arrival can guests cancel their booking without any charges?
                      </Typography>
                      <br />
                      <TextFieldOutlineShort
                        width="150"
                        label="Number of Days"
                        value={policiesData.cancellationDays}
                        onDaysChange={handleDaysChange} // Pass the handleDaysChange callback
                      />
                      <br/>
                      <Typography sx={{ fontSize: '14px', display: 'flex', alignItems: 'center', justifyContent: 'left'}}>
                        <LightbulbTwoToneIcon sx={{ fontSize: '14px', color: 'orange' }} />
                        The guest will receive a 25% refund if they cancel outside the free cancellation window.
                      </Typography>
                    </Box>
                  )}
                  <Checkbox
                    name="nonRefundableRate"
                    checked={policiesData.nonRefundableRate}
                    onChange={handleCheckboxChange}
                    color="secondary"
                  /> Non-refundable Rate Plan
                  <br />
                  {policiesData.nonRefundableRate && (
                    <Box sx={{ border: '1px dotted black', p: '8', width:'600px', m:2, height: 'auto' }}>
                      {/* Details of Non-refundable plan */}
                    </Box>
                  )}
                  <Checkbox
                    name="modificationPlan"
                    checked={policiesData.modificationPlan}
                    onChange={handleCheckboxChange}
                    color="secondary"
                  /> Modification Plan
                  <br />
                  {policiesData.modificationPlan && (
                    <Box sx={{ border: '1px dotted black', p: '8', width:'600px', m:2, height: 'auto' }}>
                      {/* Details of Modification Plan */}
                    </Box>
                  )}
                  <Checkbox
                    name="offerDiscounts"
                    checked={policiesData.offerDiscounts}
                    onChange={handleCheckboxChange}
                    color="secondary"
                  /> Offer Discounts
                  <br />
                  {policiesData.offerDiscounts && (
                    <Box sx={{ border: '1px dotted black', p: '8', width:'600px', m:2, height: 'auto' }}>
                      {/* Details of Offer Discounts */}
                    </Box>
                  )}
                </Box>
              </form>
            </Paper>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}
