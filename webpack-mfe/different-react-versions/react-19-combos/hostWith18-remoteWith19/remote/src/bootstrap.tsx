// React 19 root mount - only when running standalone
import { createRoot } from 'react-dom/client';
import App from './App';

const remoteRoot = document.getElementById('remote-root');
if (remoteRoot) {
  const root = createRoot(remoteRoot);
  root.render(<App />);
}
