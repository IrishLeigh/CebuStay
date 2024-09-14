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
} from "@mui/material";
import axios from "axios";
export default function RulesPolicies({
  propertyid,
  houseRules,
  policies,
  onHouseRulesChange,
  onPoliciesChange,
}) {
  const [houseRulesData, setHouseRulesData] = useState({
    smokingAllowed: false,
    petsAllowed: false,
    partiesAllowed: false,
    noise_restrictions: false,
    quietHoursStart: "22:00",
    quietHoursEnd: "06:00",
    checkInFrom: "12:00",
    checkInUntil: "14:00",
    checkOutFrom: "12:00",
    checkOutUntil: "14:00",
    customRules: "",
  });

  const [policiesData, setPoliciesData] = useState({
    standardCancellation: false,
    cancellationDays: "",
    nonRefundableRate: false,
    modificationPlan: false,
    offerDiscounts: false,
  });

  const [showTimePicker, setShowTimePicker] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [originalData, setOriginalData] = useState({});
  const [hasChanges, setHasChanges] = useState(false);

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
        standardCancellation: policies.is_cancel_plan === 1,
        cancellationDays: policies.cancel_days || "",
        nonRefundableRate: policies.non_refundable === 1,
        modificationPlan: policies.modification_plan === 1,
        offerDiscounts: policies.offer_discount === 1,
      };
      setPoliciesData(initialPoliciesData);
      setOriginalData((prevData) => ({
        ...prevData,
        policiesData: initialPoliciesData,
      }));
    }
  }, [policies]);

  // useEffect(() => {
  //   if (isEditing) {
  //     onHouseRulesChange(houseRulesData);
  //     onPoliciesChange(policiesData);
  //   }
  // }, [houseRulesData, policiesData, isEditing, onHouseRulesChange, onPoliciesChange]);

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setPoliciesData((prevData) => ({
      ...prevData,
      [name]: checked,
    }));
    setHasChanges(true);
  };

  const handleDaysChange = (e) => {
    setPoliciesData((prevData) => ({
      ...prevData,
      cancellationDays: e.target.value,
    }));
    setHasChanges(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setHouseRulesData(originalData.houseRulesData);
    setPoliciesData(originalData.policiesData);
  };

  const handleSave = async () => {
    if (
      policiesData.standardCancellation &&
      policiesData.cancellationDays === ""
    ) {
      alert("Please enter cancellation days");
      return;
    }
    // onHouseRulesChange(houseRulesData);
    // onPoliciesChange(policiesData);
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
      if (res.data) {
        console.log("Response", res.data);
        if (res.data.status === "success") {
          const updated_HR = res.data.updatedRules;
          const updated_pol = res.data.updatedPolicies;
          setHouseRulesData(updated_HR);
          setPoliciesData(updated_pol);
          setOriginalData((prevData) => ({
            ...prevData,
            houseRulesData: updated_HR,
            policiesData: updated_pol,
          }));
          onHouseRulesChange(res.data.rawUpdatedRules);
          onPoliciesChange(res.data.rawUpdatedPolicies);
        }
      }
    } catch (error) {
      console.error(error);
    }
    setHasChanges(false);
    setIsEditing(false);
  };

  return (
    <Paper
      style={{
        width: "auto",
        padding: "4rem",
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
          Rooms and Details
        </Typography>
        <div>
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
        </div>
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
                onChange={(e) =>
                  setHouseRulesData((prevData) => ({
                    ...prevData,
                    smokingAllowed: e.target.checked,
                  }))
                }
              />{" "}
              Smoking Allowed
              <br />
              <Checkbox
                checked={houseRulesData.petsAllowed}
                color="secondary"
                disabled={!isEditing}
                onChange={(e) =>
                  setHouseRulesData((prevData) => ({
                    ...prevData,
                    petsAllowed: e.target.checked,
                  }))
                }
              />{" "}
              Pets allowed
              <br />
              <Checkbox
                checked={houseRulesData.partiesAllowed}
                color="secondary"
                disabled={!isEditing}
                onChange={(e) =>
                  setHouseRulesData((prevData) => ({
                    ...prevData,
                    partiesAllowed: e.target.checked,
                  }))
                }
              />{" "}
              Parties/events allowed
              <br />
              <Checkbox
                checked={showTimePicker}
                disabled={!isEditing}
                onChange={(e) => {
                  setShowTimePicker(e.target.checked);
                  setHouseRulesData((prevData) => ({
                    ...prevData,
                    noise_restrictions: e.target.checked,
                  }));
                }}
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
                    onChange={(e) =>
                      setHouseRulesData((prevData) => ({
                        ...prevData,
                        quietHoursStart: e.target.value,
                      }))
                    }
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
                    onChange={(e) =>
                      setHouseRulesData((prevData) => ({
                        ...prevData,
                        quietHoursEnd: e.target.value,
                      }))
                    }
                  />
                </div>
              )}
            </Box>
            <Box>
              <Typography
                variant="h4"
                sx={{ fontWeight: "bold", fontSize: 18, m: 2 }}
              >
                Set your own rules
              </Typography>
              <TextField
                id="outlined-multiline-flexible"
                placeholder="Enter your custom rules here. Each line represents one rule."
                multiline
                maxRows={10}
                value={houseRulesData.customRules}
                disabled={!isEditing}
                onChange={(e) =>
                  setHouseRulesData((prevData) => ({
                    ...prevData,
                    customRules: e.target.value,
                  }))
                }
                sx={{ m: 2, width: "92%" }}
              />
            </Box>
            <Box
              sx={{
                display: "column",
                justifyContent: "left",
                alignItems: "left",
                m: 2,
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "left",
                  alignItems: "left",
                  m: 2,
                }}
              >
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
                  onChange={(e) =>
                    setHouseRulesData((prevData) => ({
                      ...prevData,
                      checkInFrom: e.target.value,
                    }))
                  }
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
                  onChange={(e) =>
                    setHouseRulesData((prevData) => ({
                      ...prevData,
                      checkInUntil: e.target.value,
                    }))
                  }
                  sx={{ marginRight: 2 }}
                />
              </Box>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "left",
                  alignItems: "left",
                  m: 2,
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
                  onChange={(e) =>
                    setHouseRulesData((prevData) => ({
                      ...prevData,
                      checkOutFrom: e.target.value,
                    }))
                  }
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
                  onChange={(e) =>
                    setHouseRulesData((prevData) => ({
                      ...prevData,
                      checkOutUntil: e.target.value,
                    }))
                  }
                  sx={{ marginRight: 2 }}
                />
              </Box>
            </Box>
          </div>
        </Grid>

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
              Booking Policy
            </h6>
            <Box>
              <InputLabel sx={{ marginRight: 2 }}>
                Cancellation and prepayment policies
              </InputLabel>
              <Checkbox
                checked={policiesData.standardCancellation}
                color="secondary"
                disabled={!isEditing}
                name="standardCancellation"
                onChange={handleCheckboxChange}
              />
              <TextField
                id="cancellation-days"
                label="Cancellation Days"
                value={policiesData.cancellationDays}
                disabled={!isEditing}
                onChange={handleDaysChange}
                sx={{ marginRight: 2 }}
              />
              <InputLabel sx={{ marginRight: 2 }}>Refundable Rates</InputLabel>
              <Checkbox
                checked={policiesData.nonRefundableRate}
                color="secondary"
                disabled={!isEditing}
                name="nonRefundableRate"
                onChange={handleCheckboxChange}
              />
              <br />
              <InputLabel sx={{ marginRight: 2 }}>
                Modification Plans
              </InputLabel>
              <Checkbox
                checked={policiesData.modificationPlan}
                color="secondary"
                disabled={!isEditing}
                name="modificationPlan"
                onChange={handleCheckboxChange}
              />
              <br />
              <InputLabel sx={{ marginRight: 2 }}>Offer Discounts</InputLabel>
              <Checkbox
                checked={policiesData.offerDiscounts}
                color="secondary"
                disabled={!isEditing}
                name="offerDiscounts"
                onChange={handleCheckboxChange}
              />
            </Box>
          </div>
          {isEditing && (
            <div style={{ marginTop: "1rem", textAlign: "right" }}>
              <Button onClick={handleCancel} sx={{ marginRight: "1rem" }}>
                Revert Changes
              </Button>
              <Button
                variant="contained"
                // disabled={!hasChanges}
                onClick={handleSave}
              >
                Save All Changes
              </Button>
            </div>
          )}
        </Grid>
      </Grid>
    </Paper>
  );
}
