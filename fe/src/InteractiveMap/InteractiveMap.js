import React, { useState, useEffect } from 'react';
import { MapContainer, GeoJSON, Marker, Popup } from 'react-leaflet';
import * as turf from '@turf/turf';
import axios from 'axios';
import cebuCity from './data/Cebu.MuniCities.json';
import "leaflet/dist/leaflet.css";
import L from 'leaflet';
import './InteractiveMap.css';

export default function InteractiveMap() {
  const [selectedCity, setSelectedCity] = useState(null);
  const [foundLocations, setFoundLocations] = useState([]);
  const [locations, setLocations] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:8000/api/getPropertyLocation");
        const fetchedLocations = response.data.data.map((property) => ({
          name: property.property_name,
          coordinates: [parseFloat(property.longitude), parseFloat(property.latitude)],
        }));

        setLocations(fetchedLocations);
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, []);

  const countryStyle = {
    fillColor: '#f00',
    weight: 2,
    opacity: 1,
    color: 'black',
    dashArray: '3',
    fillOpacity: 0.7
  };

  const getCityStyle = (city) => {
    const cityName = city.properties.NAME_2;

    if (selectedCity === cityName) {
      return { 
        fillColor: '#0f0',
        color: 'black',
        weight: 2,
        opacity: 1,
        dashArray: '3',
        fillOpacity: 0.7
      };
    } else {
      return countryStyle;
    }
  };

  const onEachCity = (city, layer) => {
    const cityName = city.properties.NAME_2;
    
    layer.on({
      click: () => {
        const found = [];
        console.log("City Name:", cityName);
        if (!locations.length) {
          console.log('Locations not loaded yet.');
          return;
        }

        if (selectedCity === cityName) {
          setSelectedCity(null);
          setFoundLocations([]);
        } else {
          setSelectedCity(cityName);

          locations.forEach((location) => {
            const point = turf.point(location.coordinates);

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
              found.push({
                name: location.name,
                coordinates: location.coordinates,
              });
            }
          });

          setFoundLocations(found);
        }
      }
    });
  };

  const customIcon = L.icon({
    iconUrl: './resort.png', // Path to your custom marker image
    iconSize: [41, 41], // Size of the icon [width, height]
    iconAnchor: [12, 41], // Point of the icon which will correspond to the marker's location
    popupAnchor: [0, -41], // Point from which the popup should open relative to the iconAnchor
  });

  return (
    <div>
      <h1>Cebu City Map</h1>
      {locations.length > 0 ? (
        <MapContainer center={[10.5, 124]} zoom={9} style={{ height: '90vh' }}
        // scrollWheelZoom={false} // Disable zooming with scroll
        // dragging={false} // Disable dragging
        // zoomControl={false} // Hide zoom controls
        // doubleClickZoom={false} // Disable zooming with double click
        // boxZoom={false} // Disable zooming by drawing a box
        >
          <GeoJSON
            data={cebuCity.features}
            onEachFeature={onEachCity}
            style={getCityStyle}
          />
          {foundLocations.map((location, index) => (
            <Marker 
              key={index} 
              position={[location.coordinates[1], location.coordinates[0]]} 
              title={location.name}
              icon={customIcon}
            >
              <Popup>{location.name}</Popup>
            </Marker>
          ))}
        </MapContainer>
      ) : (
        <p>Loading map data...</p>
      )}
      {selectedCity && foundLocations.length > 0 && (
        <div>
          <h2>Properties found within {selectedCity}:</h2>
          <ul>
            {foundLocations.map((location, index) => (
              <li key={index}>{location.name}</li> 
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

