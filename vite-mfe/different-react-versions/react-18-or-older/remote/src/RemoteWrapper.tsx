import { render, unmountComponentAtNode } from 'react-dom';
import App from './App';

let mountedElement: HTMLElement | null = null;

export default {
  mount: (element: HTMLElement) => {
    mountedElement = element;
    render(<App />, element);
  },

  unmount: () => {
    if (mountedElement) {
      unmountComponentAtNode(mountedElement);
      mountedElement = null;
    }
  }
};