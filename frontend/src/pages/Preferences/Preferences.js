import React, { useState } from 'react';
import './preferences.css';

const Preferences = () => {
  const [lactoseIntolerance, setLactoseIntolerance] = useState(false);
  const [glutenIntolerance, setGlutenIntolerance] = useState(false);
  const [vegetarianism, setVegetarianism] = useState(false);
  const [veganism, setVeganism] = useState(false);
  const [kosher, setKosher] = useState(false);
  const [keto, setKeto] = useState(false);
  const [diabetes, setDiabetes] = useState(false);
  const [dairyFree, setDairyFree] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false); 
  const [showSaveCancel, setShowSaveCancel] = useState(false); 

  const handleLactoseIntoleranceChange = () => {
    setLactoseIntolerance(!lactoseIntolerance);
  };

  const handleGlutenIntoleranceChange = () => {
    setGlutenIntolerance(!glutenIntolerance);
  };

  const handleVegetarianismChange = () => {
    setVegetarianism(!vegetarianism);
  };

  const handleVeganismChange = () => {
    setVeganism(!veganism);
  };

  const handleKosherChange = () => {
    setKosher(!kosher);
  };

  const handleKetoChange = () => {
    setKeto(!keto);
  };

  const handleDiabetesChange = () => {
    setDiabetes(!diabetes);
  };

  const handleDairyFreeChange = () => {
    setDairyFree(!dairyFree);
  };

  const handleOthersChange = () => {
    setShowSaveCancel(!showSaveCancel);
  };

  const handleSavePreferences = () => {
    setShowSaveCancel(false);
  };

  const handleCancelPreferences = () => {
    setShowSaveCancel(false);
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
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
                checked={lactoseIntolerance}
                onChange={handleLactoseIntoleranceChange}
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
                checked={glutenIntolerance}
                onChange={handleGlutenIntoleranceChange}
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
                checked={vegetarianism}
                onChange={handleVegetarianismChange}
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
                checked={veganism}
                onChange={handleVeganismChange}
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
                checked={kosher}
                onChange={handleKosherChange}
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
                checked={keto}
                onChange={handleKetoChange}
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
                checked={diabetes}
                onChange={handleDiabetesChange}
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
                checked={dairyFree}
                onChange={handleDairyFreeChange}
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
                onChange={handleOthersChange}
              />
              <span className="checkmark"></span>
            </label>
            <p style={{ fontStyle: 'italic', fontSize: '14px', marginLeft: '40px' }}>
              This option is for individuals who have other dietary restrictions and preferences.
            </p>
          </li>
        </ul>
      </div>

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
