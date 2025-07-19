import { Suspense, lazy } from 'react';

const RemoteApp = lazy(() => import('remote/RemoteApp'));

import './App.css';

function App() {
  return (
    <div>
      <h1>Host App (Vite + React)</h1>
      <Suspense fallback={<div>Loading remote...</div>}>
        <RemoteApp />
      </Suspense>
    </div>
  );
}

export default App;
