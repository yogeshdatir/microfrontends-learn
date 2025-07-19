import { useState } from 'react';
import './App.css';

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <div>
        <h2>Remote App (Vite + React)</h2>
        <p>This component is exposed via federation.</p>
      </div>
      <div className="card">
        <button
          style={{ background: 'red' }}
          onClick={() => setCount((count) => count + 1)}
        >
          count is {count}
        </button>
      </div>
    </>
  );
}

export default App;
