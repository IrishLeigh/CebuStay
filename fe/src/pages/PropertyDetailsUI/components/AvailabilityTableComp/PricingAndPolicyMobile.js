import { Grid, Paper, Typography } from '@mui/material'
import React from 'react'

export default function PricingAndPolicyMobile() {
  return (
    <Grid container sx={{ overflow: 'auto', }}>

      <Grid item xs={12} >
        <Grid container >
          <Grid item xs={12}>
            <Grid container >

              <Grid container direction="column" sx={{ justifyContent: 'space-around', alignItems: 'center' }}>
                {/* Guests */}
                <Grid item sx={{ width: '100%', mb: 1 }}>
                  <Paper>
                    <Typography variant="h6" sx={{ textAlign: 'center', color: 'white', fontFamily: 'Poppins',  backgroundColor: '#16B4DD', borderRadius: '5px 5px 0 0', p: 0.5, }}>
                      Guests
                    </Typography>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <img src="/check.png" style={{ width: '1rem', }} />
                      <Typography variant="body1" sx={{ textAlign: 'center', fontFamily: 'Poppins' }}>
                        2
                      </Typography>
                    </div>
                  </Paper>
                </Grid>

                {/* Price/Night */}
                <Grid item sx={{ width: '100%', mb: 1 }}>
                  <Paper>
                    <Typography variant="h6" sx={{ textAlign: 'center', color: 'white', fontFamily: 'Poppins',  backgroundColor: '#16B4DD', borderRadius: '5px 5px 0 0', p: 0.5, }}>
                      Price/Night
                    </Typography>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <img src="/check.png" style={{ width: '1rem', }} />
                      <Typography variant="body1" sx={{ textAlign: 'center', fontFamily: 'Poppins' }}>
                        Php 1,435
                      </Typography>
                    </div>
                  </Paper>
                </Grid>

                {/* Refund Policy */}
                <Grid item sx={{ width: '100%' }}>
                  <Paper>
                    <Typography variant="h6" sx={{ textAlign: 'center', color: 'white', fontFamily: 'Poppins',  backgroundColor: '#16B4DD', borderRadius: '5px 5px 0 0', p: 0.5, }}>
                      Refund Policy
                    </Typography>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <img src="/check.png" style={{ width: '1rem', }} />
                      <Typography variant="body1" sx={{ textAlign: 'center', fontFamily: 'Poppins' }}>
                        Non-refundable
                      </Typography>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <img src="/check.png" style={{ width: '1rem', }} />
                      <Typography variant="body1" sx={{ textAlign: 'center', fontFamily: 'Poppins' }}>
                        Pay in advance
                      </Typography>
                    </div>
                  </Paper>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>


    </Grid>
  )
}
