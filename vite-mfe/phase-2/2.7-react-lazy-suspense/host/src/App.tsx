import React, { lazy } from 'react';
import { RemoteErrorBoundary } from './components/RemoteErrorBoundary';
import { SmartSuspense } from './components/SmartSuspense';
import { useNetworkStatus } from './hooks/useNetworkStatus';
import { createRemoteLoader } from './utils/remoteLoader';
import { preloadRemoteModule } from './utils/preloader';

// Production-ready remote loading with retry mechanism
const RemoteApp = lazy(createRemoteLoader(() => import('remote/App'), 3, 1000));

// Alternative: Basic approach with inline error handling
const RemoteAppWithFallback = lazy(() =>
  import('remote/App').catch(() => ({
    default: () => (
      <div style={{ border: '2px solid red', padding: '20px', margin: '10px' }}>
        ❌ Remote component failed to load
        <button
          onClick={() => window.location.reload()}
          style={{
            marginLeft: '10px',
            padding: '5px 15px',
            backgroundColor: '#ff9800',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          Retry
        </button>
      </div>
    ),
  }))
);

const App: React.FC = () => {
  const { isOnline } = useNetworkStatus();

  // Preload remote component on mount
  React.useEffect(() => {
    if (isOnline) {
      preloadRemoteModule('RemoteApp', () => import('remote/App'));
    }
  }, [isOnline]);

  return (
    <div>
      <div
        style={{ border: '2px solid green', padding: '20px', margin: '10px' }}
      >
        <h1>🏠 Host Application - Advanced Loading Patterns</h1>
        <p>Running on port 3000</p>
        <p>Network Status: {isOnline ? '🟢 Online' : '🔴 Offline'}</p>
      </div>

      {!isOnline && (
        <div
          style={{
            border: '2px solid orange',
            padding: '20px',
            margin: '10px',
            backgroundColor: '#fff3cd',
          }}
        >
          <p>⚠️ You're offline. Remote components may not load.</p>
        </div>
      )}

      <div style={{ margin: '10px' }}>
        <h2>1. With Error Boundary + Smart Suspense</h2>
        <RemoteErrorBoundary
          onError={(error, errorInfo) => {
            console.error('Remote component error:', error, errorInfo);
          }}
        >
          <SmartSuspense
            fallback={
              <div style={{ padding: '20px', color: '#666' }}>
                <div className="spinner">Loading remote component...</div>
              </div>
            }
            minLoadingTime={200}
            timeout={15000}
          >
            <RemoteApp />
          </SmartSuspense>
        </RemoteErrorBoundary>
      </div>

      <div style={{ margin: '10px' }}>
        <h2>2. With Inline Error Fallback</h2>
        <SmartSuspense
          fallback={<div style={{ padding: '20px' }}>Loading...</div>}
          minLoadingTime={200}
        >
          <RemoteAppWithFallback />
        </SmartSuspense>
      </div>

      <div
        style={{
          border: '2px solid purple',
          padding: '20px',
          margin: '10px',
        }}
      >
        <h3>📚 Demonstrated Patterns</h3>
        <ul>
          <li>✅ Retry mechanism with exponential backoff</li>
          <li>✅ Error boundaries with retry logic</li>
          <li>✅ Smart loading states (no flash on fast connections)</li>
          <li>✅ Network status detection</li>
          <li>✅ Component preloading</li>
          <li>✅ Timeout handling</li>
        </ul>
      </div>
    </div>
  );
};

export default App;
