import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import { Paper } from '@mui/material';
import BasicInfo from './BasicInfo';
import { Button } from 'react-bootstrap';
import RoomDetails from './RoomDetails';
import Photos from './Photos';

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

  return (
    <div style={{ width: '90vw', height: '100vh', padding: '2rem' }}>
      <Paper sx={{borderRadius: '0.8rem', height: 'auto',margin: '3rem'}} className="edit-property-cntr">
        <div className="tabs-cntr">
          <Box sx={{ padding: '2rem' }}>
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
              <Button onClick={handleEdit}>Edit</Button>
              <Button onClick={handleSave}>Save</Button>
              <Button onClick={handleCancel}>Cancel</Button>
            </Tabs>
          </Box>
          <CustomTabPanel value={value} index={0}>
            <BasicInfo isEditing={isEditing} />
          </CustomTabPanel>
          <CustomTabPanel value={value} index={1}>
            <RoomDetails isEditing={isEditing}/>
          </CustomTabPanel>
          <CustomTabPanel value={value} index={2}>
            <Photos isEditing={isEditing}/>
          </CustomTabPanel>
        </div>
      </Paper>
    </div>
  );
}
