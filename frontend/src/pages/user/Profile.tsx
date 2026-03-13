import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getVisits, cancelVisit } from '../../services/visitService';
import { updateProfile } from '../../services/profileService';
import { LoadingScreen, EmptyState, Badge } from '../../components/common/Common';
import { formatDateShort, formatTime, getStatusColor, getStatusLabel, getInitials } from '../../utils';
import type { Visit } from '../../types';
import toast from 'react-hot-toast';
import { HiCalendar, HiX, HiSave } from 'react-icons/hi';

export default function Profile() {
  const { user, refreshProfile } = useAuth();
  const [visits, setVisits] = useState<Visit[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [fullName, setFullName] = useState(user?.profile?.full_name || '');
  const [phone, setPhone] = useState(user?.profile?.phone || '');

  useEffect(() => {
    getVisits().then((res) => {
      setVisits(res.data || []);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const handleSaveProfile = async () => {
    setSaving(true);
    try {
      await updateProfile({ full_name: fullName, phone });
      await refreshProfile();
      toast.success('Perfil actualizado');
    } catch (err) {
      toast.error((err as Error).message);
    } finally {
      setSaving(false);
    }
  };

  const handleCancelVisit = async (id: string) => {
    if (!confirm('¿Cancelar esta visita?')) return;
    try {
      await cancelVisit(id);
      toast.success('Visita cancelada');
      setVisits(visits.map((v) => v.id === id ? { ...v, status: 'cancelada' as const } : v));
    } catch (err) {
      toast.error((err as Error).message);
    }
  };

  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '12px 14px', borderRadius: 'var(--radius-sm)',
    border: '1px solid var(--color-border)', fontSize: '14px', outline: 'none',
  };

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', padding: '32px 1.5rem' }}>
      {/* Profile header */}
      <div style={{
        background: '#fff', borderRadius: 'var(--radius-lg)', padding: '28px',
        boxShadow: 'var(--shadow-sm)', marginBottom: '24px',
        display: 'flex', gap: '20px', alignItems: 'center', flexWrap: 'wrap',
      }}>
        <div style={{
          width: '72px', height: '72px', borderRadius: '50%',
          background: 'linear-gradient(135deg, var(--color-primary), var(--color-accent))',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: '#fff', fontWeight: 700, fontSize: '24px',
        }}>
          {getInitials(user?.profile?.full_name || user?.email || 'U')}
        </div>
        <div style={{ flex: 1, minWidth: '200px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '12px' }}>
            <div>
              <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--color-text-secondary)', display: 'block', marginBottom: '4px' }}>Nombre</label>
              <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} style={inputStyle} />
            </div>
            <div>
              <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--color-text-secondary)', display: 'block', marginBottom: '4px' }}>Teléfono</label>
              <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} style={inputStyle} placeholder="+54 11 1234-5678" />
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '12px' }}>
            <p style={{ fontSize: '13px', color: 'var(--color-text-light)' }}>📧 {user?.email}</p>
            <button onClick={handleSaveProfile} disabled={saving} style={{
              display: 'flex', alignItems: 'center', gap: '4px',
              padding: '8px 16px', borderRadius: 'var(--radius-sm)',
              background: 'var(--color-primary)', color: '#fff',
              border: 'none', fontSize: '13px', fontWeight: 600,
            }}>
              <HiSave /> {saving ? 'Guardando...' : 'Guardar'}
            </button>
          </div>
        </div>
      </div>

      {/* Visit history */}
      <h2 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '16px' }}>
        📅 Mis visitas agendadas
      </h2>

      {loading ? <LoadingScreen /> : visits.length === 0 ? (
        <EmptyState
          icon={<HiCalendar />}
          title="No tenés visitas agendadas"
          description="Explorá propiedades y agendá una visita"
        />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {visits.map((v) => (
            <div key={v.id} style={{
              display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap',
              background: '#fff', borderRadius: 'var(--radius-md)',
              padding: '16px', boxShadow: 'var(--shadow-sm)',
            }}>
              <div style={{
                width: '48px', height: '48px', borderRadius: '10px',
                background: 'rgba(30,58,95,0.08)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: 'var(--color-primary)', fontSize: '20px',
              }}><HiCalendar /></div>
              <div style={{ flex: 1, minWidth: '200px' }}>
                <h3 style={{ fontSize: '15px', fontWeight: 600 }}>{v.properties?.title || 'Propiedad'}</h3>
                <p style={{ fontSize: '13px', color: 'var(--color-text-secondary)' }}>
                  📅 {formatDateShort(v.visit_date)} · 🕐 {formatTime(v.start_time)} - {formatTime(v.end_time)}
                </p>
                {v.properties?.address && (
                  <p style={{ fontSize: '13px', color: 'var(--color-text-light)' }}>📍 {v.properties.address}</p>
                )}
              </div>
              <Badge bg={getStatusColor(v.status)} color="#fff">
                {getStatusLabel(v.status)}
              </Badge>
              {v.status === 'confirmada' && (
                <button onClick={() => handleCancelVisit(v.id)} style={{
                  display: 'flex', alignItems: 'center', gap: '4px',
                  padding: '6px 12px', borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--color-danger)', background: '#fff',
                  color: 'var(--color-danger)', fontSize: '13px',
                }}>
                  <HiX /> Cancelar
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
