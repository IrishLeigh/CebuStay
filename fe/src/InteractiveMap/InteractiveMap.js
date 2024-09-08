import React, { useState, useEffect, useRef } from "react";
import { MapContainer, GeoJSON, Marker, Popup, useMap } from "react-leaflet";
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

export default function InteractiveMap() {
  const [selectedCity, setSelectedCity] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [locations, setLocations] = useState([]);
  const [selectedCulture, setSelectedCulture] = useState(null);
  const [selectedSeeAndDo, setSelectedSeeAndDo] = useState(null);
  const mapContainerRef = useRef(null);
  const initialCenter = [10.5, 124];
  const initialZoom = 9;
  const [zoom, setZoom] = useState(9);
  const [foundLocations, setFoundLocations] = useState([]);

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

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

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
      setSelectedCulture(null); // Deselect culture
    } else if (selectedCategory === "Culture & Experiences") {
      setSelectedCulture(spot);
      setSelectedSeeAndDo(null); // Deselect see and do
    }
  };

  function ResetButton({ center, zoom }) {
    const map = useMap();

    const handleReset = () => {
      map.setView(center, zoom);
    };

    return (
      <button
        className="reset-btn"
        onClick={handleReset}
        style={{
          position: "absolute",
          top: "10px",
          right: "10px",
          zIndex: 1000,
        }}
      >
        Reset Map
      </button>
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
      click: (event) => handleCityClick(cityName, event),
    });

    layer.bindTooltip(cityName, {
      permanent: false, // Tooltip appears on hover only
      direction: "auto",
      className: "city-tooltip", // Optional: to apply custom styles
    });
  };

  return (
    <>
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
            style={{ backgroundColor: "#16B4DD" }}
            onClick={() => setSelectedCategory("Where to stay")}
          >
            Where to stay?
          </button>
          <button
            className="map-filter-btn"
            style={{ backgroundColor: "#ADC939" }}
            onClick={() => setSelectedCategory("Culture & Experiences")}
          >
            Culture & Experiences
          </button>
          <button
            className="map-filter-btn"
            style={{ backgroundColor: "#F9CC41" }}
            onClick={() => setSelectedCategory("See And Do")}
          >
            See And Do
          </button>
          <button
            className="map-filter-btn"
            style={{ backgroundColor: "#F77D1E" }}
            onClick={() => setSelectedCategory("Hidden Jewels")}
          >
            Hidden Jewels
          </button>
          <button
            className="map-filter-btn"
            style={{ backgroundColor: "#EE414B" }}
            onClick={() => setSelectedCategory("Events and Festivals")}
          >
            Events and Festivals
          </button>
          <button
            className="map-filter-btn"
            style={{ backgroundColor: "#A334CF" }}
            onClick={() => setSelectedCategory("What's in Cebu")}
          >
            What's in Cebu?
          </button>
        </div>

        <div className="map-container" ref={mapContainerRef}>
          {locations.length > 0 ? (
            <MapContainer
              className="map"
              center={initialCenter}
              zoom={zoom}
              scrollWheelZoom={false}
              // dragging={true}
              zoomControl={false}
              // doubleClickZoom={false}
              touchZoom={false}
              boxZoom={false}
              keyboard={false}
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
                onClose={() => setSelectedCulture(null)}
              />
            </div>
          )}
        </div>
      </div>
    </>
  );
}
