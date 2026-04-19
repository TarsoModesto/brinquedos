import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './app/App';
import { Providers } from './app/providers';
import './index.css';

/** Evita flash de tema antes do rehydrate do Zustand persist. */
try {
  const raw = localStorage.getItem('cda-theme');
  if (raw) {
    const parsed = JSON.parse(raw) as { state?: { theme?: string } };
    if (parsed.state?.theme === 'dark') document.documentElement.classList.add('dark');
  }
} catch {
  /* ignore */
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Providers>
        <App />
      </Providers>
    </BrowserRouter>
  </StrictMode>
);
