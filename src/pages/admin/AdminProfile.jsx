import { useEffect, useState } from 'react';
import { profileService } from '../../services/profileService';
import { storageService } from '../../services/storageService';
import { Button } from '../../components/ui/Button';
import { FileUpload } from '../../components/ui/FileUpload';
import { Spinner } from '../../components/ui/Spinner';
import { toast } from '../../components/ui/Toast';
import '../admin.css';

const EMPTY = {
  name: '', title: '', tagline: '', bio: '', bio_extended: '',
  email: '', location: '', github_url: '', linkedin_url: '',
  avatar_url: '', resume_url: '',
  years_experience: '', projects_count: '', clients_count: '',
  is_available: true,
};

export function AdminProfile() {
  const [form, setForm] = useState(EMPTY);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [uploadingResume, setUploadingResume] = useState(false);

  useEffect(() => {
    profileService.get().then(data => {
      if (data) setForm(prev => ({ ...prev, ...data }));
    }).catch(console.error).finally(() => setLoading(false));
  }, []);

  const fc = (f) => (e) => {
    const val = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setForm(prev => ({ ...prev, [f]: val }));
  };

  const handleAvatarUpload = async (file) => {
    setUploadingAvatar(true);
    try {
      const url = await storageService.uploadAvatar(file);
      setForm(f => ({ ...f, avatar_url: url }));
      toast.success('Profile photo uploaded');
    } catch (e) { toast.error(e.message); }
    finally { setUploadingAvatar(false); }
  };

  const handleResumeUpload = async (file) => {
    setUploadingResume(true);
    try {
      const url = await storageService.uploadResume(file);
      setForm(f => ({ ...f, resume_url: url }));
      toast.success('Resume uploaded');
    } catch (e) { toast.error(e.message); }
    finally { setUploadingResume(false); }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const saved = await profileService.upsert(form);
      if (saved) setForm(prev => ({ ...prev, ...saved }));
      toast.success('Profile saved! Changes are live on your portfolio.');
    } catch (err) { toast.error(err.message); }
    finally { setSaving(false); }
  };

  if (loading) return <div style={{ padding: '4rem', display: 'flex', justifyContent: 'center' }}><Spinner size="lg" /></div>;

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Profile</h1>
          <p className="admin-page-subtitle">Your personal information shown on the portfolio.</p>
        </div>
        <Button form="profile-form" type="submit" loading={saving}>Save Changes</Button>
      </div>

      <form id="profile-form" className="admin-form" onSubmit={handleSave}>
        <div style={{ background: 'var(--color-bg-card)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-xl)', padding: 'var(--space-6)', marginBottom: 'var(--space-6)' }}>
          <h2 style={{ fontSize: 'var(--text-lg)', fontWeight: 'var(--weight-semibold)', marginBottom: 'var(--space-5)', color: 'var(--color-text-primary)' }}>Basic Information</h2>
          <div className="admin-form-row">
            <div className="form-group">
              <label className="form-label">Full Name *</label>
              <input className="form-input" value={form.name} onChange={fc('name')} required placeholder="Alex Johnson" />
            </div>
            <div className="form-group">
              <label className="form-label">Title / Role</label>
              <input className="form-input" value={form.title} onChange={fc('title')} placeholder="Full-Stack Developer" />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Tagline</label>
            <input className="form-input" value={form.tagline} onChange={fc('tagline')} placeholder="Building elegant solutions to complex problems" />
          </div>
          <div className="form-group">
            <label className="form-label">Short Bio (shown in Hero)</label>
            <textarea className="form-input form-textarea" value={form.bio} onChange={fc('bio')} rows={3} placeholder="2-3 sentence introduction about yourself…" />
          </div>
          <div className="form-group">
            <label className="form-label">Extended Bio (shown in About section)</label>
            <textarea className="form-input form-textarea" value={form.bio_extended} onChange={fc('bio_extended')} rows={4} placeholder="More detailed about section content…" />
          </div>
          <div className="admin-form-row">
            <div className="form-group">
              <label className="form-label">Email</label>
              <input className="form-input" type="email" value={form.email} onChange={fc('email')} placeholder="hello@example.com" />
            </div>
            <div className="form-group">
              <label className="form-label">Location</label>
              <input className="form-input" value={form.location} onChange={fc('location')} placeholder="New York, NY" />
            </div>
          </div>
          <div className="admin-form-row">
            <div className="form-group">
              <label className="form-label">GitHub URL</label>
              <input className="form-input" type="url" value={form.github_url} onChange={fc('github_url')} placeholder="https://github.com/username" />
            </div>
            <div className="form-group">
              <label className="form-label">LinkedIn URL</label>
              <input className="form-input" type="url" value={form.linkedin_url} onChange={fc('linkedin_url')} placeholder="https://linkedin.com/in/username" />
            </div>
          </div>
        </div>

        <div style={{ background: 'var(--color-bg-card)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-xl)', padding: 'var(--space-6)', marginBottom: 'var(--space-6)' }}>
          <h2 style={{ fontSize: 'var(--text-lg)', fontWeight: 'var(--weight-semibold)', marginBottom: 'var(--space-5)', color: 'var(--color-text-primary)' }}>Stats (shown in About section)</h2>
          <div className="admin-form-row">
            <div className="form-group">
              <label className="form-label">Years of Experience</label>
              <input className="form-input" type="number" min="0" value={form.years_experience} onChange={fc('years_experience')} placeholder="3" />
            </div>
            <div className="form-group">
              <label className="form-label">Projects Built</label>
              <input className="form-input" type="number" min="0" value={form.projects_count} onChange={fc('projects_count')} placeholder="20" />
            </div>
            <div className="form-group">
              <label className="form-label">Happy Clients</label>
              <input className="form-input" type="number" min="0" value={form.clients_count} onChange={fc('clients_count')} placeholder="10" />
            </div>
          </div>
          <div className="admin-toggle-row" style={{ marginTop: 'var(--space-4)' }}>
            <label className="admin-toggle"><input type="checkbox" checked={form.is_available} onChange={fc('is_available')} /><span className="admin-toggle__slider" /></label>
            <span className="admin-toggle-label">Available for opportunities (shows green badge in Hero)</span>
          </div>
        </div>

        <div style={{ background: 'var(--color-bg-card)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-xl)', padding: 'var(--space-6)' }}>
          <h2 style={{ fontSize: 'var(--text-lg)', fontWeight: 'var(--weight-semibold)', marginBottom: 'var(--space-5)', color: 'var(--color-text-primary)' }}>Files</h2>
          <div className="admin-form-row">
            <div className="form-group">
              <label className="form-label">Profile Photo</label>
              <FileUpload onFile={handleAvatarUpload} accept="image/jpeg,image/png,image/webp"
                label="Upload profile photo" hint="JPG, PNG, WebP · max 5MB · square preferred"
                preview={form.avatar_url} loading={uploadingAvatar} />
              {form.avatar_url && (
                <button
                  type="button"
                  onClick={() => { setForm(f => ({ ...f, avatar_url: '' })); toast.info('Profile photo removed. Save to apply.'); }}
                  style={{ color: 'var(--color-danger)', fontSize: 'var(--text-xs)', marginTop: '0.5rem', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', padding: 0 }}
                >
                  ✕ Remove photo
                </button>
              )}
            </div>
            <div className="form-group">
              <label className="form-label">Resume (PDF)</label>
              <FileUpload onFile={handleResumeUpload} accept="application/pdf"
                label="Upload resume PDF" hint="PDF · max 5MB"
                loading={uploadingResume} />
              {form.resume_url && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)', marginTop: '0.5rem' }}>
                  <a href={form.resume_url} target="_blank" rel="noopener noreferrer"
                    style={{ fontSize: 'var(--text-sm)', color: 'var(--color-accent)', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                    ↗ View / Download resume
                  </a>
                  <button
                    type="button"
                    onClick={() => { setForm(f => ({ ...f, resume_url: '' })); toast.info('Resume removed. Save to apply.'); }}
                    style={{ color: 'var(--color-danger)', fontSize: 'var(--text-xs)', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                  >
                    ✕ Remove
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 'var(--space-4)' }}>
          <Button type="submit" size="lg" loading={saving}>Save All Changes</Button>
        </div>
      </form>
    </div>
  );
}
