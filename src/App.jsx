import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider }  from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { ToastContainer } from './components/ui/Toast';
import { ProtectedRoute } from './components/ui/ProtectedRoute';

import { Portfolio }       from './pages/Portfolio';
import { AdminLogin }      from './pages/admin/AdminLogin';
import { AdminLayout }     from './layouts/AdminLayout';
import { AdminOverview }   from './pages/admin/AdminOverview';
import { AdminProjects }   from './pages/admin/AdminProjects';
import { AdminSkills }     from './pages/admin/AdminSkills';
import { AdminEducation }  from './pages/admin/AdminEducation';
import { AdminExperience } from './pages/admin/AdminExperience';
import { AdminCertifications } from './pages/admin/AdminCertifications';
import { AdminAchievements }   from './pages/admin/AdminAchievements';
import { AdminServices }   from './pages/admin/AdminServices';
import { AdminProfile }    from './pages/admin/AdminProfile';
import { AdminSocialLinks } from './pages/admin/AdminSocialLinks';
import { AdminMessages }   from './pages/admin/AdminMessages';

export default function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <Routes>
            {/* Public portfolio */}
            <Route path="/" element={<Portfolio />} />

            {/* Legacy /login → redirect to /admin/login */}
            <Route path="/login" element={<Navigate to="/admin/login" replace />} />

            {/* Admin login (public) */}
            <Route path="/admin/login" element={<AdminLogin />} />

            {/* Admin dashboard — protected (all subroutes) */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute>
                  <AdminLayout />
                </ProtectedRoute>
              }
            >
              <Route index                element={<AdminOverview />} />
              <Route path="projects"       element={<AdminProjects />} />
              <Route path="skills"         element={<AdminSkills />} />
              <Route path="education"      element={<AdminEducation />} />
              <Route path="experience"     element={<AdminExperience />} />
              <Route path="certifications" element={<AdminCertifications />} />
              <Route path="achievements"   element={<AdminAchievements />} />
              <Route path="services"       element={<AdminServices />} />
              <Route path="profile"        element={<AdminProfile />} />
              <Route path="social-links"   element={<AdminSocialLinks />} />
              <Route path="messages"       element={<AdminMessages />} />
            </Route>

            {/* Catch-all */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
          <ToastContainer />
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}
