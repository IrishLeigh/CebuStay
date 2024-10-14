
// import React, { useState, useEffect } from 'react';
// import '../css/PropertyManagementListing.css';
// import { MdMenuOpen, MdSearch, MdEdit, MdDelete, MdClose} from 'react-icons/md';
// import Sidebar from '../../sidebar';
// import {Box, Grid } from '@mui/material';
// import axios from 'axios';
// import EditPropertyUI from '../../EditPropertyUI';
// import { useNavigate } from 'react-router-dom';
// export default function PropertyManagementListing() {
//     const [selectedButton, setSelectedButton] = useState('ALL');
//     const [showDropdown, setShowDropdown] = useState(false);
//     const [selectedOption, setSelectedOption] = useState('');
//     const [data, setData] = useState([]);

//     // const [data, setData] = useState([
//     //     { id: '#P123', name: 'Sunset Resort', type: 'Suite', address: '123 Beach St, Miami, FL', created_at: "2024-07-04 12:21pm", status: 'Active' },
//     //     { id: '#P456', name: 'Mountain Lodge', type: 'Cabin', address: '456 Mountain Rd, Denver, CO', created_at: "2024-07-04 12:21pm", status: 'Inactive' },
//     // ]);

    
//     const [editItemId, setEditItemId] = useState(null);
//     const [deleteItemId, setDeleteItemId] = useState(null);
//     const [modalOpen, setModalOpen] = useState(false);
//     const [editModalOpen, setEditModalOpen] = useState(false);
//     const [selectedId, setSelectedId] = useState(null);
//     const [user, setUser] = useState(null);
//     const navigate = useNavigate();

    
//     useEffect(() => {
//         const token = localStorage.getItem("auth_token");
//         if (token) {
//           axios
//             .post("https://whitesmoke-shark-473197.hostingersite.com/api/decodetoken", { token: token })
//             .then((response) => {
//               setUser(response.data["data"]);
//               console.log("RESPONSE DATA: ", response.data["data"]);
//             })
//             .catch((error) => {
//               alert("Error decoding JWT token:", error);
//               setUser(null);
//             });
//         } else {
//           setUser(null);
//         }
//       }, []);
    
//       useEffect(() => {
//         const fetchData = async () => {
//           if (!user) return;
//           try {
//             const propertyres = await axios.get(
//               "https://whitesmoke-shark-473197.hostingersite.com/api/user/properties",
//               {
//                 params: {
//                   userid: user.userid,
//                 },
//               }
//             );
    
//             console.log("Propertydata: ", propertyres.data);
//             setData(propertyres.data.userproperties);
//           } catch (error) {
//             console.error(error);
//           }
//         };
//         fetchData();
//       }, [user]);

//     // const handleEdit = (id) => {
//     //     setEditItemId(id);
//     //     setEditModalOpen(true);
//     // };
//     const handleEdit = (id) => {
//         navigate(`/edit-property/${id}`); // Navigate to the edit page
//       };

//     const handleSave = (id) => {
//         // Save the edited data
//         const newData = data.map(item => item.id === id ? { ...item, editable: false } : item);
//         setData(newData);
//         setEditModalOpen(false);
//     };

//     const handleCancelEdit = () => {
//         setEditItemId(null);
//         setEditModalOpen(false);
//     };

//     const handleDelete = (id) => {
//         setDeleteItemId(id);
//         setModalOpen(true);
//     };
//     const handleRowClick = (id) => {
//         setSelectedId(id);
//       };
    
//       const handleClose = () => {
//         setSelectedId(null);
//       };

//     const confirmDelete = () => {
//         // Delete the item from the data
//         const newData = data.filter(item => item.id !== deleteItemId);
//         setData(newData);
//         setModalOpen(false);
//     };

//     const closeModal = () => {
//         setModalOpen(false);
//         setEditModalOpen(false);
//         setEditItemId(null);
//         setDeleteItemId(null);
//     };

//     const getData = () => {
//         switch (selectedButton) {
//             case 'ALL':
//                 return data;
//             case 'ACTIVE':
//                 return data.filter(item => item.status === 'Active');
//             case 'INACTIVE':
//                 return data.filter(item => item.status === 'Inactive');
//             default:
//                 return [];
//         }
//     };

//     console.log("DATA: ", data);

//     return (
//         // <Grid container>
//         //     <Grid item xs={2}>
//         //         <div style={{width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center'}}> 
//         //          <Sidebar />
//         //         </div>
//         //     </Grid>
            
//         //     <Grid item xs={10}>
//                 // <div className="full-height bg-light">
//             <Box sx={{ width: '100%', maxWidth: { sm: '100%', md: '1700px' } }}>
//                 <div className="full-height">
                    
//                     <div style={{ background: 'linear-gradient(to right, #F8A640, #F89E2D, #FCCD6E)', padding: '1.5rem', color: '#ffffff', borderBottomLeftRadius: '0.5rem', borderBottomRightRadius: '0.5rem', width: '100%' }}>
//                         <h1 className="title" style={{ fontSize: '1.875rem', fontWeight: '700', marginBottom: '0.5rem', color: 'white', font: 'poppins', textAlign: 'left' }}>Property Management Listing</h1>
//                         <p style={{ fontSize: '0.875rem', textAlign: 'left' }}>Lorem ipsum dolor sit amet</p>
//                     </div>

//                     <div className="full-width mt-4">
//                         <div className="controls flex justify-between items-center mb-4">
//                             <div className="buttons flex justify-evenly w-full" style={{ width: 'fit-content', gap: '1rem' }}>
//                                 <button
//                                     className={`btn ${selectedButton === 'ALL' ? 'underline' : ''}`}
//                                     onClick={() => setSelectedButton('ALL')}
//                                 >
//                                     ALL
//                                 </button>
//                                 <button
//                                     className={`btn ${selectedButton === 'ACTIVE' ? 'underline' : ''}`}
//                                     onClick={() => setSelectedButton('ACTIVE')}
//                                 >
//                                     ACTIVE
//                                 </button>
//                                 <button
//                                     className={`btn ${selectedButton === 'INACTIVE' ? 'underline' : ''}`}
//                                     onClick={() => setSelectedButton('INACTIVE')}
//                                 >
//                                     INACTIVE
//                                 </button>
//                             </div>

//                             <div style={{ display: 'flex', alignItems: 'center', marginLeft: '1rem', position: 'relative' }}>
//                                 <div>
//                                     <MdSearch style={{
//                                         position: 'absolute',
//                                         left: '0.5rem',
//                                         color: '#5E5E5E',
//                                         fontSize: '1.8rem',
//                                         marginTop: '0.7rem'
//                                     }} />
//                                     <input
//                                         type="text"
//                                         placeholder="Search here"
//                                         style={{
//                                             padding: '0.5rem 1rem 0.5rem 2.5rem',
//                                             borderWidth: '1px',
//                                             borderRadius: '0.5rem',
//                                             outline: 'none',
//                                             height: '3rem',
//                                             width: '100%',
//                                             marginBottom: '-1rem',
//                                             border: 'none',
//                                             boxShadow: '0 4px 6px -2px rgba(0, 0, 0, 0.2)',
//                                         }}
//                                     />
//                                 </div>

//                                 <button
//                                     onClick={() => setShowDropdown(!showDropdown)}
//                                     style={{
//                                         padding: '0.5rem 1rem',
//                                         borderWidth: '1px',
//                                         borderRadius: '0.5rem',
//                                         marginLeft: '0.2rem',
//                                         height: '3rem',
//                                         cursor: 'pointer',
//                                         marginBottom: '-0.9rem',
//                                         backgroundColor: 'white',
//                                         border: 'none',
//                                         boxShadow: '0 4px 6px -2px rgba(0, 0, 0, 0.2)',
//                                     }}
//                                 >
//                                     <MdMenuOpen style={{ height: '2rem' }} />
//                                 </button>
//                                 {showDropdown && (
//                                     <div style={{
//                                         position: 'absolute',
//                                         top: '3rem',
//                                         left: '42%',
//                                         backgroundColor: 'white',
//                                         borderWidth: '1px',
//                                         borderRadius: '0.5rem',
//                                         boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
//                                         zIndex: 10,
//                                         padding: '0.5rem',
//                                         width: '10rem',
//                                         marginTop: '0.5rem'
//                                     }}>

//                                         <div style={{ fontSize: '0.875rem', fontWeight: '700', padding: '0.5rem 0', textAlign: 'left', marginLeft: '0.8rem' }}>Search by</div>
//                                         <hr style={{ margin: '0.5rem 0' }} />
//                                         <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
//                                             {['Property ID', 'Property Name', 'Type'].map(option => (
//                                                 <button
//                                                     key={option}
//                                                     onClick={() => {
//                                                         setSelectedOption(option);
//                                                         setShowDropdown(false);
//                                                     }}
//                                                     style={{
//                                                         padding: '0.5rem 1rem',
//                                                         textAlign: 'left',
//                                                         backgroundColor: selectedOption === option ? '#FCCD6E' : 'white',
//                                                         color: selectedOption === option ? 'white' : 'black',
//                                                         borderRadius: '0.25rem',
//                                                         cursor: 'pointer',
//                                                         fontFamily: 'Poppins',
//                                                         border: 'none',
//                                                         outline: 'none'
//                                                     }}
//                                                 >
//                                                     {option}
//                                                 </button>
//                                             ))}
//                                         </div>
//                                     </div>
//                                 )}
//                             </div>
//                         </div>

//                         <div style={{ position: 'relative', width: '100%', backgroundColor: '#ffffff', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)', borderRadius: '0.5rem', overflow: 'hidden', textAlign: 'center' }}>
//                             <table style={{ width: '100%', textAlign: 'center' }}>
//                                 <thead style={{ backgroundColor: '#f0f0f0', textAlign: 'center' }}>
//                                     <tr>
//                                         <th style={{ padding: '0.5rem 1rem', textAlign: 'center', fontSize: '0.8rem', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Select</th>
//                                         <th style={{ padding: '0.5rem 1rem', textAlign: 'center', fontSize: '0.8rem', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Property ID</th>
//                                         <th style={{ padding: '0.5rem 1rem', textAlign: 'center', fontSize: '0.8rem', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Property Name</th>
//                                         <th style={{ padding: '0.5rem 1rem', textAlign: 'center', fontSize: '0.8rem', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Type</th>
//                                         <th style={{ padding: '0.5rem 1rem', textAlign: 'center', fontSize: '0.8rem', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Address</th>
//                                         <th style={{ padding: '0.5rem 1rem', textAlign: 'center', fontSize: '0.8rem', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Date Listed</th>
//                                         <th style={{ padding: '0.5rem 1rem', textAlign: 'center', fontSize: '0.8rem', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Status</th>
//                                         <th style={{ padding: '0.5rem 1rem', textAlign: 'center', fontSize: '0.8rem', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Actions</th>
//                                     </tr>
//                                 </thead>
//                                 <tbody>
//                                     {getData().map(item => (
//                                         <tr key={item.id} className="table-row" onClick={() => handleRowClick(item.id)}>
//                                             <td className="table-cell"><input type="checkbox" /></td>
//                                             <td className="table-cell">{item.editable ? <input type="text" value={item.id} onChange={(e) => setData(data.map(i => i.id === item.id ? { ...i, id: e.target.value } : i))} /> : item.id}</td>
//                                             <td className="table-cell">{item.editable ? <input type="text" value={item.name} onChange={(e) => setData(data.map(i => i.id === item.id ? { ...i, name: e.target.value } : i))} /> : item.name}</td>
//                                             <td className="table-cell">{item.editable ? <input type="text" value={item.type} onChange={(e) => setData(data.map(i => i.id === item.id ? { ...i, type: e.target.value } : i))} /> : item.type}</td>
//                                             <td className="table-cell">{item.editable ? <input type="text" value={item.address} onChange={(e) => setData(data.map(i => i.id === item.id ? { ...i, address: e.target.value } : i))} /> : item.address}</td>
//                                             <td className="table-cell">{item.editable ? <input type="text" value={item.created_at} onChange={(e) => setData(data.map(i => i.id === item.id ? { ...i, created_at: e.target.value } : i))} /> : item.created_at}</td>
//                                             <td className="table-cell" style={{ color: item.status === 'Active' ? 'green' : 'red' }}>
//                                                 {item.status}
//                                             </td>
//                                             <td className="table-cell">
//                                                 {item.editable ? (
//                                                     <div>
//                                                         <button onClick={() => handleSave(item.id)} style={{ cursor: 'pointer', marginRight: '0.5rem', color: 'blue' }}>Save</button>
//                                                         <button onClick={handleCancelEdit} style={{ cursor: 'pointer', color: 'gray' }}>Cancel</button>
//                                                     </div>
//                                                 ) : (
//                                                     <>
//                                                         <MdEdit onClick={() => handleEdit(item.id)} style={{ cursor: 'pointer', marginRight: '0.5rem', color: 'blue' }} />
//                                                         <MdDelete onClick={() => handleDelete(item.id)} style={{ cursor: 'pointer', color: 'red' }} />
//                                                     </>
//                                                 )}
//                                             </td>
//                                         </tr>
//                                     ))}
//                                 </tbody>
//                             </table>
//                         </div>
//                     </div>

//                     {/* Delete Confirmation Modal */}
//                     {modalOpen && (
//                         <div className="modal-overlay">
//                             <div className="modal">
//                                 <div className="modal-content">
//                                     <span className="close" onClick={closeModal}>&times;</span>
//                                     <h2>Confirm Delete</h2>
//                                     <p>Are you sure you want to delete this item?</p>
//                                     <div className="modal-actions">
//                                         <button onClick={confirmDelete}>Yes</button>
//                                         <button onClick={closeModal}>No</button>
//                                     </div>
//                                 </div>
//                             </div>
//                         </div>
//                     )}

//                     {/* Edit Modal */}
                    
//                     {/* {selectedId && (
//                         <EditPropertyUI
//                         editItemId={selectedId}
//                         onClose={handleClose}
//                         />
//                     )} */}

//                 </div>
//             </Box>
//     //</Grid>
//     // </Grid>
//     );
// }
