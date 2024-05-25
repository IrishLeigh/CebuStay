import React from 'react';
import './Hidden.css';
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
  },
   {
    title: "Aguinid Falls",
    location: "Samboan",
    imageUrl: "/aguinidfalls.png",
    altText: "aguinidfalls12640"
  },
  {
    title: "Sirao Pictorial Garden",
    location: "Liloan",
    imageUrl: "/sirao.png",
    altText: "sirao12640"
  }
];

const Hidden = (props) => {
  return (
    <div className="frame471-container">
      <div className="frame471-frame471">
        <div className="frame471-group214">
          <span className="frame471-text" style={{margin:'16px 0px 0px 0px'}}>
           Hidden Gems
          </span>
          <span className="frame471-text02" style={{margin:'0px', marginTop:'8px'}}>
              Discover the Untouched Wonders of Nature's Hidden Havens
          </span>
        </div>

        <div className="card-container2">
          {hiddenGemsData.map((gem, index) => (
            <div className="card2" key={index}>
              <img
                src={gem.imageUrl}
                alt={gem.altText}
                className="card-image2"
              />
              <span className="card-text2">
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
    </div>
  );
}

export default Hidden;