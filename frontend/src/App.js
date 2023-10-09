import {BrowserRouter, Route, Routes} from "react-router-dom";
import React, { useEffect, useRef, useState } from "react";
import "./app.css";

// Import pages and components
import Home from "./pages/Home/Home";
import Pantry from "./pages/Pantry/Pantry";
import Navbar from "./components/Navbar/Navbar";
import Profile from "./pages/Profile/Profile";
import Preferences from "./pages/Preferences/Preferences";
import Settings from "./pages/Settings/Settings";

import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";

import Landing from "./pages/Landing/Landing";


function App() {
  // Set to false to show landing page, register, and login
  // Set to true to show pantry, and user home page
  const [loggedIn, setLoggedIn] = useState(true);

  return (
    <div className="App">
      <BrowserRouter>
        {loggedIn && <Navbar />}
        <Routes>
          {loggedIn ? (
            // If logged in, show these pages
            <>
              <Route path="/" element={<Home setLoggedIn={setLoggedIn}/>} />
              <Route path="/pantry" element={<Pantry />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/preferences" element={<Preferences />} />
              <Route path="/settings" element={<Settings />} />
            </>
          ) : (
            // If not logged in, show these pages
            <>
              <Route path="/" element={<Landing setLoggedIn={setLoggedIn}/>} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
            </>
          )}
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
