# Webpack Module Federation Setup Guide

---

## 📺 Video Tutorials

- [Module Federation Tutorial](https://youtu.be/lKKsjpH09dU?si=GvIf8SVDOKLOmezZ)
- [Micro Frontends with Module Federation](https://youtu.be/s_Fs4AXsTnA?si=qVY16xwoEvjWvdEs)
- [Module Federation in React](https://youtu.be/qkaTFb7mOb4?si=3DTSErJS7SIO3fbp)

---

## ✅ What's Been Completed

This document covers the Webpack 5 Module Federation implementation for host and remote applications.

---

## 🏗️ Project Structure

```
webpack-mfe/
├── host/
│   ├── src/
│   │   ├── App.tsx          # Host app with remote consumption
│   │   ├── index.ts         # Entry point
│   │   └── bootstrap.tsx    # Bootstrap file
│   ├── webpack.config.js    # Host webpack config
│   ├── package.json
│   └── public/
│       └── index.html
└── remote/
    ├── src/
    │   ├── App.tsx          # Remote app component
    │   ├── index.ts         # Entry point
    │   └── bootstrap.tsx    # Bootstrap file
    ├── webpack.config.js    # Remote webpack config
    ├── package.json
    └── public/
        └── index.html
```

---

## 1️⃣ Add a Bootstrap File for Safe App Startup

In Module Federation setups, especially with React, use a separate `bootstrap.tsx` file as the true app entry point. This ensures shared dependencies (like React) are loaded correctly and avoids issues with module federation timing.

**How to set it up:**

`src/index.ts`:

```ts
import('./bootstrap');
```

`src/bootstrap.tsx`:

```tsx
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

const root = createRoot(document.getElementById('root')!);
root.render(<App />);
```

---

## 2️⃣ Host Configuration

### Webpack Config (`host/webpack.config.js`)

```javascript
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { ModuleFederationPlugin } = require('webpack').container;
const path = require('path');

module.exports = {
  // rest of the config
  output: {
    // rest of the config
    publicPath: 'auto', // Allows serving from any path
  },
  devServer: {
    port: 3000,
    // rest of the config
  },
  plugins: [
    new ModuleFederationPlugin({
      name: 'host',
      remotes: {
        remote: 'remote@http://localhost:3001/remoteEntry.js',
        stylingIsolation:
          'stylingIsolation@http://localhost:3002/remoteEntry.js',
      },
      shared: {
        react: { singleton: true },
        'react-dom': { singleton: true },
      },
    }),
    // other plugins
  ],
};
```

#### Key Host Features

| Feature                 | Purpose                            | Configuration                                     |
| ----------------------- | ---------------------------------- | ------------------------------------------------- |
| **Module Federation**   | Consumes remote modules            | `remotes: { remote: ..., stylingIsolation: ... }` |
| **Shared Dependencies** | Prevents duplicate React instances | `shared: { react: { singleton: true } }`          |
| **Auto Public Path**    | Flexible deployment                | `publicPath: 'auto'`                              |
| **Development Server**  | Local development                  | `port: 3000`                                      |

---

## 🆕 Multiple Remotes Example

To consume multiple remotes, add more entries to the `remotes` object in the ModuleFederationPlugin config (as above). You can then import modules from each remote using their configured names:

```tsx
const RemoteApp = React.lazy(() => import('remote/App'));
const StylingIsolationRemoteApp = React.lazy(
  () => import('stylingIsolation/App')
);
```

---

## 3️⃣ Remote Configuration

### Webpack Config (`remote/webpack.config.js` or `styling-isolation-demo/webpack.config.js`)

```javascript
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { ModuleFederationPlugin } = require('webpack').container;
const path = require('path');

module.exports = {
  // rest of the config
  output: {
    // rest of the config
    publicPath: 'auto',
  },
  devServer: {
    port: 3001,
    // rest of the config
  },
  plugins: [
    new ModuleFederationPlugin({
      name: 'remote', // or 'stylingIsolation' for the styling demo
      filename: 'remoteEntry.js',
      exposes: {
        './App': './src/App',
      },
      shared: {
        react: { singleton: true },
        'react-dom': { singleton: true },
      },
    }),
    // other plugins
  ],
};
```

#### Key Remote Features

| Feature                 | Purpose                            | Configuration                                                    |
| ----------------------- | ---------------------------------- | ---------------------------------------------------------------- |
| **Module Federation**   | Exposes modules to host            | `exposes: { './App': './src/App' }`                              |
| **Remote Entry**        | Entry point for federation         | `filename: 'remoteEntry.js'`                                     |
| **Shared Dependencies** | Prevents duplicate React instances | `shared: { react: { singleton: true, requiredVersion: false } }` |
| **Development Server**  | Local development                  | `port: 3001` or `3002`                                           |

---

## 4️⃣ Application Code

### Host App (`host/src/App.tsx`)

```tsx
import { Suspense, lazy } from 'react';

const RemoteApp = lazy(() => import('remote/App'));
const StylingIsolationRemoteApp = lazy(() => import('stylingIsolation/App'));

function App() {
  return (
    <div>
      <h1>🚀 Host App</h1>
      <p>This is a standalone React TypeScript app!</p>
      <p>Later, this will consume the remote app.</p>
      <Suspense fallback={<div>Loading remote app...</div>}>
        <RemoteApp />
      </Suspense>
      <Suspense fallback={<div>Loading styling isolation app...</div>}>
        <StylingIsolationRemoteApp />
      </Suspense>
    </div>
  );
}

export default App;
```

### Remote App (`remote/src/App.tsx`)

```typescript
const App = () => {
  return (
    <div>
      <h1>🚀 Remote App</h1>
      <p>This is a standalone React TypeScript app!</p>
      <p>Later, this will be consumed by the host app.</p>
    </div>
  );
};

export default App;
```

## 🆕 TypeScript: Module Declarations for Remotes

If you import a federated module (like 'stylingIsolation/App') in your host, add a module declaration in `src/remote.d.ts`:

---

## 5️⃣ Key Concepts Implemented

### 1. **Module Federation Plugin**

- **Host**: Consumes remote modules via `remotes` configuration
- **Remote**: Exposes modules via `exposes` configuration

### 2. **Shared Dependencies**

- Both host and remote share React and React-DOM
- `singleton: true` prevents duplicate instances

### 3. **Lazy Loading**

- Host uses `React.lazy()` to dynamically import remote components
- `Suspense` provides loading fallback

### 4. **Development Setup**

- Host runs on port 3000
- Remote runs on port 3001
- Styling isolation demo runs on port 3002
- All can run independently

---

## 6️⃣ How It Works

1. **Remote** exposes its `App` component via Module Federation
2. **Host** declares the remote in its webpack config
3. **Host** uses `React.lazy()` to import the remote component
4. **Webpack** handles the dynamic loading and dependency sharing

---

## 7️⃣ Running the Setup

```bash
# Terminal 1 - Start Styling Isolation Remote
cd webpack-mfe/styling-isolation-demo
yarn start

# Terminal 2 - Start Remote
cd webpack-mfe/remote
yarn start

# Terminal 3 - Start Host
cd webpack-mfe/host
yarn start
```

---
