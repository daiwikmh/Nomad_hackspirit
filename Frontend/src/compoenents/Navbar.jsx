"use client";

import React, { useState } from "react";
import { Menu, X } from "lucide-react";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
} from "@clerk/clerk-react";
import Logo from "../assets/logo.jpg";
import { useNavigate } from "react-router-dom";
export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className=" shadow-lg bg-black"
    >
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between">
          <div className="flex space-x-7 justify-between w-full">
            <div>
              <a href="/home" className="flex items-center py-4 px-2">
                <span className="font-semibold text-gray-500 text-lg">
                  <img className="h-12" src={Logo} alt="Logo" />
                </span>
              </a>
            </div>
            <div className="hidden md:flex items-center space-x-1">
              <a
                href="/home"
                className="py-4 px-2 text-gray-500 font-semibold hover:text-green-500 transition duration-300"
              >
                Home
              </a>
              <a
                href="#"
                className="py-4 px-2 text-gray-500 font-semibold hover:text-green-500 transition duration-300"
              >
                <SignedOut>
                  <SignInButton />
                </SignedOut>
                <SignedIn>
                  <UserButton />
                </SignedIn>
              </a>
            </div>
          </div>
          <div className="md:hidden flex items-center">
            <a href="#" className="block py-2 px-4 text-sm hover:bg-gray-200">
              <SignedOut>
                <SignInButton />
              </SignedOut>
              <SignedIn>
                <UserButton />
              </SignedIn>
            </a>
            <button
              className="outline-none mobile-menu-button"
              onClick={toggleMenu}
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>
      {isOpen && (
        <div className="md:hidden">
          <a href="/home" className="block py-2 px-4 text-sm hover:bg-gray-200">
            Home
          </a>
        </div>
      )}
    </nav>
  );
}
