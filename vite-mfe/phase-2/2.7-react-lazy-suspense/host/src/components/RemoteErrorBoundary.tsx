import React, { Component, ReactNode } from 'react'

interface Props {
  children: ReactNode
  fallback?: ReactNode
  onError?: (error: Error, errorInfo: any) => void
}

interface State {
  hasError: boolean
  error?: Error
  retryCount: number
}

export class RemoteErrorBoundary extends Component<Props, State> {
  private maxRetries = 3

  constructor(props: Props) {
    super(props)
    this.state = { hasError: false, retryCount: 0 }
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: any) {
    console.error('Remote component error:', error, errorInfo)
    this.props.onError?.(error, errorInfo)
  }

  handleRetry = () => {
    if (this.state.retryCount < this.maxRetries) {
      this.setState((prevState) => ({
        hasError: false,
        error: undefined,
        retryCount: prevState.retryCount + 1,
      }))
    }
  }

  render() {
    if (this.state.hasError) {
      const canRetry = this.state.retryCount < this.maxRetries

      return (
        this.props.fallback || (
          <div
            style={{
              border: '2px solid red',
              padding: '20px',
              margin: '10px',
              borderRadius: '4px',
            }}
          >
            <h3>🚫 Remote Component Failed</h3>
            <p>Error: {this.state.error?.message}</p>
            <p>
              Attempt: {this.state.retryCount + 1}/{this.maxRetries + 1}
            </p>
            {canRetry && (
              <button
                onClick={this.handleRetry}
                style={{
                  padding: '10px 20px',
                  backgroundColor: '#ff9800',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  marginTop: '10px',
                }}
              >
                🔄 Retry Loading
              </button>
            )}
            {!canRetry && (
              <p>Component is temporarily unavailable. Please refresh the page.</p>
            )}
          </div>
        )
      )
    }

    return this.props.children
  }
}
