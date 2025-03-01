import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useEffect, Suspense } from 'react';
import Navigation from './components/Navigation';
import POS from './pages/POS';
import ProductManagement from './pages/ProductManagement';
import SalesManagement from './pages/SalesManagement';
import UserManagement from './pages/UserManagement';
import Login from './pages/Login';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider } from './context/AuthContext';
import ErrorBoundary from './components/ErrorBoundary';
import './index.css';

// Loading component for Suspense fallback
const LoadingSpinner = () => (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 to-teal-50">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
  </div>
);

function App() {
  useEffect(() => {
    // Load Google Fonts
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=DM+Sans:wght@400;500;700&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);

    // Initialize default owner account if no users exist
    try {
      let users = localStorage.getItem('users');
      if (!users || JSON.parse(users).length === 0) {
        const defaultOwner = {
          id: crypto.randomUUID(),
          username: 'owner',
          password: 'owner123',
          name: 'System Owner',
          role: 'owner'
        };
        localStorage.setItem('users', JSON.stringify([defaultOwner]));
        users = JSON.stringify([defaultOwner]);
      }
      // Ensure users are properly loaded
      console.log('Users initialized:', JSON.parse(users));
    } catch (error) {
      console.error('Failed to initialize default user:', error);
    }

    return () => {
      document.head.removeChild(link);
    };
  }, []);

  return (
    <ErrorBoundary>
      <AuthProvider>
        <Suspense fallback={<LoadingSpinner />}>
          <Router>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route
                path="/*"
                element={
                  <ProtectedRoute>
                    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50 flex">
                      <Navigation />
                      <main className="flex-1 overflow-hidden">
                        <Routes>
                          <Route path="/" element={<POS />} />
                          <Route
                            path="/products"
                            element={
                              <ProtectedRoute allowedRoles={['owner', 'store_manager']}>
                                <ProductManagement />
                              </ProtectedRoute>
                            }
                          />
                          <Route
                            path="/sales"
                            element={
                              <ProtectedRoute allowedRoles={['owner', 'store_manager']}>
                                <SalesManagement />
                              </ProtectedRoute>
                            }
                          />
                          <Route
                            path="/users"
                            element={
                              <ProtectedRoute allowedRoles={['owner']}>
                                <UserManagement />
                              </ProtectedRoute>
                            }
                          />
                        </Routes>
                      </main>
                    </div>
                  </ProtectedRoute>
                }
              />
            </Routes>
          </Router>
        </Suspense>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;
