import { createRoot } from 'react-dom/client';
import type { Root } from 'react-dom/client';
import App from './App';

let root: Root | null = null;

export default {
  mount: (element: HTMLElement) => {
    if (!root) {
      root = createRoot(element);
    }
    root.render(<App />);
  },

  unmount: () => {
    if (root) {
      root.unmount();
      root = null;
    }
  }
};