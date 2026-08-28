import { useEffect, useRef } from 'react';
import * as maplibregl from 'maplibre-gl';
import { StationId, StationData } from '@/types';
import { FALLBACK_STATIONS } from '@/lib/api';

export function useStationMarkers(
  map: maplibregl.Map | null,
  isMapLoaded: boolean,
  onSelectStation: (stationId: StationId) => void
) {
  const markersRef = useRef<maplibregl.Marker[]>([]);

  useEffect(() => {
    if (!map || !isMapLoaded) return;

    // Clear existing markers if re-rendering
    markersRef.current.forEach(marker => marker.remove());
    markersRef.current = [];

    console.log('Adding station markers to map...');
    FALLBACK_STATIONS.forEach((st: StationData) => {
      const el = document.createElement('div');
      el.className = 'station-marker-pin cursor-pointer group z-50';
      el.innerHTML = `
        <div style="position: relative; display: flex; align-items: center; justify-content: center;">
          <div style="width: 32px; height: 32px; border-radius: 50%; background: linear-gradient(to top right, #4FC5C2, #B1FC91); border: 2px solid #12175E; box-shadow: 0 10px 15px -3px rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; color: white;">
            <svg style="width: 16px; height: 16px;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path>
            </svg>
          </div>
          <div style="position: absolute; bottom: -24px; white-space: nowrap; background: rgba(15, 23, 42, 0.9); color: white; font-weight: bold; font-size: 10px; padding: 2px 8px; border-radius: 4px; box-shadow: 0 1px 3px rgba(0,0,0,0.5); border: 1px solid #334155; pointer-events: none;">
            ${st.name.replace('Stasiun Surabaya ', 'St. ')}
          </div>
        </div>
      `;

      el.addEventListener('click', () => {
        onSelectStation(st.id as StationId);
      });

      const marker = new maplibregl.Marker({ element: el })
        .setLngLat([st.longitude, st.latitude])
        .addTo(map);
        
      markersRef.current.push(marker);
    });

    return () => {
      markersRef.current.forEach(marker => marker.remove());
      markersRef.current = [];
    };
  }, [map, isMapLoaded, onSelectStation]);
}
