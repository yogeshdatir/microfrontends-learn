# Step-by-Step Guide: Micro-Frontend with Vite + React

This guide walks you through creating a Micro-Frontend (MFE) architecture using Vite and React, leveraging [`vite-plugin-federation`](https://github.com/originjs/vite-plugin-federation).

---

## 1️⃣ Prerequisites

- Node.js (v18+ recommended)
- Yarn or npm
- Basic React and Vite knowledge

---

## 2️⃣ Create Host and Remote Apps

```bash
# Host app
npm create vite@latest host -- --template react-ts
cd host
npm install

# Host app (Yarn)
yarn create vite host --template react-ts
cd host
yarn install

# Remote app
cd ..
npm create vite@latest remote -- --template react-ts
cd remote
npm install

# Remote app (Yarn)
cd ..
yarn create vite remote --template react-ts
cd remote
yarn install
```

---

## 3️⃣ Install @originjs/vite-plugin-federation

Run in both `host` and `remote` folders:

```bash
npm install @originjs/vite-plugin-federation --save-dev
# Or with Yarn
yarn add -D @originjs/vite-plugin-federation
```

---

## 4️⃣ Configure Federation in Vite

### Host (`host/vite.config.ts`)

```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import federation from '@originjs/vite-plugin-federation';

export default defineConfig({
  plugins: [
    react(),
    federation({
      name: 'host',
      remotes: {
        remote: 'http://localhost:5001/assets/remoteEntry.js',
      },
      shared: ['react', 'react-dom'],
    }),
  ],
});
```

### Remote (`remote/vite.config.ts`)

```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import federation from '@originjs/vite-plugin-federation';

export default defineConfig({
  plugins: [
    react(),
    federation({
      name: 'remote',
      filename: 'remoteEntry.js',
      exposes: {
        './RemoteApp': './src/RemoteApp.tsx',
      },
      shared: ['react', 'react-dom'],
    }),
  ],
  preview: { port: 5001, strictPort: true },
});
```

---

## 5️⃣ Create Remote Component

Create `remote/src/RemoteApp.tsx`:

```typescript
const RemoteApp = () => (
  <div>
    <h2>Remote App (Vite + React)</h2>
    <p>This component is exposed via federation.</p>
  </div>
);

export default RemoteApp;
```

---

## 6️⃣ Use Remote in Host

Update `host/src/App.tsx`:

```typescript
import { Suspense, lazy } from 'react';

const RemoteApp = lazy(() => import('remote/RemoteApp'));

function App() {
  return (
    <div>
      <h1>Host App (Vite + React)</h1>
      <Suspense fallback={<div>Loading remote...</div>}>
        <RemoteApp />
      </Suspense>
    </div>
  );
}

export default App;
```

## 6.1️⃣ Fix TypeScript Error for Federated Import

If you see an error like "Cannot find module 'remote/RemoteApp' or its corresponding type declarations," add the following file in your host app:

Create `vite-mfe/host/src/remote.d.ts` with:

```ts
declare module 'remote/RemoteApp' {
  const RemoteApp: React.ComponentType<any>;
  export default RemoteApp;
}
```

This tells TypeScript in the host project how to handle the federated module import.

---

## 7️⃣ Run Both Apps

Open two terminals:

```bash
# Terminal 1 (remote)
cd remote
yarn build && yarn preview

# Terminal 2 (host)
cd host
yarn dev
```

---

## 8️⃣ Test Integration

- Visit [http://localhost:5173](http://localhost:5173)
- You should see the Host app rendering the Remote component.

---

## 📚 References

- [Vite + React Module Federation Tutorial](https://youtu.be/t-nchkL9yIg?si=GjUQItIjF3zuM9cz)
- [React Micro-Frontends using Vite (Dev.to)](https://dev.to/abhi0498/react-micro-frontends-using-vite-30ah)
- [How to fix missing remoteEntry.js issue in Vite-based micro-frontends (Medium)](https://medium.com/@abhimanranaweera/how-to-fix-missing-remoteentry-js-issue-in-vite-based-micro-frontends-05dd93ed8750)
