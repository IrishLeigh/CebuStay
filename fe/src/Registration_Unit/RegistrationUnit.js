import React, { useState, useEffect } from 'react';
import axios from 'axios'; // Import Axios library
import UnitInfo_2 from '../components/registration_unit/registration_unitDetails/unitDetails_2';
import BedroomDetails from '../components/registration_unit/registration_bedRoomDetails/bedroomDetails';
import SimplePaper from '../components/registration_unit/registration_personalInformation/home_form';
import HouseRules from '../components/registration_unit/registration_houseRules/houseRules';
import AccommodationPropertyType from '../components/Button/AccommodationPropertyType';
import Properties from '../components/Button/Properties';
import PropertyType from '../components/Button/AccommodationRegistration2';
import AddressForm from '../components/Form/AccommodationPropertyLocation';
import AccommodationUploadPhotos from '../components/Form/AccommodationUploadPhotos';
import Policies from '../components/registration_unit/registration_bookingPolicies/bookingPolicies';
import AccommodationPropertyInformation from '../components/Button/AccommodationPropertyInformation';
import { useData } from '../components/registration_unit/registration_location/contextAddressData';

export default function RegistrationUnit() {
  // State for form data
  // Use DataContext
  const { addressData, mapVal } = useData();
  const [selectedType, setSelectedType] = useState('');
  const [selectedPropertyType, setSelectedPropertyType] = useState('');
  const [propertyData, setPropertyData] = useState({});
  const [unitDetailsData, setUnitDetailsData] = useState({});
  const [bedroomDetails,setBedroomDetailsData] = useState({});
  const [houseRulesData, setHouseRulesData] = useState({});
  const [policiesData, setPoliciesData] = useState({});
  const [selectedImages, setSelectedImages] = useState([]);
  const [locationDetails, setLocationDetails] =useState({});
  const [selectedAmenities, setSelectedAmenities] = useState({
    basicAmenities: [],
    basicServices: [],
    facilities: [],
  });

  // Update locationDetails whenever addressData or mapVal changes
  useEffect(() => {
    setLocationDetails({ addressData, mapVal });
  }, [addressData, mapVal]);

  // Callback function to handle selected type change
  const handleSelectedTypeChange = (type) => {
    setSelectedType(type);
  };

  // Callback function to handle selected property type change
  const handleSelectedPropertyTypeChange = (propertyType) => {
    setSelectedPropertyType(propertyType);
  };

  // Callback function to handle room details change
  const handleRoomDetailsChange = (newRoomDetails) => {
    setUnitDetailsData(newRoomDetails);
  };

  // Callback function to handle bedroom details change
  const handleBedRoomDetailsChange = (newRoomDetails) => {
    setBedroomDetailsData(newRoomDetails);
  };

  // Callback function to handle house rules data change
  const handleHouseRulesDataChange = (newHouseRulesData) => {
    setHouseRulesData(newHouseRulesData);
  };

  // Callback function to handle selected images change
  const handleImagesChange = (images) => {
    setSelectedImages(images);
  };

  // Callback function to handle selected amenities change
  const handleAmenitiesChange = (category, amenities) => {
    setSelectedAmenities((prevSelectedAmenities) => ({
      ...prevSelectedAmenities,
      [category]: amenities,
    }));
  };

  // Callback function to handle policies data change
  const handlePoliciesDataChange = (newPoliciesData) => {
    setPoliciesData(newPoliciesData);
  };

  // Function to handle form submission
  const handleSubmit = async () => {
    try {
      // Perform Axios request to send form data to the server
      const response = await axios.post('your-api-endpoint', {
        selectedType,
        selectedPropertyType,
        propertyData,
        unitDetailsData,
        bedroomDetails,
        houseRulesData,
        policiesData,
        selectedImages,
        locationDetails,
        selectedAmenities,
      });
      console.log('Form submitted successfully:', response.data);
      // Optionally, reset the form data after submission
      // Reset all state variables here if needed
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  return (
    <div>
      {/* Pass the handleSelectedTypeChange function to Properties component */}
      <Properties onSelectedTypeChange={handleSelectedTypeChange} />

      {/* Pass the handleSelectedPropertyTypeChange function to PropertyType component */}
      <PropertyType onSelectedPropertyTypeChange={handleSelectedPropertyTypeChange} />

      <SimplePaper />

      {/* Pass the handleRoomDetailsChange function to UnitInfo_2 component */}
      <UnitInfo_2 
        onRoomDetailsChange={handleRoomDetailsChange} 
      />
      
      {/* Pass the handleRoomDetailsChange function to UnitInfo_2 component */}
      <BedroomDetails 
        onBedroomDetailsChange={handleBedRoomDetailsChange} 
      />

      {/* Pass the handleImagesChange function to AccommodationUploadPhotos component */}
      <AccommodationUploadPhotos onImagesChange={handleImagesChange} />
      <AddressForm/>

      {/* Pass the handleAmenitiesChange function to AccommodationPropertyInformation component */}
      <AccommodationPropertyInformation onAmenitiesChange={handleAmenitiesChange} />

      {/* Pass the handleHouseRulesDataChange function to HouseRules component */}
      <HouseRules onHouseRulesDataChange={handleHouseRulesDataChange} />

      <Policies onPoliciesDataChange={handlePoliciesDataChange} />

      {/* Button to submit the form */}
      <button onClick={handleSubmit}>Submit</button>
    </div>
  );
}
