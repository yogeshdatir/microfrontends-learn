import { useState } from 'react'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src="https://vitejs.dev/logo.svg" className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src="https://react.dev/favicon-32x32.png" className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>🚀 Remote App (React 17)</h1>
      <p>This remote application runs React 17 and is loaded via React Bridge.</p>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Cross-version compatibility handled automatically!
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  )
}

export default App
