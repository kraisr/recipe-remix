import {BrowserRouter, Route, Routes} from "react-router-dom";
import React, { useEffect, useRef } from 'react'
import "./css/app.css"

//pages
import Home from './pages/Home';
import Pantry from "./pages/Pantry";
import Navbar from "./components/Navbar";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import Login from "./pages/Login";
import Register from "./pages/Register";

function App() {
  return (
    <div className="App" onClick={console.log('test')}>
      <BrowserRouter>
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

            <Route
              path="/login"
              element={<Login />}
            />
            <Route
              path="/register"
              element={<Register />}
            />
          </Routes>
        </div> 
      </BrowserRouter>
    </div>
  );
}

export default App;

