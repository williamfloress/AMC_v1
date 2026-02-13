import { Link } from 'react-router-dom';
import { IconBuilding, IconMapPin, IconBarChart, IconFileText } from '../components/Icons';

export default function Inicio() {
  return (
    <div>
      <h1 className="acm-page-title" style={{ marginBottom: '0.25rem' }}>
        Te damos la bienvenida
      </h1>
      <p className="acm-muted" style={{ marginBottom: '1.5rem', fontSize: '1rem' }}>
        Análisis Comparativo de Mercado (AMC)
      </p>
      <p style={{ marginBottom: '1.5rem', fontSize: '1rem', color: 'var(--acm-text)' }}>
        ¿Qué acción deseas realizar hoy?
      </p>

      <div className="acm-action-cards" style={{ marginBottom: '2rem' }}>
        <Link to="/propiedades" className="acm-action-card">
          <div className="acm-action-card-icon">
            <IconBuilding />
          </div>
          <h2 className="acm-action-card-title">Mis propiedades</h2>
          <p className="acm-action-card-desc">
            Gestiona las propiedades comparables: agrega, edita o elimina inmuebles con sector, m², habitaciones, baños, estacionamientos y año.
          </p>
        </Link>
        <Link to="/sectores" className="acm-action-card">
          <div className="acm-action-card-icon">
            <IconMapPin />
          </div>
          <h2 className="acm-action-card-title">Sectores</h2>
          <p className="acm-action-card-desc">
            Crea y edita sectores o zonas (barrios) para organizar tus propiedades y realizar comparaciones por ubicación.
          </p>
        </Link>
        <Link to="/inmueble-en-estudio" className="acm-action-card">
          <div className="acm-action-card-icon">
            <IconBarChart />
          </div>
          <h2 className="acm-action-card-title">Análisis de mercado</h2>
          <p className="acm-action-card-desc">
            Calcula el valor de un inmueble usando datos de tus propiedades comparables en el mismo sector.
          </p>
        </Link>
        <Link to="/inmueble-en-estudio" className="acm-action-card">
          <div className="acm-action-card-icon">
            <IconFileText />
          </div>
          <h2 className="acm-action-card-title">Reporte de valuación</h2>
          <p className="acm-action-card-desc">
            Haz un Análisis Comparativo de Mercado (ACM) y obtén el valor de mercado estimado con estadísticas y comparables.
          </p>
        </Link>
      </div>

      <div className="acm-card" style={{ marginBottom: '1rem' }}>
        <h2 className="acm-card-title">¿Qué es el AMC?</h2>
        <p style={{ marginBottom: '0.75rem' }}>
          El <strong>Análisis Comparativo de Mercado</strong> estima el valor de un inmueble a partir de propiedades similares en el mismo sector. Se calcula un valor base por m² y un ajuste opcional por acabados (piso, cocina, baño).
        </p>
        <p style={{ marginBottom: 0 }}>
          Datos prioritarios: <strong>sector</strong>, <strong>área (m²)</strong>, <strong>cuartos</strong>, <strong>baños</strong>, <strong>estacionamientos</strong> y <strong>año de construcción</strong>. Los acabados son opcionales.
        </p>
      </div>

      <div className="acm-card">
        <h2 className="acm-card-title">Pasos para usar el AMC</h2>
        <ol style={{ margin: 0, paddingLeft: '1.5rem', lineHeight: 1.7 }}>
          <li><strong>Sectores</strong> — Crea las zonas donde tienes datos.</li>
          <li><strong>Propiedades</strong> — Carga los inmuebles comparables (sector, m², habitaciones, baños, parqueos, año, acabados, precio).</li>
          <li><strong>Reportes ACM</strong> — Ingresa los datos del inmueble a valuar y calcula el valor de mercado estimado.</li>
        </ol>
      </div>
    </div>
  );
}
