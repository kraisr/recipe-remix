import React, { useState } from 'react';
import "./Searchbar.css";

function SearchBar() {
    const [searchTerm, setSearchTerm] = useState('');
    const [results, setResults] = useState([]);
    const [highlightedIndex, setHighlightedIndex] = useState(-1);

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
        fetchSearchResults(query);
    };

    return (
        <div>
            <div className="searchBar">
                <input 
                    type="text" 
                    value={searchTerm} 
                    onChange={handleInputChange}
                    onKeyDown={(e) => {
                        if (e.key === "ArrowDown" && highlightedIndex < results.length - 1) {
                            setHighlightedIndex(prev => prev + 1);
                        } else if (e.key === "ArrowUp" && highlightedIndex > 0) {
                            setHighlightedIndex(prev => prev - 1);
                        } else if (e.key === "Enter" && highlightedIndex >= 0) {
                            setSearchTerm(results[highlightedIndex]);
                        }
                    }}
                    placeholder="Search..."
                />
            </div>

            {searchTerm && results.length > 0 && (
                <ul className="dropdown">
                    {results.map((label, index) => (
                        <li 
                            key={index} 
                            className={highlightedIndex === index ? "highlighted" : ""}
                        >
                            {highlightMatch(label, searchTerm)}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default SearchBar;

