import React, { useState } from 'react';
import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet';
import cebuCity from './data/Cebu.MuniCities.json';
import * as turf from '@turf/turf';
import "leaflet/dist/leaflet.css";
import './InteractiveMap.css';

export default function InteractiveMap() {
  const [selectedCity, setSelectedCity] = useState(null);
  const [targetCoordinates] = useState([10.330554, 123.913679]);

  const countryStyle = {
    fillColor: '#f00', // Default color
    weight: 2,
    opacity: 1,
    color: 'black',
    dashArray: '3',
    fillOpacity: 0.7
  };

  console.log('City: ', selectedCity);
  console.log('cebuCity: ', cebuCity);
  // Function to handle city clicks
  const onEachCity = (city, layer) => {
    const cityName = city.properties.NAME_2;
    const cityCoordinates = city.geometry.coordinates;
    
    layer.on({
      click: (event) => {
        console.log('event: ', event);
        console.log('cityName: ', cityName);
        console.log('cityCoordinates: ', cityCoordinates);

        if (selectedCity === cityName) {
          // If the clicked city is already selected, deselect it
          setSelectedCity(null);
        } else {
          // Otherwise, select the clicked city
          setSelectedCity(cityName);
        }
      }
    });
  };

  // Function to set the style for each city
  const getCityStyle = (city) => {
    const cityName = city.properties.NAME_2;

    if (selectedCity === cityName) {
      // If the city is selected, change its color
      return { 
        fillColor: '#0f0', // Selected color
        color: 'black',
        weight: 2,
        opacity: 1,
        dashArray: '3',
        fillOpacity: 0.7
      };
    } else {
      // If the city is not selected, use the default color
      return countryStyle;
    }
  };

  return (
    <div>
      <h1>Cebu City Map</h1>
      <MapContainer center={[10, 100]} zoom={2} style={{ height: '90vh' }}>
        <GeoJSON
          data={cebuCity.features}
          onEachFeature={onEachCity}
          style={getCityStyle}
        />
      </MapContainer>
    </div>
  );
}
