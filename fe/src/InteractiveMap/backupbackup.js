import React, { useState } from 'react';
import { MapContainer, GeoJSON } from 'react-leaflet';
import * as turf from '@turf/turf';
import cebuCity from './data/Cebu.MuniCities.json';
import "leaflet/dist/leaflet.css";
import './InteractiveMap.css';

export default function InteractiveMap() {
  // Correct order: [longitude, latitude]
  const [selectedCity, setSelectedCity] = useState(null);
  const [selectedCoordinates, setSelectedCoordinates] = useState(null);
  const targetCoordinates = [123.913679, 10.330554];

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
        let found = false;

        // Handle MultiPolygon and Polygon cases
        if (city.geometry.type === 'Polygon') {
          const cityPolygon = turf.polygon(city.geometry.coordinates);
          const point = turf.point(targetCoordinates);
          found = turf.booleanPointInPolygon(point, cityPolygon);
        } else if (city.geometry.type === 'MultiPolygon') {
          city.geometry.coordinates.forEach((polygonCoords) => {
            const cityPolygon = turf.polygon(polygonCoords);
            const point = turf.point(targetCoordinates);
            if (turf.booleanPointInPolygon(point, cityPolygon)) {
              found = true;
            }
          });
        }

        if (found) {
          setSelectedCity(cityName);
          setSelectedCoordinates(targetCoordinates);
        } else {
          setSelectedCity(null);
          setSelectedCoordinates(null);
        }
      }
    });
  };

  return (
    <div>
      <h1>Cebu City Map</h1>
      <MapContainer center={[10, 100]} zoom={2} style={{ height: '90vh' }}>
        <GeoJSON
          data={cebuCity.features}
          onEachFeature={onEachCity}
          style={countryStyle}
        />
      </MapContainer>
      {selectedCity && selectedCoordinates && (
        <div>
          <h2>Coordinates found within {selectedCity}:</h2>
          <p>Latitude: {selectedCoordinates[1]}</p>
          <p>Longitude: {selectedCoordinates[0]}</p>
        </div>
      )}
    </div>
  );
}
