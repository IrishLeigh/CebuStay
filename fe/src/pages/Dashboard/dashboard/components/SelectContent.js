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
  console.log('property', property);

  useEffect(() => {
    if (property) {
      setLoading(false);
    } else {
      setLoading(true);
    }
  }, [property]);

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
              <Avatar alt={prop.property_name} src={prop.ownership_logo}>
                <img src={prop.ownership_logo} alt="Ownership Logo" />
                <DevicesRoundedIcon sx={{ fontSize: '1rem' }} />
              </Avatar>
            </ListItemAvatar>
            <ListItemText primary={prop.property_name} secondary={prop.property_type} />
          </MenuItem>
        ))
      ) : (
        <MenuItem disabled>No properties available</MenuItem>
      )}
      <Divider sx={{ mx: -1 }} />
      <MenuItem value="add-product">
        <ListItemIcon>
          <AddRoundedIcon />
        </ListItemIcon>
        <ListItemText primary="Add product" secondary="Web app" />
      </MenuItem>
    </Select>
  );
}