'use client';

import React from 'react';
import { PersonaType, getPersonaConfig } from '@/lib/persona';

interface FooterProps {
  activePersona: PersonaType;
}

export const Footer: React.FC<FooterProps> = ({ activePersona }) => {
  const config = getPersonaConfig(activePersona);

  return (
    <footer className="h-7 bg-slate-950 border-t border-slate-800 flex items-center justify-between px-4 text-[9px] text-slate-500 tabular-nums z-40 relative flex-shrink-0">
      <div className="flex items-center gap-2 flex-1">
        <span>© 2024 TransitERA Decision Support System. H3 Resolution 8/9 Engine.</span>
        <span className="hidden sm:inline">|</span>
        <span className="text-slate-400 font-bold hidden sm:inline">Data: {config.footerDataSource}</span>
      </div>
      
      <div className="flex items-center gap-3">
        <span>Last Updated: 2024-05-23</span>
        <a href="#" className="hover:text-orange-400 transition-colors">API Docs</a>
        <a href="#" className="hover:text-orange-400 transition-colors">Privacy Policy</a>
      </div>
    </footer>
  );
};
