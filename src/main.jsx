
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./index.css";
import Header from "./pages/Header";
import Home from "./pages/Home";
import Basket from "./pages/Basket";
import About from "./pages/About"

import { Provider } from 'react-redux';
import { store } from './store';

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>

    <Provider store={store}>

    <BrowserRouter>
    <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/Basket" element={<Basket />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </BrowserRouter>
        
    </Provider>
    
  </React.StrictMode>
);
