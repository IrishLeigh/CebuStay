// src/components/ImagePreviewModal.js
import React from "react";
import { Modal, Button, Box } from "@mui/material";
import "../css/ImagePreviewModal.css"; // Add your CSS for styling

const ImagePreviewModal = ({ open, onClose, image, onConfirm }) => {
  return (
    <Modal open={open} onClose={onClose} style={{ zIndex: 1200 }}>
      <Box className="modal-content">
        <img src={image} alt="Preview" className="modal-image" />
        <Box className="modal-buttons">
          <Button variant="contained" color="primary" onClick={onConfirm}>
            Save
          </Button>
          <Button variant="outlined" color="secondary" onClick={onClose}>
            Cancel
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default ImagePreviewModal;
