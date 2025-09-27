# Micro-Frontend Generic Learnings - React 18 Host + React 19 Remote

## Complete React Isolation Pattern

This setup demonstrates running **React 18 host** with **React 19 remote** using complete React isolation through Module Federation.

### Key Architecture Decisions

1. **Complete Isolation**: Both applications bundle their own React versions
2. **DOM-based Integration**: Host manages DOM container, remote handles its own rendering
3. **Mount/Unmount Pattern**: Remote exposes lifecycle methods for clean integration

### Webpack Configuration Pattern

**Host (React 18)**:
```javascript
new ModuleFederationPlugin({
  name: 'host',
  remotes: {
    remote: 'remote@http://localhost:3001/remoteEntry.js',
  },
  shared: {}, // Complete isolation
})
```

**Remote (React 19)**:
```javascript
new ModuleFederationPlugin({
  name: 'remote',
  filename: 'remoteEntry.js',
  exposes: {
    './App': './src/RemoteWrapper',
  },
  shared: {}, // Complete isolation
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
          remoteModule.default.unmount(remoteRef.current!);
        }
      });
    }
  };
}, []);
```

**Remote Wrapper**:
```typescript
// Remote exposes mount/unmount functions using React 19 APIs
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

### Bootstrap Configuration

**Host Bootstrap** (React 18):
```typescript
import { createRoot } from 'react-dom/client';
import App from './App';

const container = document.getElementById('root');
if (container) {
  const root = createRoot(container);
  root.render(<App />);
}
```

**Remote Bootstrap** (React 19):
```typescript
import { createRoot } from 'react-dom/client';
import App from './App';

const remoteRoot = document.getElementById('remote-root');
if (remoteRoot) {
  const root = createRoot(remoteRoot);
  root.render(<App />);
}
```

### Bundle Size Implications

- **Larger Bundle**: Each app includes its own React version
- **No Version Conflicts**: Complete runtime isolation prevents compatibility issues
- **Predictable Behavior**: Each app operates in its own React context

### Performance Considerations

- **Initial Load**: Larger initial bundle due to duplicate React libraries
- **Runtime Stability**: No shared dependency conflicts
- **Memory Usage**: Each React version maintains separate virtual DOM trees

### Development Workflow

1. Start remote application: `npm start` (port 3001)
2. Start host application: `npm start` (port 3000)
3. Host automatically loads remote at runtime
4. Both applications can be developed independently

### Error Prevention

- ✅ No shared dependency version conflicts
- ✅ No React context mixing issues
- ✅ No runtime compatibility problems
- ✅ Independent deployment capabilities

### When to Use This Pattern

- Different React versions required across teams
- Need for complete runtime isolation
- Bundle size is not a primary concern
- Maximum stability and predictability required