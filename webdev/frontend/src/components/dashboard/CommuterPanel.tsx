'use client';

import React from 'react';
import { StationData, StationId } from '@/types';
import { DiamondGauge } from './DiamondGauge';
import { MenuGoDiscovery } from './MenuGoDiscovery';
import { TravelEstimator } from './TravelEstimator';
import { AIChatPanel } from '@/components/ai/AIChatPanel';
import { Footprints, Train } from 'lucide-react';

interface CommuterPanelProps {
  station: StationData;
  activeStation: StationId;
  activeH3Index?: string | null;
  onExecuteMapAction?: (data: any) => void;
}

export const CommuterPanel: React.FC<CommuterPanelProps> = ({
  station,
  activeStation,
  activeH3Index,
  onExecuteMapAction,
}) => {
  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Panel Header */}
      <div className="px-4 py-3 border-b border-slate-800/80 flex-shrink-0">
        <h3 className="text-xs font-bold text-slate-100">Analytical Insights</h3>
        <p className="text-[10px] text-slate-500">Commuter Companion</p>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        
        {/* Walkability Index */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-3">
            <Footprints className="w-4 h-4 text-brand-lime" />
            <h4 className="text-xs font-bold text-slate-200">Walkability Index</h4>
          </div>
          
          <div className="flex items-center gap-4">
            <DiamondGauge
              score={Math.round(station.scores.design * 0.9)} 
              label="Excellent"
              size="md"
            />
            <p className="text-[10px] text-slate-400 leading-relaxed flex-1">
              High density of POIs within 1km. Safe and shaded pedestrian pathways available.
            </p>
          </div>
        </div>

        {/* Menu Go Discovery */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4">
          <MenuGoDiscovery recommendations={station.menu_go_recommendations} />
        </div>

        {/* Travel Estimator */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4">
          <TravelEstimator estimates={station.travel_estimates} />
        </div>

        {/* AI Advisor */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl overflow-hidden">
          <div className="h-[450px]">
            <AIChatPanel
              activeStation={activeStation}
              activePersona="commuter"
              activeH3Index={activeH3Index}
              onExecuteMapAction={onExecuteMapAction}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

