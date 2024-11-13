import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import CanvasAnimation from "./compoenents/canvasWelcomePage";
import Navbar from "./compoenents/Navbar";

import TravelExpensePool from "../src/compoenents/group";
function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<CanvasAnimation />} />
          <Route
            path="/home"
            element={
              <>
                <Navbar />
                <TravelExpensePool />
              </>
            }
          />
        </Routes>
      </Router>
    </>
  );
}

export default App;
