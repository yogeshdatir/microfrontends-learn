# React Cross-Version Micro-Frontend Compatibility Guide

## Problem Overview

When implementing micro-frontends with different React versions (e.g., React 19 host consuming React 17 remote), you may encounter severe compatibility issues that prevent the applications from working together.

### Initial Setup Issues

Our initial setup had the following configuration:
- **Host Application**: React 19 with `createRoot()` rendering
- **Remote Application**: React 17 with `ReactDOM.render()` rendering
- **Module Federation**: Shared React dependencies with singleton constraints

## Errors Encountered

### 1. Version Mismatch Error
```
Unsatisfied version 19.1.1 from host of shared singleton module react (required ^17)
```

**Cause**: Module Federation's singleton constraint prevents multiple React versions from coexisting when `singleton: true` is set.

### 2. ReactCurrentDispatcher Error
```
Uncaught TypeError: Cannot read properties of undefined (reading 'ReactCurrentDispatcher')
```

**Cause**: React 19 trying to render React 17 components causes internal API conflicts. Different React versions have incompatible hook dispatchers and internal state management.

### 3. Script/Runtime Errors
```
ERROR Script error.
An error occurred in one of your React components.
```

**Cause**: Mixing React rendering contexts leads to runtime conflicts where React 17 components cannot execute properly within React 19's rendering context.

## Root Causes Analysis

### 1. **Incompatible React Internal APIs**
- React 17 and React 19 have different internal architectures
- Hook dispatchers, fiber reconciler, and rendering APIs are not backward compatible
- Attempting to render React 17 components directly in React 19 context fails

### 2. **Module Federation Sharing Conflicts**
- `singleton: true` forces a single React version across all micro-frontends
- Different `shareScope` and `shareKey` configurations create module resolution conflicts
- Version constraints (`requiredVersion`) reject mismatched React versions

### 3. **Rendering Context Mixing**
- React 19 uses `createRoot()` while React 17 uses `ReactDOM.render()`
- Cross-version component rendering attempts to mix these incompatible rendering approaches

## Solution: Complete React Isolation

The solution involves completely isolating React versions and using DOM-based mounting instead of React component interop.

### Architecture Overview

```
┌─────────────────────────────────────┐
│           Host App (React 19)       │
│  ┌─────────────────────────────────┐│
│  │     createRoot().render()       ││
│  │                                 ││
│  │  ┌─────────────────────────────┐││
│  │  │      DOM Container          │││
│  │  │                             │││
│  │  │  ┌─────────────────────────┐│││
│  │  │  │ Remote Mount Function   ││││
│  │  │  │                         ││││
│  │  │  │ ReactDOM.render()       ││││
│  │  │  │ (React 17)              ││││
│  │  │  └─────────────────────────┘│││
│  │  └─────────────────────────────┘││
│  └─────────────────────────────────┘│
└─────────────────────────────────────┘
```

### Implementation Details

#### 1. Webpack Configuration Changes

**Remove all React sharing:**

```javascript
// host/webpack.config.js & remote/webpack.config.js
new ModuleFederationPlugin({
  // ... other config
  shared: {}, // Empty - no React sharing
})
```

#### 2. Remote Application Changes

**Export mount/unmount functions instead of React components:**

```typescript
// remote/src/RemoteWrapper.tsx
import ReactDOM from 'react-dom';
import App from './App';

export default {
  mount: (element: HTMLElement) => {
    ReactDOM.render(<App />, element);
  },

  unmount: (element: HTMLElement) => {
    ReactDOM.unmountComponentAtNode(element);
  }
};
```

**Update webpack to expose the wrapper:**

```javascript
// remote/webpack.config.js
exposes: {
  './App': './src/RemoteWrapper',
},
```

#### 3. Host Application Changes

**Use DOM mounting instead of React component rendering:**

```typescript
// host/src/App.tsx
import { useEffect, useRef } from 'react';

function App() {
  const remoteRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loadRemoteApp = async () => {
      try {
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
      <h1>🚀 Host App (React 19)</h1>
      <div ref={remoteRef} />
    </div>
  );
}
```

## Benefits of This Solution

### ✅ **Complete Version Isolation**
- Each application bundles and uses its own React version
- No shared dependencies that could cause conflicts
- Host and remote operate in completely separate React contexts

### ✅ **DOM-Based Integration**
- Host provides a DOM container element
- Remote mounts using its own React version into that container
- No React component interop that could cause API conflicts

### ✅ **Lifecycle Management**
- Proper mounting/unmounting when host component mounts/unmounts
- Clean separation of concerns between React versions
- Memory leak prevention through proper cleanup

### ✅ **Backward Compatibility**
- Works with any React version combination
- Remote can use legacy React patterns without affecting host
- Future-proof for React version upgrades

## Trade-offs and Considerations

### Bundle Size Impact
- **Increased**: Each app bundles its own React (adds ~40KB gzipped per app)
- **Mitigation**: Acceptable for better stability and flexibility

### Development Complexity
- **Increased**: More complex integration pattern than direct component sharing
- **Mitigation**: Clear patterns and good documentation

### Type Safety
- **Reduced**: TypeScript integration requires `@ts-ignore` for dynamic imports
- **Mitigation**: Can be improved with proper type definitions

## Best Practices

### 1. **Container Styling**
```typescript
// Provide clear visual boundaries
<div
  ref={remoteRef}
  style={{
    border: '2px solid #ccc',
    padding: '20px',
    borderRadius: '8px'
  }}
/>
```

### 2. **Error Handling**
```typescript
try {
  const remoteModule = await import('remote/App');
  remoteModule.default.mount(remoteRef.current);
} catch (error) {
  console.error('Failed to load remote app:', error);
  // Show fallback UI
}
```

### 3. **Loading States**
```typescript
const [isLoading, setIsLoading] = useState(true);

// Show loading indicator until remote mounts
{isLoading && <div>Loading remote app...</div>}
```

## Testing Strategy

### 1. **Isolation Verification**
- Verify each app works standalone
- Confirm different React DevTools instances
- Check bundle analysis for separate React copies

### 2. **Integration Testing**
- Test mounting/unmounting cycles
- Verify proper cleanup on navigation
- Test error scenarios (network failures, etc.)

### 3. **Performance Testing**
- Measure bundle size impact
- Test loading performance
- Monitor memory usage during mount/unmount cycles

## Conclusion

This solution provides a robust approach for running multiple React versions in a micro-frontend architecture. While it requires more setup than simple component sharing, it offers:

- **Reliability**: No React version conflicts
- **Flexibility**: Each app can use optimal React version
- **Maintainability**: Clear boundaries between applications
- **Scalability**: Pattern works for any number of React versions

The trade-off in bundle size and complexity is justified by the elimination of compatibility issues and the freedom to evolve each micro-frontend independently.