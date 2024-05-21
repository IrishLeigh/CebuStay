import React, { useState, useEffect } from "react";
import axios from "axios"; // Import Axios library
import UnitInfo_2 from "../components/registration_unit/registration_unitDetails/unitDetails_2";
import BedroomDetails from "../components/registration_unit/registration_bedRoomDetails/bedroomDetails";
import SimplePaper from "../components/registration_unit/registration_personalInformation/home_form";
import HouseRules from "../components/registration_unit/registration_houseRules/houseRules";
import AccommodationPropertyType from "../components/Button/AccommodationPropertyType";
import Properties from "../components/Button/Properties";
import PropertyType from "../components/Button/AccommodationRegistration2";
import AddressForm from "../components/Form/AccommodationPropertyLocation";
import AccommodationUploadPhotos from "../components/Form/AccommodationUploadPhotos";
import Policies from "../components/registration_unit/registration_bookingPolicies/bookingPolicies";
import AccommodationPropertyInformation from "../components/Button/AccommodationPropertyInformation";
import { useData } from "../components/registration_unit/registration_location/contextAddressData";
import SingleBed from "@mui/icons-material/SingleBed";

export default function RegistrationUnit() {
  // State for form data
  // Use DataContext
  const { addressData, mapVal } = useData();
  const [selectedType, setSelectedType] = useState("");
  const [selectedPropertyType, setSelectedPropertyType] = useState("");
  const [propertyData, setPropertyData] = useState({});
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
  const handlePropertyDataChange = (newPropertyData) => {
    setPropertyData(newPropertyData);
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
          property_name: propertyData.propertyName,
          property_type: selectedType,
          property_desc: propertyData.propertyDescription,
          property_directions: propertyData.gettingToProperty,
          unit_type: selectedPropertyType,
          number_unit: propertyData.numberOfUnits,
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
              // console.log('propertyId pinloc:', pinloc);
              const propertyLoc = await axios.post(
                "http://127.0.0.1:8000/api/location",
                {
                  propertyid: resPropertid.data.propertyid,
                  address: street,
                  zipcode: postalCode,
                  latitude: pinloc.lat,
                  longitude: pinloc.lng,
                }
              )
              if (propertyLoc.data.locationid) {
                // console.log('Amenities:', selectedAmenities);
                for (const amenity of selectedAmenities['basicAmenities']) {
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
                for (const service of selectedAmenities['basicServices']) {
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
                for (const facilities of selectedAmenities['facilities']) {
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

                // console.log('HouseRules', houseRulesData);
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
                )
                // console.log('houseRules: ', houseRules);
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

  return (
    <div>
      {/* Pass the handleSelectedTypeChange function to Properties component */}
      <Properties onSelectedTypeChange={handleSelectedTypeChange} />

      {/* Pass the handleSelectedPropertyTypeChange function to PropertyType component */}
      <PropertyType
        onSelectedPropertyTypeChange={handleSelectedPropertyTypeChange}
      />

      <SimplePaper onPropertyDataChange={handlePropertyDataChange} />

      {/* Pass the handleRoomDetailsChange function to UnitInfo_2 component */}
      <UnitInfo_2 onRoomDetailsChange={handleRoomDetailsChange} />

      {/* Pass the handleRoomDetailsChange function to UnitInfo_2 component */}
      <BedroomDetails onBedroomDetailsChange={handleBedRoomDetailsChange} />

      {/* Pass the handleImagesChange function to AccommodationUploadPhotos component */}
      <AccommodationUploadPhotos onImagesChange={handleImagesChange} />
      <AddressForm />

      {/* Pass the handleAmenitiesChange function to AccommodationPropertyInformation component */}
      <AccommodationPropertyInformation
        onAmenitiesChange={handleAmenitiesChange}
      />

      {/* Pass the handleHouseRulesDataChange function to HouseRules component */}
      <HouseRules onHouseRulesDataChange={handleHouseRulesDataChange} />

      <Policies onPoliciesDataChange={handlePoliciesDataChange} />

      {/* Button to submit the form */}
      <button onClick={handleSubmit}>Submit</button>
    </div>
  );
}
