import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { CARACAS_CENTER, getSectorCenter } from '../constants/mapSectors';

/** Item mínimo para mostrar un pin en el mapa (propiedades o comparables del reporte) */
export interface MapPropertyItem {
  id: number;
  sectorId?: number;
  sector: { id: number; nombre: string };
  latitud?: number | null;
  longitud?: number | null;
  areaConstruccionM2: number;
  precio: number;
  estado?: string;
}

const DEFAULT_ZOOM = 12;

/** Para items sin lat/lng: posición del sector + offset pseudo-aleatorio por id (reproducible) */
function getPropertyPosition(p: MapPropertyItem): [number, number] {
  if (p.latitud != null && p.longitud != null) {
    return [p.latitud, p.longitud];
  }
  const [lat, lng] = getSectorCenter(p.sector.nombre);
  const offset = 0.002;
  const seed = p.id * 31 + (p.sectorId ?? 0);
  const latOffset = ((seed % 100) / 100 - 0.5) * 2 * offset;
  const lngOffset = (((seed * 7) % 100) / 100 - 0.5) * 2 * offset;
  return [lat + latOffset, lng + lngOffset];
}

const defaultIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

type PropiedadesMapProps = {
  propiedades: MapPropertyItem[];
  height?: string;
  /** Texto opcional bajo el mapa (ej. en reporte) */
  caption?: string;
};

export default function PropiedadesMap({ propiedades, height = '360px', caption }: PropiedadesMapProps) {
  const positions = propiedades.map((p) => ({ prop: p, pos: getPropertyPosition(p) }));

  return (
    <div className="acm-propiedades-map" style={{ height, borderRadius: 8, overflow: 'hidden', border: '1px solid var(--acm-border)', position: 'relative' }}>
      <MapContainer
        center={CARACAS_CENTER}
        zoom={DEFAULT_ZOOM}
        style={{ height: '100%', width: '100%' }}
        scrollWheelZoom
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {positions.map(({ prop: p, pos }) => (
          <Marker key={p.id} position={pos} icon={defaultIcon}>
            <Popup>
              <strong>{p.sector.nombre}</strong>
              <br />
              {p.areaConstruccionM2} m² · {p.precio.toLocaleString()} USD
              <br />
              {p.estado != null && p.estado !== '' && (
                <span className={`acm-badge acm-badge-${p.estado}`}>{p.estado}</span>
              )}
            </Popup>
          </Marker>
        ))}
      </MapContainer>
      <p className="acm-muted" style={{ margin: '0.35rem 0 0 0', fontSize: '0.8125rem' }}>
        {caption ?? 'Mapa de simulación: propiedades ubicadas por sector (Caracas). Sin coordenadas reales se muestra una posición aproximada del sector.'}
      </p>
    </div>
  );
}
