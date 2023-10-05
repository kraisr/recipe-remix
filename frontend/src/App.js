import { BrowserRouter, Route, Routes } from "react-router-dom";
import React, { useState, useEffect, useRef } from "react";

//pages
import Home from './pages/Home';
import Pantry from './pages/Pantry';
import Navbar from './components/Navbar';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import Landing from './pages/Landing';
import DietaryPreferences from "./pages/Settings";


function App() {
  const [loggedIn, setLoggedIn] = useState(null);

  return (
    <div className="App">
      <BrowserRouter>
        {loggedIn && <Navbar />}
        <Routes>
          {loggedIn ? (
            <>
              <Route path="/" element={<Home setLoggedIn={setLoggedIn}/>} />
              <Route path="/pantry" element={<Pantry />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/settings" element={<Settings />} />
            </>
          ) : (
            <Route path="/" element={<Landing setLoggedIn={setLoggedIn}/>} />
          )}
        </Routes>
        
        <Navbar />
        <div className="pages">
          <Routes>
            <Route
              path="/"
              element={<Home />}
            />

            <Route
              path="/pantry"
              element={<Pantry />}
            />

            {/* <Route 
              path="/recipes"
              element={<Recipes />}
            />  

            <Route 
              path="/community"
              element={<Community />}
            /> */}

            <Route
              path="/profile"
              element={<Profile />}
            />

            <Route
              path="/settings"
              element={<Settings />}
            />
          </Routes>
        </div>
      </BrowserRouter>
    </div>
  );
}

export default App;
