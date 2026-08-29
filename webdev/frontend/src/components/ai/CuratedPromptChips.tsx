'use client';

import React from 'react';
import { Sparkles, BarChart, Scale, AlertTriangle, TrendingUp, Utensils, Sliders, Coffee } from 'lucide-react';

interface CuratedPromptChipsProps {
  onSelectPrompt: (promptText: string) => void;
  disabled?: boolean;
}

export const CURATED_PROMPTS_LIST = [
  {
    title: 'Skor TOD Gubeng',
    prompt: 'Tampilkan skor TOD di sekitar Stasiun Gubeng',
    icon: BarChart
  },
  {
    title: 'Bandingkan Gubeng & Wonokromo',
    prompt: 'Bandingkan skor TOD Gubeng dan Wonokromo',
    icon: Scale
  },
  {
    title: 'Dimensi Terlemah Pasar Turi',
    prompt: 'Apa dimensi TOD terlemah di Stasiun Pasar Turi?',
    icon: AlertTriangle
  },
  {
    title: 'Estimasi Nilai Lahan Waru',
    prompt: 'Berapa estimasi kenaikan nilai tanah di sekitar Waru?',
    icon: TrendingUp
  },
  {
    title: 'Warung Ramai Dekat Stasiun',
    prompt: 'Tampilkan lokasi warung makan ramai di dekat stasiun',
    icon: Utensils
  },
  {
    title: 'Simulasi Ekstensi Feeder',
    prompt: 'Jika feeder WiraWiri diperpanjang ke Waru, apa dampaknya?',
    icon: Sliders
  },
  {
    title: 'Rekomendasi Kedai Kopi',
    prompt: 'Di mana lokasi terbaik untuk buka kedai kopi dekat stasiun?',
    icon: Coffee
  }
];

export const CuratedPromptChips: React.FC<CuratedPromptChipsProps> = ({
  onSelectPrompt,
  disabled = false
}) => {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center gap-1 text-[10px] uppercase font-bold text-brand-teal tracking-wider">
        <Sparkles className="w-3 h-3 text-brand-teal animate-pulse" />
        Curated Prompts (Jury Ready)
      </div>
      <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-hide">
        {CURATED_PROMPTS_LIST.map((item, idx) => {
          const IconComp = item.icon;
          return (
            <button
              key={idx}
              disabled={disabled}
              onClick={() => onSelectPrompt(item.prompt)}
              className="flex-shrink-0 text-[11px] bg-slate-900/90 hover:bg-brand-teal/20 text-slate-300 hover:text-brand-teal/80 border border-slate-700 hover:border-brand-teal/60 rounded-full px-2.5 py-1 transition-all flex items-center gap-1.5 shadow-sm disabled:opacity-50 disabled:pointer-events-none"
            >
              <IconComp className="w-3 h-3 text-brand-teal" />
              <span>{item.title}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

