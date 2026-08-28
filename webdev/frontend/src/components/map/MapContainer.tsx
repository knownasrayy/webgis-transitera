'use client';

import React, { useEffect, useRef, useState } from 'react';
import * as maplibregl from 'maplibre-gl';
import { StationId } from '@/types';
import { BASEMAP_STYLES, SURABAYA_CENTER, SURABAYA_DEFAULT_ZOOM } from '@/lib/mapid';
import { FALLBACK_STATIONS, fetchH3Grid, fetchMapidSurvey } from '@/lib/api';
import { ChoroplethMode, BasemapStyleKey } from './LayerControl';
import { PersonaType, getPersonaConfig } from '@/lib/persona';

interface MapContainerProps {
  activeStation: StationId;
  onSelectStation: (stationId: StationId) => void;
  activePersona: PersonaType;
  choroplethMode: ChoroplethMode;
  basemapStyle: BasemapStyleKey;
  showSurveyPoints: boolean;
  highlightedH3Index?: string | null;
  onSelectH3Index?: (index: string | null) => void;
  mapActionTrigger?: any;
}

export const MapContainer: React.FC<MapContainerProps> = ({
  activeStation,
  onSelectStation,
  activePersona,
  choroplethMode,
  basemapStyle,
  showSurveyPoints,
  highlightedH3Index,
  onSelectH3Index,
  mapActionTrigger
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const popupRef = useRef<maplibregl.Popup | null>(null);

  // 1. Initialize MapLibre GL Map Instance
  useEffect(() => {
    if (!mapContainerRef.current) return;

    console.log('MapContainer useEffect triggered. Container:', mapContainerRef.current);
    console.log('Initializing MapLibre with style:', BASEMAP_STYLES[basemapStyle]);

    const currentStation = FALLBACK_STATIONS.find((s) => s.id === activeStation) || FALLBACK_STATIONS[0];

    const map = new maplibregl.Map({
      container: mapContainerRef.current,
      style: BASEMAP_STYLES[basemapStyle],
      center: [currentStation.longitude, currentStation.latitude],
      zoom: SURABAYA_DEFAULT_ZOOM,
      pitch: 30,
      bearing: 0
    });

    map.addControl(new maplibregl.NavigationControl({ visualizePitch: true }), 'top-right');
    map.addControl(new maplibregl.ScaleControl({ unit: 'metric' }), 'bottom-left');

    console.log('Map controls added successfully.');

    map.on('error', (e) => {
      console.error('MAPLIBRE ERROR:', e.error || e);
    });

    map.on('load', async () => {
      console.log('MapLibre LOAD event fired!');
      // Force resize multiple times to ensure the canvas has the correct dimensions
      map.resize();
      setTimeout(() => map.resize(), 100);
      setTimeout(() => map.resize(), 500);
      setIsMapLoaded(true);

      // Load and add H3 GeoJSON data source
      const h3Data = await fetchH3Grid();
      if (!map.getSource('h3-tod-source')) {
        map.addSource('h3-tod-source', {
          type: 'geojson',
          data: h3Data,
          generateId: true
        });

        // 1. Fill layer with dynamic color ramp based on mode
        map.addLayer({
          id: 'h3-tod-fill',
          type: 'fill',
          source: 'h3-tod-source',
          paint: {
            'fill-color': [
              'interpolate',
              ['linear'],
              ['get', 'tod_readiness_score'],
              40, '#ef4444', // Red
              65, '#f59e0b', // Amber
              80, '#10b981', // Emerald
              100, '#047857' // Deep Emerald
            ],
            'fill-opacity': [
              'case',
              ['boolean', ['feature-state', 'hover'], false],
              0.88,
              0.62
            ]
          }
        });

        // 2. Hexagon Outline Layer
        map.addLayer({
          id: 'h3-tod-border',
          type: 'line',
          source: 'h3-tod-source',
          paint: {
            'line-color': '#ffffff',
            'line-width': 1.0,
            'line-opacity': 0.65
          }
        });
      }

      // Add Station Point Markers (with slight delay to ensure DOM is ready)
      setTimeout(() => {
        console.log('Adding station markers to map...');
        FALLBACK_STATIONS.forEach((st) => {
          const el = document.createElement('div');
          el.className = 'station-marker-pin cursor-pointer group z-50';
          el.innerHTML = `
            <div style="position: relative; display: flex; align-items: center; justify-content: center;">
              <div style="width: 32px; height: 32px; border-radius: 50%; background: linear-gradient(to top right, #f97316, #f59e0b); border: 2px solid white; box-shadow: 0 10px 15px -3px rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; color: white;">
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
            onSelectStation(st.id);
          });

          new maplibregl.Marker({ element: el })
            .setLngLat([st.longitude, st.latitude])
            .addTo(map);
        });
      }, 500);
    });

    let hoveredStateId: any = null;

    // Hover interactive state on H3 polygons
    map.on('mousemove', 'h3-tod-fill', (e) => {
      if (e.features && e.features.length > 0) {
        map.getCanvas().style.cursor = 'pointer';
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

    // Click on H3 Polygon opens rich popup
    map.on('click', 'h3-tod-fill', (e) => {
      if (e.features && e.features.length > 0) {
        const props = e.features[0].properties;
        const coordinates = e.lngLat;
        
        if (onSelectH3Index) {
          onSelectH3Index(props.h3_index);
        }

        if (popupRef.current) popupRef.current.remove();

        const popupContent = `
          <div class="space-y-1.5 text-xs text-slate-100">
            <div class="flex items-center justify-between border-b border-slate-700 pb-1">
              <span class="font-bold text-orange-400">Sel H3: ${props.h3_index}</span>
              <span class="text-[10px] bg-orange-950/60 px-1.5 py-0.5 rounded text-orange-300 font-semibold border border-orange-800/40">${props.station_name}</span>
            </div>
            <div class="grid grid-cols-2 gap-2 text-[11px] pt-1">
              <div>
                <span class="text-slate-400">TOD Score:</span>
                <div class="text-sm font-bold text-emerald-400">${props.tod_readiness_score} / 100</div>
              </div>
              <div>
                <span class="text-slate-400">Est. %ΔNJOP:</span>
                <div class="text-sm font-bold text-cyan-400">+${props.predicted_njop_premium_pct}%</div>
              </div>
            </div>
            <div class="text-[10px] text-slate-300 pt-1 border-t border-slate-800">
              Tipologi: <strong class="text-slate-100">${props.typology}</strong>
            </div>
          </div>
        `;

        popupRef.current = new maplibregl.Popup({ closeButton: true, closeOnClick: false })
          .setLngLat(coordinates)
          .setHTML(popupContent)
          .addTo(map);
      }
    });

    mapRef.current = map;

    return () => {
      console.log('Cleaning up MapLibre instance...');
      map.remove();
      mapRef.current = null;
    };
  }, []);

  // 1.5 Add Feeder Routes layer for Commuter Persona
  useEffect(() => {
    if (!mapRef.current || !isMapLoaded) return;
    const map = mapRef.current;
    
    if (activePersona === 'commuter') {
      if (!map.getSource('feeder-routes-source')) {
        map.addSource('feeder-routes-source', {
          type: 'geojson',
          data: {
            type: 'FeatureCollection',
            features: [
              {
                type: 'Feature',
                properties: {},
                geometry: {
                  type: 'LineString',
                  coordinates: [
                    [112.7521, -7.2654], // Gubeng
                    [112.7481, -7.2704],
                    [112.7431, -7.2754],
                    [112.7383, -7.3014]  // Wonokromo
                  ]
                }
              }
            ]
          }
        });
        map.addLayer({
          id: 'feeder-routes-line',
          type: 'line',
          source: 'feeder-routes-source',
          paint: {
            'line-color': '#ff7c00',
            'line-width': 3,
            'line-dasharray': [2, 2],
            'line-opacity': 0.8
          }
        });
      } else {
        if (map.getLayer('feeder-routes-line')) {
          map.setLayoutProperty('feeder-routes-line', 'visibility', 'visible');
        }
      }
    } else {
      if (map.getLayer('feeder-routes-line')) {
        map.setLayoutProperty('feeder-routes-line', 'visibility', 'none');
      }
    }
  }, [activePersona, isMapLoaded]);

  // 2. Update Map Style when Basemap changes
  useEffect(() => {
    if (!mapRef.current || !isMapLoaded) return;
    const map = mapRef.current;

    if (showSurveyPoints) {
      fetchMapidSurvey().then((surveyData) => {
        if (!map.getSource('survey-points-source')) {
          map.addSource('survey-points-source', {
            type: 'geojson',
            data: surveyData
          });

          map.addLayer({
            id: 'survey-points-circle',
            type: 'circle',
            source: 'survey-points-source',
            paint: {
              'circle-radius': 5,
              'circle-color': '#ec4899', // Pink for survey points
              'circle-stroke-width': 1.5,
              'circle-stroke-color': '#ffffff'
            }
          });
        } else {
          (map.getSource('survey-points-source') as maplibregl.GeoJSONSource).setData(surveyData);
          if (map.getLayer('survey-points-circle')) {
            map.setLayoutProperty('survey-points-circle', 'visibility', 'visible');
          }
        }
      });
    } else {
      if (map.getLayer('survey-points-circle')) {
        map.setLayoutProperty('survey-points-circle', 'visibility', 'none');
      }
    }
  }, [showSurveyPoints, isMapLoaded]);

  // 2.5 Update Map Style when Basemap changes
  useEffect(() => {
    if (!mapRef.current || !isMapLoaded) return;
    mapRef.current.setStyle(BASEMAP_STYLES[basemapStyle]);
  }, [basemapStyle]);

  // 3. Update Choropleth Paint Property when Mode changes
  useEffect(() => {
    if (!mapRef.current || !isMapLoaded) return;
    const map = mapRef.current;
    if (!map.getLayer('h3-tod-fill')) return;

    if (choroplethMode === 'tod_score') {
      map.setPaintProperty('h3-tod-fill', 'fill-color', [
        'interpolate',
        ['linear'],
        ['get', 'tod_readiness_score'],
        40, '#ef4444',
        65, '#f59e0b',
        80, '#10b981',
        100, '#047857'
      ]);
    } else if (choroplethMode === 'njop_premium') {
      map.setPaintProperty('h3-tod-fill', 'fill-color', [
        'interpolate',
        ['linear'],
        ['get', 'predicted_njop_premium_pct'],
        3.0, '#6366f1',
        8.0, '#3b82f6',
        14.0, '#10b981',
        20.0, '#047857'
      ]);
    } else if (choroplethMode === 'typology') {
      map.setPaintProperty('h3-tod-fill', 'fill-color', [
        'match',
        ['get', 'typology'],
        'Commercial Transit Hub', '#06b6d4',
        'Mixed-Use Residential Area', '#f59e0b',
        'Low-Accessibility Feeder Zone', '#a855f7',
        '#64748b'
      ]);
    }
  }, [choroplethMode, isMapLoaded]);

  // 4. Fly to station when activeStation changes
  useEffect(() => {
    if (!mapRef.current || !isMapLoaded) return;
    const st = FALLBACK_STATIONS.find((s) => s.id === activeStation);
    if (st) {
      mapRef.current.flyTo({
        center: [st.longitude, st.latitude],
        zoom: 14.5,
        pitch: 35,
        essential: true,
        duration: 1500
      });
    }
  }, [activeStation, isMapLoaded]);

  // 5. React to Spatial AI Trigger Action
  useEffect(() => {
    if (!mapRef.current || !isMapLoaded || !mapActionTrigger) return;
    const map = mapRef.current;
    const vs = mapActionTrigger.view_state;

    if (vs && vs.center) {
      map.flyTo({
        center: vs.center,
        zoom: vs.zoom || 14.0,
        pitch: vs.pitch || 30,
        essential: true,
        duration: 1800
      });
    }
  }, [mapActionTrigger, isMapLoaded]);

  return (
    <div className="relative w-full h-full">
      <div ref={mapContainerRef} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} />
      
      {/* Title Overlay for Business Persona */}
      {activePersona === 'business' && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10 pointer-events-none">
          <div className="bg-slate-900/80 backdrop-blur-md border border-orange-500/30 shadow-lg shadow-orange-500/10 px-4 py-2 rounded-xl text-center">
            <h2 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
              Surabaya Gubeng Area - Retail Success H3 Analysis
            </h2>
          </div>
        </div>
      )}
    </div>
  );
};
