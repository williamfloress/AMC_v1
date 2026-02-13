import { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { CARACAS_CENTER, getSectorCenter } from '../constants/mapSectors';

const DEFAULT_ZOOM = 12;

// Fix default marker icon in react-leaflet (webpack/vite)
const defaultIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});
L.Marker.prototype.options.icon = defaultIcon;

export interface MapPickerValue {
  lat: number;
  lng: number;
}

type MapPickerProps = {
  value: MapPickerValue | null;
  onChange: (value: MapPickerValue | null) => void;
  height?: string;
  /** Nombre del sector seleccionado: centra el mapa en ese sector cuando no hay pin */
  sectorNombre?: string;
};

function MapClickHandler({ onChange }: { onChange: (v: MapPickerValue) => void }) {
  useMapEvents({
    click(e) {
      onChange({ lat: e.latlng.lat, lng: e.latlng.lng });
    },
  });
  return null;
}

function ChangeView({ center, zoom }: { center: [number, number]; zoom: number }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, zoom);
  }, [map, center[0], center[1], zoom]);
  return null;
}

export default function MapPicker({ value, onChange, height = '280px', sectorNombre }: MapPickerProps) {
  const center: [number, number] = value
    ? [value.lat, value.lng]
    : (sectorNombre ? getSectorCenter(sectorNombre) : CARACAS_CENTER);
  const zoom = value ? 17 : DEFAULT_ZOOM;

  return (
    <div
      className="acm-map-picker"
      style={{
        height,
        borderRadius: 8,
        overflow: 'hidden',
        border: '1px solid var(--acm-border)',
        position: 'relative',
        minHeight: 0,
        width: '100%',
        isolation: 'isolate',
      }}
    >
      <MapContainer
        center={center}
        zoom={zoom}
        style={{ height: '100%', width: '100%' }}
        scrollWheelZoom
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <ChangeView center={center} zoom={zoom} />
        <MapClickHandler onChange={onChange} />
        {value && <Marker position={[value.lat, value.lng]} />}
      </MapContainer>
      <p className="acm-muted" style={{ margin: '0.35rem 0 0 0', fontSize: '0.8125rem' }}>
        Haga clic en el mapa para colocar el pin de la propiedad.
      </p>
    </div>
  );
}
