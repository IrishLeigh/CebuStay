import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Checkbox from '@mui/material/Checkbox';
import TextField from "@mui/material/TextField";
import DatePicker from "../../../components/time";
import { Container, Button } from "@mui/material";
import AnimatePage from "./AnimatedPage";

export default function HouseRules({ onHouseRulesDataChange, parentHouseRules, handleNext, handleBack }) {
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [houseRulesData, setHouseRulesData] = useState(parentHouseRules);
  const [error, setError] = useState(""); // State for error message

 

  // Validation function
  const validateAndProceed = () => {
    if (!houseRulesData.smokingAllowed && !houseRulesData.petsAllowed && !houseRulesData.partiesAllowed) {
      alert("Please select at least one rule.");
      setError("Please select at least one standard rule.");
      return; // Stop execution if validation fails
    }

    if (showTimePicker && (!houseRulesData.quietHoursStart || !houseRulesData.quietHoursEnd)) {
      alert("Please specify quiet hours.");
      setError("Please specify quiet hours.");
      return; // Stop execution if validation fails
    }

    if (!houseRulesData.customRules) {
      alert("Please enter your custom rules.");
      setError("Please enter your custom rules.");
      return; // Stop execution if validation fails
    }

    if (!houseRulesData.checkInFrom || !houseRulesData.checkInUntil || !houseRulesData.checkOutFrom || !houseRulesData.checkOutUntil) {
      alert ("Please specify check-in and check-out times.");
      setError("Please specify check-in and check-out times.");
      return; // Stop execution if validation fails
    }

    setError(""); // Clear error message if validation passes
    onHouseRulesDataChange(houseRulesData);
    handleNext(); // Proceed to the next step
  };

  return (
    <Container maxWidth="lg">
      <AnimatePage>
        <Grid container className="centered-container">
          <Grid item xs={12} md={8} lg={6}>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                textAlign: "left",
              }}
            >
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <Typography sx={{ fontSize: "2rem" }} fontWeight="bold">
                    House Rules
                  </Typography>

                  <Typography sx={{ fontSize: "1rem", width: "100%" }} mb={2} >
                    Set clear rules for your listing to ensure a smooth and enjoyable stay for your guests
                  </Typography>
                </div>
              </Box>
              <Paper elevation={3} sx={{ p: 2, display: "flex", flexDirection: "column", alignItems: "left" }}>
                {/* Standard House Rules*/}
                <form>
                  <Box>
                    <Typography variant="h4" sx={{ fontWeight: 'bold', fontSize: 18, m: 2 }}>Standard Rules</Typography>
                    <Checkbox
                      checked={houseRulesData.smokingAllowed}
                      color="secondary"
                      onChange={(e) => setHouseRulesData(prevData => ({ ...prevData, smokingAllowed: e.target.checked }))}
                    /> Smoking Allowed
                    <br />
                    <Checkbox
                      checked={houseRulesData.petsAllowed}
                      color="secondary"
                      onChange={(e) => setHouseRulesData(prevData => ({ ...prevData, petsAllowed: e.target.checked }))}
                    /> Pets allowed
                    <br />
                    <Checkbox
                      checked={houseRulesData.partiesAllowed}
                      color="secondary"
                      onChange={(e) => setHouseRulesData(prevData => ({ ...prevData, partiesAllowed: e.target.checked }))}
                    /> Parties/events allowed
                    <br />
                    <Checkbox
                      checked={showTimePicker}
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
                      display: 'column',
                      justifyContent: 'left',
                      alignItems: 'left',
                      m: 2
                    }}
                  >
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
