# Vite Micro-Frontend Generic Learnings - React 17 Host + React 19 Remote

## Complete React Isolation Pattern with Vite

This setup demonstrates running **React 17 host** with **React 19 remote** using complete React isolation through Vite Module Federation.

### Key Architecture Decisions

1. **Complete Isolation**: Both applications bundle their own React versions
2. **DOM-based Integration**: Host manages DOM container, remote handles its own rendering
3. **Mount/Unmount Pattern**: Remote exposes lifecycle methods for clean integration
4. **Build-First Workflow**: Vite federation requires building before serving

### Vite Configuration Pattern

**Host (React 17)**:
```typescript
import federation from '@originjs/vite-plugin-federation'

export default defineConfig({
  plugins: [
    react(),
    federation({
      name: 'host',
      remotes: {
        remote: 'http://localhost:3001/assets/remoteEntry.js',
      },
      shared: {} // Complete isolation
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

**Remote (React 19)**:
```typescript
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
      shared: {} // Complete isolation
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

### Integration Pattern

**Host Integration**:
```typescript
// Host uses DOM-based integration with useRef
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
          remoteModule.default.unmount();
        }
      });
    }
  };
}, []);
```

**Remote Wrapper**:
```typescript
// Remote exposes mount/unmount functions using React 19 APIs
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

### Bootstrap Configuration

**Host Bootstrap** (React 17):
```typescript
import { StrictMode } from 'react'
import { render } from 'react-dom'
import './index.css'
import App from './App.tsx'

render(
  <StrictMode>
    <App />
  </StrictMode>,
  document.getElementById('root')
)
```

**Remote Bootstrap** (React 19):
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

### Package Configuration

**Host Package.json**:
```json
{
  "scripts": {
    "dev": "vite --port 3000",
    "build": "tsc -b && vite build",
    "build:preview": "yarn build && yarn preview",
    "preview": "vite preview --port 3000"
  },
  "dependencies": {
    "react": "^17",
    "react-dom": "^17"
  },
  "devDependencies": {
    "@originjs/vite-plugin-federation": "^1.3.6"
  }
}
```

**Remote Package.json**:
```json
{
  "scripts": {
    "dev": "vite --port 3001",
    "build": "tsc -b && vite build",
    "build:preview": "yarn build && yarn preview",
    "preview": "vite preview --port 3001"
  },
  "dependencies": {
    "react": "^19",
    "react-dom": "^19"
  },
  "devDependencies": {
    "@originjs/vite-plugin-federation": "^1.3.6"
  }
}
```

### Vite-Specific Considerations

**Remote Entry Path**:
- Vite generates remoteEntry.js in `/assets/` folder
- Must reference `http://localhost:3001/assets/remoteEntry.js`
- Different from Webpack which serves at root level

**Build Requirements**:
- **Remote apps must be built** before federation works
- **Host can run in dev mode** with hot reload
- Use `remote: yarn build && yarn preview` + `host: yarn dev` workflow
- Only remote federation requires build step

### Bundle Size Implications

- **Larger Bundle**: Each app includes its own React version
- **No Version Conflicts**: Complete runtime isolation prevents compatibility issues
- **Predictable Behavior**: Each app operates in its own React context
- **Vite Optimization**: Tree-shaking and modern bundling optimizations

### Performance Considerations

- **Hybrid Development**: Remote requires build step, host gets hot reload
- **Production Optimized**: Better optimized production builds with Vite
- **Runtime Stability**: No shared dependency conflicts
- **Memory Usage**: Each React version maintains separate virtual DOM trees

### Development Workflow

#### Setup Steps:
1. **Configure Vite**: Set up `@originjs/vite-plugin-federation` in both applications
2. **Install Dependencies**: Ensure both apps have their respective React versions
3. **Create Remote Wrapper**: Implement mount/unmount functions in remote app
4. **Implement Host Integration**: Add DOM-based loading logic in host app
5. **Add Build Scripts**: Add `build:preview` scripts for easier development

#### Running Steps:
6. **Build Remote First**: `cd remote && yarn build`
7. **Start Remote Preview**: `cd remote && yarn preview` (port 3001)
8. **Start Host Dev**: `cd host && yarn dev` (port 3000)
9. **Verify Integration**: Host should automatically load remote at runtime

#### Development Iteration:
10. **Host Changes**: Make changes to host app - hot reload works immediately
11. **Remote Changes**: Make changes to remote app
12. **Rebuild Remote**: `yarn build` in remote directory
13. **Refresh Browser**: Remote changes should be visible

#### Testing Steps:
15. **Test Loading**: Verify remote loads correctly in host
16. **Test Error Handling**: Ensure graceful failure if remote is unavailable
17. **Test Cleanup**: Verify proper unmounting when host component unmounts

### Vite vs Webpack Differences

**Development Experience**:
- **Vite**: Requires build step for federation, slower iteration
- **Webpack**: Hot reloading works with federation out of the box

**Production Builds**:
- **Vite**: Faster builds, better optimizations
- **Webpack**: More mature federation ecosystem

**Bundle Output**:
- **Vite**: Modern ES modules, assets in `/assets/` folder
- **Webpack**: Various output formats, flexible asset paths

### Error Prevention

- ✅ No shared dependency version conflicts
- ✅ No React context mixing issues
- ✅ No runtime compatibility problems
- ✅ Independent deployment capabilities
- ✅ TypeScript support with proper type isolation

### TypeScript Configuration

**Remote Type Declarations**:
```typescript
declare module 'remote/App' {
  const App: {
    mount: (element: HTMLElement) => void;
    unmount: () => void;
  };
  export default App;
}
```

### When to Use This Pattern

- Different React versions required across teams
- Need for complete runtime isolation
- Modern build tooling preferred (Vite benefits)
- Bundle size is not a primary concern
- Maximum stability and predictability required
- Teams comfortable with build-first development workflow

### Troubleshooting Common Vite Issues

1. **remoteEntry.js 404**: Check path includes `/assets/` prefix
2. **Build Failures**: Ensure TypeScript compilation passes
3. **Module Resolution**: Verify federation plugin configuration
4. **CORS Issues**: Ensure proper server configuration for cross-origin requests