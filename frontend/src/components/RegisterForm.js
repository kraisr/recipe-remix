import React, { useState } from 'react';
import { Button, TextField, Container, Typography, InputAdornment, IconButton } from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { useNavigate } from 'react-router-dom';

const RegisterForm = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log('First Name:', firstName);
    console.log('Last Name:', lastName);
    console.log('Email:', email);
    console.log('Password:', password);
    console.log('Confirm Password:', confirmPassword);
  };

  const handleLoginClick = () => {
    navigate('/Login');
  };

  return (
    <Container component="main" maxWidth="xs">
      <Typography variant="h5">Register</Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          variant="outlined"
          margin="normal"
          required
          fullWidth
          id="firstName"
          label="First Name"
          name="firstName"
          autoFocus
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          sx={{ bgcolor: '#fbf2cf' }}
        />
        <TextField
          variant="outlined"
          margin="normal"
          required
          fullWidth
          id="lastName"
          label="Last Name"
          name="lastName"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          sx={{ bgcolor: '#fbf2cf' }}
        />
        <TextField
          variant="outlined"
          margin="normal"
          required
          fullWidth
          id="email"
          label="Email Address"
          name="email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          sx={{ bgcolor: '#fbf2cf' }}
        />
        <TextField
          variant="outlined"
          margin="normal"
          required
          fullWidth
          name="password"
          label="Password"
          type={showPassword ? 'text' : 'password'}
          id="password"
          autoComplete="new-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          sx={{ bgcolor: '#fbf2cf' }}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <Visibility /> : <VisibilityOff />}
                </IconButton>
              </InputAdornment>
            )
          }}
        />
        <TextField
          variant="outlined"
          margin="normal"
          required
          fullWidth
          name="confirmPassword"
          label="Confirm Password"
          type={showPassword ? 'text' : 'password'}
          id="confirmPassword"
          autoComplete="new-password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          sx={{ bgcolor: '#fbf2cf' }}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <Visibility /> : <VisibilityOff />}
                </IconButton>
              </InputAdornment>
            )
          }}
        />
        <Button
          type="submit"
          fullWidth
          variant="contained"
          sx={{ 
              mt: 2, 
              backgroundColor: '#fa7070',
              color: '#fff',
              '&:hover': {
                  backgroundColor: '#e64a4a',
              }
          }}
        >
          Register
        </Button>
        <Button
          type="button"
          fullWidth
          variant="contained"
          sx={{ 
              mt: 2, 
              backgroundColor: '#455A64',
              color: '#FFFFFF',
              '&:hover': {
                  backgroundColor: '#607D8B',
              }
          }}
          onClick={handleLoginClick}
        >
          Already have an account? Login
        </Button>
      </form>
    </Container>
  );
};

export default RegisterForm;
