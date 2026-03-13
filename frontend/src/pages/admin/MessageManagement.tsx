import { useEffect, useState } from 'react';
import { getMessages, markMessageAsRead } from '../../services/messageService';
import { LoadingScreen, EmptyState, Badge } from '../../components/common/Common';
import { formatDateShort } from '../../utils';
import type { ContactMessage } from '../../types';
import toast from 'react-hot-toast';
import { HiMail, HiMailOpen, HiPhone } from 'react-icons/hi';

export default function MessageManagement() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<string | null>(null);

  const load = async () => {
    try {
      const res = await getMessages();
      setMessages(res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const handleMarkRead = async (id: string) => {
    try {
      await markMessageAsRead(id);
      setMessages(messages.map((m) => m.id === id ? { ...m, is_read: true } : m));
    } catch (err) {
      toast.error((err as Error).message);
    }
  };

  const toggleExpand = (id: string) => {
    setExpanded(expanded === id ? null : id);
    // Mark as read when expanding
    const msg = messages.find((m) => m.id === id);
    if (msg && !msg.is_read) {
      handleMarkRead(id);
    }
  };

  if (loading) return <LoadingScreen />;

  return (
    <div>
      <h1 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '24px' }}>
        Mensajes de contacto
      </h1>

      {messages.length === 0 ? (
        <EmptyState icon={<HiMail />} title="No hay mensajes" />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {messages.map((m) => (
            <div key={m.id} style={{
              background: '#fff', borderRadius: 'var(--radius-md)',
              boxShadow: 'var(--shadow-sm)', overflow: 'hidden',
              border: m.is_read ? '1px solid var(--color-border)' : '1px solid var(--color-primary)',
            }}>
              <button onClick={() => toggleExpand(m.id)} style={{
                width: '100%', display: 'flex', alignItems: 'center', gap: '12px',
                padding: '16px', background: 'none', border: 'none',
                textAlign: 'left', cursor: 'pointer',
              }}>
                <div style={{
                  width: '36px', height: '36px', borderRadius: '8px',
                  background: m.is_read ? 'var(--color-bg)' : 'rgba(30,58,95,0.1)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: m.is_read ? 'var(--color-text-light)' : 'var(--color-primary)',
                  fontSize: '16px',
                }}>
                  {m.is_read ? <HiMailOpen /> : <HiMail />}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontWeight: m.is_read ? 400 : 600, fontSize: '14px' }}>{m.name}</span>
                    {!m.is_read && <Badge bg="var(--color-primary)" color="#fff">Nuevo</Badge>}
                  </div>
                  <p style={{
                    fontSize: '13px', color: 'var(--color-text-secondary)',
                    overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                  }}>
                    {m.properties?.title ? `Re: ${m.properties.title} — ` : ''}{m.message}
                  </p>
                </div>
                <span style={{ fontSize: '12px', color: 'var(--color-text-light)', whiteSpace: 'nowrap' }}>
                  {formatDateShort(m.created_at)}
                </span>
              </button>

              {expanded === m.id && (
                <div style={{
                  padding: '0 16px 16px', borderTop: '1px solid var(--color-border)',
                  paddingTop: '16px', animation: 'fadeIn 0.2s ease-out',
                }}>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', marginBottom: '12px', fontSize: '13px', color: 'var(--color-text-secondary)' }}>
                    <span>📧 {m.email}</span>
                    {m.phone && <span><HiPhone style={{ display: 'inline' }} /> {m.phone}</span>}
                    {m.properties?.title && <span>🏠 {m.properties.title}</span>}
                  </div>
                  <p style={{ fontSize: '14px', lineHeight: 1.7, whiteSpace: 'pre-line' }}>
                    {m.message}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
