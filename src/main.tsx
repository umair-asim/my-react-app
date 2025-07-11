import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';
import './styles/index.css';
import App from './App';

const rootElement = document.getElementById('root');
if (rootElement) {
  createRoot(rootElement).render(
    <StrictMode>
      <Router>
        <App />
      </Router>
    </StrictMode>
  );
}
