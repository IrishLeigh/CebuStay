import React, { useState, useEffect } from "react";
import {
  Container,
  Paper,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Grid,
} from "@mui/material";

import axios from "axios";
// import Sidebar from "../sidebar";
// import WeekPicker from "../../../Calendar/components/calendar";
import CalendarComponent from "./CalendarComponent";

const CalendarLayout = () => {
  const [propertyData, setPropertyData] = useState([]);
  const [selectedProperty, setSelectedProperty] = useState("");
  const [selectedUnitType, setSelectedUnitType] = useState("");
  const [unitTypes, setUnitTypes] = useState({});
  const [propertyTypes, setPropertyTypes] = useState({});
  const [home, setHome] = useState(true);
  const [user, setUser] = useState(null);

  const handlePropertyChange = (event) => {
    const propertyDataName = event.target.value;
    setSelectedProperty(propertyDataName);

    const selectedPropertyName = event.target.value;
    const filteredProperties = propertyData.filter(
      (property) => property.property_name === selectedPropertyName
    );
    if (filteredProperties[0].property_type !== "Home") {
      setHome(false);
    }

    setPropertyTypes(filteredProperties);
  };

  const handleUnitTypeChange = (event) => {
    setSelectedUnitType(event.target.value);
    setUnitTypes(event.target.value);
  };
  useEffect(() => {
    const token = localStorage.getItem("auth_token");
    if (token) {
      axios
        .post("http://127.0.0.1:8000/api/decodetoken", { token: token })
        .then((response) => {
          setUser(response.data["data"]);
          console.log("RESPONSE DATA: ", response.data["data"]);
        })
        .catch((error) => {
          alert("Error decoding JWT token:", error);
          setUser(null);
        });
    } else {
      setUser(null);
    }
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;
      try {
        const propertyres = await axios.get(
          "http://127.0.0.1:8000/api/property/bookings",
          {
            params: {
              userid: user.userid,
            },
          }
        );
        setPropertyData(propertyres.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, [user]);

  return (
    <>
      <Grid container>
        {/* <Grid item xs={2}>
          <div style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Sidebar />
          </div>
        </Grid> */}

        <Grid item xs={12}>
        <div style={{ background: 'linear-gradient(to right,  #16B4DD, #A0F9FF, #4FF3FE)', padding: '1.5rem', color: '#ffffff', borderBottomLeftRadius: '0.5rem', borderBottomRightRadius: '0.5rem', width: '100%',}}>
                <h1 className="title" style={{ fontSize: '1.875rem', fontWeight: '700', marginBottom: '0.5rem', color: 'white', font: 'poppins', textAlign: 'left' }}>Calendar</h1>
                <p style={{ fontSize: '0.875rem', textAlign: 'left' }}><br/></p>
            </div>

          <Paper style={{ paddingTop: "2rem", paddingBottom: "2rem", margin: "2rem" }}>

            <Paper
              style={{
                padding: ".5rem",
                width: !home ? "18rem" : "12rem",
                margin: "1.5rem",
              }}
            >
              <div style={{ display: "flex", alignContent: "center" }}>
                <FormControl style={{ marginRight: "10px" }}>
                  <InputLabel style={{ minWidth: "10rem" }}>
                    Select Property
                  </InputLabel>
                  <Select
                    value={selectedProperty}
                    onChange={handlePropertyChange}
                    style={{ minWidth: "10rem" }}
                  // disabled = {!propertyData ? false : true}
                  >
                    {propertyData
                      .filter(
                        (property, index, self) =>
                          index ===
                          self.findIndex(
                            (p) => p.property_name === property.property_name
                          )
                      ) // Filter to keep only unique properties based on property_name
                      .map((property, index) => (
                        <MenuItem key={index} value={property.property_name}>
                          {property.property_name}
                        </MenuItem>
                      ))}
                  </Select>
                </FormControl>
                {home === false && (
                  <FormControl>
                    <InputLabel style={{ minWidth: "10rem" }}>
                      Unit No
                    </InputLabel>
                    <Select
                      value={selectedUnitType}
                      onChange={handleUnitTypeChange}
                      style={{ minWidth: "7rem" }}
                    // disabled = {!propertyData ? false : true}
                    >
                      {propertyData
                        .filter(
                          (unit, index, self) =>
                            index ===
                            self.findIndex(
                              (u) =>
                                u.unitid === unit.unitid &&
                                u.property_name === selectedProperty
                            )
                        ) // Filter to keep only unique units based on unitid within selected property
                        .filter(
                          (unit) => unit.property_name === selectedProperty
                        )
                        .map((unitType, index) => (
                          <MenuItem key={index} value={unitType}>
                            {unitType.unitid}
                          </MenuItem>
                        ))}
                    </Select>
                  </FormControl>
                )}
              </div>
            </Paper>
          
          
          <CalendarComponent propertyTypes={propertyTypes} />
          </Paper>
        </Grid>
      </Grid>

    </>
  );
};

export default CalendarLayout;