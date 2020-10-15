import React from 'react';
import './App.css';
import { BrowserRouter } from "react-router-dom";
import Routes from "./Components/Routes/Routes";
import './App.css';


export default function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes />
      </BrowserRouter>
    </div>
  );
}