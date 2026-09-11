import { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { isSupabaseConfigured } from '../../lib/supabase';
import './AdminLogin.css';

export function AdminLogin() {
  const { login, isAuthenticated, isLoading } = useAuth();
  const navigate  = useNavigate();
  const location  = useLocation();

  const [email,       setEmail]       = useState('');
  const [password,    setPassword]    = useState('');
  const [showPass,    setShowPass]    = useState(false);
  const [submitting,  setSubmitting]  = useState(false);
  const [error,       setError]       = useState('');
  const [fieldErrors, setFieldErrors] = useState({});

  // If already authenticated, go directly to admin
  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      const from = location.state?.from?.pathname || '/admin';
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, isLoading, navigate, location]);

  const validate = () => {
    const errs = {};
    if (!email.trim())         errs.email    = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(email)) errs.email = 'Enter a valid email address';
    if (!password)             errs.password = 'Password is required';
    else if (password.length < 6) errs.password = 'Password must be at least 6 characters';
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setFieldErrors({});

    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setFieldErrors(errs);
      return;
    }

    // Guard: Supabase not configured yet
    if (!isSupabaseConfigured) {
      setError('Supabase is not configured. Add your VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to .env and restart the dev server.');
      return;
    }

    setSubmitting(true);
    try {
      await login(email.trim(), password);
      const from = location.state?.from?.pathname || '/admin';
      navigate(from, { replace: true });
    } catch (err) {
      // Always log raw error for developer debugging — never shown in UI
      console.error('[AdminLogin] Auth error:', err?.message, err);

      const msg = err?.message?.toLowerCase() ?? '';

      if (msg.includes('invalid login') ||
          msg.includes('invalid credentials') ||
          msg.includes('invalid email or password') ||
          msg.includes('email not confirmed') ||
          msg.includes('user not found')) {
        setError('Invalid email or password. Please try again.');
      } else if (
        msg.includes('failed to fetch') ||
        msg.includes('networkerror') ||
        msg.includes('network request failed') ||
        msg.includes('could not be resolved') ||
        msg.includes('etimedout') ||
        msg.includes('econnrefused')
      ) {
        setError(
          'Cannot reach the authentication server. ' +
          'Check that VITE_SUPABASE_URL in your .env is correct and the dev server was restarted after editing .env.'
        );
      } else if (msg.includes('too many requests') || msg.includes('rate limit')) {
        setError('Too many login attempts. Please wait a moment and try again.');
      } else if (msg.includes('email') && msg.includes('confirm')) {
        setError('Please confirm your email address before logging in.');
      } else {
        setError(`Login failed: ${err?.message || 'Unknown error'}. Check the browser console for details.`);
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleFieldChange = (field, setter) => (e) => {
    setter(e.target.value);
    if (fieldErrors[field]) setFieldErrors(prev => ({ ...prev, [field]: '' }));
    if (error) setError('');
  };

  if (isLoading) {
    return (
      <div className="admin-login-page">
        <div className="admin-login-card">
          <div className="admin-login-logo" aria-label="Loading">
            <span className="admin-login-logo__spinner" aria-hidden="true" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-login-page">
      {/* Background orbs */}
      <div className="admin-login-orb admin-login-orb--1" aria-hidden="true" />
      <div className="admin-login-orb admin-login-orb--2" aria-hidden="true" />
      <div className="admin-login-grid" aria-hidden="true" />

      <main className="admin-login-card" aria-labelledby="admin-login-title">
        {/* Logo / brand */}
        <div className="admin-login-brand">
          <div className="admin-login-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="28" height="28">
              <path strokeLinecap="round" strokeLinejoin="round"
                d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
            </svg>
          </div>
          <h1 id="admin-login-title" className="admin-login-title">Admin Portal</h1>
          <p className="admin-login-subtitle">Sign in to manage your portfolio</p>
        </div>

        {/* Error banner */}
        {error && (
          <div className="admin-login-error" role="alert" aria-live="assertive">
            <svg viewBox="0 0 20 20" fill="currentColor" width="16" height="16" aria-hidden="true">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"/>
            </svg>
            {error}
          </div>
        )}

        {/* Login form */}
        <form className="admin-login-form" onSubmit={handleSubmit} noValidate aria-label="Admin sign in">
          {/* Email */}
          <div className="admin-login-field">
            <label htmlFor="admin-email" className="admin-login-label">
              Email address
            </label>
            <div className={`admin-login-input-wrap ${fieldErrors.email ? 'admin-login-input-wrap--error' : ''}`}>
              <svg className="admin-login-input-icon" viewBox="0 0 20 20" fill="currentColor" width="16" height="16" aria-hidden="true">
                <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"/>
                <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"/>
              </svg>
              <input
                id="admin-email"
                type="email"
                className="admin-login-input"
                value={email}
                onChange={handleFieldChange('email', setEmail)}
                placeholder="admin@example.com"
                autoComplete="email"
                autoFocus
                required
                aria-describedby={fieldErrors.email ? 'email-error' : undefined}
                aria-invalid={!!fieldErrors.email}
              />
            </div>
            {fieldErrors.email && (
              <span id="email-error" className="admin-login-field-error" role="alert">
                {fieldErrors.email}
              </span>
            )}
          </div>

          {/* Password */}
          <div className="admin-login-field">
            <label htmlFor="admin-password" className="admin-login-label">
              Password
            </label>
            <div className={`admin-login-input-wrap ${fieldErrors.password ? 'admin-login-input-wrap--error' : ''}`}>
              <svg className="admin-login-input-icon" viewBox="0 0 20 20" fill="currentColor" width="16" height="16" aria-hidden="true">
                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd"/>
              </svg>
              <input
                id="admin-password"
                type={showPass ? 'text' : 'password'}
                className="admin-login-input admin-login-input--has-toggle"
                value={password}
                onChange={handleFieldChange('password', setPassword)}
                placeholder="••••••••"
                autoComplete="current-password"
                required
                aria-describedby={fieldErrors.password ? 'password-error' : undefined}
                aria-invalid={!!fieldErrors.password}
              />
              <button
                type="button"
                className="admin-login-show-btn"
                onClick={() => setShowPass(v => !v)}
                aria-label={showPass ? 'Hide password' : 'Show password'}
                tabIndex={0}
              >
                {showPass ? (
                  <svg viewBox="0 0 20 20" fill="currentColor" width="16" height="16">
                    <path fillRule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z" clipRule="evenodd"/>
                    <path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z"/>
                  </svg>
                ) : (
                  <svg viewBox="0 0 20 20" fill="currentColor" width="16" height="16">
                    <path d="M10 12a2 2 0 100-4 2 2 0 000 4z"/>
                    <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd"/>
                  </svg>
                )}
              </button>
            </div>
            {fieldErrors.password && (
              <span id="password-error" className="admin-login-field-error" role="alert">
                {fieldErrors.password}
              </span>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="admin-login-submit"
            disabled={submitting}
            aria-busy={submitting}
          >
            {submitting ? (
              <>
                <span className="admin-login-btn-spinner" aria-hidden="true" />
                <span>Signing in…</span>
              </>
            ) : (
              <>
                <span>Sign In</span>
                <svg viewBox="0 0 20 20" fill="currentColor" width="16" height="16" aria-hidden="true">
                  <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clipRule="evenodd"/>
                </svg>
              </>
            )}
          </button>
        </form>

        {/* Footer */}
        <div className="admin-login-footer">
          <Link to="/" className="admin-login-back-link">
            <svg viewBox="0 0 20 20" fill="currentColor" width="14" height="14" aria-hidden="true">
              <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd"/>
            </svg>
            Back to Portfolio
          </Link>
        </div>
      </main>
    </div>
  );
}
