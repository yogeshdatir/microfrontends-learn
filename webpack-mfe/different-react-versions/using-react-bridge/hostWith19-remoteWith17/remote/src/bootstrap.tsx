// React 17 root mount - only when running standalone
import ReactDOM from 'react-dom';
import App from './App';

const remoteRoot = document.getElementById('remote-root');
if (remoteRoot) {
  ReactDOM.render(<App />, remoteRoot);
}
