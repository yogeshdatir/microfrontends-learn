import { useEffect, useRef } from 'react';

function App() {
  const remoteRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loadRemoteApp = async () => {
      try {
        // @ts-ignore
        const remoteModule = await import('remote/App');
        if (remoteRef.current && remoteModule.default) {
          remoteModule.default.mount(remoteRef.current);
        }
      } catch (error) {
        console.error('Failed to load remote app:', error);
      }
    };

    loadRemoteApp();

    return () => {
      // Cleanup when component unmounts
      if (remoteRef.current) {
        // @ts-ignore
        import('remote/App').then(remoteModule => {
          if (remoteModule.default) {
            remoteModule.default.unmount();
          }
        });
      }
    };
  }, []);

  return (
    <div>
      <h1>🚀 Host App (React 19)</h1>
      <p>This is a Host App running React 19 with Vite!</p>
      <p>Loading remote app (React 18) below:</p>

      <div
        ref={remoteRef}
        style={{
          border: '2px solid #ccc',
          padding: '20px',
          margin: '20px 0',
          borderRadius: '8px'
        }}
      />
    </div>
  );
}

export default App
