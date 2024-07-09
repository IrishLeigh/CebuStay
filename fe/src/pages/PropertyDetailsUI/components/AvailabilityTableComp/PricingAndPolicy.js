import { Grid, Paper, Typography, useTheme } from '@mui/material'
import React from 'react'

export default function PricingAndPolicy() {
    const theme = useTheme();

    return (
        <Grid container sx={{ width: '100%', overflow: 'auto', }}>
            <Grid item xs={12} sx={{ fontWeight: 'bold', backgroundColor: '#16B4DD', borderRadius: '5px 5px 0 0', p: 0.5, }}>
                <Grid container >
                    <Grid item xs={3}>
                        <Typography
                            variant="h6"
                            sx={{
                                textAlign: 'left',
                                color: 'white',
                                fontFamily: 'Poppins',
                                [theme.breakpoints.down('sm')]: {
                                    fontSize: '.75rem',
                                },
                                [theme.breakpoints.up('sm')]: {
                                    fontSize: '1rem',
                                },
                                [theme.breakpoints.up('md')]: {
                                    fontSize: '1.25rem',
                                },
                            }}
                        >Guests</Typography>

                    </Grid>
                    <Grid item xs={4} >
                        <Typography
                            variant="h6"
                            sx={{
                                textAlign: 'left',
                                color: 'white',
                                fontFamily: 'Poppins',
                                [theme.breakpoints.down('sm')]: {
                                    fontSize: '.75rem',
                                },
                                [theme.breakpoints.up('sm')]: {
                                    fontSize: '1rem',
                                },
                                [theme.breakpoints.up('md')]: {
                                    fontSize: '1.25rem',
                                },
                            }}
                        >Price/Night</Typography>
                    </Grid>
                    <Grid item xs={5} >
                        <Typography
                            variant="h6"
                            sx={{
                                textAlign: 'left',
                                color: 'white',
                                fontFamily: 'Poppins',
                                [theme.breakpoints.down('sm')]: {
                                    fontSize: '.75rem',
                                },
                                [theme.breakpoints.up('sm')]: {
                                    fontSize: '1rem',
                                },
                                [theme.breakpoints.up('md')]: {
                                    fontSize: '1.25rem',
                                },
                            }}
                        >Cancellation Policy</Typography>
                    </Grid>
                </Grid>
            </Grid>
            <Grid container sx={{ display: 'flex', justifyContent: 'center', p: 0.5, marginTop: '0.5rem' }}>
                <Grid item xs={3}>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <img src="/check.png" alt="Bedroom" style={{ maxWidth: '1.5rem', width: 'clamp(.5rem, 35%, 100%)' }} />
                        <Typography variant="body1"
                            sx={{
                                textAlign: 'left',
                                ml: 1,
                                fontFamily: 'Poppins',
                                [theme.breakpoints.down('sm')]: {
                                    fontSize: '.75rem',
                                },
                                [theme.breakpoints.up('sm')]: {
                                    fontSize: '.90rem',
                                },
                                [theme.breakpoints.up('md')]: {
                                    fontSize: '1rem',
                                },
                            }}>2</Typography>
                    </div>

                </Grid>
                <Grid item xs={4}>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <img src="/check.png" alt="Bedroom" style={{ maxWidth: '1.5rem', width: 'clamp(.5rem, 35%, 100%)' }} />
                        <Typography variant="body1"
                            sx={{
                                textAlign: 'left',
                                ml: 1,
                                fontFamily: 'Poppins',
                                [theme.breakpoints.down('sm')]: {
                                    fontSize: '.75rem',
                                },
                                [theme.breakpoints.up('sm')]: {
                                    fontSize: '.90rem',
                                },
                                [theme.breakpoints.up('md')]: {
                                    fontSize: '1rem',
                                },
                            }}>Php 1,435</Typography>
                    </div>
                </Grid>
                <Grid item xs={5}>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <img src="/check.png"  style={{ maxWidth: '1.5rem', width: 'clamp(.5rem, 35%, 100%)' }} />
                        <Typography variant="body1"
                            sx={{
                                textAlign: 'left',
                                ml: 1,
                                fontFamily: 'Poppins',
                                [theme.breakpoints.down('sm')]: {
                                    fontSize: '.75rem',
                                },
                                [theme.breakpoints.up('sm')]: {
                                    fontSize: '.90rem',
                                },
                                [theme.breakpoints.up('md')]: {
                                    fontSize: '1rem',
                                },
                            }}>Non-refundable</Typography>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <img src="/check.png"  style={{ maxWidth: '1.5rem', width: 'clamp(.5rem, 35%, 100%)' }} />
                        <Typography variant="body1"
                            sx={{
                                textAlign: 'left',
                                ml: 1,
                                fontFamily: 'Poppins',
                                [theme.breakpoints.down('sm')]: {
                                    fontSize: '.75rem',
                                },
                                [theme.breakpoints.up('sm')]: {
                                    fontSize: '.90rem',
                                },
                                [theme.breakpoints.up('md')]: {
                                    fontSize: '1rem',
                                },
                            }}>Pay in advance</Typography>
                    </div>
                </Grid>
            </Grid>

        </Grid>
    )
}
