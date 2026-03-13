import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { HiMail, HiLockClosed } from 'react-icons/hi';

export default function Login() {
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await signIn(email, password);
    setLoading(false);

    if (error) {
      toast.error(error);
    } else {
      toast.success('¡Bienvenido!');
      navigate('/');
    }
  };

  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '14px 16px 14px 44px',
    borderRadius: 'var(--radius-md)',
    border: '1px solid var(--color-border)',
    fontSize: '15px', outline: 'none',
    transition: 'border-color var(--transition)',
  };

  return (
    <div style={{
      minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '32px 1.5rem',
    }}>
      <div style={{
        width: '100%', maxWidth: '420px',
        background: '#fff', borderRadius: 'var(--radius-xl)',
        padding: '40px', boxShadow: 'var(--shadow-xl)',
      }}
        className="animate-scale-in"
      >
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{
            width: '56px', height: '56px', borderRadius: '16px',
            background: 'linear-gradient(135deg, var(--color-primary), var(--color-primary-light))',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 16px', color: '#fff', fontWeight: 800, fontSize: '22px',
          }}>IM</div>
          <h1 style={{ fontSize: '24px', fontWeight: 700 }}>Iniciar sesión</h1>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: '14px', marginTop: '4px' }}>
            Accedé a tu cuenta para gestionar tus visitas
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ position: 'relative' }}>
            <HiMail style={{
              position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)',
              color: 'var(--color-text-light)', fontSize: '18px',
            }} />
            <input
              type="email" placeholder="Email"
              value={email} onChange={(e) => setEmail(e.target.value)}
              style={inputStyle} required
            />
          </div>
          <div style={{ position: 'relative' }}>
            <HiLockClosed style={{
              position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)',
              color: 'var(--color-text-light)', fontSize: '18px',
            }} />
            <input
              type="password" placeholder="Contraseña"
              value={password} onChange={(e) => setPassword(e.target.value)}
              style={inputStyle} required
            />
          </div>
          <button type="submit" disabled={loading} style={{
            width: '100%', padding: '14px',
            background: loading ? 'var(--color-text-light)' : 'linear-gradient(135deg, var(--color-primary), var(--color-primary-light))',
            color: '#fff', border: 'none', borderRadius: 'var(--radius-md)',
            fontSize: '15px', fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer',
            boxShadow: '0 4px 12px rgba(30,58,95,0.3)',
            transition: 'all var(--transition)',
          }}>
            {loading ? 'Ingresando...' : 'Ingresar'}
          </button>
        </form>

        <p style={{
          textAlign: 'center', marginTop: '24px',
          fontSize: '14px', color: 'var(--color-text-secondary)',
        }}>
          ¿No tenés cuenta?{' '}
          <Link to="/registrarse" style={{ color: 'var(--color-primary)', fontWeight: 600 }}>
            Registrate
          </Link>
        </p>
      </div>
    </div>
  );
}
