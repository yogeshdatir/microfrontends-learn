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
      if (remoteRef.current) {
        // @ts-ignore
        import('remote/App').then(remoteModule => {
          if (remoteModule.default) {
            remoteModule.default.unmount(remoteRef.current!);
          }
        });
      }
    };
  }, []);

  return (
    <div>
      <h1>🚀 Host App (React 19)</h1>
      <p>This host application uses React 19 with complete isolation from React 18 remote.</p>
      <p>Below is the React 18 remote app:</p>

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

export default App;
