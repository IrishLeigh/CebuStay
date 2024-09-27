import React, { useState, useEffect } from 'react';
import { Box, Paper, Typography, Grid, Checkbox, Button, Container, TextField, RadioGroup, FormControlLabel, Radio, List, ListItem, Select, MenuItem, ListItemIcon, Divider } from "@mui/material";
import LightbulbTwoToneIcon from '@mui/icons-material/LightbulbTwoTone';
import DateRangeIcon from '@mui/icons-material/DateRange';
import { Cancel, MoneyOff, CheckCircle } from '@mui/icons-material'; // Import Material-UI icons
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
import { AccessAlarm, MonetizationOn } from '@mui/icons-material'; // Import icons for the new section
import { truncate } from '@turf/turf';


export default function PropertyRulesPolicies({ onPoliciesDataChange, parentPoliciesData, onHouseRulesDataChange, parentHouseRules, handleNext, handleBack }) {
  const initialPoliciesData = {
    isCancellationPolicy: true,  // true for standard, false for non-refundable
    isModification: true,  // true for modification, false for fixed plan
    cancellationDays: '',
    cancellationCharge: '',
    modificationDays: '',
    modificationCharge: '',
  };
  const [policiesData, setPoliciesData] = useState(initialPoliciesData);
  const [error, setError] = useState("");
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [houseRulesData, setHouseRulesData] = useState(parentHouseRules);

  useEffect(() => {
    // Update local state when parentPoliciesData changes
    setPoliciesData(parentPoliciesData || initialPoliciesData);
  }, [parentPoliciesData]);

  const handleDaysChange = (e, key) => {
    let value = Number(e.target.value);

    // Check if the value is NaN (not a number)
    if (isNaN(value)) {
      value = ''; // Clear the input if not a number
    } else if (value < 1) {
      value = 1; // Set to 1 if negative
    } else if (value > 30) {
      value = 30; // Set to 30 if exceeds 30
    }

    // Update the state with the adjusted value
    setPoliciesData((prevData) => ({
      ...prevData,
      [key]: value
    }));
  };

  const handleChargeChange = (e, type) => {
    const { value } = e.target;
    
    // Prevent negative values
    if (value < 0) {
      return;
    }
  
    setPoliciesData(prevData => ({
      ...prevData,
      [type]: value,
    }));
  };
  

  const handleRadioCancellationChange = (event) => {
    const { name, value } = event.target;

    setPoliciesData(prevData => ({
      ...prevData,
      [name]: value === "standard" ? true : false,  // Toggle true/false based on value
    }));
  };

  
  const handleModificationChange = (event) => {
    const { value } = event.target;

    setPoliciesData(prevData => ({
      ...prevData,
      isModification: value === "modification" ? true : false,  // true if 'modification', false if 'fixed'
    }));
  };

  const validateAndProceed = () => {
   
  if (policiesData.isCancellationPolicy) {
    if (!policiesData.cancellationDays) {
      alert("Please specify the number of days for cancellation policy.");
      return;
    }
    if (!policiesData.cancellationCharge) {
      alert("Please specify the charge for cancellation.");
      return;
    }
  }

  // Validate modification policy
  if (policiesData.isModification) {
    if (!policiesData.modificationDays) {
      alert("Please specify the number of days for modification policy.");
      return;
    }
    if (!policiesData.modificationCharge) {
      alert("Please specify the charge for modification.");
      return;
    }
  }
   
    if (!houseRulesData.smokingAllowed && !houseRulesData.petsAllowed && !houseRulesData.partiesAllowed) {
      alert("Please select at least one standard rule.");
      return;
    }

    if (showTimePicker && (!houseRulesData.quietHoursStart || !houseRulesData.quietHoursEnd)) {
      alert("Please specify quiet hours.");
      return;
    }

    if (!houseRulesData.customRules) {
      alert("Please enter your custom rules.");
      return;
    }

    if (!houseRulesData.checkInFrom || !houseRulesData.checkInUntil || !houseRulesData.checkOutFrom || !houseRulesData.checkOutUntil) {
      alert("Please specify check-in and check-out times.");
      return;
    }

    setError("");
    onPoliciesDataChange(policiesData); // Send updated data to parent
    onHouseRulesDataChange(houseRulesData);
    handleNext(); // Navigate to the next component
  };

  console.log("policiesData", policiesData);

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
            <Typography sx={{ fontFamily: 'Poppins',fontSize: "1rem" ,mb: 5 }}>
              Embark on a smooth booking adventure with our reservation policies and flexible payment options.
            </Typography>
            <form>
              {/* Cancellation Policy Selection */}
              <Grid container spacing={2} sx={{ padding: '2rem' }}>
                <Typography sx={{ fontFamily: 'Poppins', fontSize: '1rem', fontWeight: 'bold' }}>
                  What is your cancellation policy?
                </Typography>

                <Grid item xs={12} md={12}>
                  <Divider sx={{ mt: 1, mb: 1, borderColor: '#6A6A6A', width: '100%' }} />
                  <RadioGroup
                    name="isCancellationPolicy"  // This updates the true/false value for cancellation policy
                    value={policiesData.isCancellationPolicy ? 'standard' : 'non-refundable'}
                    onChange={handleRadioCancellationChange}
                  >
                    <FormControlLabel
                      value="standard"
                      control={<Radio color="secondary" />}
                      label="Standard Cancellation Plan"
                    />
                    {policiesData.isCancellationPolicy && ( // Open by default
                      <Box sx={{ border: '1px solid #6A6A6A', p: '1.5rem', m: 2, borderRadius: '0.5rem' }}>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                            Standard Cancellation Plan
                          </Typography>
                          <Box sx={{ display: 'flex' }}>
                            <ListItemIcon>
                              <AccessAlarm color="primary" />
                            </ListItemIcon>
                            <Typography>
                              Within how many days prior to their arrival can guests cancel their booking without any charges?
                            </Typography>
                          </Box>
                          <TextField
                            label="Number of Days"
                            value={policiesData.cancellationDays || ''}
                            onChange={(e) => handleDaysChange(e, 'cancellationDays')}
                            type="number"
                            InputProps={{ 
                              inputProps: { 
                                min: 1, 
                                max: 31 // Set your desired maximum value here
                              } 
                            }}
                            variant="outlined"
                          />
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <ListItemIcon>
                              <MonetizationOn color="secondary" />
                            </ListItemIcon>
                            <Typography>
                              How much is the charge for the guest if they cancel after the given days?
                            </Typography>
                          </Box>
                          <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={policiesData.cancellationCharge || ''}
                            onChange={(e) => handleChargeChange(e, 'cancellationCharge')}
                            displayEmpty
                            variant="outlined"
                          >
                           
                            <MenuItem value={10}>10%</MenuItem>
                            <MenuItem value={20}>20%</MenuItem>
                            <MenuItem value={30}>30%</MenuItem>
                            <MenuItem value={40}>40%</MenuItem>
                            <MenuItem value={50}>50%</MenuItem>
                            <MenuItem value={60}>60%</MenuItem>
                          </Select>
                        </Box>
                      </Box>
                    )}
                    <FormControlLabel
                      value="non-refundable"
                      control={<Radio color="secondary" />}
                      label="Non-refundable Rate Plan"
                    />
                    {!policiesData.isCancellationPolicy && ( // Open if non-refundable is selected
                      <Box sx={{ border: '1px solid #6A6A6A', p: '1.5rem', m: 2, borderRadius: '0.5rem' }}>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                            Non-refundable Rate Plan
                          </Typography>
                          <Typography>
                            No charges will be refunded if the guest cancels at any point.
                          </Typography>
                        </Box>
                      </Box>
                    )}
                  </RadioGroup>
                </Grid>
              </Grid>

              {/* Modification Policy Selection */}
              <Grid container spacing={2} sx={{ padding: '2rem' }}>
                <Typography sx={{ fontFamily: 'Poppins', fontSize: '1rem', fontWeight: 'bold' }}>
                  What is your modification policy?
                </Typography>
                <Grid item xs={12} md={12}>
                  <Divider sx={{ mt: 1, mb: 1, borderColor: '#6A6A6A', width: '100%' }} />
                  <RadioGroup
                    name="isModification"
                    value={policiesData.isModification ? 'modification' : 'fixed'}
                    onChange={handleModificationChange}
                  >
                    <FormControlLabel
                      value="modification"
                      control={<Radio color="secondary" />}
                      label="Modification Allowed"
                    />
                    {policiesData.isModification && ( // Open by default
                      <Box sx={{ border: '1px solid #6A6A6A', p: '1.5rem', m: 2, borderRadius: '0.5rem' }}>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                            Modification Policy
                          </Typography>
                          <Box sx={{ display: 'flex' }}>
                            <ListItemIcon>
                              <AccessAlarm color="primary" />
                            </ListItemIcon>
                            <Typography>
                              Within how many days prior to their arrival can guests modify their booking without any charges?
                            </Typography>
                          </Box>
                          <TextField
                            label="Number of Days"
                            value={policiesData.modificationDays || ''}
                            onChange={(e) => handleDaysChange(e, 'modificationDays')}
                            type="number"
                            InputProps={{ inputProps: { min: 1 } }}
                            variant="outlined"
                          />
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <ListItemIcon>
                              <MonetizationOn color="secondary" />
                            </ListItemIcon>
                            <Typography>
                              How much is the charge for the guest if they modify after the given days?
                            </Typography>
                          </Box>
                          <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={policiesData.modificationCharge || ''}
                            onChange={(e) => handleChargeChange(e, 'modificationCharge')}
                            displayEmpty
                            variant="outlined"
                          >
                           
                            <MenuItem value={10}>10%</MenuItem>
                            <MenuItem value={20}>20%</MenuItem>
                            <MenuItem value={30}>30%</MenuItem>
                            <MenuItem value={40}>40%</MenuItem>
                            <MenuItem value={50}>50%</MenuItem>
                            <MenuItem value={60}>60%</MenuItem>
                          </Select>
                        </Box>
                      </Box>
                    )}
                    <FormControlLabel
                      value="fixed"
                      control={<Radio color="secondary" />}
                      label="Fixed Modification Rate Plan"
                    />
                    {!policiesData.isModification && ( // Open if fixed is selected
                      <Box sx={{ border: '1px solid #6A6A6A', p: '1.5rem', m: 2, borderRadius: '0.5rem' }}>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                            Fixed Modification Rate Plan
                          </Typography>
                          <Typography>
                            No modifications will be allowed after the guest confirms the reservation.
                          </Typography>
                        </Box>
                      </Box>
                    )}
                  </RadioGroup>
                </Grid>
              </Grid>
              {/* Validation Error Message */}
              {error && <Typography color="red">{error}</Typography>}
              {/* Action Buttons */}
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
                <Button variant="outlined" onClick={handleBack}>Back</Button>
                <Button variant="contained" onClick={validateAndProceed}>Next</Button>
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
                  <Typography sx={{ width: "100%" }} mb={2} >
                    Set clear rules for your listing to ensure a smooth and enjoyable stay for your guests
                  </Typography>
                </div>
              </Box>
              
            
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
