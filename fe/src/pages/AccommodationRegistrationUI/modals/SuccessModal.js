import React from "react";
import { Modal, Button, Typography, Box } from "@mui/material";

const SuccessModal = ({ isOpen, onClose }) => {
  const role = localStorage.getItem("role"); // Get the user role from localStorage

  return (
    <Modal open={isOpen} onClose={onClose} aria-labelledby="success-modal-title">
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
        <Typography id="success-modal-title" variant="h5" align="center" gutterBottom>
          Successfully Registered!
        </Typography>
        <Typography variant="body1" align="center" gutterBottom>
          Your registration was successful. 
        </Typography>

        {role === "tourist" ? (
          <Typography variant="body2" align="center" sx={{ mt: 2, fontWeight: 'bold', color: 'primary.main' }}>
            To activate your new Manager role, please log out and then log back in.
          </Typography>
        ) : (
          <Typography variant="body2" align="center" sx={{ mt: 2, fontWeight: 'bold', color: 'primary.main' }}>
            You can edit your property in Property Management.
          </Typography>
        )}

        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
          <Button 
            variant="contained" 
            color="primary" 
            onClick={onClose}
          >
            Proceed to {role === "tourist" ? "Login" : "Admin"}
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default SuccessModal;
