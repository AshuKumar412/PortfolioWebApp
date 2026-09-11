import { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { toast } from '../components/ui/Toast';
import './AdminLayout.css';

const NAV_ITEMS = [
  { to: '/admin',              label: 'Overview',      icon: '📊', end: true },
  { to: '/admin/projects',     label: 'Projects',      icon: '🚀' },
  { to: '/admin/skills',       label: 'Skills',        icon: '💻' },
  { to: '/admin/education',    label: 'Education',     icon: '🎓' },
  { to: '/admin/experience',   label: 'Experience',    icon: '💼' },
  { to: '/admin/certifications', label: 'Certifications', icon: '🏅' },
  { to: '/admin/achievements', label: 'Achievements',  icon: '🏆' },
  { to: '/admin/services',     label: 'Services',      icon: '⚡' },
  { to: '/admin/profile',      label: 'Profile',       icon: '👤' },
  { to: '/admin/social-links', label: 'Social Links',  icon: '🔗' },
  { to: '/admin/messages',     label: 'Messages',      icon: '✉️' },
];

export function AdminLayout() {
  const { logout, user } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      toast.success('Logged out successfully');
      navigate('/admin/login');
    } catch {
      toast.error('Logout failed');
    }
  };

  return (
    <div className="admin-layout">
      {/* Sidebar */}
      <aside className={`admin-sidebar ${sidebarOpen ? 'admin-sidebar--open' : ''}`} aria-label="Admin navigation">
        <div className="admin-sidebar__header">
          <span className="admin-sidebar__logo" aria-hidden="true">&lt;/&gt;</span>
          <span className="admin-sidebar__title">Admin</span>
        </div>

        <nav className="admin-sidebar__nav">
          <ul role="list">
            {NAV_ITEMS.map(({ to, label, icon, end }) => (
              <li key={to}>
                <NavLink
                  to={to}
                  end={end}
                  className={({ isActive }) =>
                    `admin-nav-link ${isActive ? 'admin-nav-link--active' : ''}`
                  }
                  onClick={() => setSidebarOpen(false)}
                >
                  <span className="admin-nav-link__icon" aria-hidden="true">{icon}</span>
                  {label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <div className="admin-sidebar__footer">
          <div className="admin-sidebar__user">
            <div className="admin-sidebar__avatar" aria-hidden="true">
              {user?.email?.[0]?.toUpperCase() || 'A'}
            </div>
            <span className="admin-sidebar__email">{user?.email || 'Admin'}</span>
          </div>
          <div className="admin-sidebar__actions">
            <a href="/" target="_blank" rel="noopener noreferrer" className="admin-sidebar__action-btn" title="View portfolio">
              🔗
            </a>
            <button className="admin-sidebar__action-btn" onClick={toggleTheme} title="Toggle theme">
              {theme === 'dark' ? '☀' : '🌙'}
            </button>
            <button className="admin-sidebar__action-btn admin-sidebar__action-btn--danger" onClick={handleLogout} title="Log out">
              ↪
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="admin-overlay" onClick={() => setSidebarOpen(false)} aria-hidden="true" />
      )}

      {/* Main content */}
      <div className="admin-main">
        <header className="admin-topbar">
          <button
            className="admin-topbar__menu-btn"
            onClick={() => setSidebarOpen(o => !o)}
            aria-label="Toggle sidebar"
          >
            ☰
          </button>
          <div className="admin-topbar__right">
            <a href="/" target="_blank" rel="noopener" className="admin-topbar__portfolio-link">
              View Portfolio ↗
            </a>
          </div>
        </header>

        <div className="admin-content">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
