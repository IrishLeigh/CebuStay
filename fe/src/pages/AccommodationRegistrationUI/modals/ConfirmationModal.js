import React from "react";
import { Modal, Button, Typography, Box } from "@mui/material";

const ConfirmationModal = ({ isOpen, closeModal, handleSubmit }) => {
  return (
    <Modal open={isOpen} onClose={closeModal} aria-labelledby="confirmation-modal-title">
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
        <Typography id="confirmation-modal-title" variant="h5" align="center" gutterBottom>
          Confirm Submission
        </Typography>
        <Typography variant="body1" align="center" gutterBottom>
          Are you sure you want to submit the form?
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
          <Button 
            variant="contained" 
            color="primary" 
            onClick={handleSubmit} 
            sx={{ mr: 2 }}
          >
            Yes, Submit
          </Button>
          <Button 
            variant="outlined" 
            color="secondary" 
            onClick={closeModal}
            sx={{backgroundColor: '#6A6A6A', color: '#fff'}}
          >
            Cancel
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default ConfirmationModal;
