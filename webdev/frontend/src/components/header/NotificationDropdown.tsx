'use client';

import React, { useState, useEffect, useRef } from 'react';
import { PersonaType } from '@/lib/persona';
import {
  Bell, AlertTriangle, CheckCircle2, Info, TrendingUp,
  Trash2, MailOpen, Train, Building2, Briefcase,
  Clock, MapPin, FileText,
} from 'lucide-react';

type NotifType = 'warning' | 'success' | 'info' | 'trend';

interface Notification {
  id: string;
  type: NotifType;
  title: string;
  description: string;
  time: string;
  read: boolean;
  personas: PersonaType[];
}

const ALL_NOTIFICATIONS: Notification[] = [
  // ── GOVERNMENT
  {
    id: 'g1', type: 'warning', personas: ['government'],
    title: 'Risiko Banjir Tinggi Terdeteksi',
    description: 'Kawasan sekitar Stasiun Gubeng & Bratang menunjukkan indikator risiko banjir meningkat (Skor 72/100). Rekomendasi: tinjau infrastruktur drainase.',
    time: '5 menit lalu', read: false,
  },
  {
    id: 'g2', type: 'success', personas: ['government'],
    title: 'Dataset NJOP Wonokromo Diperbarui',
    description: 'Sinkronisasi data NJOP zona Wonokromo selesai. Total 1.240 heksagon baru tersedia untuk analisis kebijakan.',
    time: '1 jam lalu', read: false,
  },
  {
    id: 'g3', type: 'trend', personas: ['government'],
    title: 'Skor TOD St. Malang Meningkat',
    description: 'Kawasan Stasiun Malang Kotalama mencatat kenaikan skor TOD +8 poin (dari 61 → 69). Potensi penetapan kawasan prioritas TOD.',
    time: '3 jam lalu', read: false,
  },
  {
    id: 'g4', type: 'info', personas: ['government'],
    title: 'Laporan AHP Tersedia',
    description: 'Laporan analisis AHP terbaru untuk 15 stasiun SRRL telah selesai diproses. Unduh dalam format GeoJSON atau Shapefile.',
    time: '1 hari lalu', read: true,
  },
  {
    id: 'g5', type: 'info', personas: ['government'],
    title: 'Pembaruan Regulasi TOD Nasional',
    description: 'Permen ATR/BPN No.12/2026 tentang pengembangan kawasan TOD telah diterbitkan. Perlu penyesuaian parameter analisis.',
    time: '3 hari lalu', read: true,
  },

  // ── BUSINESS
  {
    id: 'b1', type: 'trend', personas: ['business'],
    title: 'Zona NJOP Premium Baru Terdeteksi',
    description: 'Radius 500m sekitar St. Gubeng mencatat kenaikan %ΔNJOP +23% (YoY). Potensi ROI investasi properti tinggi.',
    time: '10 menit lalu', read: false,
  },
  {
    id: 'b2', type: 'success', personas: ['business'],
    title: 'Analisis Pasar Selesai',
    description: 'Pemodelan Random Forest untuk prediksi nilai properti di 8 kawasan TOD telah selesai. Akurasi model: 87.3%.',
    time: '2 jam lalu', read: false,
  },
  {
    id: 'b3', type: 'warning', personas: ['business'],
    title: 'Volatilitas NJOP Tinggi',
    description: 'Kawasan Pasar Turi menunjukkan fluktuasi NJOP tidak stabil dalam 6 bulan terakhir. Pertimbangkan analisis risiko lebih mendalam.',
    time: '5 jam lalu', read: false,
  },
  {
    id: 'b4', type: 'info', personas: ['business'],
    title: 'Data Properti Perumnas Diperbarui',
    description: 'Dataset listing properti di sekitar 5 stasiun terbaru telah diperbarui dari sumber MAPID GEO API.',
    time: '1 hari lalu', read: true,
  },
  {
    id: 'b5', type: 'trend', personas: ['business'],
    title: 'Indeks Tenant Mix Berubah',
    description: 'Kluster DBSCAN mendeteksi pergeseran komposisi tenant di kawasan TOD Wonokromo. Retail food & beverage mendominasi.',
    time: '2 hari lalu', read: true,
  },

  // ── COMMUTER
  {
    id: 'c1', type: 'warning', personas: ['commuter'],
    title: 'Gangguan KRL Rute Semut–Sidoarjo',
    description: 'Keterlambatan 25–40 menit akibat perbaikan jalur di km 12+300. Perkiraan normal kembali pukul 20.00 WIB.',
    time: '3 menit lalu', read: false,
  },
  {
    id: 'c2', type: 'info', personas: ['commuter'],
    title: 'Jadwal KRL Diperbarui',
    description: 'Ada 3 perubahan jadwal KRL SRRL mulai 1 Sep 2026: penambahan 2 perjalanan pagi & 1 perjalanan malam.',
    time: '1 jam lalu', read: false,
  },
  {
    id: 'c3', type: 'success', personas: ['commuter'],
    title: 'Rute Feeder Baru: SB-06',
    description: 'Suroboyo Bus rute SB-06 (St. Pasar Turi – Tunjungan Plaza) resmi beroperasi mulai hari ini pukul 06.00.',
    time: '4 jam lalu', read: false,
  },
  {
    id: 'c4', type: 'trend', personas: ['commuter'],
    title: 'Destinasi Wisata Populer Minggu Ini',
    description: 'House of Sampoerna & Tugu Pahlawan menjadi tujuan wisata paling populer dari penumpang KRL pekan ini.',
    time: '1 hari lalu', read: true,
  },
  {
    id: 'c5', type: 'info', personas: ['commuter'],
    title: 'Tarif KRL Tidak Berubah',
    description: 'Pengumuman resmi PT KCI: tarif KRL SRRL tidak mengalami kenaikan hingga akhir 2026.',
    time: '3 hari lalu', read: true,
  },
];

const TYPE_CONFIG: Record<NotifType, { icon: React.ReactNode; color: string; bg: string; border: string }> = {
  warning: { icon: <AlertTriangle className="w-4 h-4" />, color: 'text-brand-teal', bg: 'bg-amber-500/10', border: 'border-amber-500/20' },
  success: { icon: <CheckCircle2 className="w-4 h-4" />, color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20' },
  info:    { icon: <Info className="w-4 h-4" />, color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/20' },
  trend:   { icon: <TrendingUp className="w-4 h-4" />, color: 'text-purple-400', bg: 'bg-purple-500/10', border: 'border-purple-500/20' },
};

const PERSONA_ICON: Record<PersonaType, React.ReactNode> = {
  government: <Building2 className="w-3 h-3" />,
  business:   <Briefcase className="w-3 h-3" />,
  commuter:   <Train className="w-3 h-3" />,
};

interface NotificationDropdownProps {
  activePersona?: PersonaType;
}

export function NotificationDropdown({ activePersona = 'government' }: NotificationDropdownProps) {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>(ALL_NOTIFICATIONS);
  const [filterPersona, setFilterPersona] = useState(true); // true = show only active persona
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const visible = filterPersona
    ? notifications.filter((n) => n.personas.includes(activePersona))
    : notifications;

  const unreadCount = notifications
    .filter((n) => n.personas.includes(activePersona) && !n.read).length;

  const markAllRead = () => {
    setNotifications((prev) =>
      prev.map((n) => (n.personas.includes(activePersona) ? { ...n, read: true } : n))
    );
  };

  const markRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  };

  const clearPersona = () => {
    setNotifications((prev) => prev.filter((n) => !n.personas.includes(activePersona)));
    setOpen(false);
  };

  return (
    <div ref={ref} className="relative">
      <button onClick={() => setOpen((v) => !v)}
        className="p-1.5 rounded-lg text-slate-400 hover:text-brand-lime hover:bg-slate-800/60 transition-colors relative">
        <Bell className="w-4 h-4" />
        {unreadCount > 0 && (
          <span className="absolute top-0.5 right-0.5 min-w-[14px] h-[14px] bg-brand-lime rounded-full flex items-center justify-center text-[8px] font-bold text-white leading-none px-0.5">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-80 rounded-2xl border border-slate-700/60 shadow-2xl z-50 overflow-hidden"
          style={{ background: 'rgba(10,15,29,0.97)', boxShadow: '0 20px 50px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,124,0,0.08)', animation: 'dropIn 0.15s ease-out' }}>
          
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <Bell className="w-3.5 h-3.5 text-brand-lime" />
              <span className="text-sm font-bold text-slate-100">Notifikasi</span>
              {unreadCount > 0 && (
                <span className="px-1.5 py-0.5 text-[10px] font-bold bg-brand-lime/20 text-brand-lime rounded-full border border-brand-lime/30">
                  {unreadCount} baru
                </span>
              )}
            </div>
            <div className="flex items-center gap-1">
              {unreadCount > 0 && (
                <button onClick={markAllRead} className="p-1.5 rounded-lg text-slate-500 hover:text-slate-300 hover:bg-slate-800 transition-colors" title="Tandai semua dibaca">
                  <MailOpen className="w-3.5 h-3.5" />
                </button>
              )}
              <button onClick={clearPersona} className="p-1.5 rounded-lg text-slate-500 hover:text-red-400 hover:bg-slate-800 transition-colors" title="Hapus semua">
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Persona Filter Tabs */}
          <div className="flex border-b border-slate-800 px-3 pt-2 gap-2">
            {[true, false].map((v) => (
              <button key={String(v)} onClick={() => setFilterPersona(v)}
                className={`pb-2 text-[11px] font-semibold border-b-2 transition-colors flex items-center gap-1.5 ${
                  filterPersona === v ? 'border-brand-lime text-brand-lime' : 'border-transparent text-slate-500 hover:text-slate-300'
                }`}>
                {v ? <>{PERSONA_ICON[activePersona]} {activePersona.charAt(0).toUpperCase() + activePersona.slice(1)}</> : 'Semua'}
              </button>
            ))}
          </div>

          {/* Notification List */}
          <div className="max-h-80 overflow-y-auto">
            {visible.length === 0 ? (
              <div className="py-10 flex flex-col items-center gap-2 text-slate-600">
                <Bell className="w-8 h-8 opacity-40" />
                <p className="text-xs">Tidak ada notifikasi</p>
              </div>
            ) : (
              visible.map((notif) => {
                const cfg = TYPE_CONFIG[notif.type];
                return (
                  <button key={notif.id} onClick={() => markRead(notif.id)}
                    className={`w-full text-left flex gap-3 px-4 py-3 border-b border-slate-800/60 last:border-b-0 transition-colors ${
                      notif.read ? 'opacity-60 hover:opacity-80' : 'hover:bg-slate-800/40'
                    }`}>
                    <div className={`mt-0.5 w-7 h-7 rounded-lg flex-shrink-0 flex items-center justify-center ${cfg.bg} border ${cfg.border} ${cfg.color}`}>
                      {cfg.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-1">
                        <p className="text-xs font-semibold text-slate-200 leading-tight">{notif.title}</p>
                        {!notif.read && <span className="flex-shrink-0 w-1.5 h-1.5 bg-brand-lime rounded-full mt-1" />}
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed line-clamp-2">{notif.description}</p>
                      <p className="text-[10px] text-slate-600 mt-1">{notif.time}</p>
                    </div>
                  </button>
                );
              })
            )}
          </div>

          {visible.length > 0 && (
            <div className="px-4 py-2.5 border-t border-slate-800 text-center">
              <button className="text-[11px] text-brand-lime hover:text-brand-lime font-medium transition-colors">
                Lihat semua aktivitas →
              </button>
            </div>
          )}
        </div>
      )}

      <style>{`
        @keyframes dropIn {
          from { opacity: 0; transform: translateY(-8px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>
    </div>
  );
}
