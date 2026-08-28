'use client';

import React, { useState } from 'react';
import { PersonaType } from '@/lib/persona';
import { ChevronUp, ChevronDown, Sliders, Layers, Sparkles } from 'lucide-react';

interface MobileBottomSheetProps {
  children: React.ReactNode;
  activePersona: PersonaType;
  onChangePersona: (persona: PersonaType) => void;
}

export const MobileBottomSheet: React.FC<MobileBottomSheetProps> = ({
  children,
  activePersona,
  onChangePersona
}) => {
  const [snapState, setSnapState] = useState<'peek' | 'half' | 'full'>('half');

  const heightClasses = {
    peek: 'h-16',
    half: 'h-[50vh]',
    full: 'h-[85vh]'
  };

  const toggleSnap = () => {
    if (snapState === 'peek') setSnapState('half');
    else if (snapState === 'half') setSnapState('full');
    else setSnapState('peek');
  };

  return (
    <div
      className={`fixed bottom-0 left-0 right-0 z-30 md:hidden glass-panel-accent border-t rounded-t-2xl shadow-2xl transition-all duration-300 flex flex-col ${heightClasses[snapState]}`}
    >
      {/* Draggable Handle & Tab Bar */}
      <div className="pt-2 pb-1.5 px-4 flex flex-col items-center cursor-pointer select-none" onClick={toggleSnap}>
        <div className="w-12 h-1 bg-slate-600 rounded-full mb-2"></div>
        <div className="w-full flex items-center justify-between">
          <div className="flex gap-1.5">
            {(['government', 'business', 'commuter'] as const).map((persona) => (
              <button
                key={persona}
                onClick={(e) => {
                  e.stopPropagation();
                  onChangePersona(persona);
                  if (snapState === 'peek') setSnapState('half');
                }}
                className={`px-3 py-1 rounded-lg text-[10px] font-bold capitalize flex items-center gap-1 ${
                  activePersona === persona
                    ? 'bg-orange-500 text-slate-950'
                    : 'bg-slate-800 text-slate-400'
                }`}
              >
                {persona}
              </button>
            ))}
          </div>

          <div className="text-slate-400 p-1">
            {snapState === 'full' ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
          </div>
        </div>
      </div>

      {/* Content Area */}
      {snapState !== 'peek' && (
        <div className="flex-1 overflow-y-auto p-0 flex flex-col">
          {children}
        </div>
      )}
    </div>
  );
};
