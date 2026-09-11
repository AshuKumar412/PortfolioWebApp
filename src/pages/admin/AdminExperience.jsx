import { useState } from 'react';
import { useCrud } from '../../hooks/useCrud';
import { experienceService } from '../../services/experienceService';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import { ConfirmDialog } from '../../components/ui/ConfirmDialog';
import { Spinner } from '../../components/ui/Spinner';
import { toast } from '../../components/ui/Toast';
import { formatDateRange } from '../../utils/formatters';
import '../admin.css';

const EMPTY = {
  company: '', role: '', start_date: '', end_date: '', location: '',
  description: '', achievements: '', is_current: false,
  display_order: 0, is_published: true,
};

export function AdminExperience() {
  const { items, loading, create, update, remove } = useCrud(experienceService);
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
  const openEdit = (item) => {
    setEditing(item);
    setForm({
      ...item,
      achievements: Array.isArray(item.achievements) ? item.achievements.join('\n') : (item.achievements || ''),
    });
    setModal(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        ...form,
        achievements: form.achievements
          ? form.achievements.split('\n').map(s => s.trim()).filter(Boolean)
          : [],
      };
      if (editing) await update(editing.id, payload);
      else await create(payload);
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
        <div>
          <h1 className="admin-page-title">Work Experience</h1>
          <p className="admin-page-subtitle">{items.length} entries</p>
        </div>
        <Button onClick={openAdd}>+ Add Experience</Button>
      </div>

      <div className="admin-table-wrap">
        {loading ? (
          <div style={{ padding: '3rem', display: 'flex', justifyContent: 'center' }}><Spinner /></div>
        ) : items.length === 0 ? (
          <div className="admin-empty">
            <div className="admin-empty__icon">💼</div>
            <h3>No experience entries</h3>
            <p>Add your work history.</p>
            <Button onClick={openAdd}>+ Add Experience</Button>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className="admin-table" aria-label="Experience table">
              <thead><tr><th>Company</th><th>Role</th><th>Period</th><th>Current</th><th>Status</th><th><span className="sr-only">Actions</span></th></tr></thead>
              <tbody>
                {items.map(item => (
                  <tr key={item.id}>
                    <td style={{ fontWeight: 'var(--weight-semibold)', color: 'var(--color-text-primary)' }}>{item.company}</td>
                    <td>{item.role}</td>
                    <td style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)' }}>
                      {formatDateRange(item.start_date, item.end_date, item.is_current)}
                    </td>
                    <td>{item.is_current ? <Badge variant="success">Current</Badge> : '—'}</td>
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

      <Modal isOpen={modalOpen} onClose={() => setModal(false)} title={editing ? 'Edit Experience' : 'Add Experience'} size="lg">
        <form className="admin-form" onSubmit={handleSave}>
          <div className="admin-form-row">
            <div className="form-group">
              <label className="form-label">Company *</label>
              <input className="form-input" value={form.company} onChange={fc('company')} required placeholder="Acme Corp" />
            </div>
            <div className="form-group">
              <label className="form-label">Role *</label>
              <input className="form-input" value={form.role} onChange={fc('role')} required placeholder="Senior Developer" />
            </div>
          </div>
          <div className="admin-form-row">
            <div className="form-group">
              <label className="form-label">Start Date</label>
              <input className="form-input" type="date" value={form.start_date} onChange={fc('start_date')} />
            </div>
            <div className="form-group">
              <label className="form-label">End Date</label>
              <input className="form-input" type="date" value={form.end_date} onChange={fc('end_date')} disabled={form.is_current} />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Location</label>
            <input className="form-input" value={form.location} onChange={fc('location')} placeholder="Remote / New York, NY" />
          </div>
          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea className="form-input form-textarea" value={form.description} onChange={fc('description')} rows={3} placeholder="What did you do in this role?" />
          </div>
          <div className="form-group">
            <label className="form-label">Key Achievements (one per line)</label>
            <textarea className="form-input form-textarea" value={form.achievements} onChange={fc('achievements')} rows={4} placeholder="Reduced load time by 40%&#10;Led a team of 5 engineers" />
          </div>
          <div className="admin-form-row">
            <div className="admin-toggle-row">
              <label className="admin-toggle"><input type="checkbox" checked={form.is_current} onChange={fc('is_current')} /><span className="admin-toggle__slider" /></label>
              <span className="admin-toggle-label">Currently working here</span>
            </div>
            <div className="admin-toggle-row">
              <label className="admin-toggle"><input type="checkbox" checked={form.is_published} onChange={fc('is_published')} /><span className="admin-toggle__slider" /></label>
              <span className="admin-toggle-label">Published</span>
            </div>
          </div>
          <div className="admin-form-actions">
            <Button variant="ghost" type="button" onClick={() => setModal(false)}>Cancel</Button>
            <Button type="submit" loading={saving}>{editing ? 'Save' : 'Add'}</Button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog isOpen={!!deleting} onClose={() => setDeleting(null)} onConfirm={handleDelete}
        title="Delete Entry?" message={`"${deleting?.role} at ${deleting?.company}" will be removed.`} />
    </div>
  );
}
