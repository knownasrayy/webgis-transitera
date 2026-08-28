'use client';

import React from 'react';
import { Layers, Eye, Map, Check } from 'lucide-react';

export type ChoroplethMode = 'tod_score' | 'njop_premium' | 'typology';
export type BasemapStyleKey = 'street' | 'dark' | 'satellite';

interface LayerControlProps {
  choroplethMode: ChoroplethMode;
  onChangeChoroplethMode: (mode: ChoroplethMode) => void;
  showSurveyPoints: boolean;
  onToggleSurveyPoints: () => void;
  basemapStyle: BasemapStyleKey;
  onChangeBasemapStyle: (style: BasemapStyleKey) => void;
}

export const LayerControl: React.FC<LayerControlProps> = ({
  choroplethMode,
  onChangeChoroplethMode,
  showSurveyPoints,
  onToggleSurveyPoints,
  basemapStyle,
  onChangeBasemapStyle
}) => {
  return (
    <div className="glass-panel rounded-xl p-3 text-slate-200 text-xs w-64 space-y-3 shadow-xl">
      {/* Header */}
      <div className="flex items-center gap-1.5 pb-2 border-b border-slate-800">
        <Layers className="w-4 h-4 text-brand-teal" />
        <span className="font-bold text-slate-100 uppercase tracking-wider text-[11px]">
          Layer Control & Legend
        </span>
      </div>

      {/* Basemap Style Switcher */}
      <div>
        <div className="text-[10px] uppercase font-semibold text-slate-400 mb-1.5 flex items-center gap-1">
          <Map className="w-3 h-3 text-slate-400" />
          MAPID MAPS Basemap
        </div>
        <div className="grid grid-cols-3 gap-1">
          {([
            { key: 'street', label: 'Street' },
            { key: 'dark', label: 'Dark' },
            { key: 'satellite', label: 'Satellite' },
          ] as const).map(({ key, label }) => (
            <button
              key={key}
              onClick={() => onChangeBasemapStyle(key)}
              className={`py-1 px-1.5 rounded-lg text-[10px] font-bold transition-all border ${
                basemapStyle === key
                  ? 'bg-brand-lime text-surface-container-lowest border-brand-lime text-white shadow-sm'
                  : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Choropleth Mode Selector */}
      <div>
        <div className="text-[10px] uppercase font-semibold text-slate-400 mb-1.5">
          Overlay Choropleth H3
        </div>
        <div className="space-y-1">
          <button
            onClick={() => onChangeChoroplethMode('tod_score')}
            className={`w-full text-left py-1.5 px-2 rounded-lg text-[11px] font-medium flex items-center justify-between border transition-all ${
              choroplethMode === 'tod_score'
                ? 'bg-brand-teal/20 border-brand-teal/50 text-brand-teal'
                : 'bg-slate-900/40 border-slate-800/80 text-slate-400 hover:text-slate-300'
            }`}
          >
            <span>TOD Readiness Score (5D)</span>
            {choroplethMode === 'tod_score' && <Check className="w-3.5 h-3.5 text-brand-teal" />}
          </button>

          <button
            onClick={() => onChangeChoroplethMode('njop_premium')}
            className={`w-full text-left py-1.5 px-2 rounded-lg text-[11px] font-medium flex items-center justify-between border transition-all ${
              choroplethMode === 'njop_premium'
                ? 'bg-brand-teal/20 border-brand-teal/50 text-brand-teal'
                : 'bg-slate-900/40 border-slate-800/80 text-slate-400 hover:text-slate-300'
            }`}
          >
            <span>Estimasi Nilai Lahan (%Î”NJOP)</span>
            {choroplethMode === 'njop_premium' && <Check className="w-3.5 h-3.5 text-brand-teal" />}
          </button>

          <button
            onClick={() => onChangeChoroplethMode('typology')}
            className={`w-full text-left py-1.5 px-2 rounded-lg text-[11px] font-medium flex items-center justify-between border transition-all ${
              choroplethMode === 'typology'
                ? 'bg-brand-teal/20 border-brand-teal/50 text-brand-teal'
                : 'bg-slate-900/40 border-slate-800/80 text-slate-400 hover:text-slate-300'
            }`}
          >
            <span>Tipologi Kawasan (XGBoost)</span>
            {choroplethMode === 'typology' && <Check className="w-3.5 h-3.5 text-brand-teal" />}
          </button>
        </div>
      </div>

      {/* Survey Layer Toggle */}
      <div>
        <button
          onClick={onToggleSurveyPoints}
          className={`w-full py-1.5 px-2 rounded-lg text-[11px] font-medium flex items-center justify-between border transition-all ${
            showSurveyPoints
              ? 'bg-brand-teal/20 border-brand-teal/50 text-brand-teal'
              : 'bg-slate-900/40 border-slate-800 text-slate-400'
          }`}
        >
          <span className="flex items-center gap-1.5">
            <Eye className="w-3 h-3" />
            Survei Lapangan #PakSibukGa
          </span>
          <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-slate-800 text-slate-300">
            360 Titik
          </span>
        </button>
      </div>

      {/* Dynamic Color Ramp Legend */}
      <div className="pt-2 border-t border-slate-800">
        <div className="text-[10px] font-semibold text-slate-400 mb-1.5">
          {choroplethMode === 'tod_score'
            ? 'Legenda TOD Readiness Score'
            : choroplethMode === 'njop_premium'
            ? 'Legenda Kenaikan %Î”NJOP'
            : 'Legenda Tipologi Kawasan'}
        </div>

        {choroplethMode === 'tod_score' && (
          <div className="space-y-1">
            <div className="h-2 rounded-full bg-gradient-to-r from-alert-red via-brand-teal to-success-green w-full" />
            <div className="flex justify-between text-[9px] text-slate-400 font-medium">
              <span>0 (Rendah)</span>
              <span>50 (Sedang)</span>
              <span>100 (Tinggi)</span>
            </div>
          </div>
        )}

        {choroplethMode === 'njop_premium' && (
          <div className="space-y-1">
            <div className="h-2 rounded-full bg-gradient-to-r from-brand-blue via-brand-teal to-success-green w-full" />
            <div className="flex justify-between text-[9px] text-slate-400 font-medium">
              <span>+0%</span>
              <span>+10%</span>
              <span>+20%</span>
            </div>
          </div>
        )}

        {choroplethMode === 'typology' && (
          <div className="space-y-1 text-[10px]">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded bg-brand-lime" />
              <span>Commercial Transit Hub</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded bg-brand-teal" />
              <span>Mixed-Use Area</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded bg-brand-purple" />
              <span>Feeder Zone</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};


