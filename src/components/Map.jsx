import { useEffect, useState } from 'react'
import { MapContainer, TileLayer, CircleMarker, Popup, useMap } from 'react-leaflet'
import axios from 'axios'

// Component to handle dynamic center if needed
function MapEffects({ center }) {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.setView(center, map.getZoom());
    }
  }, [center, map]);
  return null;
}

export default function MapView() {
  const [denuncias, setDenuncias] = useState([]);
  const [loading, setLoading] = useState(true);
  const recifeCenter = [-8.05428, -34.8813];

  useEffect(() => {
    const fetchDenuncias = async () => {
      try {
        setLoading(true);
        const timestamp = new Date().getTime();
        const response = await axios.get(`/api/denuncias?t=${timestamp}`, {
          headers: {
            'ngrok-skip-browser-warning': 'true'
          }
        });
        
        if (response.data && Array.isArray(response.data)) {
          console.log("🔥 [DEBUG] Recebido da API:", response.data);
          const validas = response.data.filter(d => d.lat != null && d.lng != null);
          console.log("🔥 [DEBUG] Denuncias validas com Lat/Lng:", validas);
          setDenuncias(response.data);
        }
      } catch (error) {
        console.error("Error fetching reports:", error);
        // Mock data fallback if backend is down for testing UI
        setDenuncias([
          { id: 1, lat: -8.05428, lng: -34.8813, risco: 'alto', tipo_lixo: 'Entulho' },
          { id: 2, lat: -8.06428, lng: -34.8713, risco: 'baixo', tipo_lixo: 'Plástico' },
          { id: 3, lat: -8.04428, lng: -34.8913, risco: 'medio', tipo_lixo: 'Móveis' },
        ]);
      } finally {
        setLoading(false);
      }
    };
    fetchDenuncias();
  }, []);

  const getMarkerColor = (risco) => {
    const r = risco?.toLowerCase() || '';
    if (r.includes('alt')) return '#ef4444'; // Red (alto, alta)
    if (r.includes('méd') || r.includes('med')) return '#eab308'; // Yellow (medio, média)
    if (r.includes('baix')) return '#22c55e'; // Green (baixo, baixa)
    return '#3b82f6'; // Blue fallback
  };

  return (
    <div className="h-full w-full relative z-0">
      <MapContainer 
        center={recifeCenter} 
        zoom={13} 
        scrollWheelZoom={true}
        className="h-full w-full"
        zoomControl={false}
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
        />
        {denuncias.filter(d => d.lat != null && d.lng != null).map((denuncia) => (
          <CircleMarker
            key={denuncia.id}
            center={[denuncia.lat, denuncia.lng]}
            radius={12}
            pathOptions={{
              color: getMarkerColor(denuncia.intensidade),
              fillColor: getMarkerColor(denuncia.intensidade),
              fillOpacity: 0.6,
              weight: 2
            }}
          >
            <Popup className="rounded-xl">
              <div className="p-1">
                <h3 className="font-semibold text-zela-text">Risco: {denuncia.risco}</h3>
                <p className="text-sm text-gray-600">Tipo: {denuncia.tipo_lixo}</p>
              </div>
            </Popup>
          </CircleMarker>
        ))}
      </MapContainer>
      
      {loading && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-white px-4 py-2 rounded-full shadow-md z-[1000] text-sm font-medium text-zela-dark">
          Carregando denúncias...
        </div>
      )}
    </div>
  );
}
