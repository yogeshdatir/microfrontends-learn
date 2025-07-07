# 🚀 Micro-Frontend Learning Project

A hands-on learning environment for **Micro-Frontend (MFE) architecture** using **React TypeScript** and **Webpack Module Federation**.

## 📋 Table of Contents

- [🎯 Learning Objectives](#-learning-objectives)
- [🏗️ Project Structure](#️-project-structure)
- [⚙️ Prerequisites](#️-prerequisites)
- [🚀 Quick Start](#-quick-start)
- [🔧 Development](#-development)
- [📚 Learning Path](#-learning-path)
- [🛠️ Technologies Used](#️-technologies-used)
- [📖 Documentation](#-documentation)

## 🎯 Learning Objectives

This project follows a **progressive learning approach** to master micro-frontend architecture:

1. **Phase 1: Fundamentals** - Understanding MFE concepts and Module Federation
2. **Phase 2: Integration** - Component sharing and communication patterns
3. **Phase 3: Advanced** - Routing, state management, and deployment strategies

## 🏗️ Project Structure

```
microfrontends-learn/
├── webpack-mfe/
│   ├── host/                    # 🏠 Main shell application
│   │   ├── src/
│   │   │   ├── App.tsx         # Host application component
│   │   │   ├── bootstrap.tsx   # Module Federation bootstrap
│   │   │   └── index.ts        # Entry point
│   │   ├── webpack.config.js   # Host webpack configuration
│   │   └── package.json
│   │
│   ├── remote/                  # 📦 Remote micro-frontend
│   │   ├── src/
│   │   │   ├── App.tsx         # Remote application component
│   │   │   ├── bootstrap.tsx   # Module Federation bootstrap
│   │   │   └── index.ts        # Entry point
│   │   ├── webpack.config.js   # Remote webpack configuration
│   │   └── package.json
│   │
│   └── docs/                    # 📚 Learning resources
│       ├── PRODUCTION_READY_WEBPACK_REACT_TODO.md
│       ├── WEBPACK_ASSETS_GUIDE.md
│       └── WEBPACK_ASSET_OPTIMIZATION_NOTES.md
│
├── Micro-Frontend (MFE) learning topics.md
└── README.md
```

## ⚙️ Prerequisites

- **Node.js** (v16+ recommended)
- **Yarn** (preferred package manager)
- **Git** (for version control)

## 🚀 Quick Start

### 1. Clone the Repository
```bash
git clone <repository-url>
cd microfrontends-learn
```

### 2. Install Dependencies
```bash
# Install remote app dependencies
cd webpack-mfe/remote
yarn install

# Install host app dependencies  
cd ../host
yarn install
```

### 3. Start Development Servers
```bash
# Terminal 1: Start Remote App (port 3001)
cd webpack-mfe/remote
yarn start

# Terminal 2: Start Host App (port 3000)
cd webpack-mfe/host
yarn start
```

### 4. Open in Browser
- **Host App**: http://localhost:3000
- **Remote App**: http://localhost:3001

## 🔧 Development

### Available Scripts

Each micro-frontend has the following scripts:

```bash
yarn start      # Start development server
yarn build      # Build for production
yarn serve      # Serve production build
```

### Development Workflow

1. **Start Remote First**: Always start the remote app before the host
2. **Hot Reload**: Both apps support hot module replacement
3. **Independent Development**: Each app can be developed independently
4. **Type Safety**: Full TypeScript support across micro-frontends

## 📚 Learning Path

Follow the structured learning path in `Micro-Frontend (MFE) learning topics.md`:

### 🧱 **Phase 1: Fundamentals** (Current)
- [x] ✅ What is Micro-Frontend Architecture?
- [x] ✅ Module Federation: Core Concepts
- [x] ✅ Setting Up Basic Host and Remote
- [x] ✅ React TypeScript Integration

### 🔧 **Phase 2: Integration** (Next)
- [ ] 🎯 Exposing & Consuming Components
- [ ] 🎯 Dynamic Imports vs Static Imports
- [ ] 🎯 Error Boundaries for Isolation

### 🎨 **Phase 3: Advanced** (Future)
- [ ] 🎯 Inter-MFE Communication
- [ ] 🎯 Shared State Management
- [ ] 🎯 Routing Across MFEs

## 🛠️ Technologies Used

| Technology | Purpose | Version |
|------------|---------|---------|
| **React** | UI Library | 19.1.0 |
| **TypeScript** | Type Safety | 5.8.3 |
| **Webpack 5** | Module Bundler | 5.99.9 |
| **Module Federation** | Micro-Frontend Architecture | 3.1.22 |
| **ts-loader** | TypeScript Compilation | 9.5.2 |
| **webpack-dev-server** | Development Server | 5.2.2 |

## 📖 Documentation

### Learning Resources
- **[MFE Learning Topics](Micro-Frontend%20(MFE)%20learning%20topics.md)** - Comprehensive learning roadmap
- **[Production Guide](webpack-mfe/PRODUCTION_READY_WEBPACK_REACT_TODO.md)** - Production deployment checklist
- **[Webpack Assets Guide](webpack-mfe/WEBPACK_ASSETS_GUIDE.md)** - Asset optimization strategies
- **[Performance Notes](webpack-mfe/WEBPACK_ASSET_OPTIMIZATION_NOTES.md)** - Performance tuning guide

### Key Concepts

#### **Module Federation**
- **Host**: Main application that consumes remote modules
- **Remote**: Standalone application that exposes modules
- **Shared Dependencies**: Optimized sharing of common libraries

#### **Bootstrap Pattern**
- **Dynamic Imports**: Lazy loading of micro-frontends
- **Error Boundaries**: Isolation and fallback strategies
- **Type Safety**: TypeScript definitions for remote modules

## 🤝 Contributing

This is a learning project! Feel free to:
- 🐛 Report issues or bugs
- 💡 Suggest improvements
- 📝 Add documentation
- 🚀 Share your learning experiences

## 📄 License

This project is licensed under the **GPL-3.0 License** - see the [LICENSE](LICENSE) file for details.

## 🎓 Learning Resources

- **[Webpack Module Federation Docs](https://webpack.js.org/concepts/module-federation/)**
- **[React TypeScript Handbook](https://react-typescript-cheatsheet.netlify.app/)**
- **[Micro-Frontend Architecture Guide](https://micro-frontends.org/)**

---

**Happy Learning!** 🎉 Start with the basics and gradually work your way up to advanced micro-frontend patterns.

For questions or guidance, check the learning topics file or create an issue. 