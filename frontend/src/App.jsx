import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { ToastProvider } from './context/ToastContext';
import { AuthProvider } from './context/AuthContext';

import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import StudentDashboard from './pages/StudentDashboard';
import CompanyDashboard from './pages/CompanyDashboard';
import AdminDashboard from './pages/AdminDashboard';
import ProtectedRoute from './routes/ProtectedRoute';

function App() {
  return (
    <ThemeProvider>
      <ToastProvider>
        <AuthProvider>
          <Router>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />

              {/* Student Protected Routes */}
              {['/student/dashboard', '/student'].map((p) => (
                <Route
                  key={p}
                  path={p}
                  element={
                    <ProtectedRoute roles={['student']}>
                      <StudentDashboard initialTab="overview" />
                    </ProtectedRoute>
                  }
                />
              ))}
              <Route
                path="/student/opportunities"
                element={
                  <ProtectedRoute roles={['student']}>
                    <StudentDashboard initialTab="opportunities" />
                  </ProtectedRoute>
                }
              />
              {['/student/my-applications', '/student/applications'].map((p) => (
                <Route
                  key={p}
                  path={p}
                  element={
                    <ProtectedRoute roles={['student']}>
                      <StudentDashboard initialTab="applications" />
                    </ProtectedRoute>
                  }
                />
              ))}
              {['/student/saved-projects', '/student/saved'].map((p) => (
                <Route
                  key={p}
                  path={p}
                  element={
                    <ProtectedRoute roles={['student']}>
                      <StudentDashboard initialTab="saved" />
                    </ProtectedRoute>
                  }
                />
              ))}
              {['/student/upcoming-joining', '/student/joining'].map((p) => (
                <Route
                  key={p}
                  path={p}
                  element={
                    <ProtectedRoute roles={['student']}>
                      <StudentDashboard initialTab="joining" />
                    </ProtectedRoute>
                  }
                />
              ))}
              <Route
                path="/student/profile"
                element={
                  <ProtectedRoute roles={['student']}>
                    <StudentDashboard initialTab="profile" />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/student/settings"
                element={
                  <ProtectedRoute roles={['student']}>
                    <StudentDashboard initialTab="settings" />
                  </ProtectedRoute>
                }
              />

              {/* Company Protected Routes */}
              {['/company/dashboard', '/company'].map((p) => (
                <Route
                  key={p}
                  path={p}
                  element={
                    <ProtectedRoute roles={['company']}>
                      <CompanyDashboard initialTab="overview" />
                    </ProtectedRoute>
                  }
                />
              ))}
              {['/company/post-project', '/company/post'].map((p) => (
                <Route
                  key={p}
                  path={p}
                  element={
                    <ProtectedRoute roles={['company']}>
                      <CompanyDashboard initialTab="post" />
                    </ProtectedRoute>
                  }
                />
              ))}
              {['/company/my-projects', '/company/projects'].map((p) => (
                <Route
                  key={p}
                  path={p}
                  element={
                    <ProtectedRoute roles={['company']}>
                      <CompanyDashboard initialTab="projects" />
                    </ProtectedRoute>
                  }
                />
              ))}
              <Route
                path="/company/applicants"
                element={
                  <ProtectedRoute roles={['company']}>
                    <CompanyDashboard initialTab="applicants" />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/company/analytics"
                element={
                  <ProtectedRoute roles={['company']}>
                    <CompanyDashboard initialTab="analytics" />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/company/profile"
                element={
                  <ProtectedRoute roles={['company']}>
                    <CompanyDashboard initialTab="profile" />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/company/settings"
                element={
                  <ProtectedRoute roles={['company']}>
                    <CompanyDashboard initialTab="settings" />
                  </ProtectedRoute>
                }
              />

              {/* Admin Protected Route */}
              <Route
                path="/admin/dashboard"
                element={
                  <ProtectedRoute roles={['admin']}>
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />

              {/* Fallback */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Router>
        </AuthProvider>
      </ToastProvider>
    </ThemeProvider>
  );
}

export default App;
