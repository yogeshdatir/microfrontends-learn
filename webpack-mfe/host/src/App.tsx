import { Suspense, lazy } from 'react';

const RemoteApp = lazy(() => import('remote/App'));

const App = () => {
  return (
    <div>
      <h1>🚀 Host App</h1>
      <p>This is a standalone React TypeScript app!</p>
      <p>Later, this will consume the remote app.</p>
      <Suspense fallback={<div>Loading remote app...</div>}>
        <RemoteApp />
      </Suspense>
    </div>
  );
};

export default App;
