import { useState, useEffect } from 'react'
import './App.css'
import RegistrationForm from './RegistrationForm.jsx';
import MenuSection from './MenuSection.jsx';
import AdminPage from './AdminPage.jsx';
import NotificationSystem from './NotificationSystem.jsx';
import { authUtils } from './services/api';

function App() {
  const [currentPage, setCurrentPage] = useState('registration');
  const [currentUser, setCurrentUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check if running in demo mode
  const isDemoMode = window.location.hostname.includes('github.io');

  // Check authentication on app load
  useEffect(() => {
    const user = authUtils.getCurrentUser();
    if (user && authUtils.isAuthenticated()) {
      setCurrentUser(user);
      setIsAuthenticated(true);
      // Redirect based on user role
      setCurrentPage(user.role === 'admin' ? 'admin' : 'menu');
    }
  }, []);

  // Handle successful authentication
  const handleAuthSuccess = (user) => {
    setCurrentUser(user);
    setIsAuthenticated(true);
    // Redirect based on user role - admins go to admin panel, students go to menu
    setCurrentPage(user.role === 'admin' ? 'admin' : 'menu');
  };

  // Handle logout
  const handleLogout = () => {
    authUtils.logout();
    setCurrentUser(null);
    setIsAuthenticated(false);
    setCurrentPage('registration');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Demo Mode Banner */}
      {isDemoMode && (
        <div className="bg-yellow-500 text-black px-4 py-2 text-center text-sm">
          🎭 <strong>Demo Mode</strong> - This is a frontend-only demo using mock data. 
          Try login with any email/password! Admin demo: admin@example.com / admin123
        </div>
      )}
      
      {/* Navigation */}
      <nav className="bg-blue-600 text-white p-4">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">Smart Saving Food</h1>
          <div className="flex items-center gap-4">
            {/* Show different navigation based on authentication */}
            {!isAuthenticated ? (
              <button
                onClick={() => setCurrentPage('registration')}
                className={`px-4 py-2 rounded-md transition-colors ${
                  currentPage === 'registration'
                    ? 'bg-blue-800'
                    : 'hover:bg-blue-700'
                }`}
              >
                👤 Login / Register
              </button>
            ) : (
              <>
                {/* User info */}
                <span className="text-sm">
                  Welcome, {currentUser?.name} ({currentUser?.role})
                </span>
                
                <button
                  onClick={() => setCurrentPage('menu')}
                  className={`px-4 py-2 rounded-md transition-colors ${
                    currentPage === 'menu'
                      ? 'bg-blue-800'
                      : 'hover:bg-blue-700'
                  }`}
                >
                  🍽️ Daily Menu
                </button>
                
                {/* Show admin panel only for admins */}
                {currentUser?.role === 'admin' && (
                  <button
                    onClick={() => setCurrentPage('admin')}
                    className={`px-4 py-2 rounded-md transition-colors ${
                      currentPage === 'admin'
                        ? 'bg-blue-800'
                        : 'hover:bg-blue-700'
                    }`}
                  >
                    🔧 Admin Panel
                  </button>
                )}
                
                {/* Notification System - only for authenticated users */}
                <NotificationSystem />
                
                {/* Logout button */}
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 rounded-md bg-red-600 hover:bg-red-700 transition-colors"
                >
                  🚪 Logout
                </button>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Page Content */}
      <main className="py-8">
        {currentPage === 'registration' && (
          <RegistrationForm onAuthSuccess={handleAuthSuccess} />
        )}
        {currentPage === 'menu' && isAuthenticated && <MenuSection />}
        {currentPage === 'admin' && isAuthenticated && currentUser?.role === 'admin' && (
          <AdminPage />
        )}
        
        {/* Show access denied for unauthorized pages */}
        {currentPage === 'admin' && (!isAuthenticated || currentUser?.role !== 'admin') && (
          <div className="max-w-md mx-auto mt-20 p-8 bg-red-100 border border-red-400 text-red-700 rounded-xl text-center">
            <h2 className="text-xl font-bold mb-4">Access Denied</h2>
            <p className="mb-4">You need admin privileges to access this page.</p>
            <button
              onClick={() => setCurrentPage('menu')}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
            >
              Go to Menu
            </button>
          </div>
        )}
        
        {(currentPage === 'menu' || currentPage === 'admin') && !isAuthenticated && (
          <div className="max-w-md mx-auto mt-20 p-8 bg-yellow-100 border border-yellow-400 text-yellow-700 rounded-xl text-center">
            <h2 className="text-xl font-bold mb-4">Authentication Required</h2>
            <p className="mb-4">Please login to access this page.</p>
            <button
              onClick={() => setCurrentPage('registration')}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
            >
              Go to Login
            </button>
          </div>
        )}
      </main>
    </div>
  );
}

export default App
