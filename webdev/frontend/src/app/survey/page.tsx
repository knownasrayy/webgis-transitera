import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { HeaderNav } from '@/components/ui/HeaderNav';
import { Compass, CheckCircle2, ArrowLeft, Camera, Receipt, Store, Home, MapPin } from 'lucide-react';

export const metadata = {
  title: 'Dokumentasi Survei Lapangan #PakSibukGa | TransitERA WebGIS',
  description: 'Galeri dan rekapitulasi data primer survei lapangan MAPID Apps (Activity & Mission) di koridor SRRL Surabaya.'
};

export default function SurveyPage() {
  const surveyCategories = [
    {
      name: 'Activity: Pedestrian & Walkability',
      target: 35,
      collected: 35,
      icon: MapPin,
      color: 'border-cyan-500/40 text-cyan-400',
      desc: 'Fisik trotoar, ketersediaan ramp/tactile paving, zebra cross, dan peneduh jalan.'
    },
    {
      name: 'Activity: Transit Integration',
      target: 30,
      collected: 30,
      icon: Compass,
      color: 'border-blue-500/40 text-blue-400',
      desc: 'Halte WiraWiri/Suroboyo Bus, pangkalan ojol, titik drop-off, dan parkir sepeda.'
    },
    {
      name: 'Mission: Menu Go',
      target: 100,
      collected: 100,
      icon: Store,
      color: 'border-amber-500/40 text-brand-teal',
      desc: 'Warung, kafe komuter, restoran, kisaran harga menu, dan tingkat keramaian pembeli.'
    },
    {
      name: 'Mission: Struk Go',
      target: 60,
      collected: 60,
      icon: Receipt,
      color: 'border-emerald-500/40 text-emerald-400',
      desc: 'Nilai riil transaksi minimarket & F&B sebagai proksi daya beli (People Spending).'
    },
    {
      name: 'Mission: Properti Go',
      target: 100,
      collected: 100,
      icon: Home,
      color: 'border-purple-500/40 text-purple-400',
      desc: 'Properti jual/sewa (ruko, rumah, kos) untuk validasi harga pasar terhadap %Î”NJOP.'
    }
  ];

  const samplePhotos = [
    {
      title: 'Jalur Pedestrian Stasiun Gubeng Timur',
      cat: 'Activity: Pedestrian',
      station: 'Stasiun Gubeng',
      status: 'Valid GPS < 3m',
      url: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=500&auto=format&fit=crop&q=60'
    },
    {
      title: 'Integrasi Halte Feeder WiraWiri Wonokromo',
      cat: 'Activity: Multimodal',
      station: 'Stasiun Wonokromo',
      status: 'Valid GPS < 2m',
      url: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=500&auto=format&fit=crop&q=60'
    },
    {
      title: 'Merchant Kuliner Menu Go Pasar Turi',
      cat: 'Mission: Menu Go',
      station: 'Stasiun Pasar Turi',
      status: 'Valid Transaksi',
      url: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=500&auto=format&fit=crop&q=60'
    },
    {
      title: 'Ruko Komersial Radius 250m Stasiun Waru',
      cat: 'Mission: Properti Go',
      station: 'Stasiun Waru',
      status: 'Valid Listing',
      url: 'https://images.unsplash.com/photo-1582407947304-fd86f028f716?w=500&auto=format&fit=crop&q=60'
    }
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 flex flex-col">
      <HeaderNav />

      <main className="flex-1 max-w-4xl mx-auto px-4 py-8 space-y-8">
        {/* Back Link */}
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs text-cyan-400 hover:text-cyan-300 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Kembali ke Peta WebGIS
        </Link>

        {/* Title Section */}
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold">
            <Compass className="w-3.5 h-3.5" />
            Dokumentasi Survei Lapangan #PakSibukGa
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Galeri & Rekapitulasi 360 Titik Survei Primer
          </h1>
          <p className="text-sm text-slate-400 leading-relaxed">
            Data dikumpulkan langsung melalui <strong>MAPID Apps (Activity & Mission)</strong> di 5 simpul stasiun SRRL Surabaya (Gubeng, Pasar Turi, Semut, Wonokromo, Waru) pada rentang catchment 0â€“1.000 meter.
          </p>
        </div>

        {/* Target vs Realisasi Metric Banner */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="bg-slate-900/60 p-3.5 rounded-xl border border-slate-800 text-center">
            <div className="text-2xl font-black text-white">360</div>
            <div className="text-[11px] text-slate-400 font-medium">Total Titik Valid</div>
          </div>

          <div className="bg-slate-900/60 p-3.5 rounded-xl border border-slate-800 text-center">
            <div className="text-2xl font-black text-cyan-400">100</div>
            <div className="text-[11px] text-slate-400 font-medium">Data Activity Wajib</div>
          </div>

          <div className="bg-slate-900/60 p-3.5 rounded-xl border border-slate-800 text-center">
            <div className="text-2xl font-black text-emerald-400">260</div>
            <div className="text-[11px] text-slate-400 font-medium">Data Mission Riil</div>
          </div>

          <div className="bg-slate-900/60 p-3.5 rounded-xl border border-slate-800 text-center">
            <div className="text-2xl font-black text-indigo-400">5</div>
            <div className="text-[11px] text-slate-400 font-medium">Simpul Stasiun SRRL</div>
          </div>
        </div>

        {/* Kategori Breakdown Cards */}
        <div className="space-y-3">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            Distribusi Kategori Survei
          </h2>

          <div className="grid sm:grid-cols-2 gap-3">
            {surveyCategories.map((cat) => {
              const IconComponent = cat.icon;
              return (
                <div key={cat.name} className="bg-slate-900/60 border border-slate-800 rounded-xl p-3.5 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                      <IconComponent className={`w-4 h-4 ${cat.color}`} />
                      {cat.name}
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-800 text-emerald-300">
                      {cat.collected} / {cat.target} titik
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-relaxed">{cat.desc}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Photo Gallery Grid */}
        <div className="space-y-3">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Camera className="w-4 h-4 text-cyan-400" />
            Galeri Dokumentasi Lapangan
          </h2>

          <div className="grid sm:grid-cols-2 gap-4">
            {samplePhotos.map((photo, i) => (
              <div key={i} className="bg-slate-900/80 border border-slate-800 rounded-xl overflow-hidden shadow-lg group">
                <div className="h-44 w-full bg-slate-800 relative overflow-hidden">
                  <img
                    src={photo.url}
                    alt={photo.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-slate-950/80 backdrop-blur-md text-[10px] font-bold text-cyan-300 border border-slate-700">
                    {photo.cat}
                  </div>
                  <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded bg-emerald-950/80 backdrop-blur-md text-[10px] font-bold text-emerald-300 border border-emerald-700/50">
                    {photo.status}
                  </div>
                </div>
                <div className="p-3">
                  <div className="text-xs font-bold text-slate-100">{photo.title}</div>
                  <div className="text-[11px] text-slate-400 flex items-center gap-1 mt-1">
                    <MapPin className="w-3 h-3 text-cyan-400" />
                    {photo.station}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}


