// Sidebar.jsx

import React from 'react';
import './SideBar.css';

export default function SideBar() {
    return (
        <div className="bg-white p-4 w-64">
            <h2 className="text-lg font-semibold" style={{textAlign:'left'}}>Places to Visit</h2>
            <p className="text-zinc-600" style={{textAlign:'left', marginTop:'-12px'}}>50 Places Found</p>
            <div className="mt-6">
                <h3 className="font-semibold" style={{textAlign:'left'}}>Availability</h3>
                <hr className="my-2"/>
                <label htmlFor="from-date" className="block text-sm font-medium text-zinc-700" style={{ textAlign: 'left', fontFamily: 'Poppins', marginLeft:"5px", fontWeight:'bold', color:'black'}}>From</label>
<input 
    type="date" 
    id="from-date" 
    name="from-date" 
    className="mt-1 block w-full px-3 py-2 border border-zinc-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" 
    style={{ width: '18rem', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)', marginBottom:'5px' }} 
/>
<label htmlFor="to-date" className="block text-sm font-medium text-zinc-700 mt-4" style={{ textAlign: 'left', fontFamily: 'Poppins', marginLeft:'5px', fontWeight:'bold', color:'black'}}>To</label>
<input 
    type="date" 
    id="to-date" 
    name="to-date" 
    className="mt-1 block w-full px-3 py-2 border border-zinc-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" 
    style={{ width: '18rem', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)' }} 
/>

            </div>
            <div className="mt-6">
                <h3 className="font-semibold">Amenities</h3>
                <hr className="my-2"/>
                <div className="sidebar">
                    <div className="flex flex-wrap gap-2">
                        <button className="button">Wi-Fi</button>
                        <button className="button">TV</button>
                        <button className="button">Kitchen</button>
                        <button className="button">Spa</button>
                        <button className="button">Fitness Center</button>
                        <button className="button">Breakfast</button>
                        <button className="button">Parking</button>
                    </div>
                </div>
            </div>
            <div className="mt-6">
  <h3 className="font-semibold">Price Range</h3>
  <hr className="my-2" />
  <input
    type="range"
    className="w-full h-2 bg-zinc-200 rounded-lg appearance-none cursor-pointer"
  style={{marginBottom:'1.5rem'}}/>
  <div className="flex justify-between">
    <input
      type="number"
      placeholder="Min"
      className="w-1/3 px-3 py-2 border border-zinc-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm"
    style={{width:'8rem'}}/>
    <input
      type="number"
      placeholder="Max"
      className="w-1/3 px-3 py-2 border border-zinc-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm"
   style={{width:'8rem'}} />
  </div>
 
</div>

            <div className="mt-6">
                <h3 className="font-semibold">Rooms and Beds</h3>
                <hr className="my-2"/>
                <div className="flex items-center gap-2">
                    <label className="text-sm">Bedrooms:</label>
                    <select className="border border-zinc-300 rounded-md text-zinc-600 h-10 pl-5 pr-10 bg-white hover:border-zinc-400 focus:outline-none appearance-none">
                        <option>Any</option>
                        <option>1</option>
                        <option>2</option>
                        <option>3</option>
                        <option>4</option>
                        <option>5</option>
                        <option>6+</option>
                    </select>
                </div>
                <div className="flex items-center gap-2 mt-4">
                    <label className="text-sm">Beds:</label>
                    <select className="border border-zinc-300 rounded-md text-zinc-600 h-10 pl-5 pr-10 bg-white hover:border-zinc-400 focus:outline-none appearance-none">
                        <option>Any</option>
                        <option>1</option>
                        <option>2</option>
                        <option>3</option>
                        <option>4</option>
                        <option>5</option>
                        <option>6+</option>
                    </select>
                </div>
                <div className="flex items-center gap-2 mt-4">
                    <label className="text-sm">Bathrooms:</label>
                    <select className="border border-zinc-300 rounded-md text-zinc-600 h-10 pl-5 pr-10 bg-white hover:border-zinc-400 focus:outline-none appearance-none">
                        <option>Any</option>
                        <option>1</option>
                        <option>2</option>
                        <option>3</option>
                        <option>4</option>
                        <option>5</option>
                        <option>6+</option>
                    </select>
                </div>
            </div>
            <div className="mt-6">
                <h3 className="font-semibold">Top-tier experiences</h3>
                <hr className="my-2"/>

<button className="w-full button-style" style={{backgroundColor: 'white', color: '#000', paddingTop: '0.5rem', paddingBottom: '0.5rem', paddingLeft: '1rem', paddingRight: '1rem', borderRadius: '0.375rem', marginTop: '0.5rem', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'}}>
        <div style={{textAlign: 'center'}}>
        <span style={{textTransform: 'uppercase', letterSpacing: '0.05em'}}>Guest Favorites</span>
        <p style={{fontSize: '0.50rem', marginTop: '0.5rem'}}>Guests’ favorite homes on CebuStays, based on their reviews</p>
        </div>
</button>
<button className="w-full button-style" style={{backgroundColor: 'white', color: '#000', paddingTop: '0.5rem', paddingBottom: '0.5rem', paddingLeft: '1rem', paddingRight: '1rem', borderRadius: '0.375rem', marginTop: '0.5rem', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'}}>
        <div style={{textAlign: 'center'}}>
        <span style={{textTransform: 'uppercase', letterSpacing: '0.05em'}}>Luxury</span>
        <p style={{fontSize: '0.50rem', marginTop: '0.5rem'}}>Exceptional homes with sophisticated design, thoroughly inspected for quality.</p>
        </div>
</button>

            </div>
            
            <div className="mt-6">
                <h3 className="font-semibold">Booking options</h3>
                <hr className="my-2"/>
                
                <div className="flex items-center justify-between">
                    <span>Allows Pets</span>
                    <input type="checkbox"/>
                </div>
                <div className="flex items-center justify-between mt-2">
                    <span>Self Check-in</span>
                    <input type="checkbox"/>
                </div>
                <div className="flex items-center justify-between mt-2">
                    <span>Free Cancellation</span>
                    <input type="checkbox"/>
                </div>
                <div className="flex items-center justify-between mt-2">
                    <span>Instant Book</span>
                    <input type="checkbox"/>
                </div>
                
            </div>
        </div>
    );
}
