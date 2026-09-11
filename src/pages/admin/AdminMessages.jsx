import { useEffect, useState, useCallback } from 'react';
import { contactService } from '../../services/contactService';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { ConfirmDialog } from '../../components/ui/ConfirmDialog';
import { Modal } from '../../components/ui/Modal';
import { Spinner } from '../../components/ui/Spinner';
import { toast } from '../../components/ui/Toast';
import '../admin.css';

const PAGE_SIZE = 15;

export function AdminMessages() {
  const [messages, setMessages] = useState([]);
  const [count,    setCount]    = useState(0);
  const [page,     setPage]     = useState(1);
  const [loading,  setLoading]  = useState(true);
  const [deleting, setDeleting] = useState(null);
  const [viewing,  setViewing]  = useState(null);
  const [filter,   setFilter]   = useState('all'); // 'all' | 'unread' | 'read'

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const { data, count: total } = await contactService.getAll({ page, limit: PAGE_SIZE });
      setMessages(data);
      setCount(total || 0);
    } catch (e) { toast.error(e.message); }
    finally { setLoading(false); }
  }, [page]);

  useEffect(() => { load(); }, [load]);

  const displayed = filter === 'unread' ? messages.filter(m => !m.is_read)
    : filter === 'read' ? messages.filter(m => m.is_read)
    : messages;

  const handleView = async (msg) => {
    setViewing(msg);
    if (!msg.is_read) {
      try {
        await contactService.markRead(msg.id);
        setMessages(prev => prev.map(m => m.id === msg.id ? { ...m, is_read: true } : m));
      } catch (e) { /* ignore */ }
    }
  };

  const handleToggleRead = async (msg, e) => {
    e.stopPropagation();
    try {
      if (msg.is_read) {
        await contactService.markUnread(msg.id);
        setMessages(prev => prev.map(m => m.id === msg.id ? { ...m, is_read: false } : m));
      } else {
        await contactService.markRead(msg.id);
        setMessages(prev => prev.map(m => m.id === msg.id ? { ...m, is_read: true } : m));
      }
    } catch (e) { toast.error(e.message); }
  };

  const handleDelete = async () => {
    try {
      await contactService.delete(deleting.id);
      setMessages(prev => prev.filter(m => m.id !== deleting.id));
      setCount(c => c - 1);
      toast.success('Message deleted');
      setDeleting(null);
      if (viewing?.id === deleting.id) setViewing(null);
    } catch (e) { toast.error(e.message); }
  };

  const totalPages = Math.ceil(count / PAGE_SIZE);
  const unreadCount = messages.filter(m => !m.is_read).length;

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Contact Messages</h1>
          <p className="admin-page-subtitle">
            {count} message{count !== 1 ? 's' : ''} · {unreadCount} unread
          </p>
        </div>
        <Button variant="ghost" onClick={load}>↺ Refresh</Button>
      </div>

      {/* Filter tabs */}
      <div style={{ display: 'flex', gap: 'var(--space-2)', marginBottom: 'var(--space-5)' }}>
        {['all','unread','read'].map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            style={{
              padding: '0.4rem 1rem',
              borderRadius: 'var(--radius-full)',
              fontSize: 'var(--text-sm)',
              fontWeight: 'var(--weight-medium)',
              border: '1px solid',
              cursor: 'pointer',
              borderColor: filter === f ? 'var(--color-accent)' : 'var(--color-border)',
              background: filter === f ? 'var(--color-accent)' : 'var(--color-bg-card)',
              color: filter === f ? '#fff' : 'var(--color-text-secondary)',
              transition: 'all var(--transition-fast)',
            }}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
            {f === 'unread' && unreadCount > 0 && (
              <span style={{ marginLeft: 6, background: 'rgba(255,255,255,0.3)', borderRadius: 'var(--radius-full)', padding: '0 6px', fontSize: 'var(--text-xs)' }}>
                {unreadCount}
              </span>
            )}
          </button>
        ))}
      </div>

      <div className="admin-table-wrap">
        {loading ? (
          <div style={{ padding: '3rem', display: 'flex', justifyContent: 'center' }}><Spinner /></div>
        ) : displayed.length === 0 ? (
          <div className="admin-empty">
            <div className="admin-empty__icon">✉️</div>
            <h3>No messages</h3>
            <p>{filter !== 'all' ? `No ${filter} messages.` : 'When visitors submit the contact form, messages will appear here.'}</p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className="admin-table" aria-label="Messages table">
              <thead>
                <tr>
                  <th>Status</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Subject</th>
                  <th>Received</th>
                  <th><span className="sr-only">Actions</span></th>
                </tr>
              </thead>
              <tbody>
                {displayed.map(msg => (
                  <tr
                    key={msg.id}
                    onClick={() => handleView(msg)}
                    style={{ cursor: 'pointer', fontWeight: msg.is_read ? 'normal' : 'var(--weight-semibold)' }}
                  >
                    <td>
                      {msg.is_read
                        ? <Badge variant="default">Read</Badge>
                        : <Badge variant="info">Unread</Badge>}
                    </td>
                    <td style={{ color: 'var(--color-text-primary)' }}>{msg.name}</td>
                    <td>{msg.email}</td>
                    <td style={{ maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{msg.subject}</td>
                    <td style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', whiteSpace: 'nowrap' }}>
                      {new Date(msg.created_at).toLocaleDateString()}
                    </td>
                    <td onClick={e => e.stopPropagation()}>
                      <div className="admin-table__actions">
                        <button
                          className="admin-icon-btn"
                          onClick={(e) => handleToggleRead(msg, e)}
                          title={msg.is_read ? 'Mark unread' : 'Mark read'}
                        >
                          {msg.is_read ? '○' : '●'}
                        </button>
                        <button
                          className="admin-icon-btn admin-icon-btn--danger"
                          onClick={() => setDeleting(msg)}
                          title="Delete"
                        >🗑</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div style={{ display: 'flex', justifyContent: 'center', gap: 'var(--space-3)', padding: 'var(--space-5)', borderTop: '1px solid var(--color-border)' }}>
            <Button variant="ghost" size="sm" onClick={() => setPage(p => Math.max(1, p-1))} disabled={page === 1}>← Prev</Button>
            <span style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)', padding: '0.4rem 0' }}>Page {page} / {totalPages}</span>
            <Button variant="ghost" size="sm" onClick={() => setPage(p => Math.min(totalPages, p+1))} disabled={page === totalPages}>Next →</Button>
          </div>
        )}
      </div>

      {/* Message detail modal */}
      <Modal isOpen={!!viewing} onClose={() => setViewing(null)} title="Message" size="md">
        {viewing && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
              <div>
                <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', marginBottom: 4 }}>From</p>
                <p style={{ fontWeight: 'var(--weight-semibold)', color: 'var(--color-text-primary)' }}>{viewing.name}</p>
              </div>
              <div>
                <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', marginBottom: 4 }}>Email</p>
                <a href={`mailto:${viewing.email}`} style={{ color: 'var(--color-accent)', fontSize: 'var(--text-sm)' }}>{viewing.email}</a>
              </div>
            </div>
            <div>
              <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', marginBottom: 4 }}>Subject</p>
              <p style={{ fontWeight: 'var(--weight-semibold)', color: 'var(--color-text-primary)' }}>{viewing.subject}</p>
            </div>
            <div style={{ background: 'var(--color-bg-secondary)', borderRadius: 'var(--radius-lg)', padding: 'var(--space-5)' }}>
              <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', marginBottom: 8 }}>Message</p>
              <p style={{ fontSize: 'var(--text-base)', color: 'var(--color-text-secondary)', lineHeight: 1.75, whiteSpace: 'pre-wrap' }}>{viewing.message}</p>
            </div>
            <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>
              Received: {new Date(viewing.created_at).toLocaleString()}
            </p>
            <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
              <Button as="a" href={`mailto:${viewing.email}?subject=Re: ${encodeURIComponent(viewing.subject)}`} variant="primary" size="sm">
                ↩ Reply via Email
              </Button>
              <Button variant="danger" size="sm" onClick={() => { setDeleting(viewing); setViewing(null); }}>Delete</Button>
            </div>
          </div>
        )}
      </Modal>

      <ConfirmDialog isOpen={!!deleting} onClose={() => setDeleting(null)} onConfirm={handleDelete}
        title="Delete Message?" message={`Message from "${deleting?.name}" will be permanently deleted.`} />
    </div>
  );
}
