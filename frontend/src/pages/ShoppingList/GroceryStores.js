import React, { useState, useEffect } from "react";
import { 
  Box, 
  Container, 
  Typography, 
  TextField, 
  Button, 
  FormControlLabel, 
  Checkbox, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem 
} from "@mui/material";
import MapComponent from "../../components/MapComponent/MapComponent";

function GroceryStores() {
  const [location, setLocation] = useState(null);
  const [address, setAddress] = useState("");
  const [isOpenNow, setIsOpenNow] = useState(false);
  const [distance, setDistance] = useState(5000); // default to 5km


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
  }, [isOpenNow, distance]);

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

  const textFieldStyles = {
    bgcolor: "#e7ede6",
    width: '88%',
    "& label.Mui-focused": {
      color: "#000",
    },
    "& .MuiOutlinedInput-root": {
      "& fieldset": {
        borderColor: "#a1c298",
      },
      "&:hover fieldset": {
        borderColor: "#88b083",
      },
      "&.Mui-focused fieldset": {
        borderColor: "#6b9466",
      },
    }
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
          <MapComponent 
            startingPoint={location}
            isOpenNow={isOpenNow}
            distance={distance}
          />

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
          sx={textFieldStyles}
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

      <Box sx={{ mt: 2, width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        
        <FormControl variant="outlined" sx={{ minWidth: 120, backgroundColor: '#e7ede6' }}>
          <InputLabel sx={{ "&.Mui-focused": { color: "black" } }}>Distance</InputLabel>
          <Select
            value={distance}
            onChange={(e) => setDistance(e.target.value)}
            label="Distance"
            sx={{
              "& .MuiOutlinedInput-root": {
                "&.Mui-focused fieldset": {
                  borderColor: "black",
                },
              },
            }}
          >
            <MenuItem value={1000}>1 km</MenuItem>
            <MenuItem value={5000}>5 km</MenuItem>
            <MenuItem value={10000}>10 km</MenuItem>
            <MenuItem value={20000}>20 km</MenuItem>
          </Select>
        </FormControl>

        <FormControlLabel
          control={
            <Checkbox 
              checked={isOpenNow} 
              onChange={(e) => setIsOpenNow(e.target.checked)} 
              sx={{ color: '#e57373', '&.Mui-checked': { color: '#e53935' } }}
            />
          }
          label="Open Now"
        />

      </Box>

    </Box>
  );
};

export default GroceryStores;