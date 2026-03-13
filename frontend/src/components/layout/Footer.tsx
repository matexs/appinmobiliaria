import { Link } from 'react-router-dom';
import { HiPhone, HiMail, HiLocationMarker } from 'react-icons/hi';

export default function Footer() {
  return (
    <footer style={{
      background: 'linear-gradient(135deg, var(--color-primary-dark), var(--color-primary))',
      color: '#fff',
      padding: '48px 0 24px',
    }}>
      <div style={{
        maxWidth: '1280px', margin: '0 auto', padding: '0 1.5rem',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '32px',
      }}>
        {/* Columna 1: Logo/About */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
            <div style={{
              width: '36px', height: '36px', borderRadius: '8px',
              background: 'rgba(197,165,90,0.2)', border: '1px solid var(--color-accent)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'var(--color-accent)', fontWeight: 800, fontSize: '14px',
            }}>IM</div>
            <span style={{ fontWeight: 700, fontSize: '18px' }}>Inmobiliaria</span>
          </div>
          <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '14px', lineHeight: 1.7 }}>
            Tu aliado en la búsqueda del hogar ideal. Ofrecemos las mejores propiedades con asesoramiento personalizado.
          </p>
        </div>

        {/* Columna 2: Links */}
        <div>
          <h4 style={{ fontWeight: 600, marginBottom: '16px', fontSize: '16px' }}>Navegación</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {[
              { label: 'Inicio', path: '/' },
              { label: 'Propiedades', path: '/propiedades' },
              { label: 'Ingresar', path: '/ingresar' },
              { label: 'Registrarse', path: '/registrarse' },
            ].map((link) => (
              <Link key={link.path} to={link.path} style={{
                color: 'rgba(255,255,255,0.7)', fontSize: '14px',
                transition: 'color var(--transition)',
              }}>
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        {/* Columna 3: Contacto */}
        <div>
          <h4 style={{ fontWeight: 600, marginBottom: '16px', fontSize: '16px' }}>Contacto</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'rgba(255,255,255,0.7)', fontSize: '14px' }}>
              <HiPhone style={{ color: 'var(--color-accent)' }} /> +54 11 1234-5678
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'rgba(255,255,255,0.7)', fontSize: '14px' }}>
              <HiMail style={{ color: 'var(--color-accent)' }} /> info@inmobiliaria.com.ar
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'rgba(255,255,255,0.7)', fontSize: '14px' }}>
              <HiLocationMarker style={{ color: 'var(--color-accent)' }} /> Buenos Aires, Argentina
            </div>
          </div>
        </div>
      </div>

      <div style={{
        maxWidth: '1280px', margin: '32px auto 0', padding: '16px 1.5rem 0',
        borderTop: '1px solid rgba(255,255,255,0.1)',
        textAlign: 'center', color: 'rgba(255,255,255,0.5)', fontSize: '13px',
      }}>
        © {new Date().getFullYear()} Inmobiliaria. Todos los derechos reservados.
      </div>
    </footer>
  );
}
