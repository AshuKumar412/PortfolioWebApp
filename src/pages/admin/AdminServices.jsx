import { useState } from 'react';
import { useCrud } from '../../hooks/useCrud';
import { servicesService } from '../../services/servicesService';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import { ConfirmDialog } from '../../components/ui/ConfirmDialog';
import { Spinner } from '../../components/ui/Spinner';
import { toast } from '../../components/ui/Toast';
import '../admin.css';

const EMPTY = { title: '', description: '', icon: '⚡', display_order: 0, is_published: true };

export function AdminServices() {
  const { items, loading, create, update, remove } = useCrud(servicesService);
  const [modalOpen, setModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(null);

  const fc = (f) => (e) => {
    const val = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setForm(prev => ({ ...prev, [f]: val }));
  };
  const openAdd = () => { setEditing(null); setForm(EMPTY); setModal(true); };
  const openEdit = (item) => { setEditing(item); setForm(item); setModal(true); };

  const handleSave = async (e) => {
    e.preventDefault(); setSaving(true);
    try {
      if (editing) await update(editing.id, form); else await create(form);
      toast.success(editing ? 'Updated' : 'Added'); setModal(false);
    } catch (err) { toast.error(err.message); } finally { setSaving(false); }
  };
  const handleDelete = async () => {
    try { await remove(deleting.id); toast.success('Deleted'); setDeleting(null); }
    catch (err) { toast.error(err.message); }
  };

  return (
    <div>
      <div className="admin-page-header">
        <div><h1 className="admin-page-title">Services</h1><p className="admin-page-subtitle">{items.length} services</p></div>
        <Button onClick={openAdd}>+ Add Service</Button>
      </div>
      <div className="admin-table-wrap">
        {loading ? <div style={{ padding: '3rem', display: 'flex', justifyContent: 'center' }}><Spinner /></div>
        : items.length === 0 ? (
          <div className="admin-empty">
            <div className="admin-empty__icon">⚡</div>
            <h3>No services yet</h3>
            <p>Add services you offer to clients.</p>
            <Button onClick={openAdd}>+ Add Service</Button>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className="admin-table">
              <thead><tr><th>Icon</th><th>Title</th><th>Description</th><th>Status</th><th><span className="sr-only">Actions</span></th></tr></thead>
              <tbody>
                {items.map(item => (
                  <tr key={item.id}>
                    <td style={{ fontSize: '1.3rem' }}>{item.icon || '⚡'}</td>
                    <td style={{ fontWeight: 'var(--weight-semibold)', color: 'var(--color-text-primary)' }}>{item.title}</td>
                    <td style={{ maxWidth: 300, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.description}</td>
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
      <Modal isOpen={modalOpen} onClose={() => setModal(false)} title={editing ? 'Edit Service' : 'Add Service'}>
        <form className="admin-form" onSubmit={handleSave}>
          <div className="admin-form-row">
            <div className="form-group">
              <label className="form-label">Title *</label>
              <input className="form-input" value={form.title} onChange={fc('title')} required placeholder="Web Development" />
            </div>
            <div className="form-group">
              <label className="form-label">Icon (emoji)</label>
              <input className="form-input" value={form.icon} onChange={fc('icon')} placeholder="⚡" />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Description *</label>
            <textarea className="form-input form-textarea" value={form.description} onChange={fc('description')} required rows={3} placeholder="Describe the service you offer…" />
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
        title="Delete Service?" message={`"${deleting?.title}" will be removed.`} />
    </div>
  );
}
