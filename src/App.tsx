import * as React from 'react';

import { Toaster } from '@/components/ui/toaster';
import { Toaster as Sonner } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Index from './pages/Index';
import Dashboard from './pages/Dashboard';
import { CVBuilderPage } from './pages/CVBuilderPage';
import { PortfolioManagementPage } from './pages/PortfolioManagementPage';
import { PortfolioBuilderPage } from './pages/PortfolioBuilderPage';
import { PublicPortfolioPage } from './pages/PublicPortfolioPage';
import NotFound from './pages/NotFound';
import { AuthProvider } from './context/AuthContext';
import store from './utils/store';
import { Provider } from 'react-redux';

const queryClient = new QueryClient();

// Protected route wrapper
const _ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const isAuthenticated = !!localStorage.getItem('user');

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

const App = () => (
  <Provider store={store}>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/cv-builder" element={<CVBuilderPage />} />
              <Route path="/portfolio" element={<PortfolioManagementPage />} />
              <Route path="/portfolio/builder/:portfolio_id?" element={<PortfolioBuilderPage />} />
              <Route path="/p/:published_url" element={<PublicPortfolioPage />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  </Provider>
);

export default App;
