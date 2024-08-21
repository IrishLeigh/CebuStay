import React, { useState, useEffect } from 'react';
import { MapContainer, GeoJSON, Marker, Popup, useMap } from 'react-leaflet';
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
  const initialCenter = [10.5, 124];
  const initialZoom = 9;
  const [zoom, setZoom] = useState(9);

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

  useEffect(() => {
    const handleResize = () => {
      const screenWidth = window.innerWidth;

      if (screenWidth < 768) {
        setZoom(7); // Lower zoom for smaller screens
      } else if (screenWidth < 1024) {
        setZoom(8); // Medium zoom for tablet-sized screens
      } else {
        setZoom(9); // Default zoom for larger screens
      }
    };

    window.addEventListener('resize', handleResize);

    // Call handleResize once to set the initial zoom
    handleResize();

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);
// Custom button component to reset the map center and zoom
  function ResetButton({ center, zoom }) {
    const map = useMap();
    
    const handleReset = () => {
      map.setView(center, zoom);
    };

    return (
        <button className="reset-btn" onClick={handleReset} style={{ position: 'absolute', top: '10px', right: '10px', zIndex: 1000 }}>
        Reset Map
      </button>
    );
  }
  // Set the style for the country
  const countryStyle = {
    fillColor: '#FDF7A4',
    weight: 2,
    opacity: 1,
    color: '#FCB26E',
    dashArray: '1',
    fillOpacity: 1
  };

  // Function to set the style for each city when clicked
  const getCityStyle = (city) => {
    const cityName = city.properties.NAME_2;

    if (selectedCity === cityName) {
      return { 
        fillColor: '#ADC939',
        color: '#F77D1E',
        weight: 3,
        opacity: 1,
        dashArray: '1',
        // fillOpacity: 0.7
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

          // Check if the target coordinates are within the clicked city
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
    <>

      <div style={{alignItems:"center",justifyContent:"center", backgroundColor:"white", padding:"1rem", }}>
        <div className="title" style={{marginBottom:"0.5rem", textAlign:"center", fontWeight:"bold"}}>
          Explore Cebu, With A Heart 
        </div>
        <div className="subtitle" style={{marginBottom:"1rem", textAlign:"center"}}>
          Choose what you want to do in cebu, and we will find the accommodation for you
        </div>
       
      </div>
      <div className="map-background">
      <div className="map-filter-cntr">
          <button className="map-filter-btn"  style={{backgroundColor:"#16B4DD"}}>
            Where to stay?
          </button>
          <button className="map-filter-btn"  style={{backgroundColor:"#ADC939"}}>
            Culture & Experiences
          </button>
          <button className="map-filter-btn" style={{backgroundColor:"#F9CC41"}}>
            See And Do
          </button>
          <button className="map-filter-btn" style={{backgroundColor:"#F77D1E"}}>
           Hidden Jewels
          </button>
          <button className="map-filter-btn" style={{backgroundColor:"#EE414B"}}>
           Even and Festivals
          </button>
          <button className="map-filter-btn" style={{backgroundColor:"#A334CF"}}>
            What's in Cebu?
          </button>

        </div>

        <div className="map-container">
        {/* <h1>Cebu City Map</h1> */}
        {locations.length > 0 ? (
          <MapContainer 
            className='map'
            center={[10.5, 124]} 
            zoom={zoom}  
          // To Make the Map Static
          scrollWheelZoom={false} // Disable zooming with scroll
          dragging={false} // Disable dragging
          // zoomControl={false} // Hide zoom controls
          // doubleClickZoom={false} // Disable zooming with double click
          // boxZoom={false} // Disable zooming by drawing a box
          minZoom={9} // Minimum zoom level (zoomed out)
          maxZoom={11} // Maximum zoom level (zoomed in)
          >
            <ResetButton center={initialCenter} zoom={initialZoom} />
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

      </div>
    </>
   
  );
}

