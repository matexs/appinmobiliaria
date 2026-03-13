import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import { LoadingScreen } from './components/common/Common';
import Home from './pages/Home';
import PropertyList from './pages/PropertyList';
import PropertyDetail from './pages/PropertyDetail';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/user/Profile';
import Dashboard from './pages/admin/Dashboard';
import PropertyManagement from './pages/admin/PropertyManagement';
import PropertyForm from './pages/admin/PropertyForm';
import VisitManagement from './pages/admin/VisitManagement';
import MessageManagement from './pages/admin/MessageManagement';
import { Link } from 'react-router-dom';
import { HiOfficeBuilding, HiCalendar, HiMail, HiChartBar, HiArrowLeft } from 'react-icons/hi';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  if (loading) return <LoadingScreen />;
  if (!user) return <Navigate to="/ingresar" replace />;
  return <>{children}</>;
}

function AdminRoute() {
  const { user, loading } = useAuth();
  if (loading) return <LoadingScreen />;
  if (!user || user.role !== 'admin') return <Navigate to="/" replace />;
  return (
    <div style={{ display: 'flex', minHeight: 'calc(100vh - 72px)' }}>
      {/* Admin Sidebar */}
      <aside style={{
        width: '240px', background: '#fff',
        borderRight: '1px solid var(--color-border)',
        padding: '24px 0', flexShrink: 0,
      }}
        className="admin-sidebar"
      >
        <div style={{ padding: '0 16px', marginBottom: '24px' }}>
          <Link to="/" style={{
            display: 'flex', alignItems: 'center', gap: '6px',
            fontSize: '13px', color: 'var(--color-text-secondary)',
          }}>
            <HiArrowLeft /> Volver al sitio
          </Link>
        </div>
        {[
          { label: 'Dashboard', path: '/admin', icon: <HiChartBar /> },
          { label: 'Propiedades', path: '/admin/propiedades', icon: <HiOfficeBuilding /> },
          { label: 'Visitas', path: '/admin/visitas', icon: <HiCalendar /> },
          { label: 'Mensajes', path: '/admin/mensajes', icon: <HiMail /> },
        ].map((item) => (
          <Link
            key={item.path}
            to={item.path}
            style={{
              display: 'flex', alignItems: 'center', gap: '10px',
              padding: '12px 20px', fontSize: '14px', fontWeight: 500,
              color: 'var(--color-text-secondary)',
              transition: 'all var(--transition)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(30,58,95,0.05)';
              e.currentTarget.style.color = 'var(--color-primary)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent';
              e.currentTarget.style.color = 'var(--color-text-secondary)';
            }}
          >
            {item.icon} {item.label}
          </Link>
        ))}
      </aside>

      {/* Admin content */}
      <main style={{ flex: 1, padding: '32px', overflow: 'auto' }}>
        <Outlet />
      </main>

      <style>{`
        @media (max-width: 768px) {
          .admin-sidebar { display: none !important; }
        }
      `}</style>
    </div>
  );
}

function PublicLayout() {
  return (
    <>
      <Navbar />
      <main style={{ minHeight: 'calc(100vh - 72px - 200px)' }}>
        <Outlet />
      </main>
      <Footer />
    </>
  );
}

function AppRoutes() {
  return (
    <Routes>
      {/* Public routes */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/propiedades" element={<PropertyList />} />
        <Route path="/propiedades/:id" element={<PropertyDetail />} />
        <Route path="/ingresar" element={<Login />} />
        <Route path="/registrarse" element={<Register />} />
        <Route path="/perfil" element={
          <ProtectedRoute><Profile /></ProtectedRoute>
        } />
      </Route>

      {/* Admin routes */}
      <Route path="/admin" element={<AdminRoute />}>
        <Route index element={<Dashboard />} />
        <Route path="propiedades" element={<PropertyManagement />} />
        <Route path="propiedades/nueva" element={<PropertyForm />} />
        <Route path="propiedades/:id/editar" element={<PropertyForm />} />
        <Route path="visitas" element={<VisitManagement />} />
        <Route path="mensajes" element={<MessageManagement />} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              borderRadius: '10px',
              background: '#fff',
              color: '#1a1a2e',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
              fontSize: '14px',
            },
          }}
        />
      </AuthProvider>
    </BrowserRouter>
  );
}
