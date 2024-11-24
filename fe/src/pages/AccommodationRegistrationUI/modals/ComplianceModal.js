import React, { useState } from 'react';
import { Modal, Box, Button, Typography, Divider, Checkbox, FormControlLabel } from '@mui/material';
import { styled } from '@mui/system';
import InfoIcon from '@mui/icons-material/Info';

const ModalContent = styled(Box)(({ theme }) => ({
  width: '100%',
  maxWidth: '600px',
  backgroundColor: 'white',
  padding: '2rem',
  borderRadius: '8px',
  boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)',
  textAlign: 'left',
  fontFamily: 'Poppins',
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  overflowY: 'auto',
  maxHeight: '90vh',
  [theme.breakpoints.down('md')]: {
    padding: '1.5rem',
    maxWidth: '80%',
  },
  [theme.breakpoints.down('sm')]: {
    padding: '1rem',
    maxWidth: '90%',
  },
}));

const ModalTitle = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  fontWeight: 600,
  marginBottom: '1rem',
  fontFamily: 'Poppins',
  [theme.breakpoints.down('sm')]: {
    fontSize: '1rem',
  },
}));

const ModalTitleText = styled(Typography)(({ theme }) => ({
  marginLeft: '0.5rem',
  fontSize: '1.25rem',
  [theme.breakpoints.down('sm')]: {
    fontSize: '1rem',
  },
}));

const ModalBody = styled(Typography)(({ theme }) => ({
  marginBottom: '1.5rem',
  fontSize: '1rem',
  [theme.breakpoints.down('sm')]: {
    fontSize: '0.875rem',
  },
}));

const ComplianceModal = ({ open, onClose }) => {
  const [checked, setChecked] = useState(false);

  const handleCheckboxChange = (event) => {
    setChecked(event.target.checked);
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="modal-title"
      aria-describedby="modal-description"
      BackdropProps={{
        onClick: () => null, // Disable closing modal when clicking on the backdrop
      }}
    >
      <ModalContent>
        <ModalTitle>
          <InfoIcon sx={{ color: '#16B4DD', fontSize: '1.5rem' }} />
          <ModalTitleText id="modal-title" variant="h6" component="h2">
            Terms, Conditions, and Privacy Policy
          </ModalTitleText>
        </ModalTitle>
        <Divider />
        <ModalBody id="modal-description" variant="body1">
          <Typography paragraph>
            By using our platform, you agree to the following terms:
          </Typography>
          <Typography paragraph>
            1. All the information you provide, including property details, photos, and descriptions, must be accurate and up-to-date.
          </Typography>
          <Typography paragraph>
            2. The property must comply with local laws and regulations, including those related to safety and permits.
          </Typography>
          <Typography paragraph>
            3. You must ensure that the property is available as described, and any cancellations should be handled in accordance with our policy.
          </Typography>
          <Typography paragraph>
            4. We are committed to protecting your personal data. Any personal information you provide will be used solely for the purposes of this platform, in compliance with applicable data privacy laws. Your data will not be shared with third parties without your explicit consent, except as required by law.
          </Typography>
          <Typography paragraph>
            Please read these terms carefully. Failure to comply may result in the removal of your listing.
          </Typography>
        </ModalBody>

        <FormControlLabel
          control={<Checkbox checked={checked} onChange={handleCheckboxChange} />}
          label="I have read and agree to the terms, conditions, and privacy policy."
          sx={{ fontFamily: 'Poppins' }}
        />

        <Button
          variant="contained"
          onClick={onClose}
          disabled={!checked}
          sx={{ marginTop: '1rem', backgroundColor: '#16B4DD', color: 'white', fontFamily: 'Poppins', '&:hover': { backgroundColor: '#16B4DD' } }}
        >
          I Agree
        </Button>
      </ModalContent>
    </Modal>
  );
};

export default ComplianceModal;
