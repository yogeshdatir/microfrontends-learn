# Webpack Module Federation Setup Guide

## ✅ What's Been Completed

This document covers the Webpack 5 Module Federation implementation for host and remote applications.

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
│   └── index.html
└── remote/
    ├── src/
    │   ├── App.tsx          # Remote app component
    │   ├── index.ts         # Entry point
    │   └── bootstrap.tsx    # Bootstrap file
    ├── webpack.config.js    # Remote webpack config
    ├── package.json
    └── index.html
```

## 🔧 Host Configuration

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

### Key Host Features:

| Feature                 | Purpose                            | Configuration                                                        |
| ----------------------- | ---------------------------------- | -------------------------------------------------------------------- |
| **Module Federation**   | Consumes remote modules            | `remotes: { remote: 'remote@http://localhost:3001/remoteEntry.js' }` |
| **Shared Dependencies** | Prevents duplicate React instances | `shared: { react: { singleton: true } }`                             |
| **Auto Public Path**    | Flexible deployment                | `publicPath: 'auto'`                                                 |
| **Development Server**  | Local development                  | `port: 3000`                                                         |

## 🔧 Remote Configuration

### Webpack Config (`remote/webpack.config.js`)

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
      name: 'remote',
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

### Key Remote Features:

| Feature                 | Purpose                            | Configuration                            |
| ----------------------- | ---------------------------------- | ---------------------------------------- |
| **Module Federation**   | Exposes modules to host            | `exposes: { './App': './src/App' }`      |
| **Remote Entry**        | Entry point for federation         | `filename: 'remoteEntry.js'`             |
| **Shared Dependencies** | Prevents duplicate React instances | `shared: { react: { singleton: true } }` |
| **Development Server**  | Local development                  | `port: 3001`                             |

## 🚀 Application Code

### Host App (`host/src/App.tsx`)

```typescript
import { Suspense, lazy } from 'react';

const RemoteApp = lazy(() => import('remote/App'));

const App = () => {
  return (
    <div>
      <h1>🚀 Host App</h1>
      <p>This is a standalone React TypeScript app!</p>
      <p>Later, this will consume the remote app.</p>
      <Suspense fallback={<div>Loading remote app...</div>}>
        <RemoteApp />
      </Suspense>
    </div>
  );
};

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

## 🔑 Key Concepts Implemented

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
- Both can run independently

## 🎯 How It Works

1. **Remote** exposes its `App` component via Module Federation
2. **Host** declares the remote in its webpack config
3. **Host** uses `React.lazy()` to import the remote component
4. **Webpack** handles the dynamic loading and dependency sharing

## 🚀 Running the Setup

```bash
# Terminal 1 - Start Remote
cd webpack-mfe/remote
yarn start

# Terminal 2 - Start Host
cd webpack-mfe/host
yarn start
```
