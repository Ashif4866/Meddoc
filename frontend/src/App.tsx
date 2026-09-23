import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { AppLayout } from './layouts/AppLayout';

// Pages
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { DashboardPage } from './pages/DashboardPage';
import { DemandAnalyticsPage } from './pages/DemandAnalyticsPage';
import { SpikesPage } from './pages/SpikesPage';
import { GeographicPage } from './pages/GeographicPage';
import { ForecastingPage } from './pages/ForecastingPage';
import { InventoryPage } from './pages/InventoryPage';
import { InsightsPage } from './pages/InsightsPage';
import { AlertsPage } from './pages/AlertsPage';
import { PharmaciesPage } from './pages/PharmaciesPage';
import { MedicinesPage } from './pages/MedicinesPage';
import { ReportsPage } from './pages/ReportsPage';
import { DataIngestionPage } from './pages/DataIngestionPage';
import { SettingsPage } from './pages/SettingsPage';

// Protected Route Component
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center text-teal-600 text-sm font-semibold gap-2">
        <div className="w-5 h-5 border-2 border-teal-600 border-t-transparent rounded-full animate-spin"></div>
        Loading Meddoc Intelligence...
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export const App: React.FC = () => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            {/* Authenticated Platform Routes */}
            <Route
              element={
                <ProtectedRoute>
                  <AppLayout />
                </ProtectedRoute>
              }
            >
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/analytics" element={<DemandAnalyticsPage />} />
              <Route path="/spikes" element={<SpikesPage />} />
              <Route path="/geographic" element={<GeographicPage />} />
              <Route path="/forecasting" element={<ForecastingPage />} />
              <Route path="/inventory" element={<InventoryPage />} />
              <Route path="/insights" element={<InsightsPage />} />
              <Route path="/alerts" element={<AlertsPage />} />
              <Route path="/pharmacies" element={<PharmaciesPage />} />
              <Route path="/medicines" element={<MedicinesPage />} />
              <Route path="/reports" element={<ReportsPage />} />
              <Route path="/data-ingestion" element={<DataIngestionPage />} />
              <Route path="/settings" element={<SettingsPage />} />
            </Route>

            {/* Catch-all */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
