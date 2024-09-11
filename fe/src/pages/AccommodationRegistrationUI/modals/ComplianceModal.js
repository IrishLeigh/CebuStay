// InfoModal.js
import React from 'react';
import { Modal, Box, Button, Typography, Divider, Icon } from '@mui/material';
import { styled } from '@mui/system';
import InfoIcon from '@mui/icons-material/Info'; // Import the icon you want to use

const ModalContent = styled(Box)(({ theme }) => ({
  width: '600px', // Wider modal
  maxWidth: '90%',
  backgroundColor: 'white',
  padding: '2rem',
  borderRadius: '8px',
  boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)',
  textAlign: 'left',
  fontFamily: 'Poppins',
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)', // Centering modal
}));

const ModalTitle = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  fontWeight: 600,
  marginBottom: '1rem',
  fontFamily: 'Poppins',
}));

const ModalTitleText = styled(Typography)(({ theme }) => ({
  marginLeft: '0.5rem',
}));

const ModalBody = styled(Typography)(({ theme }) => ({
  marginBottom: '1.5rem',
}));

const ComplianceModal = ({ open, onClose }) => {
  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="modal-title"
      aria-describedby="modal-description"
    >
      <ModalContent>
        <ModalTitle>
          <InfoIcon sx={{ color: '#16B4DD', fontSize: '1.5rem' }} />
          <ModalTitleText id="modal-title" variant="h6" component="h2">
            Important Information
          </ModalTitleText>
        </ModalTitle>
        <Divider />
        <ModalBody id="modal-description" variant="body1">
          <Typography paragraph>
            Please ensure that the following aspects of your listing are accurate and complete:
          </Typography>
          <Typography paragraph>
            1. All information provided, including addresses and descriptions, should be accurate and up-to-date.
          </Typography>
          <Typography paragraph>
            2. Ensure that all photos meet the required standards and are a true representation of the property.
          </Typography>
          <Typography paragraph>
            This will help in a smooth and efficient registration process.
          </Typography>
        </ModalBody>
        <Button
          variant="contained"
          onClick={onClose}
          sx={{ marginTop: '1rem', backgroundColor: '#16B4DD', color: 'white', fontFamily: 'Poppins', '&:hover': { backgroundColor: '#16B4DD' } }}
        >
          I Agree
        </Button>
      </ModalContent>
    </Modal>
  );
};

export default ComplianceModal;
