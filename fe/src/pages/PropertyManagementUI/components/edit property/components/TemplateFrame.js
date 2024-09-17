import * as React from 'react';
import { useState, useEffect } from 'react';
import { createTheme, ThemeProvider, styled } from '@mui/material/styles';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import EditIcon from '@mui/icons-material/Edit'; // Import Edit icon
import CancelIcon from '@mui/icons-material/Cancel'; // Import Cancel icon
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded';
import getDashboardTheme from '../../../../Dashboard/dashboard/theme/getDashboardTheme';
import { useNavigate } from 'react-router-dom';
import { Typography } from '@mui/material';

const StyledAppBar = styled(AppBar)(({ theme }) => ({
  position: 'relative',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  flexShrink: 0,
  borderBottom: '1px solid',
  borderColor: theme.palette.divider,
  backgroundColor: theme.palette.background.paper,
  boxShadow: 'none',
  backgroundImage: 'none',
  zIndex: theme.zIndex.drawer + 1,
  flex: '0 0 auto',
}));

function TemplateFrameEdit({ onEditChange, saved, onSave }) {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false); // State to track editing mode

  useEffect(() => {
    // Reset isEditing to false when changes are saved
    if (saved) {
      setIsEditing(false);
      onEditChange(false); // Notify the parent of the new editing state
    }
  }, [saved, onEditChange]);

  const handleBackToHome = () => {
    navigate('/admin/listings');
  };

  const toggleEdit = () => {
    setIsEditing((prev) => {
      const newEditingState = !prev;
      onEditChange(newEditingState); // Notify the parent of the new editing state
      return newEditingState;
    });
  };

  const handleSaveChanges = () => {
    // alert("Save Changes button clicked!");
    if (onSave) {
      onSave(); // Call the parent component's save function
    }
  };

  const dashboardTheme = createTheme(getDashboardTheme('light'));

  return (
    <ThemeProvider theme={dashboardTheme}>
      <StyledAppBar>
        <Toolbar
          variant="dense"
          disableGutters
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            width: '100%',
            p: '8px 12px',
            pl: '3rem',
            pr: '3rem',
          }}
        >
          <Button
            variant="text"
            size="small"
            aria-label="Back to home"
            startIcon={<ArrowBackRoundedIcon />}
            onClick={handleBackToHome}
            sx={{ display: { xs: 'none', sm: 'flex' } }}
          >
            Property Management / Edit Property
          </Button>

          <Typography>{isEditing ? 'Edit Form' : 'View Form'}</Typography>

          <IconButton
            size="small"
            aria-label="Back to home"
            onClick={handleBackToHome}
            sx={{ display: { xs: 'auto', sm: 'none' } }}
          >
            <ArrowBackRoundedIcon />
          </IconButton>

          <div>
            <Button
              variant="contained" // Emphasized button
              size="small"
              startIcon={isEditing ? <CancelIcon /> : <EditIcon />} // Toggle icon
              onClick={toggleEdit} // Toggle editing mode on click
              sx={{
                fontWeight: 'bold',
                backgroundColor: isEditing ? '#164BDD' : '#A334CF', // Change colors
                '&:hover': {
                  backgroundColor: isEditing ? '#A334CF' : '#A334CF', // Adjust hover effect
                },
              }}
            >
              {isEditing ? 'Cancel Edit' : 'Edit'} {/* Toggle text */}
            </Button>
            {isEditing && (
              <Button
                variant="contained" // Emphasized button
                size="small"
                onClick={handleSaveChanges} // Handle save action
                sx={{
                  fontWeight: 'bold',
                  backgroundColor: '#4CAF50', // Save changes color
                  '&:hover': {
                    backgroundColor: '#45A049', // Adjust hover effect
                  },
                  ml: 2, // Add margin left
                }}
              >
                Save Changes
              </Button>
            )}
          </div>
        </Toolbar>
      </StyledAppBar>
    </ThemeProvider>
  );
}

export default TemplateFrameEdit;
