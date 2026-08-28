'use client';

import React from 'react';
import { Clock } from 'lucide-react';

import { TravelEstimateItem } from '@/types';

interface TravelEstimatorProps {
  estimates?: TravelEstimateItem[];
}

export const TravelEstimator: React.FC<TravelEstimatorProps> = ({ estimates = [] }) => {
  const data = estimates.length > 0 ? estimates : [
    { destination: 'Tugu Pahlawan', time: '12 min', icon: '🚶' },
    { destination: 'Pasar Turi', time: '18 min', icon: '🚶' },
  ];

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 mb-2">
        <Clock className="w-4 h-4 text-emerald-400" />
        <h4 className="text-xs font-bold text-slate-200">Travel Estimator</h4>
      </div>
      
      <div className="space-y-2">
        {data.map((est, idx) => (
          <div key={idx} className="flex justify-between items-center text-[11px] bg-slate-950/60 border border-slate-800 rounded-lg p-2.5">
            <span className="text-slate-300">{est.destination}</span>
            <span className="font-bold text-slate-200 bg-slate-800/80 px-2 py-0.5 rounded flex items-center gap-1.5">
              <span>{est.icon}</span> {est.time}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
