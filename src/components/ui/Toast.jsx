import { useEffect, useState, useCallback } from 'react';
import './Toast.css';

let toastId = 0;
const listeners = new Set();

export const toast = {
  _emit(type, message, duration = 4000) {
    const id = ++toastId;
    listeners.forEach(fn => fn({ id, type, message, duration }));
  },
  success: (msg, dur) => toast._emit('success', msg, dur),
  error:   (msg, dur) => toast._emit('error',   msg, dur),
  info:    (msg, dur) => toast._emit('info',     msg, dur),
  warning: (msg, dur) => toast._emit('warning',  msg, dur),
};

export function ToastContainer() {
  const [toasts, setToasts] = useState([]);

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  useEffect(() => {
    const handler = (t) => {
      setToasts(prev => [...prev.slice(-4), t]);
      setTimeout(() => removeToast(t.id), t.duration);
    };
    listeners.add(handler);
    return () => listeners.delete(handler);
  }, [removeToast]);

  return (
    <div className="toast-container" aria-live="polite" aria-atomic="false">
      {toasts.map(t => (
        <div key={t.id} className={`toast toast--${t.type}`} role="alert">
          <span className="toast__icon" aria-hidden="true">
            {t.type === 'success' && '✓'}
            {t.type === 'error'   && '✕'}
            {t.type === 'warning' && '⚠'}
            {t.type === 'info'    && 'ℹ'}
          </span>
          <span className="toast__message">{t.message}</span>
          <button
            className="toast__close"
            onClick={() => removeToast(t.id)}
            aria-label="Dismiss notification"
          >×</button>
        </div>
      ))}
    </div>
  );
}
