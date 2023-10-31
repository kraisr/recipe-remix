import React, { Component } from 'react';
import "./pantry.css";

class MyComponent extends Component {
  state = {
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
    showMealFilter: false,
    showCategoryFilter: false,
    showDietFilter: false,
    showServingFilter: false,
    showPrepTimeFilter: false,
  };

  updateFilterCriteriaAndApply = () => {
    const { mealFilter, categoryFilter, dietFilter, servingSize, prepTime } = this.state;

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
  };

  handleMealFilterChange(mealOption) {
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
    this.setState((prevState) => ({
      dietFilter: {
        ...prevState.dietFilter,
        [dietOption]: !prevState.dietFilter[dietOption],
      },
    }));
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
    this.setState({ servingSize: event.target.value });
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

  handlePrepTime = (event) => {
    this.setState({ prepTime: event.target.value });
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
                <label htmlFor="vegetarian">Vegitarian</label>
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
                value={this.state.servingSize}
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
                type="range"
                min="1"
                max="10"
                step="1"
                value={this.state.prepTime}
                onChange={this.handlePrepTime}
              />
              {this.state.prepTime === '10' ? '10+' : this.state.prepTime}
            </label>
          )}
        </div>

        <div className="filter-section">
          <button className="filter-section" onClick={this.clearAllFilters}>Clear Filters</button>
        </div>
      </div>
    );
  }
}

export default MyComponent;