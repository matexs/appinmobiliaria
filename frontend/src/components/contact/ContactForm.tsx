import { useState } from 'react';
import { sendContactMessage } from '../../services/messageService';
import toast from 'react-hot-toast';

interface Props {
  propertyId?: string;
}

export default function ContactForm({ propertyId }: Props) {
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      toast.error('Completá los campos obligatorios');
      return;
    }

    setLoading(true);
    try {
      await sendContactMessage({
        ...form,
        property_id: propertyId || null,
      });
      toast.success('Mensaje enviado exitosamente');
      setForm({ name: '', email: '', phone: '', message: '' });
    } catch (err) {
      toast.error((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '12px 16px',
    borderRadius: 'var(--radius-md)',
    border: '1px solid var(--color-border)',
    fontSize: '14px', outline: 'none',
    transition: 'border-color var(--transition)',
    background: '#fff',
  };

  return (
    <form onSubmit={handleSubmit} style={{
      background: 'var(--color-surface)', borderRadius: 'var(--radius-lg)',
      padding: '28px', boxShadow: 'var(--shadow-md)',
    }}>
      <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '20px', color: 'var(--color-primary)' }}>
        📩 Enviar consulta
      </h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        <div>
          <label style={{ fontSize: '13px', fontWeight: 500, color: 'var(--color-text-secondary)', display: 'block', marginBottom: '6px' }}>
            Nombre *
          </label>
          <input
            type="text"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="Tu nombre"
            style={inputStyle}
            required
          />
        </div>
        <div>
          <label style={{ fontSize: '13px', fontWeight: 500, color: 'var(--color-text-secondary)', display: 'block', marginBottom: '6px' }}>
            Email *
          </label>
          <input
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            placeholder="tu@email.com"
            style={inputStyle}
            required
          />
        </div>
        <div>
          <label style={{ fontSize: '13px', fontWeight: 500, color: 'var(--color-text-secondary)', display: 'block', marginBottom: '6px' }}>
            Teléfono (opcional)
          </label>
          <input
            type="tel"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            placeholder="+54 11 1234-5678"
            style={inputStyle}
          />
        </div>
        <div>
          <label style={{ fontSize: '13px', fontWeight: 500, color: 'var(--color-text-secondary)', display: 'block', marginBottom: '6px' }}>
            Mensaje *
          </label>
          <textarea
            value={form.message}
            onChange={(e) => setForm({ ...form, message: e.target.value })}
            placeholder="Escribí tu consulta..."
            rows={4}
            style={{ ...inputStyle, resize: 'vertical' }}
            required
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          style={{
            width: '100%', padding: '14px',
            background: loading
              ? 'var(--color-text-light)'
              : 'linear-gradient(135deg, var(--color-primary), var(--color-primary-light))',
            color: '#fff', border: 'none', borderRadius: 'var(--radius-md)',
            fontSize: '15px', fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer',
            transition: 'all var(--transition)',
            boxShadow: loading ? 'none' : '0 4px 12px rgba(30,58,95,0.3)',
          }}
        >
          {loading ? 'Enviando...' : 'Enviar consulta'}
        </button>
      </div>
    </form>
  );
}
