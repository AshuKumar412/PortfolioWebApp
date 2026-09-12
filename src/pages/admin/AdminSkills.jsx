import { useState } from 'react';
import { useCrud } from '../../hooks/useCrud';
import { skillsService } from '../../services/skillsService';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import { ConfirmDialog } from '../../components/ui/ConfirmDialog';
import { Spinner } from '../../components/ui/Spinner';
import { toast } from '../../components/ui/Toast';
import '../admin.css';

const CATEGORIES = ['Programming Languages','Frontend','Backend','Database','DevOps','Tools','Other'];
const EMPTY = { name: '', category: 'Frontend', icon_name: '', proficiency: 80, display_order: 0, is_published: true };

export function AdminSkills() {
  const { items, loading, create, update, remove } = useCrud(skillsService);
  const [search, setSearch] = useState('');
  const [modalOpen, setModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(null);

  const filtered = items.filter(s => s.name?.toLowerCase().includes(search.toLowerCase()));
  const fc = (field) => (e) => {
    const val = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setForm(f => ({ ...f, [field]: val }));
  };

  const openAdd  = () => { setEditing(null); setForm(EMPTY); setModal(true); };
  const openEdit = (s) => { setEditing(s); setForm(s); setModal(true); };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editing) await update(editing.id, form);
      else         await create(form);
      toast.success(editing ? 'Skill updated' : 'Skill added');
      setModal(false);
    } catch (err) { toast.error(err.message); }
    finally { setSaving(false); }
  };

  const handleDelete = async () => {
    try { await remove(deleting.id); toast.success('Skill deleted'); setDeleting(null); }
    catch (err) { toast.error(err.message); }
  };

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Skills</h1>
          <p className="admin-page-subtitle">{items.length} skills</p>
        </div>
        <Button onClick={openAdd}>+ Add Skill</Button>
      </div>

      <div className="admin-table-wrap">
        <div className="admin-table-toolbar">
          <div className="admin-search">
            <span aria-hidden="true">🔍</span>
            <input type="search" placeholder="Search skills…" value={search} onChange={e => setSearch(e.target.value)} aria-label="Search skills" />
          </div>
        </div>

        {loading ? (
          <div style={{ padding: '3rem', display: 'flex', justifyContent: 'center' }}><Spinner /></div>
        ) : filtered.length === 0 ? (
          <div className="admin-empty">
            <div className="admin-empty__icon">💻</div>
            <h3>No skills yet</h3>
            <p>Add your first skill to show recruiters what you know.</p>
            <Button onClick={openAdd}>+ Add Skill</Button>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className="admin-table" aria-label="Skills table">
              <thead><tr><th>Name</th><th>Category</th><th>Icon</th><th>Status</th><th>Order</th><th><span className="sr-only">Actions</span></th></tr></thead>
              <tbody>
                {filtered.map(s => (
                  <tr key={s.id}>
                    <td style={{ fontWeight: 'var(--weight-semibold)', color: 'var(--color-text-primary)' }}>{s.name}</td>
                    <td><Badge>{s.category}</Badge></td>
                    <td>{s.icon_name || '—'}</td>
                    <td>{s.is_published ? <Badge variant="success">Published</Badge> : <Badge variant="warning">Draft</Badge>}</td>
                    <td>{s.display_order ?? 0}</td>
                    <td><div className="admin-table__actions">
                      <button className="admin-icon-btn" onClick={() => openEdit(s)} title="Edit">✏️</button>
                      <button className="admin-icon-btn admin-icon-btn--danger" onClick={() => setDeleting(s)} title="Delete">🗑</button>
                    </div></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Modal isOpen={modalOpen} onClose={() => setModal(false)} title={editing ? 'Edit Skill' : 'Add Skill'}>
        <form className="admin-form" onSubmit={handleSave}>
          <div className="admin-form-row">
            <div className="form-group">
              <label className="form-label">Name *</label>
              <input className="form-input" value={form.name} onChange={fc('name')} required placeholder="React" />
            </div>
            <div className="form-group">
              <label className="form-label">Category</label>
<input className="form-input" value={form.category} onChange={fc('category')} placeholder="Enter category" />

              </select>
            </div>
          </div>
          <div className="admin-form-row">
            <div className="form-group">
              <label className="form-label">Icon (emoji or text)</label>
              <input className="form-input" value={form.icon_name} onChange={fc('icon_name')} placeholder="⚛️" />
            </div>
            <div className="form-group">
              <label className="form-label">Display Order</label>
              <input className="form-input" type="number" min="0" value={form.display_order} onChange={fc('display_order')} />
            </div>
          </div>
          <div className="admin-toggle-row">
            <label className="admin-toggle">
              <input type="checkbox" checked={form.is_published} onChange={fc('is_published')} />
              <span className="admin-toggle__slider" />
            </label>
            <span className="admin-toggle-label">Published</span>
          </div>
          <div className="admin-form-actions">
            <Button variant="ghost" type="button" onClick={() => setModal(false)}>Cancel</Button>
            <Button type="submit" loading={saving}>{editing ? 'Save' : 'Add Skill'}</Button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog isOpen={!!deleting} onClose={() => setDeleting(null)} onConfirm={handleDelete}
        title="Delete Skill?" message={`"${deleting?.name}" will be removed.`} />
    </div>
  );
}
