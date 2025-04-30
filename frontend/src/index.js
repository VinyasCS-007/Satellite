import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { Ion } from "cesium";

// Cesium global assignments must come after all imports
window.CESIUM_BASE_URL = "/Cesium/";
Ion.defaultAccessToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI1OTUzOTIwZi1iZmQ4LTRhYmItYjEyMC0xZWNmMzcxNDJjMmUiLCJpZCI6MjkzOTg3LCJpYXQiOjE3NDU5MzM0ODF9.rd-s4XlbgzZWXO8zu4iv9d38Pa29awWHLTl5VTbjjwI";

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

reportWebVitals();

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
