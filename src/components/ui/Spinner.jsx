import './Spinner.css';

export function Spinner({ size = 'md', label = 'Loading...' }) {
  return (
    <div className={`spinner-wrap spinner-wrap--${size}`} role="status">
      <div className="spinner-ring" aria-hidden="true" />
      <span className="sr-only">{label}</span>
    </div>
  );
}

export function PageSpinner() {
  return (
    <div className="page-spinner">
      <Spinner size="lg" />
    </div>
  );
}
