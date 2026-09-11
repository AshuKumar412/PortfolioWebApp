import { Modal } from './Modal';
import { Button } from './Button';
import './ConfirmDialog.css';

export function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title = 'Are you sure?',
  message,
  confirmLabel = 'Delete',
  loading = false,
}) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="sm">
      <div className="confirm-dialog">
        <div className="confirm-dialog__icon" aria-hidden="true">⚠</div>
        <h3 className="confirm-dialog__title">{title}</h3>
        {message && <p className="confirm-dialog__message">{message}</p>}
        <div className="confirm-dialog__actions">
          <Button variant="ghost" onClick={onClose} disabled={loading}>Cancel</Button>
          <Button variant="danger" onClick={onConfirm} loading={loading}>{confirmLabel}</Button>
        </div>
      </div>
    </Modal>
  );
}
