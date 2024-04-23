import React, { useState } from "react";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Checkbox from '@mui/material/Checkbox';
import TextField from '@mui/material/TextField';
import DynamicSelect from "../components/select";
import TextFieldOutlineShort from "../components/textfield_short_withOutline";
import LightbulbTwoToneIcon from '@mui/icons-material/LightbulbTwoTone';


export default function Policies() {
  const [selectedOption, setSelectedOption] = useState('');
  const [selectedOptions, setSelectedOptions] = useState({
    standardCancellation: false,
    nonRefundableRate: false,
    modificationPlan: false,
    offerDiscounts: false
  });
  const [selectedCancellationDays, setSelectedCancellationDays] = useState('');
  const handleCancellationDaysChange = (newValue) => {
    setSelectedCancellationDays(newValue);
  };
  const handleCheckboxChange = (event) => {
    setSelectedOptions({
      ...selectedOptions,
      [event.target.name]: event.target.checked
    });
    document.body.focus();
  };

 

  return (
    <Box
     
    >
      <Grid
        container
        spacing={2}
        sx={{
          height: "100%",
          alignItems: "center",
          justifyContent: "center",
          mt: 12
        }}
      >
        <Grid item xs={6} sx={{ textAlign: "left" }}>
          <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 2}}>
            Booking Policies and Payment Methods
          </Typography>
          <Typography  sx={{ fontSize: 18,mb: 2 }}>
            Embark on a smooth booking adventure with our reservation policies and flexible payment options
          </Typography>
          <Paper 
          elevation={3} 
          sx={{ p: 2, display: "flex", flexDirection: "column", alignItems: "left" }}>

            {/*Rate Plans*/}
            <form>
              <Box>
                <Typography  sx={{ fontWeight: 'bold',fontSize: 18,m: 2 }}>
                  Reservation Options
                </Typography>

                <Checkbox
                  name="standardCancellation"
                  checked={selectedOptions.standardCancellation}
                  onChange={handleCheckboxChange}
                  color="secondary"
                /> Standard Cancellation Plan

                <br />
                {selectedOptions.standardCancellation && (
                 <Box sx={{ border: '1px dotted black', p: 2, width:'500px', m:2 , height: 'auto' }}>
                    {/* Details of Cancellation Plan */}
                      <Typography >
                      Within how many days prior to their arrival can guests cancel their booking without any charges?
                      </Typography>
                      <br />
                      <TextFieldOutlineShort width="150" label="Number of Days"/>
                      <br/>
                      <Typography sx={{ fontSize: '14px', display: 'flex', alignItems: 'center' ,justifyContent: 'left'}}>
                        <LightbulbTwoToneIcon sx={{ fontSize: '14px', color: 'orange' }} />
                        The guest will  receive a 25% off refund if they cancel outside the free cancellation window.
                    </Typography>
                      
                  </Box>
                )}
                <Checkbox
                  name="nonRefundableRate"
                  checked={selectedOptions.nonRefundableRate}
                  onChange={handleCheckboxChange}
                  color="secondary"
                /> Non-refundable Rate Plan
                <br />
                {selectedOptions.nonRefundableRate && (
                  <Box sx={{ border: '1px dotted black', p: '8', width:'600px', m:2 , height: 'auto' }}>
                    {/* Details of Non-refundable plan */}
                  </Box>
                )}
                <Checkbox
                  name="modificationPlan"
                  checked={selectedOptions.modificationPlan}
                  onChange={handleCheckboxChange}
                  color="secondary"
                /> Modification Plan
                <br />
                {selectedOptions.modificationPlan && (
                  <Box sx={{ border: '1px dotted black', p: '8', width:'600px', m:2 , height: 'auto' }}>
                  {/* Details of Modification Plan */}
                </Box>
                )}
                <Checkbox
                  name="offerDiscounts"
                  checked={selectedOptions.offerDiscounts}
                  onChange={handleCheckboxChange}
                  color="secondary"
                /> Offer Discounts
                <br />
                {selectedOptions.offerDiscounts && (
                  <Box sx={{ border: '1px dotted black', p: '8', width:'600px', m:2 , height: 'auto' }}>
                    {/* Details of Offer Discounts */}
                  </Box>
                )}
              </Box>
            </form>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
