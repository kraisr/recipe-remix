import React, { useState } from "react";
import "./home.css";

function Home() {
    const [searchTerm, setSearchTerm] = useState("");
    const [results, setResults] = useState([]);
    const [highlightedIndex, setHighlightedIndex] = useState(-1);

    function highlightMatch(text, query) {
        if (!text || !query) return text; // Add this line to handle undefined values

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
        console.log("fetchSearchResults called with query:", query); // <-- Add this
    
        if (query) {
            try {
                console.log("Making fetch request..."); // <-- Add this
                const response = await fetch("http://localhost:8080/api/search-ingredients", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({ query })
                });
    
                console.log("Fetch response:", response); // <-- Add this
    
                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(`HTTP error! Status: ${response.status}, Message: ${errorData.message}`);
                }
    
                const data = await response.json();
                console.log("Response data:", data);

                if (data && data.data && data.data.ingredientSearch && data.data.ingredientSearch.edges) {
                    const labels = data.data.ingredientSearch.edges.map(edge => edge.node.label);
                    setResults(labels.slice(0, 5)); // Get the top 5 labels
                    console.log("Processed labels:", labels.slice(0, 5));

                } else {
                    console.error("Unexpected data structure:", data);
                }

    
            } catch (error) {
                console.error("Error fetching ingredients:", error);
                setResults([]);
            }
        } else {
            setResults([]);
        }
    };


    function debounce(func, wait) {
        let timeout;
        return function (...args) {
            const context = this;
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(context, args), wait);
        };
    }


    const debouncedFetch = debounce(fetchSearchResults, 300);



    const handleAddToPantry = (ingredient) => {
        console.log(`Adding ${ingredient} to pantry...`);
    };
    

    
    


    return (
        <div>
            <div className="searchBar">
                <input 
                    type="text" 
                    value={searchTerm} 
                    onChange={(e) => {
                        setSearchTerm(e.target.value);
                        debouncedFetch(e.target.value);
                    }}
                    onKeyDown={(e) => {
                        if (e.key === "ArrowDown" && highlightedIndex < results.length - 1) {
                            setHighlightedIndex(prev => prev + 1);
                        } else if (e.key === "ArrowUp" && highlightedIndex > 0) {
                            setHighlightedIndex(prev => prev - 1);
                        } else if (e.key === "Enter" && highlightedIndex >= 0) {
                            handleAddToPantry(results[highlightedIndex].node.name);
                        }
                    }}
                    placeholder="Search for ingredients..."
                />
            </div>

            <ul className="dropdown">
                <li>Test 1</li>
                <li>Test 2</li>
                <li>Test 3</li>
            </ul>



            
        </div>
    );
}


// {searchTerm && results.length > 0 && (
//     <ul className="dropdown">
//         {results.map((label, index) => (
//             <li 
//                 key={index} 
//                 onClick={() => handleAddToPantry(label)}
//                 className={highlightedIndex === index ? "highlighted" : ""}
//             >
//                 {highlightMatch(label, searchTerm)}
//             </li>
//         ))}
//     </ul>
// )}
export default Home;