import React, { useState, useEffect } from 'react';
import "./Searchbar.css";

function SearchBar() {

    const getSearchHistory = () => {
        return JSON.parse(localStorage.getItem('searchHistory')) || [];
    };
    const [searchTerm, setSearchTerm] = useState('');
    const [results, setResults] = useState([]);
    const [highlightedIndex, setHighlightedIndex] = useState(-1);
    const [showHistory, setShowHistory] = useState(false); 
    const [searchHistory, setSearchHistory] = useState(getSearchHistory()); // New state variable for search history


    


    function highlightMatch(text, query) {
        const index = text.toLowerCase().indexOf(query.toLowerCase());
        if (index === -1) return text;
        return (
            <>
                {text.slice(0, index)}
                <span className="highlight">{text.slice(index, index + query.length)}</span>
                {text.slice(index + query.length)}
            </>
        );
    }

    const fetchSearchResults = async (query) => {
        if (query) {
            try {
                const response = await fetch('http://localhost:8080/api/search-ingredients', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ query })
                });

                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }

                const data = await response.json();
                if (data && data.data && data.data.ingredientSearch && data.data.ingredientSearch.edges) {
                    const labels = data.data.ingredientSearch.edges.map(edge => edge.node.label);
                    setResults(labels.slice(0, 5)); // Display top 5 suggestions
                }

            } catch (error) {
                console.error("Error fetching ingredients:", error);
                setResults([]);
            }
        } else {
            setResults([]);
        }
    };

    

    const handleInputChange = (e) => {
        const query = e.target.value;
        setSearchTerm(query);
        if (query) {
            setShowHistory(false); // Hide search history when user starts typing
            fetchSearchResults(query);
        } else {
            setShowHistory(true); // Show search history when input is empty
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === "ArrowDown") {
            // Move down the list, but don't exceed the number of results
            setHighlightedIndex(prevIndex => Math.min(prevIndex + 1, results.length - 1));
        } else if (e.key === "ArrowUp") {
            // Move up the list, but don't go below -1 (which means no selection)
            setHighlightedIndex(prevIndex => Math.max(prevIndex - 1, -1));
        } else if (e.key === "Enter") {
            if (highlightedIndex >= 0 && highlightedIndex < results.length) {
                // If a result is highlighted, add it to the pantry
                addToPantry(results[highlightedIndex]);
            } else if (searchTerm) {
                // If no result is highlighted but there's a search term, log it
                storeSearchTerm(searchTerm);
            }
        }
    };


    const addToPantry = async (ingredient) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('No token found');
            }
            const response = await fetch('http://localhost:8080/user/add-pantry',
            {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  "Authorization": `Bearer ${token}`  // Add this line to include the token in the request header
                },
                body: JSON.stringify({ ingredientName: ingredient })  // Sending the ingredient data
            });
    
            const data = await response.json();
            if (response.ok) {
                console.log(data.message); // Ingredient added successfully
                storeSearchTerm(ingredient); // Add the ingredient to search history
            } else {
                console.error(data.error);
            }
        } catch (error) {
            console.error("Error adding ingredient to pantry:", error);
        }
    };

    const storeSearchTerm = (term) => {
        let searchHistory = JSON.parse(localStorage.getItem('searchHistory')) || [];
        if (searchHistory.includes(term)) {
            // Remove the existing term to avoid duplicates
            searchHistory = searchHistory.filter(item => item !== term);
        }
        // Add the new term to the beginning of the array
        searchHistory.unshift(term);
        // Limit the history to the last 10 searches
        searchHistory = searchHistory.slice(0, 10);
        localStorage.setItem('searchHistory', JSON.stringify(searchHistory));
    
        // Directly update the searchHistory state
        setSearchHistory(searchHistory);
    };

    const deleteSearchTerm = (termToDelete) => {
        let history = getSearchHistory();
        history = history.filter(term => term !== termToDelete);
        localStorage.setItem('searchHistory', JSON.stringify(history));
        setSearchHistory(history); // Update the searchHistory state
    };
    
    const clearSearchHistory = () => {
        localStorage.removeItem('searchHistory');
        setSearchHistory([]); // Clear the searchHistory state
    };

    useEffect(() => {
        // Update searchHistory state whenever local storage changes
        setSearchHistory(getSearchHistory());
    }, [searchTerm]); // Listen for changes in searchTerm

    return (
        <>
            <div className="searchContainer">
                <div className="searchBar">
                    <input 
                        type="text" 
                        value={searchTerm} 
                        onChange={handleInputChange}
                        onKeyDown={handleKeyPress}
                        onFocus={() => {
                            if (!searchTerm && searchHistory.length > 0) {
                                setShowHistory(true); 
                            }
                        }}
                      placeholder="Add ingredients here..."
                      className="input-search" 
                      />
                </div>
            </div>
            <div className="dropdownContainer">
                {(showHistory && !searchTerm) ? (
                    // Display search history
                    <div className = {`ingredient-dropdown`} >
                    <ul className={`ingredient-table ${showHistory || searchTerm ? 'active' : ''}`}>
                        {searchHistory.map((term, index) => (
                            <li key={index}>
                                {term}
                                <span onClick={() => deleteSearchTerm(term)} className="delete-history-item">x</span>
                            </li>
                        ))}
                        {searchHistory.length > 0 && (
                            <li className="clear-history" onClick={clearSearchHistory}>
                                Clear Search History
                            </li>
                        )}
                    </ul>
                    </div>
                ) : searchTerm && results.length > 0 ? (
                    // Display search results
                       <div className="ingredient-dropdown">
            <ul className="ingredient-table"> {results.map((label, index) => (
                <li key={index} className={highlightedIndex === index ? "highlighted" : ""}>
                    <div className="ingredient-container">
                        <span className="ingredient-item">{highlightMatch(label, searchTerm)}</span>
                    <button className="add-to-pantry-button" onClick={() => addToPantry(label)}>Add to Pantry</button>
                    </div>
                </li>
              ))}
            </ul>
          </div>
                ) : null}
            </div>
        </>
    );
}

export default SearchBar;