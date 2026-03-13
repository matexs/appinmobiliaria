import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getPropertyById } from '../services/propertyService';
import ContactForm from '../components/contact/ContactForm';
import VisitScheduler from '../components/visits/VisitScheduler';
import PropertyMap from '../components/map/PropertyMap';
import { LoadingScreen, Badge } from '../components/common/Common';
import { formatPrice, getStatusColor, getStatusLabel } from '../utils';
import type { Property } from '../types';
import { HiLocationMarker, HiArrowLeft } from 'react-icons/hi';
import { IoBedOutline, IoWaterOutline, IoResizeOutline } from 'react-icons/io5';

export default function PropertyDetail() {
  const { id } = useParams<{ id: string }>();
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!id) return;
    const load = async () => {
      try {
        const res = await getPropertyById(id);
        setProperty(res.data || null);
      } catch {
        setError('Propiedad no encontrada');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  if (loading) return <LoadingScreen />;
  if (error || !property) {
    return (
      <div style={{ maxWidth: '600px', margin: '80px auto', textAlign: 'center', padding: '0 1.5rem' }}>
        <h2 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '12px' }}>Propiedad no encontrada</h2>
        <p style={{ color: 'var(--color-text-secondary)', marginBottom: '20px' }}>
          La propiedad que buscás no existe o fue eliminada.
        </p>
        <Link to="/propiedades" style={{
          display: 'inline-flex', alignItems: 'center', gap: '6px',
          padding: '12px 24px', background: 'var(--color-primary)',
          color: '#fff', borderRadius: 'var(--radius-md)', fontWeight: 600,
        }}>
          <HiArrowLeft /> Volver a propiedades
        </Link>
      </div>
    );
  }

  const images = property.property_images || [];
  const currentImage = images[selectedImage]?.image_url ||
    'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80';

  return (
    <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '32px 1.5rem' }}>
      {/* Back */}
      <Link to="/propiedades" style={{
        display: 'inline-flex', alignItems: 'center', gap: '6px',
        color: 'var(--color-text-secondary)', fontSize: '14px', fontWeight: 500,
        marginBottom: '24px',
      }}>
        <HiArrowLeft /> Volver a propiedades
      </Link>

      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr',
        gap: '32px',
      }}
        className="property-detail-grid"
      >
        {/* Left column */}
        <div>
          {/* Gallery */}
          <div style={{
            borderRadius: 'var(--radius-lg)', overflow: 'hidden',
            marginBottom: '24px', position: 'relative',
          }}>
            <img
              src={currentImage}
              alt={property.title}
              style={{ width: '100%', height: '400px', objectFit: 'cover' }}
            />
            <div style={{ position: 'absolute', top: '16px', left: '16px', display: 'flex', gap: '8px' }}>
              <Badge bg={getStatusColor(property.status)} color="#fff">
                {getStatusLabel(property.status)}
              </Badge>
              {property.is_featured && (
                <Badge bg="var(--color-accent)" color="#fff">⭐ Destacada</Badge>
              )}
            </div>
          </div>

          {/* Thumbnails */}
          {images.length > 1 && (
            <div style={{
              display: 'flex', gap: '8px', overflowX: 'auto',
              paddingBottom: '8px', marginBottom: '24px',
            }}>
              {images.map((img, i) => (
                <img
                  key={img.id}
                  src={img.image_url}
                  alt={`Foto ${i + 1}`}
                  onClick={() => setSelectedImage(i)}
                  style={{
                    width: '80px', height: '60px', objectFit: 'cover',
                    borderRadius: 'var(--radius-sm)', cursor: 'pointer',
                    border: i === selectedImage ? '3px solid var(--color-primary)' : '3px solid transparent',
                    opacity: i === selectedImage ? 1 : 0.6,
                    transition: 'all var(--transition)',
                  }}
                />
              ))}
            </div>
          )}

          {/* Info */}
          <div style={{
            background: '#fff', borderRadius: 'var(--radius-lg)',
            padding: '28px', boxShadow: 'var(--shadow-sm)',
            marginBottom: '24px',
          }}>
            <div style={{
              fontSize: '12px', fontWeight: 600, color: 'var(--color-accent-dark)',
              textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '8px',
            }}>
              {property.property_types?.name}
            </div>
            <h1 style={{ fontSize: '28px', fontWeight: 700, marginBottom: '8px', lineHeight: 1.3 }}>
              {property.title}
            </h1>
            <div style={{
              display: 'flex', alignItems: 'center', gap: '4px',
              fontSize: '15px', color: 'var(--color-text-secondary)', marginBottom: '16px',
            }}>
              <HiLocationMarker style={{ color: 'var(--color-accent)' }} />
              {property.address}, {property.city}, {property.province}
            </div>

            <div style={{
              fontSize: '32px', fontWeight: 800,
              background: 'linear-gradient(135deg, var(--color-primary), var(--color-accent))',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              marginBottom: '24px',
            }}>
              {formatPrice(property.price)}
            </div>

            {/* Features */}
            <div style={{
              display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px',
              padding: '20px 0', borderTop: '1px solid var(--color-border)',
              borderBottom: '1px solid var(--color-border)', marginBottom: '24px',
            }}>
              <div style={{ textAlign: 'center' }}>
                <IoBedOutline style={{ fontSize: '24px', color: 'var(--color-primary)', marginBottom: '4px' }} />
                <p style={{ fontSize: '20px', fontWeight: 700 }}>{property.bedrooms}</p>
                <p style={{ fontSize: '12px', color: 'var(--color-text-secondary)' }}>Habitaciones</p>
              </div>
              <div style={{ textAlign: 'center' }}>
                <IoWaterOutline style={{ fontSize: '24px', color: 'var(--color-primary)', marginBottom: '4px' }} />
                <p style={{ fontSize: '20px', fontWeight: 700 }}>{property.bathrooms}</p>
                <p style={{ fontSize: '12px', color: 'var(--color-text-secondary)' }}>Baños</p>
              </div>
              <div style={{ textAlign: 'center' }}>
                <IoResizeOutline style={{ fontSize: '24px', color: 'var(--color-primary)', marginBottom: '4px' }} />
                <p style={{ fontSize: '20px', fontWeight: 700 }}>{property.square_meters}</p>
                <p style={{ fontSize: '12px', color: 'var(--color-text-secondary)' }}>m²</p>
              </div>
            </div>

            {/* Description */}
            <h2 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '12px' }}>Descripción</h2>
            <p style={{
              color: 'var(--color-text-secondary)', fontSize: '15px',
              lineHeight: 1.8, whiteSpace: 'pre-line',
            }}>
              {property.description}
            </p>
          </div>

          {/* Map */}
          {property.latitude && property.longitude && (
            <div style={{
              background: '#fff', borderRadius: 'var(--radius-lg)',
              padding: '28px', boxShadow: 'var(--shadow-sm)',
            }}>
              <h2 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '16px' }}>📍 Ubicación</h2>
              <PropertyMap
                latitude={property.latitude}
                longitude={property.longitude}
                address={property.address}
              />
            </div>
          )}
        </div>

        {/* Right column: sidebar */}
        <div className="property-sidebar">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <VisitScheduler propertyId={property.id} />
            <ContactForm propertyId={property.id} />
          </div>
        </div>
      </div>

      <style>{`
        @media (min-width: 1024px) {
          .property-detail-grid {
            grid-template-columns: 1fr 380px !important;
          }
        }
      `}</style>
    </div>
  );
}
