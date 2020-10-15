import { BrowserRouter } from "react-router-dom";
import Routes from "./components/Routes/Routes";
import React from 'react'



export default function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes />
      </BrowserRouter>
    </div>
  );
}