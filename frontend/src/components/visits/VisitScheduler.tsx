import { useState, useEffect } from 'react';
import { getAvailableSlots, createVisit } from '../../services/visitService';
import { useAuth } from '../../context/AuthContext';
import type { TimeSlot } from '../../types';
import toast from 'react-hot-toast';
import { formatDate } from '../../utils';

interface Props {
  propertyId: string;
}

export default function VisitScheduler({ propertyId }: Props) {
  const { user } = useAuth();
  const [selectedDate, setSelectedDate] = useState('');
  const [slots, setSlots] = useState<TimeSlot[]>([]);
  const [selectedSlot, setSelectedSlot] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingSlots, setLoadingSlots] = useState(false);

  // Fecha mínima: mañana
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split('T')[0];

  useEffect(() => {
    if (!selectedDate) return;

    const fetchSlots = async () => {
      setLoadingSlots(true);
      setSelectedSlot('');
      try {
        const response = await getAvailableSlots(propertyId, selectedDate);
        setSlots(response.data || []);
      } catch {
        toast.error('Error cargando horarios disponibles');
        setSlots([]);
      } finally {
        setLoadingSlots(false);
      }
    };

    fetchSlots();
  }, [selectedDate, propertyId]);

  const handleSubmit = async () => {
    if (!selectedDate || !selectedSlot) {
      toast.error('Seleccioná fecha y horario');
      return;
    }

    setLoading(true);
    try {
      await createVisit(propertyId, selectedDate, selectedSlot);
      toast.success('¡Visita agendada exitosamente!');
      setSelectedDate('');
      setSelectedSlot('');
      setSlots([]);
    } catch (err) {
      toast.error((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div style={{
        background: 'var(--color-surface)', borderRadius: 'var(--radius-lg)',
        padding: '28px', boxShadow: 'var(--shadow-md)', textAlign: 'center',
      }}>
        <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '12px', color: 'var(--color-primary)' }}>
          📅 Agendar visita
        </h3>
        <p style={{ color: 'var(--color-text-secondary)', fontSize: '14px', marginBottom: '16px' }}>
          Necesitás iniciar sesión para agendar una visita.
        </p>
        <a
          href="/ingresar"
          style={{
            display: 'inline-block', padding: '12px 24px',
            background: 'linear-gradient(135deg, var(--color-primary), var(--color-primary-light))',
            color: '#fff', borderRadius: 'var(--radius-md)',
            fontWeight: 600, fontSize: '14px',
          }}
        >
          Iniciar sesión
        </a>
      </div>
    );
  }

  return (
    <div style={{
      background: 'var(--color-surface)', borderRadius: 'var(--radius-lg)',
      padding: '28px', boxShadow: 'var(--shadow-md)',
    }}>
      <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '20px', color: 'var(--color-primary)' }}>
        📅 Agendar visita
      </h3>

      <div style={{ marginBottom: '16px' }}>
        <label style={{ fontSize: '13px', fontWeight: 500, color: 'var(--color-text-secondary)', display: 'block', marginBottom: '6px' }}>
          Seleccioná una fecha
        </label>
        <input
          type="date"
          value={selectedDate}
          min={minDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          style={{
            width: '100%', padding: '12px 16px',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--color-border)',
            fontSize: '14px', outline: 'none',
          }}
        />
      </div>

      {selectedDate && (
        <div style={{ marginBottom: '16px' }}>
          <label style={{ fontSize: '13px', fontWeight: 500, color: 'var(--color-text-secondary)', display: 'block', marginBottom: '8px' }}>
            Horarios disponibles — {formatDate(selectedDate)}
          </label>

          {loadingSlots ? (
            <p style={{ fontSize: '14px', color: 'var(--color-text-secondary)' }}>Cargando horarios...</p>
          ) : (
            <div style={{
              display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px',
            }}>
              {slots.map((slot) => (
                <button
                  key={slot.start_time}
                  disabled={!slot.available}
                  onClick={() => setSelectedSlot(slot.start_time)}
                  style={{
                    padding: '10px',
                    borderRadius: 'var(--radius-sm)',
                    border: selectedSlot === slot.start_time
                      ? '2px solid var(--color-primary)'
                      : '1px solid var(--color-border)',
                    background: !slot.available
                      ? '#f0f0f0'
                      : selectedSlot === slot.start_time
                        ? 'rgba(30,58,95,0.08)'
                        : '#fff',
                    color: !slot.available ? 'var(--color-text-light)' : 'var(--color-text)',
                    fontSize: '13px', fontWeight: 500,
                    cursor: slot.available ? 'pointer' : 'not-allowed',
                    transition: 'all var(--transition)',
                    textDecoration: !slot.available ? 'line-through' : 'none',
                  }}
                >
                  {slot.start_time.slice(0, 5)} - {slot.end_time.slice(0, 5)}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {selectedDate && selectedSlot && (
        <button
          onClick={handleSubmit}
          disabled={loading}
          style={{
            width: '100%', padding: '14px',
            background: loading
              ? 'var(--color-text-light)'
              : 'linear-gradient(135deg, var(--color-accent), var(--color-accent-light))',
            color: '#fff', border: 'none', borderRadius: 'var(--radius-md)',
            fontSize: '15px', fontWeight: 600,
            cursor: loading ? 'not-allowed' : 'pointer',
            boxShadow: '0 4px 12px rgba(197,165,90,0.3)',
            transition: 'all var(--transition)',
          }}
        >
          {loading ? 'Agendando...' : 'Confirmar visita'}
        </button>
      )}
    </div>
  );
}
