
import React, { useState, useEffect } from 'react';
import '../css/PropertyManagementListing.css';
import { MdMenuOpen, MdSearch, MdEdit, MdDelete, MdClose} from 'react-icons/md';
// import Sidebar from '../../PropertyManagementUI/components/sidebar';
import {Box, Grid, Tooltip, CircularProgress, Snackbar, Alert } from '@mui/material';
import axios from 'axios';
// import EditPropertyUI from '../../PropertyManagementUI/components/EditPropertyUI';
import { useNavigate } from 'react-router-dom';
import RadioButtonCheckedIcon from '@mui/icons-material/RadioButtonChecked';
import DoDisturbIcon from '@mui/icons-material/DoDisturb';
import { set } from 'date-fns';

export default function PropertyManagementListing() {
    const [open, setOpen] = React.useState(false);
    const [messeds, setMesseds] = useState("");
    const [sev, setSev] = useState("success");
    const [selectedButton, setSelectedButton] = useState('ALL');
    const [showDropdown, setShowDropdown] = useState(false);
    const [selectedOption, setSelectedOption] = useState('');
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [editItemId, setEditItemId] = useState(null);
    const [deleteItemId, setDeleteItemId] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [selectedId, setSelectedId] = useState(null);
    const navigate = useNavigate();
    const [alertstyle, setAlertStyle] = useState({
        width: '100%',
        color: 'green',
        backgroundColor: 'white',
        borderColor: 'green',
    });
   
    //TO DO: uncomment this if local storage does not work
        // const [user, setUser] = useState(null);
    const userid = localStorage.getItem("userid");

    const handleCllose = (event, reason) => {
        if (reason === 'clickaway') {
          return;
        }
    
        setOpen(false);
      };
    // useEffect(() => {
    //     const token = localStorage.getItem("auth_token");
    //     if (token) {
    //       axios
    //         .post("http://127.0.0.1:8000/api/decodetoken", { token: token })
    //         .then((response) => {
    //           setUser(response.data["data"]);
    //           console.log("RESPONSE DATA: ", response.data["data"]);
    //         })
    //         .catch((error) => {
    //           alert("Error decoding JWT token:", error);
    //           setUser(null);
    //         });
    //     } else {
    //       setUser(null);
    //     }
    //   }, []);
    
      useEffect(() => {
        const fetchData = async () => {
          if (!userid) return;
          try {
            const propertyres = await axios.get(
              "http://127.0.0.1:8000/api/user/properties",
              {
                params: {
                  userid:userid,
                },
              }
            );
    
            console.log("Propertydata: ", propertyres.data);
            setData(propertyres.data.userproperties);
          } catch (error) {
            console.error(error);
          }
        };
        fetchData();
      }, [userid]);

    const handleEdit = (id) => {
        navigate(`/edit-property/${id}`); // Navigate to the edit page
      };

    const handleSave = (id) => {
        // Save the edited data
        const newData = data.map(item => item.id === id ? { ...item, editable: false } : item);
        setData(newData);
        setEditModalOpen(false);
    };

    const handleCancelEdit = () => {
        setEditItemId(null);
        setEditModalOpen(false);
    };
    const handleStatus = async (id) => {
        setLoading(true);
        console.log("id: ", id);
        const token = localStorage.getItem("auth_token")
        try {
            const res = await axios.put("http://127.0.0.1:8000/api/activateproperty", {
                propertyid: id,
            },{
                headers: {
                    Authorization: `${token}`,
                    "Content-Type": "application/json",
                }
            })
            if(res.data.status === "success"){
                setAlertStyle({
                    width: '100%',
                    color: 'green',
                    backgroundColor: 'white',
                    borderColor: 'green',
                })
                setMesseds("Property activated successfully");
                setSev("success");
                setOpen(true);
                // alert(res.data.message);
                try {
                    const propertyres = await axios.get(
                      "http://127.0.0.1:8000/api/user/properties",
                      {
                        params: {
                          userid: userid,
                        },
                      }
                    );
                    console.log("Propertydata: ", propertyres.data);
                    setData(propertyres.data.userproperties);
                  } catch (error) {
                    console.error(error);
                  } finally{
                    setLoading(false);
                  }
            
            }
        } catch (error) {
            console.log(error);
        } 
    }
    const handleDelete = async (id) => {
        setLoading(true);
        console.log("id: ", id);
        const token = localStorage.getItem("auth_token")
        console.log("token: ", token);
        try {
            const res = await axios.put("http://127.0.0.1:8000/api/disableproperty", {
                propertyid: id,
            },{
                headers: {
                    Authorization: `${token}`,
                    "Content-Type": "application/json",
                }
            })
            if(res.data.status === "success"){
                setMesseds("Property deactivated successfully");
                setSev("success");
                setOpen(true);
                setAlertStyle({
                    width: '100%',
                    color: 'green',
                    backgroundColor: 'white',
                    borderColor: 'green',
                })
                // alert(res.data.message);
                try {
                    const propertyres = await axios.get(
                      "http://127.0.0.1:8000/api/user/properties",
                      {
                        params: {
                          userid: userid,
                        },
                      }
                    );
            
                    console.log("Propertydata: ", propertyres.data);
                    setData(propertyres.data.userproperties);
                  } catch (error) {
                    console.error(error);
                  }
            } else if(res.data.status === "error"){
                setAlertStyle({
                    width: '100%',
                    color: 'red',
                    backgroundColor: 'white',
                    borderColor: 'red',
                })
                setMesseds(res.data.message);
                setSev("error");
                setOpen(true);
                // alert(res.data.message);
            }
            setLoading(false);
        } catch (error) {
            console.log(error);
        }
        // setDeleteItemId(id);
        // setModalOpen(true);
    };
    const handleRowClick = (id) => {
        setSelectedId(id);
      };
    
      const handleClose = () => {
        setSelectedId(null);
      };

    const confirmDelete = () => {
        // Delete the item from the data
        const newData = data.filter(item => item.id !== deleteItemId);
        setData(newData);
        setModalOpen(false);
    };

    const closeModal = () => {
        setModalOpen(false);
        setEditModalOpen(false);
        setEditItemId(null);
        setDeleteItemId(null);
    };

    const getData = () => {
        switch (selectedButton) {
            case 'ALL':
                return data;
            case 'ACTIVE':
                return data.filter(item => item.status === 'Active');
            case 'INACTIVE':
                return data.filter(item => item.status === 'Inactive');
            default:
                return [];
        }
    };

    // console.log("DATA: ", data);

    return (
        // <Grid container>
        //     <Grid item xs={2}>
        //         <div style={{width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center'}}> 
        //          <Sidebar />
        //         </div>
        //     </Grid>
            
        //     <Grid item xs={10}>
                // <div className="full-height bg-light">
            <Box sx={{ width: '100%', maxWidth: { sm: '100%', md: '1700px' } }}>
                <Snackbar open={open} autoHideDuration={3000} onClose={handleCllose} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
                    <Alert
                    onClose={handleCllose}
                    severity={sev}
                    // variant="filled"
                    sx={alertstyle}
                    >
                    {messeds}
                    </Alert>
                </Snackbar>
                <div className="full-height" style={{position: 'relative'}}>
                    <div style={{ background: 'linear-gradient(to right, #F8A640, #F89E2D, #FCCD6E)', padding: '1.5rem', color: '#ffffff', borderBottomLeftRadius: '0.5rem', borderBottomRightRadius: '0.5rem', width: '100%' }}>
                        <h1 className="title" style={{ fontSize: '1.875rem', fontWeight: '700', marginBottom: '0.5rem', color: 'white', font: 'poppins', textAlign: 'left' }}>Your Properties</h1>
                        <p style={{ fontSize: '0.875rem', textAlign: 'left' }}>Property management lsiting, where you can easily view, edit, and manage all property details.</p>
                    </div>
                    {loading && (
                    <div style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: 'rgba(0, 0, 0, 0.5)',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        zIndex: 1000
                    }}>
                        <CircularProgress />
                    </div>
                    )}
                    <div className="full-width mt-4">
                        <div className="controls flex justify-between items-center mb-4">
                            <div className="buttons flex justify-evenly w-full" style={{ width: 'fit-content', gap: '1rem' }}>
                                <Tooltip title="All Properties">
                                    <button
                                        className={`btn ${selectedButton === 'ALL' ? 'underline' : ''}`}
                                        onClick={() => setSelectedButton('ALL')}
                                    >
                                        ALL
                                    </button>
                                </Tooltip>
                                <Tooltip title="Active Properties">
                                    <button
                                        className={`btn ${selectedButton === 'ACTIVE' ? 'underline' : ''}`}
                                        onClick={() => setSelectedButton('ACTIVE')}
                                    >
                                        ACTIVE
                                </button>
                                </Tooltip>
                                <Tooltip title="Inactive Properties">
                                    <button
                                        className={`btn ${selectedButton === 'INACTIVE' ? 'underline' : ''}`}
                                        onClick={() => setSelectedButton('INACTIVE')}
                                    >
                                        INACTIVE
                                    </button>
                                </Tooltip>
                            </div>

                            <div style={{ display: 'flex', alignItems: 'center', marginLeft: '1rem', position: 'relative' }}>
                                <div>
                                    <MdSearch style={{
                                        position: 'absolute',
                                        left: '0.5rem',
                                        color: '#5E5E5E',
                                        fontSize: '1.8rem',
                                        marginTop: '0.7rem'
                                    }} />
                                    <input
                                        type="text"
                                        placeholder="Search here"
                                        style={{
                                            padding: '0.5rem 1rem 0.5rem 2.5rem',
                                            borderWidth: '1px',
                                            borderRadius: '0.5rem',
                                            outline: 'none',
                                            height: '3rem',
                                            width: '100%',
                                            marginBottom: '-1rem',
                                            border: 'none',
                                            boxShadow: '0 4px 6px -2px rgba(0, 0, 0, 0.2)',
                                        }}
                                    />
                                </div>

                                <button
                                    onClick={() => setShowDropdown(!showDropdown)}
                                    style={{
                                        padding: '0.5rem 1rem',
                                        borderWidth: '1px',
                                        borderRadius: '0.5rem',
                                        marginLeft: '0.2rem',
                                        height: '3rem',
                                        cursor: 'pointer',
                                        marginBottom: '-0.9rem',
                                        backgroundColor: 'white',
                                        border: 'none',
                                        boxShadow: '0 4px 6px -2px rgba(0, 0, 0, 0.2)',
                                    }}
                                >
                                    <MdMenuOpen style={{ height: '2rem' }} />
                                </button>
                                {showDropdown && (
                                    <div style={{
                                        position: 'absolute',
                                        top: '3rem',
                                        left: '42%',
                                        backgroundColor: 'white',
                                        borderWidth: '1px',
                                        borderRadius: '0.5rem',
                                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                                        zIndex: 10,
                                        padding: '0.5rem',
                                        width: '10rem',
                                        marginTop: '0.5rem'
                                    }}>

                                        <div style={{ fontSize: '0.875rem', fontWeight: '700', padding: '0.5rem 0', textAlign: 'left', marginLeft: '0.8rem' }}>Search by</div>
                                        <hr style={{ margin: '0.5rem 0' }} />
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                            {['Property ID', 'Property Name', 'Type'].map(option => (
                                                <button
                                                    key={option}
                                                    onClick={() => {
                                                        setSelectedOption(option);
                                                        setShowDropdown(false);
                                                    }}
                                                    style={{
                                                        padding: '0.5rem 1rem',
                                                        textAlign: 'left',
                                                        backgroundColor: selectedOption === option ? '#FCCD6E' : 'white',
                                                        color: selectedOption === option ? 'white' : 'black',
                                                        borderRadius: '0.25rem',
                                                        cursor: 'pointer',
                                                        fontFamily: 'Poppins',
                                                        border: 'none',
                                                        outline: 'none'
                                                    }}
                                                >
                                                    {option}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div style={{ position: 'relative', width: '100%', backgroundColor: '#ffffff', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)', borderRadius: '0.5rem', overflow: 'hidden', textAlign: 'center' }}>
                            <table style={{ width: '100%', textAlign: 'center' }}>
                                <thead style={{ backgroundColor: '#f0f0f0', textAlign: 'center' }}>
                                    <tr>
                                        <th style={{ padding: '0.5rem 1rem', textAlign: 'center', fontSize: '0.8rem', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Select</th>
                                        <th style={{ padding: '0.5rem 1rem', textAlign: 'center', fontSize: '0.8rem', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Property ID</th>
                                        <th style={{ padding: '0.5rem 1rem', textAlign: 'center', fontSize: '0.8rem', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Property Name</th>
                                        <th style={{ padding: '0.5rem 1rem', textAlign: 'center', fontSize: '0.8rem', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Type</th>
                                        <th style={{ padding: '0.5rem 1rem', textAlign: 'center', fontSize: '0.8rem', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Address</th>
                                        <th style={{ padding: '0.5rem 1rem', textAlign: 'center', fontSize: '0.8rem', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Date Listed</th>
                                        <th style={{ padding: '0.5rem 1rem', textAlign: 'center', fontSize: '0.8rem', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Status</th>
                                        <th style={{ padding: '0.5rem 1rem', textAlign: 'center', fontSize: '0.8rem', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {data.length === 0 ? (
                                         <tr>
                                         <td colSpan="8" style={{ textAlign: 'center', padding: '1rem' }}>
                                           <div className="loading-container" style={{ display: "flex", justifyContent: "center", margin: '2rem', height: '100%' }}>
                                             <CircularProgress />
                                             <p>Retrieving data...</p>
                                           </div>
                                         </td>
                                       </tr>
                                    ) : (
                                    getData().map(item => (
                                        <tr key={item.id} className="table-row" onClick={() => handleRowClick(item.id)}>
                                            <td className="table-cell"><input type="checkbox" /></td>
                                            <td className="table-cell">{item.editable ? <input type="text" value={item.id} onChange={(e) => setData(data.map(i => i.id === item.id ? { ...i, id: e.target.value } : i))} /> : item.id}</td>
                                            <td className="table-cell">{item.editable ? <input type="text" value={item.name} onChange={(e) => setData(data.map(i => i.id === item.id ? { ...i, name: e.target.value } : i))} /> : item.name}</td>
                                            <td className="table-cell">{item.editable ? <input type="text" value={item.type} onChange={(e) => setData(data.map(i => i.id === item.id ? { ...i, type: e.target.value } : i))} /> : item.type}</td>
                                            <td className="table-cell">{item.editable ? <input type="text" value={item.address} onChange={(e) => setData(data.map(i => i.id === item.id ? { ...i, address: e.target.value } : i))} /> : item.address}</td>
                                            <td className="table-cell">{item.editable ? <input type="text" value={item.created_at} onChange={(e) => setData(data.map(i => i.id === item.id ? { ...i, created_at: e.target.value } : i))} /> : item.created_at}</td>
                                            <td className="table-cell" style={{ color: item.status === 'Active' ? 'green' : 'red' }}>
                                                {item.status}
                                            </td>
                                            <td className="table-cell">
                                                {item.editable ? (
                                                    <div>
                                                        <button onClick={() => handleSave(item.id)} style={{ cursor: 'pointer', marginRight: '0.5rem', color: 'blue' }}>Save</button>
                                                        <button onClick={handleCancelEdit} style={{ cursor: 'pointer', color: 'gray' }}>Cancel</button>
                                                    </div>
                                                ) : (
                                                    <>
                                                        <Tooltip title="Edit Property">
                                                            <span className='dajwhbdkajwbdjhab'>
                                                                <MdEdit onClick={() => handleEdit(item.id)} style={{ cursor: 'pointer', marginRight: '0.5rem', color: 'blue' }} />
                                                            </span>
                                                        </Tooltip>
                                                        <Tooltip title={item.status === 'Inactive' ? 'Currently Inactive' : 'Deactivate Property'}>
                                                            <span className='dajwhbdkajwbdjhab'>
                                                                <DoDisturbIcon 
                                                                onClick={() => item.status === 'Active' && handleDelete(item.id)} 
                                                                style={{ 
                                                                    cursor: item.status === 'Inactive' ? 'not-allowed' : 'pointer', 
                                                                    color: 'red', 
                                                                    fontSize: '1.0rem',  
                                                                    opacity: item.status === 'Inactive' ? '0.4' : '1'
                                                                }} 
                                                                />
                                                            </span>
                                                        </Tooltip>
                                                        <Tooltip title={item.status === 'Active' ? 'Curently Active' : 'Activate Property'}>
                                                            <RadioButtonCheckedIcon onClick={() => item.status === "Inactive" && handleStatus(item.id)} 
                                                            style={{ 
                                                                cursor: item.status === 'Active' ? 'not-allowed' : 'pointer', 
                                                                color: item.status === 'Active' ? 'green' : 'red', 
                                                                marginLeft: '0.5rem', fontSize: '1.0rem',  
                                                                opacity: item.status === 'Active' ? '0.4' : '1',}} 
                                                            />
                                                        </Tooltip>
                                                    </>
                                                )}
                                            </td>
                                        </tr>
                                    ))
                                    )}
  
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Delete Confirmation Modal */}
                    {modalOpen && (
                        <div className="modal-overlay">
                            <div className="modal">
                                <div className="modal-content">
                                    <span className="close" onClick={closeModal}>&times;</span>
                                    <h2>Confirm Delete</h2>
                                    <p>Are you sure you want to delete this item?</p>
                                    <div className="modal-actions">
                                        <button onClick={confirmDelete}>Yes</button>
                                        <button onClick={closeModal}>No</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Edit Modal */}
                    
                    {/* {selectedId && (
                        <EditPropertyUI
                        editItemId={selectedId}
                        onClose={handleClose}
                        />
                    )} */}

                </div>
            </Box>
    //</Grid>
    // </Grid>
    );
}
