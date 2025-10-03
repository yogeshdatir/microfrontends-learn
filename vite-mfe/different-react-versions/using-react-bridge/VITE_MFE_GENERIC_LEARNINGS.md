# Micro-Frontend Generic Learnings - React Bridge Integration with Vite (React 19 Host + React 17 Remote)

## React Bridge Integration Pattern

This setup demonstrates using **React Bridge** with **Vite** to integrate **React 19 host** with **React 17 remote** applications. React Bridge handles cross-version compatibility automatically, while Vite provides fast development and optimized builds.

### Key Architecture Decisions

1. **React Bridge Library**: Uses `@module-federation/bridge-react` for automatic compatibility
2. **Vite Module Federation**: Uses `@originjs/vite-plugin-federation` for ES module federation
3. **Component-based Integration**: Direct React component sharing instead of DOM mounting
4. **Built-in Loading States**: React Bridge manages loading and error states internally
5. **Version Abstraction**: Library handles all React version differences transparently

### Dependency Configuration

**Host (React 19) Dependencies**:
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
    "vite": "^7.1.7"
  }
}
```

**Remote (React 17) Dependencies**:
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
    "vite": "^7.1.7"
  }
}
```

### Vite Configuration Pattern

**Host (React 19)**:
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

**Remote (React 17)**:
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

### Integration Pattern

**Host Integration**:
```typescript
import { createRemoteComponent } from '@module-federation/bridge-react';

// React Bridge handles cross-version compatibility automatically
const RemoteApp = createRemoteComponent({
  loader: () => import('remote/App'),
  loading: <div>Loading remote app...</div>,
  fallback: ({ error }: { error?: Error }) => (
    <div>Error loading remote app: {error?.message || 'Unknown error'}</div>
  ),
});

function App() {
  return (
    <div>
      <h1>🚀 Host App (React 19)</h1>
      <p>Below is the React 17 remote app loaded via React Bridge:</p>

      {/* Direct component usage - no manual DOM refs needed */}
      <div style={{ border: '2px solid #ccc', padding: '20px', borderRadius: '8px' }}>
        <RemoteApp />
      </div>
    </div>
  );
}
```

**Remote Wrapper**:
```typescript
import { createBridgeComponent } from '@module-federation/bridge-react';
import App from './App';

// React Bridge component wrapper for cross-version compatibility
export default createBridgeComponent({
  rootComponent: App,
});
```

**Type Definitions**:
```typescript
// remotes.d.ts
declare module 'remote/App' {
  const RemoteApp: React.ComponentType;
  export default RemoteApp;
}
```

### Bootstrap Configuration

**Host Bootstrap** (React 19):
```typescript
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
```

**Remote Bootstrap** (React 17):
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

### Vite-Specific Considerations

**Development vs Production**:
- **Remote**: Must be built and served via `yarn build:preview` for federation to work
- **Host**: Runs normally in development mode with `yarn dev` (enjoys full HMR benefits!)
- **Asset Handling**: Vite generates different asset paths than Webpack

**Key Benefits**:
- Host gets fast HMR and instant updates during development
- Only remote needs the slower build+preview process
- Much better developer experience than requiring both apps to be built

**Build Process**:
1. Remote: `yarn build` → `yarn preview` (serves built federation files)
2. Host: `yarn dev` (consumes federation from remote preview)

### React Bridge Benefits with Vite

- **Fast Development**: Vite's HMR combined with React Bridge efficiency
- **Simplified Code**: Eliminates manual mount/unmount wrapper functions
- **Standard React Patterns**: Uses familiar component composition instead of DOM refs
- **Automatic Compatibility**: Handles React version differences internally
- **Built-in Error Handling**: Includes loading states and error boundaries
- **Type Safety**: Full TypeScript support with proper error types
- **Optimized Builds**: Vite's optimized ES module bundling

### Comparison with Webpack Approach

**Vite Advantages**:
```typescript
// Faster development builds
// Native ES modules
// Better HMR performance
// Simpler configuration syntax
```

**Webpack Advantages**:
```typescript
// Both remote and host can run in dev mode simultaneously
// More mature federation ecosystem
// Better documentation for complex scenarios
```

### Bundle Size Implications

- **React Bridge Library**: ~50KB addition to both applications
- **Vite Federation Plugin**: Lightweight ES module federation
- **Reduced Boilerplate**: Eliminates custom wrapper code
- **Shared Isolation**: Still maintains complete React version separation
- **Runtime Efficiency**: Optimized cross-version rendering with Vite's module system

### Performance Considerations

- **Fast Development**: Vite's instant server start and HMR
- **Automatic Optimization**: React Bridge optimizes cross-version communication
- **Loading Management**: Built-in loading states prevent render blocking
- **Error Boundaries**: Automatic error isolation prevents cascade failures
- **Memory Efficiency**: Proper cleanup handled internally
- **ES Module Benefits**: Native module loading performance

### Development Workflow

#### Setup Steps:
1. **Install React Bridge Dependencies**:
   - Host: `yarn add @module-federation/bridge-react react-router-dom @originjs/vite-plugin-federation`
   - Remote: `yarn add @module-federation/bridge-react react-router-dom @originjs/vite-plugin-federation`
2. **Configure Vite**: Set up Vite federation plugin in both applications with `shared: {}`
3. **Create Remote Bridge Wrapper**: Wrap remote component with `createBridgeComponent()`
4. **Implement Host Bridge Integration**: Import remote using `createRemoteComponent()`
5. **Add Type Definitions**: Create `remotes.d.ts` for TypeScript support

#### Running Steps (Vite-Specific):
6. **Start Remote (Build + Preview)**: `cd remote && yarn build:preview` (port 3001)
   - Alternative: `cd remote && yarn build` followed by `yarn preview`
   - ⚠️ **Important**: Remote MUST be built and served via preview for federation to work
7. **Start Host (Dev Mode)**: `cd host && yarn dev` (port 3000)
   - ✅ **Host runs normally in dev mode** - no build/preview needed
8. **Verify Integration**: Host should automatically load remote with Bridge compatibility
9. **Development**: Remote runs in preview mode, host runs in fast dev mode with HMR

#### Testing Steps:
11. **Test Loading**: Verify React Bridge handles remote loading correctly
12. **Test Error Handling**: Check that fallback components work properly
13. **Test Cross-Version**: Ensure React 17 ↔ React 19 compatibility is seamless
14. **Test Asset Loading**: Verify images and styles load correctly across federation

### Error Prevention

- ✅ No manual lifecycle management needed
- ✅ Automatic React version compatibility
- ✅ Built-in loading and error states
- ✅ Type-safe component integration
- ✅ Simplified debugging with clear error messages
- ✅ Vite-specific asset path resolution handled automatically

### Vite-Specific Troubleshooting

**Common Issues**:
1. **remoteEntry.js not found**: Ensure remote is built and running in preview mode
2. **Asset path errors**: Use external URLs for images or configure asset handling
3. **React 17 createRoot error**: Update main.tsx to use `ReactDOM.render()` for React 17
4. **Federation plugin conflicts**: Ensure compatible versions of Vite and federation plugin

**Solutions**:
- Remote must be in preview mode, not dev mode
- Host consumes federation assets from preview build
- Check browser network tab for actual federation file paths
- Use `cors: true` in Vite config for cross-origin requests

### When to Use React Bridge with Vite

- **Cross-version React applications** with fast development needs
- **Modern build tooling** preference over Webpack
- **Component-style integration** instead of DOM mounting
- **Want built-in loading and error handling** with Vite's performance
- **Prefer ES modules** and modern JavaScript features
- **Bundle size increase is acceptable** for development simplicity

### Performance Monitoring

- Monitor React Bridge bundle size impact (~50KB)
- Track Vite build performance vs Webpack
- Measure federation loading performance
- Monitor memory usage with automatic cleanup
- Check HMR performance in development