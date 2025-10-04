import React, { Suspense, lazy, useState } from 'react'

const RemoteApp = lazy(() => import('remote/App'))
const RemoteButton = lazy(() => import('remote/Button'))

const App: React.FC = () => {
  const [count, setCount] = useState(0)

  return (
    <div>
      <div style={{ border: '2px solid green', padding: '20px', margin: '10px' }}>
        <h1>Host Application</h1>
        <p>This is the main application running on port 3000</p>
      </div>

      <Suspense fallback={<div>Loading remote component...</div>}>
        <RemoteApp />
      </Suspense>

      <div style={{ border: '2px solid purple', padding: '20px', margin: '10px' }}>
        <h2>Remote Button Component Demo</h2>
        <p>Button count: {count}</p>
        <Suspense fallback={<div>Loading button...</div>}>
          <RemoteButton
            label={`Click me (${count})`}
            onClick={() => setCount(count + 1)}
          />
        </Suspense>
      </div>
    </div>
  )
}

export default App
