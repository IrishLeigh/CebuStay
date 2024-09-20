  {/* Gallery Photo Dialog */}
        <Dialog open={openGalleryPhotoDialog} onClose={handleClose} maxWidth="lg" fullWidth>
  <DialogTitle>
    Gallery Photo
    <IconButton
      edge="end"
      color="inherit"
      onClick={handleClose}
      sx={{ position: 'absolute', right: 8, top: 8 }}
    >
      <CloseIcon />
    </IconButton>
  </DialogTitle>
  <DialogContent
    sx={{
      padding: '1rem 2rem', // Top/Bottom 1rem, Left/Right 2rem
    }}
  >
    <Box
      sx={{
        display: 'flex',
        height: '500px',
        overflowX: 'hidden',  // Hides horizontal scrollbar
        overflowY: 'auto',    // Allows vertical scrolling if needed
      }}
    >
      <Box sx={{ flex: '1 1 60%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <img
          src={galleryPhotos[selectedImageIndex]?.src}
          alt={`Selected Gallery Photo`}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            borderRadius: '8px',
          }}
        />
      </Box>
      <Box sx={{ flex: '1 1 40%', padding: '16px', display: 'flex', flexDirection: 'column', justifyContent: 'flex-start' }}>
        {isEditingCaption ? (
          <>
            <TextField
              autoFocus
              margin="dense"
              label="Caption"
              type="text"
              fullWidth
              value={editedCaption}
              onChange={handleCaptionChange}
              variant="outlined"
            />
            <Box sx={{ display: 'flex', gap: '8px', marginTop: '16px' }}>
              <Button
                onClick={() => handleSaveCaption(galleryPhotos[selectedImageIndex], false)}
                color="primary"
                variant="contained"
                startIcon={<SaveIcon />}
                sx={{ backgroundColor: '#4caf50', color: '#fff' }}
              >
                Save
              </Button>
              <Button
                onClick={() => setIsEditingCaption(false)}
                color="error"
                variant="contained"
                startIcon={<CancelIcon />}
                sx={{ backgroundColor: '#f44336', color: '#fff' }}
              >
                Cancel
              </Button>
            </Box>
          </>
        ) : (
          <>
            <Typography variant="body1" paragraph>
              {galleryPhotos[selectedImageIndex]?.caption || "No caption available"}
            </Typography>
            <Box sx={{ display: 'flex', gap: '8px', marginTop: '16px' }}>
              <Button
                onClick={() => setIsEditingCaption(true)}
                variant="outlined"
                color="primary"
                startIcon={<EditIcon />}
                sx={{ backgroundColor: '#1976d2', color: '#fff' }}
              >
                Edit Caption
              </Button>
              <Button
                onClick={handleDeleteImage}
                variant="outlined"
                color="error"
                startIcon={<DeleteIcon />}
                sx={{ backgroundColor: '#f44336', color: '#fff' }}
              >
                Delete Photo
              </Button>
            </Box>
          </>
        )}
      </Box>
    </Box>
  </DialogContent>
  <DialogActions sx={{ display: "flex", justifyContent: "space-between", padding: '1rem 2rem' }}>
    <Button
      onClick={handlePrev}
      variant="contained"
      startIcon={<ArrowBackIcon />}
      sx={{ backgroundColor: '#1976d2', color: '#fff' }}
    >
      Previous
    </Button>
    <Button
      onClick={handleNext}
      variant="contained"
      endIcon={<ArrowForwardIcon />}
      sx={{ backgroundColor: '#1976d2', color: '#fff' }}
    >
      Next
    </Button>
  </DialogActions>
</Dialog>