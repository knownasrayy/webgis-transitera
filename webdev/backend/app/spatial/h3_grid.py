import math
from typing import List, Dict, Any

# Geometric helper to generate hexagon polygon coordinates around a center point
def generate_hexagon_coords(center_lon: float, center_lat: float, radius_km: float = 0.25) -> List[List[float]]:
    """
    Menghasilkan koordinat poligon heksagon 6 sisi dalam format GeoJSON.
    """
    coords = []
    # 1 deg lat ~= 111 km, 1 deg lon ~= 111 * cos(lat) km
    lat_deg_per_km = 1.0 / 111.0
    lon_deg_per_km = 1.0 / (111.0 * math.cos(math.radians(center_lat)))
    
    for i in range(6):
        angle_rad = math.radians(60 * i - 30)
        d_lat = radius_km * math.sin(angle_rad) * lat_deg_per_km
        d_lon = radius_km * math.cos(angle_rad) * lon_deg_per_km
        coords.append([round(center_lon + d_lon, 6), round(center_lat + d_lat, 6)])
    
    # Close polygon
    coords.append(coords[0])
    return coords

def generate_station_h3_cluster(
    station_id: str,
    station_name: str,
    center_lon: float,
    center_lat: float,
    base_tod_score: float,
    base_njop_premium: float,
    typology: str,
    ring_count: int = 3
) -> List[Dict[str, Any]]:
    """
    Menghasilkan kumpulan sel H3 (resolusi 9) di sekitar stasiun transit dengan atribut 5D TOD.
    """
    cells = []
    hex_radius_km = 0.18 # ~180 meter side length for resolution 9
    
    # Generate center cell + concentric rings of hexagons
    h3_id_counter = 1
    
    # Ring 0: Center
    ring_points = [(0.0, 0.0, 0)]
    
    # Ring 1 & 2
    for r in range(1, ring_count + 1):
        for side in range(6):
            for step in range(r):
                angle1 = math.radians(60 * side)
                angle2 = math.radians(60 * ((side + 2) % 6))
                
                # Linear combination of vectors
                dx = (r - step) * math.cos(angle1) + step * math.cos(angle2)
                dy = (r - step) * math.sin(angle1) + step * math.sin(angle2)
                
                # Scale by sqrt(3) spacing
                spacing = hex_radius_km * math.sqrt(3)
                ring_points.append((dx * spacing, dy * spacing, r))
    
    for idx, (dx_km, dy_km, ring_dist) in enumerate(ring_points):
        lat_offset = dy_km / 111.0
        lon_offset = dx_km / (111.0 * math.cos(math.radians(center_lat)))
        
        cell_lon = round(center_lon + lon_offset, 6)
        cell_lat = round(center_lat + lat_offset, 6)
        
        # Distance decay factor (closer to transit = higher score)
        decay = max(0.65, 1.0 - (ring_dist * 0.08))
        cell_tod = round(base_tod_score * decay * (1.0 + (idx % 5 - 2) * 0.02), 1)
        cell_tod = max(40.0, min(99.0, cell_tod))
        
        cell_njop_premium = round(base_njop_premium * decay * (1.0 + (idx % 3 - 1) * 0.03), 1)
        
        h3_index = f"8965e{station_id[:3]}{idx:03d}ffff"
        
        # Approximate 5D dimension sub-scores
        density = round(min(100.0, cell_tod * 1.05 - ring_dist * 3), 1)
        diversity = round(min(100.0, cell_tod * 0.98 + (idx % 4) * 2), 1)
        design = round(min(100.0, cell_tod * 0.85 - ring_dist * 5), 1)
        destination = round(min(100.0, cell_tod * 1.02 - ring_dist * 4), 1)
        distance = round(min(100.0, 100.0 - ring_dist * 12.5), 1)
        
        polygon_coords = generate_hexagon_coords(cell_lon, cell_lat, radius_km=hex_radius_km * 0.95)
        
        feature = {
            "type": "Feature",
            "id": h3_index,
            "properties": {
                "h3_index": h3_index,
                "station_cluster": station_id,
                "station_name": station_name,
                "ring_distance": ring_dist,
                "tod_readiness_score": cell_tod,
                "density_score": density,
                "diversity_score": diversity,
                "design_score": design,
                "destination_score": destination,
                "distance_score": distance,
                "typology": typology,
                "predicted_njop_premium_pct": cell_njop_premium,
                "ci_lower_pct": round(cell_njop_premium * 0.75, 1),
                "ci_upper_pct": round(cell_njop_premium * 1.25, 1),
                "njop_m2": int(8500000 * (1 + cell_njop_premium / 100))
            },
            "geometry": {
                "type": "Polygon",
                "coordinates": [polygon_coords]
            }
        }
        cells.append(feature)
        
    return cells
