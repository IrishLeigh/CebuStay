import * as React from 'react';
import MuiAvatar from '@mui/material/Avatar';
import MuiListItemAvatar from '@mui/material/ListItemAvatar';
import MenuItem from '@mui/material/MenuItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListSubheader from '@mui/material/ListSubheader';
import Select, { selectClasses } from '@mui/material/Select';
import Divider from '@mui/material/Divider';
import { styled } from '@mui/material/styles';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import DevicesRoundedIcon from '@mui/icons-material/DevicesRounded';
import SmartphoneRoundedIcon from '@mui/icons-material/SmartphoneRounded';
import ConstructionRoundedIcon from '@mui/icons-material/ConstructionRounded';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';


const Avatar = styled(MuiAvatar)(({ theme }) => ({
  width: 28,
  height: 28,
  backgroundColor: theme.palette.background.paper,
  color: theme.palette.text.secondary,
  border: `1px solid ${theme.palette.divider}`,
}));

const ListItemAvatar = styled(MuiListItemAvatar)({
  minWidth: 0,
  marginRight: 12,
});

export default function SelectContent({ property, onPropertyChange }) {
  const [selectedProperty, setSelectedProperty] = React.useState('');
  const [loading, setLoading] = React.useState(true);
  const navigate = useNavigate();
  // console.log('property', property);

  useEffect(() => {
    if (property) {
      setLoading(false);
    } else {
      setLoading(true);
    }
  }, [property]);
  // Handle the "Add Property" click
  const handleAddPropertyClick = () => {
    navigate('/list-property'); // Navigate to the /admin route
  };
  const handleChange = (event) => {
    const propertyId = event.target.value;
    setSelectedProperty(propertyId);
    onPropertyChange(propertyId); // Call the parent's function with the selected property ID
  };
  console.log('selectedProperty', selectedProperty);

  return (
    <Select
      labelId="property-select"
      id="property-simple-select"
      value={selectedProperty}
      onChange={handleChange}
      displayEmpty
      inputProps={{ 'aria-label': 'Select property' }}
      fullWidth
      sx={{
        maxHeight: 56,
        width: 215,
        '&.MuiList-root': {
          p: '8px',
        },
        [`& .${selectClasses.select}`]: {
          display: 'flex',
          alignItems: 'center',
          gap: '2px',
          pl: 1,
        },
      }}
    >
      <MenuItem value="" disabled>
        Select Property
      </MenuItem>
      <ListSubheader sx={{ pt: 0 }}>Properties</ListSubheader>
      {property && property.data && property.data.length > 0 ? (
        property.data.map((prop) => (
          <MenuItem key={prop.propertyid} value={prop.propertyid}>
            <ListItemAvatar>
              <Avatar
                alt={prop.property_name}
                src={prop.ownership_logo || undefined} // Show ownership_logo if available
                sx={{
                  bgcolor: !prop.ownership_logo ? '#3f51b5' : 'transparent', // Background color for initials
                  color: !prop.ownership_logo ? '#fff' : 'inherit', // Text color for initials
                  fontSize: '1rem', // Font size for initials
                }}
              >
                {!prop.ownership_logo && prop.property_name.charAt(0).toUpperCase()}
              </Avatar>
            </ListItemAvatar>
            <ListItemText primary={prop.property_name} secondary={prop.property_type} />
          </MenuItem>
        ))
      ) : (
        <MenuItem disabled>No properties available</MenuItem>
      )}
      <Divider sx={{ mx: -1 }} />
      <MenuItem onClick={handleAddPropertyClick}> {/* Add onClick to navigate */}
        <ListItemIcon>
          <AddRoundedIcon />
        </ListItemIcon>
        <ListItemText primary="Add Property" secondary="Add Property" />
      </MenuItem>
    </Select>
  );
}