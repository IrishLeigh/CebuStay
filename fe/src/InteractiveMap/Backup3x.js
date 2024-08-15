import React, { useEffect, useState } from 'react';
import { MapContainer, GeoJSON } from 'react-leaflet';
import * as turf from '@turf/turf';
import cebuCity from './data/Cebu.MuniCities.json';
import "leaflet/dist/leaflet.css";
import './InteractiveMap.css';
import axios from 'axios';

export default function InteractiveMap() {
  // Map target coordinates to their corresponding names
  const locations = {
    "CebuStay": [123.936621, 10.322056],
    "Location2": [123.891052, 10.311142],
    "Location3": [123.921947, 10.295805],
    "Location4": [123.904769, 10.314139],
    // Add more locations as needed
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const resData = await axios.get(
          "http://127.0.0.1:8000/api/getPropertyLocation"
        );
        console.log('ResData: ',resData);


      } catch (err) {
        console.log(err);
      }
    };
    fetchData();
  }, []); // Update useEffect dependency

  const [selectedCity, setSelectedCity] = useState(null);
  const [foundLocations, setFoundLocations] = useState([]);

  const countryStyle = {
    fillColor: '#f00',
    weight: 2,
    opacity: 1,
    color: 'black',
    dashArray: '3',
    fillOpacity: 0.7
  };

  // Function to handle city clicks
  const onEachCity = (city, layer) => {
    const cityName = city.properties.NAME_2;

    layer.on({
      click: () => {
        let found = [];

        if (selectedCity === cityName) {
          // If the clicked city is already selected, deselect it
          setSelectedCity(null);
          setFoundLocations([]);
        } else {
          // Otherwise, select the clicked city
          setSelectedCity(cityName);

          // Check if the target coordinates are within the clicked city
          Object.keys(locations).forEach((name) => {
            const targetCoordinates = locations[name];
            const point = turf.point(targetCoordinates);

            // Handle MultiPolygon and Polygon cases
            let isInPolygon = false;
            if (city.geometry.type === 'Polygon') {
              const cityPolygon = turf.polygon(city.geometry.coordinates);
              isInPolygon = turf.booleanPointInPolygon(point, cityPolygon);
            } else if (city.geometry.type === 'MultiPolygon') {
              city.geometry.coordinates.forEach((polygonCoords) => {
                const cityPolygon = turf.polygon(polygonCoords);
                if (turf.booleanPointInPolygon(point, cityPolygon)) {
                  isInPolygon = true;
                }
              });
            }

            if (isInPolygon) {
              found.push(name);
            }
          });

          setFoundLocations(found);
        }
      }
    });
  };

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
      <MapContainer center={[10.5, 124]} zoom={9} style={{ height: '90vh' }}>
        <GeoJSON
          data={cebuCity.features}
          onEachFeature={onEachCity}
          style={getCityStyle}
        />
      </MapContainer>
      {selectedCity && foundLocations.length > 0 && (
        <div>
          <h2>Locations found within {selectedCity}:</h2>
          <ul>
            {foundLocations.map((location, index) => (
              <li key={index}>{location}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
