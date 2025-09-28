declare module 'remote/App' {
  const App: {
    mount: (element: HTMLElement) => void;
    unmount: () => void;
  };
  export default App;
}