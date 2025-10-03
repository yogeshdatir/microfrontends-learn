# Vite React Version Compatibility Guide - React 17 Host + React 19 Remote

## Setup Overview

This configuration demonstrates a **React 17 host application** consuming a **React 19 remote application** using Vite Module Federation with complete React isolation.

## React Version Compatibility

### Host Application (React 17)
- **React Version**: 17.0.2
- **Rendering API**: `ReactDOM.render()` legacy API
- **JSX Transform**: Classic transform
- **Features**: Standard React 17 features and patterns
- **Build Tool**: Vite with legacy React support

### Remote Application (React 19)
- **React Version**: 19.1.1
- **Rendering API**: `createRoot()` from `react-dom/client`
- **JSX Transform**: Automatic with React 19 optimizations
- **New Features**: Uses React 19 concurrent features and optimizations
- **Build Tool**: Vite with modern React support

## Version Isolation Strategy

### Complete Isolation Approach
Both applications bundle their own React versions to prevent runtime conflicts:

```typescript
// Both vite.config.ts files
import federation from '@originjs/vite-plugin-federation'

export default defineConfig({
  plugins: [
    react(),
    federation({
      // ... other config
      shared: {}, // No shared dependencies - complete isolation
    })
  ]
})
```

### Why Complete Isolation?

1. **API Differences**: React 17 and 19 have significantly different internal APIs
2. **Runtime Safety**: Prevents version conflicts and unexpected behavior
3. **Independent Development**: Teams can upgrade React versions independently
4. **Predictable Behavior**: Each app operates with its expected React version
5. **Vite Optimization**: Each app optimized for its specific React version

## Implementation Details

### Host Application Setup

**Package Dependencies**:
```json
{
  "dependencies": {
    "react": "^17",
    "react-dom": "^17"
  },
  "devDependencies": {
    "@types/react": "^17",
    "@types/react-dom": "^17",
    "@originjs/vite-plugin-federation": "^1.3.6"
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
      shared: {}
    })
  ],
  server: {
    port: 3000
  },
  build: {
    target: 'esnext'
  }
})
```

**Integration Code**:
```typescript
// Host loads remote using DOM-based integration
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
}, []);
```

### Remote Application Setup

**Package Dependencies**:
```json
{
  "dependencies": {
    "react": "^19",
    "react-dom": "^19"
  },
  "devDependencies": {
    "@types/react": "^19",
    "@types/react-dom": "^19",
    "@originjs/vite-plugin-federation": "^1.3.6"
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
      shared: {}
    })
  ],
  server: {
    port: 3001
  },
  build: {
    target: 'esnext'
  }
})
```

**Remote Wrapper**:
```typescript
import { createRoot } from 'react-dom/client';
import type { Root } from 'react-dom/client';
import App from './App';

let root: Root | null = null;

export default {
  mount: (element: HTMLElement) => {
    if (!root) {
      root = createRoot(element);
    }
    root.render(<App />);
  },

  unmount: () => {
    if (root) {
      root.unmount();
      root = null;
    }
  }
};
```

## React API Compatibility

### Rendering APIs
- **React 17**: Uses legacy `ReactDOM.render()` API with backward compatibility
- **React 19**: Uses modern `createRoot()` with enhanced concurrent features
- **Compatibility**: Both versions use different mounting API patterns but work together through DOM isolation

### Lifecycle Management
- **Mount**: React 17 uses `ReactDOM.render()`, React 19 uses `createRoot()` and `render()`
- **Unmount**: React 17 uses `ReactDOM.unmountComponentAtNode()`, React 19 uses `root.unmount()`
- **Cleanup**: Proper root disposal prevents memory leaks

### TypeScript Support
```typescript
// Host type declarations (React 17 compatible)
declare module 'remote/App' {
  const App: {
    mount: (element: HTMLElement) => void;
    unmount: () => void;
  };
  export default App;
}
```

## Vite-Specific Compatibility

### Build Process
- **React 17**: Vite transforms JSX using React 17 patterns
- **React 19**: Vite optimizes for React 19 concurrent features
- **Federation**: `@originjs/vite-plugin-federation` handles module federation

### Asset Generation
- **remoteEntry.js**: Generated in `/assets/` folder by Vite
- **Path Reference**: Must use `/assets/remoteEntry.js` path
- **Optimization**: Vite applies tree-shaking and modern bundling

### Development vs Production
- **Development**: Remote requires build step, host supports hot reload
- **Production**: Optimized builds with better performance
- **Hot Reload**: Host gets full hot reload, remote needs rebuild for changes

## Development Guidelines

### Host Development (React 17)
```typescript
// Use React 17 patterns with Vite
import { render } from 'react-dom';

function HostComponent() {
  // React 17 specific patterns available
  // Vite provides fast refresh and modern tooling
  return <div>Host with React 17 + Vite</div>;
}

// Main entry with React 17 API
render(<HostComponent />, document.getElementById('root'));
```

### Remote Development (React 19)
```typescript
// Use React 19 features with Vite optimization
import { createRoot } from 'react-dom/client';
import { useOptimistic } from 'react'; // React 19 specific

function RemoteComponent() {
  // React 19 specific optimizations available
  // Vite optimizes for React 19 concurrent features
  return <div>Remote with React 19 + Vite</div>;
}

// Main entry with React 19 API
createRoot(document.getElementById('root')!).render(<RemoteComponent />);
```

## Testing Considerations

### Unit Testing Steps:
1. **Test Each App Separately**: Each application tests with its own React version
2. **Vite Test Integration**: Use Vitest for modern testing with Vite
3. **Mock Federation**: Mock remote imports for isolated testing
4. **Version-Specific Testing**: Test with appropriate React testing utilities

### Integration Testing Steps:
1. **Build Both Apps**: Ensure both apps build successfully
2. **Test Mount Lifecycle**: Verify remote mounts correctly in host container
3. **Test Unmount Lifecycle**: Ensure proper cleanup when remote unmounts
4. **Test Asset Loading**: Verify `/assets/remoteEntry.js` loads correctly
5. **Test Error Scenarios**: Ensure graceful handling when remote fails to load
6. **Test Context Isolation**: Ensure no React context bleeding between versions

## Deployment Strategy

### Development Process Steps:
1. **Install Dependencies**: Run `yarn install` in both applications
2. **Build Remote**: `cd remote && yarn build`
3. **Start Remote Preview**: `cd remote && yarn preview` (port 3001)
4. **Start Host Dev**: `cd host && yarn dev` (port 3000)
5. **Verify Assets**: Check that `remoteEntry.js` exists in remote's `dist/assets/`

### Production Deployment Steps:
1. **Deploy Remote**: Deploy remote `dist` folder to CDN/server
2. **Update Remote URL**: Configure host to point to production remote URL
3. **Deploy Host**: Deploy host `dist` folder to hosting environment
4. **Verify Integration**: Test cross-deployment communication
5. **Monitor Performance**: Track loading performance and bundle sizes

### Runtime Loading Steps:
1. **Host Loads First**: Host application starts and renders initial UI
2. **Dynamic Remote Import**: Host dynamically imports from `/assets/remoteEntry.js`
3. **Mount Remote**: Remote mounts into host-provided DOM container
4. **Handle Failures**: Graceful fallback if remote fails to load
5. **Cleanup**: Proper unmounting when host component unmounts

## Troubleshooting

### Common Vite-Specific Issues
1. **Asset Path Errors**: Ensure remote URL includes `/assets/` prefix
2. **Build Failures**: Check TypeScript compilation and lint errors
3. **Module Resolution**: Verify federation plugin configuration
4. **CORS Issues**: Configure proper headers for cross-origin requests
5. **Version Conflicts**: Ensure complete isolation with `shared: {}`

### Performance Optimization
- **Bundle Analysis**: Use Vite bundle analyzer to monitor sizes
- **Loading Performance**: Implement loading states for remote modules
- **Memory Monitoring**: Track memory usage of dual React instances
- **Caching Strategy**: Configure appropriate cache headers for assets

## Best Practices

1. **Isolation**: Always use `shared: {}` for different React versions
2. **Build Order**: Always build remote before host
3. **Asset Paths**: Use correct `/assets/` prefix for Vite-generated assets
4. **TypeScript**: Maintain separate type declarations for each React version
5. **Error Handling**: Add comprehensive try-catch blocks for remote loading
6. **Cleanup**: Ensure proper root disposal in unmount
7. **Testing**: Test both development preview and production builds
8. **Monitoring**: Track performance metrics for both applications

## Security Considerations

- Remote applications load from trusted sources only
- No shared state between React versions
- Each application maintains its own security context
- Validate remote module integrity before mounting
- Use HTTPS for production remote URLs

## Performance Comparison

### Vite vs Webpack Federation
- **Build Speed**: Vite generally faster for production builds
- **Dev Experience**: Webpack has better dev-mode federation support
- **Bundle Size**: Vite produces more optimized bundles
- **Runtime Performance**: Similar performance for deployed applications