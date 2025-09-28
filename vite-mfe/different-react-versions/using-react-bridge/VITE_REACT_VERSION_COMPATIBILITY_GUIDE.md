# React Version Compatibility Guide - React Bridge with Vite (React 19 Host + React 17 Remote)

## Setup Overview

This configuration demonstrates using **React Bridge** with **Vite** to enable seamless integration between a **React 19 host application** and a **React 17 remote application**. React Bridge abstracts away version differences while Vite provides modern build tooling and fast development.

## React Version Compatibility

### Host Application (React 19)
- **React Version**: 19.1.1
- **Rendering API**: `createRoot()` from `react-dom/client`
- **JSX Transform**: Automatic with React 19 optimizations
- **New Features**: Uses React 19 concurrent features and optimizations
- **Bridge Integration**: Uses `createRemoteComponent()` for loading remote apps
- **Build Tool**: Vite 7.1.7 with ES module federation

### Remote Application (React 17)
- **React Version**: 17.0.2
- **Rendering API**: `ReactDOM.render()` legacy API
- **JSX Transform**: Classic transform
- **Features**: Standard React 17 features and patterns
- **Bridge Integration**: Uses `createBridgeComponent()` for compatibility
- **Build Tool**: Vite 7.1.7 with ES module federation

## React Bridge Integration Strategy with Vite

### Automatic Compatibility Approach
React Bridge handles all version differences internally, while Vite provides optimized ES module federation:

```javascript
// Host - Simple component loading with Vite federation
const RemoteApp = createRemoteComponent({
  loader: () => import('remote/App'),
  loading: <div>Loading...</div>,
  fallback: ({ error }) => <div>Error: {error?.message}</div>,
});

// Remote - Simple component wrapping
export default createBridgeComponent({
  rootComponent: App,
});
```

### Why React Bridge with Vite?

1. **Automatic API Translation**: Handles React 17 ↔ React 19 API differences
2. **Fast Development**: Vite's instant server start and HMR
3. **ES Module Federation**: Modern module system with better performance
4. **Component-Style Integration**: Uses familiar React patterns instead of DOM mounting
5. **Built-in Error Handling**: Includes loading states and error boundaries
6. **Type Safety**: Full TypeScript support with proper error types
7. **Optimized Builds**: Native ES module bundling and tree-shaking

## Implementation Details

### Host Application Setup

**Package Dependencies**:
```json
{
  "dependencies": {
    "react": "^19.1.1",
    "react-dom": "^19.1.1",
    "@module-federation/bridge-react": "^0.19.1",
    "react-router-dom": "^6.26.1"
  },
  "devDependencies": {
    "@originjs/vite-plugin-federation": "^1.3.7",
    "@vitejs/plugin-react": "^5.0.3",
    "vite": "^7.1.7"
  }
}
```

**Vite Configuration**:
```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import federation from '@originjs/vite-plugin-federation'

export default defineConfig({
  plugins: [
    react(),
    federation({
      name: 'host',
      remotes: {
        remote: 'http://localhost:3001/assets/remoteEntry.js',
      },
      shared: {
        // Intentionally not sharing React to enable different versions
      }
    })
  ],
  server: {
    port: 3000,
  },
  build: {
    target: 'esnext',
    minify: false,
    cssCodeSplit: false,
  },
})
```

**Integration Code**:
```typescript
import { useState } from 'react'
import { createRemoteComponent } from '@module-federation/bridge-react'

// React Bridge handles all compatibility automatically
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
      <h1>🚀 Host App (React 19)</h1>
      <p>This host application uses React 19 with React Bridge for compatibility.</p>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>Below is the React 17 remote app loaded via React Bridge:</p>
      </div>

      <div style={{
        border: '2px solid #ccc',
        padding: '20px',
        margin: '20px 0',
        borderRadius: '8px'
      }}>
        <RemoteApp />
      </div>
    </>
  )
}
```

**Type Definitions**:
```typescript
// src/remotes.d.ts
declare module 'remote/App' {
  const RemoteApp: React.ComponentType;
  export default RemoteApp;
}
```

### Remote Application Setup

**Package Dependencies**:
```json
{
  "dependencies": {
    "react": "^17.0.2",
    "react-dom": "^17.0.2",
    "@module-federation/bridge-react": "^0.19.1",
    "react-router-dom": "^6.26.1"
  },
  "devDependencies": {
    "@originjs/vite-plugin-federation": "^1.3.7",
    "@vitejs/plugin-react": "^5.0.3",
    "vite": "^7.1.7"
  }
}
```

**Vite Configuration**:
```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import federation from '@originjs/vite-plugin-federation'

export default defineConfig({
  plugins: [
    react(),
    federation({
      name: 'remote',
      filename: 'remoteEntry.js',
      exposes: {
        './App': './src/RemoteWrapper',
      },
      shared: {
        // Intentionally not sharing React to enable different versions
      }
    })
  ],
  server: {
    port: 3001,
    cors: true,
  },
  preview: {
    port: 3001,
    cors: true,
  },
  build: {
    target: 'esnext',
    minify: false,
    cssCodeSplit: false,
  },
})
```

**Remote Wrapper**:
```typescript
import { createBridgeComponent } from '@module-federation/bridge-react';
import App from './App';

// React Bridge component wrapper - handles all version compatibility
export default createBridgeComponent({
  rootComponent: App,
});
```

**Bootstrap (React 17 API)**:
```typescript
import { StrictMode } from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import App from './App.tsx'

ReactDOM.render(
  <StrictMode>
    <App />
  </StrictMode>,
  document.getElementById('root')
)
```

## React API Compatibility

### Rendering APIs
- **React 19**: Uses modern `createRoot()` with enhanced concurrent features
- **React 17**: Uses legacy `ReactDOM.render()` API
- **Bridge Translation**: Automatically translates between different rendering APIs
- **Vite Optimization**: ES module loading enhances performance

### Lifecycle Management
- **Host**: Uses `createRemoteComponent()` with built-in loading/error states
- **Remote**: Uses `createBridgeComponent()` for automatic compatibility
- **Cleanup**: React Bridge handles all cleanup automatically
- **HMR**: Vite's Hot Module Replacement works seamlessly with Bridge

## Development Guidelines

### Host Development (React 19)
```typescript
import { createRemoteComponent } from '@module-federation/bridge-react';

// Use React 19 features freely - Bridge handles remote compatibility
const RemoteApp = createRemoteComponent({
  loader: () => import('remote/App'),
  loading: <div>Loading remote app...</div>,
  fallback: ({ error }: { error?: Error }) => (
    <div>Failed to load: {error?.message}</div>
  ),
});

function HostComponent() {
  // React 19 specific features available
  // Vite HMR works seamlessly
  return (
    <div>
      <h1>Host with React 19 + Vite</h1>
      <RemoteApp />
    </div>
  );
}
```

### Remote Development (React 17)
```typescript
import { createBridgeComponent } from '@module-federation/bridge-react';

// Standard React 17 component - Bridge handles compatibility
const App = () => (
  <div>
    <h1>🚀 Remote App (React 17)</h1>
    <p>This remote application runs React 17 and is loaded via React Bridge.</p>
    <p>Cross-version compatibility handled automatically!</p>
  </div>
);

// Export with Bridge wrapper
export default createBridgeComponent({
  rootComponent: App,
});
```

## Vite-Specific Development Workflow

### Development Mode Differences

**Unlike Webpack**: Only the remote must be built and served in preview mode for federation to work. The host can run in normal dev mode with full HMR benefits!

**Workflow**:
1. **Remote Development** (⚠️ Requires Build + Preview):
   ```bash
   cd remote
   yarn build:preview  # Build and serve for federation (port 3001)
   # Alternative: yarn build && yarn preview
   ```

2. **Host Development** (✅ Normal Dev Mode):
   ```bash
   cd host
   yarn dev      # Run in fast development mode on port 3000 (HMR works!)
   ```

**Key Difference from Webpack**: Only the remote needs build+preview. Host enjoys full dev mode benefits!

### Asset Handling

**Local Assets**: Use external URLs for reliability across federation:
```typescript
// Instead of local imports that may fail in federation
// import reactLogo from './assets/react.svg'

// Use external URLs for better federation compatibility
<img src="https://vitejs.dev/logo.svg" alt="Vite logo" />
<img src="https://react.dev/favicon-32x32.png" alt="React logo" />
```

## Comparison with Manual Approach

### Manual DOM Wrappers (Before)
```typescript
// Remote - Manual wrapper (complex, Vite-specific)
export default {
  mount: (element: HTMLElement) => {
    ReactDOM.render(<App />, element);
  },
  unmount: (element: HTMLElement) => {
    ReactDOM.unmountComponentAtNode(element);
  }
};

// Host - Manual integration (complex, no Vite HMR)
const remoteRef = useRef<HTMLDivElement>(null);
useEffect(() => {
  // 20+ lines of manual mount/unmount logic
  // Vite HMR doesn't work with manual DOM mounting
}, []);
```

### React Bridge with Vite (After)
```typescript
// Remote - Bridge wrapper (simple, Vite-compatible)
export default createBridgeComponent({
  rootComponent: App,
});

// Host - Bridge integration (simple, Vite HMR works)
const RemoteApp = createRemoteComponent({
  loader: () => import('remote/App'),
  loading: <div>Loading...</div>,
  fallback: ({ error }) => <div>Error: {error?.message}</div>,
});
```

## Testing Considerations

### Unit Testing with Vite:
1. **Test Each App Separately**: Each application tests with its own React version and Vite config
2. **Use Vitest**: Vite's native testing framework works seamlessly
3. **Mock Federation**: Mock remote imports for isolated testing
4. **No Cross-Version Complexity**: No special cross-version testing complexity needed

### Integration Testing Steps:
1. **Test Loading States**: Verify `createRemoteComponent()` loading behavior
2. **Test Error Handling**: Check that `fallback` prop works correctly
3. **Test Component Mounting**: Ensure React Bridge handles mounting properly
4. **Test Cleanup**: Verify proper cleanup and memory management
5. **Test Cross-Version Compatibility**: Ensure React 17 ↔ React 19 integration works
6. **Test Vite HMR**: Verify hot reloading works in host during development

## Deployment Strategy

### Build Process with Vite:
1. **Build Remote First**:
   ```bash
   cd remote
   yarn build
   # For development with preview: yarn build:preview
   ```

2. **Build Host**:
   ```bash
   cd host
   yarn build
   ```

### Independent Deployment Steps:
1. **Deploy Remote**: Deploy remote build to CDN or hosting environment
2. **Update Remote URL**: Update host Vite config with production remote URL
3. **Deploy Host**: Deploy host with updated remote reference
4. **Test Federation**: Verify React Bridge handles cross-deployment communication

### Production Configuration:
```typescript
// Update remote URL for production
federation({
  name: 'host',
  remotes: {
    remote: 'https://your-remote-domain.com/assets/remoteEntry.js',
  },
  shared: {},
})
```

## Troubleshooting

### Vite-Specific Issues

**remoteEntry.js not found**:
- Ensure remote is built and served (`yarn build:preview` or `yarn build && yarn preview`)
- Check that remote is running on correct port (3001)
- Verify federation plugin is properly configured

**Asset loading failures**:
- Use external URLs for images and assets
- Check browser network tab for actual federation paths
- Ensure CORS is enabled in remote Vite config

**React 17 rendering errors**:
- Update main.tsx to use `ReactDOM.render()` instead of `createRoot()`
- Ensure React 17 types are correctly installed

**HMR not working**:
- Host HMR works normally in dev mode
- Remote changes require rebuild and preview restart
- Bridge components update automatically with HMR

### Performance Monitoring

- Monitor React Bridge bundle size impact (~50KB)
- Track Vite build performance vs Webpack
- Measure ES module loading performance
- Monitor federation loading times
- Check memory usage with automatic cleanup

## Best Practices with Vite

1. **Development Workflow**: Always build remote before host development
2. **Dependencies**: Install all federation dependencies in both apps
3. **Error Handling**: Use descriptive `fallback` components for better UX
4. **Loading States**: Provide meaningful `loading` components
5. **Asset Strategy**: Use external URLs for shared assets
6. **Type Safety**: Create proper TypeScript declarations for remotes
7. **CORS Configuration**: Enable CORS for cross-origin federation
8. **Build Optimization**: Use `target: 'esnext'` for modern browsers

## Security Considerations

- Remote applications load from trusted sources only
- React Bridge maintains security boundaries between versions
- Each application maintains its own security context
- No cross-version state leaking or context pollution
- Vite's ES module security benefits apply

## When to Use React Bridge with Vite

**Use React Bridge + Vite When:**
- Working with different React major versions
- Want modern build tooling with fast development
- Need component-style integration over DOM mounting
- Want built-in loading and error handling
- Prefer ES modules and modern JavaScript features
- Bundle size increase is acceptable for simplicity
- Team is comfortable with Vite ecosystem

**Consider Webpack Approach When:**
- Need both remote and host in development mode simultaneously
- Working with legacy build requirements
- Need more mature federation documentation
- Have existing Webpack infrastructure

## Performance Comparison

**Vite Advantages**:
- Faster development server startup
- Better HMR performance
- Native ES module loading
- Optimized production builds
- Modern JavaScript features

**Trade-offs**:
- Remote must be in preview mode during development
- Less mature federation ecosystem than Webpack
- Additional learning curve for Vite-specific patterns