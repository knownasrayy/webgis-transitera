'use client';

import React from 'react';
import { StationData, StationId } from '@/types';
import { DiamondGauge } from './DiamondGauge';
import { RadarChart5D } from './RadarChart5D';
import { AIChatPanel } from '@/components/ai/AIChatPanel';
import { Footprints, Shield } from 'lucide-react';

interface GovernmentPanelProps {
  station: StationData;
  activeStation: StationId;
  activeH3Index?: string | null;
  onExecuteMapAction?: (data: any) => void;
}

export const GovernmentPanel: React.FC<GovernmentPanelProps> = ({
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
        <p className="text-[10px] text-slate-500">Real-Time Spatial Advisor</p>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* 5D TOD Radar Chart */}
        <RadarChart5D station={station} />

        {/* Walkability Index */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-3">
            <Footprints className="w-4 h-4 text-brand-lime" />
            <h4 className="text-xs font-bold text-slate-200">Walkability Index</h4>
          </div>
          <div className="flex items-center gap-4">
            <DiamondGauge
              score={Math.round(station.scores.design * 0.72)}
              label="walkability"
              sublabel={
                station.scores.design >= 70
                  ? 'High density of POIs within 1km'
                  : 'Critical pedestrian priority zone identified along Suroboyo Bus feeder access routes.'
              }
              size="sm"
            />
            <div className="flex-1 space-y-1.5">
              <div className="flex justify-between text-[11px]">
                <span className="text-slate-400">Trotoar Coverage</span>
                <span className="font-bold text-slate-200">{Math.round(station.scores.design * 0.8)}%</span>
              </div>
              <div className="w-full bg-slate-800 h-1 rounded-full overflow-hidden">
                <div className="h-full bg-brand-lime rounded-full" style={{ width: `${station.scores.design * 0.8}%` }} />
              </div>
              <div className="flex justify-between text-[11px]">
                <span className="text-slate-400">Tactile Paving</span>
                <span className="font-bold text-slate-200">{Math.round(station.scores.design * 0.55)}%</span>
              </div>
              <div className="w-full bg-slate-800 h-1 rounded-full overflow-hidden">
                <div className="h-full bg-amber-500 rounded-full" style={{ width: `${station.scores.design * 0.55}%` }} />
              </div>
            </div>
          </div>
        </div>

        {/* Policy Recommendations */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <Shield className="w-4 h-4 text-emerald-400" />
            <h4 className="text-xs font-bold text-slate-200">Rekomendasi Kebijakan</h4>
          </div>
          <ul className="space-y-1.5">
            {station.policy_recommendations.map((rec, i) => (
              <li key={i} className="text-[11px] text-slate-400 leading-relaxed flex gap-2">
                <span className="text-brand-lime font-bold mt-0.5">â€¢</span>
                <span>{rec}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* AI Advisor */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl overflow-hidden">
          <div className="h-80">
            <AIChatPanel
              activeStation={activeStation}
              activePersona="government"
              activeH3Index={activeH3Index}
              onExecuteMapAction={onExecuteMapAction}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

