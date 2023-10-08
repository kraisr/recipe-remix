import React, { useState } from 'react';
import { Button, TextField, Container, Typography, InputAdornment, IconButton } from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { useNavigate } from 'react-router-dom';

const LoginForm = ({ onNavigateToRegister }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleRegisterClick = () => {
    navigate('/Register');
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    // Perform login logic here (e.g., API call)
    console.log('Email:', email);
    console.log('Password:', password);
  };

  return (
    <Container component="main" maxWidth="xs">
      <Typography variant="h5">Login</Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          variant="outlined"
          margin="normal"
          required
          fullWidth
          id="email"
          label="Email Address"
          name="email"
          autoComplete="email"
          autoFocus
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
          autoComplete="current-password"
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
        <Button
          type="submit"
          fullWidth
          variant="contained"
          sx={{ 
              mt: 2, 
              backgroundColor: '#fa7070',
              color: '#fff',
              '&:hover': {
                  backgroundColor: '#e64a4a',  // Darker red on hover
              }
          }}
        >
          Login
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
          onClick={handleRegisterClick}
        >
          Don't have an account? Register
        </Button>
      </form>
    </Container>
  );
};

export default LoginForm;
