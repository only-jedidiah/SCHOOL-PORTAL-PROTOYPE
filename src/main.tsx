import React from 'react';
import ReactDOM from 'react-dom/client';
import { SchoolPortalProvider } from './context/SchoolPortalContext';
import App from './App';
import './styles/index.css';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <SchoolPortalProvider>
      <App />
    </SchoolPortalProvider>
  </React.StrictMode>
);
