import { BrowserRouter, Route, Routes } from "react-router-dom";
import React, { useState } from "react";

// Import pages and components
import Home from "./pages/Home";
import Pantry from "./pages/Pantry";
import Navbar from "./components/Navbar";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import Landing from "./pages/Landing";
import "./css/app.css"

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
        
      </BrowserRouter>
    </div>
  );
}

export default App;
