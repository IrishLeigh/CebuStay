import React, { useState, useEffect } from "react";
import {
  Grid,
  InputLabel,
  Checkbox,
  TextField,
  Box,
  Typography,
  Paper,
  Button,
  Alert,
  Snackbar,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { Container, RadioGroup, FormControlLabel, Radio, List, ListItem, Select, MenuItem, ListItemIcon, Divider } from "@mui/material";
import axios from "axios";
import TemplateFrameEdit from "./TemplateFrame";
import LoadingModal from "../modal/LoadingModal";
import { AccessAlarm, MonetizationOn } from '@mui/icons-material'; // Import icons for the new section


export default function EditRulesPolicies({
  propertyid,
  houseRules,
  policies,
  onHouseRulesChange,
  onPoliciesChange,
  onSaveStatusChange ,
}) {
  const [houseRulesData, setHouseRulesData] = useState({
    smokingAllowed: false,
    petsAllowed: false,
    partiesAllowed: false,
    noise_restrictions: false,
    quietHoursStart: "22:00",
    quietHoursEnd: "06:00",
    checkInFrom: "12:00",
    checkOutFrom: "12:00",
    checkOutUntil: "14:00",
    customRules: "",
  });
  const [policiesData, setPoliciesData] = useState({
    isCancellationPolicy: true,  // true for standard, false for non-refundable
    isModificationPolicy: true,  // true for modification, false for fixed plan
    cancellationDays: '',
    cancellationCharge: '',
    modificationDays: '',
    modificationCharge: '',
  });
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [originalData, setOriginalData] = useState({});
  const [hasChanges, setHasChanges] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm')); 
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [errorMessage, setErrorMessage] = useState([]);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [hasError, setHasError] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  
  useEffect(() => {
    console.log("On Mount");
    console.log("House Rules:", houseRules);
    console.log("Policies:", policies);
    setShowTimePicker(houseRulesData.noise_restrictions === "1" ? true : false);
  }, []);

  useEffect(() => {
    if (houseRules) {
      const initialHouseRulesData = {
        smokingAllowed: houseRules.smoking_allowed === 1,
        petsAllowed: houseRules.pets_allowed === 1,
        partiesAllowed: houseRules.parties_events_allowed === 1,
        noise_restrictions: houseRules.noise_restrictions === 1,
        quietHoursStart: houseRules.quiet_hours_start || "22:00",
        quietHoursEnd: houseRules.quiet_hours_end || "06:00",
        customRules: houseRules.custom_rules || "",
        checkInFrom: houseRules.check_in_from || "12:00",
        checkInUntil: houseRules.check_in_until || "14:00",
        checkOutFrom: houseRules.check_out_from || "12:00",
        checkOutUntil: houseRules.check_out_until || "14:00",
      };
      setHouseRulesData(initialHouseRulesData);
      setOriginalData((prevData) => ({
        ...prevData,
        houseRulesData: initialHouseRulesData,
      }));
      setShowTimePicker(
        houseRules.quiet_hours_start && houseRules.quiet_hours_end
      );
    }
  }, [houseRules]);

  useEffect(() => {
    if (policies) {
      const initialPoliciesData = {
        isCancellationPolicy: policies.isCancellationPolicy === 1 , // Convert 1/0 to true/false
        isModificationPolicy: policies.isModificationPolicy === 1,  // Convert 1/0 to true/false
        cancellationDays: policies.cancellationDays || '',
        cancellationCharge: policies.CancellationCharge || '',
        modificationDays: policies.modificationDays || '',
        modificationCharge: policies.modificationCharge || '',
      };
      setPoliciesData(initialPoliciesData);
      setOriginalData((prevData) => ({
        ...prevData,
        policiesData: initialPoliciesData,
      }));
    }
  }, [policies]);
  
  const handleRadioCancellationChange = (event) => {
    const value = event.target.value === 'standard';
    setPoliciesData((prevData) => ({
      ...prevData,
      isCancellationPolicy: value
    }));
    setHasChanges(true); // Indicate that there are unsaved changes
  };
  
  const handleModificationChange = (event) => {
    setHasChanges(true);
    const { value } = event.target;

    setPoliciesData(prevData => ({
      ...prevData,
      isModificationPolicy: value === "modification" ? true : false,  // true if 'modification', false if 'fixed'
    }));
  };

  
  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setPoliciesData((prevData) => ({
      ...prevData,
      [name]: checked,
    }));
    setHasChanges(true);
  };
  const handleStandardInputChange = (e, field) => {
    const { type, checked, value } = e.target;
    const newValue = type === "checkbox" ? checked : value;
  
    setHouseRulesData((prevData) => ({
      ...prevData,
      [field]: newValue,
    }));
    setHasChanges(true);
  
    // If the field is "noise_restrictions", control the time picker visibility
    if (field === "noise_restrictions") {
      setShowTimePicker(newValue);
    }
    setHasChanges(true);
  };
  
  

  const handleDaysChange = (event, field) => {
    const value = event.target.value;
    setPoliciesData((prevData) => ({
      ...prevData,
      [field]: value,
    }));
    setHasChanges(true); // Track changes for save prompt
  };
  
  const handleChargeChange = (event, field) => {
    const value = event.target.value;
    setPoliciesData((prevData) => ({
      ...prevData,
      [field]: value,
    }));
    setHasChanges(true); // Track changes
  };
  

  const handleCancel = () => {
    if (hasChanges) {
      const confirmDiscard = window.confirm("You have unsaved changes. Are you sure you want to discard them?");
      if (!confirmDiscard) {
        return; // Exit the function if the user cancels the discard action
      }
    }
    setIsEditing(false);
    setHouseRulesData(originalData.houseRulesData);
    setPoliciesData(originalData.policiesData);
  };
  const handleEditingChange = (editing) => {
    if (editing === true) {
      setIsEditing(editing);
    }else if (editing === false) {
      handleCancel();
      
    }
   
    console.log(`Editing mode changed: ${editing}`); // Log or use this state as needed
  };

//   const validateForm = () => {
//     const { noise_restrictions, quietHoursStart, quietHoursEnd, customRules, checkInFrom, checkOutUntil , checkOutFrom, smokingAllowed, petsAllowed, partiesAllowed} = houseRulesData;
//     const { cancellationDays, cancellationCharge, modificationDays, modificationCharge } = policiesData;

//     // Check if at least one standard rule is selected
//     const atLeastOneStandardRuleSelected = smokingAllowed || petsAllowed || partiesAllowed || noise_restrictions;

//     if (!atLeastOneStandardRuleSelected) {
//         setHasError(true);
//         errorMessage.push("Please select at least one standard rule.");
//         setSnackbarMessage("Please select at least one standard rule.");
//         setOpenSnackbar(true);
//         return false;
//     }

//     // Validate noise restrictions if selected
//     if (noise_restrictions) {
//         if (!quietHoursStart || !quietHoursEnd) {
//             setHasError(true);
//             errorMessage.push("Quiet Hours start and end times are required.");
//             setSnackbarMessage("Quiet Hours start and end times are required.");
//             setOpenSnackbar(true);
//             return false;
//         }
//         if (quietHoursStart >= quietHoursEnd) {
//             setHasError(true);
//             errorMessage.push("Quiet Hours start time must be before Quiet Hours end time.");
//             setSnackbarMessage("Quiet Hours start time must be before Quiet Hours end time.");
//             setOpenSnackbar(true);
//             return false;
//         }
//     }

//     // Check if custom rules are provided
//     if (!customRules.trim()) {
//         setHasError(true);
//         errorMessage.push("Custom rules are required.");
//         setSnackbarMessage("Custom rules are required.");
//         setOpenSnackbar(true);
//         return false;
//     }

//     // Ensure check-in and check-out fields are not empty
//     if (!checkInFrom || !checkOutUntil) {
//         setHasError(true);
//         errorMessage.push("Check-in and check-out times are required.");
//         setSnackbarMessage("Check-in and check-out times are required.");
//         setOpenSnackbar(true);
//         return false;
//     }

//     // Ensure check-in from time is before check-out until time
    
//     if (checkOutFrom >= checkOutUntil) {
//         setHasError(true);
//         errorMessage.push("Check-out from time must be before check-out until time.");
//         setSnackbarMessage("Check-out from time must be before check-out until time.");
//         setOpenSnackbar(true);
//         return false;
//     }

//     // Validation for policies
//     if (policiesData.isCancellationPolicy && (cancellationDays === "" || cancellationCharge === "")) {
//         setHasError(true);
//         errorMessage.push("Please enter both cancellation days and cancellation charge.");
//         setSnackbarMessage("Please enter both cancellation days and cancellation charge.");
//         setOpenSnackbar(true);
//         return false;
//     }

//     if (policiesData.isModificationPolicy && (modificationDays === "" || modificationCharge === "")) {
//         setHasError(true);
//         errorMessage.push("Please enter both modification days and modification charge.");
//         setSnackbarMessage("Please enter both modification days and modification charge.");
//         setOpenSnackbar(true);
//         return false;
//     }

//     return true; // Return true if all validations pass
// };
  const validateForm = () => {
    const { noise_restrictions, quietHoursStart, quietHoursEnd, customRules, checkInFrom, checkOutUntil , checkOutFrom, smokingAllowed, petsAllowed, partiesAllowed} = houseRulesData;
    const { cancellationDays, cancellationCharge, modificationDays, modificationCharge } = policiesData;

    // Check if at least one standard rule is selected
    const atLeastOneStandardRuleSelected = smokingAllowed || petsAllowed || partiesAllowed || noise_restrictions;

    if (!atLeastOneStandardRuleSelected) {
        setHasError(true);
        errorMessage.push("Please select at least one standard rule.");
        setSnackbarMessage("Please select at least one standard rule.");
        setOpenSnackbar(true);
        return false;
    }

    // Validate noise restrictions if selected
    if (noise_restrictions) {
        if (!quietHoursStart || !quietHoursEnd) {
            setHasError(true);
            errorMessage.push("Quiet Hours start and end times are required.");
            setSnackbarMessage("Quiet Hours start and end times are required.");
            setOpenSnackbar(true);
            return false;
        }
        if (quietHoursStart >= quietHoursEnd) {
            setHasError(true);
            errorMessage.push("Quiet Hours start time must be before Quiet Hours end time.");
            setSnackbarMessage("Quiet Hours start time must be before Quiet Hours end time.");
            setOpenSnackbar(true);
            return false;
        }
    }

    // Check if custom rules are provided
    if (!customRules.trim()) {
        setHasError(true);
        errorMessage.push("Custom rules are required.");
        setSnackbarMessage("Custom rules are required.");
        setOpenSnackbar(true);
        return false;
    }

    // Ensure check-in and check-out fields are not empty
    if (!checkInFrom || !checkOutUntil) {
        setHasError(true);
        errorMessage.push("Check-in and check-out times are required.");
        setSnackbarMessage("Check-in and check-out times are required.");
        setOpenSnackbar(true);
        return false;
    }

    // Ensure check-in from time is before check-out until time
    
    if (checkOutFrom >= checkOutUntil) {
        setHasError(true);
        errorMessage.push("Check-out from time must be before check-out until time.");
        setSnackbarMessage("Check-out from time must be before check-out until time.");
        setOpenSnackbar(true);
        return false;
    }

    // Validation for policies
    if (policiesData.isCancellationPolicy && (cancellationDays === "" || cancellationCharge === "")) {
        setHasError(true);
        errorMessage.push("Please enter both cancellation days and cancellation charge.");
        setSnackbarMessage("Please enter both cancellation days and cancellation charge.");
        setOpenSnackbar(true);
        return false;
    }

    if (policiesData.isModificationPolicy && (modificationDays === "" || modificationCharge === "")) {
        setHasError(true);
        errorMessage.push("Please enter both modification days and modification charge.");
        setSnackbarMessage("Please enter both modification days and modification charge.");
        setOpenSnackbar(true);
        return false;
    }

    return true; // Return true if all validations pass
};

  const handleSave = async () => {
    if (!validateForm()) {
      return;
    }
    setIsLoading(true);
    // setIsEditing(false);
    // console.log("Saved House Rules:", houseRulesData);
    // console.log("Saved Policies:", policiesData);
    // Validation before saving
    if (policiesData.isCancellationPolicy && (policiesData.cancellationDays === "" || policiesData.cancellationCharge === "")) {
      alert("Please enter both cancellation days and cancellation charge.");
      setIsLoading(false);
      return;
    }
  
    if (policiesData.isModificationPolicy && (policiesData.modificationDays === "" || policiesData.modificationCharge === "")) {
      alert("Please enter both modification days and modification charge.");
      setIsLoading(false);
      return;
    }
  
    console.log("Submitted House Rules:", houseRulesData);
    console.log("Submitted Policies:", policiesData);
  
    try {
      const res = await axios.post(
        `http://127.0.0.1:8000/api/updatepropertyrules-single/${propertyid}`,
        {
          updated_rules: houseRulesData,
          updated_policies: policiesData,
        }
      );
  
      if (res.data && res.data.status === "success") {
        const updated_HR = res.data.updatedRules;
        const updated_pol = res.data.updatedPolicies;
        setHouseRulesData(updated_HR);
        setPoliciesData(updated_pol);
        setOriginalData({
          houseRulesData: updated_HR,
          policiesData: updated_pol,
        });
        onHouseRulesChange(res.data.rawUpdatedRules);
        onPoliciesChange(res.data.rawUpdatedPolicies);
        setHasError(false);
        setHasChanges(false);
        // setIsEditing(false);
        setSnackbarMessage("Rules and Policies Saved Successfully");
        setOpenSnackbar(true);
        onSaveStatusChange('Saved');
      }
      console.log("RETURN NI SHA SA POLICIES", res.data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };
  const handleCloseSnackbar  = () => {
    setOpenSnackbar(false);
  }

  return (
    <>
      <TemplateFrameEdit onEditChange={handleEditingChange}  saved ={isSaved}  onSave={handleSave} hasChanges={hasChanges}  cancel={handleCancel} />
      <Paper
        style={{
          width: "auto",
          padding:  isMobile ? "1rem" :"4rem",
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
           Rules and Policies
          </Typography>
          {/* <div>
            {!isEditing && (
              <Button
                onClick={() => setIsEditing(true)}
                sx={{ marginRight: "1rem" }}
              >
                Edit
              </Button>
            )}
            {isEditing && (
              <Button onClick={handleCancel} sx={{ marginRight: "1rem" }}>
                Cancel
              </Button>
            )}
          </div> */}
        </div>
        <Typography
          sx={{
            fontFamily: "Poppins, sans-serif",
            fontSize: "0.875rem",
            color: "#6b7280",
            marginBottom: "2rem",
          }}
        >
          Update your property's house rules and booking policies here. Set rules
          for smoking, pets, and quiet hours, and define cancellation terms and
          refund policies. Make sure to save your changes.
        </Typography>

        <Grid container spacing={2}>
          <Grid item xs={12} sx={{ padding: "1rem" }}>
            <div
              style={{
                marginBottom: "1rem",
                padding: "0 2rem 2rem 2rem",
                border: "1px solid #ccc",
                borderRadius: "0.8rem",
                paddingTop: "1rem",
              }}
            >
              <h6
                style={{
                  marginBottom: "1rem",
                  fontWeight: "bold",
                  top: "-1.5rem",
                  left: "0.1rem",
                  position: "relative",
                  backgroundColor: "#fff",
                  width: "fit-content",
                }}
              >
                House Rules
              </h6>
              <Box>
                <Typography
                  variant="h4"
                  sx={{ fontWeight: "bold", fontSize: 18, m: 2 }}
                >
                  Standard Rules
                </Typography>

                <Checkbox
                  checked={houseRulesData.smokingAllowed}
                  color="secondary"
                  disabled={!isEditing}
                  onChange={(e) => handleStandardInputChange(e, 'smokingAllowed')}
                />{" "}
                Smoking Allowed
                <br />

                <Checkbox
                  checked={houseRulesData.petsAllowed}
                  color="secondary"
                  disabled={!isEditing}
                  onChange={(e) => handleStandardInputChange(e, 'petsAllowed')}
                />{" "}
                Pets Allowed
                <br />

                <Checkbox
                  checked={houseRulesData.partiesAllowed}
                  color="secondary"
                  disabled={!isEditing}
                  onChange={(e) => handleStandardInputChange(e, 'partiesAllowed')}
                />{" "}
                Parties/Events Allowed
                <br />

                <Checkbox
                  checked={showTimePicker}
                  disabled={!isEditing}
                  onChange={(e) => handleStandardInputChange(e, 'noise_restrictions')}
                  color="secondary"
                />{" "}
                Noise Restrictions

                {showTimePicker && (
                  <div>
                    <TextField
                      id="quiet-hours-start"
                      label="Quiet Hours Start"
                      type="time"
                      value={houseRulesData.quietHoursStart}
                      sx={{ marginRight: 2 }}
                      InputLabelProps={{
                        shrink: true,
                      }}
                      inputProps={{
                        step: 300, // 5 min
                      }}
                      disabled={!isEditing}
                      onChange={(e) => handleStandardInputChange(e, 'quietHoursStart')}
                    />
                    <TextField
                      id="quiet-hours-end"
                      label="Quiet Hours End"
                      type="time"
                      value={houseRulesData.quietHoursEnd}
                      InputLabelProps={{
                        shrink: true,
                      }}
                      inputProps={{
                        step: 300, // 5 min
                      }}
                      disabled={!isEditing}
                      onChange={(e) => handleStandardInputChange(e, 'quietHoursEnd')}
                    />
                  </div>
                )}
              </Box>

              <Box>
                <Typography
                  variant="h4"
                  sx={{ fontWeight: "bold", fontSize: 18, m: 2 }}
                >
                  Custom Rules
                </Typography>
                <TextField
                  id="outlined-multiline-flexible"
                  
                  placeholder="Enter your custom rules here. Each line represents one rule."
                  multiline
                  maxRows={10}
                  value={houseRulesData.customRules}
                  disabled={!isEditing}
                  onChange={(e) => handleStandardInputChange(e, 'customRules')}
                  sx={{  width: "100%" , m: 2 }}
                />
              </Box>

              <Grid container sx={{ m: 2 }}>
                <Grid item sx={12}>
                  <Box sx={{ justifyContent: "left", alignItems: "left" }}>
                    <Typography
                      variant="h4"
                      sx={{ fontWeight: "bold", fontSize: 18, m: "0 0 1rem 0" }}
                    >
                      Check-in and Check-out Times
                    </Typography>
                    <Typography
                     
                      sx={{ fontSize: "0.875rem", m: "0 0 2rem 0" }}
                    >
                      Specify the times when guests can check-in and check-out. Make sure to communicate these times clearly to avoid any misunderstandings.
                    </Typography>


                    <Grid container spacing={2}>
                      <Grid item sx={12} lg={12}>
                        <TextField
                          id="check-in-from"
                          label="Check-in From"
                          type="time"
                          value={houseRulesData.checkInFrom}
                          InputLabelProps={{
                            shrink: true,
                          }}
                          inputProps={{
                            step: 300, // 5 min
                          }}
                          disabled={!isEditing}
                          onChange={(e) => handleStandardInputChange(e, 'checkInFrom')}
                          sx={{ width: "100%" }}
                        />
                      </Grid>
                      <Grid item sx={12} lg={6}>
                        <TextField
                          id="check-out-from"
                          label="Check-out From"
                          type="time"
                          value={houseRulesData.checkOutFrom}
                          InputLabelProps={{
                            shrink: true,
                          }}
                          inputProps={{
                            step: 300, // 5 min
                          }}
                          disabled={!isEditing}
                          onChange={(e) => handleStandardInputChange(e, 'checkOutFrom')}
                          sx={{ width: "100%" }}
                        />
                      </Grid>
                      <Grid item sx={12} lg={6}>
                        <TextField
                          id="check-out-until"
                          label="Check-out Until"
                          type="time"
                          value={houseRulesData.checkOutUntil}
                          InputLabelProps={{
                            shrink: true,
                          }}
                          inputProps={{
                            step: 300, // 5 min
                          }}
                          disabled={!isEditing}
                          onChange={(e) => handleStandardInputChange(e, 'checkOutUntil')}
                          sx={{ width: "100%" }}
                        />
                      </Grid>
                    </Grid>
                  </Box>
                </Grid>
              </Grid>

            </div>
          </Grid>



          <Grid item xs={12} sx={{ padding: "1rem" }}>
              {/* Cancellation Policy Selection */}
              <Grid container spacing={2} sx={{ padding: '1rem' }}>
                <Typography sx={{ fontFamily: 'Poppins', fontSize: '1rem', fontWeight: 'bold' }}>
                  What is your cancellation policy?
                </Typography>

                <Grid item xs={12} md={12}>
                  <Divider sx={{ mt: 1, mb: 1, borderColor: '#6A6A6A', width: '100%' }} />
                  <RadioGroup
                    name="isCancellationPolicy"
                    value={policiesData.isCancellationPolicy ? 'standard' : 'non-refundable'}
                    onChange={handleRadioCancellationChange}
                  
                >
                    <FormControlLabel
                      value="standard"
                      control={<Radio color="secondary" />}
                      label="Standard Cancellation Plan"
                      disabled={!isEditing}
                    />
                   
                    <FormControlLabel
                      value="non-refundable"
                      control={<Radio color="secondary" />}
                      label="Non-refundable Rate Plan"
                      disabled={!isEditing}
                    />
                     {policiesData.isCancellationPolicy && ( // Open by default
                      <Box sx={{ border: '1px solid #6A6A6A', p: '1.5rem', m: 2, borderRadius: '0.5rem' }}>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
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
                            disabled={!isEditing}
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
                            disabled={!isEditing}
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
                    {!policiesData.isCancellationPolicy && ( // Open if non-refundable is selected
                      <Box sx={{ border: '1px solid #6A6A6A', p: '1.5rem', m: 2, borderRadius: '0.5rem' }}>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
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
              <Grid container spacing={2} sx={{ padding: '1rem' }}>
                <Typography sx={{ fontFamily: 'Poppins', fontSize: '1rem', fontWeight: 'bold' }}>
                  What is your modification policy?
                </Typography>
                <Grid item xs={12} md={12}>
                  <Divider sx={{ mt: 1, mb: 1, borderColor: '#6A6A6A', width: '100%' }} />
                  <RadioGroup
                    name="isModificationPolicy"
                    value={policiesData.isModificationPolicy ? 'modification' : 'fixed'}
                    onChange={handleModificationChange}
                  >
                    <FormControlLabel
                      value="modification"
                      control={<Radio color="secondary" />}
                      label="Modification Allowed"
                      disabled={!isEditing}
                    />
                   
                    <FormControlLabel
                      value="fixed"
                      control={<Radio color="secondary" />}
                      label="Fixed Modification Rate Plan"
                      disabled={!isEditing}
                    />
                     {policiesData.isModificationPolicy && ( // Open by default
                      <Box sx={{ border: '1px solid #6A6A6A', p: '1.5rem', m: 2, borderRadius: '0.5rem' }}>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
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
                            disabled={!isEditing}
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
                            disabled={!isEditing}
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
                    {!policiesData.isModificationPolicy && ( // Open if fixed is selected
                      <Box sx={{ border: '1px solid #6A6A6A', p: '1.5rem', m: 2, borderRadius: '0.5rem' }}>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
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
          </Grid>
        </Grid>
        <Snackbar
          open={openSnackbar}
          autoHideDuration={6000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}

        >
          <Alert
            onClose={handleCloseSnackbar}
            severity={hasError ? "error" : "success"}
            sx={{ width: "100%" }}
          >
            {snackbarMessage}
          
          </Alert>
        </Snackbar>
      </Paper>
    <LoadingModal open={isLoading} />
    </>
  );
}
