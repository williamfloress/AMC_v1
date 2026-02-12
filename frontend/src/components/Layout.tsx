import { ReactNode } from 'react';
import { NavLink } from 'react-router-dom';

type LayoutProps = { children: ReactNode };

export default function Layout({ children }: LayoutProps) {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <header
        style={{
          padding: '1rem 1.5rem',
          background: '#1a1a1a',
          color: '#fff',
          display: 'flex',
          alignItems: 'center',
          gap: '1.5rem',
        }}
      >
        <strong style={{ fontSize: '1.125rem' }}>AMC</strong>
        <nav style={{ display: 'flex', gap: '1rem' }}>
          <NavLink
            to="/propiedades"
            style={({ isActive }) => ({
              color: isActive ? '#7dd3fc' : '#e5e5e5',
              textDecoration: 'none',
            })}
          >
            Propiedades
          </NavLink>
          <NavLink
            to="/inmueble-en-estudio"
            style={({ isActive }) => ({
              color: isActive ? '#7dd3fc' : '#e5e5e5',
              textDecoration: 'none',
            })}
          >
            Inmueble en estudio
          </NavLink>
        </nav>
      </header>
      <main style={{ flex: 1, padding: '1.5rem', maxWidth: 1200, margin: '0 auto', width: '100%' }}>
        {children}
      </main>
    </div>
  );
}
