import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

const container = document.getElementById('root');

if (!container) {
  throw new Error(
    'Failed to find the root element. Please add a div with id="root" to your HTML'
  );
}

const root = createRoot(container);

// Wrap in try-catch to handle rendering errors
try {
  root.render(
    <StrictMode>
      <App />
    </StrictMode>
  );
} catch (error) {
  console.error('Failed to render the app:', error);
  // Render a fallback error message
  root.render(
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 to-teal-50">
      <div className="p-8 bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl">
        <h1 className="text-2xl font-bold text-red-600 mb-4">Something went wrong</h1>
        <p className="text-gray-600">Please try refreshing the page.</p>
      </div>
    </div>
  );
}
