import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import BasicInfo from './BasicInfo';
import { Paper, Modal, Button } from '@mui/material';
import RoomDetails from './RoomDetails';
import Photos from './Photos';
import Amenities from './Amenities';
import RulesPolicies from './RulesPolicies';
import PricePayment from './PricePayment';
import CloseIcon from '@mui/icons-material/Close'; // Import the close icon

// Mock API data
const apiData = {
  "property_details": {
      "propertyid": 116,
      "property_name": "GardenLudi",
      "property_desc": "Nestled in the heart of the city, Convenience for both short-term and long-term stays.",
      "property_type": "Home",
      "property_directions": "Easily accessible by public transportation, it's just a 10-minute walk from the central train station.",
      "unit_type": "Private Room"
  },
  "property_address": {
      "address": "El Casa De Balatero",
      "zipcode": "6001",
      "latitude": "10.3779479",
      "longitude": "123.9584698"
  },
  "property_unitpricing": {
      "min_price": 9000
  },
  "property_unitrooms": {
      "unitid": 96,
      "guest_capacity": 2,
      "unitrooms": [
          {
              "unitroomid": 361,
              "roomname": "Bedroom",
              "quantity": 1
          },
          {
              "unitroomid": 362,
              "roomname": "Bathroom",
              "quantity": 1
          },
          {
              "unitroomid": 363,
              "roomname": "Living Room",
              "quantity": 1
          },
          {
              "unitroomid": 364,
              "roomname": "Kitchen",
              "quantity": 1
          }
      ],
      "unitbeds": [
          {
              "bedroomnum": "1",
              "beds": {
                  "largebed": 1
              }
          }
      ]
  },
  "property_amenities": [
      {
          "amenityid": 86,
          "amenity_name": "Air Conditioning"
      },
      {
          "amenityid": 87,
          "amenity_name": "Wi-Fi"
      },
      {
          "amenityid": 88,
          "amenity_name": "Television"
      }
  ],
  "property_facilities": [
      {
          "facilitiesid": 67,
          "facilities_name": "Parking"
      }
  ],
  "property_services": [
      {
          "serviceid": 71,
          "service_name": "Breakfast"
      },
      {
          "serviceid": 72,
          "service_name": "Laundry"
      },
      {
          "serviceid": 73,
          "service_name": "Pet Friendly"
      }
  ],
  "property_houserules": [
      {
          "houserulesid": 38,
          "smoking_allowed": 1,
          "pets_allowed": 1,
          "parties_events_allowed": null,
          "noise_restrictions": null,
          "quiet_hours_start": "22:00:00",
          "quiet_hours_end": "07:00:00",
          "custom_rules": "Please respect the quiet hours between 10 PM and 7 AM to ensure a peaceful environment for all residents.",
          "check_in_from": "12:00:00",
          "check_in_until": "14:00:00",
          "check_out_from": "12:00:00",
          "check_out_until": "14:00:00"
      }
  ],
  "property_bookingpolicy": {
      "bookingpolicyid": 33,
      "is_cancel_plan": 0,
      "cancel_days": null,
      "non_refundable": 1,
      "modification_plan": 0,
      "offer_discount": 0
  },
  "property_owner": {
      "property_ownership": {
          "propertyownershipid": 11,
          "propertyid": 116,
          "ownershiptype": "Individual",
          "created_at": "2024-07-04 12:22:22",
          "updated_at": "2024-07-04 12:22:22"
      },
      "property_owner": {
          "propertyownerid": 4,
          "propertyownershipid": 11,
          "firstname": "Ludivico",
          "lastname": "Balatero",
          "displayname": "Ludivico Balatero",
          "dateofbirth": "2000-09-11",
          "contactnumber": "09954717500",
          "email": "misternonoy11@gmail.com",
          "province": "Cebu",
          "city": "Consolacion",
          "primary_address": "Alfa Compound Poblacion Occidental",
          "zipcode": "6001",
          "describe": "As your host, I am dedicated to ensuring you have a comfortable and memorable stay, and I am always available to assist with any needs or questions you may have.",
          "calendar": "https://chatgpt.com/c/854f5488-cf2d-44ab-b22e-bc74328d068e",
          "created_at": "2024-07-04 12:22:23",
          "updated_at": "2024-07-04 12:22:23"
      }
  },
  "payment_method": {
      "isonline": 1,
      "paymentmethod": "Gcash"
  }
}

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
      {value === index && <Box sx={{ pl: 5 , pb: 5, pr: 5}}>{children}</Box>}
    </div>
  );
}

CustomTabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

export default function EditPropertyUI() {
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
  const [open, setOpen] = useState(true);

  useEffect(() => {
    // Fetch data from API and set the state
    setPropertyData(apiData);
    if (apiData.property_amenities) setAmenities(apiData.property_amenities.map(a => a.amenity_name.toLowerCase().replace(/\s+/g, '')));
    if (apiData.property_facilities) setFacilities(apiData.property_facilities.map(f => f.facilities_name.toLowerCase().replace(/\s+/g, '')));
    if (apiData.property_services) setServices(apiData.property_services.map(s => s.service_name.toLowerCase().replace(/\s+/g, '')));
    if (apiData.property_houserules) setHouseRules(apiData.property_houserules[0]);
    if (apiData.property_bookingpolicy) setPolicies(apiData.property_bookingpolicy);
    if (apiData.property_address) setPropertyAddress(apiData.property_address[0]);
    if (apiData.property_owner) setPaymentData(apiData.property_owner.property_owner);
    if (apiData.payment_method) setPaymentData(apiData.payment_method);
    if (apiData.property_unitpricing) setUnitPricing(apiData.property_unitpricing);
  }, []);

  //callback functions
  const handleAmenitiesChange = (newAmenities, newFacilities, newServices) => {
    setAmenities(newAmenities);
    setFacilities(newFacilities);
    setServices(newServices);
  };

  const handleBasicInfoChange = (updatedData) => {
    setPropertyData(prevData => ({ ...prevData, ...updatedData }));
    setPropertyAddress(prevAddress => ({
      ...prevAddress,
      address: updatedData.street,
      zipcode: updatedData.postalCode,
    }));
  };
  const handleHouseRulesChange = (newHouseRules) => {
    console.log('House Rules Changed:', newHouseRules);
    setHouseRules(newHouseRules);
  };
  
  const handlePoliciesChange = (newPolicies) => {
    console.log('Policies Changed:', newPolicies);
    setPolicies(newPolicies);
  };
  const handleUnitPricingChange = (newPricing) => {
    setUnitPricing(newPricing);
  };

  const handlePaymentDataChange = (newPaymentData) => {
    setPaymentData(newPaymentData);
  };
  

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    // Add save logic here
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  if (!propertyData) {
    return <div>Loading...</div>;
  }
  const handleClose = () => {
    setOpen(false);
  };

  console.log("Payment Data: ", paymentData);
  console.log("Unit Pricing Data from API: ", unitPricing);

  return (
    <Modal
    open={open}
    onClose={handleClose}
    sx={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      overflow: 'auto'
    }}
  >
    <Paper
      sx={{
        width: '80vw',
        height: '80vh',
        borderRadius: '0.8rem',
        overflowY: 'auto',
        position: 'relative',
        padding: '2rem'
      }}
    >
      <Button
        onClick={handleClose}
        sx={{
          position: 'absolute',
          top: '0.5rem',
          right: '0.5rem',
          zIndex: 1200
        }}
      >
        <CloseIcon />
      </Button>
      <div className="tabs-cntr" style={{ height: '100%' }}>
        <Box sx={{ padding: '2rem' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
            <Box>
              <Button onClick={handleEdit}>Edit</Button>
              <Button onClick={handleSave}>Save</Button>
              <Button onClick={handleCancel}>Cancel</Button>
            </Box>
          </Box>
          <Tabs
            value={value}
            onChange={handleChange}
            aria-label="basic tabs example"
            TabIndicatorProps={{
              style: {
                backgroundColor: '#A334CF',
              },
            }}
            sx={{
              '& .MuiTab-root': {
                '&.Mui-selected': {
                  color: '#A334CF',
                  fontFamily: 'Poppins',
                  fontWeight: 'bold',
                },
              },
            }}
          >
            <Tab label="Basic Info" {...a11yProps(0)} />
            <Tab label="Room & Details" {...a11yProps(1)} />
            <Tab label="Photos" {...a11yProps(2)} />
            <Tab label="Amenities" {...a11yProps(3)} />
            <Tab label="Rules" {...a11yProps(4)} />
            <Tab label="Pricing & Methods" {...a11yProps(5)} />
          </Tabs>
        </Box>
        <CustomTabPanel value={value} index={0}>
          <BasicInfo
            isEditing={isEditing}
            propertyData={propertyData.property_details}
            propertyAddress={propertyData.property_address}
            onBasicInfoChange={handleBasicInfoChange}
          />
        </CustomTabPanel>
        <CustomTabPanel value={value} index={1}>
          <RoomDetails isEditing={isEditing} propertyData={propertyData.property_unitrooms} />
        </CustomTabPanel>
        <CustomTabPanel value={value} index={2}>
          <Photos isEditing={isEditing} propertyData={propertyData.property_unitrooms} />
        </CustomTabPanel>
        <CustomTabPanel value={value} index={3}>
          <Amenities
            isEditing={isEditing}
            parentAmenities={amenities}
            parentFacilities={facilities}
            parentServices={services}
            onAmenitiesChange={handleAmenitiesChange}
          />
        </CustomTabPanel>
        <CustomTabPanel value={value} index={4}>
          <RulesPolicies
            isEditing={isEditing}
            parentHouseRulesData={houseRules}
            parentPoliciesData={policies}
            onHouseRulesChange={handleHouseRulesChange}
            onPoliciesChange={handlePoliciesChange}
          />
        </CustomTabPanel>
        <CustomTabPanel value={value} index={5}>
          <PricePayment
            isEditing={isEditing}
            onUnitPricingChange={handleUnitPricingChange}
            parentUnitPricing={unitPricing}
            onPaymentDataChange={handlePaymentDataChange}
            parentPaymentData={paymentData}
          />
        </CustomTabPanel>
      </div>
    </Paper>
  </Modal>
);
}