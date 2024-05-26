import React from 'react';
import './Popular.css';
import { MdForward } from 'react-icons/md';

export const hiddenGemsData = [
  {
    title: "Paradise Beach",
    location: "Bantayan Island",
    imageUrl: "/paradise.png",
    altText: "paradise12641"
  },
  {
    title: "Hermit’s Cove",
    location: "Aloguinsan",
    imageUrl: "/hermitscove.png",
    altText: "hermitscove12640"
  },
  {
    title: "Aguinid Falls",
    location: "Samboan",
    imageUrl: "/aguinidfalls.png",
    altText: "aguinidfalls12640"
  }
];

function BackgroundShape() {
  return (
    <>
      {/* <svg className="background-shape background-shape-left" viewBox="0 0 600 250" preserveAspectRatio="none">
        <path d="M0,250 Q300,0 800,250 L600,0 L1,0 Z" fill="lightblue" />
      </svg> */}
      <svg className="background-shape background-shape-" viewBox="0 0 800 250" preserveAspectRatio="none">
        <path d="M0,0 Q200,0 300,125 Q400,250 800,250 L800,0 Z" fill="lightblue" />
      </svg>
    </>
  );
}


const Popular = (props) => {
import { MdForward } from 'react-icons/md';

export const hiddenGemsData = [
  {
    title: "Paradise Beach",
    location: "Bantayan Island",
    imageUrl: "/paradise.png",
    altText: "paradise12641"
  },
  {
    title: "Hermit’s Cove",
    location: "Aloguinsan",
    imageUrl: "/hermitscove.png",
    altText: "hermitscove12640"
  },
  {
    title: "Aguinid Falls",
    location: "Samboan",
    imageUrl: "/aguinidfalls.png",
    altText: "aguinidfalls12640"
  }
];

function BackgroundShape() {
  return (
    <>
      {/* <svg className="background-shape background-shape-left" viewBox="0 0 600 250" preserveAspectRatio="none">
        <path d="M0,250 Q300,0 800,250 L600,0 L1,0 Z" fill="lightblue" />
      </svg> */}
      <svg className="background-shape background-shape-" viewBox="0 0 800 250" preserveAspectRatio="none">
        <path d="M0,0 Q200,0 300,125 Q400,250 800,250 L800,0 Z" fill="lightblue" />
      </svg>
    </>
  );
}


const Popular = (props) => {
  return (
    // <div className="frame471-container">
      <div className="frame481-frame481">
        <BackgroundShape/>
        <div className="frame471-group214">
          <span className="frame481-text" style={{marginTop:'1rem', textAlign:'center'}}>
            <span style={{ marginLeft: '3rem', textAlign:'center' }}>Nearby Places</span>
          </span>
          <span className="frame471-text02">
            <span style={{ marginLeft: '3.5rem' }}>
            Discover the Unseen: Endless adventures just around the corner. 
         </span>
          </span>
        </div>

        <div className="card-container3">
          {hiddenGemsData.map((gem, index) => (
            <div className="card3" key={index}>
              <img
                src={gem.imageUrl}
                alt={gem.altText}
                className="card-image3"
              />
              <span className="card-text3">
                <span>{gem.title}</span>
                <br />
                <span>{gem.location}</span>
              </span>
              <button className="see-more-button" >
                See More <MdForward />
              </button>
            </div>
          ))}

        <div className="card-container3">
          {hiddenGemsData.map((gem, index) => (
            <div className="card3" key={index}>
              <img
                src={gem.imageUrl}
                alt={gem.altText}
                className="card-image3"
              />
              <span className="card-text3">
                <span>{gem.title}</span>
                <br />
                <span>{gem.location}</span>
              </span>
              <button className="see-more-button" >
                See More <MdForward />
              </button>
            </div>
          ))}
        </div>

       

       
      </div>
    // </div>
    // </div>
  );
}

export default Popular;