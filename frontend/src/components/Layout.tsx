import { ReactNode, useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import {
  IconHome,
  IconBuilding,
  IconMapPin,
  IconBarChart,
  IconWrench,
  IconHelp,
  IconCheck,
  IconChevronDown,
} from './Icons';

type LayoutProps = { children: ReactNode };

export default function Layout({ children }: LayoutProps) {
  const [herramientasOpen, setHerramientasOpen] = useState(true);

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <aside className="acm-sidebar">
        <Link to="/" className="acm-sidebar-brand">
          <span style={{ color: 'var(--acm-primary)' }}>
            <IconCheck />
          </span>
          AMC
        </Link>
        <nav className="acm-sidebar-nav">
          <div className="acm-sidebar-section">
            <NavLink
              to="/"
              end
              className={({ isActive: active }) => `acm-sidebar-link ${active ? 'active' : ''}`}
            >
              <IconHome />
              Inicio
            </NavLink>
          </div>
          <div className="acm-sidebar-section">
            <NavLink
              to="/sectores"
              className={({ isActive: active }) => `acm-sidebar-link ${active ? 'active' : ''}`}
            >
              <IconMapPin />
              Sectores
            </NavLink>
          </div>
          <div className="acm-sidebar-section">
            <NavLink
              to="/propiedades"
              className={({ isActive: active }) => `acm-sidebar-link ${active ? 'active' : ''}`}
            >
              <IconBuilding />
              Mis propiedades
            </NavLink>
          </div>
          <div className="acm-sidebar-section">
            <button
              type="button"
              className="acm-sidebar-section-title"
              onClick={() => setHerramientasOpen(!herramientasOpen)}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                width: '100%',
                textAlign: 'left',
              }}
            >
              <IconWrench />
              Herramientas
              <span style={{ marginLeft: 'auto', opacity: herramientasOpen ? 1 : 0.6 }}>
                <span style={{ display: 'inline-flex', transform: herramientasOpen ? 'rotate(0deg)' : 'rotate(-90deg)', transition: 'transform 0.2s' }}>
                <IconChevronDown />
              </span>
              </span>
            </button>
            {herramientasOpen && (
              <>
                <NavLink
                  to="/inmueble-en-estudio"
                  className={({ isActive: active }) => `acm-sidebar-link ${active ? 'active' : ''}`}
                  style={{ paddingLeft: '2rem' }}
                >
                  <IconBarChart />
                  Reportes ACM
                </NavLink>
              </>
            )}
          </div>
        </nav>
    </aside>
    <div className="acm-main-wrap">
        <header className="acm-topbar">
          <button type="button" className="acm-topbar-help">
            <IconHelp />
            Buscar ayuda
          </button>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--acm-primary)' }}>
            <IconCheck />
            <span style={{ fontSize: '0.875rem', color: 'var(--acm-text-muted)' }}>AMC</span>
          </div>
        </header>
      <main className="acm-main">{children}</main>
    </div>
  </div>
  );
}
