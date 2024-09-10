import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import BasicInfo from "./BasicInfo";
import RoomDetails from "./RoomDetailsSingleUnit";
import Photos from "./Photos";
import Amenities from "./Amenities";
import RulesPolicies from "./RulesPolicies";
import PricePayment from "./PricePayment";
import Button from "@mui/material/Button";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import {
  Info as InfoIcon,
  BedroomParent as BedroomIcon,
  PhotoLibrary as PhotoIcon,
  EmojiEvents as AmenitiesIcon,
  AttachMoney as PricingIcon,
} from "@mui/icons-material";
import GavelIcon from "@mui/icons-material/Gavel";
import EditPartnerVerification from "./EditPartnerVerification";
import VerifiedIcon from "@mui/icons-material/Verified";
import RoomDetailsSingleUnit from "./RoomDetailsSingleUnit";
import EditRoomDetailsMultipleUnit from "./EditRoomDetailsMultipleUnit";

function CustomTabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <div>{children}</div>}
    </div>
  );
}

CustomTabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

export default function EditPropertyUI({ apiData, onClose, onSave }) {
  const [coverImg, setCoverImg] = useState([]);
  const [galleryImg, setGalleryImg] = useState([]);
  const [value, setValue] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [propertyData, setPropertyData] = useState(null);
  const [propertyAddress, setPropertyAddress] = useState(null);
  const [amenities, setAmenities] = useState([]);
  const [facilities, setFacilities] = useState([]);
  const [services, setServices] = useState([]);
  const [houseRules, setHouseRules] = useState({});
  const [policies, setPolicies] = useState({});
  const [unitPricing, setUnitPricing] = useState({});
  const [paymentData, setPaymentData] = useState({
    selectedPayment: "",
    selectedPayout: "",
  });
  const [partnerData, setPartnerData] = useState({});
  const [rooms, setRooms] = useState({});
  const [data, setData] = useState({});
  const navigate = useNavigate();
  const { id } = useParams();
  const [isSingleUnit, setIsSingleUnit] = useState(false);

  useEffect(() => {
    if (!id) return;

    const fetchPropertyData = async () => {
      try {
        const response = await axios.get(
          "http://127.0.0.1:8000/api/getproperty",
          {
            params: { propertyid: id },
          }
        );
        const data = response.data;
        console.log("Property data FROM API:", data);
        console.log("Pricing:", data.property_unitdetails[0].unitpricing);
        console.log("Payment:", data.payment_method);
        setData(data);
        setPropertyData(data.property_details);
        setPropertyAddress(data.property_address);
        setAmenities(
          data.property_amenities.map((a) =>
            a.amenity_name.toLowerCase().replace(/\s+/g, "")
          )
        );
        setFacilities(
          data.property_facilities.map((f) =>
            f.facilities_name.toLowerCase().replace(/\s+/g, "")
          )
        );
        setServices(
          data.property_services.map((s) =>
            s.service_name.toLowerCase().replace(/\s+/g, "")
          )
        );
        setHouseRules(data.property_houserules[0]);
        setPolicies(data.property_bookingpolicy);
        setUnitPricing(data.property_unitdetails[0].unitpricing);
        setPaymentData(data.payment_method);
        setRooms(data.property_unitdetails);
        setPartnerData(data.property_owner);
        if (response.data) {
          const res_img = await axios.get(
            `http://127.0.0.1:8000/api/getfiles/${id}`
          );
          console.log(res_img.data.img);
          setCoverImg(res_img.data.img);

          const res_img2 = await axios.get(
            `http://127.0.0.1:8000/api/getfiles-gallery/${id}`
          );
          console.log("GALLERY", res_img2.data.img);
          setGalleryImg(res_img2.data.img);
        }
        // // Determine if the property is a single unit type
        const singleUnitTypes = ["Home", "Apartment", "Condominium"];
        setIsSingleUnit(
          singleUnitTypes.includes(data.property_details.property_type)
        );
      } catch (error) {
        console.error("Error fetching property data:", error);
      }
    };

    fetchPropertyData();
  }, [id]);

  const handleChange = (index) => {
    setValue(index);
  };
  // console.log("Property Data TYPE?: ", propertyData.property_type);

  return (
    <div style={{ height: "100vh", color: "#000", background: "#F4F7FA" }}>
      <div
        style={{
          background: "#15A1C6",
          padding: "1rem",
          display: "flex",
          alignItems: "center",
          color: "#FFF",
        }}
      >
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate(-1)}
          style={{
            color: "#FFF",
            borderColor: "#FFF",
            marginRight: "1rem",
            border: "1px solid #FFF",
          }}
        >
          Back
        </Button>
        <div
          style={{
            display: "flex",
            gap: "0.5rem",
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: "center",
            flexGrow: 1,
          }}
        >
          {[
            { label: "Basic Info", icon: <InfoIcon /> },
            { label: "Room & Details", icon: <BedroomIcon /> },
            { label: "Photos", icon: <PhotoIcon /> },
            { label: "Shared Amenities", icon: <AmenitiesIcon /> },
            { label: "Rules", icon: <GavelIcon /> },
            { label: "Pricing & Methods", icon: <PricingIcon /> },
            { label: "Partner Verification", icon: <VerifiedIcon /> },
          ].map((item, index) => (
            <div
              key={index}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                padding: "0.75rem 1.5rem",
                background: value === index ? "#16B4DD" : "transparent",
                color: value === index ? "#FFF" : "#DDD",
                border: "none",
                cursor: "pointer",
                fontWeight: value === index ? "bold" : "normal",
                transition: "background 0.3s, color 0.3s",
                borderRadius: "4px",
                textTransform: "uppercase",
              }}
              onClick={() => handleChange(index)}
            >
              <div style={{ fontSize: "1.5rem", marginBottom: "0.5rem" }}>
                {item.icon}
              </div>
              <div>{item.label}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ padding: "3rem 4rem", background: "#F4F7FA" }}>
        <CustomTabPanel value={value} index={0}>
          <BasicInfo
            propertyData={propertyData}
            propertyAddress={propertyAddress}
            onBasicInfoChange={(updatedData) => setPropertyData(updatedData)}
          />
        </CustomTabPanel>
        <CustomTabPanel value={value} index={1}>
          {isSingleUnit ? (
            <RoomDetailsSingleUnit
              isEditing={isEditing}
              propertyData={rooms}
              onRoomDetailsChange={(updatedData) => setRooms(updatedData)}
            />
          ) : (
            <EditRoomDetailsMultipleUnit parentRoomsAndBedsData={rooms} />
          )}
        </CustomTabPanel>

        <CustomTabPanel value={value} index={2}>
          <Photos
            isSingleUnit={isSingleUnit}
            propertyImages={coverImg}
            setCoverP={setCoverImg}
            setGalleryP={setGalleryImg}
            galleryImages={galleryImg}
            propertyid={id}
          />
        </CustomTabPanel>
        <CustomTabPanel value={value} index={3}>
          <Amenities
            propertyid={id}
            isEditing={isEditing}
            amenities={amenities}
            facilities={facilities}
            services={services}
            onAmenitiesChange={(newAmenities, newFacilities, newServices) => {
              setAmenities(newAmenities);
              setFacilities(newFacilities);
              setServices(newServices);
            }}
            isSingleUnit={isSingleUnit}
          />
        </CustomTabPanel>
        <CustomTabPanel value={value} index={4}>
          <RulesPolicies
            propertyid={id}
            isEditing={isEditing}
            policies={policies}
            houseRules={houseRules}
            onPoliciesChange={(updatedPolicies) => setPolicies(updatedPolicies)}
            onHouseRulesChange={(updatedHouseRules) =>
              setHouseRules(updatedHouseRules)
            }
          />
        </CustomTabPanel>
        <CustomTabPanel value={value} index={5}>
          <PricePayment
            propertyid={id}
            isEditing={isEditing}
            parentUnitPricing={unitPricing}
            parentPaymentData={paymentData}
            onPricingChange={(updatedPricing) => setUnitPricing(updatedPricing)}
            onPaymentChange={(updatedPayment) => setPaymentData(updatedPayment)}
            isSingleUnit={isSingleUnit}
          />
        </CustomTabPanel>
        <CustomTabPanel value={value} index={6}>
          <EditPartnerVerification parentPartnerData={partnerData} />
        </CustomTabPanel>
      </div>
    </div>
  );
}

EditPropertyUI.propTypes = {
  apiData: PropTypes.object,
  onClose: PropTypes.func,
  onSave: PropTypes.func,
};