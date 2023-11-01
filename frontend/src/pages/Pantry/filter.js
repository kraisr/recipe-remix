import React, { Component, useEffect, useState } from 'react';
import "./pantry.css";
import { sendDietaryTags } from "./Pantry.js";

class MyComponent extends Component {
  
  onFilterChange = (filterCriteria) => {
    // Implement your logic to apply filters here
    console.log('Filter criteria:', filterCriteria);
    // You can update the state or perform any other actions based on filter criteria
  }

  constructor(props) {
    super(props);

    this.state = {
      userPreferences: {
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
      },
      mealFilter: {
        breakfast: false,
        lunch: false,
        dinner: false,
        snack: false,
      },
      categoryFilter: {
        nuts: false,
        dairy: false,
        gluten: false,
      },
      dietFilter: {
        carb: false,
        keto: false,
        fat: false,
        sugar: false,
        vegetarian: false,
        vegan: false,
        kosher: false,
      },
      servingSize: 0,
      prepTime: 0,
      showMealFilter: false,
      showCategoryFilter: false,
      showDietFilter: false,
      showServingFilter: false,
      showPrepTimeFilter: false,
    
      selectedDietaryFilters: [], // Track selected dietary filters as an array
    };
  }


  fetchUserPreferences = async () => {
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

    // Use the callback function to ensure you're working with the updated state
    this.setState((prevState) => ({
      userPreferences: {
        ...prevState.userPreferences,
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
      },
    }), () => {
      console.log('User Preferences:', this.state.userPreferences);

      this.setState((prevState) => ({
        dietFilter: {
          ...prevState.dietFilter,
          keto: this.state.userPreferences.keto,
          vegetarian: this.state.userPreferences.vegetarianism,
          vegan: this.state.userPreferences.veganism,
          sugar: this.state.userPreferences.diabetes,
        },
        categoryFilter: {
          ...prevState.categoryFilter,
          nuts: this.state.userPreferences.nutAllergies,
          dairy: this.state.userPreferences.dairyFree,
          gluten: this.state.userPreferences.glutenIntolerance,
        }
      }));


    });

  } catch (error) {
    console.error('Error fetching user preferences:', error);
  }
};

  updateFilterCriteriaAndApply = () => {
    const { mealFilter, categoryFilter, dietFilter, servingSize, prepTime } = this.state;
  
    // Log the filter criteria to the console
    console.log('Filter Criteria:', {
      mealFilter,
      categoryFilter,
      dietFilter,
      servingSize,
      prepTime,
    });
  
    // Construct filter criteria based on your state
    const filterCriteria = {
      mealFilter,
      categoryFilter,
      dietFilter,
      servingSize,
      prepTime,
    };
  
    // Call the function passed as a prop to apply filters
    this.props.onFilterChange(filterCriteria);
    //here is where i call my controller?
    sendDietaryTags(filterCriteria);
    console.log("from filter.js ", filterCriteria);
    
  };
  
  componentDidMount() {
    console.log("componentDidMount!")
    this.fetchUserPreferences();
  }

  handleMealFilterChange = (mealOption) => {
    this.setState((prevState) => ({
      mealFilter: {
        ...prevState.mealFilter,
        [mealOption]: !prevState.mealFilter[mealOption],
      },
    }));
  }

  handleCategoryFilterChange(categoryOption) {
    this.setState((prevState) => ({
      categoryFilter: {
        ...prevState.categoryFilter,
        [categoryOption]: !prevState.categoryFilter[categoryOption],
      },
    }));
  }

  handleDietFilterChange(dietOption) {
    this.setState((prevState) => {
      // Toggle the selected dietary filter in the array
      const selectedDietaryFilters = prevState.selectedDietaryFilters.includes(dietOption)
        ? prevState.selectedDietaryFilters.filter((filter) => filter !== dietOption)
        : [...prevState.selectedDietaryFilters, dietOption];

      return {
        dietFilter: {
          ...prevState.dietFilter,
          [dietOption]: !prevState.dietFilter[dietOption],
        },
        selectedDietaryFilters, // Update the selected dietary filters array
      };
    });
  }

  toggleMealFilter = () => {
    this.setState((prevState) => ({
      showMealFilter: !prevState.showMealFilter,
      showCategoryFilter: false,
      showDietFilter: false,
      showServingFilter: false,
      showPrepTimeFilter: false,
    }));
  };

  toggleCategoryFilter = () => {
    this.setState((prevState) => ({
      showCategoryFilter: !prevState.showCategoryFilter,
      showMealFilter: false,
      showDietFilter: false,
      showServingFilter: false,
      showPrepTimeFilter: false,
    }));
  };

  toggleDietFilter = () => {
    this.setState((prevState) => ({
      showDietFilter: !prevState.showDietFilter,
      showMealFilter: false,
      showCategoryFilter: false,
      showServingFilter: false,
      showPrepTimeFilter: false,
    }));
  };

  toggleServingFilter = () => {
    this.setState((prevState) => ({
      showServingFilter: !prevState.showServingFilter,
      showDietFilter: false,
      showMealFilter: false,
      showCategoryFilter: false,
      showPrepTimeFilter: false,
    }));
  };

  handleServingSizeChange = (event) => {
    const servingSize = parseInt(event.target.value, 10);

    // Update the component state
    this.setState({ servingSize });
  
  };

  togglePrepTimeFilter = () => {
    this.setState((prevState) => ({
      showPrepTimeFilter: !prevState.showPrepTimeFilter,
      showDietFilter: false,
      showMealFilter: false,
      showCategoryFilter: false,
      showServingFilter: false,
    }));
  };

  handlePrepTimeInputChange = (event) => {
    const prepTime = parseInt(event.target.value, 10);

    // Check if prepTime is greater than 300
    if (prepTime > 300) {
      // Handle the error (e.g., show a message or prevent further action)
      alert('Max Prep Time cannot exceed 300 minutes');
      return;
    }

    // Update the component state with the new prep time
    this.setState({ prepTime });
  };

  clearAllFilters = () => {
    this.setState({
      mealFilter: {
        breakfast: false,
        lunch: false,
        dinner: false,
        snack: false,
      },
      categoryFilter: {
        nuts: false,
        dairy: false,
        gluten: false,
      },
      dietFilter: {
        carb: false,
        keto: false,
        fat: false,
        sugar: false,
        vegetarian: false,
        vegan: false,
        kosher: false,
      },
      servingSize: '0',
      prepTime: '0',
    });
  };
  


  
  render() {
    const {
      showServingFilter,
      servingSize,
      showDietFilter,
      dietFilter,
      showMealFilter,
      showCategoryFilter,
      mealFilter,
      categoryFilter,
      showPrepTimeFilter,
      prepTime,
    } = this.state;

    return (
      <div className="my-component">
        <div className="filter-section">
          <button onClick={this.toggleMealFilter}>Meal</button>
          {showMealFilter && (
            <div className="meal-filter-section">
              <div className="checkbox-label">
                <input
                  type="checkbox"
                  id="breakfast"
                  checked={mealFilter.breakfast}
                  onChange={() => this.handleMealFilterChange('breakfast')}
                />
                <label htmlFor="breakfast">Breakfast</label>
              </div>
              <div className="checkbox-label">
                <input
                  type="checkbox"
                  id="lunch"
                  checked={mealFilter.lunch}
                  onChange={() => this.handleMealFilterChange('lunch')}
                />
                <label htmlFor="lunch">Lunch</label>
              </div>
              <div className="checkbox-label">
                <input
                  type="checkbox"
                  id="dinner"
                  checked={mealFilter.dinner}
                  onChange={() => this.handleMealFilterChange('dinner')}
                />
                <label htmlFor="dinner">Dinner</label>
              </div>
              <div className="checkbox-label">
                <input
                  type="checkbox"
                  id="snack"
                  checked={mealFilter.snack}
                  onChange={() => this.handleMealFilterChange('snack')}
                />
                <label htmlFor="snack">Snack</label>
              </div>
            </div>
          )}
        </div>

        <div className="filter-section">
          <button onClick={this.toggleCategoryFilter}>Allergies</button>
          {showCategoryFilter && (
            <div className="meal-filter-section">
              <div className="checkbox-label">
                <input
                  type="checkbox"
                  id="Nuts"
                  checked={categoryFilter.nuts}
                  onChange={() => this.handleCategoryFilterChange('nuts')}
                />
                <label htmlFor="Nuts">Nuts</label>
              </div>
              <div className="checkbox-label">
                <input
                  type="checkbox"
                  id="Dairy"
                  checked={categoryFilter.dairy}
                  onChange={() => this.handleCategoryFilterChange('dairy')}
                />
                <label htmlFor="Dairy">Dairy</label>
              </div>
              <div className="checkbox-label">
                <input
                  type="checkbox"
                  id="Gluten"
                  checked={categoryFilter.gluten}
                  onChange={() => this.handleCategoryFilterChange('gluten')}
                />
                <label htmlFor="Gluten">Gluten</label>
              </div>
            </div>
          )}
        </div>

        <div className="filter-section">
          <button onClick={this.toggleDietFilter}>Diet</button>
          {showDietFilter && (
            <div className="meal-filter-section">
              <div className="checkbox-label">
                <input
                  type="checkbox"
                  id="Carb"
                  checked={dietFilter.carb}
                  onChange={() => this.handleDietFilterChange('carb')}
                />
                <label htmlFor="Carb">Low-Carb</label>
              </div>
              <div className="checkbox-label">
                <input
                  type="checkbox"
                  id="Keto"
                  checked={dietFilter.keto}
                  onChange={() => this.handleDietFilterChange('keto')}
                />
                <label htmlFor="Keto">Keto</label>
              </div>
              <div className="checkbox-label">
                <input
                  type="checkbox"
                  id="Fat"
                  checked={dietFilter.fat}
                  onChange={() => this.handleDietFilterChange('fat')}
                />
                <label htmlFor="Fat">Low-Fat</label>
              </div>
              <div className="checkbox-label">
                <input
                  type="checkbox"
                  id="sugar"
                  checked={dietFilter.sugar}
                  onChange={() => this.handleDietFilterChange('sugar')}
                />
                <label htmlFor="sugar">Low-Sugar</label>
              </div>
              <div className="checkbox-label">
                <input
                  type="checkbox"
                  id="vegetarian"
                  checked={dietFilter.vegetarian}
                  onChange={() => this.handleDietFilterChange('vegetarian')}
                />
                <label htmlFor="vegetarian">Vegetarian</label>
              </div>
              <div className="checkbox-label">
                <input
                  type="checkbox"
                  id="vegan"
                  checked={dietFilter.vegan}
                  onChange={() => this.handleDietFilterChange('vegan')}
                />
                <label htmlFor="vegan">Vegan</label>
              </div>
            </div>
          )}
        </div>

        <div className="filter-section">
          <button onClick={this.toggleServingFilter}>Serving Size</button>
          {showServingFilter && (
            <label>
              <input
                type="range"
                min="0"
                max="6"
                step="1"
                value={parseInt(this.state.servingSize, 10)}
                onChange={this.handleServingSizeChange}
              />
              {this.state.servingSize === '6' ? '6+' : this.state.servingSize}
            </label>
          )}
        </div>

        <div className="filter-section">
          <button onClick={this.togglePrepTimeFilter}>Max Prep Time</button>
          {showPrepTimeFilter && (
            <label>
              <input
                type="number" // Use type "number" for numeric input
                min="1"
                max="300" // Set max value to 300
                value={this.state.prepTime}
                onChange={this.handlePrepTimeInputChange} // Use the new handler
              />
             
            minutes</label>
          )}
        </div>


        <div className="filter-section">
          <button onClick={this.updateFilterCriteriaAndApply}>Apply Filters</button>
          <button className="filter-section" onClick={this.clearAllFilters}>Clear Filters</button>
        </div>
      </div>
    );
  }
}

export default MyComponent;