'use client';

import React from 'react';
import { StationData } from '@/types';
import { TrendingUp, AlertTriangle, CheckCircle, ArrowUpRight, BarChart2 } from 'lucide-react';

interface Scorecard5DProps {
  station: StationData;
}

export const Scorecard5D: React.FC<Scorecard5DProps> = ({ station }) => {
  const dimensions = [
    { label: 'Density', score: station.scores.density, color: 'bg-indigo-500' },
    { label: 'Diversity', score: station.scores.diversity, color: 'bg-cyan-500' },
    { label: 'Design', score: station.scores.design, color: 'bg-amber-500' },
    { label: 'Destination', score: station.scores.destination_accessibility, color: 'bg-emerald-500' },
    { label: 'Distance', score: station.scores.distance_to_transit, color: 'bg-blue-500' }
  ];

  return (
    <div className="space-y-3 text-slate-200">
      {/* Top Main Card: Score & Status */}
      <div className="bg-slate-900/70 rounded-xl p-3.5 border border-slate-800 relative overflow-hidden">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-black tracking-tight text-white">
                {station.tod_readiness_score}
              </span>
              <span className="text-xs text-slate-400 font-medium">/ 100</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                <CheckCircle className="w-2.5 h-2.5" />
                {station.status.split(' ')[0]}
              </span>
            </div>
            <p className="text-xs font-semibold text-cyan-300 mt-1">{station.typology}</p>
          </div>

          {/* %ΔNJOP Premium Badge */}
          <div className="text-right bg-blue-950/60 border border-blue-800/40 px-2.5 py-1.5 rounded-lg">
            <div className="text-[10px] text-blue-300 font-medium flex items-center gap-1 justify-end">
              <TrendingUp className="w-3 h-3 text-emerald-400" />
              Est. %ΔNJOP
            </div>
            <div className="text-sm font-bold text-emerald-400">
              +{station.njop_premium.avg_njop_premium_pct}%
            </div>
            <div className="text-[9px] text-slate-400">
              CI: {station.njop_premium.ci_lower_pct}% - {station.njop_premium.ci_upper_pct}%
            </div>
          </div>
        </div>

        {/* 5D Progress Bars */}
        <div className="mt-3.5 space-y-2">
          {dimensions.map((dim) => (
            <div key={dim.label} className="text-xs">
              <div className="flex justify-between text-[11px] mb-0.5">
                <span className="text-slate-300 font-medium">{dim.label}</span>
                <span className="font-bold text-slate-200">{dim.score}</span>
              </div>
              <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                <div
                  className={`h-full ${dim.color} rounded-full transition-all duration-500`}
                  style={{ width: `${dim.score}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Highlights: Weakest & Strongest Indicator */}
      <div className="grid grid-cols-2 gap-2">
        <div className="bg-amber-950/30 border border-amber-800/40 rounded-lg p-2.5">
          <div className="text-[10px] font-semibold text-amber-400 uppercase tracking-wider flex items-center gap-1">
            <AlertTriangle className="w-3 h-3" />
            Dimensi Terlemah
          </div>
          <div className="text-xs font-bold text-slate-200 mt-1">{station.weakest_dimension}</div>
          <div className="text-[10px] text-slate-400">Fokus intervensi trotoar / first-mile</div>
        </div>

        <div className="bg-emerald-950/30 border border-emerald-800/40 rounded-lg p-2.5">
          <div className="text-[10px] font-semibold text-emerald-400 uppercase tracking-wider flex items-center gap-1">
            <ArrowUpRight className="w-3 h-3" />
            Dimensi Terkuat
          </div>
          <div className="text-xs font-bold text-slate-200 mt-1">{station.strongest_dimension}</div>
          <div className="text-[10px] text-slate-400">Modal utama simpul transit</div>
        </div>
      </div>

      {/* Policy Recommendations Snippet */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-lg p-2.5">
        <div className="text-[10px] font-semibold text-cyan-400 uppercase tracking-wider flex items-center gap-1 mb-1">
          <BarChart2 className="w-3 h-3" />
          Rekomendasi Kebijakan
        </div>
        <p className="text-[11px] text-slate-300 leading-relaxed">
          {station.policy_recommendations[0]}
        </p>
      </div>
    </div>
  );
};
