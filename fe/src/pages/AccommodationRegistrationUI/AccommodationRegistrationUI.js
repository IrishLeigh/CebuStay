import React, { useState, useEffect, useCallback } from "react";
import { Container, Hidden } from "@mui/material";
import axios from "axios";
import UnitInfo_2 from "../../components/registration_unit/registration_unitDetails/unitDetails_2";
import BedroomDetails from "../../components/registration_unit/registration_bedRoomDetails/bedroomDetails";
import SimplePaper from "../../components/registration_unit/registration_personalInformation/home_form";
import HouseRules from "../../components/registration_unit/registration_houseRules/houseRules";
import Properties from "../../components/Button/Properties";
import PropertyType from "./components/PropertyTypeDescription";
import AddressForm from "../../components/Form/AccommodationPropertyLocation";
import AccommodationUploadPhotos from "../../components/Form/AccommodationUploadPhotos";
import Policies from "../../components/registration_unit/registration_bookingPolicies/bookingPolicies";
import AccommodationPropertyInformation from "../../components/Button/AccommodationPropertyInformation";
import UnitPricing from "../../components/registration_unit/registration_pricing/pricing";
import { useData } from "../../components/registration_unit/registration_location/contextAddressData";
import "../AccommodationRegistrationUI/css/Registration.css"; // Import CSS file
// import AnimatePage from "./AnimatedPage";
import AnimatePage from "../AccommodationRegistrationUI/components/AnimatedPage";
import PaymentMethods from "../../components/registration_unit/registration_pMethods/PaymentMethods";
import PartnerVerification from "./components/Partnership/partnerVerification";
import "../AccommodationRegistrationUI/css/Registration.css";
import {
  Modal,
  Backdrop,
  CircularProgress,
  Box,
  Typography,
  Fade,
} from "@mui/material";
import { useUser } from "../../components/UserProvider";
import PropertyType2 from "./components/PropertyType2";
const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};
export default function AccommodationRegistrationUI() {
  const [step, setStep] = useState(1);
  const finalStep = 13; // Define the total number of steps
  const [modalMessage, setModalMessage] = useState(""); // Define modalMessage state variable
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState();
  const { loginUser } = useUser();
  const [validSteps, setValidSteps] = useState(Array(13).fill(false));
  // State variables for form data
  const { addressData, mapVal } = useData();
  const [selectedType, setSelectedType] = useState("");
  const [selectedPropertyType, setSelectedPropertyType] = useState("");
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
  const [houseRulesData, setHouseRulesData] = useState({});
  const [policiesData, setPoliciesData] = useState({});
  const [selectedImages, setSelectedImages] = useState([]);
  const [locationDetails, setLocationDetails] = useState({});
  const [selectedAmenities, setSelectedAmenities] = useState({
    basicAmenities: [],
    basicServices: [],
    facilities: [],
  });
  const [unitPricing, setUnitPricing] = useState({});
  const [hostData, setHostData] = useState({});
  const [paymentData, setPaymentData] = useState({});

  useEffect(() => {
    // const token = document.cookie.split(';').find(c => c.trim().startsWith('auth_token='));
    const token = localStorage.getItem("auth_token");

    // console.log("Token:", token);
    if (token) {
      const jwtToken = token.split("=")[1];
      axios
        .post("http://127.0.0.1:8000/api/decodetoken", { token: token })
        .then((response) => {
          setUser(response.data["data"]);
          loginUser(response.data.data);
          console.log("RESPONSE DATA: ", response.data["data"]);
        })
        .catch((error) => {
          alert("Error decoding JWT token:", error);
          setUser(null);
        });
    } else {
      setUser(null);
    }
  }, []);

  // Functions to handle step navigation
  const nextStep = () => {
    setStep(step + 1);
  };

  const prevStep = () => {
    setStep(step - 1);
  };

  //validation
  const isFormComplete = () => {
    // Check if all required fields are filled out
    if (
      !selectedType ||
      !selectedPropertyType ||
      !propertyInfo ||
      !unitDetailsData ||
      !bedroomDetails ||
      !houseRulesData ||
      !policiesData ||
      !selectedImages ||
      !locationDetails ||
      !selectedAmenities ||
      !unitPricing ||
      !hostData ||
      !paymentData
    ) {
      return false; // Form is incomplete
    }
    return true; // Form is complete
  };
  // Function to handle form submission
  const handleSubmit = async () => {
      setOpen(true);
     // Check if the form is complete
     const formComplete = isFormComplete();

     if (formComplete) {
       // Proceed with form submission
       // Add your submission logic here
     } else {
       // Determine the first incomplete section
       let incompleteSection = '';
       if (!selectedType) {
         incompleteSection = 'Selected Type';
       } else if (!selectedPropertyType) {
         incompleteSection = 'Selected Property Type';
       } else if (!propertyInfo) {
         incompleteSection = 'Property Information';
       } else if (!unitDetailsData) {
         incompleteSection = 'Unit Details';
       } else if (!bedroomDetails) {
         incompleteSection = 'Bedroom Details';
       } else if (!houseRulesData) {
         incompleteSection = 'House Rules';
       } else if (!policiesData) {
         incompleteSection = 'Policies';
       } else if (!selectedImages) {
         incompleteSection = 'Selected Images';
       } else if (!locationDetails) {
         incompleteSection = 'Location Details';
       } else if (!selectedAmenities) {
         incompleteSection = 'Selected Amenities';
       } else if (!unitPricing) {
         incompleteSection = 'Unit Pricing';
       } else if (!hostData) {
         incompleteSection = 'Host Data';
       } else if (!paymentData) {
         incompleteSection = 'Payment Data';
       }
 
       // Show modal indicating that the form is incomplete
       setModalMessage(`Please go to '${incompleteSection}' and complete the form.`);
     }
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
      // setOpen(true);
      console.log("propinfo:", propertyInfo);
      console.log("proptype gawass: ", selectedType);
      const resPropertid = await axios.post(
        "http://127.0.0.1:8000/api/propertyinfo",
        {
          userid: user.userid,
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
        const unitId = resUnitid.data.unitid;
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
            console.log("naa propertyid?", resPropertid.data.propertyid);
            console.log("naa selectimage?", resUnitid.data.unitid);

            // Append propertyid to formdata
            formdata.append("propertyid", resPropertid.data.propertyid);

            console.log("FORMDATA selectImages:", selectedImages);

            // Check if selectedImages is an array
            if (!Array.isArray(selectedImages)) {
              console.error("selectedImages is not an array.");
              return;
            }
            console.log("Is AN Array:");
            // Function to convert URL to File
            async function urlToFile(url, filename) {
              const response = await fetch(url);
              const blob = await response.blob();
              return new File([blob], filename, { type: blob.type });
            }

            try {
              // Convert each image object to a File object and append to FormData
              await Promise.all(
                selectedImages.map(async (image) => {
                  if (!image.url || !image.name) {
                    console.error(
                      "selectedImages item is missing URL or name.",
                      image
                    );
                    return;
                  }

                  const file = await urlToFile(image.url, image.name);
                  formdata.append("files[]", file);
                  console.log("FORMDATA selectimagesforloop:", file);
                })
              );
            } catch (error) {
              console.error("Error converting URL to file:", error);
              return;
            }

            console.log("FORMDATA after processing:", formdata);

            // Debugging: Log the contents of FormData
            for (let pair of formdata.entries()) {
              console.log(pair[0] + ":", pair[1]);
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
            console.log("loc", locationDetails);
            console.log("resImgUpload", resImgUpload);
            if (resImgUpload.status == 200) {
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
                console.log("propertyLoc:", propertyLoc);
                if (propertyLoc.status) {
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

                if (propertyLoc.status) {
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

                if (propertyLoc.status) {
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
                      // const homeid = resPropertid.data.homeid;
                      const max_price = 0;
                      const min_price = unitPricing.basePrice;
                      const profit = unitPricing.profit;
                      const unit_pricing = await axios.post(
                        "http://127.0.0.1:8000/api/propertypricing",
                        {
                          unitid: unitId,
                          max_price: max_price,
                          min_price: min_price,
                          profit: profit,
                        }
                      );
                      if (unit_pricing.data.status === "success") {
                        console.log("unit_pricing: ", unit_pricing.data);
                        const isonline =
                          paymentData.selectedPayment === "Online"
                            ? true
                            : false;
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
                          console.log("hostData: ", hostData);
                          //Ari bert padayun
                          const hosttype = hostData.hostType;
                          console.log("hosttype", hosttype);
                          const ownership = await axios.post(
                            "http://127.0.0.1:8000/api/propertyownership",
                            {
                              propertyid: propertyid,
                              ownershiptype: hosttype,
                            }
                          );
                          if (ownership.data.status === "success") {
                            const ownershipid =
                              ownership.data.houseRule.propertyownershipid;

                            const firstName = hostData.FirstName;
                            const lastName = hostData.LastName;
                            const displayName = hostData.DisplayName;
                            const dateofbirth = hostData.DateOfBirth;
                            const phoneNumber = hostData.PhoneNumber;
                            const email = hostData.Email;
                            const city = hostData.City;
                            const province = hostData.Province;
                            const zipcode = hostData.ZipCode;
                            const address = hostData.PrimaryAddress;
                            const describe = hostData.Describe;
                            const calendar = hostData.CalendarLink;
                            const owner = await axios.post(
                              "http://127.0.0.1:8000/api/propertyowner",
                              {
                                propertyownershipid: ownershipid,
                                firstname: firstName,
                                lastname: lastName,
                                displayname: displayName,
                                dateofbirth: dateofbirth,
                                contactnumber: phoneNumber,
                                email: email,
                                province: province,
                                city: city,
                                primary_address: address,
                                zipcode: zipcode,
                                describe: describe,
                                calendar: calendar,
                              }
                            );
                            console.log("Owner:", owner);
                            if (owner.data.status === "success") {
                              console.log(owner.data.message);
                              const manager = await axios.post(
                                "http://127.0.0.1:8000/api/becomeManager",
                                {
                                  userid: user.userid,
                                }
                              );
                              console.log("Manager:", manager.data);
                              console.log("Successfully Registered");
                              setModalMessage("Successfully Registered");
                              setOpen(false); // Close the circular progress

                              // Clear local storage after successful submission
                              localStorage.removeItem("selectedPropertyType");
                              localStorage.removeItem("propertyData");
                              localStorage.removeItem("unitDetailsData");
                              localStorage.removeItem("bedrooms");
                              localStorage.removeItem("selectedImages");
                              localStorage.removeItem("basicAmenities");
                              localStorage.removeItem("basicServices");
                              localStorage.removeItem("facilities");
                              localStorage.removeItem("houseRulesData");
                              localStorage.removeItem("paymentData");
                              localStorage.removeItem("hostData");
                              localStorage.removeItem("policiesData");
                              localStorage.removeItem("paymentData");
                              localStorage.removeItem("basePrice");
                              localStorage.removeItem('street');
                              localStorage.removeItem('postalCode');

                              console.log("Successfully removed localstorage");

                              // setOpen(false); // Close the circular progress
                              // setModalMessage("Successfully Registered");
                            }
                          }
                        }
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
      setModalMessage("Submission failed. Please try again later.");
    } finally {
      // Hide modal and reset loading state after a delay
    }
  };
  // Callback functions to handle form data changes
  const handleSelectedTypeChange = (type) => {
    setSelectedType(type);
  };
  const handleSelectedPropertyTypeChange = useCallback((propertyType) => {
    // Handle the change in the parent component
    setSelectedPropertyType(propertyType);
    console.log("Selected Property Type:", propertyType);
  }, []);

  const handlePropertyInformationChange = (propertyData) => {
    setPropertyInfo(propertyData);
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
  useEffect(() => {
    localStorage.setItem(
      "registrationFormData",
      JSON.stringify({
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
        unitPricing,
        hostData,
        paymentData,
        // Add more form data variables as needed
        // Other form data...
      })
    );
  }, [
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
    unitPricing,
    hostData,
    paymentData /* Add other form data dependencies here */,
  ]);

  // // UseEffect to retrieve form data from localStorage on component mount
  // useEffect(() => {
  //   const savedData = JSON.parse(localStorage.getItem("registrationFormData"));
  //   if (savedData) {
  //     setSelectedType(savedData.selectedType);
  //     setSelectedPropertyType(savedData.selectedPropertyType);
  //     setPropertyInfo(savedData.propertyInfo);
  //     setUnitDetailsData(savedData.unitDetailsData);
  //     setBedroomDetailsData(savedData.bedroomDetails);
  //     setHouseRulesData(savedData.houseRulesData);
  //     setPoliciesData(savedData.policiesData);
  //     setSelectedImages(savedData.selectedImages);
  //     setLocationDetails(savedData.locationDetails);
  //     setSelectedAmenities(savedData.selectedAmenities);
  //     setUnitPricing(savedData.unitPricing);
  //     setHostData(savedData.hostData);
  //     setPaymentData(savedData.paymentData);
  //     // Add more form data state variables as needed
  //     // Set other form data state variables...
  //   }
  // }, []);

  //   console.log("Property Data From Parent", propertyInfo);
  // console.log("Propertyselctedtype  from Parents: ", selectedPropertyType);
  // console.log("Property Type from Parent: ", selectedType);
  console.log("Unitdetaisl data from Parent: ", unitDetailsData);
  // console.log("Bedroom Dteails:", bedroomDetails);
  console.log("House Rulese Data:", houseRulesData);
  // console.log("Policies Data:", policiesData);
  // console.log("Selected Images :", selectedImages);
  // console.log("Location Details :", locationDetails);
  // console.log("Amenties :", selectedAmenities);
  // console.log("Unit Pricing :", unitPricing);
  // console.log("hostData", hostData);
  // console.log("Payment Data", paymentData);

  // console.log("Payment method from Parent: ", paymentData);
  console.log("userid", user && user["userid"]);

  return (
    <div className="registration-page">
      <Container maxWidth="xl" sx={{ overflowX: "hidden" }}>
        {step === 1 && (
          <div style={{ display: "flex", justifyContent: "center" , alignItems: "center"}}>
            <AnimatePage>
              <Properties
                onSelectedTypeChange={handleSelectedTypeChange}
                parentSelectedData={selectedType}
              />
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
              <PropertyType2
                onSelectedPropertyTypeChange={handleSelectedPropertyTypeChange}
                parentSelectedPropertyType={selectedPropertyType}
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
                parentPropertyInfo={propertyInfo}
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
              <UnitInfo_2
                onRoomDetailsChange={handleRoomDetailsChange}
                parentUnitDetailsData={unitDetailsData}
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
        {step === 5 && (
          <div>
            <AnimatePage>
              <BedroomDetails
                onBedroomDetailsChange={handleBedRoomDetailsChange}
                parentBedroomDetails={bedroomDetails}
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
              <AccommodationUploadPhotos
                onImagesChange={handleImagesChange}
                parentImages={selectedImages}
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
                parentAmmenities={selectedAmenities}
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
              <HouseRules
                onHouseRulesDataChange={handleHouseRulesDataChange}
                parentHouseRules={houseRulesData}
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
              {/* <button className="stepperNext" onClick={handleLoader}>
                testing
              </button> */}
            </div>
          </div>
        )}
        {/* Modal for displaying messages */}
        {/* <Modal
        open={!!modalMessage}
        onClose={() => setModalMessage("")}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
      >
        <div className="modal-content">
          <h2 id="modal-title">{modalMessage}</h2>
          <button
            onClick={() => {
              setModalMessage("");
              window.location.href = '/'; // Redirect to homepage
            }}
          >
            Go to Homepage
          </button>
        </div>
      </Modal> */}
        {/* Loading indicator */}
          <Backdrop open={open}>
            <CircularProgress color="inherit" />
          </Backdrop>
        <Modal
          aria-labelledby="transition-modal-title"
          aria-describedby="transition-modal-description"
          open={!!modalMessage}
          onClose={() => setModalMessage("")}
          closeAfterTransition
          slots={{ backdrop: Backdrop }}
        >
          <Fade in={!!modalMessage}>
            <Box sx={style}>
              <Typography
                id="transition-modal-title"
                variant="h6"
                component="h2"
              >
                {modalMessage}
              </Typography>
              <button
                onClick={() => {
                  setModalMessage("");
                  window.location.href = "/"; // Redirect to homepage
                }}
              >
                Go to Homepage
              </button>
            </Box>
          </Fade>
        </Modal>
      </Container>
    </div>
  );
}
