import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getProperties, getPropertyTypes } from '../services/propertyService';
import PropertyCard from '../components/properties/PropertyCard';
import { LoadingScreen, EmptyState } from '../components/common/Common';
import type { Property, PropertyType, PropertyFilters } from '../types';
import { HiSearch, HiFilter, HiX } from 'react-icons/hi';

export default function PropertyList() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [properties, setProperties] = useState<Property[]>([]);
  const [types, setTypes] = useState<PropertyType[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);

  const [filters, setFilters] = useState<PropertyFilters>({
    search: searchParams.get('search') || '',
    city: '',
    property_type_id: '',
    min_price: '',
    max_price: '',
    bedrooms: '',
    min_sqm: '',
    max_sqm: '',
  });

  useEffect(() => {
    getPropertyTypes().then((res) => setTypes(res.data || []));
  }, []);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const res = await getProperties({ ...filters, page, limit: 12 });
        setProperties(res.data || []);
        setTotal(res.total || 0);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [filters, page]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    const params = new URLSearchParams();
    if (filters.search) params.set('search', filters.search);
    setSearchParams(params);
  };

  const clearFilters = () => {
    setFilters({ search: '', city: '', property_type_id: '', min_price: '', max_price: '', bedrooms: '', min_sqm: '', max_sqm: '' });
    setPage(1);
    setSearchParams({});
  };

  const totalPages = Math.ceil(total / 12);

  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '10px 14px', borderRadius: 'var(--radius-sm)',
    border: '1px solid var(--color-border)', fontSize: '14px', outline: 'none',
  };

  const labelStyle: React.CSSProperties = {
    fontSize: '12px', fontWeight: 600, color: 'var(--color-text-secondary)',
    textTransform: 'uppercase', letterSpacing: '0.5px', display: 'block', marginBottom: '6px',
  };

  return (
    <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '32px 1.5rem' }}>
      {/* Header */}
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '32px', fontWeight: 800, color: 'var(--color-text)' }}>Propiedades</h1>
        <p style={{ color: 'var(--color-text-secondary)', marginTop: '4px' }}>
          {total} propiedad{total !== 1 ? 'es' : ''} encontrada{total !== 1 ? 's' : ''}
        </p>
      </div>

      {/* Search + Filter Toggle */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '24px', flexWrap: 'wrap' }}>
        <form onSubmit={handleSearch} style={{ flex: 1, minWidth: '250px', display: 'flex', gap: '8px' }}>
          <div style={{ flex: 1, position: 'relative' }}>
            <HiSearch style={{
              position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)',
              color: 'var(--color-text-light)', fontSize: '18px',
            }} />
            <input
              type="text"
              placeholder="Buscar propiedades..."
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              style={{ ...inputStyle, paddingLeft: '40px' }}
            />
          </div>
          <button type="submit" style={{
            padding: '10px 20px', background: 'var(--color-primary)',
            color: '#fff', border: 'none', borderRadius: 'var(--radius-sm)',
            fontWeight: 600, fontSize: '14px',
          }}>
            Buscar
          </button>
        </form>
        <button
          onClick={() => setShowFilters(!showFilters)}
          style={{
            display: 'flex', alignItems: 'center', gap: '6px',
            padding: '10px 16px', borderRadius: 'var(--radius-sm)',
            border: '1px solid var(--color-border)', background: showFilters ? 'var(--color-primary)' : '#fff',
            color: showFilters ? '#fff' : 'var(--color-text)', fontSize: '14px', fontWeight: 500,
          }}
        >
          <HiFilter /> Filtros
        </button>
      </div>

      {/* Filters */}
      {showFilters && (
        <div style={{
          background: '#fff', borderRadius: 'var(--radius-md)',
          padding: '24px', marginBottom: '24px',
          boxShadow: 'var(--shadow-sm)', border: '1px solid var(--color-border)',
          animation: 'fadeIn 0.2s ease-out',
        }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
            gap: '16px',
          }}>
            <div>
              <label style={labelStyle}>Ciudad</label>
              <input
                type="text"
                placeholder="Ej: Buenos Aires"
                value={filters.city}
                onChange={(e) => setFilters({ ...filters, city: e.target.value })}
                style={inputStyle}
              />
            </div>
            <div>
              <label style={labelStyle}>Tipo</label>
              <select
                value={filters.property_type_id}
                onChange={(e) => setFilters({ ...filters, property_type_id: e.target.value })}
                style={inputStyle}
              >
                <option value="">Todos</option>
                {types.map((t) => (
                  <option key={t.id} value={t.id}>{t.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label style={labelStyle}>Precio mín.</label>
              <input
                type="number"
                placeholder="0"
                value={filters.min_price}
                onChange={(e) => setFilters({ ...filters, min_price: e.target.value })}
                style={inputStyle}
              />
            </div>
            <div>
              <label style={labelStyle}>Precio máx.</label>
              <input
                type="number"
                placeholder="Sin límite"
                value={filters.max_price}
                onChange={(e) => setFilters({ ...filters, max_price: e.target.value })}
                style={inputStyle}
              />
            </div>
            <div>
              <label style={labelStyle}>Habitaciones mín.</label>
              <select
                value={filters.bedrooms}
                onChange={(e) => setFilters({ ...filters, bedrooms: e.target.value })}
                style={inputStyle}
              >
                <option value="">Cualquiera</option>
                {[1, 2, 3, 4, 5].map((n) => (
                  <option key={n} value={n}>{n}+</option>
                ))}
              </select>
            </div>
            <div>
              <label style={labelStyle}>m² mín.</label>
              <input
                type="number"
                placeholder="0"
                value={filters.min_sqm}
                onChange={(e) => setFilters({ ...filters, min_sqm: e.target.value })}
                style={inputStyle}
              />
            </div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '16px' }}>
            <button onClick={clearFilters} style={{
              display: 'flex', alignItems: 'center', gap: '4px',
              padding: '8px 16px', borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--color-border)', background: '#fff',
              fontSize: '13px', color: 'var(--color-text-secondary)',
            }}>
              <HiX /> Limpiar
            </button>
          </div>
        </div>
      )}

      {/* Grid */}
      {loading ? (
        <LoadingScreen />
      ) : properties.length === 0 ? (
        <EmptyState
          title="No se encontraron propiedades"
          description="Intentá con otros filtros o buscá otra cosa"
          action={<button onClick={clearFilters} style={{
            padding: '10px 20px', background: 'var(--color-primary)',
            color: '#fff', border: 'none', borderRadius: 'var(--radius-sm)',
            fontWeight: 600, fontSize: '14px',
          }}>Limpiar filtros</button>}
        />
      ) : (
        <>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
            gap: '24px',
          }}>
            {properties.map((p, i) => (
              <div key={p.id} className="animate-fade-in" style={{ animationDelay: `${i * 0.05}s` }}>
                <PropertyCard property={p} />
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div style={{
              display: 'flex', justifyContent: 'center', gap: '8px',
              marginTop: '40px',
            }}>
              <button
                onClick={() => setPage(Math.max(1, page - 1))}
                disabled={page === 1}
                style={{
                  padding: '10px 16px', borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--color-border)', background: '#fff',
                  fontSize: '14px', fontWeight: 500,
                  opacity: page === 1 ? 0.5 : 1,
                  cursor: page === 1 ? 'not-allowed' : 'pointer',
                }}
              >
                Anterior
              </button>
              <span style={{
                display: 'flex', alignItems: 'center', padding: '0 16px',
                fontSize: '14px', color: 'var(--color-text-secondary)',
              }}>
                {page} / {totalPages}
              </span>
              <button
                onClick={() => setPage(Math.min(totalPages, page + 1))}
                disabled={page === totalPages}
                style={{
                  padding: '10px 16px', borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--color-border)', background: '#fff',
                  fontSize: '14px', fontWeight: 500,
                  opacity: page === totalPages ? 0.5 : 1,
                  cursor: page === totalPages ? 'not-allowed' : 'pointer',
                }}
              >
                Siguiente
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
