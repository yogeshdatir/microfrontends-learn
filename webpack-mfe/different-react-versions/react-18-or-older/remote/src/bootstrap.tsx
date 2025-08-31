// React 18 root mount
import { createRoot } from 'react-dom/client';
import App from './App';

const root = createRoot(document.getElementById('remote-root')!);
root.render(<App />);
