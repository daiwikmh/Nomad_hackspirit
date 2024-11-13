import React, { useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import CanvasAnimation from "./compoenents/canvasWelcomePage";
import Navbar from "./compoenents/Navbar";
import ShowGroups from './compoenents/show-groups';
import ErrorBoundary from "./ErrorBoundary";

import TravelExpensePool from "../src/compoenents/group";
function App() {
  const { user } = useUser();
  useEffect(() => {
    const addUserToDatabase = async () => {
      try {
        await axios.post("http://localhost:3001/api/add-user", {
          userId: user.id,
          name: user.fullName,
          email: user.primaryEmailAddress.emailAddress,
        });
      } catch (error) {
        console.error("Error adding user:", error);
      }
    };
    if (user) {
      addUserToDatabase();
    }
  }, [user]);

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
