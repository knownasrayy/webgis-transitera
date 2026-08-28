'use client';

import React from 'react';
import { StationData, StationId } from '@/types';
import { DiamondGauge } from './DiamondGauge';
import dynamic from 'next/dynamic';
const TenantMixChart = dynamic(() => import('./TenantMixChart').then(mod => mod.TenantMixChart), { 
  ssr: false, 
  loading: () => <div className="w-full h-48 bg-slate-900/50 backdrop-blur-md rounded-xl animate-pulse" /> 
});
import { AIChatPanel } from '@/components/ai/AIChatPanel';
import { Building, TrendingUp } from 'lucide-react';

interface InvestorPanelProps {
  station: StationData;
  activeStation: StationId;
  activeH3Index?: string | null;
  onExecuteMapAction?: (data: any) => void;
}

export const InvestorPanel: React.FC<InvestorPanelProps> = ({
  station,
  activeStation,
  activeH3Index,
  onExecuteMapAction,
}) => {
  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Panel Header */}
      <div className="px-4 py-3 border-b border-slate-800/80 flex-shrink-0">
        <h3 className="text-xs font-bold text-slate-100">Investor Advisory</h3>
        <p className="text-[10px] text-slate-500">{station.name.replace('Stasiun Surabaya ', 'St. ').replace('Stasiun ', 'St. ')} Sector</p>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        
        {/* Retail Success Score */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-brand-lime" />
              <h4 className="text-xs font-bold text-slate-200">Retail Success Score</h4>
            </div>
            <span className="text-[9px] tabular-nums text-slate-500 bg-slate-800/60 px-1.5 py-0.5 rounded">
              RF Model
            </span>
          </div>
          
          <div className="flex flex-col items-center justify-center py-2">
            <DiamondGauge
              score={Math.round(station.tod_readiness_score * 1.04)} 
              label="Excellent"
              size="lg"
            />
            <p className="text-[10px] text-slate-400 text-center mt-3 leading-relaxed px-4">
              High foot traffic correlation with nearby transit hub and existing commercial clusters.
            </p>
          </div>
        </div>

        {/* Optimal Tenant Mix */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4">
          <TenantMixChart data={station.tenant_mix} />
        </div>

        {/* Market Listings */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <Building className="w-4 h-4 text-emerald-400" />
            <h4 className="text-xs font-bold text-slate-200">Market Listings</h4>
          </div>
          <div className="text-[11px] text-slate-400 text-center py-4 border border-slate-800 border-dashed rounded-lg">
            Properti Go listings available in this sector.
          </div>
        </div>

        {/* AI Advisor */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl overflow-hidden">
          <div className="h-80">
            <AIChatPanel
              activeStation={activeStation}
              activePersona="business"
              activeH3Index={activeH3Index}
              onExecuteMapAction={onExecuteMapAction}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

