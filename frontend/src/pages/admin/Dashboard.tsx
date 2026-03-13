import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getProperties } from '../../services/propertyService';
import { getVisits } from '../../services/visitService';
import { getUnreadCount } from '../../services/messageService';
import { HiOfficeBuilding, HiCalendar, HiMail, HiPlus } from 'react-icons/hi';

export default function Dashboard() {
  const [stats, setStats] = useState({ properties: 0, visits: 0, unread: 0 });

  useEffect(() => {
    const load = async () => {
      try {
        const [propsRes, visitsRes, msgRes] = await Promise.all([
          getProperties({ limit: 1 }),
          getVisits(),
          getUnreadCount(),
        ]);
        setStats({
          properties: propsRes.total || 0,
          visits: (visitsRes.data || []).length,
          unread: msgRes.data?.count || 0,
        });
      } catch (err) {
        console.error(err);
      }
    };
    load();
  }, []);

  const cards = [
    { label: 'Propiedades', value: stats.properties, icon: <HiOfficeBuilding />, color: 'var(--color-primary)', link: '/admin/propiedades' },
    { label: 'Visitas agendadas', value: stats.visits, icon: <HiCalendar />, color: 'var(--color-accent)', link: '/admin/visitas' },
    { label: 'Mensajes sin leer', value: stats.unread, icon: <HiMail />, color: 'var(--color-danger)', link: '/admin/mensajes' },
  ];

  return (
    <div>
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        marginBottom: '32px', flexWrap: 'wrap', gap: '12px',
      }}>
        <div>
          <h1 style={{ fontSize: '28px', fontWeight: 800 }}>Panel de administración</h1>
          <p style={{ color: 'var(--color-text-secondary)', marginTop: '4px' }}>
            Gestioná propiedades, visitas y mensajes
          </p>
        </div>
        <Link to="/admin/propiedades/nueva" style={{
          display: 'flex', alignItems: 'center', gap: '6px',
          padding: '12px 24px', borderRadius: 'var(--radius-md)',
          background: 'linear-gradient(135deg, var(--color-primary), var(--color-primary-light))',
          color: '#fff', fontWeight: 600, fontSize: '14px',
          boxShadow: '0 4px 12px rgba(30,58,95,0.3)',
        }}>
          <HiPlus /> Nueva propiedad
        </Link>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
        gap: '20px', marginBottom: '32px',
      }}>
        {cards.map((card) => (
          <Link
            key={card.label}
            to={card.link}
            style={{
              background: '#fff', borderRadius: 'var(--radius-lg)',
              padding: '24px', boxShadow: 'var(--shadow-sm)',
              display: 'flex', alignItems: 'center', gap: '16px',
              transition: 'all var(--transition)',
              textDecoration: 'none', color: 'inherit',
              borderLeft: `4px solid ${card.color}`,
            }}
            onMouseEnter={(e) => { e.currentTarget.style.boxShadow = 'var(--shadow-md)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.boxShadow = 'var(--shadow-sm)'; e.currentTarget.style.transform = 'translateY(0)'; }}
          >
            <div style={{
              width: '48px', height: '48px', borderRadius: '12px',
              background: `${card.color}15`, color: card.color,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '22px',
            }}>{card.icon}</div>
            <div>
              <p style={{ fontSize: '28px', fontWeight: 700 }}>{card.value}</p>
              <p style={{ fontSize: '13px', color: 'var(--color-text-secondary)' }}>{card.label}</p>
            </div>
          </Link>
        ))}
      </div>

      {/* Quick links */}
      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '12px',
      }}>
        {[
          { label: 'Gestionar propiedades', path: '/admin/propiedades' },
          { label: 'Ver visitas', path: '/admin/visitas' },
          { label: 'Ver mensajes', path: '/admin/mensajes' },
        ].map((link) => (
          <Link
            key={link.path}
            to={link.path}
            style={{
              padding: '16px 20px', borderRadius: 'var(--radius-md)',
              border: '1px solid var(--color-border)', background: '#fff',
              fontSize: '14px', fontWeight: 500, textAlign: 'center',
              transition: 'all var(--transition)',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--color-primary)'; e.currentTarget.style.color = 'var(--color-primary)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--color-border)'; e.currentTarget.style.color = 'var(--color-text)'; }}
          >
            {link.label}
          </Link>
        ))}
      </div>
    </div>
  );
}
