import {BrowserRouter, Route, Routes} from "react-router-dom";

//pages
import Home from './pages/Home';
import Pantry from "./pages/Pantry";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
      
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
          </Routes>
        </div> 
      </BrowserRouter>
    </div>
  );
}

export default App;
