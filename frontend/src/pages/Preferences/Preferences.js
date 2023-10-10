import React, { useState, useEffect } from 'react';
import './preferences.css';
import SearchBar from '../../components/Searchbar/Searchbar.js';

const Preferences = () => {
  const [showSaveCancel, setShowSaveCancel] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [preferences, setPreferences] = useState({
    lactoseIntolerance: false,
    glutenIntolerance: false,
    vegetarianism: false,
    veganism: false,
    kosher: false,
    keto: false,
    diabetes: false,
    dairyFree: false,
    others: false,
  });

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

  const handleCheckboxChange = async (preferenceName) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No token found');
      }

      const updatedValue = !preferences[preferenceName];
      const response = await fetch("http://localhost:8080/pref/pref", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: userEmail,
          preferenceName: preferenceName,
          updatedValue: updatedValue,
        }),
      });

      if (response.ok) {
        // Update the local state with the new preference value
        setPreferences((prevPreferences) => ({
          ...prevPreferences,
          [preferenceName]: updatedValue,
        }));
        console.log(`Updated ${preferenceName} preference successfully. `, updatedValue);
      } else {
        console.error(`Failed to update ${preferenceName} preference.`);
      }
    } catch (error) {
      console.error(`Error updating ${preferenceName} preference:`, error);
    }
  };

  const handleSavePreferences = () => {
    // Add your code for saving preferences here
  };

  const handleCancelPreferences = () => {
    // Add your code for canceling preferences here
  };

  return (
    <div>
      <div className="dietary-preferences-container">
        <h2 style={{ fontSize: '18px' }}>
          Please set your dietary restrictions and preferences below:
        </h2>
        <ul style={{ listStyleType: 'none' }}>
          <li>
            <label className="checkbox-label" style={{ fontSize: '30px' }}>
              Lactose Intolerance
              <input
                type="checkbox"
                name="lactoseIntolerance"
                className="checkbox-input"
                checked={preferences.lactoseIntolerance}
                onChange={() => handleCheckboxChange('lactoseIntolerance')}
              />
              <span className="checkmark"></span>
            </label>
            <p style={{ fontStyle: 'italic', fontSize: '14px', marginLeft: '40px' }}>
              This option is for individuals who cannot digest lactose, a sugar found in milk and dairy products.
            </p>
          </li>
          <li>
            <label className="checkbox-label" style={{ fontSize: '30px' }}>
              Gluten Intolerance or Sensitivity
              <input
                type="checkbox"
                name="glutenIntolerance"
                className="checkbox-input"
                checked={preferences.glutenIntolerance}
                onChange={() => handleCheckboxChange('glutenIntolerance')}
              />
              <span className="checkmark"></span>
            </label>
            <p style={{ fontStyle: 'italic', fontSize: '14px', marginLeft: '40px' }}>
              This option is for individuals who experience adverse reactions to gluten, a protein found in wheat, barley, and rye.
            </p>
          </li>
          <li>
            <label className="checkbox-label" style={{ fontSize: '30px' }}>
              Vegetarianism
              <input
                type="checkbox"
                name="vegetarianism"
                className="checkbox-input"
                checked={preferences.vegetarianism}
                onChange={() => handleCheckboxChange('vegetarianism')}
              />
              <span className="checkmark"></span>
            </label>
            <p style={{ fontStyle: 'italic', fontSize: '14px', marginLeft: '40px' }}>
              This option is for individuals who do not consume meat.
            </p>
          </li>
          <li>
            <label className="checkbox-label" style={{ fontSize: '30px' }}>
              Veganism
              <input
                type="checkbox"
                name="veganism"
                className="checkbox-input"
                checked={preferences.veganism}
                onChange={() => handleCheckboxChange('veganism')}
              />
              <span className="checkmark"></span>
            </label>
            <p style={{ fontStyle: 'italic', fontSize: '14px', marginLeft: '40px' }}>
              This option is for individuals who do not consume any animal products.
            </p>
          </li>
          <li>
            <label className="checkbox-label" style={{ fontSize: '30px' }}>
              Kosher
              <input
                type="checkbox"
                name="kosher"
                className="checkbox-input"
                checked={preferences.kosher}
                onChange={() => handleCheckboxChange('kosher')}
              />
              <span className="checkmark"></span>
            </label>
            <p style={{ fontStyle: 'italic', fontSize: '14px', marginLeft: '40px' }}>
              This option is for individuals who adhere to kosher dietary laws.
            </p>
          </li>
          <li>
            <label className="checkbox-label" style={{ fontSize: '30px' }}>
              Keto
              <input
                type="checkbox"
                name="keto"
                className="checkbox-input"
                checked={preferences.keto}
                onChange={() => handleCheckboxChange('keto')}
              />
              <span className="checkmark"></span>
            </label>
            <p style={{ fontStyle: 'italic', fontSize: '14px', marginLeft: '40px' }}>
              This option is for individuals following a ketogenic diet, which is low in carbs and high in fats.
            </p>
          </li>
          <li>
            <label className="checkbox-label" style={{ fontSize: '30px' }}>
              Diabetes
              <input
                type="checkbox"
                name="diabetes"
                className="checkbox-input"
                checked={preferences.diabetes}
                onChange={() => handleCheckboxChange('diabetes')}
              />
              <span className="checkmark"></span>
            </label>
            <p style={{ fontStyle: 'italic', fontSize: '14px', marginLeft: '40px' }}>
              This option is for individuals with diabetes who need to monitor their carbohydrate intake.
            </p>
          </li>
          <li>
            <label className="checkbox-label" style={{ fontSize: '30px' }}>
              Dairy-free
              <input
                type="checkbox"
                name="dairyFree"
                className="checkbox-input"
                checked={preferences.dairyFree}
                onChange={() => handleCheckboxChange('dairyFree')}
              />
              <span className="checkmark"></span>
            </label>
            <p style={{ fontStyle: 'italic', fontSize: '14px', marginLeft: '40px' }}>
              This option is for individuals who avoid all dairy products.
            </p>
          </li>
          <li>
            <label className="checkbox-label" style={{ fontSize: '30px' }}>
              Others
              <input
                type="checkbox"
                name="others"
                className="checkbox-input"
                checked={preferences.others}
                onChange={() => handleCheckboxChange('others')}
              />
              <span className="checkmark"></span>
            </label>
            <p style={{ fontStyle: 'italic', fontSize: '14px', marginLeft: '40px' }}>
              This option is for individuals who have other dietary restrictions and preferences.
            </p>
          </li>
        </ul>
      </div>

      {showSaveCancel && <SearchBar />}

      {showSaveCancel && (
        <div className="save-cancel-buttons">
          <button className="save-button" onClick={handleSavePreferences}>
            Save
          </button>
          <button className="cancel-button" onClick={handleCancelPreferences}>
            Cancel
          </button>
        </div>
      )}
    </div>
  );
};

export default Preferences;
