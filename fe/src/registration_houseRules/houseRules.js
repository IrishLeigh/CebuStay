import React, { useState } from "react";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Checkbox from '@mui/material/Checkbox';
import TextField from "@mui/material/TextField";
import DatePicker from '../components/time';

export default function HouseRules() {

  const [showTimePicker, setShowTimePicker] = useState(false);

  const handleNoiseRestrictionChange = (event) => {
    setShowTimePicker(event.target.checked);
  };

  return (
    <Box
      sx={{
        height: "100vh",
      }}
    >
      <Grid
        container
        spacing={2}
        sx={{
          height: "100%",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Grid item xs={6} sx={{ textAlign: "left" }}>
          <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 2}}>House Rules</Typography>
          <Typography variant="body1" sx={{ fontSize: 18,mb: 2 }}>
          Set clear rules for your listing to ensure a smooth and enjoyable stay for your guests
          </Typography>
          <Paper elevation={3} sx={{ p: 2, display: "flex", flexDirection: "column", alignItems: "left" }}>
            {/* Standard House Rules*/}
            <Box
             
              >
              <form>
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: 'bold',fontSize: 18,m: 2 }}>Standard Rules</Typography>
                  <Checkbox defaultChecked color="secondary" /> Smoking Allowed
                  <br />
                  <Checkbox defaultChecked color="secondary" /> Pets allowed
                  <br />
                  <Checkbox defaultChecked color="secondary" /> Parties/events allowed
                  <br />
                  <Checkbox
                    defaultChecked={showTimePicker}
                    onChange={handleNoiseRestrictionChange}
                    color="secondary"
                  />{" "}
                  Noise Restrictions
                  {showTimePicker && (
                    <div >
                      <TextField
                        id="quiet-hours-start"
                        label="Quiet Hours Start"
                        type="time"
                        defaultValue="22:00"
                        sx={{ marginRight: 2 }}
                        InputLabelProps={{
                          shrink: true,
                        }}
                        inputProps={{
                          step: 300, // 5 min
                        }}
                      />

                      <TextField
                        id="quiet-hours-end"
                        label="Quiet Hours End"
                        type="time"
                        defaultValue="12:00"
                        InputLabelProps={{
                          shrink: true,
                        }}
                        inputProps={{
                          step: 300, // 5 min
                        }}
                      />
                    </div>
                  )}
                </Box>
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: 'bold',fontSize: 18, m: 2 }}>
                    Set your own rules
                  </Typography>
                  <TextField
                    id="outlined-multiline-flexible"
                    placeholder="Enter your custom rules here. Each line represents one rule."
                    multiline
                    maxRows={10}
                    
                    sx = {{m: 2 , width: '600px'}}
                    
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
                  
                  <DatePicker title="Check-in From" />
                  <DatePicker title="Until" />
                </Box>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'left',
                    alignItems: 'left',
                    m: 2
                  }}
                >
                  <DatePicker title="Check-out From" />
                  <DatePicker title="Until" />
                </Box>
            </form>
            </Box>

          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
