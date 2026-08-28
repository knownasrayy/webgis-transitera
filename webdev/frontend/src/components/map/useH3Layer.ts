import { useEffect } from 'react';
import * as maplibregl from 'maplibre-gl';
import { ChoroplethMode } from './LayerControl';
import { fetchH3Grid } from '@/lib/api';

export function useH3Layer(
  map: maplibregl.Map | null,
  isMapLoaded: boolean,
  choroplethMode: ChoroplethMode,
  onSelectH3Index?: (index: string | null) => void
) {
  // 1. Initial Load
  useEffect(() => {
    if (!map || !isMapLoaded) return;

    let hoveredStateId: any = null;
    let popup: maplibregl.Popup | null = null;

    const initLayer = async () => {
      const h3Data = await fetchH3Grid();
      
      if (!map.getSource('h3-tod-source')) {
        map.addSource('h3-tod-source', {
          type: 'geojson',
          data: h3Data,
          generateId: true
        });

        map.addLayer({
          id: 'h3-tod-fill',
          type: 'fill',
          source: 'h3-tod-source',
          paint: {
            'fill-color': '#22C55E', // Default, will be updated by choroplethMode effect
            'fill-opacity': [
              'case',
              ['boolean', ['feature-state', 'hover'], false],
              0.88,
              0.62
            ]
          }
        });

        map.addLayer({
          id: 'h3-tod-border',
          type: 'line',
          source: 'h3-tod-source',
          paint: {
            'line-color': '#4A4478',
            'line-width': 1.0,
            'line-opacity': 0.65
          }
        });

        // Event Listeners
        map.on('mousemove', 'h3-tod-fill', (e) => {
          map.getCanvas().style.cursor = 'pointer';
          if (e.features && e.features.length > 0) {
            if (hoveredStateId !== null) {
              map.setFeatureState({ source: 'h3-tod-source', id: hoveredStateId }, { hover: false });
            }
            hoveredStateId = e.features[0].id;
            map.setFeatureState({ source: 'h3-tod-source', id: hoveredStateId }, { hover: true });
          }
        });

        map.on('mouseleave', 'h3-tod-fill', () => {
          map.getCanvas().style.cursor = '';
          if (hoveredStateId !== null) {
            map.setFeatureState({ source: 'h3-tod-source', id: hoveredStateId }, { hover: false });
          }
          hoveredStateId = null;
        });

        map.on('click', 'h3-tod-fill', (e) => {
          if (e.features && e.features.length > 0) {
            const props = e.features[0].properties;
            const coordinates = e.lngLat;
            
            if (onSelectH3Index) {
              onSelectH3Index(props.h3_index);
            }

            if (popup) popup.remove();

            const popupContent = `
              <div class="space-y-1.5 text-xs text-slate-100">
                <div class="flex items-center justify-between border-b border-slate-700 pb-1">
                  <span class="font-bold text-[#B1FC91]">Sel H3: ${props.h3_index}</span>
                  <span class="text-[10px] bg-[#4FC5C2]/20 px-1.5 py-0.5 rounded text-[#4FC5C2] font-semibold border border-[#4FC5C2]/40">${props.station_name}</span>
                </div>
                <div class="grid grid-cols-2 gap-2 text-[11px] pt-1">
                  <div>
                    <span class="text-slate-400">TOD Score:</span>
                    <div class="text-sm font-bold text-[#22C55E]">${props.tod_readiness_score} / 100</div>
                  </div>
                  <div>
                    <span class="text-slate-400">Est. %ΔNJOP:</span>
                    <div class="text-sm font-bold text-[#B1FC91]">+${props.predicted_njop_premium_pct}%</div>
                  </div>
                </div>
                <div class="text-[10px] text-slate-300 pt-1 border-t border-slate-800">
                  Tipologi: <strong class="text-slate-100">${props.typology}</strong>
                </div>
              </div>
            `;

            popup = new maplibregl.Popup({ closeButton: true, closeOnClick: false })
              .setLngLat(coordinates)
              .setHTML(popupContent)
              .addTo(map);
          }
        });
      }
    };

    initLayer();

    return () => {
      if (popup) popup.remove();
    };
  }, [map, isMapLoaded, onSelectH3Index]);

  // 2. Update Paint Property
  useEffect(() => {
    if (!map || !isMapLoaded || !map.getLayer('h3-tod-fill')) return;

    if (choroplethMode === 'tod_score') {
      map.setPaintProperty('h3-tod-fill', 'fill-color', [
        'interpolate',
        ['linear'],
        ['get', 'tod_readiness_score'],
        40, '#D32F2F',
        65, '#4FC5C2',
        80, '#22C55E',
        100, '#22C55E'
      ]);
    } else if (choroplethMode === 'njop_premium') {
      map.setPaintProperty('h3-tod-fill', 'fill-color', [
        'interpolate',
        ['linear'],
        ['get', 'predicted_njop_premium_pct'],
        3.0, '#3663D8',
        8.0, '#4FC5C2',
        14.0, '#22C55E',
        20.0, '#22C55E'
      ]);
    } else if (choroplethMode === 'typology') {
      map.setPaintProperty('h3-tod-fill', 'fill-color', [
        'match',
        ['get', 'typology'],
        'Commercial Transit Hub', '#B1FC91',
        'Mixed-Use Residential Area', '#4FC5C2',
        'Low-Accessibility Feeder Zone', '#473DD2',
        '#3A3468'
      ]);
    }
  }, [map, isMapLoaded, choroplethMode]);
}
