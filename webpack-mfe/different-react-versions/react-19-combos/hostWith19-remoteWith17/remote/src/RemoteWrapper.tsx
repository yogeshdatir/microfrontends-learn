import ReactDOM from 'react-dom';
import App from './App';

// Export a simple object with mount/unmount functions
// This avoids any React component interop issues
export default {
  mount: (element: HTMLElement) => {
    ReactDOM.render(<App />, element);
  },

  unmount: (element: HTMLElement) => {
    ReactDOM.unmountComponentAtNode(element);
  }
};