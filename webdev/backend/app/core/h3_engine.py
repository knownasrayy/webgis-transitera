import h3
import json

def generate_h3_grid_around_point(lat: float, lng: float, radius_km: float = 2.0, resolution: int = 9) -> list[str]:
    """
    Generates a list of H3 hexagon indices around a central point within a given radius.
    """
    # Find the H3 index for the central point
    center_h3 = h3.latlng_to_cell(lat, lng, resolution)
    
    # Calculate k-ring size based on radius. 
    # Average edge length for res 9 is ~0.174 km.
    # Radius of incircle is ~0.150 km. 
    # To cover 2km, we need k roughly around 2.0 / 0.150 = 13.
    k_ring_size = max(1, int(radius_km / 0.15))
    
    # Get all hexagons within k-ring
    hexagons = h3.grid_disk(center_h3, k_ring_size)
    
    return list(hexagons)

def h3_to_geojson_feature(h3_index: str, properties: dict = None) -> dict:
    """
    Converts a single H3 index into a GeoJSON Polygon feature.
    """
    if properties is None:
        properties = {}
        
    # Get hexagon boundaries
    # h3.cell_to_boundary returns ((lat, lng), ...)
    boundary = h3.cell_to_boundary(h3_index)
    
    # Convert to GeoJSON format: [[lng, lat], ...]
    # GeoJSON expects the first and last point to be the same to close the polygon
    coordinates = [[lng, lat] for lat, lng in boundary]
    coordinates.append(coordinates[0])
    
    return {
        "type": "Feature",
        "id": h3_index,
        "properties": {
            "h3_index": h3_index,
            **properties
        },
        "geometry": {
            "type": "Polygon",
            "coordinates": [coordinates]
        }
    }

def create_h3_feature_collection(h3_indices: list[str], properties_map: dict = None) -> dict:
    """
    Creates a GeoJSON FeatureCollection from a list of H3 indices.
    properties_map: dict mapping h3_index -> dict of properties
    """
    if properties_map is None:
        properties_map = {}
        
    features = [
        h3_to_geojson_feature(h3_idx, properties_map.get(h3_idx, {}))
        for h3_idx in h3_indices
    ]
    
    return {
        "type": "FeatureCollection",
        "features": features
    }
