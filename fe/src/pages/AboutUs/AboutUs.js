// AboutUs.js
import React from 'react';
import { Grid, Typography } from '@mui/material';
import './AboutUs.css';
import HeaderNoUser from '../../components/Header/HeaderNoUser';
import MapIcon from '@mui/icons-material/Map'; // Example for Interactive Map
import HomeWorkIcon from '@mui/icons-material/HomeWork'; // Example for Property Explorer
import LockIcon from '@mui/icons-material/Lock'; // Example for Secure Booking
import PersonIcon from '@mui/icons-material/Person'; // Example for User Management
import BuildIcon from '@mui/icons-material/Build'; // Example for Property Management
import bgabout from './bgabout.png';  // Adjust the path if needed


const features = [
  {
    title: 'Interactive Map',
    description: 'Explore Cebu’s key destinations with our interactive map for an easier and more fun travel experience.',
    color: '#007BFF', // Blue
    icon: <MapIcon fontSize="large" style={{ color: '#007BFF' }} />, // Add icon
  },
  {
    title: 'Property Explorer',
    description: 'Discover the best properties available for your stay in Cebu with a user-friendly search interface.',
    color: '#6A1B9A', // Purple
    icon: <HomeWorkIcon fontSize="large" style={{ color: '#6A1B9A' }} />, // Add icon
  },
  {
    title: 'Secure Booking & Reservation Management',
    description: 'Book properties securely with a seamless reservation system that guarantees your peace of mind.',
    color: '#D32F2F', // Red
    icon: <LockIcon fontSize="large" style={{ color: '#D32F2F' }} />, // Add icon
  },
  {
    title: 'User Management',
    description: 'Efficiently manage users with easy-to-use tools for both hosts and travelers alike.',
    color: '#FEC536', // Yellow
    icon: <PersonIcon fontSize="large" style={{ color: '#FEC536' }} />, // Add icon
  },
  {
    title: 'Property Management',
    description: 'Simplify property management with tools for tracking availability, bookings, and maintenance.',
    color: '#388E3C', // Green
    icon: <BuildIcon fontSize="large" style={{ color: '#388E3C' }} />, // Add icon
  },
];
const teamMembers = [
  {
    name: "Irish Leigh San Juan",
    title: "Frontend Developer",
    image: "/irish.jpg", // Public folder image
  },
  {
    name: "Robert Amaba",
    title: "Backend Developer",
    image: "/berto.jpg", // Public folder image
  },
  {
    name: "Ludivico M. Balatero",
    title: "UI/UX Designer",
    image: "/ludi.jpeg", // Public folder image
  },
  {
    name: "Katrina Dela Pena",
    title: "Project Manager",
    image: "/KAT.jpg", // Public folder image
  },
  {
    name: "Rhadiel S. Escario",
    title: "DevOps Engineer",
    image: "/aboutrad.png", // Public folder image, adjust file name if incorrect
  },
];


const AboutUs = () => {
  return (
    <div className="about-us">
      <HeaderNoUser />

      {/* Hero Section */}
      <section className="hero">
        <img src="/abouthero.jpg" alt="About Hero" className="hero-image" />
      </section>

      {/* Mission Section */}
      <section className="mission">
        <div className="mission-content">
          <h1 style={{ color: '#FEC536' }}>
            OUR <span className="yellow">MISSION</span>
          </h1>
          <p>
            Our mission is to enhance local tourism by helping you explore Cebu with a heart—making travel easy, secure, and memorable. Whether you're a local resident looking to explore more of Cebu or an international tourist planning your next getaway, CebuStay is here to provide you with a seamless and enriching experience.
          </p>
        </div>
      </section>

      {/* Features Section */}
      <section className="features">
        <div className="features-grid">
          {features.map((feature, index) => (
            <div className="feature-card" key={index}>
              <div className="icon">{feature.icon}</div> {/* Icon Section */}
              <div className="divider-title" style={{ backgroundColor: feature.color }}></div>
              <Typography className="feature-title" style={{ color: feature.color, fontSize: '24px', marginBottom: '0.5rem' }}>
                {feature.title}
              </Typography>
              <Typography className="feature-description">
                {feature.description}
              </Typography>
            </div>
          ))}
        </div>
      </section>
      <section
  className="team-container"
  style={{
    background: `url(${bgabout}) no-repeat center center`,
    backgroundSize: 'cover', // Ensures the image covers the entire section
    minHeight: '100vh', // Ensures the section takes up at least the full height of the viewport
  }}
>
  <div className="content-container">
    <Typography variant="h2" className="team-title" style={{ fontSize: '20px' }}>
      Cebustay Developers
    </Typography>
    <Typography variant="h4" className="team-subtitle">
      Meet the Team
    </Typography>
    <Typography variant="body1" className="team-description">
      Meet our team of professionals to serve you!
    </Typography>
    <div className="about-us-card-container">
      {teamMembers.map((member, index) => (
        <div key={index} className="about-us-card">
          <img
            src={member.image}
            alt={member.name}
            className="about-us-image"
          />
          <h3 className="about-us-name">{member.name}</h3>
          <p className="about-us-title">{member.title}</p>
          <div className="card-decorative-squares">
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
      ))}
    </div>
  </div>
</section>





    </div>
  );
};

export default AboutUs;
