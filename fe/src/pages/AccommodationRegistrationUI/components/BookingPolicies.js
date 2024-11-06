import React, { useState, useEffect } from 'react';
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Checkbox from '@mui/material/Checkbox';
import TextFieldOutlineShort from "../../../components/textfield_short_withOutline";
import LightbulbTwoToneIcon from '@mui/icons-material/LightbulbTwoTone';
import { Button, Container } from "@mui/material";
import AnimatePage from './AnimatedPage';

export default function Policies({ onPoliciesDataChange, parentPoliciesData, handleNext, handleBack }) {
  const initialPoliciesData = {
    standardCancellation: false,
    nonRefundableRate: false,
    modificationPlan: false,
    offerDiscounts: false,
    cancellationDays: ''
  };

  const [policiesData, setPoliciesData] = useState(initialPoliciesData);
  const [error, setError] = useState("");
  
  useEffect(() => {
    window.scrollTo(0, 0); // Scroll to the top when the component mounts
  }, []);
  useEffect(() => {
    // Update local state when parentPoliciesData change
    if (parentPoliciesData) {
      setPoliciesData(parentPoliciesData);
    } else {
      setPoliciesData(initialPoliciesData); // Ensure it falls back to initialPoliciesData if parentPoliciesData is undefined
    }
  }, [parentPoliciesData]);

  const handleDaysChange = (newValue) => {
    setPoliciesData(prevData => ({
      ...prevData,
      cancellationDays: newValue
    }));
  };

  const handleCheckboxChange = (event) => {
    const { name, checked } = event.target;
    setPoliciesData(prevData => ({
      ...prevData,
      [name]: checked
    }));
  };

  const validateAndProceed = () => {
    if (!policiesData.standardCancellation && !policiesData.nonRefundableRate && !policiesData.modificationPlan && !policiesData.offerDiscounts) {
      alert("Please select at least one reservation option.");
      return;
    }

    if (policiesData.standardCancellation && !policiesData.cancellationDays) {
      alert("Please specify the number of days for standard cancellation.");
      return;
    }

    setError("");
    onPoliciesDataChange(policiesData); // Send updated data to parent
    handleNext(); // Navigate to next component
  };

  return (
    <Container maxWidth="lg">
      <AnimatePage>
        <Grid container spacing={2} className="centered-container">
          <Grid item xs={6} sx={{ textAlign: "left" }}>
            <Box sx={{ display: "flex", flexDirection: "column", textAlign: "left", p: 2, mb: "8rem" }}>
              <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 2 }}>
                Booking Policies and Payment Methods
              </Typography>
              <Typography sx={{ fontSize: 18, mb: 2 }}>
                Embark on a smooth booking adventure with our reservation policies and flexible payment options
              </Typography>
              <Paper elevation={3} sx={{ p: 2, display: "flex", flexDirection: "column", alignItems: "left" }}>
                <form>
                  <Box>
                    <Typography sx={{ fontWeight: 'bold', fontSize: 18, m: 2 }}>
                      Reservation Options
                    </Typography>

                    <Checkbox
                      name="standardCancellation"
                      checked={policiesData.standardCancellation || false} // Default to false if undefined
                      onChange={handleCheckboxChange}
                      color="secondary"
                    /> Standard Cancellation Plan
                    <br />
                    {policiesData.standardCancellation && (
                      <Box sx={{ border: '1px dotted black', p: 2, width: 'auto', m: 2, height: 'auto' }}>
                        <Typography>
                          Within how many days prior to their arrival can guests cancel their booking without any charges?
                        </Typography>
                        <br />
                        <TextFieldOutlineShort
                          width="150"
                          label="Number of Days"
                          value={policiesData.cancellationDays || ''} // Default to empty string if undefined
                          onDaysChange={handleDaysChange}
                        />
                        <br />
                        <Typography sx={{ fontSize: '14px', display: 'flex', alignItems: 'center', justifyContent: 'left' }}>
                          <LightbulbTwoToneIcon sx={{ fontSize: '14px', color: 'orange' }} />
                          The guest will receive a 25% refund if they cancel outside the free cancellation window.
                        </Typography>
                      </Box>
                    )}
                    <Checkbox
                      name="nonRefundableRate"
                      checked={policiesData.nonRefundableRate || false} // Default to false if undefined
                      onChange={handleCheckboxChange}
                      color="secondary"
                    /> Non-refundable Rate Plan
                    <br />
                    <Checkbox
                      name="modificationPlan"
                      checked={policiesData.modificationPlan || false} // Default to false if undefined
                      onChange={handleCheckboxChange}
                      color="secondary"
                    /> Modification Plan
                    <br />
                    <Checkbox
                      name="offerDiscounts"
                      checked={policiesData.offerDiscounts || false} // Default to false if undefined
                      onChange={handleCheckboxChange}
                      color="secondary"
                    /> Offer Discounts
                  </Box>
                </form>
                {error && (
                  <Typography sx={{ color: "red", mt: 2 }}>{error}</Typography>
                )}
              </Paper>
            </Box>
          </Grid>
        </Grid>
      </AnimatePage>
      <div className="stepperFooter">
        <Button onClick={handleBack} className="stepperPrevious">
          Back
        </Button>
        <Button onClick={validateAndProceed} className="stepperNext">
          Next
        </Button>
      </div>
    </Container>
  );
}
