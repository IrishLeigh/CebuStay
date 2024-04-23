import React, { useState } from 'react';
import { TextField, Button, Container, Grid } from '@mui/material';


export default function LoginForm (){
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

 

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleLogin = () => {
    // Here you can add your login logic, such as sending a request to your server
    console.log('Email:', email);
    console.log('Password:', password);
  };

  return (
    <Container maxWidth="xs">
      <form>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Email"
              variant="outlined"
              value={email}
              onChange={handleEmailChange}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Password"
              type="password"
              variant="outlined"
              value={password}
              onChange={handlePasswordChange}
            />
          </Grid>
          <Grid item xs={12}>
            <Button
              fullWidth
              variant="contained"
              color="primary"
              onClick={handleLogin}
            >
              Login
            </Button>
          </Grid>
        </Grid>
      </form>
    </Container>
  );
};


