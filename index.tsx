
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';

console.log("System: Kaiju Core Booting...");

const init = () => {
  const container = document.getElementById('root');
  if (container) {
    const root = createRoot(container);
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
    console.log("System: UI Mounted.");
  } else {
    console.error("System: Mount Point Lost.");
  }
};

// Ensure DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
