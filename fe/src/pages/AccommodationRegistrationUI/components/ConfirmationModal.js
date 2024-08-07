import React from "react";
import { Modal, Button, Typography, Box } from "@mui/material";

const ConfirmationModal = ({ isOpen, closeModal, handleSubmit, onConfirm }) => {
  return (
    <Modal open={isOpen} onClose={closeModal}>
      <Box sx={{ 
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        bgcolor: 'background.paper',
        boxShadow: 24,
        p: 4,
        maxWidth: 400,
        width: '100%'
      }}>
        <Typography variant="h5" align="center" gutterBottom>
          Confirm Submission
        </Typography>
        <Typography variant="body1" align="center" gutterBottom>
          Are you sure you want to submit the form?
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
          <Button variant="contained" color="primary" onClick={handleSubmit}>
            Yes, Submit
          </Button>
          <Box sx={{ mx: 1 }} />
          <Button variant="contained" onClick={closeModal}>
            Cancel
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default ConfirmationModal;
