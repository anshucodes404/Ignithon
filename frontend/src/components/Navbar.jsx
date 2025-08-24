import React from 'react'
import { Button } from "@/components/ui/button"
import { Menu, X, Map } from "lucide-react"
// import { useState } from "react"
// import {RaiseIssue} from './RaiseIssue'
// import { Donation } from './Donation'
import { Link } from "react-router-dom";


const Navbar = () => {
    
  return (
    <>
      <nav className="fixed top-0 w-full z-50 bg-white/90 backdrop-blur-sm border-b border-[#80af81]/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to="/">
              <div className="flex items-center space-x-0">
                <img
                  src="/logo.png"
                  alt="अन्न Seva Logo"
                  width={70}
                  height={70}
                />
                <span className="text-xl font-bold text-[#195319]">
                  अन्न Seva
                </span>
              </div>
            </Link>
            <div className="hidden md:flex items-center space-x-8">
              <a
                href="#why-us"
                className="text-[#518d4f] hover:text-[#195319] font-medium transition-colors"
              >
                Why Us
              </a>
              <Link to="/raise-issue">
                <Button
                  variant="outline"
                  className="border-[#80af81] text-[#518d4f] hover:bg-[#d6efd9] bg-transparent"
                >
                  Raise Issue
                </Button>
              </Link>
              <Link to="/view-map">
                <Button
                  variant="outline"
                  className="border-[#80af81] text-[#518d4f] hover:bg-[#d6efd9] bg-transparent"
                >
                  <Map className="w-4 h-4 mr-2" />
                  View Map
                </Button>
              </Link>
              <a
                href="#contact"
                className="text-[#518d4f] hover:text-[#195319] font-medium transition-colors"
              >
                Contact Us
              </a>
              <Link to="/donate">
                <Button className="bg-[#FFD700] text-[#195319] hover:bg-[#FFD700]/90 font-semibold">
                  Donate Now
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}


export default Navbar