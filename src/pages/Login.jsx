import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/Button';
import './Login.css';

export function Login() {
  const { login } = useAuth();
  const navigate  = useNavigate();
  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [error,    setError]    = useState('');
  const [loading,  setLoading]  = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      navigate('/admin', { replace: true });
    } catch (err) {
      setError('Invalid email or password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-bg-orb login-bg-orb--1" aria-hidden="true" />
      <div className="login-bg-orb login-bg-orb--2" aria-hidden="true" />

      <main className="login-card" aria-labelledby="login-title">
        <div className="login-logo" aria-hidden="true">&lt;/&gt;</div>
        <h1 id="login-title" className="login-title">Admin Login</h1>
        <p className="login-subtitle">Sign in to manage your portfolio</p>

        {error && (
          <div className="login-error" role="alert">
            <span aria-hidden="true">⚠</span> {error}
          </div>
        )}

        <form className="login-form" onSubmit={handleSubmit} noValidate>
          <div className="form-group">
            <label htmlFor="login-email" className="form-label">Email</label>
            <input
              id="login-email"
              type="email"
              className="form-input"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="admin@example.com"
              required
              autoComplete="email"
              autoFocus
            />
          </div>
          <div className="form-group">
            <label htmlFor="login-password" className="form-label">Password</label>
            <input
              id="login-password"
              type="password"
              className="form-input"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              autoComplete="current-password"
            />
          </div>
          <Button type="submit" size="lg" loading={loading} className="login-submit">
            Sign In
          </Button>
        </form>

        <a href="/" className="login-back">← Back to Portfolio</a>
      </main>
    </div>
  );
}
