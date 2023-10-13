import React, { useState } from 'react';
import SearchBar from '../../components/Searchbar/Searchbar.js'; // Import the SearchBar component
import './home.css';
import '../../components/Searchbar/Searchbar.css'

function Home() {
    const [isDarkMode, setIsDarkMode] = useState(localStorage.getItem('darkMode') === 'true');

    const toggleDarkMode = () => {
        const updatedMode = !isDarkMode;
        setIsDarkMode(updatedMode);
        localStorage.setItem('darkMode', updatedMode);
    };

    return (
        <div className={`home-container ${isDarkMode ? 'dark-mode' : ''}`}>
            <header className={`header ${isDarkMode ? 'dark-mode' : ''}`}>
                <div className='instructions-container'>
                    <div className={'instructions'}>
                        <p>Imagine taking a list of boring ingredients in your pantry—what exciting recipes can you whip up?</p>
                        <p>Watch as the ingredients magically appear below, ready for you to add to your 'pantry' of culinary possibilities!</p>
                    </div>
                    <div className='magnifying-glass'> </div>
                </div>
            </header>
            <div className="search-bar-container">
            <SearchBar />
            </div> 
        </div>
    );
}

export default Home;