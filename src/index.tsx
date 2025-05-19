import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './styles.css';
import './styles/tiptap.css'

console.log('Starting app initialization...');

const rootElement = document.getElementById('root');
console.log('Root element:', rootElement);

if (rootElement) {
  const root = ReactDOM.createRoot(rootElement);
  console.log('Created React root');
  
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
  console.log('Rendered App component');
} else {
  console.error('Root element not found!');
}