import React, { useState } from 'react'

const App: React.FC = () => {
  const [count, setCount] = useState(0)

  return (
    <div style={{ border: '2px solid blue', padding: '20px', margin: '10px' }}>
      <h2>Advanced Remote Component</h2>
      <p>This component demonstrates production-ready remote loading patterns</p>
      <div style={{ marginTop: '15px' }}>
        <button
          onClick={() => setCount(count + 1)}
          style={{
            padding: '10px 20px',
            backgroundColor: '#4CAF50',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          Remote Counter: {count}
        </button>
      </div>
      <p style={{ fontSize: '12px', color: '#666', marginTop: '10px' }}>
        Loaded from port 3001 with error handling & retry logic
      </p>
    </div>
  )
}

export default App
