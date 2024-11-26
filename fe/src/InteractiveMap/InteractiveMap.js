import React, { useState, useEffect, useRef } from "react";
import {
  MapContainer,
  GeoJSON,
  Marker,
  Popup,
  useMap,
  Polyline,
  Tooltip,
} from "react-leaflet";
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
import MyLocationIcon from "@mui/icons-material/MyLocation"; // Icon for nearby locations
import RefreshIcon from "@mui/icons-material/Refresh"; // Icon for reset
import HelpIcon from "@mui/icons-material/Help"; // Icon for instructions
import StayCard from "./components/StayCard";
import ClickOutsideComponent from "./components/ClickOutsideComponent";
import WelcomeCebuMap from "./components/WelcomeCebuMap";
import { Dialog, IconButton, useMediaQuery, Box } from "@mui/material"; // Import Dialog and useMediaQuery
import MapIcon from "@mui/icons-material/Map";

export default function InteractiveMap() {
  const [selectedCity, setSelectedCity] = useState(null);
  const [selectedCategory, setSelectedCategory] =
    React.useState("Where to stay");
  const [locations, setLocations] = React.useState([]);
  const [selectedCulture, setSelectedCulture] = useState(null);
  const [selectedSeeAndDo, setSelectedSeeAndDo] = useState(null);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const mapContainerRef = useRef(null);
  const initialCenter = [10.5, 124];
  const initialZoom = 9;
  const [zoom, setZoom] = useState(initialZoom);
  const [foundLocations, setFoundLocations] = React.useState([]);
  const [userLocation, setUserLocation] = useState(null);
  const [nearbyLocations, setNearbyLocations] = React.useState([]);
  const [filteredLocations, setFilteredLocations] = React.useState([]);
  const [allProperties, setAllProperties] = React.useState([]);
  const [option, setOption] = useState(null);
  const [showWelcomeMap, setShowWelcomeMap] = useState(true);
  const isSmallScreen = useMediaQuery("(max-width:600px)");
  const [showWelcomeMapModal, setShowWelcomeMapModal] = React.useState(false);

  const handleOpenWelcomeMap = () => setShowWelcomeMapModal(true);
  const handleCloseWelcomeMap = () => setShowWelcomeMapModal(false);

  React.useEffect(() => {
    if (selectedCategory === "Where to stay") {
      // Filter the locations based on the selected city or some default criteria
      setFilteredLocations(
        locations.filter((location) => location.category === "Property")
      );
    }
  }, [locations, selectedCategory]);

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
        const allproperty = await axios.get(
          "http://127.0.0.1:8000/api/getallpropertiescoord"
        );
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

  const SetScrollWheelZoom = () => {
    const map = useMap();

    useEffect(() => {
      map.scrollWheelZoom.disable();

      const handleWheel = (e) => {
        e.preventDefault(); // Prevent zooming on scroll
      };

      // Attach wheel event to the map container
      map.on("wheel", handleWheel);

      return () => {
        map.off("wheel", handleWheel);
        map.scrollWheelZoom.enable(); // Re-enable if needed
      };
    }, [map]);

    return null; // This component does not render anything
  };

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
    if (!selectedCategory) {
      alert(
        "Please select a category first: See And Do, Culture & Experiences, or Where to stay?"
      );
      return;
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
  const handleClick = (category) => {
    setSelectedCategory(category);
    resetLocations();
  };
  const findNearbyLocations = (userLocation) => {
    if (!filteredLocations.length) return; // No filtered locations
    const userPoint = turf.point(userLocation);
    console.log("User's filteredLocations:", filteredLocations);

    // Calculate distances and filter locations within 5 km
    const nearby = filteredLocations
      .map((loc) => {
        // Check if coordinates are valid (not null)
        const { coordinates } = loc;
        if (
          !coordinates ||
          coordinates[0] === null ||
          coordinates[1] === null
        ) {
          return null; // Skip this location
        }

        const locPoint = turf.point(coordinates);
        console.log("locPoint:", locPoint);
        const distance = turf.distance(userPoint, locPoint, {
          units: "kilometers",
        });
        return { ...loc, distance };
      })
      .filter((loc) => loc !== null && loc.distance <= 20) // Only include valid locations within 20 km
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
      setSelectedProperty(null);
      setShowWelcomeMap(true);
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
    setShowWelcomeMap(false); // Hide the WelcomeCebuMap when a property is clicked

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
    } else if (selectedCategory === "Where to stay") {
      setSelectedProperty(spot);
      setSelectedSeeAndDo(null); // Deselect see and do
      setSelectedCulture(null); // Deselect culture
      resetLocations();
    }
  };

  const handleClickOutsideClose = () => {
    if (selectedCategory === "Where to stay") {
      setSelectedProperty(null);
    } else if (selectedCategory === "See And Do") {
      setSelectedSeeAndDo(null);
    } else if (selectedCategory === "Culture & Experiences") {
      setSelectedCulture(null);
    }
  };

  function ResetButton({ center, zoom, selectedCategory }) {
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
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
          position: "absolute",
          top: "1%",
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 500,
          backgroundColor: "transparent",
          padding: "15px",
          flexWrap: "wrap", // Allow wrapping on small screens
        }}
      >
        <Chip
          label="Reset Zoom"
          onClick={handleReset}
          icon={<RefreshIcon />}
          style={{
            margin: "5px",
            fontSize: "0.9rem", // Adjust font size
          }}
        />
        <Chip
          label="Nearby Locations"
          onClick={myLocation}
          icon={<MyLocationIcon />}
          style={{
            margin: "5px",
            fontSize: "0.9rem", // Adjust font size
          }}
        />

        {/* Add the "Open Welcome Map" as a Chip */}
        {isSmallScreen && (
          <Chip
            label="Manual"
            onClick={handleOpenWelcomeMap}
            icon={<MapIcon />} // Add the icon here
            style={{
              margin: "5px",
              fontSize: "0.9rem", // Adjust font size
            }}
          />
        )}
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

  // Hover style for provinces
  const hoverStyle = {
    fillColor: "#FFD700", // Change to a distinct hover color
    weight: 2,
    opacity: 1,
    color: "#FCB26E", // Keep border color the same or change as needed
    dashArray: "1",
    fillOpacity: 1,
  };

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

    // Set the initial style for the layer
    layer.setStyle(getCityStyle(city));

    // Event handlers for mouse hover
    layer.on({
      mouseover: () => {
        layer.setStyle(hoverStyle); // Change style on hover
      },
      mouseout: () => {
        layer.setStyle(getCityStyle(city)); // Reset style on mouse out
      },
      click: (event) => {
        handleCityClick(cityName, event);
        resetLocations();
      },
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
        const distance = turf.distance(
          turf.point(userLocation),
          turf.point(location.coordinates),
          { units: "kilometers" }
        );
        const lineCoords = [userLocation, location.coordinates];

        return (
          <Polyline
            key={index}
            positions={lineCoords}
            pathOptions={{
              color: "green",
              weight: 4,
              opacity: 0.7,
              dashArray: "10, 5", // Dashed line
              lineCap: "round",
              lineJoin: "round",
            }}
          >
            <Tooltip>Distance: {distance.toFixed(2)} km</Tooltip>
          </Polyline>
        );
      });
    }
    return null;
  };

  console.log("nearbyLocations:", nearbyLocations);

  return (
    <div className="interactive-map ">
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
          <button
            className={`map-filter-btn ${
              selectedCategory === "Where to stay" ? "active" : ""
            }`}
            onClick={() => handleClick("Where to stay")}
            style={{
              backgroundColor: "#16B4DD",
              display: "flex",
              alignItems: "center",
            }}
          >
            <div
              style={{
                backgroundColor: "white",
                borderRadius: "50%",
                padding: "4px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginRight: "8px",
              }}
            >
              <img
                src="/WhereToStay.png"
                alt="Where to stay"
                style={{ width: "1.5rem", height: "1.5rem" }}
              />
            </div>
            Where to stay?
          </button>
          <button
            className={`map-filter-btn ${
              selectedCategory === "Culture & Experiences" ? "active" : ""
            }`}
            onClick={() => handleClick("Culture & Experiences")}
            style={{
              backgroundColor: "#ADC939",
              display: "flex",
              alignItems: "center",
            }}
          >
            <div
              style={{
                backgroundColor: "white",
                borderRadius: "50%",
                padding: "4px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginRight: "8px",
              }}
            >
              <img
                src="/Culture.png"
                alt="Culture & Experiences"
                style={{ width: "1.5rem", height: "1.5rem" }}
              />
            </div>
            Culture & Experiences
          </button>
          <button
            className={`map-filter-btn ${
              selectedCategory === "See And Do" ? "active" : ""
            }`}
            onClick={() => handleClick("See And Do")}
            style={{
              backgroundColor: "#F9CC41",
              display: "flex",
              alignItems: "center",
            }}
          >
            <div
              style={{
                backgroundColor: "white",
                borderRadius: "50%",
                padding: "4px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginRight: "8px",
              }}
            >
              <img
                src="/See.png"
                alt="See And Do"
                style={{ width: "1.5rem", height: "1.5rem" }}
              />
            </div>
            See And Do
          </button>
        </div>
        <Box>
          <div
            className="map-container"
            ref={mapContainerRef}
            style={{ position: "relative", overflow: "visible" }}
          >
            <div
              style={{
                width: isSmallScreen ? "100%" : "50%", // Full width for small screens, 60% for larger screens
                margin: isSmallScreen ? "0" : "5px 10px 5px 0px", // Remove margin for small screens
                position: isSmallScreen ? "absolute" : "relative", // Absolute positioning for small screens
                top: 0, // Ensure it stays at the top of its container
                left: isSmallScreen ? "50%" : "0", // Center the map horizontally on small screens
                transform: isSmallScreen ? "translateX(-50%)" : "none", // Adjust for centering effect on small screens
                zIndex: isSmallScreen ? 1 : 0, // Ensure the map is in front on small screens
              }}
            >
              {locations.length > 0 ? (
                <MapContainer
                  className="map"
                  center={initialCenter}
                  zoom={zoom}
                  doubleClickZoom={false}
                  touchZoom={false}
                  minZoom={initialZoom}
                  maxZoom={11}
                  onClick={() => {
                    setSelectedCity(null);
                    setSelectedCulture(null);
                    setSelectedSeeAndDo(null);
                  }}
                >
                  {/* Map content */}
                  <SetScrollWheelZoom />
                  <ResetButton center={initialCenter} zoom={initialZoom} />
                  <GeoJSON
                    data={cebuCity.features}
                    onEachFeature={onEachCity}
                    style={getCityStyle}
                  />

                  {/* "Where to Stay" */}
                  {selectedCategory === "Where to stay" &&
                    filteredLocations.map((property, index) => {
                      // Parsing the coordinates (latitude and longitude)
                      const lat = parseFloat(property.coordinates[0]);
                      const lng = parseFloat(property.coordinates[1]);

                      // Check if both latitude and longitude are valid numbers
                      if (!isNaN(lat) && !isNaN(lng)) {
                        return (
                          <Marker
                            key={index}
                            position={[lat, lng]}
                            title={property.property_name}
                            icon={customIcon("/resort.png")}
                            eventHandlers={{
                              click: (e) => handleMarkerClick(property, e),
                            }}
                          >
                            <Popup>{property.property_name}</Popup>
                          </Marker>
                        );
                      } else {
                        // If coordinates are invalid, return null (don't render marker)
                        return null;
                      }
                    })}

                  {/* "Culture & Experiences" */}
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

                  {/* "See and Do" */}
                  {selectedCategory === "See And Do" &&
                    SeeAndDo.filter(
                      (spot) =>
                        !selectedCity || spot["city name"] === selectedCity
                    ).map((spot, index) => {
                      const lat = parseFloat(spot.coordinates[0]);
                      const lng = parseFloat(spot.coordinates[1]);

                      if (!isNaN(lat) && !isNaN(lng)) {
                        return (
                          <Marker
                            key={index}
                            position={[lat, lng]}
                            title={spot.name}
                            icon={customIcon(spot.iconUrl)}
                            eventHandlers={{
                              click: (e) => handleMarkerClick(spot, e),
                            }}
                          >
                            <Popup>{spot.name}</Popup>
                          </Marker>
                        );
                      } else {
                        return null;
                      }
                    })}

                  {/* User Location */}
                  {userLocation && (
                    <Marker
                      position={userLocation}
                      icon={customIcon("/userPin.png")}
                    >
                      <Popup>You are here</Popup>
                    </Marker>
                  )}

                  {/* Nearby Locations */}
                  {userLocation &&
                    nearbyLocations.map((location, index) => (
                      <Marker
                        key={index}
                        position={location.coordinates}
                        icon={
                          location.category === "Property"
                            ? L.icon({ iconUrl: "/resort.png" })
                            : customIcon(location.iconUrl)
                        }
                      >
                        <Popup>{location.name}</Popup>
                      </Marker>
                    ))}

                  {renderPolylines()}
                </MapContainer>
              ) : (
                <p>Loading map data...</p>
              )}
            </div>

            <div style={{ width: "40%", margin: "5px 10px 5px 0px" }}>
              {/* "Where to Stay" Card */}
              {selectedProperty && selectedCategory === "Where to stay" && (
                <>
                  {isSmallScreen ? (
                    <Dialog
                      open={Boolean(selectedProperty)}
                      onClose={() => setSelectedProperty(null)}
                      maxWidth="md"
                      fullWidth
                    >
                      <StayCard
                        stay={selectedProperty}
                        onClose={() => {
                          setSelectedProperty(null);
                          setShowWelcomeMap(true);
                        }}
                      />
                    </Dialog>
                  ) : (
                    <ClickOutsideComponent
                      onClickOutside={handleClickOutsideClose}
                    >
                      <div>
                        <StayCard
                          stay={selectedProperty}
                          onClose={() => {
                            setSelectedProperty(null);
                            setShowWelcomeMap(true);
                          }}
                        />
                      </div>
                    </ClickOutsideComponent>
                  )}
                </>
              )}

              {/* "See and Do" Card */}
              {selectedSeeAndDo && selectedCategory === "See And Do" && (
                <>
                  {isSmallScreen ? (
                    <Dialog
                      open={Boolean(selectedSeeAndDo)}
                      onClose={() => setSelectedSeeAndDo(null)}
                      maxWidth="md"
                      fullWidth
                    >
                      <SeeAndDoCard
                        spot={selectedSeeAndDo}
                        allProperties={allProperties}
                        onClose={() => {
                          setSelectedSeeAndDo(null);
                          setShowWelcomeMap(true);
                        }}
                      />
                    </Dialog>
                  ) : (
                    <ClickOutsideComponent
                      onClickOutside={handleClickOutsideClose}
                    >
                      <div>
                        <SeeAndDoCard
                          spot={selectedSeeAndDo}
                          allProperties={allProperties}
                          onClose={() => {
                            setSelectedSeeAndDo(null);
                            setShowWelcomeMap(true);
                          }}
                        />
                      </div>
                    </ClickOutsideComponent>
                  )}
                </>
              )}

              {/* "Culture & Experiences" Card */}
              {selectedCulture &&
                selectedCategory === "Culture & Experiences" && (
                  <>
                    {isSmallScreen ? (
                      <Dialog
                        open={Boolean(selectedCulture)}
                        onClose={() => setSelectedCulture(null)}
                        maxWidth="md"
                        fullWidth
                      >
                        <CultureCard
                          culture={selectedCulture}
                          allProperties={allProperties}
                          onClose={() => {
                            setSelectedCulture(null);
                            setShowWelcomeMap(true);
                          }}
                        />
                      </Dialog>
                    ) : (
                      <ClickOutsideComponent
                        onClickOutside={handleClickOutsideClose}
                      >
                        <div className="culture-card-container">
                          <CultureCard
                            culture={selectedCulture}
                            allProperties={allProperties}
                            onClose={() => {
                              setSelectedCulture(null);
                              setShowWelcomeMap(true);
                            }}
                          />
                        </div>
                      </ClickOutsideComponent>
                    )}
                  </>
                )}
              <div style={{ width: "100%" }}>
                {isSmallScreen ? (
                  <Dialog
                    open={showWelcomeMapModal}
                    onClose={handleCloseWelcomeMap}
                    maxWidth="sm"
                    fullWidth
                    PaperProps={{
                      style: { position: "relative" }, // Add padding for better appearance
                    }}
                  >
                    {/* Modal Content */}
                    <div style={{ position: "relative" }}>
                      {/* Close Button */}
                      <button
                        onClick={handleCloseWelcomeMap}
                        style={{
                          position: "absolute",
                          top: "10px",
                          right: "10px",
                          background: "none",
                          border: "none",
                          fontSize: "20px",
                          cursor: "pointer",
                          color: "#555",
                        }}
                        aria-label="Close"
                      >
                        &times;
                      </button>

                      {/* Map Component */}
                      <WelcomeCebuMap />
                    </div>
                  </Dialog>
                ) : (
                  showWelcomeMap && (
                    <div className="welcome-map-container">
                      <WelcomeCebuMap />
                    </div>
                  )
                )}
              </div>
            </div>
          </div>
        </Box>
      </div>
    </div>
  );
}
