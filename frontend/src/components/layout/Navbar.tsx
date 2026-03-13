import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { HiMenu, HiX, HiUser, HiLogout, HiHome, HiOfficeBuilding, HiLogin } from 'react-icons/hi';

export default function Navbar() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const isAdmin = user?.role === 'admin';

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
    setProfileOpen(false);
  };

  const isActive = (path: string) => location.pathname === path;

  const navLinks = [
    { label: 'Inicio', path: '/', icon: <HiHome /> },
    { label: 'Propiedades', path: '/propiedades', icon: <HiOfficeBuilding /> },
  ];

  return (
    <nav style={{
      position: 'sticky',
      top: 0,
      zIndex: 50,
      background: 'rgba(255,255,255,0.92)',
      backdropFilter: 'blur(16px)',
      borderBottom: '1px solid var(--color-border)',
      boxShadow: 'var(--shadow-sm)',
    }}>
      <div style={{
        maxWidth: '1280px',
        margin: '0 auto',
        padding: '0 1.5rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: '72px',
      }}>
        {/* Logo */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
          <div style={{
            width: '40px', height: '40px', borderRadius: '10px',
            background: 'linear-gradient(135deg, var(--color-primary), var(--color-primary-light))',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#fff', fontWeight: 800, fontSize: '18px',
          }}>
            IM
          </div>
          <span style={{ fontWeight: 700, fontSize: '20px', color: 'var(--color-primary)' }}>
            Inmobiliaria
          </span>
        </Link>

        {/* Desktop nav */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
        }}
          className="desktop-nav"
        >
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              style={{
                display: 'flex', alignItems: 'center', gap: '6px',
                padding: '8px 16px', borderRadius: 'var(--radius-md)',
                fontSize: '14px', fontWeight: 500,
                color: isActive(link.path) ? 'var(--color-primary)' : 'var(--color-text-secondary)',
                background: isActive(link.path) ? 'rgba(30,58,95,0.08)' : 'transparent',
                transition: 'all var(--transition)',
              }}
            >
              {link.icon} {link.label}
            </Link>
          ))}

          {isAdmin && (
            <Link
              to="/admin"
              style={{
                display: 'flex', alignItems: 'center', gap: '6px',
                padding: '8px 16px', borderRadius: 'var(--radius-md)',
                fontSize: '14px', fontWeight: 500,
                color: location.pathname.startsWith('/admin') ? '#fff' : 'var(--color-accent-dark)',
                background: location.pathname.startsWith('/admin')
                  ? 'linear-gradient(135deg, var(--color-accent), var(--color-accent-light))'
                  : 'rgba(197,165,90,0.1)',
                transition: 'all var(--transition)',
              }}
            >
              Admin
            </Link>
          )}

          {user ? (
            <div style={{ position: 'relative', marginLeft: '8px' }}>
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                style={{
                  width: '40px', height: '40px', borderRadius: '50%',
                  background: 'linear-gradient(135deg, var(--color-primary), var(--color-accent))',
                  color: '#fff', border: 'none', fontWeight: 600, fontSize: '14px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: 'pointer',
                }}
              >
                {user.profile?.full_name?.[0]?.toUpperCase() || user.email[0].toUpperCase()}
              </button>

              {profileOpen && (
                <div style={{
                  position: 'absolute', right: 0, top: '48px',
                  background: '#fff', borderRadius: 'var(--radius-md)',
                  boxShadow: 'var(--shadow-xl)', border: '1px solid var(--color-border)',
                  minWidth: '200px', overflow: 'hidden',
                  animation: 'scaleIn 0.2s ease-out',
                }}>
                  <div style={{ padding: '16px', borderBottom: '1px solid var(--color-border)' }}>
                    <p style={{ fontWeight: 600, fontSize: '14px' }}>{user.profile?.full_name || 'Usuario'}</p>
                    <p style={{ fontSize: '12px', color: 'var(--color-text-secondary)' }}>{user.email}</p>
                  </div>
                  <Link
                    to="/perfil"
                    onClick={() => setProfileOpen(false)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: '8px',
                      padding: '12px 16px', fontSize: '14px', color: 'var(--color-text)',
                      transition: 'background var(--transition)',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--color-bg)')}
                    onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                  >
                    <HiUser /> Mi perfil
                  </Link>
                  <button
                    onClick={handleSignOut}
                    style={{
                      display: 'flex', alignItems: 'center', gap: '8px', width: '100%',
                      padding: '12px 16px', fontSize: '14px', border: 'none', background: 'none',
                      color: 'var(--color-danger)', textAlign: 'left',
                      transition: 'background var(--transition)',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(239,68,68,0.05)')}
                    onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                  >
                    <HiLogout /> Cerrar sesión
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              to="/ingresar"
              style={{
                display: 'flex', alignItems: 'center', gap: '6px',
                padding: '10px 20px', borderRadius: 'var(--radius-md)',
                background: 'linear-gradient(135deg, var(--color-primary), var(--color-primary-light))',
                color: '#fff', fontSize: '14px', fontWeight: 600,
                border: 'none', marginLeft: '8px',
                transition: 'all var(--transition)',
                boxShadow: '0 2px 8px rgba(30,58,95,0.3)',
              }}
            >
              <HiLogin /> Ingresar
            </Link>
          )}
        </div>

        {/* Mobile toggle */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          style={{
            display: 'none', background: 'none', border: 'none',
            fontSize: '24px', color: 'var(--color-text)',
          }}
          className="mobile-toggle"
        >
          {menuOpen ? <HiX /> : <HiMenu />}
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div style={{
          padding: '16px', borderTop: '1px solid var(--color-border)',
          background: '#fff', animation: 'fadeIn 0.2s ease-out',
        }}
          className="mobile-menu"
        >
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setMenuOpen(false)}
              style={{
                display: 'flex', alignItems: 'center', gap: '8px',
                padding: '12px', borderRadius: 'var(--radius-sm)',
                fontSize: '15px', fontWeight: 500,
                color: isActive(link.path) ? 'var(--color-primary)' : 'var(--color-text)',
                background: isActive(link.path) ? 'rgba(30,58,95,0.08)' : 'transparent',
              }}
            >
              {link.icon} {link.label}
            </Link>
          ))}
          {isAdmin && (
            <Link to="/admin" onClick={() => setMenuOpen(false)} style={{
              display: 'flex', alignItems: 'center', gap: '8px',
              padding: '12px', borderRadius: 'var(--radius-sm)',
              fontSize: '15px', fontWeight: 500, color: 'var(--color-accent-dark)',
            }}>
              Admin
            </Link>
          )}
          {!user && (
            <Link to="/ingresar" onClick={() => setMenuOpen(false)} style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
              padding: '12px', borderRadius: 'var(--radius-md)', marginTop: '8px',
              background: 'linear-gradient(135deg, var(--color-primary), var(--color-primary-light))',
              color: '#fff', fontSize: '15px', fontWeight: 600,
            }}>
              <HiLogin /> Ingresar
            </Link>
          )}
        </div>
      )}

      <style>{`
        @media (min-width: 768px) {
          .mobile-toggle { display: none !important; }
          .mobile-menu { display: none !important; }
        }
        @media (max-width: 767px) {
          .desktop-nav { display: none !important; }
          .mobile-toggle { display: block !important; }
        }
      `}</style>
    </nav>
  );
}
