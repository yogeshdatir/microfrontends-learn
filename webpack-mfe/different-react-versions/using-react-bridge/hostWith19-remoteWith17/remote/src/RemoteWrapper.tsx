import { createBridgeComponent } from '@module-federation/bridge-react';
import App from './App';

// Use React Bridge to handle React version compatibility
// This automatically handles mount/unmount and version differences
export default createBridgeComponent({
  rootComponent: App,
});