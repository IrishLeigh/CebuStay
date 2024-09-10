//AccommodationRegistration
import React, { useState, useCallback, useEffect } from "react";
import {
  Container,
  Stepper,
  Step,
  StepLabel,
  StepButton,
  Button,
  stepConnectorClasses,
  StepConnector,
  styled,
  Backdrop,
  CircularProgress,
  BackdropRoot,
  Drawer,
  IconButton,
  Box,
} from "@mui/material";
import PropertyType from "./components/PropertyType";
import PropertyType2 from "./components/PropertyType2";
import RoomDetails from "./components/RoomDetails";
import BedroomDetails2 from "./components/BedRoomDetails";
import UploadPhotos from "./components/UploadPhotos";
import AddressForm from "../../components/Form/AccommodationPropertyLocation";
import HouseRules from "./components/HouseRules";
import Policies from "./components/BookingPolicies";
import UnitPricing from "./components/PropertyPricing";
import PaymentMethods from "./components/PaymentMethods";
import PartnerVerification from "../../components/registration_unit/registration_partner/partnerVerification";
import ConfirmationModal from "./modals/ConfirmationModal";
import AmenitiesFacilitiesServices from "./components/AmmenitiesServiciesFacilities";
import PropTypes from "prop-types";
import Check from "@mui/icons-material/Check";
import { useData } from "../../components/registration_unit/registration_location/contextAddressData";
import axios from "axios";
import { useUser } from "../../components/UserProvider";
import MultiPropertyInformation from "./components/MultiUnitRegistration/MultiPropertyInformation";
import MultiPropertyLocation from "./components/MultiUnitRegistration/MultiPropertyLocation";
import MultiRoomsAndBeds from "./components/MultiUnitRegistration/MultiRoomsAndBeds";
import MultiUnitFacilities from "./components/MultiUnitRegistration/MultiUnitFacilities";
import PropertyRulesPolicies from "./components/MultiUnitRegistration/PropertyRulesPolicies";
import SuccessModal from "./modals/SuccessModal";
import { useNavigate } from "react-router-dom";
import MenuIcon from "@mui/icons-material/Menu";
import ComplianceModal from "./modals/ComplianceModal";

// Customized Stepper
const QontoStepIconRoot = styled("div")(({ theme, ownerState }) => ({
  color: theme.palette.mode === "dark" ? theme.palette.grey[700] : "#eaeaf0",
  display: "flex",
  height: 2,
  alignItems: "center",
  ...(ownerState.active && {
    color: "#16B4DD",
  }),
  "& .QontoStepIcon-completedIcon": {
    color: "#16B4DD",
    zIndex: 1,
    fontSize: 18,
  },
  "& .QontoStepIcon-circle": {
    width: 8,
    height: 8,
    borderRadius: "50%",
    backgroundColor: "currentColor",
  },
}));
const QontoConnector = styled(StepConnector)(({ theme }) => ({
  [`&.${stepConnectorClasses.alternativeLabel}`]: {
    top: 2,
    left: "calc(-50% + 16px)",
    right: "calc(50% + 16px)",
  },
  [`&.${stepConnectorClasses.active}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      borderColor: "#16B4DD",
    },
  },
  [`&.${stepConnectorClasses.completed}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      borderColor: "#16B4DD",
    },
  },
  [`& .${stepConnectorClasses.line}`]: {
    borderColor:
      theme.palette.mode === "dark" ? theme.palette.grey[800] : "#eaeaf0",
    borderTopWidth: 3,
    borderRadius: 1,
  },
}));
function QontoStepIcon(props) {
  const { active, completed, className } = props;

  return (
    <QontoStepIconRoot ownerState={{ active }} className={className}>
      {completed ? (
        <Check className="QontoStepIcon-completedIcon" />
      ) : (
        <div className="QontoStepIcon-circle" />
      )}
    </QontoStepIconRoot>
  );
}
QontoStepIcon.propTypes = {
  /**
   * Whether this step is active.
   * @default false
   */
  active: PropTypes.bool,
  className: PropTypes.string,
  /**
   * Mark the step as completed. Is passed to child components.
   * @default false
   */
  completed: PropTypes.bool,
};

export default function AccommodationRegistration() {
  const handleSubmit = async () => {
    if (isSingleUnit) {
      //For Single Unit
      await handleSubmitSingle();
    } else if (isMultiUnit) {
      await handleSubmitMulti();
    }
  };
  //For Single Unit
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
  const [locationDetails, setLocationDetails] = useState({});
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
  const { addressData, mapVal, location, location2 } = useData();
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false); // State for confirmation modal
  const [isLoading, setIsLoading] = useState(false); // State for loading spinner
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false); // State for success modal
  const navigate = useNavigate(); // Initialize useNavigate hook
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [openCompliance, setOpenCompliance] = useState(false);
  
// Function to toggle the drawer
const toggleDrawer = (open) => (event) => {
  if (event.type === "keydown" && (event.key === "Tab" || event.key === "Shift")) {
    return;
  }
  setDrawerOpen(open);
};
  // Determine if the selected property type is single or multi-unit
  const isSingleUnit =
    selectedPropertyType === "Home" ||
    selectedPropertyType === "Condominium" ||
    selectedPropertyType === "Apartment";

  const isMultiUnit =
    selectedPropertyType === "Hotel" ||
    selectedPropertyType === "Hostel" ||
    selectedPropertyType === "Bungalow" ||
    selectedPropertyType === "Resort";

  //For Multi Unit
  const [multiRoomsAndBeds, setMultiRoomsAndBeds] = useState([]);
  const [multiUnitFacilities, setMultiUnitFacilities] = useState([]);
  //For Both Single and Multi Unit
  const [step, setStep] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [user, setUser] = useState();
  // Define steps for flow A
  const stepsFlowA = [
    "Property",
    "Type",
    "Basic Info",
    "Room",
    "Bed",
    "Photos",
    "Location",
    "Amenities",
    "Rules",
    "Pricing",
    "Payment",
    "Partnership",
  ];

  // Define steps for flow B
  const stepsFlowB = [
    "Type",
    "Basic Info",
    "Photos",
    "Location",
    "Rooms Info",
    "Facilities",
    "Policies",
    "Payment",
    "Partnership",
  ];
  const steps = isSingleUnit ? stepsFlowA : stepsFlowB;

  //Compliance Modal
  useEffect(() => {
    // Open the modal when the component mounts
    setOpenCompliance(true);
  }, []);
  
  //Get the JWT token from local storage
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
          // loginUser(response.data.data);
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

  // Modals and Loaders
  const openConfirmationModal = () => {
    setIsConfirmationModalOpen(true); // Open the confirmation modal
  };

  const closeConfirmationModal = () => {
    setIsConfirmationModalOpen(false); // Close the confirmation modal
  };

  const closeSuccessModal = () => {
    setIsSuccessModalOpen(false); // Close the success modal
    navigate('/'); // Redirect to the homepage
  };
  const handleCloseCompliance = () => {
    setOpenCompliance(false);
  };
  // useEffect to update locationDetails whenever addressData or mapVal changes
  useEffect(() => {
    setLocationDetails({ addressData, mapVal });
  }, [addressData, mapVal]);

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
    setPaymentData(data);
  };
  const handleHostDataChange = (data) => {
    setHostData(data);
  };

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
  //For Multi Unit
  const handleMultiRoomsAndBedsChange = (updatedRooms) => {
    // Handle the updated room details here
    setMultiRoomsAndBeds(updatedRooms);
    console.log("Updated Multi Room Details from Parent:", updatedRooms);
  };

  const handleMultiUnitFacilitiesChange = (facilities) => {
    setMultiUnitFacilities(facilities);
  };

  const handleSubmitSingle = async () => {
    //
    setIsLoading(true); // Show the loading spinner
    let missingFields = [];

    console.log("selectedPropertyType:", selectedPropertyType);
    if (!selectedPropertyType) missingFields.push("Property Type");

    console.log("selectedPropertyType2:", selectedPropertyType2);
    if (!selectedPropertyType2) missingFields.push("Unit Type");

    console.log("propertyInfo:", propertyInfo);
    if (!propertyInfo || Object.keys(propertyInfo).length === 0)
      missingFields.push("Basic Info");

    console.log("unitDetailsData.roomDetails:", unitDetailsData.roomDetails);
    if (
      !unitDetailsData ||
      unitDetailsData.roomDetails.every((detail) => detail.quantity === 0)
    )
      missingFields.push("Rooms");

    console.log(
      "unitDetailsData.guestCapacity:",
      unitDetailsData.guestCapacity
    );
    if (!unitDetailsData?.guestCapacity) missingFields.push("Guest Capacity");

    console.log("bedroomDetails:", bedroomDetails);
    if (!bedroomDetails || Object.keys(bedroomDetails).length === 0)
      missingFields.push("Beds");

    console.log("selectedImages:", selectedImages);
    if (!selectedImages || selectedImages.length === 0)
      missingFields.push("Photos");

    console.log("selectedAmenities:", selectedAmenities);
    if (
      !selectedAmenities ||
      Object.keys(selectedAmenities).every(
        (key) => !selectedAmenities[key]?.length
      )
    )
      missingFields.push("Facilities");

    console.log("houseRulesData:", houseRulesData);
    if (!houseRulesData || Object.keys(houseRulesData).length === 0)
      missingFields.push("Rules");

    console.log("policiesData:", policiesData);
    if (!policiesData || Object.keys(policiesData).length === 0)
      missingFields.push("Policies");

    console.log("unitPricing:", unitPricing);
    if (!unitPricing || Object.keys(unitPricing).length === 0)
      missingFields.push("Pricing");

    console.log("paymentData:", paymentData);
    if (!paymentData || Object.keys(paymentData).length === 0)
      missingFields.push("Payment");

    console.log("hostData:", hostData);
    if (!hostData || Object.keys(hostData).length === 0)
      missingFields.push("Partnership");

    if (missingFields.length > 0) {
      alert(
        `Please fill out the following fields before submitting:\n- ${missingFields.join(
          "\n- "
        )}`
      );
    } else {
      // Handle form submission here

      try {
        console.log("propinfo:", propertyInfo);
        console.log("proptype gawass: ", selectedPropertyType);
        const resPropertid = await axios.post(
          "http://127.0.0.1:8000/api/propertyinfo",
          {
            userid: user.userid,
            property_name: propertyInfo.propertyName,
            property_type: selectedPropertyType,
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
                        console.log(
                          "booking_policies: ",
                          booking_policies.data
                        );
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
                          console.log(
                            "propertyid",
                            resPropertid.data.propertyid
                          );
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
                                // setModalMessage("Successfully Registered");

                                localStorage.removeItem("postalCode");
                                localStorage.removeItem("street");
                                localStorage.removeItem("postalCode");
                                location2(null);
                                location(null);
                                alert("Form submitted successfully!");
                                alert("Form submitted successfully!");
                                setIsLoading(false); // Hide the loading spinner
                                setIsSuccessModalOpen(true); 
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
        alert("Submission failed. Please try again later.");
      } finally {
        // Hide modal and reset loading state after a delay
        setIsLoading(false); // Hide the loading spinner
        
      }
    }
  };

  async function base64ToFile(base64, filename) {
    const response = await fetch(base64);
    const blob = await response.blob();
    return new File([blob], filename, { type: blob.type });
  }

  const handleSubmitMulti = async () => {
    // MULTI UNIT SUBMIT
    console.log("Form submitted successfully!");
    alert("Form submitted successfully!");
    console.log("User", user);
    console.log("Property Information from parent", propertyInfo);
    console.log("Property Type", selectedPropertyType);
    console.log("Multi beds from parent", multiRoomsAndBeds);
    console.log("Policies from parent:", policiesData);
    console.log("House Rules from parent:", houseRulesData);
    console.log("Location", locationDetails);
    console.log("Images", selectedImages);
    console.log("Selected Facilities", multiUnitFacilities);
    console.log("Payment Method", paymentData);
    console.log("Host Data or Owner", hostData);
    try {
      const resPropertid = await axios.post(
        "http://127.0.0.1:8000/api/propertyinfo",
        {
          userid: user.userid,
          property_name: propertyInfo.propertyName,
          property_type: selectedPropertyType,
          property_desc: propertyInfo.propertyDescription,
          property_directions: propertyInfo.gettingToProperty,
          unit_type: selectedPropertyType,
        }
      );
      console.log("resPropertid", resPropertid.data);
      const propertyid = resPropertid.data.propertyid; //propertyid
      if (resPropertid.data.status === "success") {
        let counter = 0;
        for (const facilities of multiUnitFacilities.facilities) {
          // Make a POST request for each amenity
          const resFacilities = await axios.post(
            "http://127.0.0.1:8000/api/facilities",
            {
              propertyid: resPropertid.data.propertyid,
              facilities_name: facilities,
            }
          );
          if (resFacilities) {
            counter = counter + 1;
          }
        }
        if (counter !== 0) {
          console.log("Successfully Registered Facilities");
        }
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

        if (houseRules.data) {
          console.log("Successfully Registered House Rules");
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
          if (booking_policies.data) {
            console.log("Successfully Registered Policies");
          }
        }
      }
      if (resPropertid.data.status === "success") {
        const street = locationDetails.addressData.street;
        const postalCode = locationDetails.addressData.postalCode;
        const lat = locationDetails.mapVal.lat;
        const lng = locationDetails.mapVal.lng;
        const propertyLoc = await axios.post(
          "http://127.0.0.1:8000/api/location",
          {
            propertyid: propertyid,
            address: street,
            zipcode: postalCode,
            latitude: lat,
            longitude: lng,
          }
        );
        console.log("propertyLoc:", propertyLoc);
        if (propertyLoc.status === 200) {
          const formdata = new FormData();
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
          if (resImgUpload.status === 200) {
            for (const element of multiRoomsAndBeds) {
              const hasBedroom = element.unitDetailsData.roomDetails.some(
                (room) => room.roomType === "Bedroom"
              );
              if (!hasBedroom) {
                element.unitDetailsData.roomDetails.push({
                  roomType: "Bedroom",
                  quantity: 1,
                });
              }
              const resRoom = await axios.post(
                "http://127.0.0.1:8000/api/unitdetails",
                {
                  propertyid: propertyid,
                  guest_capacity: element.guestCapacity,
                  roomDetails: element.unitDetailsData.roomDetails,
                  roomName: element.roomName,
                  roomQuantity: element.roomQuantity,
                }
              );
              console.log("Unit Details Res:", resRoom);
              // const unitids = Array.isArray(resRoom.data.unitid)
              //   ? resRoom.data.unitid
              //   : [resRoom.data.unitid];
              if (resRoom.data.status === "success") {
                const unitid = resRoom.data.unitid;
                // for (const unitid of unitids) {
                const unitpriceres = await axios.post(
                  "http://127.0.0.1:8000/api/propertypricing",
                  {
                    unitid: unitid,
                    max_price: element.maxPrice,
                    min_price: element.basePrice,
                    profit: element.profit,
                  }
                );
                console.log("Unit Price Res:", unitpriceres);
                if (unitpriceres.data.status === "success") {
                  let counter = 0;
                  for (const amenity of element.selectedAmenities) {
                    // Make a POST request for each amenity
                    const resAmenity = await axios.post(
                      "http://127.0.0.1:8000/api/amenities",
                      {
                        propertyid: resPropertid.data.propertyid,
                        amenity_name: amenity,
                        unitid: unitid,
                      }
                    );
                    if (resAmenity) {
                      counter = counter + 1;
                    }
                  }
                  if (counter !== 0) {
                    console.log("Amenity successful");
                  }
                  for (const service of element.selectedServices) {
                    // Make a POST request for each amenity
                    const resService = await axios.post(
                      "http://127.0.0.1:8000/api/services",
                      {
                        propertyid: resPropertid.data.propertyid,
                        service_name: service,
                        unitid: unitid,
                      }
                    );
                    if (resService) {
                      counter = counter + 1;
                    }
                  }
                  if (counter !== 0) {
                    console.log("Service successful");
                  }
                }
                const formdata = new FormData();
                formdata.append("propertyid", propertyid);
                formdata.append("unitid", unitid);
                if (!Array.isArray(element.photos)) {
                  console.error("element.photos is not an array.");
                  return;
                }
                try {
                  await Promise.all(
                    element.photos.map(async (base64Image, index) => {
                      const filename = `unitImage${index}.jpg`;
                      const file = await base64ToFile(base64Image, filename);
                      formdata.append("files[]", file);
                    })
                  );
                } catch (error) {
                  console.error("Error converting base64 to file:", error);
                  return;
                }
                for (let pair of formdata.entries()) {
                  console.log(pair[0] + ":", pair[1]);
                }
                const resImgUpload = await axios.post(
                  "http://127.0.0.1:8000/api/upload-unit-files",
                  formdata,
                  {
                    headers: {
                      "Content-Type": "multipart/form-data",
                    },
                  }
                );
                console.log("Result Image Axios", resImgUpload);
                if (unitpriceres.data.status === "success") {
                  const bedroomDetailsData = [
                    Object.fromEntries(
                      Object.entries(element.bedDetails).map(([key, value]) => {
                        let newKey = key;
                        if (key === "double") {
                          newKey = "doubleBed";
                        } else if (key === "superLarge") {
                          newKey = "superLargeBed";
                        }
                        return [newKey, value.quantity];
                      })
                    ),
                  ];
                  console.log("Bedroom Details Data:", bedroomDetailsData);
                  const unitroomres = await axios.post(
                    "http://127.0.0.1:8000/api/bedroomtype",
                    {
                      unitid: unitid,
                      bedroomDetailsData: bedroomDetailsData,
                    }
                  );
                  console.log("Unit Room Res:", unitroomres);
                }
                // }
              }
            }
          }
          if (resPropertid.data.status === "success") {
            const isonline =
              paymentData.selectedPayment === "Online" ? true : false;
            const paymentmethod = paymentData.selectedPayout;
            const propertyid = resPropertid.data.propertyid;

            const paymentres = await axios.post(
              "http://127.0.0.1:8000/api/propertypaymentmethod",
              {
                propertyid: propertyid,
                isonline: isonline,
                paymentmethod: paymentmethod,
              }
            );
            if (
              paymentres.data.status === "success" &&
              propertyLoc.status === 200
            ) {
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

                  localStorage.removeItem("postalCode");
                  localStorage.removeItem("street");
                  localStorage.removeItem("postalCode");
                  location2(null);
                  location(null);
                }
              }
            }
          }
        }
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("Submission failed. Please try again later.");
    }
    console.log("NICE ONE!");
  };

  console.log("Property Information from parent", propertyInfo);
  console.log("Multi beds from parent", multiRoomsAndBeds);
  console.log("Policies from parent:", policiesData);
  console.log("House Rules from parent:", houseRulesData);

//   return (
//     <div className="registration-body">
//       <div className="accommodation-registration-page">
//         {/* <HeaderUser className="sticky-header" /> */}
//         <div className="centered-container">
//           <Container maxWidth="lg">
//             {/* Common Step for Property Type Selection */}
//             {step === 0 && (
//               <PropertyType
//                 onSelectedTypeChange={handleSelectedTypeChange}
//                 parentSelectedData={selectedPropertyType}
//                 handleNext={handleNext}
//               />
//             )}

//             {/* Flow A: Single Unit Steps */}
//             {isSingleUnit && (
//               <>
//                 {step === 1 && (
//                   <PropertyType2
//                     onSelectedPropertyTypeChange={
//                       handleSelectedPropertyTypeChange
//                     }
//                     parentSelectedPropertyType={selectedPropertyType2}
//                     handleNext={handleNext}
//                     handleBack={handleBack}
//                   />
//                 )}
//                 {step === 2 && (
//                   // <PropertyInformation
//                   //   onPropertyInformationChange={
//                   //     handlePropertyInformationChange
//                   //   }
//                   //   parentPropertyInfo={propertyInfo}
//                   //   handleNext={handleNext}
//                   //   handleBack={handleBack}
//                   // />
//                   <MultiPropertyInformation
//                     onMultiPropertyInformationChange={
//                       handlePropertyInformationChange
//                     }
//                     parentMultiPropertyInfo={propertyInfo}
//                     handleNext={handleNext}
//                     handleBack={handleBack}
//                   />
//                 )}
//                 {step === 3 && (
//                   <RoomDetails
//                     onRoomDetailsChange={handleRoomDetailsChange}
//                     parentUnitDetailsData={unitDetailsData}
//                     handleNext={handleNext}
//                     handleBack={handleBack}
//                   />
//                 )}
//                 {step === 4 && (
//                   <BedroomDetails2
//                     onBedroomDetailsChange={handleBedRoomDetailsChange}
//                     parentBedroomDetails={bedroomDetails}
//                     parentTotalQTY={totalQTY}
//                     handleNext={handleNext}
//                     handleBack={handleBack}
//                   />
//                 )}
//                 {step === 5 && (
//                   <UploadPhotos
//                     onImagesChange={handleImagesChange}
//                     parentImages={selectedImages}
//                     handleNext={handleNext}
//                     handleBack={handleBack}
//                   />
//                 )}
//                 {step === 6 && (
//                   // <AddressForm
//                   //   handleNext={handleNext}
//                   //   handleBack={handleBack}
//                   // />
//                   <MultiPropertyLocation
//                     handleNext={handleNext}
//                     handleBack={handleBack}
//                   />
//                 )}
//                 {step === 7 && (
//                   <AmenitiesFacilitiesServices
//                     onAmenitiesChange={handleAmenitiesChange}
//                     parentAmenities={selectedAmenities}
//                     handleNext={handleNext}
//                     handleBack={handleBack}
//                   />
//                 )}
//                 {step === 8 && (
//                 //   <HouseRules
//                 //     onHouseRulesDataChange={handleHouseRulesDataChange}
//                 //     parentHouseRules={houseRulesData}
//                 //     handleNext={handleNext}
//                 //     handleBack={handleBack}
//                 //   />
//                 // )}
//                 // {step === 9 && (
//                 //   <Policies
//                 //     onPoliciesDataChange={handlePoliciesDataChange}
//                 //     parentPoliciesData={policiesData}
//                 //     handleNext={handleNext}
//                 //     handleBack={handleBack}
//                 //   />
//                 // )}
//                   <PropertyRulesPolicies
//                       onPoliciesDataChange={handlePoliciesDataChange}
//                       parentPoliciesData={policiesData}
//                       onHouseRulesDataChange={handleHouseRulesDataChange}
//                       parentHouseRules={houseRulesData}
//                       handleNext={handleNext}
//                       handleBack={handleBack}
//                     />
//                 )}
//                 {step === 9 && (
//                   <UnitPricing
//                     onUnitPricingChange={handleUnitPricing}
//                     parentUnitPricing={unitPricing}
//                     handleNext={handleNext}
//                     handleBack={handleBack}
//                   />
//                 )}
//                 {step === 10 && (
//                   <PaymentMethods
//                     onPaymentDataChange={handlePaymentDataChange}
//                     parentPaymentData={paymentData}
//                     handleNext={handleNext}
//                     handleBack={handleBack}
//                   />
//                 )}
//                 {step === 11 && (
//                   <PartnerVerification
//                     onHostDataChange={handleHostDataChange}
//                     parentHostData={hostData}
//                     handleBack={handleBack}
//                     openModal={openModal}
//                   />
//                 )}
//               </>
//             )}

//             {/* Flow B: Multi Unit Steps */}
//             {isMultiUnit && (
//               <>
//                 {step === 1 && (
//                   <MultiPropertyInformation
//                     onMultiPropertyInformationChange={
//                       handlePropertyInformationChange
//                     }
//                     parentMultiPropertyInfo={propertyInfo}
//                     handleNext={handleNext}
//                     handleBack={handleBack}
//                   />
//                 )}
//                 {step === 2 && (
//                   <UploadPhotos
//                     onImagesChange={handleImagesChange}
//                     parentImages={selectedImages}
//                     handleNext={handleNext}
//                     handleBack={handleBack}
//                   />
//                 )}
//                 {step === 3 && (
//                   <MultiPropertyLocation
//                     handleNext={handleNext}
//                     handleBack={handleBack}
//                   />
//                 )}
//                 {step === 4 && (
//                   <MultiRoomsAndBeds
//                     handleNext={handleNext}
//                     handleBack={handleBack}
//                     onMultiRoomsAndBedsChange={handleMultiRoomsAndBedsChange}
//                     parentRoomsAndBedsData={multiRoomsAndBeds}
//                   />
//                 )}
//                 {step === 5 && (
//                   <MultiUnitFacilities
//                     onAmenitiesChange={handleMultiUnitFacilitiesChange}
//                     parentAmenities={multiUnitFacilities}
//                     handleNext={handleNext}
//                     handleBack={handleBack}
//                   />
//                 )}
//                 {step === 6 && (
//                   <PropertyRulesPolicies
//                     onPoliciesDataChange={handlePoliciesDataChange}
//                     parentPoliciesData={policiesData}
//                     onHouseRulesDataChange={handleHouseRulesDataChange}
//                     parentHouseRules={houseRulesData}
//                     handleNext={handleNext}
//                     handleBack={handleBack}
//                   />
//                 )}
//                 {step === 7 && (
//                   <PaymentMethods
//                     onPaymentDataChange={handlePaymentDataChange}
//                     parentPaymentData={paymentData}
//                     handleNext={handleNext}
//                     handleBack={handleBack}
//                   />
//                 )}
//                 {step === 8 && (
//                   <PartnerVerification
//                     onHostDataChange={handleHostDataChange}
//                     parentHostData={hostData}
//                     handleBack={handleBack}
//                     openModal={openModal}
//                   />
//                 )}

//                 {/* Other steps for multi unit */}
//               </>
//             )}
//            {/* Render circular progress indicator while loading */}
//             {/* Render circular progress indicator while loading */}
//               {isLoading && (
//               <Backdrop
//                 open={isLoading}
//                 style={{ zIndex: 1301, color: '#fff' }} // Make sure the backdrop is visible
//               >
//                 <CircularProgress color="inherit" />
//                 <p>Please wait...</p>
//               </Backdrop>
//             )}

//               {/* Render confirmation modal */}
//               {/* <ConfirmationModal
//                 isOpen={isConfirmationModalOpen}
//                 onConfirm={() => {
//                   closeConfirmationModal();
//                   handleSubmit(); // Proceed with submission after confirmation
//                 }}
//                 onCancel={closeConfirmationModal}
//               /> */}
//               <ConfirmationModal
//                 isOpen={isModalOpen}
//                 closeModal={isModalOpen}
//                 handleSubmit={handleSubmit}
//               />

//               {/* Render success modal */}
//               <SuccessModal
//                 isOpen={isSuccessModalOpen}
//                 onClose={closeSuccessModal}
//               />

//             <footer>
//               <Stepper
//                 activeStep={step}
//                 alternativeLabel
//                 connector={<QontoConnector />}
//                 sx={{
//                   position: "fixed",
//                   bottom: 0,
//                   left: 0,
//                   width: "100%",
//                   zIndex: 999,
//                   paddingLeft: "8rem",
//                   paddingRight: "8rem",
//                   paddingTop: "2rem",
//                   paddingBottom: "1rem",
//                   backgroundColor: "white",
//                   boxShadow: "0px -0.25em 0.625em rgba(0, 0, 0, 0.1)",
//                   fontSize: "0.5rem",
//                 }}
//               >
//                 {steps.map((label, index) => (
//                   <Step key={index}>
//                     <StepButton onClick={() => setStep(index)}>
//                       <StepLabel StepIconComponent={QontoStepIcon}>
//                         {label}
//                       </StepLabel>
//                     </StepButton>
//                   </Step>
//                 ))}
//               </Stepper>
//             </footer>
//           </Container>
//         </div>
//       </div>
//     </div>
//   );
// }

return (
  <Box className="registration-body">
  <Box
    sx={{
      display: "grid",
      gridTemplateColumns: { xs: "1fr", sm: "250px 1fr" }, // Fixed width for stepper
      height: "90 vh",
    }}
  >
    {/* Stepper on the left */}
    <Box
      sx={{
        display: { xs: "none", sm: "block" }, // Hide on small screens
        position: "relative",
        backgroundColor: "white",
        padding: "2rem",
        boxShadow: "0px 0.25em 0.625em rgba(0, 0, 0, 0.1)",
        overflowY: "auto",
        width: "250px", // Fixed width for the stepper
      }}
    >
        <Stepper activeStep={step} orientation="vertical">
          {steps.map((label, index) => (
            <Step key={index}>
              <StepButton onClick={() => setStep(index)}>
                <StepLabel>{label}</StepLabel>
              </StepButton>
            </Step>
          ))}
        </Stepper>
      </Box>

      {/* Main content on the right */}
      <Box
        sx={{
          padding: "2rem",
          overflowX: "hidden", // Prevent horizontal scrolling in main content
        }}
      >
        {step === 0 && <PropertyType onSelectedTypeChange={handleSelectedTypeChange} handleNext={handleNext} />}
         {/* Flow A: Single Unit Steps */}
         {isSingleUnit && (
              <>
                {step === 1 && (
                  <PropertyType2
                    onSelectedPropertyTypeChange={
                      handleSelectedPropertyTypeChange
                    }
                    parentSelectedPropertyType={selectedPropertyType2}
                    handleNext={handleNext}
                    handleBack={handleBack}
                  />
                )}
                {step === 2 && (
                  // <PropertyInformation
                  //   onPropertyInformationChange={
                  //     handlePropertyInformationChange
                  //   }
                  //   parentPropertyInfo={propertyInfo}
                  //   handleNext={handleNext}
                  //   handleBack={handleBack}
                  // />
                  <MultiPropertyInformation
                    onMultiPropertyInformationChange={
                      handlePropertyInformationChange
                    }
                    parentMultiPropertyInfo={propertyInfo}
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
                  // <AddressForm
                  //   handleNext={handleNext}
                  //   handleBack={handleBack}
                  // />
                  <MultiPropertyLocation
                    handleNext={handleNext}
                    handleBack={handleBack}
                  />
                )}
                {step === 7 && (
                  <AmenitiesFacilitiesServices
                    onAmenitiesChange={handleAmenitiesChange}
                    parentAmenities={selectedAmenities}
                    handleNext={handleNext}
                    handleBack={handleBack}
                  />
                )}
                {step === 8 && (
                //   <HouseRules
                //     onHouseRulesDataChange={handleHouseRulesDataChange}
                //     parentHouseRules={houseRulesData}
                //     handleNext={handleNext}
                //     handleBack={handleBack}
                //   />
                // )}
                // {step === 9 && (
                //   <Policies
                //     onPoliciesDataChange={handlePoliciesDataChange}
                //     parentPoliciesData={policiesData}
                //     handleNext={handleNext}
                //     handleBack={handleBack}
                //   />
                // )}
                  <PropertyRulesPolicies
                      onPoliciesDataChange={handlePoliciesDataChange}
                      parentPoliciesData={policiesData}
                      onHouseRulesDataChange={handleHouseRulesDataChange}
                      parentHouseRules={houseRulesData}
                      handleNext={handleNext}
                      handleBack={handleBack}
                    />
                )}
                {step === 9 && (
                  <UnitPricing
                    onUnitPricingChange={handleUnitPricing}
                    parentUnitPricing={unitPricing}
                    handleNext={handleNext}
                    handleBack={handleBack}
                  />
                )}
                {step === 10 && (
                  <PaymentMethods
                    onPaymentDataChange={handlePaymentDataChange}
                    parentPaymentData={paymentData}
                    handleNext={handleNext}
                    handleBack={handleBack}
                  />
                )}
                {step === 11 && (
                  <PartnerVerification
                    onHostDataChange={handleHostDataChange}
                    parentHostData={hostData}
                    handleBack={handleBack}
                    openModal={openModal}
                  />
                )}
              </>
            )}

            {/* Flow B: Multi Unit Steps */}
            {isMultiUnit && (
              <>
                {step === 1 && (
                  <MultiPropertyInformation
                    onMultiPropertyInformationChange={
                      handlePropertyInformationChange
                    }
                    parentMultiPropertyInfo={propertyInfo}
                    handleNext={handleNext}
                    handleBack={handleBack}
                  />
                )}
                {step === 2 && (
                  <UploadPhotos
                    onImagesChange={handleImagesChange}
                    parentImages={selectedImages}
                    handleNext={handleNext}
                    handleBack={handleBack}
                  />
                )}
                {step === 3 && (
                  <MultiPropertyLocation
                    handleNext={handleNext}
                    handleBack={handleBack}
                  />
                )}
                {step === 4 && (
                  <MultiRoomsAndBeds
                    handleNext={handleNext}
                    handleBack={handleBack}
                    onMultiRoomsAndBedsChange={handleMultiRoomsAndBedsChange}
                    parentRoomsAndBedsData={multiRoomsAndBeds}
                  />
                )}
                {step === 5 && (
                  <MultiUnitFacilities
                    onAmenitiesChange={handleMultiUnitFacilitiesChange}
                    parentAmenities={multiUnitFacilities}
                    handleNext={handleNext}
                    handleBack={handleBack}
                  />
                )}
                {step === 6 && (
                  <PropertyRulesPolicies
                    onPoliciesDataChange={handlePoliciesDataChange}
                    parentPoliciesData={policiesData}
                    onHouseRulesDataChange={handleHouseRulesDataChange}
                    parentHouseRules={houseRulesData}
                    handleNext={handleNext}
                    handleBack={handleBack}
                  />
                )}
                {step === 7 && (
                  <PaymentMethods
                    onPaymentDataChange={handlePaymentDataChange}
                    parentPaymentData={paymentData}
                    handleNext={handleNext}
                    handleBack={handleBack}
                  />
                )}
                {step === 8 && (
                  <PartnerVerification
                    onHostDataChange={handleHostDataChange}
                    parentHostData={hostData}
                    handleBack={handleBack}
                    openModal={openModal}
                  />
                )}

                {/* Other steps for multi unit */}
              </>
            )}
           {/* Render circular progress indicator while loading */}
            {/* Render circular progress indicator while loading */}
              {isLoading && (
              <Backdrop
                open={isLoading}
                style={{ zIndex: 1301, color: '#fff' }} // Make sure the backdrop is visible
              >
                <CircularProgress color="inherit" />
                <p>Please wait...</p>
              </Backdrop>
            )}

      </Box>
        {/* Render circular progress indicator while loading */}
          {isLoading && (
              <Backdrop
                open={isLoading}
                style={{ zIndex: 1301, color: '#fff' }} // Make sure the backdrop is visible
              >
                <CircularProgress color="inherit" />
                <p>Please wait...</p>
              </Backdrop>
            )}

          {/* Render Circular Progress while Loading */}
          {isLoading && (
            <Backdrop
              open={isLoading}
              style={{ zIndex: 1301, color: "#fff" }} // Make sure the backdrop is visible
            >
              <CircularProgress color="inherit" />
              <p>Please wait...</p>
            </Backdrop>
          )}
          <ConfirmationModal
            isOpen={isModalOpen}
            closeModal={isModalOpen}
            handleSubmit={handleSubmit}
          />

          <SuccessModal isOpen={isSuccessModalOpen} onClose={closeSuccessModal} />

      {/* ComplianceModal */}
      <ComplianceModal open={openCompliance} onClose={handleCloseCompliance} />
      {/* Menu icon for mobile view */}
      <IconButton
        onClick={toggleDrawer(true)}
        sx={{
          display: { xs: "block", sm: "none" },
          position: "fixed",
          top: "1rem",
          left: "1rem",
          zIndex: 1000,
        }}
      >
        <MenuIcon />
      </IconButton>

      {/* Drawer for mobile stepper */}
      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={toggleDrawer(false)}
      >
        <Box
          sx={{
            width: 250,
            padding: "2rem",
          }}
        >
          <Stepper activeStep={step} orientation="vertical">
            {steps.map((label, index) => (
              <Step key={index}>
                <StepButton onClick={() => setStep(index)}>
                  <StepLabel>{label}</StepLabel>
                </StepButton>
              </Step>
            ))}
          </Stepper>
        </Box>
      </Drawer>
    </Box>
   </Box>
  );
};

