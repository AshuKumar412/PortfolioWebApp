import { useState } from 'react';
import { useCrud } from '../../hooks/useCrud';
import { projectsService } from '../../services/projectsService';
import { storageService } from '../../services/storageService';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import { ConfirmDialog } from '../../components/ui/ConfirmDialog';
import { FileUpload } from '../../components/ui/FileUpload';
import { Spinner } from '../../components/ui/Spinner';
import { toast } from '../../components/ui/Toast';
import '../admin.css';

const EMPTY_FORM = {
  title: '', description: '', problem: '', features: '',
  tech_stack: '', category: '', github_url: '', demo_url: '',
  image_url: '', is_featured: false, is_published: true, display_order: 0,
};

export function AdminProjects() {
  const { items, loading, create, update, remove } = useCrud(projectsService);
  const [search,   setSearch]   = useState('');
  const [modalOpen, setModal]   = useState(false);
  const [editing,  setEditing]  = useState(null);
  const [form,     setForm]     = useState(EMPTY_FORM);
  const [saving,   setSaving]   = useState(false);
  const [deleting, setDeleting] = useState(null);
  const [uploadingImg, setUploadingImg] = useState(false);

  const filtered = items.filter(p =>
    p.title?.toLowerCase().includes(search.toLowerCase()) ||
    p.category?.toLowerCase().includes(search.toLowerCase())
  );

  const openAdd = () => { setEditing(null); setForm(EMPTY_FORM); setModal(true); };
  const openEdit = (p) => {
    setEditing(p);
    setForm({
      ...p,
      features:  Array.isArray(p.features)  ? p.features.join('\n')  : (p.features || ''),
      tech_stack: Array.isArray(p.tech_stack) ? p.tech_stack.join(', ') : (p.tech_stack || ''),
    });
    setModal(true);
  };

  const handleImgUpload = async (file) => {
    setUploadingImg(true);
    try {
      const url = await storageService.uploadProjectImage(file, editing?.id || 'new');
      setForm(f => ({ ...f, image_url: url }));
      toast.success('Image uploaded');
    } catch (e) { toast.error(e.message); }
    finally { setUploadingImg(false); }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        ...form,
        features:   form.features  ? form.features.split('\n').map(s => s.trim()).filter(Boolean) : [],
        tech_stack: form.tech_stack ? form.tech_stack.split(',').map(s => s.trim()).filter(Boolean) : [],
      };
      if (editing) await update(editing.id, payload);
      else         await create(payload);
      toast.success(editing ? 'Project updated' : 'Project created');
      setModal(false);
    } catch (e) { toast.error(e.message); }
    finally { setSaving(false); }
  };

  const handleDelete = async () => {
    try {
      await remove(deleting.id);
      toast.success('Project deleted');
      setDeleting(null);
    } catch (e) { toast.error(e.message); }
  };

  const fc = (field) => (e) => {
    const val = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setForm(f => ({ ...f, [field]: val }));
  };

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Projects</h1>
          <p className="admin-page-subtitle">{items.length} total project{items.length !== 1 ? 's' : ''}</p>
        </div>
        <Button onClick={openAdd}>+ Add Project</Button>
      </div>

      <div className="admin-table-wrap">
        <div className="admin-table-toolbar">
          <div className="admin-search">
            <span aria-hidden="true">🔍</span>
            <input
              type="search"
              placeholder="Search projects…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              aria-label="Search projects"
            />
          </div>
        </div>

        {loading ? (
          <div style={{ padding: '3rem', display: 'flex', justifyContent: 'center' }}><Spinner /></div>
        ) : filtered.length === 0 ? (
          <div className="admin-empty">
            <div className="admin-empty__icon">🚀</div>
            <h3>No projects yet</h3>
            <p>Add your first project to get started.</p>
            <Button onClick={openAdd}>+ Add Project</Button>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className="admin-table" aria-label="Projects table">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Category</th>
                  <th>Featured</th>
                  <th>Status</th>
                  <th>Order</th>
                  <th><span className="sr-only">Actions</span></th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(p => (
                  <tr key={p.id}>
                    <td style={{ fontWeight: 'var(--weight-semibold)', color: 'var(--color-text-primary)' }}>
                      {p.image_url && <img src={p.image_url} alt="" width="32" height="32" style={{ borderRadius: 6, objectFit: 'cover', marginRight: 8, verticalAlign: 'middle' }} loading="lazy" />}
                      {p.title}
                    </td>
                    <td>{p.category || '—'}</td>
                    <td>{p.is_featured ? <Badge variant="accent">Featured</Badge> : <Badge>No</Badge>}</td>
                    <td>{p.is_published ? <Badge variant="success">Published</Badge> : <Badge variant="warning">Draft</Badge>}</td>
                    <td>{p.display_order ?? 0}</td>
                    <td>
                      <div className="admin-table__actions">
                        <button className="admin-icon-btn" onClick={() => openEdit(p)} aria-label={`Edit ${p.title}`} title="Edit">✏️</button>
                        <button className="admin-icon-btn admin-icon-btn--danger" onClick={() => setDeleting(p)} aria-label={`Delete ${p.title}`} title="Delete">🗑</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      <Modal isOpen={modalOpen} onClose={() => setModal(false)} title={editing ? 'Edit Project' : 'Add Project'} size="lg">
        <form className="admin-form" onSubmit={handleSave}>
          <div className="admin-form-row">
            <div className="form-group">
              <label className="form-label" htmlFor="p-title">Title *</label>
              <input id="p-title" className="form-input" value={form.title} onChange={fc('title')} required placeholder="My Awesome Project" />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="p-category">Category</label>
              <input id="p-category" className="form-input" value={form.category} onChange={fc('category')} placeholder="Web App, Mobile, etc." />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="p-desc">Description *</label>
            <textarea id="p-desc" className="form-input form-textarea" value={form.description} onChange={fc('description')} required placeholder="A short 1-2 line description…" rows={3} />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="p-problem">Problem Solved</label>
            <textarea id="p-problem" className="form-input form-textarea" value={form.problem} onChange={fc('problem')} placeholder="What problem does this project solve?" rows={2} />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="p-features">Key Features (one per line)</label>
            <textarea id="p-features" className="form-input form-textarea" value={form.features} onChange={fc('features')} placeholder="User authentication&#10;Real-time updates&#10;Responsive design" rows={4} />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="p-tech">Technologies (comma-separated)</label>
            <input id="p-tech" className="form-input" value={form.tech_stack} onChange={fc('tech_stack')} placeholder="React, Node.js, PostgreSQL" />
          </div>
          <div className="admin-form-row">
            <div className="form-group">
              <label className="form-label" htmlFor="p-github">GitHub URL</label>
              <input id="p-github" className="form-input" value={form.github_url} onChange={fc('github_url')} type="url" placeholder="https://github.com/…" />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="p-demo">Live Demo URL</label>
              <input id="p-demo" className="form-input" value={form.demo_url} onChange={fc('demo_url')} type="url" placeholder="https://myproject.com" />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Project Image</label>
            <FileUpload
              onFile={handleImgUpload}
              accept="image/jpeg,image/png,image/webp"
              label="Upload project screenshot"
              hint="JPG, PNG, or WebP · max 5MB"
              preview={form.image_url}
              loading={uploadingImg}
            />
            {form.image_url && !uploadingImg && (
              <input className="form-input" style={{ marginTop: 8 }} value={form.image_url} onChange={fc('image_url')} placeholder="Or paste image URL" />
            )}
          </div>
          <div className="admin-form-row">
            <div className="form-group">
              <label className="form-label" htmlFor="p-order">Display Order</label>
              <input id="p-order" className="form-input" type="number" min="0" value={form.display_order} onChange={fc('display_order')} />
            </div>
          </div>
          <div className="admin-toggle-row">
            <label className="admin-toggle">
              <input type="checkbox" checked={form.is_featured} onChange={fc('is_featured')} />
              <span className="admin-toggle__slider" />
            </label>
            <span className="admin-toggle-label">Featured project</span>
          </div>
          <div className="admin-toggle-row">
            <label className="admin-toggle">
              <input type="checkbox" checked={form.is_published} onChange={fc('is_published')} />
              <span className="admin-toggle__slider" />
            </label>
            <span className="admin-toggle-label">Published (visible on portfolio)</span>
          </div>
          <div className="admin-form-actions">
            <Button variant="ghost" type="button" onClick={() => setModal(false)}>Cancel</Button>
            <Button type="submit" loading={saving}>{editing ? 'Save Changes' : 'Create Project'}</Button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={!!deleting}
        onClose={() => setDeleting(null)}
        onConfirm={handleDelete}
        title="Delete Project?"
        message={`"${deleting?.title}" will be permanently removed from your portfolio.`}
      />
    </div>
  );
}
