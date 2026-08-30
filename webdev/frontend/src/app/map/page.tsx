'use client';

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { StationId, StationData } from '@/types';
import { FALLBACK_STATIONS } from '@/lib/api';
import { PersonaType, getPersonaConfig } from '@/lib/persona';
import { ChoroplethMode, BasemapStyleKey } from '@/components/map/LayerControl';

import { HeaderNav } from '@/components/ui/HeaderNav';
import { Footer } from '@/components/ui/Footer';
import { MobileBottomSheet } from '@/components/ui/MobileBottomSheet';
import { SidebarContainer } from '@/components/sidebar/SidebarContainer';
import { SettingsModal } from '@/components/header/SettingsModal';
import { HelpModal } from '@/components/header/HelpModal';
import { FeedbackModal } from '@/components/header/FeedbackModal';

import { GovernmentPanel } from '@/components/dashboard/GovernmentPanel';
import { InvestorPanel } from '@/components/dashboard/InvestorPanel';
import { CommuterPanel } from '@/components/dashboard/CommuterPanel';

const MapContainer = dynamic(
  () => import('@/components/map/MapContainer').then((mod) => mod.MapContainer),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full bg-slate-950 flex items-center justify-center text-brand-lime text-xs gap-2">
        <div className="w-4 h-4 border-2 border-brand-lime border-t-transparent rounded-full animate-spin"></div>
        <span>Memuat Peta MapLibre GL & Basemap MAPID...</span>
      </div>
    )
  }
);

export default function WebGISPage() {
  const [activeStation, setActiveStation] = useState<StationId>('gubeng');
  const [activePersona, setActivePersona] = useState<PersonaType>('government');
  const [selectedH3Index, setSelectedH3Index] = useState<string | null>(null);
  
  const [choroplethMode, setChoroplethMode] = useState<ChoroplethMode>('tod_score');
  const [basemapStyle, setBasemapStyle] = useState<BasemapStyleKey>('street');
  const [showSurveyPoints, setShowSurveyPoints] = useState<boolean>(true);
  const [h3ScoreRange, setH3ScoreRange] = useState<[number, number]>([0, 100]);
  const [h3RingFilter, setH3RingFilter] = useState<number>(5);
  
  const [mapActionTrigger, setMapActionTrigger] = useState<any>(null);
  const [highlightedH3Index, setHighlightedH3Index] = useState<string | null>(null);

  // Modal states (differentiated between Settings, Help, and Feedback)
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);
  const [feedbackOpen, setFeedbackOpen] = useState(false);

  const currentStation: StationData =
    FALLBACK_STATIONS.find((s) => s.id === activeStation) || FALLBACK_STATIONS[0];

  // Auto-switch defaults when persona changes
  useEffect(() => {
    const config = getPersonaConfig(activePersona);
    setBasemapStyle(config.defaultBasemap);
    
    if (activePersona === 'government') setChoroplethMode('tod_score');
    if (activePersona === 'business') setChoroplethMode('njop_premium');
    if (activePersona === 'commuter') setChoroplethMode('typology');
  }, [activePersona]);

  const handleExecuteMapAction = (aiData: any) => {
    setMapActionTrigger(aiData);
    if (aiData.target_station) {
      setActiveStation(aiData.target_station as StationId);
    }
    if (aiData.target_layer === 'h3_njop_premium') {
      setChoroplethMode('njop_premium');
    }
    if (aiData.target_layer === 'survey_points') {
      setShowSurveyPoints(true);
    }
    if (aiData.highlight_h3_index) {
      setHighlightedH3Index(aiData.highlight_h3_index);
      setSelectedH3Index(aiData.highlight_h3_index);
    }
  };

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-[var(--background)]">
      {/* 1. Header Navigation Bar */}
      <HeaderNav
        activeStation={activeStation}
        onSelectStation={(stId) => setActiveStation(stId)}
        activePersona={activePersona}
        onChangePersona={setActivePersona}
        onOpenSettings={() => setSettingsOpen(true)}
        onOpenHelp={() => setHelpOpen(true)}
      />

      {/* 2. Main Work Area: Sidebar + Map + Analytics */}
      <main className="relative flex-1 flex overflow-hidden">
        
        {/* Left Sidebar */}
        <SidebarContainer
          activePersona={activePersona}
          activeStation={activeStation}
          choroplethMode={choroplethMode}
          onChangeChoroplethMode={setChoroplethMode}
          showSurveyPoints={showSurveyPoints}
          onToggleSurveyPoints={() => setShowSurveyPoints(!showSurveyPoints)}
          basemapStyle={basemapStyle}
          onChangeBasemapStyle={setBasemapStyle}
          h3ScoreRange={h3ScoreRange}
          onChangeH3ScoreRange={setH3ScoreRange}
          h3RingFilter={h3RingFilter}
          onChangeH3RingFilter={setH3RingFilter}
          onOpenSettings={() => setSettingsOpen(true)}
          onOpenHelp={() => setHelpOpen(true)}
          onOpenFeedback={() => setFeedbackOpen(true)}
        />

        {/* Central Map Canvas */}
        <div className="relative flex-1 h-full w-full">
          <MapContainer
            activeStation={activeStation}
            onSelectStation={(stId) => setActiveStation(stId)}
            activePersona={activePersona}
            choroplethMode={choroplethMode}
            basemapStyle={basemapStyle}
            showSurveyPoints={showSurveyPoints}
            h3ScoreRange={h3ScoreRange}
            h3RingFilter={h3RingFilter}
            highlightedH3Index={highlightedH3Index}
            onSelectH3Index={setSelectedH3Index}
            mapActionTrigger={mapActionTrigger}
          />
        </div>

        {/* Right Analytics Panel (Desktop) */}
        <aside className="hidden md:flex w-[400px] h-full flex-col glass-panel-accent z-20 overflow-hidden shadow-2xl flex-shrink-0">
          {activePersona === 'government' && (
            <GovernmentPanel 
              station={currentStation} 
              activeStation={activeStation}
              activeH3Index={selectedH3Index}
              onExecuteMapAction={handleExecuteMapAction}
            />
          )}
          {activePersona === 'business' && (
            <InvestorPanel 
              station={currentStation} 
              activeStation={activeStation}
              activeH3Index={selectedH3Index}
              onExecuteMapAction={handleExecuteMapAction}
            />
          )}
          {activePersona === 'commuter' && (
            <CommuterPanel 
              station={currentStation} 
              activeStation={activeStation}
              activeH3Index={selectedH3Index}
              onExecuteMapAction={handleExecuteMapAction}
            />
          )}
        </aside>

        {/* Mobile Responsive Bottom Sheet */}
        <MobileBottomSheet activePersona={activePersona} onChangePersona={setActivePersona}>
          {activePersona === 'government' && (
            <GovernmentPanel 
              station={currentStation} 
              activeStation={activeStation}
              activeH3Index={selectedH3Index}
              onExecuteMapAction={handleExecuteMapAction}
            />
          )}
          {activePersona === 'business' && (
            <InvestorPanel 
              station={currentStation} 
              activeStation={activeStation}
              activeH3Index={selectedH3Index}
              onExecuteMapAction={handleExecuteMapAction}
            />
          )}
          {activePersona === 'commuter' && (
            <CommuterPanel 
              station={currentStation} 
              activeStation={activeStation}
              activeH3Index={selectedH3Index}
              onExecuteMapAction={handleExecuteMapAction}
            />
          )}
        </MobileBottomSheet>
      </main>

      {/* 3. Footer Data Attribution */}
      <Footer activePersona={activePersona} />

      {/* ── Separate Modals ── */}
      <SettingsModal isOpen={settingsOpen} onClose={() => setSettingsOpen(false)} activePersona={activePersona} />
      <HelpModal isOpen={helpOpen} onClose={() => setHelpOpen(false)} activePersona={activePersona} />
      <FeedbackModal isOpen={feedbackOpen} onClose={() => setFeedbackOpen(false)} activePersona={activePersona} />
    </div>
  );
}
