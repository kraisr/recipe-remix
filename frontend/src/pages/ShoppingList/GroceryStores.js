import React, { useState, useEffect } from "react";
import { Box, Container, Typography, TextField, Button } from "@mui/material";
import MapComponent from "../../components/MapComponent/MapComponent";

function GroceryStores() {
  const [location, setLocation] = useState(null);
  const [address, setAddress] = useState("");

  useEffect(() => {
    // Request the user's location
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          console.error("Error obtaining geolocation", error);
          // Set a default location in case of error
          setLocation({ lat: 40.4237, lng: -86.9212 }); // Purdue University's coordinates or any other default
        }
      );
    } else {
      // Set a default location if geolocation is not supported
      setLocation({ lat: 40.4237, lng: -86.9212 });
    }
  }, []);

  useEffect(() => {
    // Ensure that the google library has been loaded
    if (window.google && window.google.maps.places) {
        const autocomplete = new window.google.maps.places.Autocomplete(document.getElementById('address-input'));

        autocomplete.addListener('place_changed', () => {
            const place = autocomplete.getPlace();
            if (place.geometry) {
                const lat = place.geometry.location.lat();
                const lng = place.geometry.location.lng();
                setLocation({ lat, lng });
            }
        });
    }
  }, []);


  const handleAddressSubmit = (e) => {
    e.preventDefault();
  
    // Use Google Maps Geocoding API to get the lat/lng
    const geocoder = new window.google.maps.Geocoder();
  
    geocoder.geocode({ 'address': address }, (results, status) => {
      if (status === 'OK') {
        const lat = results[0].geometry.location.lat();
        const lng = results[0].geometry.location.lng();
        setLocation({ lat, lng });
      } else {
        alert('Geocode was not successful for the following reason: ' + status);
      }
    });
  };
  

  return (
    <Box
      sx={{
        background: '#a1c298',
        borderRadius: '8px',
        p: 2,
        mt: 3,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <Typography variant="h4" fontWeight="bold">
        Grocery Stores Nearby
      </Typography>

      {location && (
        <Box 
          sx={{ 
            width: '100%',
            height: '100%',
            mt: 2, 
            overflow: 'hidden',
            borderRadius: '8px', 
          }}
        >
          <MapComponent startingPoint={location} />
        </Box>
      )}
      <Box 
        component="form"
        onSubmit={handleAddressSubmit}
        sx={{ 
          mt: 2, 
          width: '100%',
          display: 'flex',
          justifyContent: 'space-between',
        }}
      >
        <TextField 
          id="address-input"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          label="Enter your address"
          variant="outlined"
          fullWidth
          sx={{
              "& .MuiOutlinedInput-root": {
                  "&.Mui-focused fieldset": {
                      borderColor: "black",
                  },
              },
          }}
        />
        <Button 
          type="submit" 
          variant="contained" 
          sx={{ 
              ml: 2,
              backgroundColor: '#e57373',
              '&:hover': {
                  backgroundColor: '#e53935',
              },
          }}
        >
          Search
        </Button>

      </Box>
    </Box>
  );
};

export default GroceryStores;
