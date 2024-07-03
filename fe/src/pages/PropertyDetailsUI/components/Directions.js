import React, { useEffect, useState } from 'react';
import axios from 'axios';
import MapComponent from './MapComponent'; // Adjust the import path based on your project structure
import { Paper, CircularProgress, Typography } from '@mui/material';

export default function Directions() {
  // Example coordinates for demonstration
  const initialPosition = {
    lat: 10.2746259,
    lng: 123.8554313,
  };
  const [coordinates, setCoordinates] = useState(initialPosition);
  const [directions, setDirections] = useState('');
  const [loading, setLoading] = useState(true); // State to manage loading status

  useEffect(() => {
    const fetchData = async () => {
      const propertyId = 120; // Replace with the ID of the property you want to fetch
      try {
        const reslocation = await axios.get("http://127.0.0.1:8000/api/getlocation", {
          params: {
            propertyid: propertyId
          }
        
        });
        const resdirection = await axios.get("http://127.0.0.1:8000/api/getdirection", {
          params: {
            propertyid: propertyId
          }});
        console.log('location',reslocation.data);
        console.log('direction',resdirection.data);
        const lat = parseFloat(reslocation.data.latitude);
        const lng = parseFloat(reslocation.data.longitude);
        setDirections(resdirection.data.direction);
        setCoordinates({ lat, lng });
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false); // Set loading to false whether API call succeeds or fails
      }
    };
    fetchData();
  }, []); // Update useEffect dependency

  const handleMapClick = () => {
    // Handle map click event if needed
  };

  return (
    <div>
      <div style={{ height: '20vh', width: '20rem' }}>
        <Paper elevation={3} sx={{ p: '1rem', borderRadius: '.5rem', maxHeight: '33.5rem', overflow: 'auto' }}>
          {loading ? (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
              <CircularProgress /> {/* Loader while fetching data */}
            </div>
          ) : (
            <MapComponent position={coordinates} onMapClick={handleMapClick} />
          )}
          <div>
            <br />
            <Typography variant="h6" style={{ fontSize: '1.25rem' }}>Directions</Typography>
            <Typography variant="body1" style={{ fontSize: '1.125rem', maxHeight: '100%' }}>{directions}</Typography>
          </div>
        </Paper>
      </div>
    </div>
  );
}
