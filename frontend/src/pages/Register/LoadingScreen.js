import React from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';

const LoadingScreen = () => {
  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      minHeight="35vh"
    //   bgcolor="#fbf2cf"
    >
      <CircularProgress
        sx={{
          color: "#fa7070",
          marginBottom: "1rem",
        }}
        size={60}
      />
      <Typography
        variant="h6"
        sx={{
          color: '#000',
          fontWeight: 'bold',
        }}
      >
        Creating Account...
      </Typography>
    </Box>
  );
};

export default LoadingScreen;
