import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/authStore';
import LoginView from './pages/LoginView';
import RegistryDashboard from './pages/RegistryDashboard';
import FundMap from './pages/FundMap';
import AgenciesView from './pages/AgenciesView';
import AnalysisView from './pages/AnalysisView';
import ResourceMarketplace from './pages/ResourceMarketplace';
import PublicPortal from './pages/PublicPortal';
import './App.css';
import './index.css';

// Protect routes that require authentication
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isCheckingAuth } = useAuthStore();
  
  if (isCheckingAuth) {
    return <div className="min-h-screen flex items-center justify-center bg-background">Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

const App = () => {
  const checkAuth = useAuthStore(state => state.checkAuth);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginView />} />
        <Route path="/public" element={<PublicPortal />} />
        
        {/* Protected Dashboard Routes */}
        <Route 
          path="/*" 
          element={
            <ProtectedRoute>
              <Routes>
                <Route path="/registry" element={<RegistryDashboard />} />
                <Route path="/resources" element={<ResourceMarketplace />} />
                <Route path="/map" element={<FundMap />} />
                <Route path="/agencies" element={<AgenciesView />} />
                <Route path="/analysis" element={<AnalysisView />} />
                <Route path="/" element={<Navigate to="/registry" replace />} />
                <Route path="*" element={<Navigate to="/registry" replace />} />
              </Routes>
            </ProtectedRoute>
          } 
        />
      </Routes>
    </Router>
  );
};

export default App;
