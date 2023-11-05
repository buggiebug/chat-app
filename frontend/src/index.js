import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import ContextProviders from "./context/ContextProviders";

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  // <React.StrictMode>
    <ContextProviders>
      <App />
    </ContextProviders>
  // </React.StrictMode>
);
