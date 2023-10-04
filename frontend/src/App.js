import {BrowserRouter, Route, Routes} from "react-router-dom";
import React, { useState, useEffect, useRef } from 'react'

//pages
import Home from './pages/Home';
import Pantry from "./pages/Pantry";
import Navbar from "./components/Navbar";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import Landing from "./pages/Landing";

function App() {

  //use state to check if user is logged in
  const [loggedIn, setLoggedIn] = useState(false);

  return (
    <div className="App" onClick={console.log('test')}>
      <BrowserRouter>
      <Routes>
        <Route 
          path="/landing"
          element={<Landing loggedIn={loggedIn}/>}
        />

        {loggedIn && 
        <Navbar /> &&
        <div className="pages">
          
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
          
        </div> }
        </Routes>
        
      </BrowserRouter>
    </div>
  );
}

export default App;

