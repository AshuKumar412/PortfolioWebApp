import { useRef, useState } from 'react';
import './FileUpload.css';

export function FileUpload({
  onFile,
  accept = 'image/*',
  label = 'Click or drag to upload',
  hint,
  preview,
  loading = false,
  error,
}) {
  const inputRef = useRef(null);
  const [dragging, setDragging] = useState(false);

  const handleFile = (file) => { if (file) onFile(file); };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    handleFile(e.dataTransfer.files[0]);
  };

  return (
    <div className="file-upload">
      <div
        className={`file-upload__zone ${dragging ? 'file-upload__zone--drag' : ''} ${error ? 'file-upload__zone--error' : ''}`}
        onClick={() => inputRef.current?.click()}
        onDragOver={e => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        role="button"
        tabIndex={0}
        onKeyDown={e => e.key === 'Enter' && inputRef.current?.click()}
        aria-label={label}
      >
        {loading ? (
          <div className="file-upload__spinner" aria-label="Uploading..." />
        ) : preview ? (
          <img src={preview} alt="Preview" className="file-upload__preview" loading="lazy" />
        ) : (
          <>
            <span className="file-upload__icon" aria-hidden="true">📁</span>
            <span className="file-upload__label">{label}</span>
            {hint && <span className="file-upload__hint">{hint}</span>}
          </>
        )}
      </div>
      {error && <p className="file-upload__error" role="alert">{error}</p>}
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="sr-only"
        onChange={e => handleFile(e.target.files[0])}
        aria-hidden="true"
        tabIndex={-1}
      />
    </div>
  );
}
