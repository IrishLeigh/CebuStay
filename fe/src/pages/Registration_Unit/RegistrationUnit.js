import React, { useState, useEffect } from "react";
import { Container, Hidden } from "@mui/material";
import axios from "axios";
import UnitInfo_2 from "../../components/registration_unit/registration_unitDetails/unitDetails_2";
import BedroomDetails from "../../components/registration_unit/registration_bedRoomDetails/bedroomDetails";
import SimplePaper from "../../components/registration_unit/registration_personalInformation/home_form";
import HouseRules from "../../components/registration_unit/registration_houseRules/houseRules";
import AccommodationPropertyType from "../../components/Button/AccommodationPropertyType";
import Properties from "../../components/Button/Properties";
import PropertyType from "../../components/Button/AccommodationRegistration2";
import AddressForm from "../../components/Form/AccommodationPropertyLocation";
import AccommodationUploadPhotos from "../../components/Form/AccommodationUploadPhotos";
import Policies from "../../components/registration_unit/registration_bookingPolicies/bookingPolicies";
import AccommodationPropertyInformation from "../../components/Button/AccommodationPropertyInformation";
import UnitPricing from "../../components/registration_unit/registration_pricing/pricing";
import { useData } from "../../components/registration_unit/registration_location/contextAddressData";
import "./Registration.css"; // Import CSS file
import AnimatePage from "./AnimatedPage";
import PaymentMethods from "../../components/registration_unit/registration_pMethods/PaymentMethods";
import PartnerVerification from "../../components/registration_unit/registration_partner/partnerVerification";

export default function RegistrationUnit() {
  const [step, setStep] = useState(1);
  const finalStep = 13; // Define the total number of steps

  // State variables for form data
  const { addressData, mapVal } = useData();
  const [selectedType, setSelectedType] = useState("");
  const [selectedPropertyType, setSelectedPropertyType] = useState("");
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
  const [paymentData, setPaymentData] = useState({});

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
      // const response = await axios.post("your-api-endpoint", {
      //   selectedType,
      //   selectedPropertyType,
      //   propertyData,
      //   unitDetailsData,
      //   bedroomDetails,
      //   houseRulesData,
      //   policiesData,
      //   selectedImages,
      //   locationDetails,
      //   selectedAmenities,
      // });
      // console.log("Form submitted successfully:", response.data);

      const resPropertid = await axios.post(
        "http://127.0.0.1:8000/api/propertyinfo",
        {
          userid: 6,
          property_name: propertyInfo.propertyName,
          property_type: selectedType,
          property_desc: propertyInfo.propertyDescription,
          property_directions: propertyInfo.gettingToProperty,
          unit_type: selectedPropertyType,
          number_unit: propertyInfo.numberOfUnits,
        }
      );
      //BERT ANG PROPERTY ID KAY resPropertid.data.propertyid
      const propertyId = resPropertid.data.propertyid;
      if (resPropertid.data.propertyid) {
        const resUnitid = await axios.post(
          "http://127.0.0.1:8000/api/unitdetails",
          {
            propertyid: resPropertid.data.propertyid,
            guest_capacity: unitDetailsData.guestCapacity,
            roomDetails: unitDetailsData.roomDetails,
          }
        );
        if (resUnitid.data.unitid) {
          const resBedInsert = await axios.post(
            "http://127.0.0.1:8000/api/bedroomtype",
            {
              unitid: resUnitid.data.unitid,
              bedroomDetailsData: bedroomDetails,
            }
          );
          if (resBedInsert.data.status === "success") {
            const formdata = new FormData();
            formdata.append("propertyid", resPropertid.data.propertyid);
            for (let i = 0; i < selectedImages.length; i++) {
              formdata.append("files[]", selectedImages[i]);
            }
            const resImgUpload = await axios.post(
              "http://127.0.0.1:8000/api/uploadfiles",
              formdata,
              {
                headers: {
                  "Content-Type": "multipart/form-data",
                },
              }
            );
            // if (resImgUpload.data.status === "success") {
            if (resPropertid.data.propertyid) {
              //ari padayun bert
              const street = locationDetails.addressData.street;
              const postalCode = locationDetails.addressData.postalCode;
              const pinloc = locationDetails.mapVal;
              console.log("propertyId pinloc:", pinloc);
              const propertyLoc = await axios.post(
                "http://127.0.0.1:8000/api/location",
                {
                  propertyid: resPropertid.data.propertyid,
                  address: street,
                  zipcode: postalCode,
                  latitude: pinloc.lat,
                  longitude: pinloc.lng,
                }
              );
              if (propertyLoc.data.locationid) {
                console.log("Amenities:", selectedAmenities);
                for (const amenity of selectedAmenities["basicAmenities"]) {
                  // Make a POST request for each amenity
                  const resAmenity = await axios.post(
                    "http://127.0.0.1:8000/api/amenities",
                    {
                      propertyid: resPropertid.data.propertyid,
                      amenity_name: amenity,
                    }
                  );
                }
              }
              if (propertyLoc.data.locationid) {
                for (const service of selectedAmenities["basicServices"]) {
                  // Make a POST request for each amenity
                  const resService = await axios.post(
                    "http://127.0.0.1:8000/api/services",
                    {
                      propertyid: resPropertid.data.propertyid,
                      service_name: service,
                    }
                  );
                }
              }

              if (propertyLoc.data.locationid) {
                for (const facilities of selectedAmenities["facilities"]) {
                  // Make a POST request for each amenity
                  const resFacilities = await axios.post(
                    "http://127.0.0.1:8000/api/facilities",
                    {
                      propertyid: resPropertid.data.propertyid,
                      facilities_name: facilities,
                    }
                  );
                }
              }
              if (propertyLoc.data.locationid) {
                const checkInFrom = houseRulesData.checkInFrom;
                const checkInUntil = houseRulesData.checkInUntil;
                const checkOutFrom = houseRulesData.checkOutFrom;
                const checkOutUntil = houseRulesData.checkOutUntil;
                const quietHoursStart = houseRulesData.quietHoursStart;
                const quietHoursEnd = houseRulesData.quietHoursEnd;
                const customRules = houseRulesData.customRules;
                const smokingAllowed = houseRulesData.smokingAllowed;
                const petsAllowed = houseRulesData.petsAllowed;
                const partiesAllowed = houseRulesData.partiesAllowed;
                const noiseRestrictions = houseRulesData.noiseRestrictions;

                console.log("HouseRules", houseRulesData);
                const houseRules = await axios.post(
                  "http://127.0.0.1:8000/api/houseRules",
                  {
                    propertyid: resPropertid.data.propertyid,
                    smoking_allowed: smokingAllowed,
                    pets_allowed: petsAllowed,
                    parties_events_allowed: partiesAllowed,
                    noise_restrictions: noiseRestrictions,
                    quiet_hours_start: quietHoursStart,
                    quiet_hours_end: quietHoursEnd,
                    custom_rules: customRules,
                    check_in_from: checkInFrom,
                    check_in_until: checkInUntil,
                    check_out_from: checkOutFrom,
                    check_out_until: checkOutUntil,
                  }
                );
                console.log("houseRules: ", houseRules);
                if (houseRules.data) {
                  const is_cancel_plan = policiesData.standardCancellation;
                  const cancel_days = policiesData.cancellationDays;
                  const non_refundable = policiesData.nonRefundableRate;
                  const modification_plan = policiesData.modificationPlan;
                  const offer_discount = policiesData.offerDiscounts;
                  const booking_policies = await axios.post(
                    "http://127.0.0.1:8000/api/bookingpolicy",
                    {
                      propertyid: resPropertid.data.propertyid,
                      is_cancel_plan: is_cancel_plan,
                      cancel_days: cancel_days,
                      non_refundable: non_refundable,
                      modification_plan: modification_plan,
                      offer_discount: offer_discount,
                    }
                  );
                  if (booking_policies.data.status === "success") {
                    console.log("booking_policies: ", booking_policies.data);
                    const homeid = resPropertid.data.homeid;
                    const max_price = 0;
                    const min_price = unitPricing.basePrice;
                    const profit = unitPricing.profit;
                    const unit_pricing = await axios.post(
                      "http://127.0.0.1:8000/api/propertypricing",
                      {
                        homeid: homeid,
                        max_price: max_price,
                        min_price: min_price,
                        profit: profit,
                      }
                    );
                    if (unit_pricing.data.status === "success") {
                      console.log("unit_pricing: ", unit_pricing.data);
                      const isonline =
                        paymentData.selectedPayment === "Online" ? true : false;
                      const paymentmethod = paymentData.selectedPayout;
                      const propertyid = resPropertid.data.propertyid;
                      console.log("nara", paymentData);
                      console.log("propertyid", resPropertid.data.propertyid);
                      console.log("isonline", isonline);
                      console.log("paymentmethod", paymentmethod);
                      const paymentres = await axios.post(
                        "http://127.0.0.1:8000/api/propertypaymentmethod",
                        {
                          propertyid: propertyid,
                          isonline: isonline,
                          paymentmethod: paymentmethod,
                        }
                      );
                      if (paymentres.data.status === "success") {
                        console.log("paymentres: ", paymentres.data);
                        //Ari bert padayun
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }

      // Optionally, reset the form data after submission
      // Reset all state variables here if needed
    } catch (error) {
      console.error("Error submitting form:", error);
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

  // Define the callback function to handle payment data change
  const handlePaymentDataChange = (data) => {
    // Update the paymentData state with the new data
    setPaymentData(data);
  };

  console.log("Payment Data From Parent", paymentData);
  return (
    <Container maxWidth="xl" sx={{ overflowX: "hidden" }}>
      {step === 1 && (
        <div>
          <AnimatePage>
            <Properties onSelectedTypeChange={handleSelectedTypeChange} />
          </AnimatePage>
          <div
            className="stepperFooter"
            style={{ display: "flex", justifyContent: "flex-end" }}
          >
            <button className="stepperNext" onClick={nextStep}>
              Next
            </button>
          </div>
        </div>
      )}
      {step === 2 && (
        <div>
          <AnimatePage>
            <PropertyType
              onSelectedPropertyTypeChange={handleSelectedPropertyTypeChange}
            />
          </AnimatePage>
          <div
            className="stepperFooter"
            style={{ display: "flex", justifyContent: "space-between" }}
          >
            <button className="stepperPrevious" onClick={prevStep}>
              Previous
            </button>
            <button className="stepperNext" onClick={nextStep}>
              Next
            </button>
          </div>
        </div>
      )}
      {step === 3 && (
        <div>
          <AnimatePage>
            <SimplePaper
              onPropertyInformationChange={handlePropertyInformationChange}
            />
          </AnimatePage>
          <div
            className="stepperFooter"
            style={{ display: "flex", justifyContent: "space-between" }}
          >
            <button className="stepperPrevious" onClick={prevStep}>
              Previous
            </button>
            <button className="stepperNext" onClick={nextStep}>
              Next
            </button>
          </div>
        </div>
      )}
      {step === 4 && (
        <div>
          <AnimatePage>
            <UnitInfo_2 onRoomDetailsChange={handleRoomDetailsChange} />
          </AnimatePage>
          <div
            className="stepperFooter"
            style={{ display: "flex", justifyContent: "space-between" }}
          >
            <button className="stepperPrevious" onClick={prevStep}>
              Previous
            </button>
            <button className="stepperNext" onClick={nextStep}>
              Next
            </button>
          </div>
        </div>
      )}
      {step === 5 && (
        <div>
          <AnimatePage>
            <BedroomDetails
              onBedroomDetailsChange={handleBedRoomDetailsChange}
            />
          </AnimatePage>

          <div
            className="stepperFooter"
            style={{ display: "flex", justifyContent: "space-between" }}
          >
            <button className="stepperPrevious" onClick={prevStep}>
              Previous
            </button>
            <button className="stepperNext" onClick={nextStep}>
              Next
            </button>
          </div>
        </div>
      )}
      {step === 6 && (
        <div>
          <AnimatePage>
            <AccommodationUploadPhotos onImagesChange={handleImagesChange} />
          </AnimatePage>

          <div
            className="stepperFooter"
            style={{ display: "flex", justifyContent: "space-between" }}
          >
            <button className="stepperPrevious" onClick={prevStep}>
              Previous
            </button>
            <button className="stepperNext" onClick={nextStep}>
              Next
            </button>
          </div>
        </div>
      )}
      {step === 7 && (
        <div>
          <AnimatePage>
            {/* The logic behind this is nag gamit ug useContext, using the address and mapval defined above */}
            <AddressForm />
          </AnimatePage>

          <div
            className="stepperFooter"
            style={{ display: "flex", justifyContent: "space-between" }}
          >
            <button className="stepperPrevious" onClick={prevStep}>
              Previous
            </button>
            <button className="stepperNext" onClick={nextStep}>
              Next
            </button>
          </div>
        </div>
      )}
      {step === 8 && (
        <div className="animationContainer">
          <AnimatePage>
            <AccommodationPropertyInformation
              onAmenitiesChange={handleAmenitiesChange}
            />
          </AnimatePage>

          <div
            className="stepperFooter"
            style={{ display: "flex", justifyContent: "space-between" }}
          >
            <button className="stepperPrevious" onClick={prevStep}>
              Previous
            </button>
            <button className="stepperNext" onClick={nextStep}>
              Next
            </button>
          </div>
        </div>
      )}
      {step === 9 && (
        <div className="animationContainer">
          <AnimatePage>
            <HouseRules onHouseRulesDataChange={handleHouseRulesDataChange} />
          </AnimatePage>

          <div
            className="stepperFooter"
            style={{ display: "flex", justifyContent: "space-between" }}
          >
            <button className="stepperPrevious" onClick={prevStep}>
              Previous
            </button>
            <button className="stepperNext" onClick={nextStep}>
              Next
            </button>
          </div>
        </div>
      )}
      {step === 10 && (
        <div>
          <AnimatePage>
            <Policies onPoliciesDataChange={handlePoliciesDataChange} />
          </AnimatePage>

          <div
            className="stepperFooter"
            style={{ display: "flex", justifyContent: "space-between" }}
          >
            <button className="stepperPrevious" onClick={prevStep}>
              Previous
            </button>
            <button className="stepperNext" onClick={nextStep}>
              Next
            </button>
          </div>
        </div>
      )}
      {step === 11 && (
        <div>
          <AnimatePage>
            <UnitPricing handleUnitPricing={handleUnitPricing} />
          </AnimatePage>

          <div
            className="stepperFooter"
            style={{ display: "flex", justifyContent: "space-between" }}
          >
            <button className="stepperPrevious" onClick={prevStep}>
              Previous
            </button>
            <button className="stepperNext" onClick={nextStep}>
              Next
            </button>
          </div>
        </div>
      )}
      {step === 12 && (
        <div>
          <AnimatePage>
            <PaymentMethods onPaymentDataChange={handlePaymentDataChange} />
          </AnimatePage>

          <div
            className="stepperFooter"
            style={{ display: "flex", justifyContent: "space-between" }}
          >
            <button className="stepperPrevious" onClick={prevStep}>
              Previous
            </button>
            <button className="stepperNext" onClick={nextStep}>
              Next
            </button>
          </div>
        </div>
      )}
      {step === 13 && (
        <div>
          <AnimatePage>
            <PartnerVerification onHostDataChange={handleHostDataChange} />
          </AnimatePage>

          <div
            className="stepperFooter"
            style={{ display: "flex", justifyContent: "space-between" }}
          >
            <button className="stepperPrevious" onClick={prevStep}>
              Previous
            </button>
            <button className="stepperNext" onClick={handleSubmit}>
              Submit
            </button>
          </div>
        </div>
      )}
    </Container>
  );
}
