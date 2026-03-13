import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getProperties, deleteProperty, changePropertyStatus, togglePropertyFeatured } from '../../services/propertyService';
import { Badge, LoadingScreen, EmptyState } from '../../components/common/Common';
import { formatPrice, getStatusColor, getStatusLabel, getCoverImage } from '../../utils';
import type { Property } from '../../types';
import toast from 'react-hot-toast';
import { HiPlus, HiPencil, HiTrash, HiStar, HiEye } from 'react-icons/hi';

export default function PropertyManagement() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');

  const load = async () => {
    setLoading(true);
    try {
      const res = await getProperties({ limit: 100, status: statusFilter || undefined });
      setProperties(res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [statusFilter]);

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`¿Eliminar "${title}"? Esta acción no se puede deshacer.`)) return;
    try {
      await deleteProperty(id);
      toast.success('Propiedad eliminada');
      load();
    } catch (err) {
      toast.error((err as Error).message);
    }
  };

  const handleStatusChange = async (id: string, status: string) => {
    try {
      await changePropertyStatus(id, status);
      toast.success(`Estado cambiado a "${status}"`);
      load();
    } catch (err) {
      toast.error((err as Error).message);
    }
  };

  const handleToggleFeatured = async (id: string, current: boolean) => {
    try {
      await togglePropertyFeatured(id, !current);
      toast.success(current ? 'Quitada de destacadas' : 'Marcada como destacada');
      load();
    } catch (err) {
      toast.error((err as Error).message);
    }
  };

  return (
    <div>
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        marginBottom: '24px', flexWrap: 'wrap', gap: '12px',
      }}>
        <h1 style={{ fontSize: '24px', fontWeight: 700 }}>Propiedades</h1>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            style={{
              padding: '8px 12px', borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--color-border)', fontSize: '14px',
            }}
          >
            <option value="">Todos los estados</option>
            <option value="activa">Activa</option>
            <option value="pausada">Pausada</option>
            <option value="vendida">Vendida</option>
          </select>
          <Link to="/admin/propiedades/nueva" style={{
            display: 'flex', alignItems: 'center', gap: '6px',
            padding: '10px 20px', borderRadius: 'var(--radius-md)',
            background: 'var(--color-primary)', color: '#fff',
            fontWeight: 600, fontSize: '14px',
          }}>
            <HiPlus /> Nueva
          </Link>
        </div>
      </div>

      {loading ? <LoadingScreen /> : properties.length === 0 ? (
        <EmptyState title="No hay propiedades" description="Creá tu primera propiedad" />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {properties.map((p) => (
            <div key={p.id} style={{
              display: 'flex', alignItems: 'center', gap: '16px',
              background: '#fff', borderRadius: 'var(--radius-md)',
              padding: '16px', boxShadow: 'var(--shadow-sm)',
              flexWrap: 'wrap',
            }}>
              <img
                src={getCoverImage(p.property_images)}
                alt={p.title}
                style={{
                  width: '80px', height: '60px', objectFit: 'cover',
                  borderRadius: 'var(--radius-sm)',
                }}
              />
              <div style={{ flex: 1, minWidth: '200px' }}>
                <h3 style={{ fontSize: '15px', fontWeight: 600 }}>{p.title}</h3>
                <p style={{ fontSize: '13px', color: 'var(--color-text-secondary)' }}>
                  {p.address}, {p.city} · {formatPrice(p.price)}
                </p>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                <Badge bg={getStatusColor(p.status)} color="#fff">{getStatusLabel(p.status)}</Badge>
                {p.is_featured && <Badge bg="var(--color-accent)" color="#fff">⭐</Badge>}
              </div>
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                <select
                  value={p.status}
                  onChange={(e) => handleStatusChange(p.id, e.target.value)}
                  style={{
                    padding: '6px 8px', borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--color-border)', fontSize: '12px',
                  }}
                >
                  <option value="activa">Activa</option>
                  <option value="pausada">Pausada</option>
                  <option value="vendida">Vendida</option>
                </select>
                <button onClick={() => handleToggleFeatured(p.id, p.is_featured)} title="Destacar"
                  style={{ padding: '6px 10px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)', background: p.is_featured ? 'var(--color-accent)' : '#fff', color: p.is_featured ? '#fff' : 'var(--color-text-secondary)', fontSize: '14px' }}>
                  <HiStar />
                </button>
                <Link to={`/propiedades/${p.id}`} title="Ver" style={{
                  padding: '6px 10px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)', background: '#fff', color: 'var(--color-text-secondary)', fontSize: '14px', display: 'flex', alignItems: 'center',
                }}>
                  <HiEye />
                </Link>
                <Link to={`/admin/propiedades/${p.id}/editar`} title="Editar" style={{
                  padding: '6px 10px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)', background: '#fff', color: 'var(--color-primary)', fontSize: '14px', display: 'flex', alignItems: 'center',
                }}>
                  <HiPencil />
                </Link>
                <button onClick={() => handleDelete(p.id, p.title)} title="Eliminar"
                  style={{ padding: '6px 10px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)', background: '#fff', color: 'var(--color-danger)', fontSize: '14px' }}>
                  <HiTrash />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
