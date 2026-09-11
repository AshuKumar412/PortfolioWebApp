import { useEffect, useRef } from 'react';
import './Modal.css';

export function Modal({ isOpen, onClose, title, children, size = 'md' }) {
  const dialogRef = useRef(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (isOpen) {
      if (!dialog.open) dialog.showModal();
    } else {
      if (dialog.open) dialog.close();
    }
  }, [isOpen]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    const handleClose = () => onClose?.();
    dialog.addEventListener('close', handleClose);
    return () => dialog.removeEventListener('close', handleClose);
  }, [onClose]);

  const handleClick = (e) => {
    const rect = dialogRef.current?.getBoundingClientRect();
    if (rect && (
      e.clientX < rect.left || e.clientX > rect.right ||
      e.clientY < rect.top  || e.clientY > rect.bottom
    )) {
      onClose?.();
    }
  };

  return (
    <dialog
      ref={dialogRef}
      className={`modal modal--${size}`}
      onClick={handleClick}
      aria-labelledby={title ? 'modal-title' : undefined}
    >
      <div className="modal__content">
        {title && (
          <div className="modal__header">
            <h2 id="modal-title" className="modal__title">{title}</h2>
            <button className="modal__close" onClick={onClose} aria-label="Close dialog">×</button>
          </div>
        )}
        <div className="modal__body">{children}</div>
      </div>
    </dialog>
  );
}
