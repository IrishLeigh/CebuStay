import React from "react";
import { Modal, Button, Typography, Box } from "@mui/material";

const ErrorModal = ({ isOpen, onClose, onRetry }) => {
  return (
    <Modal open={isOpen} onClose={onClose} aria-labelledby="error-modal-title">
      <Box 
        sx={{ 
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          bgcolor: 'background.paper',
          boxShadow: 24,
          p: 4,
          borderRadius: 2,
          maxWidth: 400,
          width: '100%',
        }}
      >
        <Typography id="error-modal-title" variant="h5" align="center" gutterBottom>
          Submission Error
        </Typography>
        <Typography variant="body1" align="center" gutterBottom>
          There was an error submitting your property listing. Please try again.
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
          <Button 
            variant="contained" 
            color="primary" 
            onClick={onRetry} // Button to redo listing your property
            sx={{ marginRight: 2 }} // Add spacing between buttons
          >
            Retry Listing
          </Button>
          <Button 
            variant="outlined" 
            color="secondary" 
            onClick={onClose}
          >
            Close
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default ErrorModal;
