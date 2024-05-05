import React, { useState } from "react";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Checkbox from '@mui/material/Checkbox';
import TextField from "@mui/material/TextField";
import DatePicker from '../../time';
import { Container } from "@mui/material";
import Button from "@mui/material/Button";
import '../../../components/Button/NextButton.css'

export default function HouseRules({ onHouseRulesDataChange }) {

  const [showTimePicker, setShowTimePicker] = useState(false);
  const [houseRulesData, setHouseRulesData] = useState({
    smokingAllowed: false,
    petsAllowed: false,
    partiesAllowed: false,
    noiseRestrictions: false,
    quietHoursStart: '22:00',
    quietHoursEnd: '12:00',
    customRules: '',
    checkInFrom: '',
    checkInUntil: '',
    checkOutFrom: '',
    checkOutUntil: ''
  });

  const handleSave = () => {
    // Call the callback function with the saved house rules data
    onHouseRulesDataChange(houseRulesData);
    console.log("House rules data saved:", houseRulesData);
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
                      onChange={(e) => setHouseRulesData(prevData => ({ ...prevData, smokingAllowed: e.target.checked }))}
                    /> Smoking Allowed
                    <br />
                    <Checkbox
                      defaultChecked={houseRulesData.petsAllowed}
                      color="secondary"
                      onChange={(e) => setHouseRulesData(prevData => ({ ...prevData, petsAllowed: e.target.checked }))}
                    /> Pets allowed
                    <br />
                    <Checkbox
                      defaultChecked={houseRulesData.partiesAllowed}
                      color="secondary"
                      onChange={(e) => setHouseRulesData(prevData => ({ ...prevData, partiesAllowed: e.target.checked }))}
                    /> Parties/events allowed
                    <br />
                    <Checkbox
                      defaultChecked={showTimePicker}
                      onChange={(e) => setShowTimePicker(e.target.checked)}
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
                          onChange={(e) => setHouseRulesData(prevData => ({ ...prevData, quietHoursStart: e.target.value }))}
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
                          onChange={(e) => setHouseRulesData(prevData => ({ ...prevData, quietHoursEnd: e.target.value }))}
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
                      onChange={(e) => setHouseRulesData(prevData => ({ ...prevData, customRules: e.target.value }))}
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

                    {/* Pass the setHouseRulesData function to the DatePicker component */}
                    <DatePicker
                      title="Check-in From"
                      onChange={(value) => setHouseRulesData(prevData => ({ ...prevData, checkInFrom: value }))}
                    />

                    <DatePicker 
                      title="Check-in Until"
                      onChange={(value) => setHouseRulesData(prevData => ({ ...prevData, checkInUntil: value }))}
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
                    />

                    <DatePicker 
                      title="Check-out Until"
                      onChange={(value) => setHouseRulesData(prevData => ({ ...prevData, checkOutUntil: value }))}
                    />
                  </Box>
                  <div className='nextButton-container'>
                    <button className="nextButton" onClick={handleSave} sx={{ color: '#007BFF' }}>Next</button>
                  </div>
                </form>
              </Box>

            </Paper>
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
}
