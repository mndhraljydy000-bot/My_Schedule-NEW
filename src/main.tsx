import { StrictMode } from 'react';
import { hydrateRoot, createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.tsx';
import './index.css';
import { registerSW } from 'virtual:pwa-register';
import ReactGA from 'react-ga4';

ReactGA.initialize('G-VQMDSLDKK7');

registerSW({ immediate: true });

const container = document.getElementById('root')!;
const app = (
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
);

// Pre-rendered pages hydrate the existing HTML; dev serves an empty root
if (container.hasChildNodes()) {
  hydrateRoot(container, app);
} else {
  createRoot(container).render(app);
}
