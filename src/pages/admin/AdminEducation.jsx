import { useState } from 'react';
import { useCrud } from '../../hooks/useCrud';
import { educationService } from '../../services/educationService';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import { ConfirmDialog } from '../../components/ui/ConfirmDialog';
import { Spinner } from '../../components/ui/Spinner';
import { toast } from '../../components/ui/Toast';
import { formatDateRange } from '../../utils/formatters';
import '../admin.css';

const EMPTY = {
  institution: '', degree: '', field: '', start_date: '', end_date: '',
  location: '', description: '', achievements: '', is_current: false,
  display_order: 0, is_published: true,
};

export function AdminEducation() {
  const { items, loading, create, update, remove } = useCrud(educationService);
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
          <h1 className="admin-page-title">Education</h1>
          <p className="admin-page-subtitle">{items.length} entries</p>
        </div>
        <Button onClick={openAdd}>+ Add Education</Button>
      </div>

      <div className="admin-table-wrap">
        {loading ? (
          <div style={{ padding: '3rem', display: 'flex', justifyContent: 'center' }}><Spinner /></div>
        ) : items.length === 0 ? (
          <div className="admin-empty">
            <div className="admin-empty__icon">🎓</div>
            <h3>No education entries</h3>
            <p>Add your educational background.</p>
            <Button onClick={openAdd}>+ Add Education</Button>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className="admin-table" aria-label="Education table">
              <thead><tr><th>Institution</th><th>Degree</th><th>Period</th><th>Status</th><th><span className="sr-only">Actions</span></th></tr></thead>
              <tbody>
                {items.map(item => (
                  <tr key={item.id}>
                    <td style={{ fontWeight: 'var(--weight-semibold)', color: 'var(--color-text-primary)' }}>{item.institution}</td>
                    <td>{item.degree}{item.field ? ` — ${item.field}` : ''}</td>
                    <td style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)' }}>
                      {formatDateRange(item.start_date, item.end_date, item.is_current)}
                    </td>
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

      <Modal isOpen={modalOpen} onClose={() => setModal(false)} title={editing ? 'Edit Education' : 'Add Education'} size="lg">
        <form className="admin-form" onSubmit={handleSave}>
          <div className="admin-form-row">
            <div className="form-group">
              <label className="form-label">Institution *</label>
              <input className="form-input" value={form.institution} onChange={fc('institution')} required placeholder="MIT" />
            </div>
            <div className="form-group">
              <label className="form-label">Location</label>
              <input className="form-input" value={form.location} onChange={fc('location')} placeholder="Cambridge, MA" />
            </div>
          </div>
          <div className="admin-form-row">
            <div className="form-group">
              <label className="form-label">Degree</label>
              <input className="form-input" value={form.degree} onChange={fc('degree')} placeholder="Bachelor of Science" />
            </div>
            <div className="form-group">
              <label className="form-label">Field of Study</label>
              <input className="form-input" value={form.field} onChange={fc('field')} placeholder="Computer Science" />
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
            <label className="form-label">Description</label>
            <textarea className="form-input form-textarea" value={form.description} onChange={fc('description')} rows={3} placeholder="Brief description of your studies…" />
          </div>
          <div className="form-group">
            <label className="form-label">Achievements (one per line)</label>
            <textarea className="form-input form-textarea" value={form.achievements} onChange={fc('achievements')} rows={3} placeholder="Dean's List&#10;GPA 3.9/4.0" />
          </div>
          <div className="admin-form-row">
            <div className="admin-toggle-row">
              <label className="admin-toggle"><input type="checkbox" checked={form.is_current} onChange={fc('is_current')} /><span className="admin-toggle__slider" /></label>
              <span className="admin-toggle-label">Currently studying here</span>
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
        title="Delete Entry?" message={`"${deleting?.institution}" will be removed.`} />
    </div>
  );
}
