import React, { useEffect, useState } from 'react';
import "./pantry.css";

const MyComponent = ({ ingredientNames, filterCriteria, onFilterChange }) => {
  const [userPreferences, setUserPreferences] = useState({
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

  const [mealFilter, setMealFilter] = useState({
    breakfast: false,
    lunch: false,
    dinner: false,
    snack: false,
  });

  const [categoryFilter, setCategoryFilter] = useState({
    nuts: false,
    dairy: false,
    gluten: false,
  });

  const [dietFilter, setDietFilter] = useState({
    carb: false,
    keto: false,
    fat: false,
    sugar: false,
    vegetarian: false,
    vegan: false,
    kosher: false,
  });

  const [servingSize, setServingSize] = useState(0);
  const [prepTime, setPrepTime] = useState(0);
  const [showMealFilter, setShowMealFilter] = useState(false);
  const [showCategoryFilter, setShowCategoryFilter] = useState(false);
  const [showDietFilter, setShowDietFilter] = useState(false);
  const [showServingFilter, setShowServingFilter] = useState(false);
  const [showPrepTimeFilter, setShowPrepTimeFilter] = useState(false);
  const [selectedDietaryFilters, setSelectedDietaryFilters] = useState([]);

  useEffect(() => {
    fetchUserPreferences();
  }, []);

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

      setUserPreferences((prevState) => ({
        ...prevState,
        lactoseIntolerance: data.preferences.lactoseIntolerance,
        glutenIntolerance: data.preferences.glutenIntolerance,
        vegetarianism: data.preferences.vegetarianism,
        veganism: data.preferences.veganism,
        kosher: data.preferences.kosher,
        keto: data.preferences.keto,
        diabetes: data.preferences.diabetes,
        nutAllergies: data.preferences.nutAllergies,
        dairyFree: data.preferences.dairyFree,
        others: data.preferences.others,
      }));

      setDietFilter((prevState) => ({
        ...prevState,
        keto: data.preferences.keto,
        vegetarian: data.preferences.vegetarianism,
        vegan: data.preferences.veganism,
        sugar: data.preferences.diabetes,
      }));
      
    } catch (error) {
      console.error('Error fetching user preferences:', error);
    }
  };

  const mapDietaryTags = (dietFilter, categoryFilter, mealFilter) => {
    const dietaryTags = [];

    if (dietFilter.vegetarian) {
      dietaryTags.push('{dietaryTag: VEGETARIAN}');
    }

    if (dietFilter.vegan) {
      dietaryTags.push('{dietaryTag: VEGAN}');
    }

    if (dietFilter.keto) {
      dietaryTags.push('{tag: "Keto-Friendly"}');
    }

    if (categoryFilter.dairy) {
      dietaryTags.push('{dietaryTag: DAIRY_FREE}');
    }

    if (categoryFilter.gluten) {
      dietaryTags.push('{dietaryTag: GLUTEN_FREE}');
    }

    if (categoryFilter.nuts) {
      dietaryTags.push('{tag: "Tree-Nut-Free"}');
    }

    if(mealFilter.breakfast) {
      dietaryTags.push('{mealTime: BREAKFAST}')
    }

    if(mealFilter.lunch) {
      dietaryTags.push('{mealTime: LUNCH}')
    }

    if(mealFilter.dinner) {
      dietaryTags.push('{mealTime: DINNER}')
    }

    if(mealFilter.snack) {
      dietaryTags.push('{mealTime: SNACK}')
    }

    return dietaryTags;
  };

  const sendDietaryTags = async (ingredientNames, filterCriteria) => {
    try {
      // Use filterCriteria here to send dietary tags
      console.log('list of ingredients', ingredientNames);
      const ingredientsArray = ingredientNames;
      console.log('Sending dietary tags:', filterCriteria);
      const dietaryTags = mapDietaryTags(
        filterCriteria.dietFilter,
        filterCriteria.categoryFilter,
        filterCriteria.mealFilter
      );
      console.log('Sending dietary tags was successful! Here they are:', dietaryTags);
      console.log('list of ingredients after mapping', ingredientNames);

      // Your logic to send dietary tags based on filterCriteria
    } catch (error) {
      console.error('Error sending dietary tags:', error);
    }
  };

  const updateFilterCriteriaAndApply = (ingredientNames) => {
    const filterCriteria = {
      mealFilter,
      categoryFilter,
      dietFilter,
      servingSize,
      prepTime,
    };

    onFilterChange(filterCriteria);
    sendDietaryTags(ingredientNames, filterCriteria);
    console.log("from line 179, updateFilterCriteria", ingredientNames);
  };

  const handleMealFilterChange = (mealOption) => {
    setMealFilter((prevState) => ({
      ...prevState,
      [mealOption]: !prevState[mealOption],
    }));
  }

  const handleCategoryFilterChange = (categoryOption) => {
    setCategoryFilter((prevState) => ({
      ...prevState,
      [categoryOption]: !prevState[categoryOption],
    }));
  }

  const handleDietFilterChange = (dietOption) => {
    const updatedSelectedDietaryFilters = selectedDietaryFilters.includes(dietOption)
      ? selectedDietaryFilters.filter((filter) => filter !== dietOption)
      : [...selectedDietaryFilters, dietOption];

    setDietFilter((prevState) => ({
      ...prevState,
      [dietOption]: !prevState[dietOption],
    }));

    setSelectedDietaryFilters(updatedSelectedDietaryFilters);
  }

  const toggleMealFilter = () => {
    setShowMealFilter((prevState) => !prevState);
    setShowCategoryFilter(false);
    setShowDietFilter(false);
    setShowServingFilter(false);
    setShowPrepTimeFilter(false);
  }

  const toggleCategoryFilter = () => {
    setShowCategoryFilter((prevState) => !prevState);
    setShowMealFilter(false);
    setShowDietFilter(false);
    setShowServingFilter(false);
    setShowPrepTimeFilter(false);
  }

  const toggleDietFilter = () => {
    setShowDietFilter((prevState) => !prevState);
    setShowMealFilter(false);
    setShowCategoryFilter(false);
    setShowServingFilter(false);
    setShowPrepTimeFilter(false);
  }

  const toggleServingFilter = () => {
    setShowServingFilter((prevState) => !prevState);
    setShowDietFilter(false);
    setShowMealFilter(false);
    setShowCategoryFilter(false);
    setShowPrepTimeFilter(false);
  }

  const handleServingSizeChange = (event) => {
    const servingSize = parseInt(event.target.value, 10);
    setServingSize(servingSize);
  }

  const togglePrepTimeFilter = () => {
    setShowPrepTimeFilter((prevState) => !prevState);
    setShowDietFilter(false);
    setShowMealFilter(false);
    setShowCategoryFilter(false);
    setShowServingFilter(false);
  }

  const handlePrepTimeInputChange = (event) => {
    const prepTime = parseInt(event.target.value, 10);

    if (prepTime > 300) {
      alert('Max Prep Time cannot exceed 300 minutes');
      return;
    }

    setPrepTime(prepTime);
  }

  const clearAllFilters = () => {
    setMealFilter({
      breakfast: false,
      lunch: false,
      dinner: false,
      snack: false,
    });

    setCategoryFilter({
      nuts: false,
      dairy: false,
      gluten: false,
    });

    setDietFilter({
      carb: false,
      keto: false,
      fat: false,
      sugar: false,
      vegetarian: false,
      vegan: false,
      kosher: false,
    });

    setServingSize(0);
    setPrepTime(0);
  }

  return (
    <div className="my-component">
      <div className="filter-section">
        <button onClick={toggleMealFilter}>Meal</button>
        {showMealFilter && (
          <div className="meal-filter-section">
            <div className="checkbox-label">
              <input
                type="checkbox"
                id="breakfast"
                checked={mealFilter.breakfast}
                onChange={() => handleMealFilterChange('breakfast')}
              />
              <label htmlFor="breakfast">Breakfast</label>
            </div>
            <div className="checkbox-label">
              <input
                type="checkbox"
                id="lunch"
                checked={mealFilter.lunch}
                onChange={() => handleMealFilterChange('lunch')}
              />
              <label htmlFor="lunch">Lunch</label>
            </div>
            <div className="checkbox-label">
              <input
                type="checkbox"
                id="dinner"
                checked={mealFilter.dinner}
                onChange={() => handleMealFilterChange('dinner')}
              />
              <label htmlFor="dinner">Dinner</label>
            </div>
            <div className="checkbox-label">
              <input
                type="checkbox"
                id="snack"
                checked={mealFilter.snack}
                onChange={() => handleMealFilterChange('snack')}
              />
              <label htmlFor="snack">Snack</label>
            </div>
          </div>
        )}
      </div>

      <div className="filter-section">
        <button onClick={toggleCategoryFilter}>Allergies</button>
        {showCategoryFilter && (
          <div className="meal-filter-section">
            <div className="checkbox-label">
              <input
                type="checkbox"
                id="Nuts"
                checked={categoryFilter.nuts}
                onChange={() => handleCategoryFilterChange('nuts')}
              />
              <label htmlFor="Nuts">Nuts</label>
            </div>
            <div className="checkbox-label">
              <input
                type="checkbox"
                id="Dairy"
                checked={categoryFilter.dairy}
                onChange={() => handleCategoryFilterChange('dairy')}
              />
              <label htmlFor="Dairy">Dairy</label>
            </div>
            <div className="checkbox-label">
              <input
                type="checkbox"
                id="Gluten"
                checked={categoryFilter.gluten}
                onChange={() => handleCategoryFilterChange('gluten')}
              />
              <label htmlFor="Gluten">Gluten</label>
            </div>
          </div>
        )}
      </div>

      <div className="filter-section">
        <button onClick={toggleDietFilter}>Diet</button>
        {showDietFilter && (
          <div className="meal-filter-section">
            <div className="checkbox-label">
              <input
                type="checkbox"
                id="Carb"
                checked={dietFilter.carb}
                onChange={() => handleDietFilterChange('carb')}
              />
              <label htmlFor="Carb">Low-Carb</label>
            </div>
            <div className="checkbox-label">
              <input
                type="checkbox"
                id="Keto"
                checked={dietFilter.keto}
                onChange={() => handleDietFilterChange('keto')}
              />
              <label htmlFor="Keto">Keto</label>
            </div>
            <div className="checkbox-label">
              <input
                type="checkbox"
                id="Fat"
                checked={dietFilter.fat}
                onChange={() => handleDietFilterChange('fat')}
              />
              <label htmlFor="Fat">Low-Fat</label>
            </div>
            <div className="checkbox-label">
              <input
                type="checkbox"
                id="sugar"
                checked={dietFilter.sugar}
                onChange={() => handleDietFilterChange('sugar')}
              />
              <label htmlFor="sugar">Low-Sugar</label>
            </div>
            <div className="checkbox-label">
              <input
                type="checkbox"
                id="vegetarian"
                checked={dietFilter.vegetarian}
                onChange={() => handleDietFilterChange('vegetarian')}
              />
              <label htmlFor="vegetarian">Vegetarian</label>
            </div>
            <div className="checkbox-label">
              <input
                type="checkbox"
                id="vegan"
                checked={dietFilter.vegan}
                onChange={() => handleDietFilterChange('vegan')}
              />
              <label htmlFor="vegan">Vegan</label>
            </div>
          </div>
        )}
      </div>

      <div className="filter-section">
      <button onClick={toggleServingFilter}>Serving Size</button>
      {showServingFilter && (
        <label>
          <input
            type="range"
            min="0"
            max="6"
            step="1"
            value={parseInt(servingSize, 10)}
            onChange={handleServingSizeChange}
          />
          {servingSize === 6 ? '6+' : servingSize}
        </label>
      )}
    </div>

    <div className="filter-section">
      <button onClick={togglePrepTimeFilter}>Max Prep Time</button>
      {showPrepTimeFilter && (
        <label>
          <input
            type="number" // Use type "number" for numeric input
            min="1"
            max="300" // Set max value to 300
            value={prepTime}
            onChange={handlePrepTimeInputChange} // Use the new handler
          />
          minutes
        </label>
      )}
    </div>

      <div className="filter-section">
        <button onClick={updateFilterCriteriaAndApply}>Apply Filters</button>
        <button className="filter-section" onClick={clearAllFilters}>Clear Filters</button>
      </div>
    </div>
  );
}

export default MyComponent;
