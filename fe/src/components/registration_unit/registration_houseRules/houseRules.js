import React, { useState } from "react";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Checkbox from '@mui/material/Checkbox';
import TextField from "@mui/material/TextField";
import DatePicker from '../../time';
import { Container } from "@mui/material";

export default function HouseRules({ onHouseRulesDataChange }) {

  const [showTimePicker, setShowTimePicker] = useState(false);
  const [houseRulesData, setHouseRulesData] = useState({
    smokingAllowed: true,
    petsAllowed: true,
    partiesAllowed: true,
    noiseRestrictions: false,
    quietHoursStart: '22:00',
    quietHoursEnd: '12:00',
    customRules: '',
    checkInFrom: '',
    checkInUntil: '',
    checkOutFrom: '',
    checkOutUntil: ''
  });

  // Define the handleTimeChange function
  const handleTimeChange = (value, title) => {
    setHouseRulesData(prevData => ({
      ...prevData,
      [title]: value
    }));
    onHouseRulesDataChange({ ...houseRulesData, [title]: value });
  };
  

  const handleNoiseRestrictionChange = (event) => {
    setShowTimePicker(event.target.checked);
    setHouseRulesData(prevData => ({
      ...prevData,
      noiseRestrictions: event.target.checked
    }));
    onHouseRulesDataChange({ ...houseRulesData, noiseRestrictions: event.target.checked });
  };

  const handleHouseRulesChange = (newHouseRulesData) => {
    setHouseRulesData(newHouseRulesData);
    onHouseRulesDataChange(newHouseRulesData); // Propagate changes to parent component
  };

  return (
    <Container maxWidth="lg">
      <Grid container justifyContent="center" alignItems="center">
        <Grid item xs={12} md={8} lg={6}>
          <Box sx={{ textAlign: "left" }}>
            <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 2 }}>House Rules</Typography>
            <Typography variant="body1" sx={{ fontSize: 18, mb: 2 }}>
              Set clear rules for your listing to ensure a smooth and enjoyable stay for your guests
            </Typography>
          </Box>
          <Box sx={{ width: '93%' }}> {/* Adjusted width */}
            <Paper elevation={3} sx={{ p: 2, display: "flex", flexDirection: "column", alignItems: "left" }}>
              {/* Standard House Rules*/}
              <Box>
                <form>
                  <Box>
                    <Typography variant="h4" sx={{ fontWeight: 'bold', fontSize: 18, m: 2 }}>Standard Rules</Typography>
                    <Checkbox
                      defaultChecked={houseRulesData.smokingAllowed}
                      color="secondary"
                      onChange={(e) => handleHouseRulesChange({ ...houseRulesData, smokingAllowed: e.target.checked })}
                    /> Smoking Allowed
                    <br />
                    <Checkbox
                      defaultChecked={houseRulesData.petsAllowed}
                      color="secondary"
                      onChange={(e) => handleHouseRulesChange({ ...houseRulesData, petsAllowed: e.target.checked })}
                    /> Pets allowed
                    <br />
                    <Checkbox
                      defaultChecked={houseRulesData.partiesAllowed}
                      color="secondary"
                      onChange={(e) => handleHouseRulesChange({ ...houseRulesData, partiesAllowed: e.target.checked })}
                    /> Parties/events allowed
                    <br />
                    <Checkbox
                      defaultChecked={showTimePicker}
                      onChange={handleNoiseRestrictionChange}
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
                          onChange={(e) => handleHouseRulesChange({ ...houseRulesData, quietHoursStart: e.target.value })}
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
                          onChange={(e) => handleHouseRulesChange({ ...houseRulesData, quietHoursEnd: e.target.value })}
                        />
                      </div>
                    )}
                  </Box>
                  <Box>
                    <Typography variant="h4" sx={{ fontWeight: 'bold', fontSize: 18, m: 2 }}>
                      Set your own rules
                    </Typography>
                    <TextField
                      id="outlined-multiline-flexible"
                      placeholder="Enter your custom rules here. Each line represents one rule."
                      multiline
                      maxRows={10}
                      value={houseRulesData.customRules}
                      onChange={(e) => handleHouseRulesChange({ ...houseRulesData, customRules: e.target.value })}
                      sx={{ m: 2, width: '92%' }}  
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

                    {/* Pass the handleTimeChange function to the DatePicker component */}
                    <DatePicker
                      title="Check-in From"
                      onChange={(value) => handleTimeChange(value, "checkInFrom")}
                    />

                    <DatePicker 
                      title="Check-in Until"
                      onChange={(value) => handleTimeChange(value, "checkInUntil")}
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
                      onChange={(value) => handleTimeChange(value, "checkOutFrom")}
                    />

                    <DatePicker 
                      title="Check-out Until"
                      onChange={(value) => handleTimeChange(value, "checkOutUntil")}
                    />
                  </Box>
                </form>
              </Box>

            </Paper>
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
}
