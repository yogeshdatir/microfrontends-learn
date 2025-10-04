# 2.7 React.lazy + Suspense - Vite Implementation

This demo implements advanced loading patterns from [2.7-react-lazy-suspense.md](../../../docs/phase-2/2.7-react-lazy-suspense.md) using Vite instead of Webpack.

## 🎯 What's Demonstrated

This demo showcases production-ready remote component loading with:

1. **Retry Mechanism** - Exponential backoff for failed loads
2. **Error Boundaries** - Graceful error handling with retry UI
3. **Smart Suspense** - Delayed loading states (prevents flash on fast networks)
4. **Network Awareness** - Online/offline detection
5. **Component Preloading** - Preload remotes before needed
6. **Timeout Handling** - User feedback for slow loads

## 📁 Project Structure

```
host/
├── src/
│   ├── components/
│   │   ├── RemoteErrorBoundary.tsx  # Error boundary with retry
│   │   └── SmartSuspense.tsx        # Delayed loading states
│   ├── hooks/
│   │   └── useNetworkStatus.ts      # Online/offline detection
│   ├── utils/
│   │   ├── remoteLoader.ts          # Retry with exponential backoff
│   │   └── preloader.ts             # Component preloading
│   ├── types/
│   │   └── remotes.d.ts             # TypeScript declarations
│   └── App.tsx                      # Production-ready patterns
└── vite.config.ts

remote/
├── src/
│   └── App.tsx                      # Remote component
└── vite.config.ts
```

## 🔑 Key Patterns Implemented

### 1. Retry Mechanism (remoteLoader.ts)

```ts
const RemoteApp = lazy(
  createRemoteLoader(() => import('remote/App'), 3, 1000)
)
```

- Retries up to 3 times
- Exponential backoff (1s, 2s, 4s)
- Logs retry attempts to console

### 2. Error Boundary with Retry UI (RemoteErrorBoundary.tsx)

```tsx
<RemoteErrorBoundary onError={handleError}>
  <RemoteApp />
</RemoteErrorBoundary>
```

- Shows error message with retry button
- Tracks retry attempts (max 3)
- Logs errors for monitoring

### 3. Smart Loading States (SmartSuspense.tsx)

```tsx
<SmartSuspense
  minLoadingTime={200}  // No flash on fast loads
  timeout={15000}        // Show timeout after 15s
>
  <RemoteApp />
</SmartSuspense>
```

- Prevents loading flash on fast connections
- Shows timeout message for slow loads
- Provides refresh button if stuck

### 4. Network Status Detection (useNetworkStatus.ts)

```tsx
const { isOnline } = useNetworkStatus()

{!isOnline && <div>You're offline. Remote components unavailable.</div>}
```

### 5. Component Preloading (preloader.ts)

```tsx
// Preload on mount or user interaction
useEffect(() => {
  if (isOnline) {
    preloadRemoteModule('RemoteApp', () => import('remote/App'))
  }
}, [isOnline])
```

## 🚀 Running the Demo

```bash
# Terminal 1: Start remote app
cd remote && yarn dev

# Terminal 2: Start host app
cd host && yarn dev

# Visit: http://localhost:3000
```

## 🧪 Testing Error Scenarios

### Test 1: Network Failure
1. Stop the remote server (Ctrl+C in remote terminal)
2. Refresh host app
3. ✅ Should see error fallback with retry button
4. Restart remote server
5. Click retry - component should load

### Test 2: Slow Network
1. Open DevTools → Network tab
2. Set throttling to "Slow 3G"
3. Refresh page
4. ✅ Should see loading state without flash
5. ✅ If > 15s, should show timeout message

### Test 3: Offline Mode
1. Open DevTools → Network tab
2. Set to "Offline"
3. Refresh page
4. ✅ Should see "You're offline" warning

## 🔄 Vite vs Webpack Differences

### No Differences in Concepts!

The advanced loading patterns (Error Boundaries, Suspense, retry logic, etc.) work **exactly the same** in both Vite and Webpack. These are React patterns, not build tool specific.

### Only Configuration Differs

See [../2.6-exposing-consuming-components/README.md](../2.6-exposing-consuming-components/README.md) for Module Federation config differences.

## 📊 Production Patterns Comparison

| Pattern | Works in Vite? | Works in Webpack? | Notes |
|---------|---------------|-------------------|-------|
| React.lazy | ✅ | ✅ | Same API |
| Suspense | ✅ | ✅ | Same API |
| Error Boundaries | ✅ | ✅ | Same API |
| Retry Logic | ✅ | ✅ | Custom implementation |
| Network Detection | ✅ | ✅ | Browser API |
| Preloading | ✅ | ✅ | Custom caching |

## 🎓 Learning Points

### ✅ Essential Patterns

1. **Always wrap remotes in Error Boundaries**
   ```tsx
   <RemoteErrorBoundary>
     <Suspense fallback={<Loading />}>
       <RemoteApp />
     </Suspense>
   </RemoteErrorBoundary>
   ```

2. **Add retry mechanism for resilience**
   ```tsx
   const loader = createRemoteLoader(importFn, 3, 1000)
   ```

3. **Prevent loading flash on fast networks**
   ```tsx
   <SmartSuspense minLoadingTime={200}>
   ```

4. **Handle offline scenarios gracefully**
   ```tsx
   const { isOnline } = useNetworkStatus()
   {!isOnline && <OfflineMessage />}
   ```

### 🚫 Common Mistakes

❌ **Don't** use basic lazy loading in production:
```tsx
// Too basic - no error handling
const RemoteApp = lazy(() => import('remote/App'))
```

✅ **Do** add error handling:
```tsx
const RemoteApp = lazy(() =>
  import('remote/App').catch(() => ({
    default: () => <ErrorFallback />
  }))
)
```

## 🔗 Related Documentation

- [Webpack Version - 2.7 React.lazy + Suspense](../../../docs/phase-2/2.7-react-lazy-suspense.md)
- [2.6 Exposing & Consuming Components](../2.6-exposing-consuming-components)
- [React Suspense Docs](https://react.dev/reference/react/Suspense)
- [React Error Boundaries](https://react.dev/reference/react/Component#catching-rendering-errors-with-an-error-boundary)

## 💡 Next Steps

After mastering these patterns:
- Implement bundle size monitoring
- Add performance metrics tracking
- Create reusable RemoteWrapper component
- Add A/B testing for remote features
