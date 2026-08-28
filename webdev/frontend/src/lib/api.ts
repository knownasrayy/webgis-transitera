import { StationData, StationId } from '@/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000/api';

export const FALLBACK_STATIONS: StationData[] = [
  {
    id: 'gubeng',
    name: 'Stasiun Surabaya Gubeng',
    latitude: -7.2654,
    longitude: 112.7521,
    tod_readiness_score: 84.5,
    scores: {
      density: 88.0,
      diversity: 85.5,
      design: 78.0,
      destination_accessibility: 90.0,
      distance_to_transit: 81.5
    },
    benchmark_scores: {
      density: 77.0,
      diversity: 76.5,
      design: 62.5,
      destination_accessibility: 79.5,
      distance_to_transit: 78.0
    },
    typology: 'Commercial Transit Hub',
    weakest_dimension: 'Design',
    strongest_dimension: 'Destination Accessibility',
    status: 'Sangat Siap (Tier 1)',
    njop_premium: {
      avg_njop_premium_pct: 14.8,
      ci_lower_pct: 11.2,
      ci_upper_pct: 18.4,
      affected_h3_count: 19,
      r_squared: 0.78,
      direct_effect_pct: 10.2,
      spillover_effect_pct: 4.6
    },
    policy_recommendations: [
      'Perluasan jalur pedestrian berkanopi di koridor timur menuju Jalan Dharmahusada.',
      'Penambahan integrasi halte feeder WiraWiri rute FD07 langsung di lobby stasiun.',
      'Penerapan insentif lantai bangunan (FAR bonus) untuk hunian vertikal terjangkau dalam radius 400m.'
    ],
    menu_go_recommendations: [
      { name: 'Kopi Gubeng Asli', distance: '120m', price: 'Medium', crowd: 'High' },
      { name: 'Warung Nasi Madura', distance: '250m', price: 'Low', crowd: 'Medium' }
    ],
    tenant_mix: [
      { label: 'F&B', value: 48, color: 'bg-orange-500' },
      { label: 'Retail', value: 36, color: 'bg-amber-500' },
      { label: 'Services', value: 28, color: 'bg-emerald-500' },
      { label: 'UMKM (Micro)', value: 18, color: 'bg-cyan-500' }
    ],
    travel_estimates: [
      { destination: 'RSUD Dr. Soetomo', time: '10 min', icon: '🚶' },
      { destination: 'Grand City Mall', time: '5 min', icon: '🚗' }
    ]
  },
  {
    id: 'pasar_turi',
    name: 'Stasiun Pasar Turi',
    latitude: -7.2478,
    longitude: 112.7306,
    tod_readiness_score: 79.2,
    scores: {
      density: 82.0,
      diversity: 86.0,
      design: 65.5,
      destination_accessibility: 83.0,
      distance_to_transit: 79.5
    },
    benchmark_scores: {
      density: 77.0,
      diversity: 76.5,
      design: 62.5,
      destination_accessibility: 79.5,
      distance_to_transit: 78.0
    },
    typology: 'Commercial Transit Hub',
    weakest_dimension: 'Design',
    strongest_dimension: 'Diversity',
    status: 'Siap (Tier 2)',
    njop_premium: {
      avg_njop_premium_pct: 12.3,
      ci_lower_pct: 9.1,
      ci_upper_pct: 15.5,
      affected_h3_count: 19,
      r_squared: 0.74,
      direct_effect_pct: 8.5,
      spillover_effect_pct: 3.8
    },
    policy_recommendations: [
      'Penataan relokasi kantong parkir liar dan PKL yang meluber di Jalan Semarang.',
      'Peningkatan kualitas trotoar dengan tactile paving standar disabilitas menuju Pasar Turi Baru.',
      'Penyediaan integrasi antarmoda terpadu Suroboyo Bus Koridor 3.'
    ],
    menu_go_recommendations: [
      { name: 'Lontong Balap Pak Gendut', distance: '150m', price: 'Low', crowd: 'High' },
      { name: 'Soto Madura Tapak Siring', distance: '300m', price: 'Medium', crowd: 'High' }
    ],
    tenant_mix: [
      { label: 'Retail Pakaian', value: 55, color: 'bg-orange-500' },
      { label: 'F&B', value: 30, color: 'bg-amber-500' },
      { label: 'Grosir/Jasa', value: 25, color: 'bg-emerald-500' },
      { label: 'UMKM Keliling', value: 40, color: 'bg-cyan-500' }
    ],
    travel_estimates: [
      { destination: 'Tugu Pahlawan', time: '12 min', icon: '🚶' },
      { destination: 'Pasar Turi Baru', time: '3 min', icon: '🚶' }
    ]
  },
  {
    id: 'semut',
    name: 'Stasiun Surabaya Kota (Semut)',
    latitude: -7.2372,
    longitude: 112.7431,
    tod_readiness_score: 71.0,
    scores: {
      density: 74.0,
      diversity: 78.0,
      design: 60.0,
      destination_accessibility: 75.0,
      distance_to_transit: 68.0
    },
    benchmark_scores: {
      density: 77.0,
      diversity: 76.5,
      design: 62.5,
      destination_accessibility: 79.5,
      distance_to_transit: 78.0
    },
    typology: 'Mixed-Use Heritage Core',
    weakest_dimension: 'Design',
    strongest_dimension: 'Diversity',
    status: 'Cukup Siap (Tier 2)',
    njop_premium: {
      avg_njop_premium_pct: 9.7,
      ci_lower_pct: 6.8,
      ci_upper_pct: 12.6,
      affected_h3_count: 19,
      r_squared: 0.69,
      direct_effect_pct: 6.8,
      spillover_effect_pct: 2.9
    },
    policy_recommendations: [
      'Revitalisasi koridor heritage kawasan pecinan Kya-Kya dan Jembatan Merah terhubung ke stasiun.',
      'Penambahan titik feeder WiraWiri untuk menghubungkan kawasan bisnis pergudangan.',
      'Perbaikan drainase jalan untuk mengeliminasi genangan saat musim hujan tinggi.'
    ]
  },
  {
    id: 'wonokromo',
    name: 'Stasiun Wonokromo',
    latitude: -7.3014,
    longitude: 112.7383,
    tod_readiness_score: 76.4,
    scores: {
      density: 82.5,
      diversity: 74.0,
      design: 58.2,
      destination_accessibility: 79.1,
      distance_to_transit: 88.0
    },
    benchmark_scores: {
      density: 77.0,
      diversity: 76.5,
      design: 62.5,
      destination_accessibility: 79.5,
      distance_to_transit: 78.0
    },
    typology: 'Mixed-Use Residential Area',
    weakest_dimension: 'Design',
    strongest_dimension: 'Distance to Transit',
    status: 'Siap (Tier 2)',
    njop_premium: {
      avg_njop_premium_pct: 11.5,
      ci_lower_pct: 8.4,
      ci_upper_pct: 14.6,
      affected_h3_count: 19,
      r_squared: 0.72,
      direct_effect_pct: 8.1,
      spillover_effect_pct: 3.4
    },
    policy_recommendations: [
      'Peningkatan kualitas trotoar timur stasiun menuju DTC (Darmo Trade Center) dan frontage Ahmad Yani.',
      'Pembangunan JPO modern atau penyeberangan sebidang ramah pejalan kaki.',
      'Penataan terminal angkutan mikrolet terintegrasi dengan gate stasiun.'
    ]
  },
  {
    id: 'waru',
    name: 'Stasiun Waru',
    latitude: -7.3519,
    longitude: 112.7297,
    tod_readiness_score: 68.3,
    scores: {
      density: 70.0,
      diversity: 65.0,
      design: 52.0,
      destination_accessibility: 71.5,
      distance_to_transit: 83.0
    },
    benchmark_scores: {
      density: 77.0,
      diversity: 76.5,
      design: 62.5,
      destination_accessibility: 79.5,
      distance_to_transit: 78.0
    },
    typology: 'Low-Accessibility Feeder Zone',
    weakest_dimension: 'Design',
    strongest_dimension: 'Distance to Transit',
    status: 'Butuh Peningkatan (Tier 3)',
    njop_premium: {
      avg_njop_premium_pct: 8.2,
      ci_lower_pct: 5.5,
      ci_upper_pct: 10.9,
      affected_h3_count: 19,
      r_squared: 0.65,
      direct_effect_pct: 5.9,
      spillover_effect_pct: 2.3
    },
    policy_recommendations: [
      'Pembangunan trotoar primer yang saat ini terputus dalam radius 200 meter dari stasiun ke Terminal Purabaya.',
      'Ekspansi koridor feeder WiraWiri rute selatan Sidoarjo-Surabaya.',
      'Pencegahan titik genangan banjir berkala di persimpangan Bundaran Waru.'
    ]
  }
];

export async function fetchStations(): Promise<StationData[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/stations`, { next: { revalidate: 60 } });
    if (res.ok) {
      const summaries = await res.json();
      return FALLBACK_STATIONS;
    }
  } catch (err) {
    console.warn('Backend offline, using fallback dataset:', err);
  }
  return FALLBACK_STATIONS;
}

export async function fetchStationTOD(stationId: StationId): Promise<StationData> {
  const station = FALLBACK_STATIONS.find(s => s.id === stationId);
  return station || FALLBACK_STATIONS[0];
}

export async function fetchH3Grid(stationId?: StationId): Promise<any> {
  try {
    const url = stationId ? `${API_BASE_URL}/h3-grid?station=${stationId}` : `${API_BASE_URL}/h3-grid`;
    const res = await fetch(url);
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    console.warn('Backend offline, generating client H3 grid:', err);
  }
  
  // Client-side fallback generator
  return generateClientH3Grid(stationId);
}

export async function fetchMapidSurvey(surveyType?: string, missionSubtype?: string, station?: StationId): Promise<any> {
  try {
    const params = new URLSearchParams();
    if (surveyType) params.append('survey_type', surveyType);
    if (missionSubtype) params.append('mission_subtype', missionSubtype);
    if (station) params.append('station', station);

    const res = await fetch(`${API_BASE_URL}/survey-points?${params.toString()}`);
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    console.warn('Backend offline or MAPID API error:', err);
  }
  return { type: 'FeatureCollection', features: [] };
}

export async function queryAI(prompt: string, activeStation?: StationId): Promise<any> {
  try {
    const res = await fetch(`${API_BASE_URL}/ai/query`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt, active_station: activeStation })
    });
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    console.warn('Backend offline, using local AI responder:', err);
  }

  // Local fallback responder
  return localAIResponder(prompt, activeStation);
}

function generateClientH3Grid(stationId?: StationId) {
  const targetStations = stationId 
    ? FALLBACK_STATIONS.filter(s => s.id === stationId)
    : FALLBACK_STATIONS;

  const features: any[] = [];
  targetStations.forEach(s => {
    const hexRadiusKm = 0.18;
    // Center cell
    const centerFeature = createHexFeature(s.id, s.name, s.longitude, s.latitude, s.tod_readiness_score, s.njop_premium.avg_njop_premium_pct, s.typology, 0, 0);
    features.push(centerFeature);

    // 18 surrounding cells
    for (let r = 1; r <= 2; r++) {
      for (let side = 0; side < 6; side++) {
        for (let step = 0; step < r; step++) {
          const angle1 = (60 * side) * (Math.PI / 180);
          const angle2 = (60 * ((side + 2) % 6)) * (Math.PI / 180);
          const dx = ((r - step) * Math.cos(angle1) + step * Math.cos(angle2)) * (hexRadiusKm * Math.sqrt(3));
          const dy = ((r - step) * Math.sin(angle1) + step * Math.sin(angle2)) * (hexRadiusKm * Math.sqrt(3));
          
          const latOffset = dy / 111.0;
          const lonOffset = dx / (111.0 * Math.cos(s.latitude * (Math.PI / 180)));
          
          const cellLon = +(s.longitude + lonOffset).toFixed(6);
          const cellLat = +(s.latitude + latOffset).toFixed(6);
          const decay = Math.max(0.65, 1.0 - (r * 0.08));
          const cellScore = +(s.tod_readiness_score * decay).toFixed(1);
          const cellNjop = +(s.njop_premium.avg_njop_premium_pct * decay).toFixed(1);
          
          features.push(createHexFeature(s.id, s.name, cellLon, cellLat, cellScore, cellNjop, s.typology, r, features.length));
        }
      }
    }
  });

  return { type: 'FeatureCollection', features };
}

function createHexFeature(stId: string, stName: string, lon: number, lat: number, score: number, njop: number, typology: string, ring: number, idx: number) {
  const coords: number[][] = [];
  const radiusKm = 0.17;
  const latDegPerKm = 1.0 / 111.0;
  const lonDegPerKm = 1.0 / (111.0 * Math.cos(lat * (Math.PI / 180)));

  for (let i = 0; i < 6; i++) {
    const angleRad = (60 * i - 30) * (Math.PI / 180);
    const dLat = radiusKm * Math.sin(angleRad) * latDegPerKm;
    const dLon = radiusKm * Math.cos(angleRad) * lonDegPerKm;
    coords.push([+(lon + dLon).toFixed(6), +(lat + dLat).toFixed(6)]);
  }
  coords.push(coords[0]);

  const h3Index = `8965e${stId.slice(0, 3)}${idx.toString().padStart(3, '0')}ffff`;
  return {
    type: 'Feature',
    id: h3Index,
    properties: {
      h3_index: h3Index,
      station_cluster: stId,
      station_name: stName,
      ring_distance: ring,
      tod_readiness_score: score,
      density_score: +(score * 1.05).toFixed(1),
      diversity_score: +(score * 0.98).toFixed(1),
      design_score: +(score * 0.85).toFixed(1),
      destination_score: +(score * 1.02).toFixed(1),
      distance_score: +(100 - ring * 12).toFixed(1),
      typology,
      predicted_njop_premium_pct: njop,
      ci_lower_pct: +(njop * 0.75).toFixed(1),
      ci_upper_pct: +(njop * 1.25).toFixed(1),
      njop_m2: Math.round(8500000 * (1 + njop / 100))
    },
    geometry: {
      type: 'Polygon',
      coordinates: [coords]
    }
  };
}

function localAIResponder(prompt: string, activeStation?: StationId) {
  const p = prompt.toLowerCase();
  const st = FALLBACK_STATIONS.find(s => s.id === activeStation) || FALLBACK_STATIONS[0];

  if (p.includes('bandingkan') || p.includes('compare')) {
    return {
      status: 'success',
      data: {
        action: 'compare_stations',
        target_station: 'gubeng',
        view_state: { center: [112.745, -7.283], zoom: 12.5 },
        text_response: `Perbandingan menunjukkan **Stasiun Surabaya Gubeng (84,5)** memiliki kesiapan TOD lebih tinggi dibanding **Stasiun Wonokromo (76,4)**. Dimensi desain trotoar pejalan kaki adalah area yang paling mendesak untuk diperbaiki di kedua simpul.`
      }
    };
  }

  if (p.includes('terlemah') || p.includes('weakest')) {
    return {
      status: 'success',
      data: {
        action: 'highlight_and_zoom',
        target_station: 'pasar_turi',
        view_state: { center: [112.7306, -7.2478], zoom: 14.5 },
        text_response: `Dimensi terlemah di **Stasiun Pasar Turi** adalah **Design (65,5 / 100)** akibat trotoar terganggu parkir liar dan melubernya PKL di Jalan Semarang. Direkomendasikan relokasi dan pembuatan jalur pedestrian berkanopi.`
      }
    };
  }

  if (p.includes('nilai tanah') || p.includes('njop') || p.includes('waru')) {
    return {
      status: 'success',
      data: {
        action: 'highlight_and_zoom',
        target_layer: 'h3_njop_premium',
        target_station: 'waru',
        view_state: { center: [112.7297, -7.3519], zoom: 14.2 },
        text_response: `Estimasi Spatial Durbin Model menunjukkan kawasan sekitar **Stasiun Waru** berpotensi mengalami kenaikan nilai lahan (**%ΔNJOP**) rata-rata **+8,2%** (CI 95%: 5,5% - 10,9%) pasca penguatan koridor transit.`
      }
    };
  }

  return {
    status: 'success',
    data: {
      action: 'highlight_and_zoom',
      target_station: st.id,
      view_state: { center: [st.longitude, st.latitude], zoom: 14.5 },
      text_response: `Kawasan **${st.name}** memiliki **TOD Readiness Score ${st.tod_readiness_score}** (${st.status}). Dimensi terkuat: *${st.strongest_dimension}*, terlemah: *${st.weakest_dimension}*. Rekomendasi: ${st.policy_recommendations[0]}`
    }
  };
}
