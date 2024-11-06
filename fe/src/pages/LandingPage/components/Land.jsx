import * as React from 'react';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import Search from './SearchLanding';
import { lightBlue } from '@mui/material/colors';

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: 'transparent',
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
  border: 'none', // Remove grid border
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',

}));

const ImageContainer = styled('div')({
  position: 'relative',
  width: '100%',
  overflow: 'hidden',
  borderRadius: '0rem',
});

const ImageOverlay = styled('div')({
  position: 'absolute',
  top: 0,
  right: 0,
  bottom: 0,
  left: 0,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'flex-end',
  padding: '1rem',
  boxSizing: 'border-box',
});

const Title = styled('h2')({
  marginRight: '10%', // Use relative unit for responsiveness
  fontSize: '2.5vw', // Use vw unit for font size
  fontWeight: 'bold', // Apply bold font weight
  fontFamily: 'Playfair Display, serif', 
  color: '#fff',
  whiteSpace: 'pre-line', // Preserve line breaks
  lineHeight: '1.2', // Set line height
  textAlign: 'right',
});

const Description = styled('p')({
  marginRight: '10%', // Use relative unit for responsiveness
  fontSize: '1vw', // Use vw unit for font size
  lineHeight: '0.5', // Set line height for better readability
  fontFamily: 'Roboto, sans-serif', // Choose a font
  color: '#fff',
  fontWeight:'500',
  textAlign: 'left', // Align text to the left
});

export default function BasicGrid() {
  // Splitting the description into lines
  const descriptionLines = `
    Discover the world with ease through our intuitive tour finder.
    From breathtaking landscapes to cultural experiences, our app connects
    you with the best tours tailored to your interests. Explore, book, and
    embark on unforgettable adventures with us.
  `.trim().split('\n');

  // Splitting the title into lines every two words
  const titleWords = "WE FIND THE BEST TOURS FOR YOU".split(' ');
  let titleLines = [];
  let line = '';
  for (let i = 0; i < titleWords.length; i++) {
    line += titleWords[i] + ' ';
    if ((i + 1) % 2 === 0 || i === titleWords.length - 1) {
      titleLines.push(line.trim());
      line = '';
    }
  }


  function BackgroundShape() {
    return (
      <>
        <svg className="background-shape background-shape-left" viewBox="0 0 600 250" preserveAspectRatio="none">
          <path d="M0,250 Q300,0 600,250 L600,0 L0,0 Z" fill="lightblue" />
        </svg>
        <svg className="background-shape background-shape-right" viewBox="0 0 600 250" preserveAspectRatio="none">
          <path d="M0,0 L600,0 Q300,125 0,250 Z" fill="lightblue" />
        </svg>
      </>
    );
  }


  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 'calc(100vh - 64px)', backgroundColor:'lightblue' }}>
      <Grid container spacing={0}>
        <Grid item xs={12}>
          <Item sx={{ textAlign: 'center', marginTop: '0.5rem' }}>
            <ImageContainer>
              <img src="/oslobph.png" alt="" className="hero-image" loading="lazy" style={{ maxHeight: 'calc(100vh - 64px - 2rem)', width: '85%', borderRadius: '2rem', marginBottom:'1rem' }} />
              <ImageOverlay>
                <Title>
                  {titleLines.map((line, index) => (
                    <React.Fragment key={index}>
                      {line}
                      <br /> {/* Line break after each line */}
                    </React.Fragment>
                  ))}
                </Title>
                {descriptionLines.map((line, index) => (
                  <Description key={index}>{line.trim()}</Description>
                ))}
              </ImageOverlay>
            </ImageContainer>
            <Search/>
          </Item>
        </Grid>
      </Grid>
    </Box>
  );
}
