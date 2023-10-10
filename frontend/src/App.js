import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import React, { useEffect, useRef, useState } from "react";
import "./app.css";
import { useSelector } from "react-redux";

// Import pages and components
import Home from "./pages/Home/Home";
import Pantry from "./pages/Pantry/Pantry";
import Navbar from "./components/Navbar/Navbar";
import Profile from "./pages/Profile/Profile";
import Preferences from "./pages/Preferences/Preferences";
import Settings from "./pages/Settings/Settings";

import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";
import ForgotPassword from "./components/ForgotPassword/ForgotPassword";

import Landing from "./pages/Landing/Landing";


function App() {
  const isLoggedIn = Boolean(useSelector((state) => state.token));

  return (
    <div className="App">
      <BrowserRouter>
        {isLoggedIn && <Navbar />}
        <Routes>
          <Route path="/" element={isLoggedIn ? <Home /> : <Landing />} />
          <Route path="/pantry" element={isLoggedIn ? <Pantry /> : <Navigate to="/" />} />
          <Route path="/profile" element={isLoggedIn ? <Profile /> : <Navigate to="/" />} />
          <Route path="/settings" element={isLoggedIn ? <Settings /> : <Navigate to="/" />} />
          <Route path="/preferences" element={isLoggedIn ? <Preferences /> : <Navigate to="/" />} />
          <Route path="/login" element={isLoggedIn ? <Navigate to="/" /> : <Login />} />
          <Route path="/register" element={isLoggedIn ? <Navigate to="/" /> : <Register />} />
          <Route path="/forgot-password" element={isLoggedIn ? <Navigate to="/" /> : <ForgotPassword />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
