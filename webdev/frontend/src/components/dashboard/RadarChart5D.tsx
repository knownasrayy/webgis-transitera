'use client';

import React from 'react';
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Legend,
  Tooltip
} from 'recharts';
import { StationData } from '@/types';

interface RadarChart5DProps {
  station: StationData;
}

export const RadarChart5D: React.FC<RadarChart5DProps> = ({ station }) => {
  const chartData = [
    {
      dimension: 'Density',
      score: station.scores.density,
      benchmark: station.benchmark_scores.density,
      fullMark: 100
    },
    {
      dimension: 'Diversity',
      score: station.scores.diversity,
      benchmark: station.benchmark_scores.diversity,
      fullMark: 100
    },
    {
      dimension: 'Design',
      score: station.scores.design,
      benchmark: station.benchmark_scores.design,
      fullMark: 100
    },
    {
      dimension: 'Destination',
      score: station.scores.destination_accessibility,
      benchmark: station.benchmark_scores.destination_accessibility,
      fullMark: 100
    },
    {
      dimension: 'Distance',
      score: station.scores.distance_to_transit,
      benchmark: station.benchmark_scores.distance_to_transit,
      fullMark: 100
    }
  ];

  return (
    <div className="w-full h-64 bg-slate-900/60 rounded-xl p-3 border border-slate-800 flex flex-col justify-between">
      <div className="flex items-center justify-between mb-1">
        <h4 className="text-[11px] font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
          Analisis 5D TOD ({station.name.replace('Stasiun ', '')})
        </h4>
        <span className="text-[10px] text-cyan-400 font-medium bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-800/40">
          Skor: {station.tod_readiness_score}
        </span>
      </div>

      <div className="w-full h-52">
        <ResponsiveContainer width="100%" height="100%" minHeight={1}>
          <RadarChart cx="50%" cy="50%" outerRadius="70%" data={chartData}>
            <PolarGrid stroke="#334155" strokeDasharray="3 3" />
            <PolarAngleAxis
              dataKey="dimension"
              stroke="#94a3b8"
              tick={{ fill: '#cbd5e1', fontSize: 11, fontWeight: 500 }}
            />
            <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#475569" tick={{ fontSize: 9 }} />
            <Radar
              name={station.name.replace('Stasiun Surabaya ', 'St. ')}
              dataKey="score"
              stroke="#06b6d4"
              fill="#06b6d4"
              fillOpacity={0.45}
            />
            <Radar
              name="Rata-rata Koridor"
              dataKey="benchmark"
              stroke="#64748b"
              fill="#64748b"
              fillOpacity={0.15}
              strokeDasharray="4 4"
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#0f172a',
                borderColor: '#334155',
                borderRadius: '8px',
                fontSize: '11px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.5)'
              }}
            />
            <Legend
              wrapperStyle={{
                fontSize: '10px',
                paddingTop: '2px'
              }}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
