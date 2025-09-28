import { useState } from 'react'
import { createRemoteComponent } from '@module-federation/bridge-react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

// Create remote component using React Bridge with required parameters
const RemoteApp = createRemoteComponent({
  loader: () => import('remote/App'),
  loading: <div>Loading remote app...</div>,
  fallback: ({ error }: { error?: Error }) => (
    <div>Error loading remote app: {error?.message || 'Unknown error'}</div>
  ),
})

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>🚀 Host App (React 19)</h1>
      <p>This host application uses React 19 with React Bridge for compatibility.</p>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Below is the React 17 remote app loaded via React Bridge:
        </p>
      </div>

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
    </>
  )
}

export default App
