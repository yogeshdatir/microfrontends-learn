// React 17 root mount - only when running standalone
import App from './App';
import { createRoot } from 'react-dom/client';

const remoteRoot = document.getElementById('remote-root');
if (remoteRoot) {
  createRoot(remoteRoot).render(<App />);
}
