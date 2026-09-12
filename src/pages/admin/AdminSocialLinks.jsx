import { useState } from 'react';
import { useCrud } from '../../hooks/useCrud';
import { socialLinksService } from '../../services/socialLinksService';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import { ConfirmDialog } from '../../components/ui/ConfirmDialog';
import { Spinner } from '../../components/ui/Spinner';
import { toast } from '../../components/ui/Toast';
import '../admin.css';

const PLATFORMS = ['GitHub','LinkedIn','Twitter','Instagram','YouTube','Dev.to','Portfolio','Email','Other'];
const EMPTY = { platform: 'GitHub', url: '', display_order: 0, is_visible: true };

export function AdminSocialLinks() {
  const { items, loading, create, update, remove } = useCrud(socialLinksService);
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
        <div><h1 className="admin-page-title">Social Links</h1><p className="admin-page-subtitle">{items.length} links</p></div>
        <Button onClick={openAdd}>+ Add Link</Button>
      </div>
      <div className="admin-table-wrap">
        {loading ? <div style={{ padding: '3rem', display: 'flex', justifyContent: 'center' }}><Spinner /></div>
        : items.length === 0 ? (
          <div className="admin-empty">
            <div className="admin-empty__icon">🔗</div>
            <h3>No social links yet</h3>
            <p>Add your social profiles to display them in the Hero.</p>
            <Button onClick={openAdd}>+ Add Link</Button>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className="admin-table">
              <thead><tr><th>Platform</th><th>URL</th><th>Visible</th><th>Order</th><th><span className="sr-only">Actions</span></th></tr></thead>
              <tbody>
                {items.map(item => (
                  <tr key={item.id}>
                    <td style={{ fontWeight: 'var(--weight-semibold)', color: 'var(--color-text-primary)' }}>{item.platform}</td>
                    <td style={{ maxWidth: 260, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      <a href={item.url} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--color-accent)', fontSize: 'var(--text-sm)' }}>{item.url}</a>
                    </td>
                    <td>{item.is_visible ? <Badge variant="success">Visible</Badge> : <Badge variant="warning">Hidden</Badge>}</td>
                    <td>{item.display_order ?? 0}</td>
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
      <Modal isOpen={modalOpen} onClose={() => setModal(false)} title={editing ? 'Edit Link' : 'Add Social Link'}>
        <form className="admin-form" onSubmit={handleSave}>
          <div className="form-group">
            <label className="form-label">Platform *</label>
            <input className="form-input" value={form.platform} onChange={fc('platform')} placeholder="Enter platform..." />
              {PLATFORMS.map(p => <option key={p} value={p}>{p}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">URL *</label>
            <input className="form-input" type="url" value={form.url} onChange={fc('url')} required placeholder="https://github.com/username" />
          </div>
          <div className="admin-form-row">
            <div className="form-group">
              <label className="form-label">Display Order</label>
              <input className="form-input" type="number" min="0" value={form.display_order} onChange={fc('display_order')} />
            </div>
          </div>
          <div className="admin-toggle-row">
            <label className="admin-toggle"><input type="checkbox" checked={form.is_visible} onChange={fc('is_visible')} /><span className="admin-toggle__slider" /></label>
            <span className="admin-toggle-label">Visible in portfolio</span>
          </div>
          <div className="admin-form-actions">
            <Button variant="ghost" type="button" onClick={() => setModal(false)}>Cancel</Button>
            <Button type="submit" loading={saving}>{editing ? 'Save' : 'Add'}</Button>
          </div>
        </form>
      </Modal>
      <ConfirmDialog isOpen={!!deleting} onClose={() => setDeleting(null)} onConfirm={handleDelete}
        title="Delete Link?" message={`"${deleting?.platform}" link will be removed.`} />
    </div>
  );
}
