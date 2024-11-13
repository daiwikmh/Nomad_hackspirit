import React, { useEffect } from 'react'
import './index.css'
import TravelExpensePool from '../src/compoenents/group';
import axios from "axios";
import ErrorBoundary from "./ErrorBoundary";

import { useUser } from "@clerk/clerk-react";


import Navbar from './compoenents/Navbar/Navbar'
import ShowGroups from './compoenents/show-groups';

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
    <ErrorBoundary>
      <Navbar />
      <TravelExpensePool />
      <ShowGroups />
    </ErrorBoundary>
  )
}

export default App
