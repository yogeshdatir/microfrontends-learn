import React, { Suspense, useState, useEffect } from 'react'

interface SmartSuspenseProps {
  children: React.ReactNode
  fallback?: React.ReactNode
  minLoadingTime?: number // Prevent flash of loading state
  timeout?: number // Show timeout message
}

export const SmartSuspense: React.FC<SmartSuspenseProps> = ({
  children,
  fallback,
  minLoadingTime = 200,
  timeout = 10000,
}) => {
  const [showFallback, setShowFallback] = useState(false)
  const [showTimeout, setShowTimeout] = useState(false)

  useEffect(() => {
    const minTimer = setTimeout(() => setShowFallback(true), minLoadingTime)
    const timeoutTimer = setTimeout(() => setShowTimeout(true), timeout)

    return () => {
      clearTimeout(minTimer)
      clearTimeout(timeoutTimer)
    }
  }, [minLoadingTime, timeout])

  const loadingFallback = showTimeout ? (
    <div
      style={{
        border: '2px solid orange',
        padding: '20px',
        margin: '10px',
        borderRadius: '4px',
      }}
    >
      <p>⏱️ This is taking longer than expected...</p>
      <button
        onClick={() => window.location.reload()}
        style={{
          padding: '10px 20px',
          backgroundColor: '#2196F3',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
        }}
      >
        Refresh Page
      </button>
    </div>
  ) : showFallback ? (
    fallback || <div>Loading...</div>
  ) : null

  return <Suspense fallback={loadingFallback}>{children}</Suspense>
}
