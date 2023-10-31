import React, { useState, useEffect } from 'react';
import './preferences.css';
import SearchBar from '../../components/Searchbar/Searchbar.js';
import { Formik, Form, Field } from 'formik';
import { Box, Button, Checkbox, FormControlLabel, Typography, ThemeProvider, createTheme } from '@mui/material';

const Preferences = () => {
  const [preferences, setPreferences] = useState({
    lactoseIntolerance: false,
    glutenIntolerance: false,
    vegetarianism: false,
    veganism: false,
    kosher: false,
    keto: false,
    diabetes: false,
    nutAllergies: false,
    dairyFree: false,
    others: false,
  });
  const [showSaveCancel, setShowSaveCancel] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [currentPreferenceIndex, setCurrentPreferenceIndex] = useState(0);
  const preferenceKeys = Object.keys(preferences);
  const currentPreferenceKey = preferenceKeys[currentPreferenceIndex];
  const isLastPreference = currentPreferenceIndex === preferenceKeys.length - 1;
  const [showSummary, setShowSummary] = useState(false);
  const [showIntro, setShowIntro] = useState(true);
  const [editing, setEditing] = useState(false);
  const [previousScreen, setPreviousScreen] = useState('intro'); // 'intro' or 'summary'


  useEffect(() => {
    const fetchUserPreferences = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('No token found');
        }

        const response = await fetch("http://localhost:8080/user/user", {
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
          method: "GET",
        });

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const data = await response.json();
        console.log(data.email);
        setUserEmail(data.email);
        setPreferences(data.preferences);
      } catch (error) {
        console.error('Error fetching user preferences:', error);
      }
    };

    fetchUserPreferences();
  }, []);

  const handleUpdatePreferences = async () => {
    try {
      const response = await fetch("http://localhost:8080/user/update-preferences", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: userEmail,
          preferences: preferences
        }),
      });
  
      // Check if the response is ok (status 200-299)
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
  
      // Optional: Update UI to reflect changes
      // For example, show a success message to the user
      console.log("Preferences saved successfully!");
  
    } catch (error) {
      // Handle errors: show a message to the user, log, etc.
      console.error('Error saving preferences:', error);
    }
  };

  const handleCancelPreferences = () => {
    // Add your code for canceling preferences here
  };

  const descriptions = {
    lactoseIntolerance: 'This option is for individuals who cannot digest lactose, a sugar found in milk and dairy products.',
    glutenIntolerance: 'This option is for individuals who experience adverse reactions to gluten, a protein found in wheat, barley, and rye.',
    vegetarianism: 'This option is for individuals who do not consume meat.',
    veganism: 'This option is for individuals who do not consume any animal products.',
    kosher: 'This option is for individuals who adhere to kosher dietary laws.',
    keto: 'This option is for individuals following a ketogenic diet, which is low in carbs and high in fats.',
    diabetes: 'This option is for individuals with diabetes who need to monitor their carbohydrate intake.',
    nutAllergies: 'This option is for individuals who have allergies to nuts.',
    dairyFree: 'This option is for individuals who avoid all dairy products.',
    others: 'This option is for individuals who have other dietary restrictions and preferences.'
  };

  const handlePreferenceSelection = (preference, value) => {
    setPreferences((prevPreferences) => ({
      ...prevPreferences,
      [preference]: value,
    }));
    
    if (!isLastPreference) {
      setCurrentPreferenceIndex((prevIndex) => prevIndex + 1);
    } else {
      setShowSummary(true);
    }
  };

  const startSurvey = () => {
    setPreviousScreen('intro');
    setShowIntro(false);
    setShowSummary(false);
    setEditing(false);
  };

  const handleEdit = () => {
    setShowIntro(false);
    setShowSummary(false);
    setEditing(true);
  };

  const handleEditFromIntro = () => {
    setPreviousScreen('intro');
    handleEdit();
  };

  const handleEditFromSummary = () => {
    setPreviousScreen('summary');
    handleEdit();
  };

  const handleDoneEditing = () => {
    setEditing(false);
    handleUpdatePreferences();
    if (previousScreen === "intro") {
      setShowIntro(true);
    } else {
      setShowSummary(true);
    }
  };

  const handleCheckboxChangeInEdit = (preference) => {
    setPreferences((prevPreferences) => ({
      ...prevPreferences,
      [preference]: !prevPreferences[preference],
    }));
  };
  
  const handleSubmit = async (values) => {
    // handleUpdatePreferences();
    setCurrentPreferenceIndex(0);
    setPreviousScreen("intro");
    setShowIntro(true);
    setShowSummary(false);
    handleDoneEditing();
  };

  function formatPreferenceKey(key) {
    return key
        .replace(/([A-Z])/g, ' $1')
        .replace(/^./, (str) => str.toUpperCase());
  }

  const theme = createTheme({
    palette: {
      primary: {
        main: '#fa7070',
      },
    },
  });

  return (
    <Formik initialValues={preferences} onSubmit={handleSubmit}>
      {({ values }) => (
        <Form>
          <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            bgcolor: '#a1c298',
            borderRadius: '8px',
            p: 4,
            width: ['90%', '60%', '40%', '30%'],
            mx: 'auto',
            my: 4,
            textAlign: 'center',
          }}>
            {showIntro ? (
              <>
                <Typography variant="h4" mb={3} fontWeight="bold">
                  Dietary Preferences
                </Typography>
                <Typography variant="body1" mb={3}>
                  Please take a quick survey to set your dietary restrictions and preferences:
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                  <Button
                    variant="outlined"
                    color="primary"
                    sx={{ backgroundColor: "#6c757d", color: "#fff", "&:hover": { backgroundColor: "#5a6268" } }}
                    onClick={handleEditFromIntro}
                  >
                    Edit Choices
                  </Button>
                  <Button variant="contained" color="primary"
                    sx={{ backgroundColor: "#fa7070", "&:hover": { backgroundColor: "#e64a4a" } }}
                    onClick={startSurvey}
                  >
                    Start Survey
                  </Button>
                </Box>
              </>
            ) : !showSummary && !editing ? (
              <>
                <Box mb={3} textAlign="left" width="100%">
                  <Typography variant="h6" fontWeight="bold" mb={2}>
                    {formatPreferenceKey(currentPreferenceKey)}
                  </Typography>
                  <Typography variant="body2" sx={{ ml: 5, fontStyle: 'italic', mb: 3 }}>
                    {descriptions[currentPreferenceKey]}
                  </Typography>
                  <Box textAlign="center" width="100%">
                    <Button variant="outlined"
                      sx={{ mr: 2, borderColor: '#fa7070', color: '#fa7070', "&:hover": { borderColor: "#e64a4a" } }}
                      onClick={() => handlePreferenceSelection(currentPreferenceKey, false)}
                    >
                      No, skip
                    </Button>
                    <Button variant="contained" color="primary"
                      sx={{ backgroundColor: "#fa7070", "&:hover": { backgroundColor: "#e64a4a" } }}
                      onClick={() => handlePreferenceSelection(currentPreferenceKey, true)}
                    >
                      Yes, this is a preference
                    </Button>
                  </Box>
                </Box>
              </>
            ) : showSummary && !editing ? (
              <>
                <Typography variant="h5" mb={3} fontWeight="bold">
                  Summary of your choices:
                </Typography>
                <Box component="ul" sx={{
                  listStyleType: 'none',
                  padding: 0,
                  width: '100%',
                  textAlign: 'left',
                  '& li': {
                    mb: 2,
                    fontSize: '1.1em',
                    fontWeight: 'medium'
                  }
                }}>
                  {Object.keys(preferences).map((key) => (
                    <li key={key}>
                      {formatPreferenceKey(key)}: <strong>{preferences[key] ? "Yes" : "No"}</strong>
                    </li>
                  ))}
                </Box>
                <Box sx={{ mt: 4, display: 'flex', gap: 2, justifyContent: 'center' }}>
                  <Button
                    variant="outlined"
                    color="primary"
                    sx={{ backgroundColor: "#6c757d", color: "#fff", "&:hover": { backgroundColor: "#5a6268" } }}
                    onClick={handleEditFromSummary}
                  >
                    Edit Choices
                  </Button>
                  <Button type="submit" variant="contained"
                    sx={{ backgroundColor: "#fa7070", color: "#fff", "&:hover": { backgroundColor: "#e64a4a" } }}
                  >
                    Save Preferences
                  </Button>
                </Box>
              </>
            ) : (
              <>
                <Typography variant="h5" mb={3} fontWeight="bold">
                  Edit your choices:
                </Typography>
                <Box component="ul" sx={{
                  listStyleType: 'none',
                  padding: 0,
                  width: '100%',
                  textAlign: 'left',
                  '& li': {
                    mb: 2,
                    fontSize: '1.1em',
                    fontWeight: 'medium'
                  }
                }}>
                  {Object.keys(preferences).map((key) => (
                    <li key={key}>
                      <Checkbox
                        checked={preferences[key]}
                        onChange={() => handleCheckboxChangeInEdit(key)}
                        color="primary"
                      />
                      {formatPreferenceKey(key)}
                    </li>
                  ))}
                </Box>
                <Box sx={{ mt: 4, display: 'flex', gap: 2, justifyContent: 'center' }}>
                  <Button
                    variant="outlined"
                    color="primary"
                    sx={{ backgroundColor: "#fa7070", color: "#fff", "&:hover": { backgroundColor: "#e64a4a" }, mt: 4 }}
                    onClick={handleDoneEditing}
                  >
                    Done Editing
                  </Button>
                </Box>
              </>
            )}
          </Box>
        </Form>
      )}
    </Formik>
  );
  
};

export default Preferences;