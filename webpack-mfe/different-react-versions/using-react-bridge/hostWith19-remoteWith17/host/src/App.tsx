import { createRemoteComponent } from '@module-federation/bridge-react';

// Create remote component using React Bridge with required parameters
const RemoteApp = createRemoteComponent({
  loader: () => import('remote/App'),
  loading: <div>Loading remote app...</div>,
  fallback: ({ error }: { error?: Error }) => (
    <div>Error loading remote app: {error?.message || 'Unknown error'}</div>
  ),
});

function App() {
  return (
    <div>
      <h1>🚀 Host App (React 19)</h1>
      <p>This host application uses React 19 with React Bridge for compatibility.</p>
      <p>Below is the React 17 remote app loaded via React Bridge:</p>

      <div
        style={{
          border: '2px solid #ccc',
          padding: '20px',
          margin: '20px 0',
          borderRadius: '8px'
        }}
      >
        <RemoteApp />
      </div>
    </div>
  );
}

export default App;
