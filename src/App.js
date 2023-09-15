import React from "react";
import { Route, Routes } from "react-router-dom";
import "./App.css";
import NavBar from "./components/Navbar";

import { useState } from "react";
import Goalies from "./pages/Goalies";
import Home from "./pages/Home";
import Skaters from "./pages/Skaters";
import Teams from "./pages/Teams";

function App() {
   const [searchQuery, setSearchQuery] = useState("");

   const handleSearchChange = (value) => {
      setSearchQuery(value);
   };

   return (
      <>
         <h1 className="text-5xl px-60 py-10 font-semibold">Statistics</h1>
         <hr className="h-0.5 w-[93.5em] bg-gray-400 mx-auto" />
         <div style={{ height: "10px" }}></div>

         <NavBar
            searchQuery={searchQuery}
            handleSearchChange={handleSearchChange}
         />

         <div style={{ height: "10px" }}></div>
         <hr className="h-0.5 w-[93.5em] bg-gray-400 mx-auto" />

         <Routes>
            <Route path="/" element={<Home />} />
            <Route
               path="/skaters"
               element={<Skaters searchQuery={searchQuery} />}
            />
            <Route
               path="/goalies"
               element={<Goalies searchQuery={searchQuery} />}
            />
            <Route
               path="/teams"
               element={<Teams searchQuery={searchQuery} />}
            />
         </Routes>
      </>
   );
}

export default App;
