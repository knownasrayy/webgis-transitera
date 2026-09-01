'use client';

import React, { useState, useEffect } from 'react';
import { StationData, StationId } from '@/types';
import { simulateScenario } from '@/lib/api';
import { Sliders, ArrowRight, Check, Loader2, Sparkles } from 'lucide-react';

interface ScenarioSimulatorProps {
  station: StationData;
}

export const ScenarioSimulator: React.FC<ScenarioSimulatorProps> = ({ station }) => {
  const [selectedIntervention, setSelectedIntervention] = useState<'feeder_extension' | 'pedestrian_upgrade' | 'mixed_use_rezoning'>('feeder_extension');
  const [isSimulated, setIsSimulated] = useState<boolean>(true);
  const [simulationData, setSimulationData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const interventions = [
    { key: 'feeder_extension', label: 'Ekspansi Feeder WiraWiri / Suroboyo Bus' },
    { key: 'pedestrian_upgrade', label: 'Jalur Pedestrian Berkanopi & Tactile Paving' },
    { key: 'mixed_use_rezoning', label: 'Insentif FAR / Rezoning Hunian Campuran' }
  ] as const;

  useEffect(() => {
    let isSubscribed = true;

    const runSimulation = async () => {
      setIsLoading(true);
      try {
        const result = await simulateScenario(
          station.id as StationId,
          selectedIntervention,
          `sim_${station.id}_${selectedIntervention}`
        );
        if (isSubscribed) {
          setSimulationData(result);
        }
      } catch (err) {
        console.error('Simulation error:', err);
      } finally {
        if (isSubscribed) setIsLoading(false);
      }
    };

    runSimulation();

    return () => {
      isSubscribed = false;
    };
  }, [station.id, selectedIntervention]);

  const simulatedTOD = simulationData?.simulated_tod_score ?? (station.tod_readiness_score + 7.5);
  const deltaScore = simulationData?.delta_tod_score ?? 7.5;
  const simulatedNJOP = simulationData?.simulated_njop_premium_pct ?? (station.njop_premium.avg_njop_premium_pct + 3.2);
  const deltaNJOP = simulationData?.delta_njop_premium_pct ?? 3.2;

  return (
    <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-3.5 text-slate-200">
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
          <Sliders className="w-3.5 h-3.5 text-brand-lime" />
          Simulasi Skenario Intervensi (What-If)
        </h4>
        <button
          onClick={() => setIsSimulated(!isSimulated)}
          className={`text-[10px] font-bold px-2 py-0.5 rounded transition-colors ${
            isSimulated
              ? 'bg-brand-lime text-slate-950 font-black'
              : 'bg-slate-800 text-slate-400 hover:text-white'
          }`}
        >
          {isSimulated ? 'Simulasi Aktif' : 'Baseline'}
        </button>
      </div>

      {/* Intervention Buttons */}
      <div className="space-y-1.5 mb-3">
        {interventions.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => {
              setSelectedIntervention(key);
              setIsSimulated(true);
            }}
            className={`w-full text-left p-2 rounded-lg text-xs font-medium transition-all flex items-center justify-between border ${
              selectedIntervention === key
                ? 'bg-brand-lime/15 border-brand-lime/50 text-brand-lime font-bold shadow-sm'
                : 'bg-slate-950/40 border-slate-800/80 text-slate-400 hover:bg-slate-800/50 hover:text-slate-300'
            }`}
          >
            <span className="flex items-center gap-1.5">
              {isLoading && selectedIntervention === key && <Loader2 className="w-3 h-3 animate-spin text-brand-lime" />}
              {label}
            </span>
            {selectedIntervention === key && <Check className="w-3.5 h-3.5 text-brand-lime" />}
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
            <span className="text-base font-black text-brand-lime">
              {isSimulated ? simulatedTOD : station.tod_readiness_score}
            </span>
            {isSimulated && <span className="text-[10px] text-brand-lime font-bold">+{deltaScore}</span>}
          </div>
        </div>

        <div>
          <span className="text-[10px] text-slate-400">Estimasi %ΔNJOP</span>
          <div className="flex items-baseline gap-1.5 mt-0.5">
            <span className="text-sm text-slate-400 line-through">+{station.njop_premium.avg_njop_premium_pct}%</span>
            <ArrowRight className="w-3 h-3 text-slate-500" />
            <span className="text-base font-black text-emerald-400">
              +{isSimulated ? simulatedNJOP : station.njop_premium.avg_njop_premium_pct}%
            </span>
            {isSimulated && <span className="text-[10px] text-emerald-400 font-bold">+{deltaNJOP}%</span>}
          </div>
        </div>
      </div>

      {/* Narrative from backend API */}
      {simulationData?.summary_narrative && isSimulated && (
        <div className="mt-2.5 p-2 bg-slate-950/40 rounded-lg border border-slate-800/60 text-[10px] text-slate-300 leading-relaxed">
          <Sparkles className="w-3 h-3 text-brand-lime inline mr-1" />
          {simulationData.summary_narrative}
        </div>
      )}
    </div>
  );
};
