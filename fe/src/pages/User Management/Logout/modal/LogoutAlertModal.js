import React from 'react';
import { Modal, Box, Typography, Button } from '@mui/material';

const WarningModal = ({ open, onClose, onContinue, onLogout }) => {
  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
    borderRadius: 2,
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={style}>
        <Typography variant="h6" component="h2" gutterBottom>
          Session Expiration Warning
        </Typography>
        <Typography variant="body1" mb={2}>
          Your session is about to expire in less than 5 minutes. Please choose one of the following options:
        </Typography>
        <Button variant="contained" color="primary" onClick={onContinue} sx={{ mr: 1 }}>
          Continue
        </Button>
        <Button variant="outlined" color="secondary" onClick={onLogout}>
          Log Out
        </Button>
      </Box>
    </Modal>
  );
};

export default WarningModal;
