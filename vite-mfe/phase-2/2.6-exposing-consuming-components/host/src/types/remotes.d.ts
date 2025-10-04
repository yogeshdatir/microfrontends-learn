declare module 'remote/App' {
  const App: React.ComponentType
  export default App
}

declare module 'remote/Button' {
  interface ButtonProps {
    label: string
    onClick: () => void
  }
  const Button: React.ComponentType<ButtonProps>
  export default Button
}
