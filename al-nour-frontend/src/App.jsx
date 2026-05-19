import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { DarkModeProvider } from './contexts/DarkModeContext';
import { NotificationsProvider } from './contexts/NotificationsContext';
import { AnnouncementsProvider } from './contexts/AnnouncementsContext';
import { useNotifications } from './contexts/NotificationsContext';
import HomePage from './components/HomePage';
import LoginPage from './components/LoginPage';
import AdminDashboard from './components/dashboards/AdminDashboard';
import TeacherDashboard from './components/dashboards/TeacherDashboard';
import ParentDashboard from './components/dashboards/ParentDashboard';
import ProtectedRoute from './components/ProtectedRoute';
import './App.css';

// Wrapper component to pass notifications context to announcements
const AnnouncementsWithNotifications = ({ children }) => {
  const notificationsContext = useNotifications();
  
  return (
    <AnnouncementsProvider notificationsContext={notificationsContext}>
      {children}
    </AnnouncementsProvider>
  );
};

function App() {
  return (
    <DarkModeProvider>
      <NotificationsProvider>
        <AnnouncementsWithNotifications>
          <Router>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<HomePage />} />
              <Route path="/login/:role" element={<LoginPage />} />
              
              {/* Protected Routes */}
              <Route 
                path="/admin/dashboard" 
                element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <AdminDashboard />
                  </ProtectedRoute>
                } 
              />
              
              <Route 
                path="/teacher/dashboard" 
                element={
                  <ProtectedRoute allowedRoles={['teacher']}>
                    <TeacherDashboard />
                  </ProtectedRoute>
                } 
              />
              
              <Route 
                path="/parent/dashboard" 
                element={
                  <ProtectedRoute allowedRoles={['parent']}>
                    <ParentDashboard />
                  </ProtectedRoute>
                } 
              />
              
              {/* Fallback Route */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Router>
        </AnnouncementsWithNotifications>
      </NotificationsProvider>
    </DarkModeProvider>
  );
}

export default App;