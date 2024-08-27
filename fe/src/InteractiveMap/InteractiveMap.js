import React, { useState, useEffect, useRef } from "react";
import { MapContainer, GeoJSON, Marker, Popup, useMap } from "react-leaflet";
import * as turf from "@turf/turf";
import axios from "axios";
import cebuCity from "./data/Cebu.MuniCities.json";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import "./InteractiveMap.css";
import Liloan from "./Liloan";
import CarCar from "./Carcar";
import BadianKawasanFalls from "./BadianKawasanFalls";

export default function InteractiveMap() {
  const [selectedCity, setSelectedCity] = useState(null);
  const [foundLocations, setFoundLocations] = useState([]);
  const [showCard, setShowCard] = useState(null); // Use `null` or an identifier
  const [locations, setLocations] = useState([]);
  const [filter, setFilter] = useState(null);
  const initialCenter = [10.5, 124];
  const initialZoom = 9;
  const [zoom, setZoom] = useState(9);

  const mapContainerRef = useRef(null);

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

    // Call handleResize once to set the initial zoom
    handleResize();

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        mapContainerRef.current &&
        !mapContainerRef.current.contains(event.target)
      ) {
        setShowCard(null);
      }
    };

    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  const handleMarkerClick = (cardName) => {
    setShowCard((prevCard) => (prevCard === cardName ? null : cardName));
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
      click: () => {
        const found = [];
        console.log("City Name:", cityName);
        if (!locations.length) {
          console.log("Locations not loaded yet.");
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
            if (city.geometry.type === "Polygon") {
              const cityPolygon = turf.polygon(city.geometry.coordinates);
              isInPolygon = turf.booleanPointInPolygon(point, cityPolygon);
            } else if (city.geometry.type === "MultiPolygon") {
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
      },
    });
  };

  const customIcon = L.icon({
    iconUrl: "./resort.png",
    iconSize: [41, 41],
    iconAnchor: [12, 41],
    popupAnchor: [0, -41],
  });

  const rosquillosIcon = L.icon({
    iconUrl: "./rosquillos.png",
    iconSize: [41, 41],
    iconAnchor: [20.5, 41],
    popupAnchor: [0, -41],
  });

  const lechonIcon = L.icon({
    iconUrl: "./lechon.png",
    iconSize: [41, 41],
    iconAnchor: [20.5, 41],
    popupAnchor: [0, -41],
  });

  const kawasanIcon = L.icon({
    iconUrl: "./kawasanfalls.png",
    iconSize: [41, 41],
    iconAnchor: [20.5, 41],
    popupAnchor: [0, -41],
  });

  const liloanCoordinates = [10.3988, 123.9996];
  const carcarCoordinates = [10.115111, 123.639954];
  const badianCoordinates = [9.8321, 123.4159];

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
          <button
            className="map-filter-btn"
            style={{ backgroundColor: "#16B4DD" }}
            onClick={() => setFilter("stay")}
          >
            Where to stay?
          </button>
          <button
            className="map-filter-btn"
            style={{ backgroundColor: "#ADC939" }}
            onClick={() => setFilter("culture")}
          >
            Culture & Experiences
          </button>
          <button
            className="map-filter-btn"
            style={{ backgroundColor: "#F9CC41" }}
            onClick={() => setFilter("seeAndDo")}
          >
            See And Do
          </button>
          <button
            className="map-filter-btn"
            style={{ backgroundColor: "#F77D1E" }}
            onClick={() => setFilter("hiddenJewels")}
          >
            Hidden Jewels
          </button>
          <button
            className="map-filter-btn"
            style={{ backgroundColor: "#EE414B" }}
            onClick={() => setFilter("events")}
          >
            Events and Festivals
          </button>
          <button
            className="map-filter-btn"
            style={{ backgroundColor: "#A334CF" }}
            onClick={() => setFilter("cebuInfo")}
          >
            What's in Cebu?
          </button>
        </div>
        <div className="map-container" ref={mapContainerRef}>
          {locations.length > 0 ? (
            <MapContainer
              className="map"
              center={[10.5, 124]}
              zoom={zoom}
              scrollWheelZoom={false}
              dragging={false}
              minZoom={9}
              maxZoom={11}
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
              {filter === "culture" && (
                <>
                  <Marker
                    position={liloanCoordinates}
                    title="Liloan - Home of Rosquillos"
                    icon={rosquillosIcon}
                    eventHandlers={{
                      click: () => handleMarkerClick("rosquillos"),
                    }}
                  />
                  <Marker
                    position={carcarCoordinates}
                    title="Carcar City - Lechon"
                    icon={lechonIcon}
                    eventHandlers={{
                      click: () => handleMarkerClick("carcar"),
                    }}
                  >
                    {/* <Popup>Carcar City - Known for its delicious Lechon</Popup> */}
                  </Marker>
                  <Marker
                    position={badianCoordinates}
                    title="Badian - Kawasan Falls"
                    icon={kawasanIcon}
                    eventHandlers={{
                      click: () => handleMarkerClick("kawasan"),
                    }}
                  >
                    {/* <Popup>Badian - Home of Kawasan Falls</Popup> */}
                  </Marker>
                </>
              )}
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
          {showCard === "rosquillos" && (
            <div className="event-card">
              <Liloan />
            </div>
          )}
          {showCard === "carcar" && (
            <div className="carcar-card">
              <CarCar />
            </div>
          )}
          {showCard === "kawasan" && (
            <div className="kawasan-card">
              <BadianKawasanFalls />
            </div>
          )}
        </div>
      </div>
    </>
  );
}
