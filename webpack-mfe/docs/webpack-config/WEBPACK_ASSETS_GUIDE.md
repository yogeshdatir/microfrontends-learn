# Webpack Asset Handling Guide

## 🎯 Asset Types Overview

| Type             | In Bundle? | Separate Files? | Best For                 | Example                     |
| ---------------- | ---------- | --------------- | ------------------------ | --------------------------- |
| `asset/resource` | ❌ No      | ✅ Yes          | Large images, fonts      | `logo.123abc.png`           |
| `asset/inline`   | ✅ Yes     | ❌ No           | Small icons, tiny images | `data:image/png;base64,...` |
| `asset`          | 🤔 Depends | 🤔 Depends      | Mixed sizes              | Auto-optimized              |
| `asset/source`   | ✅ Yes     | ❌ No           | Text files, configs      | File content as string      |

## 📁 File Type Recommendations

### **Images (PNG, JPG, GIF, SVG)**

```javascript
// webpack.config.js
module.exports = {
  // ... other config
  module: {
    rules: [
      // ... other rules
      {
        test: /\.(png|jpe?g|gif|svg)$/i,
        type: 'asset',
        parser: {
          dataUrlCondition: {
            maxSize: 8 * 1024, // 8kb threshold
          },
        },
      },
    ],
  },
};
```

- **Small images** (< 8kb): Inlined as Base64
- **Large images** (≥ 8kb): Separate files
- **Benefits:** Automatic optimization, better caching

### **Fonts (WOFF, WOFF2, TTF, EOT)**

```javascript
// webpack.config.js
module.exports = {
  // ... other config
  module: {
    rules: [
      // ... other rules
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/i,
        type: 'asset/resource',
      },
    ],
  },
};
```

- **Always separate files** (fonts are usually large)
- **Better caching** for font files
- **CDN-friendly** for font optimization

### **Text Files (TXT, JSON)**

```javascript
// webpack.config.js
module.exports = {
  // ... other config
  module: {
    rules: [
      // ... other rules
      {
        test: /\.txt$/i,
        type: 'asset/source', // Returns file content as string
      },
    ],
  },
};
```

- **Use `asset/source`** to get file content as string
- **Use `asset/inline`** for data URIs
- **Use `asset/resource`** to copy as separate file

## ⚙️ Clean Webpack Config

**Keep your webpack.config.js clean:**

```javascript
module: {
  rules: [
    // TypeScript
    {
      test: /\.tsx?$/,
      use: "ts-loader",
      exclude: /node_modules/,
    },
    // Images - auto-optimized
    {
      test: /\.(png|jpe?g|gif|svg)$/i,
      type: 'asset',
      parser: {
        dataUrlCondition: {
          maxSize: 8 * 1024,
        },
      },
    },
    // Fonts - separate files
    {
      test: /\.(woff|woff2|eot|ttf|otf)$/i,
      type: 'asset/resource',
    },
  ],
}
```

## 🎯 Usage Examples

### **Importing Images**

```javascript
// Small image - becomes Base64 in bundle
import smallIcon from './icon.png';

// Large image - becomes separate file
import largeImage from './hero.jpg';
```

### **Importing Fonts**

```javascript
// Font file - becomes separate file
import './fonts/Roboto.woff2';
```

### **Importing Text Files**

```javascript
// Text content - becomes string in bundle
import config from './config.txt';
```

## 📊 Performance Considerations

- **Small files** (< 8kb): Inline for faster loading
- **Large files** (≥ 8kb): Separate for better caching
- **Fonts**: Always separate (better for CDN and caching)
- **Images**: Auto-optimize based on size

## 🔧 Customization

**Change the size threshold:**

```javascript
parser: {
  dataUrlCondition: {
    maxSize: 4 * 1024, // 4kb instead of 8kb
  },
}
```

**Force all images to be separate:**

```javascript
type: 'asset/resource', // No inline, always separate
```

**Force all images to be inline:**

```javascript
type: 'asset/inline', // Always inline as Base64
```
