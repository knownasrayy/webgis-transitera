// MAPID API Key from environment variable
const MAPID_KEY = process.env.NEXT_PUBLIC_MAPID_API_KEY || '';

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

