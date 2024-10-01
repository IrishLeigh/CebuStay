  import React, { useState, useEffect, useRef } from "react";
  import { MapContainer, GeoJSON, Marker, Popup, useMap, Polyline, Tooltip } from "react-leaflet";
  import * as turf from "@turf/turf";
  import axios from "axios";
  import cebuCity from "./data/Cebu.MuniCities.json";
  import "leaflet/dist/leaflet.css";
  import L from "leaflet";
  import "./InteractiveMap.css";
  import CultureCard from "./components/CultureCard"; // Import the CultureCard component
  import CulturalExperiences from "./data/CulturalExperiences.json";
  import SeeAndDo from "./data/SeeAndDo.json"; // Import see and do JSON data
  import SeeAndDoCard from "./components/SeeAndDoCard";
  import { Chip } from "@mui/material";
  import MyLocationIcon from '@mui/icons-material/MyLocation'; // Icon for nearby locations
  import RefreshIcon from '@mui/icons-material/Refresh'; // Icon for reset
  import HelpIcon from '@mui/icons-material/Help'; // Icon for instructions


  export default function InteractiveMap() {
    const [selectedCity, setSelectedCity] = useState(null);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [locations, setLocations] = useState([]);
    const [selectedCulture, setSelectedCulture] = useState(null);
    const [selectedSeeAndDo, setSelectedSeeAndDo] = useState(null);
    const [selectedProperty, setSelectedProperty] = useState(null);
    const mapContainerRef = useRef(null);
    const initialCenter = [10.5, 124];
    const initialZoom = 9;
    const [zoom, setZoom] = useState(9);
    const [foundLocations, setFoundLocations] = useState([]);
    const [userLocation, setUserLocation] = useState(null);
    const [nearbyLocations, setNearbyLocations] = useState([]);
    const [filteredLocations, setFilteredLocations] = useState([]);
    const [allProperties, setAllProperties] = useState([]);
    const [option, setOption] = useState(null);

    useEffect(() => {

      const fetchData = async () => {
        try {
          const response = await axios.get(
            "http://127.0.0.1:8000/api/getPropertyLocation"
          );
          const fetchedLocations = response.data.data.map((property) => ({
            name: property.property_name,
            coordinates: [
              parseFloat(property.longitude),
              parseFloat(property.latitude),
            ],
          }));
          const allproperty = await axios.get("http://127.0.0.1:8000/api/getallpropertiescoord");
          setAllProperties(allproperty.data);
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
          setZoom(6); // Lower zoom for smaller screens
        } else if (screenWidth < 1024) {
          setZoom(8); // Medium zoom for tablet-sized screens
        } else {
          setZoom(9); // Default zoom for larger screens
        }
      };

    window.addEventListener("resize", handleResize);
    handleResize();

      return () => {
        window.removeEventListener("resize", handleResize);
      };
    }, []);

    useEffect(() => {
      // Filter locations based on selected category
      let newFilteredLocations = locations;
      if (selectedCategory === "See And Do") {
        newFilteredLocations = SeeAndDo;
        setOption("see");
      } else if (selectedCategory === "Culture & Experiences") {
        newFilteredLocations = CulturalExperiences;
        setOption("culture");
      } else if (selectedCategory === "Where to stay") {
        newFilteredLocations = allProperties; // Use allProperties for "Where to stay?"
        setOption("stay");
      }
      setFilteredLocations(newFilteredLocations);
    }, [selectedCategory, locations, allProperties]);
    const myLocation = () => {
      if (!selectedCategory){
        alert ("Please select a category first: See And Do, Culture & Experiences, or Where to stay?");
        return ;
      }
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            setUserLocation([latitude, longitude]);
            console.log("User's location:", latitude, longitude);
            findNearbyLocations([latitude, longitude]);
          },
          (error) => {
            console.error("Error getting user's location:", error);
          }
        );
      } else {
        console.log("Geolocation is not supported by this browser.");
      }
    };
    const resetLocations = () => {
      setUserLocation(null);
      setNearbyLocations([]);
    };
    const findNearbyLocations = (userLocation) => {
      if (!filteredLocations.length) return; // No filtered locations
      const userPoint = turf.point(userLocation);
      console.log("User's filteredLocations:", filteredLocations);
      // Calculate distances and filter locations within 5 km
      const nearby = filteredLocations
        .map((loc) => {
          const locPoint = turf.point(loc.coordinates);
          console.log("locPoint:", locPoint);
          const distance = turf.distance(userPoint, locPoint, { units: 'kilometers' });
          return { ...loc, distance };
        })
        .filter((loc) => loc.distance <= 20) // Only include locations within 5 km
        .sort((a, b) => a.distance - b.distance) // Sort by distance
        .slice(0, 5); // Take the nearest 5 locations
      setSelectedCategory(null);
      setNearbyLocations(nearby);
    };

    const handleClickOutside = (event) => {
      if (
        mapContainerRef.current &&
        !mapContainerRef.current.contains(event.target)
      ) {
        setSelectedCity(null);
        setSelectedCulture(null);
        setSelectedSeeAndDo(null);
      }
    };

  useEffect(() => {
    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  const handleCityClick = (cityName, event) => {
    event.originalEvent.stopPropagation(); // Prevent map click event
    setSelectedCity((prevCity) => (prevCity === cityName ? null : cityName));
  };

    const handleMarkerClick = (spot, event) => {
      event.originalEvent.stopPropagation(); // Prevent map click event
      if (selectedCategory === "See And Do") {
        setSelectedSeeAndDo(spot);
        setSelectedProperty(null);
        setSelectedCulture(null); // Deselect culture
        resetLocations();
      } else if (selectedCategory === "Culture & Experiences") {
        setSelectedCulture(spot);
        setSelectedProperty(null);
        setSelectedSeeAndDo(null); // Deselect see and do
        resetLocations();
      }else if (selectedCategory === "Where to stay") {
        setSelectedProperty(spot);
        setSelectedSeeAndDo(null); // Deselect see and do
        setSelectedCulture(null); // Deselect culture
        resetLocations();
      }
    };

    function ResetButton({ center, zoom  , selectedCategory}) {
      const map = useMap();
      const [showInstructions, setShowInstructions] = useState(false);
      const [openInstructions, setOpenInstructions] = useState(false);
    
      const handleReset = () => {
        map.setZoom(initialZoom); // Set the desired zoom level
        map.setView(initialCenter, initialZoom); // Recenters the view

      };
    
      // const toggleInstructions = () => {
      //   setShowInstructions((prev) => !prev);
      // };
    
      // const handleDialogOpen = () => {
      //   setOpenInstructions(true);
      // };
    
      // const handleDialogClose = () => {
      //   setOpenInstructions(false);
      // };
  
      return (
        <div style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'center',
          position: "absolute",
          top: "8%",
          left: "50%",
          transform: 'translateX(-50%)',
          zIndex: 500,
          backgroundColor: 'transparent', // Remove white background
          padding: '15px',
        }}>
          <Chip
            label="Reset Zoom"
            onClick={handleReset}
            icon={<RefreshIcon />}
            style={{ margin: '5px' }}
          />
          <Chip
            label="Nearby Locations"
            onClick={myLocation}
            icon={<MyLocationIcon />}
            style={{ margin: '5px' }}
          />
          {/* <Chip
            label="Instructions"
            onClick={toggleInstructions}
            icon={<HelpIcon />}
            style={{ margin: '5px' }}
          /> */}
        </div>
      );
    }
    
    const countryStyle = {
      fillColor: "#FDF7A4",
      weight: 2,
      opacity: 1,
      color: "#FCB26E",
      dashArray: "1",
      fillOpacity: 1,
    };

  const customIcon = (url) =>
    L.icon({
      iconUrl: url,
      iconSize: [41, 41],
      iconAnchor: [12, 41],
      popupAnchor: [0, -41],
    });

  const getCityStyle = (city) => {
    const cityName = city.properties.NAME_2;

    if (selectedCity === cityName) {
      return {
        fillColor: "#ADC939",
        color: "#F77D1E",
        weight: 3,
        opacity: 1,
        dashArray: "1",
      };
    } else {
      return countryStyle;
    }
  };

  const onEachCity = (city, layer) => {
    const cityName = city.properties.NAME_2;

      layer.on({
        click: (event) => { handleCityClick(cityName, event); resetLocations(); }

      });
      layer.bindTooltip(cityName, {
        permanent: false, // Tooltip appears on hover only
        direction: "auto",
        className: "city-tooltip", // Optional: to apply custom styles
      });
    };
    const renderPolylines = () => {
      if (userLocation && nearbyLocations.length > 0) {
        return nearbyLocations.map((location, index) => {
          const distance = turf.distance(turf.point(userLocation), turf.point(location.coordinates), { units: 'kilometers' });
          const lineCoords = [userLocation, location.coordinates];

          return (
            <Polyline
              key={index}
              positions={lineCoords}
              pathOptions={{
                color: 'green',
                weight: 4,
                opacity: 0.7,
                dashArray: '10, 5', // Dashed line
                lineCap: 'round',
                lineJoin: 'round'
              }}
            >
              <Tooltip>
                Distance: {distance.toFixed(2)} km
              </Tooltip>
            </Polyline>
          );
        });
      }
      return null;
    };

    console.log("nearbyLocations:", nearbyLocations);

    return (
      <div className="interactive-map " >
        <div
          style={{
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "white",
            padding: "1rem",
          }}
        >
          <div
            className="title"
            style={{
              marginBottom: "0.5rem",
              textAlign: "center",
              fontWeight: "bold",
              color: "#2A2A2E",
            }}
          >
            Explore Cebu, With A Heart
          </div>
          <div
            className="subtitle"
            style={{ marginBottom: "1rem", textAlign: "center" }}
          >
            Choose what you want to do in Cebu, and we will find the accommodation
            for you
          </div>
        </div>
        <div className="map-background">
          <div className="map-filter-cntr">
            {/* Filter buttons for categories */}
            <button
              className="map-filter-btn"
              style={{ backgroundColor: "#16B4DD", display: 'flex', alignItems: 'center' }}
              onClick={() => { setSelectedCategory("Where to stay"); resetLocations(); }}
            >
              <div style={{ 
                backgroundColor: 'white', 
                borderRadius: '50%', 
                padding: '4px', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                marginRight: '8px' 
              }}>
                <img src="/WhereToStay.png" alt="Where to stay" style={{ width: '1.5rem', height: '1.5rem' }} />
              </div>
              Where to stay?
            </button>
            <button
              className="map-filter-btn"
              style={{ backgroundColor: "#ADC939", display: 'flex', alignItems: 'center' }}
              onClick={() => { setSelectedCategory("Culture & Experiences"); resetLocations(); }}
            >
              <div style={{ 
                backgroundColor: 'white', 
                borderRadius: '50%', 
                padding: '4px', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                marginRight: '8px' 
              }}>
                <img src="/Culture.png" alt="Culture & Experiences" style={{ width: '1.5rem', height: '1.5rem' }} />
              </div>
              Culture & Experiences
            </button>
            <button
              className="map-filter-btn"
              style={{ backgroundColor: "#F9CC41", display: 'flex', alignItems: 'center' }}
              onClick={() => { setSelectedCategory("See And Do"); resetLocations(); }}
            >
              <div style={{ 
                backgroundColor: 'white', 
                borderRadius: '50%', 
                padding: '4px', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                marginRight: '8px' 
              }}>
                <img src="/See.png" alt="See And Do" style={{ width: '1.5rem', height: '1.5rem' }} />
              </div>
              See And Do
            </button>
            {/* <button
              className="map-filter-btn"
              style={{ backgroundColor: "#F77D1E" }}
              onClick={() => { setSelectedCategory("Hidden Jewels"); resetLocations(); }}
            >
              Hidden Jewels
            </button>
            <button
              className="map-filter-btn"
              style={{ backgroundColor: "#EE414B" }}
              onClick={() => { setSelectedCategory("Events and Festivals"); resetLocations(); }}
            >
              Events and Festivals
            </button>
            <button
              className="map-filter-btn"
              style={{ backgroundColor: "#A334CF" }}
              onClick={() => { setSelectedCategory("What's in Cebu"); resetLocations(); }}
            >
              What's in Cebu?
            </button> */}
            {/* <button
              className="map-filter-btn"
              style={{ backgroundColor: "#0C58BF" }}
              onClick={myLocation}
            >
              Nearby Me
            </button> */}
          </div>

          <div className="map-container" ref={mapContainerRef}>
            {locations.length > 0 ? (
              <MapContainer
                className="map"
                center={initialCenter}
                zoom={zoom}
                // scrollWheelZoom={false}
                // dragging={true}
                zoomControl={false}
                doubleClickZoom={false}
                // touchZoom={false}
                boxZoom={false}
                // keyboard={false}
                minZoom={9}
                maxZoom={11}
                onClick={() => {
                  setSelectedCity(null); // Deselect city
                  setSelectedCulture(null); // Deselect culture
                  setSelectedSeeAndDo(null); // Deselect see and do
                }}
              >
                <ResetButton center={initialCenter} zoom={initialZoom} />

                <GeoJSON
                  data={cebuCity.features}
                  onEachFeature={onEachCity}
                  style={getCityStyle}
                />
                {selectedCategory === "Where to stay" &&
                  filteredLocations.map((property, index) => {
                    const lat = parseFloat(property.coordinates[0]); // Convert latitude to float
                    const lng = parseFloat(property.coordinates[1]); // Convert longitude to float

                    // Check for valid LatLng values before rendering
                    if (!isNaN(lat) && !isNaN(lng)) {
                      return (
                        <Marker
                          key={index}
                          position={[lat, lng]} // Use parsed latitude and longitude
                          title={property.property_name} // Use property name for the title
                          icon={customIcon('/resort.png')} // Use custom icon function
                          eventHandlers={{
                            click: (e) => handleMarkerClick(property, e), // Handle marker click
                          }}
                        >
                          <Popup>{property.name}</Popup>
                        </Marker>
                      );
                    } else {
                      console.warn(`Invalid coordinates for property ${property.property_name}: (${property.coordinates[0]}, ${property.coordinates[1]})`);
                      return null; // Return null if coordinates are invalid
                    }
                  })}

                {selectedCategory === "Culture & Experiences" &&
                  CulturalExperiences.filter(
                    (culture) =>
                      !selectedCity || culture["city name"] === selectedCity
                  ).map((culture, index) => (
                    <Marker
                      key={index}
                      position={culture.coordinates}
                      title={culture.name}
                      icon={customIcon(culture.iconUrl)}
                      eventHandlers={{
                        click: (e) => handleMarkerClick(culture, e),
                      }}
                    >
                      <Popup>{culture.name}</Popup>
                    </Marker>
                  ))}
                {userLocation && (
                  <Marker
                    position={userLocation}
                    icon={customIcon("/userPin.png")}
                  >
                    <Popup>You are here</Popup>
                  </Marker>
                )}
                {userLocation && nearbyLocations.map((location, index) => (
                  <Marker
                    key={index}
                    position={location.coordinates}
                    icon={location.category === "Property"
                      ? L.icon({
                        iconUrl: '/resort.png',
                      })
                      : customIcon(location.iconUrl)}
                  >
                    <Popup>{location.name}</Popup>
                  </Marker>
                ))}
                {renderPolylines()}

                {selectedCategory === "See And Do" &&
                  SeeAndDo.filter(
                    (spot) => !selectedCity || spot["city name"] === selectedCity
                  ).map((spot, index) => (
                    <Marker
                      key={index}
                      position={spot.coordinates}
                      title={spot.name}
                      icon={customIcon(spot.iconUrl)}
                      eventHandlers={{
                        click: (e) => handleMarkerClick(spot, e),
                      }}
                    >
                      <Popup>{spot.name}</Popup>
                    </Marker>
                  ))}
              </MapContainer>
            ) : (
              <p>Loading map data...</p>
            )}
            {selectedSeeAndDo && selectedCategory === "See And Do" && (
              <div>
                <SeeAndDoCard
                  spot={selectedSeeAndDo}
                  onClose={() => setSelectedSeeAndDo(null)}
                />
              </div>
            )}
            {selectedCulture && selectedCategory === "Culture & Experiences" && (
              <div className="culture-card-container">
                <CultureCard
                  culture={selectedCulture}
                  allProperties={allProperties}
                  onClose={() => setSelectedCulture(null)}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
