// MAPID API Key
const MAPID_KEY = '6a8fc28753df37905b3a5c56';

export const BASEMAP_STYLES: Record<string, string> = {
  // Street Mapid (Default: 3D & 2D building)
  street: `https://basemap.mapid.io/styles/basic/style.json?key=${MAPID_KEY}`,

  // Street 2D Building only
  'street-2d': `https://basemap.mapid.io/styles/street-2d-building/style.json?key=${MAPID_KEY}`,

  // Dark mode
  dark: `https://basemap.mapid.io/styles/dark/style.json?key=${MAPID_KEY}`,

  // Satellite
  satellite: `https://basemap.mapid.io/styles/satellite/style.json?key=${MAPID_KEY}`,
};

export const SURABAYA_CENTER: [number, number] = [112.7521, -7.2654];
export const SURABAYA_DEFAULT_ZOOM = 13.2;

export const SURABAYA_BOUNDS: [[number, number], [number, number]] = [
  [112.55, -7.38], // Southwest coordinates
  [112.85, -7.18]  // Northeast coordinates
];

