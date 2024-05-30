import React, { useState, useEffect } from "react";
import { Container, Paper, Typography, FormControl,
    InputLabel, Select, MenuItem,
} from "@mui/material";

import axios from "axios";
import Sidebar from "../../components/Sidebar";
import WeekPicker from "./components/calendar";

const CalendarUI = () => {

    const [propertyData, setPropertyData] = useState([]);
    const [selectedProperty, setSelectedProperty] = useState("");
    const [selectedUnitType, setSelectedUnitType] = useState("");
    const [unitTypes, setUnitTypes] = useState([]);

    const handlePropertyChange = (event) => {
        const propertyData = event.target.value;
        setSelectedProperty(propertyData);
    };

    const handleUnitTypeChange = (event) => {
        setSelectedUnitType(event.target.value);
        setUnitTypes(event.target.value);
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const propertyres = await axios.get(
                    "http://127.0.0.1:8000/api/property/bookings",
                    {
                        params: {
                            userid: 6,
                        },
                    }
                );
                setPropertyData(propertyres.data);
            } catch (error) {
                console.error(error);
            }
        };
        fetchData();
    }, []);

    return (
        <div style={{ display: "flex" }}>
            <Sidebar />
            <div style={{ flex: 1 }}>
                <Container>
                    <div style={{ paddingTop: "2rem", margin: "0 auto" }}>
                        <Paper style={{ padding: "1rem", width: selectedProperty ? "18rem" : "18rem", margin: "0 auto", }}>
                            <div style={{ display: "flex", alignContent: "center" }}>
                                <FormControl style={{ marginRight: "10px" }}>
                                    <InputLabel style={{ minWidth: "10rem" }}>Select Property</InputLabel>
                                    <Select
                                        value={selectedProperty}
                                        onChange={handlePropertyChange}
                                        style={{ minWidth: "10rem" }}
                                    >
                                        {propertyData
                                            .filter((property, index, self) =>
                                                index === self.findIndex(p =>
                                                    p.property_name === property.property_name
                                                )
                                            ) // Filter to keep only unique properties based on property_name
                                            .map((property, index) => (
                                                <MenuItem key={index} value={property.property_name}>
                                                    {property.property_name}
                                                </MenuItem>
                                            ))}
                                    </Select>
                                </FormControl>
                                <FormControl>
                                    <InputLabel style={{ minWidth: "10rem" }}>Unit No</InputLabel>
                                    <Select
                                        value={selectedUnitType}
                                        onChange={handleUnitTypeChange}
                                        style={{ minWidth: "7rem" }}
                                    >
                                        {propertyData
                                            .filter((unit, index, self) =>
                                                index === self.findIndex(u =>
                                                    u.unitid === unit.unitid && u.property_name === selectedProperty
                                                )
                                            ) // Filter to keep only unique units based on unitid within selected property
                                            .filter(unit => unit.property_name === selectedProperty)
                                            .map((unitType, index) => (
                                                <MenuItem key={index} value={unitType}>
                                                    {unitType.unitid}
                                                </MenuItem>
                                            ))}
                                    </Select>
                                </FormControl>
                            </div>
                        </Paper>
                    </div>
                    {!selectedUnitType && (
                        <Paper sx={{ p: 2, width: '50rem', margin: '0 auto', mt: 5 }}>
                            <Typography variant="h6" align="center">
                                Please select a property and unit number
                            </Typography>
                        </Paper>
                    )}
                    {selectedUnitType && <WeekPicker unitTypes={unitTypes} />} 

                </Container>
            </div>
        </div>
    );
};

export default CalendarUI;
