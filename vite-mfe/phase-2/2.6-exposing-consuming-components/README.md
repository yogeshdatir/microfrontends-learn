# 2.6 Exposing & Consuming Components - Vite Implementation

This demo implements the concepts from [2.6-exposing-consuming-components.md](../../../docs/phase-2/2.6-exposing-consuming-components.md) using Vite instead of Webpack.

## Key Differences: Webpack vs Vite Module Federation

### 1. Plugin Installation

**Webpack:**

```bash
yarn add @module-federation/webpack
```

**Vite:**

```bash
yarn add -D @originjs/vite-plugin-federation
```

### 2. Plugin Import

**Webpack:**

```js
const ModuleFederationPlugin = require('@module-federation/webpack');
```

**Vite:**

```js
import federation from '@originjs/vite-plugin-federation';
```

### 3. Configuration Syntax

**Webpack (webpack.config.js):**

```js
plugins: [
  new ModuleFederationPlugin({
    name: 'remoteApp',
    filename: 'remoteEntry.js',
    exposes: {
      './App': './src/App.tsx',
    },
    shared: {
      react: {
        singleton: true,
        requiredVersion: '^18.0.0',
      },
      'react-dom': {
        singleton: true,
        requiredVersion: '^18.0.0',
      },
    },
  }),
];
```

**Vite (vite.config.ts):**

```js
plugins: [
  react(),
  federation({
    name: 'remoteApp',
    filename: 'remoteEntry.js',
    exposes: {
      './App': './src/App.tsx',
    },
    shared: ['react', 'react-dom'], // ← Simpler array syntax
  }),
];
```

### 4. Remote URL Format

**Webpack:**

```js
remotes: {
  myRemote: 'remoteApp@http://localhost:3001/remoteEntry.js',
  //         ↑ name@url format
}
```

**Vite:**

```js
remotes: {
  remote: 'http://localhost:3001/assets/remoteEntry.js',
  //      ↑ Just URL, note /assets/ path
}
```

### 5. Import Statement (Same for Both!)

```tsx
import { Suspense, lazy } from 'react'

const RemoteApp = lazy(() => import('remote/App'))
//                                    ↑ alias from remotes config

<Suspense fallback={<div>Loading...</div>}>
  <RemoteApp />
</Suspense>
```

## Quick Comparison Table

| Feature           | Webpack                      | Vite                               |
| ----------------- | ---------------------------- | ---------------------------------- |
| **Plugin**        | `@module-federation/webpack` | `@originjs/vite-plugin-federation` |
| **Shared Config** | Object with options          | Simple array                       |
| **Remote URL**    | `name@url` format            | Just `url` (with `/assets/`)       |
| **Entry Path**    | `/remoteEntry.js`            | `/assets/remoteEntry.js`           |
| **Import Syntax** | ✅ Same                      | ✅ Same                            |
| **Lazy/Suspense** | ✅ Same                      | ✅ Same                            |

## Running This Demo

```bash
# Terminal 1: Start remote app
cd remote && yarn dev

# Terminal 2: Start host app
cd host && yarn dev

# Visit: http://localhost:3000
```

## What You'll See

- **Green border**: Host Application (port 3000)
- **Blue border**: Remote App Component (port 3001)
- **Purple border**: Remote Button Component demo (port 3001)

## Additional Notes

### Production Build Config (Optional)

For production builds, you may need to add this to `vite.config.ts`:

```js
build: {
  modulePreload: false,
  target: 'esnext',
  minify: false,
  cssCodeSplit: false,
}
```

This is **not required** for development mode.

### TypeScript Support

Type declarations work the same way in both:

```ts
// host/src/types/remotes.d.ts
declare module 'remote/App' {
  const App: React.ComponentType;
  export default App;
}
```

## Core Concepts (Same Across Tools)

1. **Remote** exposes components via `exposes` config
2. **Host** consumes them via `remotes` config
3. **Import** uses lazy loading with Suspense
4. **Shared dependencies** prevent duplicates (syntax differs)

---

**📚 Related Documentation:**

- [Webpack Version - 2.6 Exposing & Consuming Components](../../../docs/phase-2/2.6-exposing-consuming-components.md)
- [Vite Plugin Federation Docs](https://github.com/originjs/vite-plugin-federation)
