'use client';

import React from 'react';
import { Store, DollarSign, Users } from 'lucide-react';

import { MenuGoItem } from '@/types';

interface MenuGoDiscoveryProps {
  recommendations?: MenuGoItem[];
}

export const MenuGoDiscovery: React.FC<MenuGoDiscoveryProps> = ({ recommendations = [] }) => {
  // Fallback if data is missing
  const data = recommendations.length > 0 ? recommendations : [
    { name: 'Kopi Semut Lama', distance: '250m', price: 'Low', crowd: 'High', color: 'bg-emerald-500' },
    { name: 'Warung Suroboyo', distance: '400m', price: 'High', crowd: 'Low', color: 'bg-blue-500' },
  ];

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 mb-2">
        <Store className="w-4 h-4 text-orange-400" />
        <h4 className="text-xs font-bold text-slate-200">Menu Go Discovery</h4>
      </div>
      
      <div className="space-y-2">
        {data.map((item, idx) => {
          const color = item.crowd === 'High' ? 'text-orange-400' : 'text-emerald-400';
          return (
            <div key={idx} className="bg-slate-950/60 border border-slate-800 rounded-lg p-2.5 hover:border-orange-500/30 transition-colors cursor-pointer">
              <div className="flex justify-between items-start mb-1.5">
                <span className="text-[11px] font-bold text-slate-200">{item.name}</span>
                <span className="text-[10px] text-slate-400">{item.distance}</span>
              </div>
              
              <div className="flex gap-2 text-[9px] font-medium">
                <div className="flex items-center gap-1 bg-slate-800/80 px-1.5 py-0.5 rounded text-slate-300">
                  <DollarSign className="w-3 h-3 text-emerald-400" />
                  {item.price}
                </div>
                <div className="flex items-center gap-1 bg-slate-800/80 px-1.5 py-0.5 rounded text-slate-300">
                  <Users className={`w-3 h-3 ${color}`} />
                  {item.crowd}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
