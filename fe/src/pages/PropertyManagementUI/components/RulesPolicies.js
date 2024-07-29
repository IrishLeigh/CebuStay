import React, { useState, useEffect } from "react";
import { Grid, InputLabel, Checkbox, TextField, Box, Typography } from "@mui/material";

export default function RulesPolicies({ isEditing, parentHouseRulesData, parentPoliciesData, onHouseRulesChange, onPoliciesChange }) {
  const [houseRulesData, setHouseRulesData] = useState({
    smokingAllowed: false,
    petsAllowed: false,
    partiesAllowed: false,
    quietHoursStart: "22:00",
    quietHoursEnd: "06:00",
    checkInFrom: "12:00",
    checkInUntil: "14:00",
    checkOutFrom: "12:00",
    checkOutUntil: "14:00"
  });

  const [policiesData, setPoliciesData] = useState({
    standardCancellation: false,
    cancellationDays: '',
    nonRefundableRate: false,
    modificationPlan: false,
    offerDiscounts: false,
  });

  const [showTimePicker, setShowTimePicker] = useState(false);

  useEffect(() => {
    if (parentHouseRulesData) {
      setHouseRulesData({
        smokingAllowed: parentHouseRulesData.smoking_allowed === 1,
        petsAllowed: parentHouseRulesData.pets_allowed === 1,
        partiesAllowed: parentHouseRulesData.parties_events_allowed === 1,
        quietHoursStart: parentHouseRulesData.quiet_hours_start || "22:00",
        quietHoursEnd: parentHouseRulesData.quiet_hours_end || "06:00",
        customRules: parentHouseRulesData.custom_rules || "",
        checkInFrom: parentHouseRulesData.check_in_from || "12:00",
        checkInUntil: parentHouseRulesData.check_in_until || "14:00",
        checkOutFrom: parentHouseRulesData.check_out_from || "12:00",
        checkOutUntil: parentHouseRulesData.check_out_until || "14:00"
      });
      setShowTimePicker(parentHouseRulesData.quiet_hours_start && parentHouseRulesData.quiet_hours_end);
    }
  }, [parentHouseRulesData]);

  useEffect(() => {
    if (parentPoliciesData) {
      setPoliciesData({
        standardCancellation: parentPoliciesData.is_cancel_plan === 1,
        cancellationDays: parentPoliciesData.cancel_days || '',
        nonRefundableRate: parentPoliciesData.non_refundable === 1,
        modificationPlan: parentPoliciesData.modification_plan === 1,
        offerDiscounts: parentPoliciesData.offer_discount === 1
      });
    }
  }, [parentPoliciesData]);

  useEffect(() => {
    if (isEditing) {
      onHouseRulesChange(houseRulesData);
      onPoliciesChange(policiesData);
    }
  }, [houseRulesData, policiesData, isEditing, onHouseRulesChange, onPoliciesChange]);

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setPoliciesData(prevData => ({
      ...prevData,
      [name]: checked
    }));
  };

  const handleDaysChange = (e) => {
    setPoliciesData(prevData => ({
      ...prevData,
      cancellationDays: e.target.value
    }));
  };

  return (
    <div style={{ width: "auto" }}>
      <Grid container spacing={2}>
        <Grid item xs={6} sx={{ padding: "1rem" }}>
          <Box sx={{ width: "auto", padding: "1rem", fontFamily: "Poppins, sans-serif" }}>
            <h6 style={{ marginBottom: "1rem", fontWeight: "bold" }}>House Rules</h6>
            <Box>
              <Typography variant="h4" sx={{ fontWeight: 'bold', fontSize: 18, m: 2 }}>Standard Rules</Typography>
              <Checkbox
                checked={houseRulesData.smokingAllowed}
                color="secondary"
                disabled={!isEditing}
                onChange={(e) => setHouseRulesData(prevData => ({ ...prevData, smokingAllowed: e.target.checked }))}
              /> Smoking Allowed
              <br />
              <Checkbox
                checked={houseRulesData.petsAllowed}
                color="secondary"
                disabled={!isEditing}
                onChange={(e) => setHouseRulesData(prevData => ({ ...prevData, petsAllowed: e.target.checked }))}
              /> Pets allowed
              <br />
              <Checkbox
                checked={houseRulesData.partiesAllowed}
                color="secondary"
                disabled={!isEditing}
                onChange={(e) => setHouseRulesData(prevData => ({ ...prevData, partiesAllowed: e.target.checked }))}
              /> Parties/events allowed
              <br />
              <Checkbox
                checked={showTimePicker}
                disabled={!isEditing}
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
                    disabled={!isEditing}
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
                    disabled={!isEditing}
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
                disabled={!isEditing}
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
                  onChange={(e) => setHouseRulesData(prevData => ({ ...prevData, checkInFrom: e.target.value }))}
                  sx={{ marginRight: 2 }}
                />
                <TextField
                  id="check-in-until"
                  label="Check-in Until"
                  type="time"
                  value={houseRulesData.checkInUntil}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  inputProps={{
                    step: 300, // 5 min
                  }}
                  disabled={!isEditing}
                  onChange={(e) => setHouseRulesData(prevData => ({ ...prevData, checkInUntil: e.target.value }))}
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
                  onChange={(e) => setHouseRulesData(prevData => ({ ...prevData, checkOutFrom: e.target.value }))}
                  sx={{ marginRight: 2 }}
                />
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
                  onChange={(e) => setHouseRulesData(prevData => ({ ...prevData, checkOutUntil: e.target.value }))}
                />
              </Box>
            </Box>
          </Box>
        </Grid>
        <Grid item xs={6} sx={{ padding: "1rem" }}>
          <Box sx={{ width: "auto", padding: "1rem", fontFamily: "Poppins, sans-serif" }}>
            <h6 style={{ marginBottom: "1rem", fontWeight: "bold" }}>Policies</h6>
            <Box>
              <Typography variant="h4" sx={{ fontWeight: 'bold', fontSize: 18, m: 2 }}>Cancellation Policy</Typography>
              <Checkbox
                checked={policiesData.standardCancellation}
                color="secondary"
                disabled={!isEditing}
                onChange={(e) => handleCheckboxChange(e, 'standardCancellation')}
                name="standardCancellation"
              /> Standard Cancellation Plan
              <br />
              {policiesData.standardCancellation && (
                <TextField
                  label="Cancellation Days"
                  type="number"
                  value={policiesData.cancellationDays}
                  disabled={!isEditing}
                  onChange={handleDaysChange}
                  sx={{ marginTop: 2 }}
                />
              )}
              <br />
              <Checkbox
                checked={policiesData.nonRefundableRate}
                color="secondary"
                disabled={!isEditing}
                onChange={handleCheckboxChange}
                name="nonRefundableRate"
              /> Non-refundable Rate
              <br />
              <Checkbox
                checked={policiesData.modificationPlan}
                color="secondary"
                disabled={!isEditing}
                onChange={handleCheckboxChange}
                name="modificationPlan"
              /> Modification Plan
              <br />
              <Checkbox
                checked={policiesData.offerDiscounts}
                color="secondary"
                disabled={!isEditing}
                onChange={handleCheckboxChange}
                name="offerDiscounts"
              /> Offer Discounts
            </Box>
          </Box>
        </Grid>
      </Grid>
    </div>
  );
}