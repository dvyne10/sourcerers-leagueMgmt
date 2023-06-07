// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect } from "react";
import "./App.css";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./pages/Layout";
import Home from "./pages/Home";
import Blogs from "./pages/Blogs";
import Leagues from "./pages/Leagues";
import NoPage from "./pages/NoPage";

export default function App() {
  return (
    <>
    <div className="App">
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="blogs" element={<Blogs />} />
          <Route path="contact" element={<Leagues />} />
          <Route path="*" element={<NoPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
    </div>
    </>
  );
}
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
