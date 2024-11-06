import { Grid, Paper, Typography } from '@mui/material'
import React from 'react'

export default function BenefitsMobile({ amenities, facilities, services }) {
    return (
        <Grid item xs={12} sx={{ mb: 2 }}>
            <Paper sx={{ display: 'flex', margin: '0 auto', paddingRight: '0', }}>

                <Grid container >
                    <Grid item xs={12} sx={{ fontWeight: 'bold', backgroundColor: '#16B4DD', borderRadius: '5px 5px 0 0', p: 0.5, }}>
                        <Typography variant="h6" sx={{ textAlign: 'center', color: 'white', fontFamily: 'Poppins' }}>Benefits</Typography>
                    </Grid>
                    <Grid container sx={{ display: 'flex', justifyContent: 'center', p: 0.5, marginTop: '0.5rem' }}>
                        <Grid item xs={4}>
                            <div>
                                <Typography variant="h6" sx={{ textAlign: 'left', ml: 2, fontFamily: 'Poppins' }}>Amenities</Typography>
                            </div>
                            <div>
                                {amenities.map(amenity => (
                                    <div key={amenity.amenityid} style={{ display: 'flex', alignItems: 'center' }}>
                                        <Typography variant="body1" sx={{ textAlign: 'center', ml: 2, fontFamily: 'Poppins' }}>{amenity.amenity_name}</Typography>
                                    </div>
                                ))}
                            </div>

                        </Grid>
                        <Grid item xs={4}>
                            <div>
                                <Typography variant="h6" sx={{ textAlign: 'left', ml: 2, fontFamily: 'Poppins' }}>Facilities</Typography>
                            </div>
                            {/* <div>
                                {facilities.map(facility => (
                                    <div key={facility.facilitiesid} style={{ display: 'flex', alignItems: 'center' }}>
                                        <Typography variant="body1" sx={{ textAlign: 'center', ml: 2, fontFamily: 'Poppins' }}>{facility.facilities_name}</Typography>
                                    </div>
                                ))}
                            </div> */}

                        </Grid>
                        <Grid item xs={4}>
                            <div>
                                <Typography variant="h6" sx={{ textAlign: 'left', ml: 2, fontFamily: 'Poppins' }}>Services</Typography>
                            </div>
                            <div>
                                {services.map(service => (
                                    <div key={service.serviceid} style={{ display: 'flex', alignItems: 'center' }}>
                                        <Typography variant="body1" sx={{ textAlign: 'center', ml: 2, fontFamily: 'Poppins' }}>{service.service_name}</Typography>
                                    </div>
                                ))}
                            </div>

                        </Grid>
                    </Grid>
                </Grid>
            </Paper>
        </Grid>
    )
}
