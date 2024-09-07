import React, { useState, useEffect } from 'react';
import { Box, Paper, Typography, Grid, Checkbox, Button, Container, TextField } from "@mui/material";
import LightbulbTwoToneIcon from '@mui/icons-material/LightbulbTwoTone';
import DateRangeIcon from '@mui/icons-material/DateRange';

import RefundIcon from '@mui/icons-material/CurrencyExchange';
import EditIcon from '@mui/icons-material/Edit';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import SmokeFreeIcon from '@mui/icons-material/SmokeFree';
import PetsIcon from '@mui/icons-material/Pets';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import VolumeOffIcon from '@mui/icons-material/VolumeOff';
import TextFieldOutlineShort from '../../../../components/textfield_short_withOutline';
import AnimatePage from '../AnimatedPage';
import DatePicker from '../../../../components/time';

export default function PropertyRulesPolicies({ onPoliciesDataChange, parentPoliciesData, onHouseRulesDataChange, parentHouseRules, handleNext, handleBack }) {
  const initialPoliciesData = {
    standardCancellation: false,
    nonRefundableRate: false,
    modificationPlan: false,
    offerDiscounts: false,
    cancellationDays: '',
  };

  const [policiesData, setPoliciesData] = useState(initialPoliciesData);
  const [error, setError] = useState("");
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [houseRulesData, setHouseRulesData] = useState(parentHouseRules);

  useEffect(() => {
    // Update local state when parentPoliciesData changes
    setPoliciesData(parentPoliciesData || initialPoliciesData);
  }, [parentPoliciesData]);

  const handleDaysChange = (newValue) => {
    setPoliciesData(prevData => ({
      ...prevData,
      cancellationDays: newValue,
    }));
  };

  const handleCheckboxChange = (event) => {
    const { name, checked } = event.target;
    setPoliciesData(prevData => ({
      ...prevData,
      [name]: checked,
    }));
  };

  const validateAndProceed = () => {
    if (!policiesData.standardCancellation && !policiesData.nonRefundableRate && !policiesData.modificationPlan && !policiesData.offerDiscounts) {
      setError("Please select at least one reservation option.");
      return;
    }

    if (policiesData.standardCancellation && !policiesData.cancellationDays) {
      setError("Please specify the number of days for standard cancellation.");
      return;
    }

    if (!houseRulesData.smokingAllowed && !houseRulesData.petsAllowed && !houseRulesData.partiesAllowed) {
      setError("Please select at least one standard rule.");
      return;
    }

    if (showTimePicker && (!houseRulesData.quietHoursStart || !houseRulesData.quietHoursEnd)) {
      setError("Please specify quiet hours.");
      return;
    }

    if (!houseRulesData.customRules) {
      setError("Please enter your custom rules.");
      return;
    }

    if (!houseRulesData.checkInFrom || !houseRulesData.checkInUntil || !houseRulesData.checkOutFrom || !houseRulesData.checkOutUntil) {
      setError("Please specify check-in and check-out times.");
      return;
    }

    setError("");
    onPoliciesDataChange(policiesData); // Send updated data to parent
    onHouseRulesDataChange(houseRulesData);
    handleNext(); // Navigate to the next component
  };

  return (
    <Container maxWidth="lg">
      <AnimatePage>
        <Box display="flex" justifyContent="center" alignItems="center">
          <Paper
            sx={{
              width: '80vw',
              padding: '2rem',
              borderRadius: '0.8rem',
              boxShadow: 3,
            }}
          >
            <Typography sx={{ fontWeight: 'bold', mb: 2 , fontFamily: 'Poppins',fontSize: "2rem"}} >
              Booking Policies, Rules, and Payment Methods
            </Typography>
            <Typography sx={{ fontFamily: 'Poppins',fontSize: "1rem" ,mb: 2 }}>
              Embark on a smooth booking adventure with our reservation policies and flexible payment options.
            </Typography>
            <form>
              <Box>
                <Typography sx={{ fontWeight: 'bold', fontFamily: 'Poppins',fontSize: "1.125rem", mb: 2,mt:4 }}>
                  Reservation Options
                </Typography>
                <Box display="flex" alignItems="center">
                  <Checkbox
                    name="standardCancellation"
                    checked={policiesData.standardCancellation || false}
                    onChange={handleCheckboxChange}
                    color="secondary"
                  />
                  <DateRangeIcon sx={{ marginRight: 1 }} />
                  Standard Cancellation Plan
                </Box>
                {policiesData.standardCancellation && (
                  <Box sx={{ border: '1px dotted black', p: 2, width: 'auto', m: 2, height: 'auto' }}>
                    <Typography>
                      Within how many days prior to their arrival can guests cancel their booking without any charges?
                    </Typography>
                    <br />
                    <TextFieldOutlineShort
                      width="150"
                      label="Number of Days"
                      value={policiesData.cancellationDays || ''}
                      onDaysChange={handleDaysChange}
                    />
                    <br />
                    <Typography sx={{ fontSize: '0.85rem', display: 'flex', alignItems: 'center', justifyContent: 'left' }}>
                      <LightbulbTwoToneIcon sx={{ fontSize: '14px', color: 'orange' }} />
                      The guest will receive a 25% refund if they cancel outside the free cancellation window.
                    </Typography>
                  </Box>
                )}
                <Box display="flex" alignItems="center">
                  <Checkbox
                    name="nonRefundableRate"
                    checked={policiesData.nonRefundableRate || false}
                    onChange={handleCheckboxChange}
                    color="secondary"
                  />
                  <RefundIcon sx={{ marginRight: 1 }} />
                  Non-refundable Rate Plan
                </Box>
                <Box display="flex" alignItems="center">
                  <Checkbox
                    name="modificationPlan"
                    checked={policiesData.modificationPlan || false}
                    onChange={handleCheckboxChange}
                    color="secondary"
                  />
                  <EditIcon sx={{ marginRight: 1 }} />
                  Modification Plan
                </Box>
                <Box display="flex" alignItems="center">
                  <Checkbox
                    name="offerDiscounts"
                    checked={policiesData.offerDiscounts || false}
                    onChange={handleCheckboxChange}
                    color="secondary"
                  />
                  <LocalOfferIcon sx={{ marginRight: 1 }} />
                  Offer Discounts
                </Box>
              </Box>
            </form>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                textAlign: "left",
              }}
            >
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <Typography sx={{ fontWeight: 'bold', fontFamily: 'Poppins',fontSize: "1.5rem", mb: 2,mt:4 }}>
                    House Rules
                  </Typography>
                  <Typography sx={{ fontSize: "1.25rem", width: "100%" }} mb={2} >
                    Set clear rules for your listing to ensure a smooth and enjoyable stay for your guests
                  </Typography>
                </div>
              </Box>
              
              <Paper elevation={3} sx={{ p: 2, display: "flex", flexDirection: "column", alignItems: "left" }}>
                <form>
                  <Box>
                    <Typography variant="h4" sx={{ fontWeight: 'bold', fontSize: 18, m: 2 }}>Standard Rules</Typography>
                    <Box display="flex" alignItems="center">
                      <Checkbox
                        checked={houseRulesData.smokingAllowed}
                        color="secondary"
                        onChange={(e) => setHouseRulesData(prevData => ({ ...prevData, smokingAllowed: e.target.checked }))}
                      />
                      <SmokeFreeIcon sx={{ marginRight: 1 }} />
                      Smoking Allowed
                    </Box>
                    <Box display="flex" alignItems="center">
                      <Checkbox
                        checked={houseRulesData.petsAllowed}
                        color="secondary"
                        onChange={(e) => setHouseRulesData(prevData => ({ ...prevData, petsAllowed: e.target.checked }))}
                      />
                      <PetsIcon sx={{ marginRight: 1 }} />
                      Pets Allowed
                    </Box>
                    <Box display="flex" alignItems="center">
                      <Checkbox
                        checked={houseRulesData.partiesAllowed}
                        color="secondary"
                        onChange={(e) => setHouseRulesData(prevData => ({ ...prevData, partiesAllowed: e.target.checked }))}
                      />
                      <EventAvailableIcon sx={{ marginRight: 1 }} />
                      Parties/Events Allowed
                    </Box>
                    <Box display="flex" alignItems="center">
                      <Checkbox
                        checked={showTimePicker}
                        onChange={(e) => setShowTimePicker(e.target.checked)}
                        color="secondary"
                      />
                      <VolumeOffIcon sx={{ marginRight: 1 }} />
                      Noise Restrictions
                    </Box>
                    {showTimePicker && (
                      <Box sx={{ border: '1px dotted black', p: 2, width: 'auto', m: 2, height: 'auto' }}>
                        <Typography>
                          Set Quiet Hours
                        </Typography>
                        <Grid container spacing={2}>
                          <Grid item xs={12} md={6}>
                            <DatePicker
                              label="Quiet Hours Start"
                              value={houseRulesData.quietHoursStart}
                              onChange={(newValue) => setHouseRulesData(prevData => ({ ...prevData, quietHoursStart: newValue }))}
                            />
                          </Grid>
                          <Grid item xs={12} md={6}>
                            <DatePicker
                              label="Quiet Hours End"
                              value={houseRulesData.quietHoursEnd}
                              onChange={(newValue) => setHouseRulesData(prevData => ({ ...prevData, quietHoursEnd: newValue }))}
                            />
                          </Grid>
                        </Grid>
                      </Box>
                    )}
                  </Box>
                  <Box>
                    <Typography sx={{ fontWeight: 'bold', fontSize: 18, mt: 2, mb: 1 }}>
                      Custom Rules
                    </Typography>
                    <TextField
                      fullWidth
                      label="Enter your custom rules"
                      variant="outlined"
                      value={houseRulesData.customRules}
                      onChange={(e) => setHouseRulesData(prevData => ({ ...prevData, customRules: e.target.value }))}
                      multiline
                      rows={4}
                    />
                  </Box>
                  <Box>
                    <Typography sx={{ fontWeight: 'bold', fontSize: 18, mt: 2, mb: 1 }}>
                      Check-In and Check-Out Times
                    </Typography>
                    <Typography sx={{ fontSize: 14, color: 'text.secondary', mb: 2 }}>
                      Specify the times when guests can check-in and check-out. Make sure to communicate these times clearly to avoid any misunderstandings.
                    </Typography>
                    <Grid container spacing={2}>
                    <Box sx={{ display: 'flex', justifyContent: 'left', alignItems: 'left', m: 2 }}>
                      <DatePicker
                        title="Check-in From"
                        onChange={(value) => setHouseRulesData(prevData => ({ ...prevData, checkInFrom: value }))}
                        value={houseRulesData.checkInFrom}
                      />
                      <DatePicker
                        title="Check-in Until"
                        onChange={(value) => setHouseRulesData(prevData => ({ ...prevData, checkInUntil: value }))}
                        value={houseRulesData.checkInUntil}
                      />
                    </Box>
                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'left',
                        alignItems: 'left',
                        m: 2
                      }}
                    >
                      <DatePicker
                        title="Check-out From"
                        onChange={(value) => setHouseRulesData(prevData => ({ ...prevData, checkOutFrom: value }))}
                        value={houseRulesData.checkOutFrom}
                      />
                      <DatePicker
                        title="Check-out Until"
                        onChange={(value) => setHouseRulesData(prevData => ({ ...prevData, checkOutUntil: value }))}
                        value={houseRulesData.checkOutUntil}
                      />
                    </Box>
                    </Grid>
                  </Box>
                </form>
              </Paper>
              {error && (
                <Typography color="error" sx={{ mt: 2, textAlign: 'center', fontWeight: 'bold' }}>
                  {error}
                </Typography>
              )}
            </Box>
            
          </Paper>
        </Box>
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
