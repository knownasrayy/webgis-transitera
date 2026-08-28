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
  onOpenSettings?: () => void;
  onOpenHelp?: () => void;
  onOpenFeedback?: () => void;
}

/* â”€â”€ Orange Toggle â”€â”€ */
function Toggle({ active, onToggle, label }: { active: boolean; onToggle: () => void; label: string }) {
  return (
    <button onClick={onToggle} className="w-full flex items-center justify-between py-1.5 px-2 rounded-lg text-xs hover:bg-slate-800/40 transition-colors group">
      <span className={`font-medium ${active ? 'text-slate-200' : 'text-slate-400'}`}>{label}</span>
      <div className={`toggle-switch ${active ? 'active' : ''}`} />
    </button>
  );
}

/* â”€â”€ Nav Item â”€â”€ */
function NavItem({ icon: Icon, label, active, onClick, badge, expandable, expanded }: {
  icon: React.ElementType; label: string; active?: boolean; onClick?: () => void; badge?: string; expandable?: boolean; expanded?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-2.5 py-2 px-3 rounded-lg text-xs font-medium transition-all ${
        active
          ? 'bg-orange-500/15 text-orange-400 border border-orange-500/25'
          : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40 border border-transparent'
      }`}
    >
      <Icon className={`w-4 h-4 flex-shrink-0 ${active ? 'text-orange-400' : 'text-slate-500'}`} />
      <span className="flex-1 text-left">{label}</span>
      {badge && (
        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-orange-500/15 text-orange-400 border border-orange-500/25">
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

/* â”€â”€ Section Header â”€â”€ */
function SectionHeader({ label }: { label: string }) {
  return (
    <div className="text-[10px] uppercase font-bold tracking-wider text-slate-500 px-3 pt-3 pb-1">
      {label}
    </div>
  );
}

/* â”€â”€ Basemap Grid (shared) â”€â”€ */
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
                  ? 'bg-orange-500/15 border-orange-500/40 text-orange-400'
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
  onOpenSettings,
  onOpenHelp,
  onOpenFeedback,
}) => {
  const config = getPersonaConfig(activePersona);

  // Government state
  const [govActiveTab, setGovActiveTab] = useState<'layers' | 'h3filter' | 'legend'>('layers');
  const [h3ScoreRange, setH3ScoreRange] = useState<[number, number]>([0, 100]);
  const [h3RingFilter, setH3RingFilter] = useState<number>(3);

  // Business state
  const [bizActiveTab, setBizActiveTab] = useState<'mapview' | 'demographics' | 'environment' | 'filters'>('mapview');
  const [showEconomicPOI, setShowEconomicPOI] = useState(true);
  const [showNJOPZone, setShowNJOPZone] = useState(true);
  const [showPropertiGo, setShowPropertiGo] = useState(false);
  const [njopRange, setNjopRange] = useState<[number, number]>([0, 25]);
  const [propertyType, setPropertyType] = useState('all');

  // Commuter state
  const [commuterActiveTab, setCommuterActiveTab] = useState<'train' | 'bus' | 'tourist'>('train');

  const demographics = getDemographicsForStation(activeStation);
  const environment = getEnvironmentForStation(activeStation);
  const trainSchedules = getTrainSchedulesForStation(activeStation);
  const busRoutes = getBusRoutesForStation(activeStation);
  const touristSpots = getTouristDestinationsForStation(activeStation);

  return (
    <aside className="hidden md:flex w-[var(--sidebar-width)] h-full flex-col glass-sidebar z-20 overflow-hidden">
      {/* â”€â”€ Sidebar Header â”€â”€ */}
      <div className="px-4 py-3 border-b border-slate-800/80">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-orange-500" />
          <div>
            <h3 className="text-xs font-bold text-orange-400">{config.sidebarTitle}</h3>
            <p className="text-[10px] text-slate-500">{config.sidebarSubtitle}</p>
          </div>
        </div>
      </div>

      {/* â”€â”€ Scrollable Content â”€â”€ */}
      <div className="flex-1 overflow-y-auto py-1">

        {/* â•â•â•â•â•â• Government Sidebar â•â•â•â•â•â• */}
        {activePersona === 'government' && (
          <>
            <SectionHeader label="Map Layers" />
            <div className="px-2 space-y-0.5">
              <NavItem icon={Layers} label="Layers" active={govActiveTab === 'layers'} onClick={() => setGovActiveTab('layers')} badge="5D" />
              <NavItem icon={SlidersHorizontal} label="H3 Filters" active={govActiveTab === 'h3filter'} onClick={() => setGovActiveTab('h3filter')} />
              <NavItem icon={Map} label="Legend" active={govActiveTab === 'legend'} onClick={() => setGovActiveTab('legend')} />
            </div>

            {/* H3 Filter Panel */}
            {govActiveTab === 'h3filter' && (
              <div className="px-3 py-3 space-y-3 border-t border-slate-800/60 mt-2">
                <div className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider">H3 Score Filter</div>
                <div>
                  <label className="text-[10px] text-slate-400 block mb-1">Min TOD Score: <span className="text-orange-400 font-bold">{h3ScoreRange[0]}</span></label>
                  <input type="range" min={0} max={100} value={h3ScoreRange[0]} onChange={(e) => setH3ScoreRange([+e.target.value, h3ScoreRange[1]])}
                    className="w-full h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-brand-lime" />
                </div>
                <div>
                  <label className="text-[10px] text-slate-400 block mb-1">Max TOD Score: <span className="text-orange-400 font-bold">{h3ScoreRange[1]}</span></label>
                  <input type="range" min={0} max={100} value={h3ScoreRange[1]} onChange={(e) => setH3ScoreRange([h3ScoreRange[0], +e.target.value])}
                    className="w-full h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-brand-lime" />
                </div>
                <div>
                  <label className="text-[10px] text-slate-400 block mb-1">Ring Distance: <span className="text-orange-400 font-bold">{h3RingFilter}</span></label>
                  <input type="range" min={0} max={5} value={h3RingFilter} onChange={(e) => setH3RingFilter(+e.target.value)}
                    className="w-full h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-brand-lime" />
                </div>
                <div className="text-[9px] text-slate-500 pt-1 border-t border-slate-800">
                  Menampilkan sel H3 dengan skor {h3ScoreRange[0]}â€“{h3ScoreRange[1]} dalam ring â‰¤{h3RingFilter}
                </div>
              </div>
            )}

            {/* Legend Panel */}
            {govActiveTab === 'legend' && (
              <div className="px-3 py-3 space-y-3 border-t border-slate-800/60 mt-2">
                <div className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider">Map Legend</div>
                
                {/* TOD Score Legend */}
                <div className="space-y-1">
                  <div className="text-[10px] font-semibold text-slate-300">TOD Readiness Score</div>
                  <div className="h-2 rounded-full bg-gradient-to-r from-red-500 via-amber-500 to-emerald-500 w-full" />
                  <div className="flex justify-between text-[9px] text-slate-500 font-medium">
                    <span>0 (Rendah)</span><span>50 (Sedang)</span><span>100 (Tinggi)</span>
                  </div>
                </div>

                {/* NJOP Legend */}
                <div className="space-y-1">
                  <div className="text-[10px] font-semibold text-slate-300">%Î”NJOP Premium</div>
                  <div className="h-2 rounded-full bg-gradient-to-r from-indigo-500 via-blue-500 to-emerald-400 w-full" />
                  <div className="flex justify-between text-[9px] text-slate-500 font-medium">
                    <span>+0%</span><span>+10%</span><span>+20%</span>
                  </div>
                </div>

                {/* Typology Legend */}
                <div className="space-y-1.5">
                  <div className="text-[10px] font-semibold text-slate-300">Tipologi Kawasan</div>
                  <div className="flex items-center gap-2 text-[10px]">
                    <span className="w-3 h-3 rounded bg-cyan-500 flex-shrink-0" />
                    <span className="text-slate-400">Commercial Transit Hub</span>
                  </div>
                  <div className="flex items-center gap-2 text-[10px]">
                    <span className="w-3 h-3 rounded bg-amber-500 flex-shrink-0" />
                    <span className="text-slate-400">Mixed-Use Heritage Core</span>
                  </div>
                  <div className="flex items-center gap-2 text-[10px]">
                    <span className="w-3 h-3 rounded bg-orange-500 flex-shrink-0" />
                    <span className="text-slate-400">Mixed-Use Residential</span>
                  </div>
                  <div className="flex items-center gap-2 text-[10px]">
                    <span className="w-3 h-3 rounded bg-purple-500 flex-shrink-0" />
                    <span className="text-slate-400">Low-Access Feeder Zone</span>
                  </div>
                </div>

                {/* Station Markers */}
                <div className="space-y-1.5">
                  <div className="text-[10px] font-semibold text-slate-300">Simbol</div>
                  <div className="flex items-center gap-2 text-[10px]">
                    <span className="w-3 h-3 rounded-full bg-gradient-to-tr from-orange-500 to-amber-400 border border-white flex-shrink-0" />
                    <span className="text-slate-400">Simpul Stasiun</span>
                  </div>
                  <div className="flex items-center gap-2 text-[10px]">
                    <span className="w-3 h-3 rounded-full bg-pink-500 border border-white flex-shrink-0" />
                    <span className="text-slate-400">Titik Survei #PakSibukGa</span>
                  </div>
                </div>
              </div>
            )}

            <SectionHeader label="Active Overlays" />
            <div className="px-3 space-y-1">
              <Toggle active={choroplethMode === 'tod_score'} onToggle={() => onChangeChoroplethMode('tod_score')} label="H3 TOD Grid" />
              <Toggle active={showSurveyPoints} onToggle={onToggleSurveyPoints} label="Survei #PakSibukGa" />
              <Toggle active={choroplethMode === 'njop_premium'} onToggle={() => onChangeChoroplethMode('njop_premium')} label="Nilai Lahan (NJOP)" />
              <Toggle active={choroplethMode === 'typology'} onToggle={() => onChangeChoroplethMode('typology')} label="Tipologi Kawasan" />
            </div>

            <BasemapGrid basemapStyle={basemapStyle} onChangeBasemapStyle={onChangeBasemapStyle} />

            {/* Dynamic Choropleth Legend */}
            <SectionHeader label="Active Legend" />
            <div className="px-3 pb-2">
              {choroplethMode === 'tod_score' && (
                <div className="space-y-1">
                  <div className="h-1.5 rounded-full bg-gradient-to-r from-red-500 via-amber-500 to-emerald-500 w-full" />
                  <div className="flex justify-between text-[9px] text-slate-500 font-medium">
                    <span>0 (Rendah)</span><span>50</span><span>100 (Tinggi)</span>
                  </div>
                </div>
              )}
              {choroplethMode === 'njop_premium' && (
                <div className="space-y-1">
                  <div className="h-1.5 rounded-full bg-gradient-to-r from-indigo-500 via-blue-500 to-emerald-400 w-full" />
                  <div className="flex justify-between text-[9px] text-slate-500 font-medium">
                    <span>+0%</span><span>+10%</span><span>+20%</span>
                  </div>
                </div>
              )}
              {choroplethMode === 'typology' && (
                <div className="space-y-1 text-[10px]">
                  <div className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded bg-cyan-500" /><span className="text-slate-400">Commercial Hub</span></div>
                  <div className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded bg-amber-500" /><span className="text-slate-400">Mixed-Use</span></div>
                  <div className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded bg-purple-500" /><span className="text-slate-400">Feeder Zone</span></div>
                </div>
              )}
            </div>
          </>
        )}

        {/* â•â•â•â•â•â• Business/Investor Sidebar â•â•â•â•â•â• */}
        {activePersona === 'business' && (
          <>
            <SectionHeader label="Spatial Views" />
            <div className="px-2 space-y-0.5">
              <NavItem icon={Map} label="Map View" active={bizActiveTab === 'mapview'} onClick={() => setBizActiveTab('mapview')} />
              <NavItem icon={Users} label="Demographics" active={bizActiveTab === 'demographics'} onClick={() => setBizActiveTab('demographics')} />
              <NavItem icon={TreePine} label="Environment" active={bizActiveTab === 'environment'} onClick={() => setBizActiveTab('environment')} />
              <NavItem icon={SlidersHorizontal} label="Filters" active={bizActiveTab === 'filters'} onClick={() => setBizActiveTab('filters')} />
            </div>

            {/* Map View Panel */}
            {bizActiveTab === 'mapview' && demographics && (
              <div className="px-3 py-3 space-y-2 border-t border-slate-800/60 mt-2">
                <div className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider">Area Summary</div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-slate-800/50 rounded-lg p-2 text-center">
                    <div className="text-lg font-black text-orange-400">{demographics.population.toLocaleString()}</div>
                    <div className="text-[9px] text-slate-500">Populasi</div>
                  </div>
                  <div className="bg-slate-800/50 rounded-lg p-2 text-center">
                    <div className="text-lg font-black text-cyan-400">{demographics.density.toLocaleString()}</div>
                    <div className="text-[9px] text-slate-500">Jiwa/kmÂ²</div>
                  </div>
                  <div className="bg-slate-800/50 rounded-lg p-2 text-center">
                    <div className="text-sm font-bold text-emerald-400">{demographics.avgIncome}</div>
                    <div className="text-[9px] text-slate-500">Avg Income</div>
                  </div>
                  <div className="bg-slate-800/50 rounded-lg p-2 text-center">
                    <div className="text-sm font-bold text-amber-400">{demographics.employmentRate}%</div>
                    <div className="text-[9px] text-slate-500">Employment</div>
                  </div>
                </div>
              </div>
            )}

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
                      <div className={`text-sm font-bold ${demographics.incomeLevel === 'high' ? 'text-emerald-400' : demographics.incomeLevel === 'medium' ? 'text-amber-400' : 'text-red-400'}`}>
                        {demographics.incomeLevel === 'high' ? 'â–² Tinggi' : demographics.incomeLevel === 'medium' ? 'â— Sedang' : 'â–¼ Rendah'}
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
                      <div className="text-[9px] text-slate-500">PM2.5: {environment.pm25} Î¼g/mÂ³</div>
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
                      <div className="text-sm font-bold text-red-400">{environment.temperature}Â°C</div>
                      <div className="text-[9px] text-slate-500">Suhu</div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Filters Panel */}
            {bizActiveTab === 'filters' && (
              <div className="px-3 py-3 space-y-3 border-t border-slate-800/60 mt-2">
                <div className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider">Filter Data</div>
                <div>
                  <label className="text-[10px] text-slate-400 block mb-1">
                    NJOP Premium Range: <span className="text-orange-400 font-bold">{njopRange[0]}% â€“ {njopRange[1]}%</span>
                  </label>
                  <div className="flex gap-2">
                    <input type="range" min={0} max={25} value={njopRange[0]} onChange={(e) => setNjopRange([+e.target.value, njopRange[1]])}
                      className="flex-1 h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-brand-lime" />
                    <input type="range" min={0} max={25} value={njopRange[1]} onChange={(e) => setNjopRange([njopRange[0], +e.target.value])}
                      className="flex-1 h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-brand-lime" />
                  </div>
                </div>
                <div>
                  <label className="text-[10px] text-slate-400 block mb-1">Tipe Properti</label>
                  <select value={propertyType} onChange={(e) => setPropertyType(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg text-xs text-slate-200 py-1.5 px-2 appearance-none focus:outline-none focus:border-orange-500">
                    <option value="all">Semua Tipe</option>
                    <option value="ruko">Ruko</option>
                    <option value="tanah">Tanah Kosong</option>
                    <option value="rumah">Rumah</option>
                    <option value="apartemen">Apartemen</option>
                  </select>
                </div>
                <div className="text-[9px] text-slate-500 pt-1 border-t border-slate-800">
                  Filter aktif: NJOP {njopRange[0]}%â€“{njopRange[1]}% | Tipe: {propertyType === 'all' ? 'Semua' : propertyType}
                </div>
              </div>
            )}

            <SectionHeader label="Activate Datasets" />
            <div className="px-3 space-y-1">
              <Toggle active={showEconomicPOI} onToggle={() => setShowEconomicPOI(!showEconomicPOI)} label="Economic POIs" />
              <Toggle active={showNJOPZone} onToggle={() => { setShowNJOPZone(!showNJOPZone); if (!showNJOPZone) onChangeChoroplethMode('njop_premium'); }} label="Land Value Zone (NJOP)" />
              <Toggle active={showPropertiGo} onToggle={() => setShowPropertiGo(!showPropertiGo)} label="Properti Go Listings" />
              <Toggle active={showSurveyPoints} onToggle={onToggleSurveyPoints} label="Survei #PakSibukGa" />
            </div>

            <BasemapGrid basemapStyle={basemapStyle} onChangeBasemapStyle={onChangeBasemapStyle} />
          </>
        )}

        {/* â•â•â•â•â•â• Commuter Sidebar â•â•â•â•â•â• */}
        {activePersona === 'commuter' && (
          <>
            <SectionHeader label="Navigation" />
            <div className="px-2 space-y-0.5">
              <NavItem icon={TrainIcon} label="Train Schedules" active={commuterActiveTab === 'train'} onClick={() => setCommuterActiveTab('train')} badge={`${trainSchedules.length}`} />
              <NavItem icon={Bus} label="Feeder Suroboyo Bus" active={commuterActiveTab === 'bus'} onClick={() => setCommuterActiveTab('bus')} badge={`${busRoutes.length}`} />
              <NavItem icon={MapPin} label="Tourist Destinations" active={commuterActiveTab === 'tourist'} onClick={() => setCommuterActiveTab('tourist')} badge={`${touristSpots.length}`} />
            </div>

            {/* Train Schedules */}
            {commuterActiveTab === 'train' && (
              <div className="px-3 py-3 space-y-2 border-t border-slate-800/60 mt-2">
                <div className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider">Jadwal KRL SRRL</div>
                <div className="space-y-1.5 max-h-[320px] overflow-y-auto pr-1">
                  {trainSchedules.map((t) => (
                    <div key={t.id} className="bg-slate-800/50 rounded-lg p-2.5 border border-slate-700/50 hover:border-orange-500/30 transition-colors">
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-1.5">
                          <TrainIcon className="w-3.5 h-3.5 text-orange-400" />
                          <span className="text-[11px] font-bold text-slate-200">{t.trainNumber}</span>
                        </div>
                        <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                          t.status === 'on_time' ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/25' :
                          t.status === 'delayed' ? 'bg-amber-500/15 text-amber-400 border border-amber-500/25' :
                          'bg-slate-700 text-slate-400 border border-slate-600'
                        }`}>
                          {t.status === 'on_time' ? 'â— On Time' : t.status === 'delayed' ? 'âš  Delayed' : 'âœ“ Departed'}
                        </span>
                      </div>
                      <div className="text-[10px] text-slate-400 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span className="tabular-nums text-slate-200">{t.departureTime}</span>
                        <span className="text-slate-600">â†’</span>
                        <span className="tabular-nums text-slate-200">{t.arrivalTime}</span>
                      </div>
                      <div className="text-[10px] text-slate-500 mt-0.5">
                        {t.origin} â†’ {t.destination}
                      </div>
                      <div className="text-[9px] text-slate-600 mt-0.5">
                        Platform {t.platform} Â· {t.type}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Feeder Suroboyo Bus */}
            {commuterActiveTab === 'bus' && (
              <div className="px-3 py-3 space-y-2 border-t border-slate-800/60 mt-2">
                <div className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider">Rute Feeder Bus</div>
                {busRoutes.length === 0 ? (
                  <div className="text-[11px] text-slate-500 text-center py-4 border border-dashed border-slate-700 rounded-lg">
                    Belum ada rute feeder yang melayani stasiun ini.
                  </div>
                ) : (
                  <div className="space-y-2 max-h-[320px] overflow-y-auto pr-1">
                    {busRoutes.map((r) => (
                      <div key={r.id} className="bg-slate-800/50 rounded-lg p-2.5 border border-slate-700/50 hover:border-orange-500/30 transition-colors">
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
                        {/* Mini route map */}
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
                )}
              </div>
            )}

            {/* Tourist Destinations */}
            {commuterActiveTab === 'tourist' && (
              <div className="px-3 py-3 space-y-2 border-t border-slate-800/60 mt-2">
                <div className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider">Destinasi Terdekat</div>
                <div className="space-y-1.5 max-h-[320px] overflow-y-auto pr-1">
                  {touristSpots.map((d) => (
                    <div key={d.id} className="bg-slate-800/50 rounded-lg p-2.5 border border-slate-700/50 hover:border-orange-500/30 transition-colors cursor-pointer group">
                      <div className="flex items-start gap-2.5">
                        <span className="text-xl">{d.imageEmoji}</span>
                        <div className="flex-1 min-w-0">
                          <div className="text-[11px] font-bold text-slate-200 group-hover:text-orange-400 transition-colors">{d.name}</div>
                          <div className="text-[10px] text-slate-500 leading-relaxed">{d.description}</div>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-[9px] text-amber-400 font-bold flex items-center gap-0.5">
                              <Star className="w-2.5 h-2.5 fill-amber-400" /> {d.rating}
                            </span>
                            <span className="text-[9px] text-slate-500">Â·</span>
                            <span className="text-[9px] text-slate-400">{d.distanceFromStation}</span>
                            <span className="text-[9px] text-slate-500">Â·</span>
                            <span className="text-[9px] text-slate-400">ðŸš¶ {d.walkTime}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <BasemapGrid basemapStyle={basemapStyle} onChangeBasemapStyle={onChangeBasemapStyle} />
          </>
        )}
      </div>

      {/* â”€â”€ Bottom Actions â”€â”€ */}
      <div className="border-t border-slate-800/80 px-2 py-2 space-y-0.5">
        <NavItem icon={Settings} label="Settings" onClick={onOpenSettings} />
        <NavItem icon={HelpCircle} label="Help" onClick={onOpenHelp} />
        <NavItem icon={MessageSquare} label="Feedback" onClick={onOpenFeedback} />
      </div>
    </aside>
  );
};

