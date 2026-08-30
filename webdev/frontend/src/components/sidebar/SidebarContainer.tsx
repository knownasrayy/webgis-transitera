'use client';

import React, { useState } from 'react';
import { StationId } from '@/types';
import { PersonaType, getPersonaConfig } from '@/lib/persona';
import { ChoroplethMode, BasemapStyleKey } from '@/components/map/LayerControl';
import {
  getTrainSchedulesForStation,
  getBusRoutesForStation,
  getTouristDestinationsForStation,
  getDemographicsForStation,
  getEnvironmentForStation,
  TrainSchedule,
  BusRoute,
  TouristDestination,
} from '@/lib/dummy-data';
import {
  Layers, Map, Users, TreePine, SlidersHorizontal,
  Store, Landmark, DollarSign, Home,
  Train as TrainIcon, Bus, MapPin, Settings, HelpCircle, MessageSquare,
  ChevronRight, ChevronDown, Clock, AlertTriangle, Droplets, Wind, Thermometer,
  Eye, EyeOff, Star,
} from 'lucide-react';

interface SidebarContainerProps {
  activePersona: PersonaType;
  activeStation?: StationId;
  choroplethMode: ChoroplethMode;
  onChangeChoroplethMode: (mode: ChoroplethMode) => void;
  showSurveyPoints: boolean;
  onToggleSurveyPoints: () => void;
  basemapStyle: BasemapStyleKey;
  onChangeBasemapStyle: (style: BasemapStyleKey) => void;
  h3ScoreRange?: [number, number];
  onChangeH3ScoreRange?: (range: [number, number]) => void;
  h3RingFilter?: number;
  onChangeH3RingFilter?: (ring: number) => void;
  onOpenSettings?: () => void;
  onOpenHelp?: () => void;
  onOpenFeedback?: () => void;
}

/* ── Orange Toggle ── */
function Toggle({ active, onToggle, label }: { active: boolean; onToggle: () => void; label: string }) {
  return (
    <button onClick={onToggle} className="w-full flex items-center justify-between py-1.5 px-2 rounded-lg text-xs hover:bg-slate-800/40 transition-colors group">
      <span className={`font-medium ${active ? 'text-slate-200' : 'text-slate-400'}`}>{label}</span>
      <div className={`toggle-switch ${active ? 'active' : ''}`} />
    </button>
  );
}

/* ── Nav Item ── */
function NavItem({ icon: Icon, label, active, onClick, badge, expandable, expanded }: {
  icon: React.ElementType; label: string; active?: boolean; onClick?: () => void; badge?: string; expandable?: boolean; expanded?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-2.5 py-2 px-3 rounded-lg text-xs font-medium transition-all ${
        active
          ? 'bg-brand-lime/15 text-brand-lime border border-brand-lime/25'
          : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40 border border-transparent'
      }`}
    >
      <Icon className={`w-4 h-4 flex-shrink-0 ${active ? 'text-brand-lime' : 'text-slate-500'}`} />
      <span className="flex-1 text-left">{label}</span>
      {badge && (
        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-brand-lime/15 text-brand-lime border border-brand-lime/25">
          {badge}
        </span>
      )}
      {expandable ? (
        expanded ? <ChevronDown className="w-3 h-3 text-slate-500" /> : <ChevronRight className="w-3 h-3 text-slate-600" />
      ) : (
        !badge && <ChevronRight className="w-3 h-3 text-slate-600" />
      )}
    </button>
  );
}

/* ── Section Header ── */
function SectionHeader({ label }: { label: string }) {
  return (
    <div className="text-[10px] uppercase font-bold tracking-wider text-slate-500 px-3 pt-3 pb-1">
      {label}
    </div>
  );
}

/* ── Basemap Grid (shared) ── */
function BasemapGrid({ basemapStyle, onChangeBasemapStyle }: { basemapStyle: BasemapStyleKey; onChangeBasemapStyle: (s: BasemapStyleKey) => void }) {
  return (
    <>
      <SectionHeader label="Basemap" />
      <div className="px-3">
        <div className="grid grid-cols-2 gap-1">
          {([
            { key: 'street', label: 'Street 3D' },
            { key: 'street-2d', label: 'Street 2D' },
            { key: 'dark', label: 'Dark' },
            { key: 'satellite', label: 'Satellite' },
          ] as const).map(({ key, label }) => (
            <button
              key={key}
              onClick={() => onChangeBasemapStyle(key)}
              className={`py-1.5 px-2 rounded-lg text-[10px] font-bold transition-all border ${
                basemapStyle === key
                  ? 'bg-brand-lime/15 border-brand-lime/40 text-brand-lime'
                  : 'bg-slate-900/60 border-slate-800 text-slate-500 hover:text-slate-300'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
    </>
  );
}

export const SidebarContainer: React.FC<SidebarContainerProps> = ({
  activePersona,
  activeStation = 'gubeng',
  choroplethMode,
  onChangeChoroplethMode,
  showSurveyPoints,
  onToggleSurveyPoints,
  basemapStyle,
  onChangeBasemapStyle,
  h3ScoreRange = [0, 100],
  onChangeH3ScoreRange,
  h3RingFilter = 5,
  onChangeH3RingFilter,
  onOpenSettings,
  onOpenHelp,
  onOpenFeedback,
}) => {
  const config = getPersonaConfig(activePersona);

  // Global active tab state per persona
  const [govActiveTab, setGovActiveTab] = useState<'demographics' | 'environment' | 'filter' | 'layers' | 'legends'>('layers');
  const [bizActiveTab, setBizActiveTab] = useState<'demographics' | 'environment' | 'filter' | 'layers' | 'legends'>('layers');
  const [commuterActiveTab, setCommuterActiveTab] = useState<'schedules' | 'tourist' | 'filter' | 'layers' | 'legends'>('schedules');

  // General Layer States
  const [showEconomicPOI, setShowEconomicPOI] = useState(true);
  const [showNJOPZone, setShowNJOPZone] = useState(true);
  const [showPropertiGo, setShowPropertiGo] = useState(false);
  const [showGistaru, setShowGistaru] = useState(false);
  const [showBhumi, setShowBhumi] = useState(false);
  const [showTraffic, setShowTraffic] = useState(false);

  // Business Specific State
  const [njopRange, setNjopRange] = useState<[number, number]>([0, 25]);
  const [propertyType, setPropertyType] = useState('all');

  // Commuter Specific State
  const [showKRL, setShowKRL] = useState(true);
  const [showBus, setShowBus] = useState(true);

  const demographics = getDemographicsForStation(activeStation);
  const environment = getEnvironmentForStation(activeStation);
  const trainSchedules = getTrainSchedulesForStation(activeStation);
  const busRoutes = getBusRoutesForStation(activeStation);
  const touristSpots = getTouristDestinationsForStation(activeStation);

  // ---------------------------------------------------------------------------
  // SHARED UI RENDERERS (FILTER, LAYERS, LEGENDS)
  // ---------------------------------------------------------------------------
  
  const renderFilterTab = () => (
    <div className="px-3 py-3 space-y-3 border-t border-slate-800/60 mt-2">
      <div className="flex items-center justify-between">
        <div className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider">Filter Spasial</div>
        <button
          onClick={() => {
            onChangeH3ScoreRange?.([0, 100]);
            onChangeH3RingFilter?.(5);
            setNjopRange([0, 25]);
          }}
          className="text-[9px] text-slate-400 hover:text-brand-lime underline"
        >
          Reset Filter
        </button>
      </div>
      
      {/* H3 Catchment & Score Filter */}
      <div className="space-y-2">
        <div>
          <label className="text-[10px] text-slate-400 block mb-1">Catchment Ring: <span className="text-brand-lime font-bold">Ring ≤ {h3RingFilter}</span></label>
          <input type="range" min={0} max={5} value={h3RingFilter} onChange={(e) => onChangeH3RingFilter?.(+e.target.value)}
            className="w-full h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-brand-lime" />
        </div>
        <div>
          <label className="text-[10px] text-slate-400 block mb-1">Min TOD Score: <span className="text-brand-lime font-bold">{h3ScoreRange[0]}</span></label>
          <input type="range" min={0} max={100} value={h3ScoreRange[0]} onChange={(e) => onChangeH3ScoreRange?.([+e.target.value, h3ScoreRange[1]])}
            className="w-full h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-brand-lime" />
        </div>
        <div>
          <label className="text-[10px] text-slate-400 block mb-1">Max TOD Score: <span className="text-brand-lime font-bold">{h3ScoreRange[1]}</span></label>
          <input type="range" min={0} max={100} value={h3ScoreRange[1]} onChange={(e) => onChangeH3ScoreRange?.([h3ScoreRange[0], +e.target.value])}
            className="w-full h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-brand-lime" />
        </div>
      </div>

      {/* NJOP Premium Filter */}
      <div className="pt-2 border-t border-slate-800">
        <label className="text-[10px] text-slate-400 block mb-1">
          NJOP Premium Range: <span className="text-brand-lime font-bold">{njopRange[0]}% – {njopRange[1]}%</span>
        </label>
        <div className="flex gap-2">
          <input type="range" min={0} max={25} value={njopRange[0]} onChange={(e) => setNjopRange([+e.target.value, njopRange[1]])}
            className="flex-1 h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-brand-lime" />
          <input type="range" min={0} max={25} value={njopRange[1]} onChange={(e) => setNjopRange([njopRange[0], +e.target.value])}
            className="flex-1 h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-brand-lime" />
        </div>
      </div>
    </div>
  );

  const renderLayersTab = (isGovBiz: boolean) => (
    <>
      <SectionHeader label="Lapisan Peta (Layers)" />
      <div className="px-3 space-y-1 pb-2">
        <Toggle active={choroplethMode === 'tod_score'} onToggle={() => onChangeChoroplethMode('tod_score')} label="⬡ H3 TOD Grid" />
        <Toggle active={showGistaru} onToggle={() => setShowGistaru(!showGistaru)} label="🗺️ Kawasan BWP (GISTARU)" />
        <Toggle active={showBhumi} onToggle={() => setShowBhumi(!showBhumi)} label="📜 Persil Tanah (Bhumi ATR)" />
        <Toggle active={showSurveyPoints} onToggle={onToggleSurveyPoints} label="📊 Opini Publik (Survei MAPID)" />
        <Toggle active={choroplethMode === 'njop_premium'} onToggle={() => onChangeChoroplethMode('njop_premium')} label="💰 Zona Nilai Lahan (NJOP)" />
        {isGovBiz && <Toggle active={showEconomicPOI} onToggle={() => setShowEconomicPOI(!showEconomicPOI)} label="🏢 Economic POI" />}
        <Toggle active={showTraffic} onToggle={() => setShowTraffic(!showTraffic)} label="🚗 Traffic Real-Time" />
      </div>

      <BasemapGrid basemapStyle={basemapStyle} onChangeBasemapStyle={onChangeBasemapStyle} />
    </>
  );

  const renderLegendsTab = (showAreaSummary: boolean) => (
    <div className="px-3 py-3 space-y-3 border-t border-slate-800/60 mt-2">
      {/* Area Summary Khusus Business */}
      {showAreaSummary && demographics && (
        <div className="mb-4">
          <SectionHeader label="Area Summary" />
          <div className="grid grid-cols-2 gap-1.5 mt-2">
            <div className="bg-slate-800/50 rounded-lg p-1.5 text-center border border-slate-700/50">
              <div className="text-sm font-black text-brand-lime">{demographics.population.toLocaleString()}</div>
              <div className="text-[8px] text-slate-400">Populasi</div>
            </div>
            <div className="bg-slate-800/50 rounded-lg p-1.5 text-center border border-slate-700/50">
              <div className="text-sm font-black text-cyan-400">{demographics.density.toLocaleString()}</div>
              <div className="text-[8px] text-slate-400">Jiwa/km²</div>
            </div>
            <div className="bg-slate-800/50 rounded-lg p-1.5 text-center border border-slate-700/50">
              <div className="text-xs font-bold text-emerald-400">{demographics.avgIncome}</div>
              <div className="text-[8px] text-slate-400">Rata-rata Pendapatan</div>
            </div>
            <div className="bg-slate-800/50 rounded-lg p-1.5 text-center border border-slate-700/50">
              <div className="text-xs font-bold text-brand-teal">{demographics.employmentRate}%</div>
              <div className="text-[8px] text-slate-400">Tingkat Pekerjaan</div>
            </div>
          </div>
        </div>
      )}

      <div className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider">Legenda Simbologi Peta</div>
      
      {/* TOD Score Legend */}
      <div className="space-y-1">
        <div className="text-[10px] font-semibold text-slate-300">TOD Readiness Score (0-100)</div>
        <div className="h-2 rounded-full bg-gradient-to-r from-red-500 via-amber-500 to-emerald-500 w-full" />
        <div className="flex justify-between text-[9px] text-slate-500 font-medium">
          <span>0 (Rendah)</span><span>50 (Sedang)</span><span>100 (Tinggi)</span>
        </div>
      </div>

      {/* NJOP Legend */}
      <div className="space-y-1">
        <div className="text-[10px] font-semibold text-slate-300">Estimasi %ΔNJOP Premium</div>
        <div className="h-2 rounded-full bg-gradient-to-r from-indigo-500 via-blue-500 to-emerald-400 w-full" />
        <div className="flex justify-between text-[9px] text-slate-500 font-medium">
          <span>+0%</span><span>+10%</span><span>+20%</span>
        </div>
      </div>

      {/* Typology Legend */}
      <div className="space-y-1.5">
        <div className="text-[10px] font-semibold text-slate-300">Tipologi Kawasan (Cluster Analysis)</div>
        <div className="flex items-center gap-2 text-[10px]">
          <span className="w-3 h-3 rounded bg-cyan-500 flex-shrink-0" />
          <span className="text-slate-400">Commercial Transit Hub</span>
        </div>
        <div className="flex items-center gap-2 text-[10px]">
          <span className="w-3 h-3 rounded bg-amber-500 flex-shrink-0" />
          <span className="text-slate-400">Mixed-Use Heritage Core</span>
        </div>
        <div className="flex items-center gap-2 text-[10px]">
          <span className="w-3 h-3 rounded bg-brand-lime flex-shrink-0" />
          <span className="text-slate-400">Mixed-Use Residential</span>
        </div>
        <div className="flex items-center gap-2 text-[10px]">
          <span className="w-3 h-3 rounded bg-purple-500 flex-shrink-0" />
          <span className="text-slate-400">Low-Access Feeder Zone</span>
        </div>
      </div>

      {/* Station Markers */}
      <div className="space-y-1.5">
        <div className="text-[10px] font-semibold text-slate-300">Simbol & Marker</div>
        <div className="flex items-center gap-2 text-[10px]">
          <span className="w-3 h-3 rounded-full bg-gradient-to-tr from-brand-lime to-brand-teal border border-white flex-shrink-0" />
          <span className="text-slate-400">Simpul Stasiun SRRL</span>
        </div>
        <div className="flex items-center gap-2 text-[10px]">
          <span className="w-3 h-3 rounded-full bg-pink-500 border border-white flex-shrink-0" />
          <span className="text-slate-400">Titik Opini Publik / Survei MAPID</span>
        </div>
      </div>
    </div>
  );

  return (
    <aside className="hidden md:flex w-[var(--sidebar-width)] h-full flex-col glass-sidebar z-20 overflow-hidden">
      {/* ── Sidebar Header ── */}
      <div className="px-4 py-3 border-b border-slate-800/80">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-brand-lime" />
          <div>
            <h3 className="text-xs font-bold text-brand-lime">{config.sidebarTitle}</h3>
            <p className="text-[10px] text-slate-500">{config.sidebarSubtitle}</p>
          </div>
        </div>
      </div>

      {/* ── Scrollable Content ── */}
      <div className="flex-1 overflow-y-auto py-1">

        {/* ══════ Government Sidebar ══════ */}
        {activePersona === 'government' && (
          <>
            <SectionHeader label="Government Tools (PWK)" />
            <div className="px-2 space-y-0.5">
              <NavItem icon={SlidersHorizontal} label="Filter Spasial" active={govActiveTab === 'filter'} onClick={() => setGovActiveTab('filter')} badge={h3ScoreRange[0] > 0 || h3ScoreRange[1] < 100 || h3RingFilter < 5 || njopRange[0] > 0 || njopRange[1] < 25 ? 'Aktif' : undefined} />
              <NavItem icon={Layers} label="Lapisan Peta (Layers)" active={govActiveTab === 'layers'} onClick={() => setGovActiveTab('layers')} />
              <NavItem icon={Map} label="Legenda (Legends)" active={govActiveTab === 'legends'} onClick={() => setGovActiveTab('legends')} />
              <div className="my-1 border-t border-slate-800/80" />
              <NavItem icon={Users} label="Demografi Spasial" active={govActiveTab === 'demographics'} onClick={() => setGovActiveTab('demographics')} />
              <NavItem icon={TreePine} label="Lingkungan & RTH" active={govActiveTab === 'environment'} onClick={() => setGovActiveTab('environment')} />
            </div>

            {/* General Features Rendering */}
            {govActiveTab === 'filter' && renderFilterTab()}
            {govActiveTab === 'layers' && renderLayersTab(true)}
            {govActiveTab === 'legends' && renderLegendsTab(false)}

            {/* Demographics Panel for Government */}
            {govActiveTab === 'demographics' && demographics && (
              <div className="px-3 py-3 space-y-3 border-t border-slate-800/60 mt-2">
                <div className="flex items-center justify-between">
                  <div className="text-[10px] font-bold text-brand-lime uppercase tracking-wider">
                    {demographics.kecamatan}
                  </div>
                  <span className="text-[9px] bg-brand-lime/10 border border-brand-lime/30 text-brand-lime px-1.5 py-0.5 rounded font-semibold">
                    PWK Buffer
                  </span>
                </div>
                
                {/* Summary Cards */}
                <div className="grid grid-cols-2 gap-1.5">
                  <div className="bg-slate-800/50 rounded-lg p-2 text-center border border-slate-700/40">
                    <div className="text-base font-black text-brand-lime">{demographics.population.toLocaleString()}</div>
                    <div className="text-[9px] text-slate-400">Total Populasi</div>
                  </div>
                  <div className="bg-slate-800/50 rounded-lg p-2 text-center border border-slate-700/40">
                    <div className="text-base font-black text-cyan-400">{demographics.density.toLocaleString()}</div>
                    <div className="text-[9px] text-slate-400">Kepadatan (Jiwa/km²)</div>
                  </div>
                </div>

                {/* Age Pyramid / Distribution */}
                <div className="bg-slate-800/50 rounded-lg p-3 border border-slate-700/40">
                  <div className="text-[10px] font-semibold text-slate-300 mb-2">Struktur Demografi Usia</div>
                  <div className="space-y-2">
                    <div>
                      <div className="flex justify-between text-[10px] mb-0.5">
                        <span className="text-slate-400">Usia Muda (0-17 thn)</span>
                        <span className="text-slate-200 font-bold">{demographics.ageDistribution.youth}%</span>
                      </div>
                      <div className="w-full bg-slate-700 h-1.5 rounded-full overflow-hidden">
                        <div className="h-full bg-blue-500 rounded-full transition-all" style={{ width: `${demographics.ageDistribution.youth}%` }} />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-[10px] mb-0.5">
                        <span className="text-slate-400">Usia Produktif (18-55 thn)</span>
                        <span className="text-slate-200 font-bold">{demographics.ageDistribution.productive}%</span>
                      </div>
                      <div className="w-full bg-slate-700 h-1.5 rounded-full overflow-hidden">
                        <div className="h-full bg-emerald-500 rounded-full transition-all" style={{ width: `${demographics.ageDistribution.productive}%` }} />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-[10px] mb-0.5">
                        <span className="text-slate-400">Usia Lansia (56+ thn)</span>
                        <span className="text-slate-200 font-bold">{demographics.ageDistribution.elderly}%</span>
                      </div>
                      <div className="w-full bg-slate-700 h-1.5 rounded-full overflow-hidden">
                        <div className="h-full bg-amber-500 rounded-full transition-all" style={{ width: `${demographics.ageDistribution.elderly}%` }} />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Socio-Economic Status */}
                <div className="grid grid-cols-2 gap-1.5">
                  <div className="bg-slate-800/50 rounded-lg p-2 text-center border border-slate-700/40">
                    <div className="text-xs font-bold text-slate-200">{demographics.householdCount.toLocaleString()}</div>
                    <div className="text-[9px] text-slate-400">Kepala Keluarga</div>
                  </div>
                  <div className="bg-slate-800/50 rounded-lg p-2 text-center border border-slate-700/40">
                    <div className="text-xs font-bold text-emerald-400">{demographics.employmentRate}%</div>
                    <div className="text-[9px] text-slate-400">Tingkat Bekerja</div>
                  </div>
                </div>
              </div>
            )}

            {/* Environment & Disaster Panel for Government */}
            {govActiveTab === 'environment' && environment && (
              <div className="px-3 py-3 space-y-2 border-t border-slate-800/60 mt-2">
                <div className="text-[10px] font-bold text-brand-lime uppercase tracking-wider">Daya Dukung Lingkungan & Risiko</div>
                
                {/* AQI */}
                <div className="bg-slate-800/50 rounded-lg p-3 border border-slate-700/40 flex items-center gap-3">
                  <Wind className="w-5 h-5 flex-shrink-0" style={{ color: environment.aqiColor }} />
                  <div className="flex-1">
                    <div className="flex justify-between items-baseline">
                      <span className="text-[10px] text-slate-400">Kualitas Udara (AQI)</span>
                      <span className="text-sm font-black" style={{ color: environment.aqiColor }}>{environment.aqi}</span>
                    </div>
                    <div className="text-[10px] font-medium" style={{ color: environment.aqiColor }}>{environment.aqiLabel}</div>
                    <div className="text-[9px] text-slate-500">PM2.5: {environment.pm25} µg/m³</div>
                  </div>
                </div>

                {/* Flood Risk */}
                <div className="bg-slate-800/50 rounded-lg p-3 border border-slate-700/40 flex items-center gap-3">
                  <Droplets className="w-5 h-5 flex-shrink-0" style={{ color: environment.floodRiskColor }} />
                  <div className="flex-1">
                    <div className="flex justify-between items-baseline">
                      <span className="text-[10px] text-slate-400">Mitigasi Banjir</span>
                      <span className="text-xs font-bold uppercase px-1.5 py-0.5 rounded" style={{ color: environment.floodRiskColor, backgroundColor: `${environment.floodRiskColor}15`, border: `1px solid ${environment.floodRiskColor}40` }}>
                        Risiko {environment.floodRisk}
                      </span>
                    </div>
                    <div className="text-[9px] text-slate-400 mt-1">Perlu penguatan drainase primer koridor stasiun.</div>
                  </div>
                </div>

                {/* RTH & Micro Climate */}
                <div className="grid grid-cols-2 gap-1.5">
                  <div className="bg-slate-800/50 rounded-lg p-2 text-center border border-slate-700/40">
                    <TreePine className="w-4 h-4 text-emerald-400 mx-auto mb-1" />
                    <div className="text-sm font-bold text-emerald-400">{environment.greenSpacePct}%</div>
                    <div className="text-[9px] text-slate-400">Cakupan RTH</div>
                  </div>
                  <div className="bg-slate-800/50 rounded-lg p-2 text-center border border-slate-700/40">
                    <Thermometer className="w-4 h-4 text-red-400 mx-auto mb-1" />
                    <div className="text-sm font-bold text-red-400">{environment.temperature}°C</div>
                    <div className="text-[9px] text-slate-400">Suhu Permukaan</div>
                  </div>
                </div>
              </div>
            )}
          </>
        )}

        {/* ══════ Business/Investor Sidebar ══════ */}
        {activePersona === 'business' && (
          <>
            <SectionHeader label="Business/Investor Views" />
            <div className="px-2 space-y-0.5">
              <NavItem icon={SlidersHorizontal} label="Filter Spasial" active={bizActiveTab === 'filter'} onClick={() => setBizActiveTab('filter')} badge={h3ScoreRange[0] > 0 || h3ScoreRange[1] < 100 || h3RingFilter < 5 || njopRange[0] > 0 || njopRange[1] < 25 ? 'Aktif' : undefined} />
              <NavItem icon={Layers} label="Lapisan Peta (Layers)" active={bizActiveTab === 'layers'} onClick={() => setBizActiveTab('layers')} />
              <NavItem icon={Map} label="Legenda (Legends)" active={bizActiveTab === 'legends'} onClick={() => setBizActiveTab('legends')} />
              <div className="my-1 border-t border-slate-800/80" />
              <NavItem icon={Users} label="Demografi Spasial" active={bizActiveTab === 'demographics'} onClick={() => setBizActiveTab('demographics')} />
              <NavItem icon={TreePine} label="Lingkungan & RTH" active={bizActiveTab === 'environment'} onClick={() => setBizActiveTab('environment')} />
            </div>

            {/* General Features Rendering */}
            {bizActiveTab === 'filter' && renderFilterTab()}
            {bizActiveTab === 'layers' && renderLayersTab(true)}
            {bizActiveTab === 'legends' && renderLegendsTab(true)}


            {/* Demographics Panel */}
            {bizActiveTab === 'demographics' && demographics && (
              <div className="px-3 py-3 space-y-3 border-t border-slate-800/60 mt-2">
                <div className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider">
                  {demographics.kecamatan}
                </div>
                <div className="space-y-2">
                  <div className="bg-slate-800/50 rounded-lg p-3">
                    <div className="text-[10px] text-slate-400 mb-2">Distribusi Usia</div>
                    <div className="space-y-1.5">
                      <div>
                        <div className="flex justify-between text-[10px] mb-0.5">
                          <span className="text-slate-400">Muda (0-17)</span>
                          <span className="text-slate-200 font-bold">{demographics.ageDistribution.youth}%</span>
                        </div>
                        <div className="w-full bg-slate-700 h-1.5 rounded-full overflow-hidden">
                          <div className="h-full bg-blue-500 rounded-full transition-all" style={{ width: `${demographics.ageDistribution.youth}%` }} />
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between text-[10px] mb-0.5">
                          <span className="text-slate-400">Produktif (18-55)</span>
                          <span className="text-slate-200 font-bold">{demographics.ageDistribution.productive}%</span>
                        </div>
                        <div className="w-full bg-slate-700 h-1.5 rounded-full overflow-hidden">
                          <div className="h-full bg-emerald-500 rounded-full transition-all" style={{ width: `${demographics.ageDistribution.productive}%` }} />
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between text-[10px] mb-0.5">
                          <span className="text-slate-400">Lansia (56+)</span>
                          <span className="text-slate-200 font-bold">{demographics.ageDistribution.elderly}%</span>
                        </div>
                        <div className="w-full bg-slate-700 h-1.5 rounded-full overflow-hidden">
                          <div className="h-full bg-amber-500 rounded-full transition-all" style={{ width: `${demographics.ageDistribution.elderly}%` }} />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-1.5">
                    <div className="bg-slate-800/50 rounded-lg p-2 text-center">
                      <div className="text-sm font-bold text-slate-200">{demographics.householdCount.toLocaleString()}</div>
                      <div className="text-[9px] text-slate-500">Rumah Tangga</div>
                    </div>
                    <div className="bg-slate-800/50 rounded-lg p-2 text-center">
                      <div className={`text-sm font-bold ${demographics.incomeLevel === 'high' ? 'text-emerald-400' : demographics.incomeLevel === 'medium' ? 'text-brand-teal' : 'text-red-400'}`}>
                        {demographics.incomeLevel === 'high' ? '▲ Tinggi' : demographics.incomeLevel === 'medium' ? '● Sedang' : '▼ Rendah'}
                      </div>
                      <div className="text-[9px] text-slate-500">Income Level</div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Environment Panel */}
            {bizActiveTab === 'environment' && environment && (
              <div className="px-3 py-3 space-y-2 border-t border-slate-800/60 mt-2">
                <div className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider">Kondisi Lingkungan</div>
                <div className="space-y-2">
                  {/* AQI */}
                  <div className="bg-slate-800/50 rounded-lg p-3 flex items-center gap-3">
                    <Wind className="w-5 h-5 flex-shrink-0" style={{ color: environment.aqiColor }} />
                    <div className="flex-1">
                      <div className="flex justify-between items-baseline">
                        <span className="text-[10px] text-slate-400">Air Quality (AQI)</span>
                        <span className="text-sm font-black" style={{ color: environment.aqiColor }}>{environment.aqi}</span>
                      </div>
                      <div className="text-[10px] font-medium" style={{ color: environment.aqiColor }}>{environment.aqiLabel}</div>
                      <div className="text-[9px] text-slate-500">PM2.5: {environment.pm25} µg/m³</div>
                    </div>
                  </div>
                  {/* Flood Risk */}
                  <div className="bg-slate-800/50 rounded-lg p-3 flex items-center gap-3">
                    <Droplets className="w-5 h-5 flex-shrink-0" style={{ color: environment.floodRiskColor }} />
                    <div className="flex-1">
                      <div className="flex justify-between items-baseline">
                        <span className="text-[10px] text-slate-400">Risiko Banjir</span>
                        <span className="text-xs font-bold uppercase px-1.5 py-0.5 rounded" style={{ color: environment.floodRiskColor, backgroundColor: `${environment.floodRiskColor}15`, border: `1px solid ${environment.floodRiskColor}40` }}>
                          {environment.floodRisk}
                        </span>
                      </div>
                    </div>
                  </div>
                  {/* Green Space & Noise */}
                  <div className="grid grid-cols-2 gap-1.5">
                    <div className="bg-slate-800/50 rounded-lg p-2 text-center">
                      <TreePine className="w-4 h-4 text-emerald-400 mx-auto mb-1" />
                      <div className="text-sm font-bold text-emerald-400">{environment.greenSpacePct}%</div>
                      <div className="text-[9px] text-slate-500">RTH</div>
                    </div>
                    <div className="bg-slate-800/50 rounded-lg p-2 text-center">
                      <Thermometer className="w-4 h-4 text-red-400 mx-auto mb-1" />
                      <div className="text-sm font-bold text-red-400">{environment.temperature}°C</div>
                      <div className="text-[9px] text-slate-500">Suhu</div>
                    </div>
                  </div>
                </div>
              </div>
            )}


          </>
        )}

        {/* ══════ Commuter Sidebar ══════ */}
        {activePersona === 'commuter' && (
          <>
            <SectionHeader label="Navigation" />
            <div className="px-2 space-y-0.5">
              <NavItem icon={SlidersHorizontal} label="Filter Spasial" active={commuterActiveTab === 'filter'} onClick={() => setCommuterActiveTab('filter')} badge={h3ScoreRange[0] > 0 || h3ScoreRange[1] < 100 || h3RingFilter < 5 || njopRange[0] > 0 || njopRange[1] < 25 ? 'Aktif' : undefined} />
              <NavItem icon={Layers} label="Lapisan Peta (Layers)" active={commuterActiveTab === 'layers'} onClick={() => setCommuterActiveTab('layers')} />
              <NavItem icon={Map} label="Legenda (Legends)" active={commuterActiveTab === 'legends'} onClick={() => setCommuterActiveTab('legends')} />
              <div className="my-1 border-t border-slate-800/80" />
              <NavItem icon={TrainIcon} label="Jadwal Transit" active={commuterActiveTab === 'schedules'} onClick={() => setCommuterActiveTab('schedules')} badge={`${trainSchedules.length + busRoutes.length}`} />
              <NavItem icon={MapPin} label="Destinasi Terdekat" active={commuterActiveTab === 'tourist'} onClick={() => setCommuterActiveTab('tourist')} badge={`${touristSpots.length}`} />
            </div>

            {/* General Features Rendering */}
            {commuterActiveTab === 'filter' && renderFilterTab()}
            {commuterActiveTab === 'layers' && renderLayersTab(false)}
            {commuterActiveTab === 'legends' && renderLegendsTab(false)}

            {/* Consolidated Schedules */}
            {commuterActiveTab === 'schedules' && (
              <div className="px-3 py-3 space-y-2 border-t border-slate-800/60 mt-2">
                <div className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider">Jadwal Transportasi</div>
                
                {/* Filters */}
                <div className="bg-slate-900/40 p-2 rounded-lg border border-slate-800 space-y-2 mb-3">
                  <div className="text-[9px] text-slate-500 font-bold mb-1">FILTER MODA</div>
                  <Toggle active={showKRL} onToggle={() => setShowKRL(!showKRL)} label="KRL / Kereta Lokal" />
                  <Toggle active={showBus} onToggle={() => setShowBus(!showBus)} label="Feeder Suroboyo Bus" />
                </div>

                <div className="space-y-2 max-h-[320px] overflow-y-auto pr-1">
                  {showKRL && trainSchedules.map((t) => (
                    <div key={t.id} className="bg-slate-800/50 rounded-lg p-2.5 border border-slate-700/50 hover:border-brand-lime/30 transition-colors">
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-1.5">
                          <TrainIcon className="w-3.5 h-3.5 text-brand-lime" />
                          <span className="text-[11px] font-bold text-slate-200">{t.trainNumber}</span>
                        </div>
                        <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                          t.status === 'on_time' ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/25' :
                          t.status === 'delayed' ? 'bg-amber-500/15 text-brand-teal border border-amber-500/25' :
                          'bg-slate-700 text-slate-400 border border-slate-600'
                        }`}>
                          {t.status === 'on_time' ? '● On Time' : t.status === 'delayed' ? '⚠ Delayed' : '✓ Departed'}
                        </span>
                      </div>
                      <div className="text-[10px] text-slate-400 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span className="tabular-nums text-slate-200">{t.departureTime}</span>
                        <span className="text-slate-600">→</span>
                        <span className="tabular-nums text-slate-200">{t.arrivalTime}</span>
                      </div>
                      <div className="text-[10px] text-slate-500 mt-0.5">
                        {t.origin} → {t.destination}
                      </div>
                      <div className="text-[9px] text-slate-600 mt-0.5">
                        Platform {t.platform} · {t.type}
                      </div>
                    </div>
                  ))}

                  {showBus && busRoutes.length === 0 && (
                    <div className="text-[11px] text-slate-500 text-center py-4 border border-dashed border-slate-700 rounded-lg">
                      Belum ada rute feeder yang melayani stasiun ini.
                    </div>
                  )}

                  {showBus && busRoutes.map((r) => (
                    <div key={r.id} className="bg-slate-800/50 rounded-lg p-2.5 border border-slate-700/50 hover:border-brand-lime/30 transition-colors">
                      <div className="flex items-center justify-between mb-1.5">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-black px-1.5 py-0.5 rounded text-white" style={{ backgroundColor: r.color }}>
                            {r.routeCode}
                          </span>
                          <span className="text-[11px] font-bold text-slate-200">{r.routeName}</span>
                        </div>
                      </div>
                      <div className="text-[10px] text-slate-400 space-y-0.5">
                        <div className="flex items-center gap-1"><Clock className="w-3 h-3" /><span>{r.frequency}</span></div>
                        <div className="flex items-center gap-1"><Bus className="w-3 h-3" /><span>{r.operatingHours}</span></div>
                        <div className="text-emerald-400 font-medium">{r.fare}</div>
                      </div>
                      <div className="mt-2 pt-2 border-t border-slate-700/50">
                        <div className="text-[9px] text-slate-500 font-bold mb-1">HALTE ({r.stops.length} pemberhentian)</div>
                        <div className="space-y-0.5">
                          {r.stops.map((stop, i) => (
                            <div key={i} className="flex items-center gap-1.5 text-[10px]">
                              <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: r.color }} />
                              <span className={`${i === 0 || i === r.stops.length - 1 ? 'text-slate-200 font-medium' : 'text-slate-500'}`}>
                                {stop.name}
                              </span>
                            </div>
                          ))}
                        </div>
                        <div className="text-[9px] text-slate-500 mt-1">Est. waktu: {r.estimatedTime}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tourist Destinations */}
            {commuterActiveTab === 'tourist' && (
              <div className="px-3 py-3 space-y-2 border-t border-slate-800/60 mt-2">
                <div className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider">Destinasi Terdekat</div>
                <div className="space-y-1.5 max-h-[320px] overflow-y-auto pr-1">
                  {touristSpots.map((d) => (
                    <div key={d.id} className="bg-slate-800/50 rounded-lg p-2.5 border border-slate-700/50 hover:border-brand-lime/30 transition-colors cursor-pointer group">
                      <div className="flex items-start gap-2.5">
                        <span className="text-xl">{d.imageEmoji}</span>
                        <div className="flex-1 min-w-0">
                          <div className="text-[11px] font-bold text-slate-200 group-hover:text-brand-lime transition-colors">{d.name}</div>
                          <div className="text-[10px] text-slate-500 leading-relaxed">{d.description}</div>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-[9px] text-brand-teal font-bold flex items-center gap-0.5">
                              <Star className="w-2.5 h-2.5 fill-brand-teal" /> {d.rating}
                            </span>
                            <span className="text-[9px] text-slate-500">·</span>
                            <span className="text-[9px] text-slate-400">{d.distanceFromStation}</span>
                            <span className="text-[9px] text-slate-500">·</span>
                            <span className="text-[9px] text-slate-400">{d.walkTime}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}


          </>
        )}
      </div>

      {/* ══════ Bottom Actions ══════ */}
      <div className="border-t border-slate-800/80 px-2 py-2 space-y-0.5">
        <NavItem icon={Settings} label="Pengaturan" onClick={onOpenSettings} />
        <NavItem icon={HelpCircle} label="Pusat Bantuan" onClick={onOpenHelp} />
        <NavItem icon={MessageSquare} label="Kirim Feedback" onClick={onOpenFeedback} />
      </div>
    </aside>
  );
};
