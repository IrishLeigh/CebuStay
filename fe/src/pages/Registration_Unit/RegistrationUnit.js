import React, { useState, useEffect } from 'react';
import { Container, Hidden } from '@mui/material';
import axios from 'axios';
import UnitInfo_2 from '../../components/registration_unit/registration_unitDetails/unitDetails_2';
import BedroomDetails from '../../components/registration_unit/registration_bedRoomDetails/bedroomDetails';
import SimplePaper from '../../components/registration_unit/registration_personalInformation/home_form';
import HouseRules from '../../components/registration_unit/registration_houseRules/houseRules';
import AccommodationPropertyType from '../../components/Button/AccommodationPropertyType';
import Properties from '../../components/Button/Properties';
import PropertyType from '../../components/Button/AccommodationRegistration2';
import AddressForm from '../../components/Form/AccommodationPropertyLocation';
import AccommodationUploadPhotos from '../../components/Form/AccommodationUploadPhotos';
import Policies from '../../components/registration_unit/registration_bookingPolicies/bookingPolicies';
import AccommodationPropertyInformation from '../../components/Button/AccommodationPropertyInformation';
import UnitPricing from '../../components/registration_unit/registration_pricing/pricing';
import { useData } from '../../components/registration_unit/registration_location/contextAddressData';
import './Registration.css'; // Import CSS file
import AnimatePage from './AnimatedPage';
import PaymentMethods from '../../components/registration_unit/registration_pMethods/PaymentMethods';
import PartnerVerification from '../../components/registration_unit/registration_partner/partnerVerification';

export default function RegistrationUnit() {
  const [step, setStep] = useState(1);
  const finalStep = 13; // Define the total number of steps
  

  // State variables for form data
  const { addressData, mapVal } = useData();
  const [selectedType, setSelectedType] = useState('');
  const [selectedPropertyType, setSelectedPropertyType] = useState('');
  const [propertyInfo, setPropertyInfo] = useState({});
  const [unitDetailsData, setUnitDetailsData] = useState({});
  const [bedroomDetails, setBedroomDetailsData] = useState({});
  const [houseRulesData, setHouseRulesData] = useState({});
  const [policiesData, setPoliciesData] = useState({});
  const [selectedImages, setSelectedImages] = useState([]);
  const [locationDetails, setLocationDetails] = useState({});
  const [selectedAmenities, setSelectedAmenities] = useState({
    basicAmenities: [],
    basicServices: [],
    facilities: [],
  });
  // New added
  const [unitPricing, setUnitPricing] = useState({});
  const [hostData, setHostData] = useState({});


  // Functions to handle step navigation
  const nextStep = () => {
    setStep(step + 1);
  };

  const prevStep = () => {
    setStep(step - 1);
  };

  // Function to handle form submission
  const handleSubmit = async () => {
    try {
      // Perform Axios request to send form data to the server
      const response = await axios.post('your-api-endpoint', {
        selectedType,
        selectedPropertyType,
        propertyInfo,
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

  // Callback functions to handle form data changes
  const handleSelectedTypeChange = (type) => {
    setSelectedType(type);
  };

  const handleSelectedPropertyTypeChange = (propertyType) => {
    setSelectedPropertyType(propertyType);
  };
  const handlePropertyInformationChange = (newPropertyData) => {
    setPropertyInfo(newPropertyData);
  };
  

  const handleRoomDetailsChange = (newRoomDetails) => {
    setUnitDetailsData(newRoomDetails);
  };

  const handleBedRoomDetailsChange = (newRoomDetails) => {
    setBedroomDetailsData(newRoomDetails);
  };

  const handleHouseRulesDataChange = (newHouseRulesData) => {
    setHouseRulesData(newHouseRulesData);
  };

  const handleImagesChange = (images) => {
    setSelectedImages(images);
  };

  const handleAmenitiesChange = (category, amenities) => {
    setSelectedAmenities((prevSelectedAmenities) => ({
      ...prevSelectedAmenities,
      [category]: amenities,
    }));
  };

  const handlePoliciesDataChange = (newPoliciesData) => {
    setPoliciesData(newPoliciesData);
  };

  // useEffect to update locationDetails whenever addressData or mapVal changes
  useEffect(() => {
    setLocationDetails({ addressData, mapVal });
  }, [addressData, mapVal]);

  // Callback function to handle unit pricing data
  const handleUnitPricing = (pricingData) => {
    setUnitPricing(pricingData);
  };
  
  // Callback function to handle host data from PartnerVerification
  const handleHostDataChange = (data) => {
    setHostData(data);
  };

console.log("Host Data",hostData);
  return (
    <Container maxWidth="xl" sx={{ overflowX: 'hidden' }}  >
      {step === 1 && (
        <div>
          <AnimatePage>
            <Properties onSelectedTypeChange={handleSelectedTypeChange} />    
          </AnimatePage>
          <div className="stepperFooter" style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button className="stepperNext" onClick={nextStep}>Next</button>
          </div>
        </div>
      )}
      {step === 2 && (
        <div>
          <AnimatePage>
            <PropertyType onSelectedPropertyTypeChange={handleSelectedPropertyTypeChange} />
            </AnimatePage>
          <div className="stepperFooter" style={{ display: 'flex', justifyContent: 'space-between' }}>
            <button className="stepperPrevious" onClick={prevStep}>Previous</button>
            <button className="stepperNext" onClick={nextStep}>Next</button>
          </div>
        </div>
      )}
      {step === 3 && (
         <div>
          <AnimatePage>
            <SimplePaper onPropertyInformationChange={handlePropertyInformationChange} />
          </AnimatePage>
          <div className="stepperFooter" style={{ display: 'flex', justifyContent: 'space-between' }}>
            <button className="stepperPrevious" onClick={prevStep}>Previous</button>
            <button className="stepperNext" onClick={nextStep}>Next</button>
          </div>
        </div>
      )}
      {step === 4 && (
         <div>
          <AnimatePage>
            <UnitInfo_2 onRoomDetailsChange={handleRoomDetailsChange} />    
          </AnimatePage>
          <div className="stepperFooter" style={{ display: 'flex', justifyContent: 'space-between' }}>
            <button className="stepperPrevious" onClick={prevStep}>Previous</button>
            <button className="stepperNext" onClick={nextStep}>Next</button>
          </div>
        </div>
      )}
      {step === 5 && (
         <div>
          <AnimatePage>
            <BedroomDetails onBedroomDetailsChange={handleBedRoomDetailsChange} />
          </AnimatePage>
          
          <div className="stepperFooter" style={{ display: 'flex', justifyContent: 'space-between' }}>
            <button className="stepperPrevious" onClick={prevStep}>Previous</button>
            <button className="stepperNext" onClick={nextStep}>Next</button>
          </div>
        </div>
      )}
      {step === 6 && (
        <div>
          <AnimatePage>
            <AccommodationUploadPhotos onImagesChange={handleImagesChange} />
          </AnimatePage>
          
          <div className="stepperFooter" style={{ display: 'flex', justifyContent: 'space-between' }}>
            <button className="stepperPrevious" onClick={prevStep}>Previous</button>
            <button className="stepperNext" onClick={nextStep}>Next</button>
          </div>
        </div>
      )}
      {step === 7 && (
         <div>
          <AnimatePage>
            <AddressForm />
          </AnimatePage>
          
          <div className="stepperFooter" style={{ display: 'flex', justifyContent: 'space-between' }}>
            <button className="stepperPrevious" onClick={prevStep}>Previous</button>
            <button className="stepperNext" onClick={nextStep}>Next</button>
          </div>
        </div>
      )}
      {step === 8 && (
         <div className="animationContainer">
          <AccommodationPropertyInformation onAmenitiesChange={handleAmenitiesChange} />
          <div className="stepperFooter" style={{ display: 'flex', justifyContent: 'space-between' }}>
            <button className="stepperPrevious" onClick={prevStep}>Previous</button>
            <button className="stepperNext" onClick={nextStep}>Next</button>
          </div>
        </div>
      )}
      {step === 9 && (
         <div className="animationContainer">
          <HouseRules onHouseRulesDataChange={handleHouseRulesDataChange} />
          <div className="stepperFooter" style={{ display: 'flex', justifyContent: 'space-between' }}>
            <button className="stepperPrevious" onClick={prevStep}>Previous</button>
            <button className="stepperNext" onClick={nextStep}>Next</button>
          </div>
        </div>
      )}
      {step === 10 && (
        <div>
          <Policies onPoliciesDataChange={handlePoliciesDataChange} />
          <div className="stepperFooter" style={{ display: 'flex', justifyContent: 'space-between' }}>
            <button className="stepperPrevious" onClick={prevStep}>Previous</button>
            <button className="stepperNext" onClick={nextStep}>Next</button>
            
          </div>
        </div>
      )}
      {step === 11 && (
        <div>
            <UnitPricing handleUnitPricing={handleUnitPricing} />
          <div className="stepperFooter" style={{ display: 'flex', justifyContent: 'space-between' }}>
            <button className="stepperPrevious" onClick={prevStep}>Previous</button>
            <button className="stepperNext" onClick={nextStep}>Next</button>
          </div>
        </div>
      )}
      {step === 12 && (
        <div>
          <AnimatePage>
            <PaymentMethods />
          </AnimatePage>
            
          <div className="stepperFooter" style={{ display: 'flex', justifyContent: 'space-between' }}>
            <button className="stepperPrevious" onClick={prevStep}>Previous</button>
            <button className="stepperNext" onClick={nextStep}>Next</button>
          </div>
        </div>
      )}
      {step === 13 && (
        <div>
          <AnimatePage>
            <PartnerVerification onHostDataChange={handleHostDataChange} />
          </AnimatePage>
            
          <div className="stepperFooter" style={{ display: 'flex', justifyContent: 'space-between' }}>
            <button className="stepperPrevious" onClick={prevStep}>Previous</button>
            <button className="stepperNext" onClick={handleSubmit}>Submit</button>
          </div>
        </div>
      )}
    </Container>
  );
}
