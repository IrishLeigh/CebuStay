import React, { useState, useEffect } from 'react';
import { MapContainer, GeoJSON, Marker, Popup, useMap } from 'react-leaflet';
import * as turf from '@turf/turf';
import axios from 'axios';
import cebuCity from './data/Cebu.MuniCities.json';
import "leaflet/dist/leaflet.css";
import L from 'leaflet';
import './InteractiveMap.css';
import touristSpots from './data/touristSpots.json'; // Import tourist spots JSON data

export default function InteractiveMap() {
  const [selectedCity, setSelectedCity] = useState(null);
  const [locations, setLocations] = useState([]);
  const [selectedSpot, setSelectedSpot] = useState(null);
  const initialCenter = [10.5, 124];
  const initialZoom = 9;
  const [zoom, setZoom] = useState(9);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [foundLocations ,setFoundLocations] = useState([]);
  

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

  const countryStyle = {
    fillColor: '#FDF7A4',
    weight: 2,
    opacity: 1,
    color: '#FCB26E',
    dashArray: '1',
    fillOpacity: 1
  };

  const getCityStyle = (city) => {
    const cityName = city.properties.NAME_2;

    if (selectedCity === cityName) {
      return { 
        fillColor: '#ADC939',
        color: '#F77D1E',
        weight: 3,
        opacity: 1,
        dashArray: '1',
      };
    } else {
      return countryStyle;
    }
  };

 const onEachCity = (city, layer) => {
  const cityName = city.properties.NAME_2;

  layer.on({
    click: () => {
      if (selectedCity === cityName) {
        // If the city is already selected, deselect it
        setSelectedCity(null);
        setFoundLocations([]);
      } else {
        // If the city is not selected, select it
        setSelectedCity(cityName);

        const found = [];
        console.log("City Name:", cityName);
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


  const customIcon = (url) => L.icon({
    iconUrl: url,
    iconSize: [41, 41],
    iconAnchor: [12, 41],
    popupAnchor: [0, -41],
  });

  return (
    <>
      <div style={{alignItems:"center",justifyContent:"center", backgroundColor:"white", padding:"1rem", }}>
        <div className="title" style={{marginBottom:"0.5rem", textAlign:"center", fontWeight:"bold"}}>
          Explore Cebu, With A Heart 
        </div>
        <div className="subtitle" style={{marginBottom:"1rem", textAlign:"center"}}>
          Choose what you want to do in Cebu, and we will find the accommodation for you
        </div>
      </div>
      <div className="map-background">
        <div className="map-filter-cntr">
          {/* Filter buttons for categories */}
          <button className="map-filter-btn" style={{ backgroundColor: "#16B4DD" }} onClick={() => setSelectedCategory('Where to stay')}>
            Where to stay?
          </button>
          <button className="map-filter-btn" style={{ backgroundColor: "#ADC939" }} onClick={() => setSelectedCategory('Culture & Experiences')}>
            Culture & Experiences
          </button>
          <button className="map-filter-btn" style={{ backgroundColor: "#F9CC41" }} onClick={() => setSelectedCategory('See And Do')}>
            See And Do
          </button>
          <button className="map-filter-btn" style={{ backgroundColor: "#F77D1E" }} onClick={() => setSelectedCategory('Hidden Jewels')}>
            Hidden Jewels
          </button>
          <button className="map-filter-btn" style={{ backgroundColor: "#EE414B" }} onClick={() => setSelectedCategory('Events and Festivals')}>
            Events and Festivals
          </button>
          <button className="map-filter-btn" style={{ backgroundColor: "#A334CF" }} onClick={() => setSelectedCategory('What\'s in Cebu')}>
            What's in Cebu?
          </button>
        </div>

        <div className="map-container">
          {locations.length > 0 ? (
            <MapContainer 
              className='map'
              center={[10.5, 124]} 
              zoom={zoom}
              // f
              // dragging={false} 
              zoomControl={false}
              doubleClickZoom={false}
              minZoom={9}
              maxZoom={11}
            >
              <ResetButton center={initialCenter} zoom={initialZoom} />
              <GeoJSON
                data={cebuCity.features}
                onEachFeature={onEachCity}
                style={getCityStyle}
              />
              {touristSpots
                // .filter(spot => !selectedCategory || spot.category === selectedCategory)
                // // .filter(spot => !selectedCity || spot["city name"] === selectedCity) // Filter by city name
                .map((spot, index) => (
                  <Marker
                    key={index}
                    position={spot.coordinates}
                    title={spot.name}
                    icon={customIcon(spot.iconUrl)}
                    eventHandlers={{
                      click: () => setSelectedSpot(spot),
                    }}
                  >
                    <Popup>{spot.name}</Popup>
                  </Marker>
              ))}
            </MapContainer>
          ) : (
            <p>Loading map data...</p>
          )}
          {selectedSpot && (
            <div>
              <h2>{selectedSpot.name}</h2>
              <img src={selectedSpot.imageUrl} alt={selectedSpot.name} style={{ width: '100%', marginBottom: '1rem' }} />
              <p>{selectedSpot.description}</p>
              <button onClick={() => setSelectedSpot(null)} style={{ marginTop: '1rem' }}>Close</button>
            </div>
          )}
          {selectedCutlure && (
            <div>
              <h2>{selectedCutlure.name}</h2>
              <img src={selectedCutlure.imageUrl} alt={selectedCutlure.name} style={{ width: '100%', marginBottom: '1rem' }} />
              <p>{selectedCutlure.description}</p>
              <button onClick={() => selectedCutlure(null)} style={{ marginTop: '1rem' }}>Close</button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}