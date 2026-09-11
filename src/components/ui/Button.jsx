import './Button.css';

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  as: Tag = 'button',
  loading = false,
  disabled = false,
  className = '',
  ...props
}) {
  return (
    <Tag
      className={`btn btn--${variant} btn--${size} ${loading ? 'btn--loading' : ''} ${className}`}
      disabled={disabled || loading}
      aria-busy={loading}
      {...props}
    >
      {loading && <span className="btn__spinner" aria-hidden="true" />}
      <span className={loading ? 'btn__text btn__text--hidden' : 'btn__text'}>{children}</span>
    </Tag>
  );
}
