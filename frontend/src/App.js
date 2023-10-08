import {BrowserRouter, Route, Routes} from "react-router-dom";
import React, { useEffect, useRef, useState } from "react";
import "./app.css";

// Import pages and components
import Home from "./pages/Home/Home";
import Pantry from "./pages/Pantry/Pantry";
import Navbar from "./components/Navbar/Navbar";
import Profile from "./pages/Profile/Profile";
import Settings from "./pages/Settings/Settings";

import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";

import Landing from "./pages/Landing/Landing";


function App() {
  const [loggedIn, setLoggedIn] = useState(true);

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
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
            </>
          ) : (
            <Route path="/" element={<Landing setLoggedIn={setLoggedIn}/>} />
          )}
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
