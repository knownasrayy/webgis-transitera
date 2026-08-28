'use client';

import React, { useEffect, useRef, useState } from 'react';
import * as maplibregl from 'maplibre-gl';
import { StationId } from '@/types';
import { BASEMAP_STYLES, SURABAYA_CENTER, SURABAYA_DEFAULT_ZOOM } from '@/lib/mapid';
import { FALLBACK_STATIONS, fetchMapidSurvey } from '@/lib/api';
import { ChoroplethMode, BasemapStyleKey } from './LayerControl';
import { PersonaType } from '@/lib/persona';

import { useH3Layer } from './useH3Layer';
import { useStationMarkers } from './useStationMarkers';

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

  // 1. Initialize MapLibre GL Map Instance
  useEffect(() => {
    if (!mapContainerRef.current) return;

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

    map.on('error', (e) => {
      console.error('MAPLIBRE ERROR:', e.error || e);
    });

    map.on('load', () => {
      map.resize();
      setTimeout(() => map.resize(), 100);
      setTimeout(() => map.resize(), 500);
      setIsMapLoaded(true);
    });

    mapRef.current = map;

    return () => {
      console.log('Cleaning up MapLibre instance...');
      map.remove();
      mapRef.current = null;
    };
  }, []);

  // Use Custom Hooks for Modular Layers
  useH3Layer(mapRef.current, isMapLoaded, choroplethMode, onSelectH3Index);
  useStationMarkers(mapRef.current, isMapLoaded, onSelectStation);

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
            'line-color': '#B1FC91',
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

  // 2. Survey Points Layer
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
              'circle-color': '#4FC5C2',
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
          <div className="bg-slate-900/80 backdrop-blur-md border border-brand-lime/30 shadow-lg shadow-brand-lime/10 px-4 py-2 rounded-xl text-center">
            <h2 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-brand-lime animate-pulse" />
              Surabaya Gubeng Area - Retail Success H3 Analysis
            </h2>
          </div>
        </div>
      )}
    </div>
  );
};
