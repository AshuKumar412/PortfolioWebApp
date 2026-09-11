import { useState } from 'react';
import { useCrud } from '../../hooks/useCrud';
import { achievementsService } from '../../services/achievementsService';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import { ConfirmDialog } from '../../components/ui/ConfirmDialog';
import { Spinner } from '../../components/ui/Spinner';
import { toast } from '../../components/ui/Toast';
import '../admin.css';

const EMPTY = { title: '', description: '', date: '', icon: '🏆', display_order: 0, is_published: true };

export function AdminAchievements() {
  const { items, loading, create, update, remove } = useCrud(achievementsService);
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
        <div><h1 className="admin-page-title">Achievements</h1><p className="admin-page-subtitle">{items.length} entries</p></div>
        <Button onClick={openAdd}>+ Add Achievement</Button>
      </div>
      <div className="admin-table-wrap">
        {loading ? <div style={{ padding: '3rem', display: 'flex', justifyContent: 'center' }}><Spinner /></div>
        : items.length === 0 ? (
          <div className="admin-empty">
            <div className="admin-empty__icon">🏆</div>
            <h3>No achievements yet</h3>
            <p>Showcase your milestones and awards.</p>
            <Button onClick={openAdd}>+ Add Achievement</Button>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className="admin-table">
              <thead><tr><th>Icon</th><th>Title</th><th>Date</th><th>Status</th><th><span className="sr-only">Actions</span></th></tr></thead>
              <tbody>
                {items.map(item => (
                  <tr key={item.id}>
                    <td style={{ fontSize: '1.4rem' }}>{item.icon || '🏆'}</td>
                    <td style={{ fontWeight: 'var(--weight-semibold)', color: 'var(--color-text-primary)' }}>{item.title}</td>
                    <td>{item.date || '—'}</td>
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
      <Modal isOpen={modalOpen} onClose={() => setModal(false)} title={editing ? 'Edit Achievement' : 'Add Achievement'}>
        <form className="admin-form" onSubmit={handleSave}>
          <div className="admin-form-row">
            <div className="form-group">
              <label className="form-label">Title *</label>
              <input className="form-input" value={form.title} onChange={fc('title')} required placeholder="Best Developer Award" />
            </div>
            <div className="form-group">
              <label className="form-label">Icon (emoji)</label>
              <input className="form-input" value={form.icon} onChange={fc('icon')} placeholder="🏆" />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea className="form-input form-textarea" value={form.description} onChange={fc('description')} rows={3} placeholder="Brief description of this achievement…" />
          </div>
          <div className="admin-form-row">
            <div className="form-group">
              <label className="form-label">Date</label>
              <input className="form-input" value={form.date} onChange={fc('date')} placeholder="2024" />
            </div>
            <div className="form-group">
              <label className="form-label">Display Order</label>
              <input className="form-input" type="number" min="0" value={form.display_order} onChange={fc('display_order')} />
            </div>
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
        title="Delete Achievement?" message={`"${deleting?.title}" will be removed.`} />
    </div>
  );
}
