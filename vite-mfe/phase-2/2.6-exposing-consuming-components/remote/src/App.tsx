import React from 'react'

const App: React.FC = () => (
  <div style={{ border: '2px solid blue', padding: '20px', margin: '10px' }}>
    <h2>Remote App Component</h2>
    <p>This component is loaded dynamically from port 3001</p>
    <p style={{ fontSize: '14px', color: '#666' }}>
      Exposed via Module Federation
    </p>
  </div>
)

export default App
