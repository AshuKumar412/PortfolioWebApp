import './Badge.css';

export function Badge({ children, variant = 'default', size = 'sm' }) {
  return (
    <span className={`badge badge--${variant} badge--${size}`}>
      {children}
    </span>
  );
}
