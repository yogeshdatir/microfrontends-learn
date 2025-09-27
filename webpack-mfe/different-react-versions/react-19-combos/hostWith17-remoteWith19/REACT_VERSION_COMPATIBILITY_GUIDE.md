# React 17 Host + React 19 Remote Compatibility Guide

## Scenario Overview

This setup explores running a React 17 host application that consumes a React 19 remote micro-frontend.

**Configuration:**
- **Host Application**: React 17 with `ReactDOM.render()`
- **Remote Application**: React 19 with `createRoot()`
- **Integration**: DOM-based mounting with complete React isolation

## Encountered Issues

### 1. Bootstrap Element Mismatch
```
// Common mistake in bootstrap.tsx
const root = document.getElementById('remote-root'); // ❌ Wrong element ID
```

**Error**: Host displays blank screen because bootstrap targets non-existent element.

### 2. Script Error from React Context Mixing
```
ERROR Script error.
    at Object.invokeGuardedCallbackDev (react-dom.development.js:3994:16)
    at invokeGuardedCallback (react-dom.development.js:4056:31)
```

**Cause**: Attempting to share React dependencies between different major versions causes internal API conflicts.

### 3. Shared Module Resolution Failures
```
Shared module react doesn't exist in shared scope default
```

**Cause**: Module Federation can't resolve React when using `import: false` without fallbacks.

## Solution: Complete React Isolation

### 1. Remove React Sharing in Webpack

**Host Configuration:**
```javascript
// host/webpack.config.js
new ModuleFederationPlugin({
  name: 'host',
  remotes: {
    remote: 'remote@http://localhost:3001/remoteEntry.js',
  },
  shared: {}, // No React sharing
})
```

**Remote Configuration:**
```javascript
// remote/webpack.config.js
new ModuleFederationPlugin({
  name: 'remote',
  filename: 'remoteEntry.js',
  exposes: {
    './App': './src/RemoteWrapper',
  },
  shared: {}, // No React sharing
})
```

### 2. Host Implementation (React 17)

**Bootstrap with correct element targeting:**
```typescript
// host/src/bootstrap.tsx
import ReactDOM from 'react-dom';
import App from './App';

const root = document.getElementById('root'); // Match index.html
if (root) {
  ReactDOM.render(<App />, root);
}
```

**Host App with DOM-based remote loading:**
```typescript
// host/src/App.tsx
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
      <h1>🚀 Host App (React 17)</h1>
      <p>This host application uses React 17.</p>

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
```

### 3. Remote Implementation (React 19)

**Remote wrapper using React 19 APIs:**
```typescript
// remote/src/RemoteWrapper.tsx
import { createRoot, Root } from 'react-dom/client';
import App from './App';

let root: Root | null = null;

export default {
  mount: (element: HTMLElement) => {
    if (!root) {
      root = createRoot(element);
    }
    root.render(<App />);
  },

  unmount: (element: HTMLElement) => {
    if (root) {
      root.unmount();
      root = null;
    }
  }
};
```

## Architecture

```
┌─────────────────────────────────────┐
│        Host App (React 17)          │
│  ┌─────────────────────────────────┐│
│  │    ReactDOM.render() context    ││
│  │                                 ││
│  │  ┌─────────────────────────────┐││
│  │  │      DOM Container          │││
│  │  │                             │││
│  │  │  ┌─────────────────────────┐│││
│  │  │  │ Remote (React 19)       ││││
│  │  │  │ createRoot() context    ││││
│  │  │  │ (isolated)              ││││
│  │  │  └─────────────────────────┘│││
│  │  └─────────────────────────────┘││
│  └─────────────────────────────────┘│
└─────────────────────────────────────┘
```

## Key Benefits

✅ **Complete Version Isolation**: Each app uses its own React version without conflicts

✅ **Simple Remote Implementation**: Remote can use pure React 19 APIs without compatibility layers

✅ **DOM Integration**: Clean boundaries between different React contexts

✅ **Independent Bundling**: Each app includes its own React copy (~40KB each)

## Implementation Notes

### Host Considerations
- Uses legacy React 17 `ReactDOM.render()` API
- Provides DOM container for remote mounting
- Handles remote lifecycle through useEffect

### Remote Considerations
- Uses modern React 19 `createRoot()` API
- Exports mount/unmount functions instead of components
- No version compatibility logic needed

### Bundle Impact
- Total React overhead: ~80KB gzipped (40KB per app)
- Trade-off for complete version independence

## Testing Approach

**Isolation Testing:**
- [ ] Host works standalone on React 17
- [ ] Remote works standalone on React 19
- [ ] Separate React DevTools instances appear

**Integration Testing:**
- [ ] Host successfully loads and mounts remote
- [ ] Remote renders correctly within host container
- [ ] Cleanup works properly on navigation

**Bundle Verification:**
- [ ] webpack-bundle-analyzer shows separate React copies
- [ ] No shared React dependencies in bundle analysis

## Troubleshooting

### Host Shows Blank Screen
**Check**: Bootstrap element ID matches HTML template

### TypeScript Errors in Remote
**Solution**: Use type assertions for dynamic imports (`@ts-ignore`)

### Remote Won't Load
**Check**: Webpack exposes RemoteWrapper correctly
**Check**: Remote runs on expected port (3001)

This pattern demonstrates how React 17 and React 19 applications can coexist through complete framework isolation.