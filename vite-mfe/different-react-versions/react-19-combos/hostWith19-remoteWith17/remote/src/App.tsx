import { useState } from 'react';

function App() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <h2>📦 Remote App (React 17)</h2>
      <p>This is a Remote App running React 17 with Vite!</p>

      <div style={{ margin: '20px 0' }}>
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
      </div>

      <p style={{ fontSize: '14px', color: '#666' }}>
        Remote app loaded successfully! ✅
      </p>
    </div>
  );
}

export default App
