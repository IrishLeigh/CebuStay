import React, { useState } from "react";
import { Modal, Button, Box } from "@mui/material";
import Cropper from "react-easy-crop";
import "../css/ImagePreviewModal.css"; // Add your CSS for styling

const ImagePreviewModal = ({ open, onClose, image, onConfirm }) => {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  // Helper function to create an image element
  const createImage = (url) =>
    new Promise((resolve, reject) => {
      const img = new Image();
      img.src = url;
      img.crossOrigin = "anonymous";
      img.onload = () => resolve(img);
      img.onerror = (err) => reject(err);
    });

  // Helper function to crop the image and return it as a blob
  const getCroppedImage = async (imageSrc, cropPixels) => {
    const image = await createImage(imageSrc);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    canvas.width = cropPixels.width;
    canvas.height = cropPixels.height;

    ctx.drawImage(
      image,
      cropPixels.x,
      cropPixels.y,
      cropPixels.width,
      cropPixels.height,
      0,
      0,
      cropPixels.width,
      cropPixels.height
    );

    return new Promise((resolve) => {
      canvas.toBlob((blob) => {
        resolve(blob); // Return the cropped image as a Blob
      }, "image/jpeg");
    });
  };

  const handleCropComplete = (_, croppedArea) => {
    setCroppedAreaPixels(croppedArea);
  };

  const handleConfirm = async () => {
    if (croppedAreaPixels && image) {
      const croppedImage = await getCroppedImage(image, croppedAreaPixels);
      if (onConfirm) {
        onConfirm(croppedImage); // Pass the cropped image blob to the parent
      }
      onClose(); // Close the modal
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box className="modal-content">
        <Box className="crop-container">
          <Cropper
            image={image}
            crop={crop}
            zoom={zoom}
            aspect={1} // Square crop
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={handleCropComplete}
          />
        </Box>
        <Box className="modal-buttons">
          <Button variant="contained" color="primary" onClick={handleConfirm}>
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
