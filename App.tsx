
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { Layout } from './components/Layout';
import { ProtectedRoute } from './components/ProtectedRoute';
import { authService } from './services/auth';
import { DashboardPage } from './pages/DashboardPage';
import { DemoPage } from './pages/DemoPage';
import { InboxPage } from './pages/InboxPage';
import { DevicePage } from './pages/DevicePage';
import { CommandsPage } from './pages/CommandsPage';
import { SettingsPage } from './pages/SettingsPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';

function AppRoutes() {
  const navigate = useNavigate();

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  return (
    <Routes>
      {/* Public routes */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* Protected routes */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Layout onLogout={handleLogout}>
              <DashboardPage onNavigate={(page) => navigate(`/${page}`)} />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Layout onLogout={handleLogout}>
              <DashboardPage onNavigate={(page) => navigate(`/${page}`)} />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/demo"
        element={
          <ProtectedRoute>
            <Layout onLogout={handleLogout}>
              <DemoPage />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/inbox"
        element={
          <ProtectedRoute>
            <Layout onLogout={handleLogout}>
              <InboxPage />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/device"
        element={
          <ProtectedRoute>
            <Layout onLogout={handleLogout}>
              <DevicePage />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/commands"
        element={
          <ProtectedRoute>
            <Layout onLogout={handleLogout}>
              <CommandsPage />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/settings"
        element={
          <ProtectedRoute>
            <Layout onLogout={handleLogout}>
              <SettingsPage />
            </Layout>
          </ProtectedRoute>
        }
      />

      {/* Catch all - redirect to dashboard */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}
