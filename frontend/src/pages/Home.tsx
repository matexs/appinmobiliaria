import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getFeaturedProperties, getRecentProperties } from '../services/propertyService';
import PropertyCard from '../components/properties/PropertyCard';
import { LoadingScreen } from '../components/common/Common';
import type { Property } from '../types';
import { HiSearch, HiArrowRight, HiShieldCheck, HiClock, HiHeart } from 'react-icons/hi';

export default function Home() {
  const [featured, setFeatured] = useState<Property[]>([]);
  const [recent, setRecent] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        const [featuredRes, recentRes] = await Promise.all([
          getFeaturedProperties(),
          getRecentProperties(),
        ]);
        setFeatured(featuredRes.data || []);
        setRecent(recentRes.data || []);
      } catch (err) {
        console.error('Error cargando propiedades:', err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) return <LoadingScreen />;

  return (
    <div>
      {/* Hero */}
      <section style={{
        position: 'relative',
        background: 'linear-gradient(135deg, var(--color-primary-dark) 0%, var(--color-primary) 50%, var(--color-primary-light) 100%)',
        padding: '80px 1.5rem 100px',
        overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', inset: 0,
          background: 'url("https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1600&q=80") center/cover',
          opacity: 0.15,
        }} />
        <div style={{ position: 'relative', maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
          <h1 style={{
            fontSize: 'clamp(32px, 5vw, 56px)',
            fontWeight: 800, color: '#fff', lineHeight: 1.15, marginBottom: '20px',
          }}>
            Encontrá tu <span style={{ color: 'var(--color-accent)' }}>hogar ideal</span>
          </h1>
          <p style={{
            fontSize: 'clamp(16px, 2vw, 20px)',
            color: 'rgba(255,255,255,0.8)', marginBottom: '36px', lineHeight: 1.6,
          }}>
            Las mejores propiedades en venta con asesoramiento personalizado. Tu próximo hogar te está esperando.
          </p>

          {/* Search bar */}
          <div style={{
            display: 'flex', maxWidth: '560px', margin: '0 auto',
            background: '#fff', borderRadius: 'var(--radius-xl)',
            boxShadow: '0 12px 40px rgba(0,0,0,0.2)',
            overflow: 'hidden',
          }}>
            <input
              type="text"
              placeholder="Buscar por ciudad, barrio o tipo..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                flex: 1, padding: '16px 24px', border: 'none',
                fontSize: '15px', outline: 'none', background: 'transparent',
              }}
            />
            <Link
              to={`/propiedades${searchQuery ? `?search=${searchQuery}` : ''}`}
              style={{
                display: 'flex', alignItems: 'center', gap: '8px',
                padding: '12px 28px', margin: '6px',
                background: 'linear-gradient(135deg, var(--color-primary), var(--color-primary-light))',
                color: '#fff', borderRadius: '18px',
                fontWeight: 600, fontSize: '14px',
                transition: 'all var(--transition)',
              }}
            >
              <HiSearch /> Buscar
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Properties */}
      {featured.length > 0 && (
        <section style={{
          maxWidth: '1280px', margin: '0 auto',
          padding: '64px 1.5rem',
        }}>
          <div style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            marginBottom: '32px', flexWrap: 'wrap', gap: '12px',
          }}>
            <div>
              <h2 style={{ fontSize: '28px', fontWeight: 700, color: 'var(--color-text)' }}>
                ⭐ Propiedades destacadas
              </h2>
              <p style={{ color: 'var(--color-text-secondary)', fontSize: '15px', marginTop: '4px' }}>
                Nuestras mejores opciones seleccionadas para vos
              </p>
            </div>
            <Link
              to="/propiedades"
              style={{
                display: 'flex', alignItems: 'center', gap: '4px',
                color: 'var(--color-primary)', fontWeight: 600, fontSize: '14px',
              }}
            >
              Ver todas <HiArrowRight />
            </Link>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
            gap: '24px',
          }}>
            {featured.map((p, i) => (
              <div key={p.id} className="animate-fade-in" style={{ animationDelay: `${i * 0.1}s` }}>
                <PropertyCard property={p} />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Recent Properties */}
      {recent.length > 0 && (
        <section style={{
          background: 'var(--color-bg)',
          padding: '64px 1.5rem',
        }}>
          <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
            <div style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              marginBottom: '32px', flexWrap: 'wrap', gap: '12px',
            }}>
              <div>
                <h2 style={{ fontSize: '28px', fontWeight: 700, color: 'var(--color-text)' }}>
                  🏠 Publicaciones recientes
                </h2>
                <p style={{ color: 'var(--color-text-secondary)', fontSize: '15px', marginTop: '4px' }}>
                  Las últimas propiedades agregadas
                </p>
              </div>
              <Link
                to="/propiedades"
                style={{
                  display: 'flex', alignItems: 'center', gap: '4px',
                  color: 'var(--color-primary)', fontWeight: 600, fontSize: '14px',
                }}
              >
                Ver todas <HiArrowRight />
              </Link>
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
              gap: '24px',
            }}>
              {recent.map((p, i) => (
                <div key={p.id} className="animate-fade-in" style={{ animationDelay: `${i * 0.08}s` }}>
                  <PropertyCard property={p} />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Features */}
      <section style={{
        maxWidth: '1280px', margin: '0 auto',
        padding: '64px 1.5rem',
      }}>
        <h2 style={{ fontSize: '28px', fontWeight: 700, textAlign: 'center', marginBottom: '40px' }}>
          ¿Por qué elegirnos?
        </h2>
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '24px',
        }}>
          {[
            { icon: <HiShieldCheck />, title: 'Confianza', desc: 'Transacciones seguras con asesoramiento legal incluido.' },
            { icon: <HiClock />, title: 'Rapidez', desc: 'Agenda visitas al instante y recibí respuesta en menos de 24hs.' },
            { icon: <HiHeart />, title: 'Dedicación', desc: 'Te acompañamos en cada paso hasta encontrar tu hogar ideal.' },
          ].map((item, i) => (
            <div
              key={i}
              style={{
                background: '#fff', borderRadius: 'var(--radius-lg)',
                padding: '32px', textAlign: 'center',
                boxShadow: 'var(--shadow-sm)',
                transition: 'all var(--transition)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = 'var(--shadow-lg)';
                e.currentTarget.style.transform = 'translateY(-4px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              <div style={{
                width: '56px', height: '56px', borderRadius: '16px',
                background: 'rgba(30,58,95,0.08)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                margin: '0 auto 16px', fontSize: '24px', color: 'var(--color-primary)',
              }}>{item.icon}</div>
              <h3 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '8px' }}>{item.title}</h3>
              <p style={{ fontSize: '14px', color: 'var(--color-text-secondary)', lineHeight: 1.6 }}>{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section style={{
        background: 'linear-gradient(135deg, var(--color-primary), var(--color-primary-light))',
        padding: '64px 1.5rem', textAlign: 'center',
      }}>
        <h2 style={{ fontSize: '28px', fontWeight: 700, color: '#fff', marginBottom: '12px' }}>
          ¿Listo para encontrar tu próximo hogar?
        </h2>
        <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '16px', marginBottom: '28px' }}>
          Explorá nuestro catálogo completo o contactanos para recibir asesoramiento personalizado.
        </p>
        <Link
          to="/propiedades"
          style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            padding: '16px 32px', borderRadius: 'var(--radius-xl)',
            background: 'var(--color-accent)', color: '#fff',
            fontWeight: 700, fontSize: '16px',
            boxShadow: '0 6px 20px rgba(197,165,90,0.4)',
            transition: 'all var(--transition)',
          }}
        >
          Ver propiedades <HiArrowRight />
        </Link>
      </section>
    </div>
  );
}
