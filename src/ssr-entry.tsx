import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom'; 
import App from './App';

export function renderPage(path: string): string {
  return renderToString(
    <StaticRouter location={path}>
      <App />
    </StaticRouter>
  );
} 
