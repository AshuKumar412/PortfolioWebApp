import { useState } from 'react';
import { useCrud } from '../../hooks/useCrud';
import { certificationsService } from '../../services/certificationsService';
import { storageService } from '../../services/storageService';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import { ConfirmDialog } from '../../components/ui/ConfirmDialog';
import { FileUpload } from '../../components/ui/FileUpload';
import { Spinner } from '../../components/ui/Spinner';
import { toast } from '../../components/ui/Toast';
import { formatDate } from '../../utils/formatters';
import '../admin.css';

const EMPTY = { name: '', issuer: '', issue_date: '', expiry_date: '', credential_url: '', image_url: '', display_order: 0, is_published: true };

export function AdminCertifications() {
  const { items, loading, create, update, remove } = useCrud(certificationsService);
  const [modalOpen, setModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(null);
  const [uploading, setUploading] = useState(false);

  const fc = (f) => (e) => {
    const val = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setForm(prev => ({ ...prev, [f]: val }));
  };

  const openAdd = () => { setEditing(null); setForm(EMPTY); setModal(true); };
  const openEdit = (item) => { setEditing(item); setForm(item); setModal(true); };

  const handleImgUpload = async (file) => {
    setUploading(true);
    try {
      const url = await storageService.uploadCertification(file, editing?.id || 'new');
      setForm(f => ({ ...f, image_url: url }));
      toast.success('Image uploaded');
    } catch (e) { toast.error(e.message); }
    finally { setUploading(false); }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editing) await update(editing.id, form);
      else await create(form);
      toast.success(editing ? 'Updated' : 'Added');
      setModal(false);
    } catch (err) { toast.error(err.message); }
    finally { setSaving(false); }
  };

  const handleDelete = async () => {
    try { await remove(deleting.id); toast.success('Deleted'); setDeleting(null); }
    catch (err) { toast.error(err.message); }
  };

  return (
    <div>
      <div className="admin-page-header">
        <div><h1 className="admin-page-title">Certifications</h1><p className="admin-page-subtitle">{items.length} certs</p></div>
        <Button onClick={openAdd}>+ Add Certification</Button>
      </div>

      <div className="admin-table-wrap">
        {loading ? <div style={{ padding: '3rem', display: 'flex', justifyContent: 'center' }}><Spinner /></div>
        : items.length === 0 ? (
          <div className="admin-empty">
            <div className="admin-empty__icon">🏅</div>
            <h3>No certifications yet</h3>
            <p>Add your professional certifications.</p>
            <Button onClick={openAdd}>+ Add Certification</Button>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className="admin-table">
              <thead><tr><th>Name</th><th>Issuer</th><th>Issued</th><th>Status</th><th><span className="sr-only">Actions</span></th></tr></thead>
              <tbody>
                {items.map(item => (
                  <tr key={item.id}>
                    <td style={{ fontWeight: 'var(--weight-semibold)', color: 'var(--color-text-primary)' }}>
                      {item.image_url && <img src={item.image_url} alt="" width="28" height="28" style={{ borderRadius: 4, objectFit: 'contain', marginRight: 8, verticalAlign: 'middle' }} loading="lazy" />}
                      {item.name}
                    </td>
                    <td>{item.issuer}</td>
                    <td style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)' }}>{formatDate(item.issue_date) || '—'}</td>
                    <td>{item.is_published ? <Badge variant="success">Published</Badge> : <Badge variant="warning">Draft</Badge>}</td>
                    <td><div className="admin-table__actions">
                      <button className="admin-icon-btn" onClick={() => openEdit(item)} title="Edit">✏️</button>
                      <button className="admin-icon-btn admin-icon-btn--danger" onClick={() => setDeleting(item)} title="Delete">🗑</button>
                    </div></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Modal isOpen={modalOpen} onClose={() => setModal(false)} title={editing ? 'Edit Certification' : 'Add Certification'} size="md">
        <form className="admin-form" onSubmit={handleSave}>
          <div className="form-group">
            <label className="form-label">Certification Name *</label>
            <input className="form-input" value={form.name} onChange={fc('name')} required placeholder="AWS Solutions Architect" />
          </div>
          <div className="form-group">
            <label className="form-label">Issuing Organization *</label>
            <input className="form-input" value={form.issuer} onChange={fc('issuer')} required placeholder="Amazon Web Services" />
          </div>
          <div className="admin-form-row">
            <div className="form-group">
              <label className="form-label">Issue Date</label>
              <input className="form-input" type="date" value={form.issue_date} onChange={fc('issue_date')} />
            </div>
            <div className="form-group">
              <label className="form-label">Expiry Date</label>
              <input className="form-input" type="date" value={form.expiry_date} onChange={fc('expiry_date')} />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Credential URL</label>
            <input className="form-input" type="url" value={form.credential_url} onChange={fc('credential_url')} placeholder="https://…" />
          </div>
          <div className="form-group">
            <label className="form-label">Certificate Image</label>
            <FileUpload onFile={handleImgUpload} accept="image/jpeg,image/png,image/webp"
              label="Upload certificate image" hint="JPG, PNG, WebP · max 5MB"
              preview={form.image_url} loading={uploading} />
          </div>
          <div className="admin-toggle-row">
            <label className="admin-toggle"><input type="checkbox" checked={form.is_published} onChange={fc('is_published')} /><span className="admin-toggle__slider" /></label>
            <span className="admin-toggle-label">Published</span>
          </div>
          <div className="admin-form-actions">
            <Button variant="ghost" type="button" onClick={() => setModal(false)}>Cancel</Button>
            <Button type="submit" loading={saving}>{editing ? 'Save' : 'Add'}</Button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog isOpen={!!deleting} onClose={() => setDeleting(null)} onConfirm={handleDelete}
        title="Delete Certification?" message={`"${deleting?.name}" will be removed.`} />
    </div>
  );
}
