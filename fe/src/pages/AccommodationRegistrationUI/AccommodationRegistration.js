import React, { useState, useCallback } from "react";
import { Container, Stepper, Step, StepLabel, StepButton, Button } from "@mui/material";
import AnimatePage from "./components/AnimatedPage";
import PropertyType from "./components/PropertyType";
import PropertyType2 from "./components/PropertyType2";
import HeaderUser from "../../components/Header/HeaderUser";
import PropertyInformation from "./components/PropertyInformation";
import RoomDetails from "./components/RoomDetails";
import BedroomDetails2 from "./components/BedRoomDetails";
import UploadPhotos from "./components/UploadPhotos";
import AddressForm from "../../components/Form/AccommodationPropertyLocation";
import AmmentiesServiciesFacilities from "./components/AmmenitiesServiciesFacilities";
import HouseRules from "./components/HouseRules";
import Policies from "./components/BookingPolicies";
import UnitPricing from "./components/PropertyPricing";
import PaymentMethods from "./components/PaymentMethods";
import PartnerVerification from "../../components/registration_unit/registration_partner/partnerVerification";
import ConfirmationModal from "./components/ConfirmationModal";
import AccommodationPropertyInformation from "./components/AmmenitiesServiciesFacilities";
import AmmenitiesServicesFacilities from "./components/AmmenitiesServiciesFacilities";
import AmenitiesServicesFacilities from "./components/AmmenitiesServiciesFacilities";
import Amenities from "./components/AmmenitiesServiciesFacilities";

export default function AccommodationRegistration() {
  const [selectedPropertyType, setSelectedPropertyType] = useState("");
  const [selectedPropertyType2, setSelectedPropertyType2] = useState("");
  const [propertyInfo, setPropertyInfo] = useState({});
  const [unitDetailsData, setUnitDetailsData] = useState({
    roomDetails: [
      { roomType: "Bedroom", quantity: 0 },
      { roomType: "Bathroom", quantity: 0 },
      { roomType: "Living Room", quantity: 0 },
      { roomType: "Kitchen", quantity: 0 },
    ],
    guestCapacity: "",
  });
  const [bedroomDetails, setBedroomDetailsData] = useState({});
  const [totalQTY, setTotalQTY] = useState(0);
  const [selectedImages, setSelectedImages] = useState([]);
  const [selectedAmenities, setSelectedAmenities] = useState({
    basicAmenities: [],
    basicServices: [],
    facilities: [],
  });
  const [houseRulesData, setHouseRulesData] = useState({});
  const [policiesData, setPoliciesData] = useState({});
  const [unitPricing, setUnitPricing] = useState({});
  const [paymentData, setPaymentData] = useState({});
  const [hostData, setHostData] = useState({});
// Track the current step
  const [step, setStep] = useState(0); 
  const [isModalOpen, setIsModalOpen] = useState(false); // State to control modal open/close

  // Functions to handle child data changes
  const handleSelectedTypeChange = (type) => {
    setSelectedPropertyType(type);
  };

  const handleSelectedPropertyTypeChange = useCallback((propertyType) => {
    setSelectedPropertyType2(propertyType);
    console.log("Selected Property Type:", propertyType);
  }, []);

  const handlePropertyInformationChange = (propertyData) => {
    setPropertyInfo(propertyData);
  };

  const handleRoomDetailsChange = (newRoomDetails) => {
    setUnitDetailsData(newRoomDetails);
    setTotalQTY(newRoomDetails.guestCapacity);
  };

  const handleBedRoomDetailsChange = (newRoomDetails) => {
    setBedroomDetailsData(newRoomDetails);
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

  const handleHouseRulesDataChange = (newHouseRulesData) => {
    setHouseRulesData(newHouseRulesData);
  };

  const handlePoliciesDataChange = (newPoliciesData) => {
    setPoliciesData(newPoliciesData);
  };
  const handleUnitPricing = (pricingData) => {
    setUnitPricing(pricingData);
  };
  
  const handlePaymentDataChange = (data) => {
    // Update the paymentData state with the new data
    setPaymentData(data);
  };
  const handleHostDataChange = (data) => {
    setHostData(data);
  };

  //Functions for the next and back buttons

  const handleNext = () => {
    setStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setStep((prevStep) => prevStep - 1);
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };


  const handleSubmit = () => {
    let missingFields = [];
  
    console.log("selectedPropertyType:", selectedPropertyType);
    if (!selectedPropertyType) missingFields.push("Property Type");
  
    console.log("selectedPropertyType2:", selectedPropertyType2);
    if (!selectedPropertyType2) missingFields.push("Unit Type");
  
    console.log("propertyInfo:", propertyInfo);
    if (!propertyInfo || Object.keys(propertyInfo).length === 0) missingFields.push("Basic Info");
  
    console.log("unitDetailsData.roomDetails:", unitDetailsData.roomDetails);
    if (!unitDetailsData || unitDetailsData.roomDetails.every((detail) => detail.quantity === 0)) missingFields.push("Rooms");
  
    console.log("unitDetailsData.guestCapacity:", unitDetailsData.guestCapacity);
    if (!unitDetailsData?.guestCapacity) missingFields.push("Guest Capacity");
  
    console.log("bedroomDetails:", bedroomDetails);
    if (!bedroomDetails || Object.keys(bedroomDetails).length === 0) missingFields.push("Beds");
  
    console.log("selectedImages:", selectedImages);
    if (!selectedImages || selectedImages.length === 0) missingFields.push("Photos");
  
    console.log("selectedAmenities:", selectedAmenities);
    if (!selectedAmenities || Object.keys(selectedAmenities).every((key) => !selectedAmenities[key]?.length)) missingFields.push("Facilities");
  
    console.log("houseRulesData:", houseRulesData);
    if (!houseRulesData || Object.keys(houseRulesData).length === 0) missingFields.push("Rules");
  
    console.log("policiesData:", policiesData);
    if (!policiesData || Object.keys(policiesData).length === 0) missingFields.push("Policies");
  
    console.log("unitPricing:", unitPricing);
    if (!unitPricing || Object.keys(unitPricing).length === 0) missingFields.push("Pricing");
  
    console.log("paymentData:", paymentData);
    if (!paymentData || Object.keys(paymentData).length === 0) missingFields.push("Payment");
  
    console.log("hostData:", hostData);
    if (!hostData || Object.keys(hostData).length === 0) missingFields.push("Partnership");
  
    if (missingFields.length > 0) {
      alert(`Please fill out the following fields before submitting:\n- ${missingFields.join('\n- ')}`);
    } else {
      alert("Form submitted successfully!");
      // Add further logic for final submission here
      // e.g., sending data to an API endpoint
    }
    setIsModalOpen(false); // Close modal
  };
  
  
  
  
  return (
    <div className="accommodation-registration-page">
      <HeaderUser className="sticky-header" />
      <div className="centered-container">
        <Container maxWidth="lg">
          <Stepper activeStep={step} alternativeLabel>
            <Step>
              <StepButton onClick={() => setStep(0)}>
                <StepLabel>Property </StepLabel>
              </StepButton>
            </Step>
            <Step>
              <StepButton onClick={() => setStep(1)}>
                <StepLabel>Unit Type </StepLabel>
              </StepButton>
            </Step>
            <Step>
              <StepButton onClick={() => setStep(2)}>
                <StepLabel>Basic Info</StepLabel>
              </StepButton>
            </Step>
            <Step>
              <StepButton onClick={() => setStep(3)}>
                <StepLabel> Rooms</StepLabel>
              </StepButton>
            </Step>
            <Step>
              <StepButton onClick={() => setStep(4)}>
                <StepLabel>Beds</StepLabel>
              </StepButton>
            </Step>
            <Step>
              <StepButton onClick={() => setStep(5)}>
                <StepLabel> Photos</StepLabel>
              </StepButton>
            </Step>
            <Step>
              <StepButton onClick={() => setStep(6)}>
                <StepLabel>Location</StepLabel>
              </StepButton>
            </Step>
            <Step>
              <StepButton onClick={() => setStep(7)}>
                <StepLabel>Facilities</StepLabel>
              </StepButton>
            </Step>
            <Step>
              <StepButton onClick={() => setStep(8)}>
                <StepLabel>Rules</StepLabel>
              </StepButton>
            </Step>
            <Step>
              <StepButton onClick={() => setStep(9)}>
                <StepLabel>Policies</StepLabel>
              </StepButton>
            </Step>
            <Step>
              <StepButton onClick={() => setStep(10)}>
                <StepLabel>Pricing</StepLabel>
              </StepButton>
            </Step>
            <Step>
              <StepButton onClick={() => setStep(11)}>
                <StepLabel>Payment</StepLabel>
              </StepButton>
            </Step>
            <Step>
              <StepButton onClick={() => setStep(12)}>
                <StepLabel>Partnership</StepLabel>
              </StepButton>
            </Step>
          </Stepper>

          {step === 0 && (
            
              <PropertyType
                onSelectedTypeChange={handleSelectedTypeChange}
                parentSelectedData={selectedPropertyType}
                handleNext={handleNext}
              />
          
          )}

          {step === 1 && (
            // <AnimatePage>
              <PropertyType2
                onSelectedPropertyTypeChange={handleSelectedPropertyTypeChange}
                parentSelectedPropertyType={selectedPropertyType2}
                handleNext={handleNext}
                handleBack={handleBack}
              />
            // </AnimatePage>
          )}

          {step === 2 && (
            
              <PropertyInformation
                onPropertyInformationChange={handlePropertyInformationChange}
                parentPropertyInfo={propertyInfo}
                handleNext={handleNext}
                handleBack={handleBack}
              />
          
          )}

          {step === 3 && (
            
              <RoomDetails
                onRoomDetailsChange={handleRoomDetailsChange}
                parentUnitDetailsData={unitDetailsData}
                handleNext={handleNext}
                handleBack={handleBack}
              />
            
          )}

          {step === 4 && (
            
              <BedroomDetails2
                onBedroomDetailsChange={handleBedRoomDetailsChange}
                parentBedroomDetails={bedroomDetails}
                parentTotalQTY={totalQTY}
                handleNext={handleNext}
                handleBack={handleBack}
              />
          
          )}

          {step === 5 && (
              <UploadPhotos
                onImagesChange={handleImagesChange}
                parentImages={selectedImages}
                handleNext={handleNext}
                handleBack={handleBack}
              />
          )}

          {step === 6 && (

              // {/* The logic behind this is nag gamit ug useContext, using the address and mapval defined above */}
              <AddressForm
                handleNext={handleNext}
                handleBack={handleBack}
              />

          )}
          {step === 7 && (
            <AmmenitiesServicesFacilities
              onAmenitiesChange={handleAmenitiesChange}
              parentAmenities={selectedAmenities}
              handleNext={handleNext}
              handleBack={handleBack}
            />
          )}


          {step === 8 && (
                <HouseRules
                  onHouseRulesDataChange={handleHouseRulesDataChange}
                  parentHouseRules={houseRulesData}
                  handleNext={handleNext}
                handleBack={handleBack}
                />

          )}

          {step === 9 && (

                <Policies 
                  onPoliciesDataChange={handlePoliciesDataChange}
                  parentPolicies={policiesData}
                  handleNext={handleNext}
                  handleBack={handleBack}
                />
          )}
           {step === 10 && (
             <UnitPricing
                 handleUnitPricing={handleUnitPricing}
                parentUnitPricing={unitPricing}
                handleNext={handleNext}
                handleBack={handleBack}
              />
            )}
             {step === 11 && (

               <PaymentMethods onPaymentDataChange={handlePaymentDataChange}
                  parentPaymentData={paymentData}
                  handleNext={handleNext}
                  handleBack={handleBack}
                />
              )}
              {step === 12 && (

                <PartnerVerification 
                  onHostDataChange={handleHostDataChange}
                  parentPartnerData={hostData}
                  handleSubmit={openModal}
                  handleBack={handleBack}
                  />

                )} 

              {/* Modal for confirmation */}
            <ConfirmationModal
              isOpen={isModalOpen}
              onClose={closeModal}
              onConfirm={handleSubmit}
            />
            </Container>
      </div>
    </div>
  );
}
