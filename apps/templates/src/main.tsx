import '@bek/tokens/tokens.css';
import '@bek/tokens/materials.css';
import '@bek/react/styles.css';
import './templates.css';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './App';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
