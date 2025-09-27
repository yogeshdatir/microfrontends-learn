// React 17 root mount

import ReactDOM from 'react-dom';
import App from './App';

const root = document.getElementById('root');
if (root) {
  ReactDOM.render(<App />, root);
}
