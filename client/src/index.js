import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import "./index.css";

import Home from "./pages/Home";
import Dashboard, { Settings } from "./pages/Dashboard";

const root = ReactDOM.createRoot(document.getElementById("root"));

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/response" element={<Home />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/dashboard/:page" element={<Settings/>} />
        <Route path="*" element={<Home />} />
      </Routes>
    </BrowserRouter>
  );
}

root.render(
  <App />
);
