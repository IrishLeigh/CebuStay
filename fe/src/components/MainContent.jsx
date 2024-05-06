// MainContent.jsx

import React from 'react';
import './MainContent.css';
import { MdArrowForward, MdBookOnline, MdForward } from 'react-icons/md';

const MainContent = () => {
  return (
     
    <div className="main-content">

    
      {/* Top Row */}
     
      <div className="row">
     
      <div className="card">
    <div className="card-img">
    <img src="/place2.jpeg" alt="place2" />
    </div>
    <div className="card-info">
        <p className="text-title">Megaworld, Cebu</p>
        <p className="text-body">1,000 kilometers away</p>
    </div>
    <div className="card-footer">
        <span className="text-title">₱1,400/night</span>
        <div className="card-button">
            <MdForward />
        </div>
    </div>
</div>

        <div className="card">
          <div className="card-img">    
          <img src="/place2.jpeg" alt="place2" />
          </div>
          <div className="card-info">
          <p className="text-title">Megaworld, Cebu</p>
          <p className="text-body">1,000 kilometers away</p>
          </div>
          <div className="card-footer">
          <span className="text-title">₱1,400/night</span>
          <div className="card-button">
              <MdForward />

             
            </div>
          </div>
        </div>
        <div className="card">
          <div className="card-img">    
          <img src="/place2.jpeg" alt="place2" />
          </div>
          <div className="card-info">
          <p className="text-title">Megaworld, Cebu</p>
          <p className="text-body">1,000 kilometers away</p>
          </div>
          <div className="card-footer">
          <span className="text-title">₱1,400/night</span>
          <div className="card-button">
              <MdForward />

             
            </div>
          </div>
        </div>
      </div>
      
      {/* Bottom Row */}
      <div className="row">
        <div className="card">
          <div className="card-img">
          <img src="/place2.jpeg" alt="place2" />
          </div>
          <div className="card-info">
          <p className="text-title">Megaworld, Cebu</p>
          <p className="text-body">1,000 kilometers away</p>
          </div>
          <div className="card-footer">
          <span className="text-title">₱1,400/night</span>
            <div className="card-button">
              <MdForward />

             
            </div>
          </div>
        </div>
        <div className="card">
          <div className="card-img">
          <img src="/place2.jpeg" alt="place2" />

          </div>
          <div className="card-info">
          <p className="text-title">Megaworld, Cebu</p>
          <p className="text-body">1,000 kilometers away</p>
          </div>
          <div className="card-footer">
          <span className="text-title">₱1,400/night</span>
            <div className="card-button">
              <MdForward />

             
            </div>
          </div>
        </div>
        <div className="card">
          <div className="card-img">
          <img src="/place2.jpeg" alt="place2" />

          </div>
          <div className="card-info">
          <p className="text-title">Megaworld, Cebu</p>
          <p className="text-body">1,000 kilometers away</p>
          </div>
          <div className="card-footer">
            <span className="text-title">₱1,400/night</span>
            <div className="card-button">
              <MdForward />

             
            </div>
          </div>
        </div>
      </div>
      <div className="row">
        <div className="card">
          <div className="card-img">
          <img src="/place2.jpeg" alt="place2" />

          </div>
          <div className="card-info">
          <p className="text-title">Megaworld, Cebu</p>
            <p className="text-body">1,000 kilometers away</p>
          </div>
          <div className="card-footer">
          <span className="text-title">₱1,400/night</span>
            <div className="card-button">
              <MdForward />

             
            </div>
          </div>
        </div>
        <div className="card">
          <div className="card-img">
          <img src="/place2.jpeg" alt="place2" />

          </div>
          <div className="card-info">
          <p className="text-title">Megaworld, Cebu</p>
            <p className="text-body">1,000 kilometers away</p>
          </div>
          <div className="card-footer">
          <span className="text-title">₱1,400/night</span>
            <div className="card-button">
              <MdForward />

             
            </div>
          </div>
        </div>
        <div className="card">
          <div className="card-img">
          <img src="/place2.jpeg" alt="place2" />

          </div>
          <div className="card-info">
            <p className="text-title">Megaworld, Cebu</p>
            <p className="text-body">1,000 kilometers away</p>
          </div>
          <div className="card-footer">
          <span className="text-title">₱1,400/night</span>
            <div className="card-button">
              <MdForward />

             
            </div>
          </div>
        </div>
      </div>
    </div>
    
  );
};

export default MainContent;
