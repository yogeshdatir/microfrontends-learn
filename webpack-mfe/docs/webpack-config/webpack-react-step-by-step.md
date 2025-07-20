# Step-by-Step Guide: React + Webpack Setup

This guide walks you through creating a standard React app using Webpack and TypeScript—no Module Federation, no micro-frontends. Use this as a foundation for any React project before adding advanced features.

---

## 1️⃣ Prerequisites

- Node.js (v18+ recommended)
- Yarn (preferred) or npm
- Basic React and TypeScript knowledge

---

## 2️⃣ Create Your App Directory

```bash
mkdir my-react-app && cd my-react-app
yarn init -y
```

---

## 3️⃣ Install Dependencies

```bash
yarn add react react-dom
yarn add -D typescript @types/react @types/react-dom
# Webpack and related tools
yarn add -D webpack webpack-cli webpack-dev-server ts-loader html-webpack-plugin
# For CSS support
yarn add -D style-loader css-loader
```

---

## 4️⃣ Set Up TypeScript

Create a `tsconfig.json`:

```json
{
  "compilerOptions": {
    "target": "ES6",
    "module": "ESNext",
    "jsx": "react-jsx",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "moduleResolution": "node",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": false
  },
  "include": ["src"]
}
```

---

## 5️⃣ Create Project Structure

```bash
mkdir src public
touch src/index.tsx src/App.tsx
# For CSS: touch src/index.css
# For config: touch webpack.config.js tsconfig.json
# For HTML: touch public/index.html
```

---

## 6️⃣ Add Basic React Code

**src/App.tsx**

```tsx
const App = () => (
  <div>
    <h1>Hello, React + Webpack!</h1>
    <p>This is a basic React app bundled with Webpack.</p>
  </div>
);
export default App;
```

**src/index.tsx**

```tsx
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';

const root = createRoot(document.getElementById('root')!);
root.render(<App />);
```

**src/index.css** (optional)

```css
body {
  font-family: sans-serif;
  margin: 0;
  padding: 0;
  background: #f9f9f9;
}
```

**public/index.html**

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>React + Webpack App</title>
  </head>
  <body>
    <div id="root"></div>
  </body>
</html>
```

---

## 7️⃣ Configure Webpack

**webpack.config.js**

```js
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: './src/index.tsx',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
    clean: true,
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './public/index.html',
    }),
  ],
  devServer: {
    static: './dist',
    port: 3000,
    open: true,
    hot: true,
  },
  mode: 'development',
};
```

---

## 8️⃣ Add Scripts to package.json

```json
"scripts": {
  "start": "webpack serve --mode development --open",
  "build": "webpack --mode production"
}
```

---

## 9️⃣ Run and Test

```bash
yarn start   # Start dev server at http://localhost:3000
yarn build   # Build for production (output in /dist)
```

---

## 🔟 Troubleshooting

- **Blank page?** Check the browser console for errors and ensure your `index.html` has a `<div id="root"></div>`.
- **TypeScript errors?** Make sure your `tsconfig.json` includes the `src` folder and your file extensions are correct.
- **CSS not loading?** Ensure you have both `style-loader` and `css-loader` in your webpack config and installed.
- **Hot reload not working?** Check your `devServer` config for `hot: true` and use the latest webpack-dev-server.

---

## 📚 References

- [Webpack Docs](https://webpack.js.org/)
- [React Docs](https://react.dev/)
- [TypeScript Docs](https://www.typescriptlang.org/)
- See `webpack-mfe/host` or `webpack-mfe/remote` for basic React/Webpack setup (ignore MFE-specific code).

---

**Hint:** This setup is a solid foundation for any React project. Add more loaders/plugins as your app grows (e.g., for images, fonts, SASS, etc.).
