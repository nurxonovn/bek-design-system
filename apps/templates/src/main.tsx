import '@bek-ui/tokens/tokens.css';
import '@bek-ui/tokens/materials.css';
import '@bek-ui/tokens/typography.css';
import '@bek-ui/react/styles.css';
import './templates.css';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './App';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
