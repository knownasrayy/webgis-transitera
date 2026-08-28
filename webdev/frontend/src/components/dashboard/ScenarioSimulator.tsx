'use client';

import React, { useState } from 'react';
import { StationData } from '@/types';
import { Sliders, Sparkles, ArrowRight, Check } from 'lucide-react';

interface ScenarioSimulatorProps {
  station: StationData;
}

export const ScenarioSimulator: React.FC<ScenarioSimulatorProps> = ({ station }) => {
  const [selectedIntervention, setSelectedIntervention] = useState<'feeder' | 'pedestrian' | 'rezoning'>('feeder');
  const [isSimulated, setIsSimulated] = useState<boolean>(true);

  // Impact calculations based on intervention type
  const impacts = {
    feeder: { deltaScore: +7.2, deltaNjop: +3.1, label: 'Ekspansi Feeder WiraWiri / Suroboyo Bus' },
    pedestrian: { deltaScore: +8.5, deltaNjop: +2.4, label: 'Jalur Pedestrian Berkanopi & Tactile Paving' },
    rezoning: { deltaScore: +5.0, deltaNjop: +4.2, label: 'Insentif FAR / Rezoning Hunian Campuran' }
  };

  const currentImpact = impacts[selectedIntervention];
  const simulatedTOD = +(station.tod_readiness_score + (isSimulated ? currentImpact.deltaScore : 0)).toFixed(1);
  const simulatedNJOP = +(station.njop_premium.avg_njop_premium_pct + (isSimulated ? currentImpact.deltaNjop : 0)).toFixed(1);

  return (
    <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-3.5 text-slate-200">
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
          <Sliders className="w-3.5 h-3.5 text-cyan-400" />
          Simulasi Skenario Intervensi What-If
        </h4>
        <button
          onClick={() => setIsSimulated(!isSimulated)}
          className={`text-[10px] font-bold px-2 py-0.5 rounded transition-colors ${
            isSimulated
              ? 'bg-cyan-500 text-slate-950 font-black'
              : 'bg-slate-800 text-slate-400 hover:text-white'
          }`}
        >
          {isSimulated ? 'Simulasi Aktif' : 'Baseline'}
        </button>
      </div>

      {/* Intervention Buttons */}
      <div className="space-y-1.5 mb-3">
        {(Object.keys(impacts) as Array<keyof typeof impacts>).map((key) => (
          <button
            key={key}
            onClick={() => {
              setSelectedIntervention(key);
              setIsSimulated(true);
            }}
            className={`w-full text-left p-2 rounded-lg text-xs font-medium transition-all flex items-center justify-between border ${
              selectedIntervention === key
                ? 'bg-cyan-950/60 border-cyan-500/50 text-cyan-200 shadow-sm'
                : 'bg-slate-900/40 border-slate-800/80 text-slate-400 hover:bg-slate-800/50 hover:text-slate-300'
            }`}
          >
            <span>{impacts[key].label}</span>
            {selectedIntervention === key && <Check className="w-3.5 h-3.5 text-cyan-400" />}
          </button>
        ))}
      </div>

      {/* Side by Side Comparison Metrics */}
      <div className="grid grid-cols-2 gap-2 bg-slate-950/60 p-2.5 rounded-lg border border-slate-800/80">
        <div>
          <span className="text-[10px] text-slate-400">TOD Readiness Score</span>
          <div className="flex items-baseline gap-1.5 mt-0.5">
            <span className="text-sm text-slate-400 line-through">{station.tod_readiness_score}</span>
            <ArrowRight className="w-3 h-3 text-slate-500" />
            <span className="text-base font-black text-cyan-400">{simulatedTOD}</span>
            <span className="text-[10px] text-emerald-400 font-bold">+{currentImpact.deltaScore}</span>
          </div>
        </div>

        <div>
          <span className="text-[10px] text-slate-400">Estimasi %ΔNJOP</span>
          <div className="flex items-baseline gap-1.5 mt-0.5">
            <span className="text-sm text-slate-400 line-through">+{station.njop_premium.avg_njop_premium_pct}%</span>
            <ArrowRight className="w-3 h-3 text-slate-500" />
            <span className="text-base font-black text-emerald-400">+{simulatedNJOP}%</span>
            <span className="text-[10px] text-emerald-400 font-bold">+{currentImpact.deltaNjop}%</span>
          </div>
        </div>
      </div>

      <div className="mt-2.5 text-[10px] text-slate-400 leading-tight">
        💡 Model regresi spasial memperhitungkan <i>direct impact</i> di catchment sel mikro dan <i>spatial spillover</i> koridor sekitar.
      </div>
    </div>
  );
};
