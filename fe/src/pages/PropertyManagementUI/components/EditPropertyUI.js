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
import CloseIcon from '@mui/icons-material/Close';
import axios from 'axios';

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
      {value === index && <Box sx={{ pl: 5, pb: 5, pr: 5 }}>{children}</Box>}
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

export default function EditPropertyUI({ apiData, editItemId, onClose, onSave }) {
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
  const [rooms, setRooms] = useState({});
  const [updatedRooms, setUpdatedRooms] = useState({
    guest_capacity: 10,
    unitrooms: [],
    unitbeds: []
  });
  const [updatedPolicy, setUpdatedPolicy] = useState({});
  const [updatedHouseRules, setUpdatedHouseRules] = useState({});
  const [updatedUnitPricing, setUpdatedUnitPricing] = useState({});

  useEffect(() => {
    if (!editItemId) return;

    const fetchPropertyData = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/api/getproperty', {
          params: { propertyid: editItemId },
        });
        const data = response.data;
        console.log('Property data FROM API:', data);

        setPropertyData(data.property_details);
        setPropertyAddress(data.property_address);
        setAmenities(data.property_amenities.map(a => a.amenity_name.toLowerCase().replace(/\s+/g, '')));
        setFacilities(data.property_facilities.map(f => f.facilities_name.toLowerCase().replace(/\s+/g, '')));
        setServices(data.property_services.map(s => s.service_name.toLowerCase().replace(/\s+/g, '')));
        setHouseRules(data.property_houserules[0]);
        setPolicies(data.property_bookingpolicy);
        setUnitPricing(data.property_unitpricing);
        setPaymentData(data.payment_method);
        setRooms(data.property_unitrooms);
      } catch (error) {
        console.error('Error fetching property data:', error);
      }
    };

    fetchPropertyData();
  }, [editItemId]);

  const handleAmenitiesChange = (newAmenities, newFacilities, newServices) => {
    setAmenities(newAmenities);
    setFacilities(newFacilities);
    setServices(newServices);
  };

  const handleBasicInfoChange = (updatedData) => {
    setPropertyData(prevData => ({
      ...prevData,
      property_name: updatedData.propertyName,
      property_type: updatedData.propertyType,
      property_desc: updatedData.description,
      property_directions: updatedData.directions,
      unit_type: updatedData.unitType,
    }));
    setPropertyAddress(prevAddress => ({
      ...prevAddress,
      address: updatedData.street,
      zipcode: updatedData.postalCode,
    }));
  };

  const handleHouseRulesChange = (newHouseRules) => {
    setUpdatedHouseRules(newHouseRules);
  };

  const handlePoliciesChange = (newPolicies) => {
    setUpdatedPolicy(newPolicies);
  };

  const handleUnitPricingChange = (newPricing) => {
    setUpdatedUnitPricing(newPricing);
  };

  const handlePaymentDataChange = (newPaymentData) => {
    setPaymentData(newPaymentData);
  };

  const handleRoomDetailsChange = (updatedData) => {
    setUpdatedRooms((prevData) => ({
      ...prevData,
      ...updatedData
    }));
  };

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    // Implement save logic
    console.log('Property Data:', propertyData);
    console.log('Property Address:', propertyAddress);
    console.log('Amenities:', amenities);
    console.log('Facilities:', facilities);
    console.log('Services:', services);
    console.log('House Rules:', updatedHouseRules);
    console.log('Policies:', updatedPolicy);
    console.log('Unit Pricing:', updatedUnitPricing);
    console.log('Payment Data:', paymentData);
    console.log('Rooms:', updatedRooms);
    alert('Property saved successfully!');
    setIsEditing(false);
    onClose();
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  const handleClose = () => {
    setOpen(false);
    onClose();
  };
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
          onClick={onClose}
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
              propertyData={propertyData}
              propertyAddress={propertyAddress}
              onBasicInfoChange={handleBasicInfoChange}
            />
          </CustomTabPanel>
          <CustomTabPanel value={value} index={1}>
          <RoomDetails
              isEditing={isEditing}
              propertyData={rooms}
              onRoomDetailsChange ={handleRoomDetailsChange}
            />
          </CustomTabPanel>
          <CustomTabPanel value={value} index={2}>
            <Photos isEditing={isEditing}  />
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

EditPropertyUI.propTypes = {
  apiData: PropTypes.object,
  editItemId: PropTypes.number.isRequired,
  onClose: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
};
