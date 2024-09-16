import { Container, Grid, Paper, Table, Typography, useMediaQuery } from '@mui/material'
import React, { useEffect, useState, useRef, useLayoutEffect } from 'react'
import { useTheme } from '@mui/material/styles';
import CarouselFadeExample from './Carousel'
import { Button } from 'react-bootstrap';
import axios from 'axios';
import PricingAndPolicyMobile from './AvailabilityTableComp/PricingAndPolicyMobile';
import PricingAndPolicy from './AvailabilityTableComp/PricingAndPolicy';
import Benefits from './AvailabilityTableComp/Benefits';
import BenefitsMobile from './AvailabilityTableComp/BenefitsMobile';


export default function AvailabilityTable(propertyid) {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down(750));
    const [loading, setLoading] = useState(true);
    const [propertyInfo, setPropertyInfo] = useState({});
    const [unitRoom, setUnitRoom] = useState([]);
    const [bedType, setBedType] = useState([]);
    const [amenities, setAmenities] = useState([]);
    const [facilities, setFacilities] = useState([]);
    const [services, setServices] = useState([]);

    const [unitdetails, setUnitDetails] = useState({});

    const rightColumnRef = useRef(null);
    const firstGridRef = useRef(null);
    const carouselRef = useRef(null);
    const [carouselHeight, setCarouselHeight] = useState(0);


    useLayoutEffect(() => {
        if (!loading) {
            if (isMobile && firstGridRef.current) {
                setCarouselHeight(firstGridRef.current.clientHeight);
            } else if (rightColumnRef.current) {
                setCarouselHeight(rightColumnRef.current.clientHeight);
            }
        }
    }, [loading, isMobile]);


    // useEffect(() => {
    //     const fetchData = async () => {
    //         try {

    //             const resData = await axios.get(
    //                 "http://127.0.0.1:8000/api/getproperty",
    //                 {
    //                     params: {
    //                         propertyid: propertyid,
    //                     },
    //                 }
    //             );
    //             if (resData.data) {
    //                 console.log("FULL PROPERTY INFO", resData.data);
    //                 console.log("Unit Rooms", resData.data.property_unitdetails.unitrooms);
    //                 setUnitRoom(resData.data.property_unitrooms.unitrooms);
    //                 setBedType(resData.data.property_unitrooms.unitbeds);
    //                 setAmenities(resData.data.property_amenities);
    //                 setFacilities(resData.data.property_facilities);
    //                 setServices(resData.data.property_services);
    //                 setPropertyInfo(resData.data);

    //             }

    //         } catch (err) {
    //             console.log(err);
    //         } finally {
    //             setLoading(false); // Set loading to false after data is fetched
    //         }
    //     };
    //     fetchData();
    // }, []); // Update useEffect dependency


    useEffect(() => {
        const fetchData = async () => {
            try {

                const resData = await axios.get(
                    "http://127.0.0.1:8000/api/getallunit",
                    {
                        params: {
                            propertyid: propertyid,
                        },
                    }
                );
                if (resData.data) {
                    console.log("UnitDetails", resData.data);
                    console.log("Unit Detail Rooms", resData.data.property_unitdetails[0].unitbeds);
                    console.log("Images", resData.data.property_unitdetails[0].images);
                    setUnitDetails(resData.data.property_unitdetails);

                }

            } catch (err) {
                console.log(err);
            } finally {
                setLoading(false); // Set loading to false after data is fetched
            }
        };
        fetchData();
    }, []); // Update useEffect dependency


    const renderRoomImage = (roomName) => {
        switch (roomName.toLowerCase()) {
            case 'bedroom':
                return '/bedroom.png';
            case 'bathroom':
                return '/bathroom1.png';
            case 'living room':
                return '/livingroom.png';
            case 'kitchen':
                return '/kitchen.png';
            case 'dining':
                return '/dining.png';
            default:
                return null;
        }
    };

    const renderBedImage = (bedType) => {
        switch (bedType.toLowerCase()) {
            case 'singlebed':
                return '/singlebed.png';
            case 'bunkbed':
                return '/bunkbed.png';
            case 'largebed':
                return '/bedroom.png';
            case 'superlargebed':
                return '/bedroom.png';
            default:
                return null;
        }
    };

    return (
        <div>
            <Container maxWidth="lg">
                {loading ? (
                    <p>Loading...</p>
                ) : (
                    unitdetails.map((unit, index) => (
                        <Paper sx={{ p: 1, display: 'flex', marginTop: '1rem' }}>
                        <Grid container  >
                            <Grid item xs={6} sx={{ margin: '0' }}>

                                <Grid container>
                                    
                                    <Grid item xs={12} sx={{ mr: 1 }}>
                                        <div >
                                            <CarouselFadeExample height={carouselHeight} photos = {unit.images} photoLength = {unit.images.length}/>
                                            {/* {unit.images.map((image, index) => (
                                                
                                                <>
                                                <img key={index} src={image.src} alt={unit.unitname} style={{ width: '100%', height: 'auto' }} />
                                                <CarouselFadeExample height={carouselHeight} photos = {image}/>
                                                </>
                                                
                                            ))} */}
                                        </div>
                                    </Grid>
                                </Grid>

                            </Grid>
                            
                            <Grid item xs={6} sx={{ margin: '0', padding: '0' }} ref={rightColumnRef}>
                                <Grid container >
                                    <Grid item xs={12} ref={firstGridRef} >
                                    <Typography variant="h6" sx={{ textAlign: 'center', fontWeight: 'bold', padding: '0.5rem' }}>{unit.unitname}</Typography>
                                        <Paper sx={{ display: 'flex', margin: '0 auto', paddingRight: '0' }}>
                                            {isMobile ?
                                                <>
                                                    <PricingAndPolicyMobile />
                                                </> :
                                                <>
                                                    <PricingAndPolicy />
                                                </>}
                                        </Paper>
                                    </Grid>
                                    <Grid item xs={12} sx={{ marginTop: '1rem' }}>
                                        <Paper sx={{ display: 'flex', margin: '0 auto', }}>

                                            {!isMobile && (
                                                <Benefits amenities={unit.amenities} services={unit.services} />
                                            )}
                                        </Paper>
                                    </Grid>
                                </Grid>
                            </Grid>
                            {isMobile && (
                                <BenefitsMobile amenities={unit.amenities} services={unit.services} />
                            )}
                            <Grid item xs={12} >
                                <Paper sx={{ display: 'flex', margin: '0 auto', paddingRight: '0', mt: 2 }}>

                                    <Grid container >
                                        <Grid item xs={12} sx={{ fontWeight: 'bold', backgroundColor: '#16B4DD', borderRadius: '5px 5px 0 0' }}>
                                            <Typography variant="h6" sx={{ textAlign: 'center', color: 'white' }}>Room Details</Typography>
                                        </Grid>
                                        <Grid item xs={6} sx={{ borderRight: '1px solid black', p: 1 }}>
                                            {unit.unitrooms.map(room => (
                                                <div key={room.unitroomid} style={{ display: 'flex', alignItems: 'center' }}>
                                                    <img src={renderRoomImage(room.roomname)} alt={room.roomname} style={{ width: '2.25rem' }} />
                                                    <Typography variant="body1" sx={{ textAlign: 'left', ml: 2 }}>{room.roomname}</Typography>
                                                    <Typography variant="body1" sx={{ marginLeft: 'auto', mr: 2 }}>{room.quantity}</Typography>
                                                </div>
                                            ))}
                                        </Grid>
                                        <Grid item xs={6} sx={{ borderLeft: '1px solid black', p: 1 }}>
                                            <Typography variant="body1" sx={{ ml: 1, fontWeight: 'bold' }}>Bedroom Type</Typography>
                                            {Object.values(unit.unitbeds).flat().map((bedsData, index) => (
                                                <div key={index} style={{ marginBottom: '0.5rem' }}>
                                                    <Typography variant="body1" sx={{ ml: 1 }}>Bedroom {bedsData.bedroomnum}</Typography>
                                                    {Object.keys(bedsData.beds).map((bedType, index) => (
                                                        bedsData.beds[bedType] > 0 && (
                                                            <div key={index} style={{ display: 'flex', alignItems: 'center', marginLeft: '1rem' }}>
                                                                <img src={renderBedImage(bedType)} alt={bedType} style={{ width: '2rem' }} />
                                                                <Typography variant="body1" sx={{ textAlign: 'center', ml: 1 }}>{bedType}: {bedsData.beds[bedType]}</Typography>
                                                            </div>
                                                        )
                                                    ))}
                                                </div>
                                            ))}
                                        </Grid>
                                    </Grid>
                                </Paper>
                            </Grid>
                            <div style={{ display: 'flex', justifyContent: 'center', width: "100%", margin: "1rem" }}>
                                <Button style={{ width: "10rem", backgroundColor: '#1780CB', borderRadius: '12px', color: 'white', fontSize: '1rem', fontFamily: 'Poppins' }}>Reserve Now</Button>
                            </div>
                        </Grid>
                    </Paper>
                    ))
                )}
            </Container>
        </div>
    )
}
