import * as React from 'react';
import { useState, useEffect } from 'react';
import { createTheme, ThemeProvider, styled } from '@mui/material/styles';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import EditIcon from '@mui/icons-material/Edit';
import CancelIcon from '@mui/icons-material/Cancel';
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

function TemplateFrameNoEdit({ onEditChange, onSave, hasChanges }) {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);

  // useEffect(() => {
  //   if (saved) {
  //     setIsEditing(false);
  //     onEditChange(false);
  //   }
  // }, [saved, onEditChange]);

  const handleBackToHome = () => {
    navigate('/admin/listings');
  };

  const toggleEdit = () => {
    setIsEditing((prev) => {
      const newEditingState = !prev;
      onEditChange(newEditingState);
      return newEditingState;
    });
  };

  const handleSaveChanges = () => {
    if (onSave) {
      onSave();
      setIsEditing (false);
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

          {/* <div>
            <Button
              variant="contained"
              size="small"
              startIcon={isEditing ? <CancelIcon /> : <EditIcon />}
              onClick={toggleEdit}
              sx={{
                fontWeight: 'bold',
                backgroundColor: isEditing ? '#164BDD' : '#A334CF',
                '&:hover': {
                  backgroundColor: isEditing ? '#A334CF' : '#A334CF',
                },
              }}
            >
              {isEditing ? 'Cancel Edit' : 'Edit'}
            </Button>
            {isEditing && (
              <Button
                variant="contained"
                size="small"
                onClick={handleSaveChanges}
                disabled={!hasChanges} // Disable if no changes have been made
                sx={{
                  fontWeight: 'bold',
                  backgroundColor: hasChanges ? '#4CAF50' : '#fffff', // Change color based on hasChanges
                  '&:hover': {
                    backgroundColor: hasChanges ? '#45A049' : '#fffff', // Adjust hover effect
                  },
                  ml: 2,
                }}
              >
                Save Changes
              </Button>
            )}
          </div> */}
        </Toolbar>
      </StyledAppBar>
    </ThemeProvider>
  );
}

export default TemplateFrameNoEdit;
