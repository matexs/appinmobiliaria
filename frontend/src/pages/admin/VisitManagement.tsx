import { useEffect, useState } from 'react';
import { getVisits, cancelVisit } from '../../services/visitService';
import { LoadingScreen, EmptyState, Badge } from '../../components/common/Common';
import { formatDateShort, formatTime, getStatusColor, getStatusLabel } from '../../utils';
import type { Visit } from '../../types';
import toast from 'react-hot-toast';
import { HiCalendar, HiX } from 'react-icons/hi';

export default function VisitManagement() {
  const [visits, setVisits] = useState<Visit[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    try {
      const res = await getVisits();
      setVisits(res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const handleCancel = async (id: string) => {
    if (!confirm('¿Cancelar esta visita?')) return;
    try {
      await cancelVisit(id);
      toast.success('Visita cancelada');
      load();
    } catch (err) {
      toast.error((err as Error).message);
    }
  };

  if (loading) return <LoadingScreen />;

  return (
    <div>
      <h1 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '24px' }}>Visitas agendadas</h1>

      {visits.length === 0 ? (
        <EmptyState icon={<HiCalendar />} title="No hay visitas agendadas" />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {visits.map((v) => (
            <div key={v.id} style={{
              display: 'flex', alignItems: 'center', gap: '16px',
              background: '#fff', borderRadius: 'var(--radius-md)',
              padding: '16px', boxShadow: 'var(--shadow-sm)',
              flexWrap: 'wrap',
            }}>
              <div style={{
                width: '48px', height: '48px', borderRadius: '10px',
                background: 'rgba(30,58,95,0.08)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: 'var(--color-primary)', fontSize: '20px',
              }}>
                <HiCalendar />
              </div>
              <div style={{ flex: 1, minWidth: '200px' }}>
                <h3 style={{ fontSize: '15px', fontWeight: 600 }}>
                  {v.properties?.title || 'Propiedad'}
                </h3>
                <p style={{ fontSize: '13px', color: 'var(--color-text-secondary)' }}>
                  📅 {formatDateShort(v.visit_date)} · 🕐 {formatTime(v.start_time)} - {formatTime(v.end_time)}
                </p>
                <p style={{ fontSize: '13px', color: 'var(--color-text-secondary)' }}>
                  👤 {v.profiles?.full_name || 'Usuario'}
                </p>
              </div>
              <Badge bg={getStatusColor(v.status)} color="#fff">
                {getStatusLabel(v.status)}
              </Badge>
              {v.status === 'confirmada' && (
                <button onClick={() => handleCancel(v.id)} style={{
                  display: 'flex', alignItems: 'center', gap: '4px',
                  padding: '6px 12px', borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--color-danger)', background: '#fff',
                  color: 'var(--color-danger)', fontSize: '13px', fontWeight: 500,
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
