import React from "react";
import "../css/AccountID.css";
import { Divider, TextField, InputAdornment, Paper } from "@mui/material";
import AccountCircle from '@mui/icons-material/PermIdentity';

export default function AccountID() {
  return (
    <Paper className="account-cntr" sx={{borderRadius:'12px'}}>
      <div className="account-id-cntr">
        <div className="account-id-title">Cebustay ID</div>
        <div className="account-id-desc"> 
          Your unique Cebustay ID is used to help others find and identify you on our booking platform. It is displayed in your bookings and profile information.
        </div>
      </div>

      <Divider orientation="vertical" sx={{padding:'2rem'}} />

      {/* First name and last name here */}
      <div className="account-id-cntr">
        <TextField
            required
            id="outlined-required"
            label="First Name"
            sx={{ 
              '& .MuiOutlinedInput-root': {
                borderRadius: '8px',
                
              },
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start" sx={{ marginRight: '1rem' }}>
                  {/* Change Icon Here */}
                  <AccountCircle /> 
                </InputAdornment>
              ),
            }}
          />

        <TextField
          required
          id="outlined-required"
          label="Last Name"
          sx={{ 
            '& .MuiOutlinedInput-root': {
              borderRadius: '8px',
              
            },
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start" sx={{marginRight:'1rem'}}>
                {/* Change Icon Here */}
                <AccountCircle />
              </InputAdornment>
            ),
          }}
        />
        <div className="account-btn-cntr">
          <button className="save-btn">Save</button>
          <button className="cancel-btn">Cancel</button>
        </div>
      </div>
    </Paper>
  );
}
