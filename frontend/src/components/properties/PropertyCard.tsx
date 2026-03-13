import { Link } from 'react-router-dom';
import { HiLocationMarker } from 'react-icons/hi';
import { IoBedOutline, IoWaterOutline, IoResizeOutline } from 'react-icons/io5';
import type { Property } from '../../types';
import { formatPrice, getCoverImage, getStatusColor, getStatusLabel } from '../../utils';
import { Badge } from '../common/Common';

interface Props {
  property: Property;
}

export default function PropertyCard({ property }: Props) {
  const coverImage = getCoverImage(property.property_images);

  return (
    <Link
      to={`/propiedades/${property.id}`}
      style={{
        display: 'block',
        borderRadius: 'var(--radius-lg)',
        overflow: 'hidden',
        background: 'var(--color-surface)',
        boxShadow: 'var(--shadow-md)',
        transition: 'all var(--transition)',
        textDecoration: 'none',
        color: 'inherit',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-4px)';
        e.currentTarget.style.boxShadow = 'var(--shadow-xl)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = 'var(--shadow-md)';
      }}
    >
      {/* Image */}
      <div style={{ position: 'relative', paddingTop: '65%', overflow: 'hidden' }}>
        <img
          src={coverImage}
          alt={property.title}
          style={{
            position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
            objectFit: 'cover', transition: 'transform 0.4s ease',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.05)')}
          onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
        />
        <div style={{ position: 'absolute', top: '12px', left: '12px', display: 'flex', gap: '6px' }}>
          <Badge bg={getStatusColor(property.status)} color="#fff">
            {getStatusLabel(property.status)}
          </Badge>
          {property.is_featured && (
            <Badge bg="var(--color-accent)" color="#fff">⭐ Destacada</Badge>
          )}
        </div>
        <div style={{
          position: 'absolute', bottom: '12px', right: '12px',
          background: 'linear-gradient(135deg, var(--color-primary), var(--color-primary-light))',
          color: '#fff', padding: '6px 14px', borderRadius: 'var(--radius-md)',
          fontWeight: 700, fontSize: '16px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
        }}>
          {formatPrice(property.price)}
        </div>
      </div>

      {/* Content */}
      <div style={{ padding: '20px' }}>
        <div style={{
          fontSize: '12px', fontWeight: 500, color: 'var(--color-accent-dark)',
          textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '6px',
        }}>
          {property.property_types?.name || 'Propiedad'}
        </div>
        <h3 style={{
          fontSize: '17px', fontWeight: 600, marginBottom: '8px',
          color: 'var(--color-text)', lineHeight: 1.3,
          display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden',
        }}>
          {property.title}
        </h3>
        <div style={{
          display: 'flex', alignItems: 'center', gap: '4px',
          fontSize: '13px', color: 'var(--color-text-secondary)', marginBottom: '16px',
        }}>
          <HiLocationMarker style={{ color: 'var(--color-accent)' }} />
          {property.address}, {property.city}
        </div>

        {/* Features */}
        <div style={{
          display: 'flex', gap: '16px',
          padding: '12px 0 0', borderTop: '1px solid var(--color-border)',
        }}>
          {property.bedrooms > 0 && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '13px', color: 'var(--color-text-secondary)' }}>
              <IoBedOutline style={{ fontSize: '16px' }} /> {property.bedrooms}
            </div>
          )}
          {property.bathrooms > 0 && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '13px', color: 'var(--color-text-secondary)' }}>
              <IoWaterOutline style={{ fontSize: '16px' }} /> {property.bathrooms}
            </div>
          )}
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '13px', color: 'var(--color-text-secondary)' }}>
            <IoResizeOutline style={{ fontSize: '16px' }} /> {property.square_meters} m²
          </div>
        </div>
      </div>
    </Link>
  );
}
