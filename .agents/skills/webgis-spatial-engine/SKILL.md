---
name: webgis-spatial-engine
description: Comprehensive spatial data engineering guide for TransitERA, covering Uber H3 Hexagonal Grid indexing (resolutions 8-9), OSMnx network walkability buffers, 5D TOD AHP matrix scoring, and Spatial Durbin Model (SDM) regression via PySAL.
---

# WebGIS Spatial Engine Guide (TransitERA)

Panduan teknis pengolahan data geospasial, standarisasi indeks heksagon H3, pembobotan AHP 5D TOD, dan ekonometrika spasial (*Spatial Durbin Model*) untuk proyek **TransitERA**.

---

## 1. Pipeline Agregasi H3 Hexagonal Grid

Menggantikan metode radius lingkaran konvensional untuk menghindari *Modifiable Areal Unit Problem* (MAUP) dan menghasilkan partisi spasial yang seragam.

### Spesifikasi Resolusi H3:
* **Resolusi 8**: Luas area $\approx 0{,}737\text{ km}^2$, panjang sisi $\approx 461\text{ m}$. Digunakan untuk analisis makro tingkat kawasan koridor stasiun.
* **Resolusi 9**: Luas area $\approx 0{,}105\text{ km}^2$, panjang sisi $\approx 174\text{ m}$. Digunakan untuk analisis mikro *catchment area* pejalan kaki dan estimasi harga properti lokal.

### Implementasi Python (`h3-py` & `geopandas`):
```python
import h3
import geopandas as gpd
from shapely.geometry import Polygon

def geojson_to_h3_grid(gdf_polygon: gpd.GeoDataFrame, resolution: int = 9) -> gpd.GeoDataFrame:
    """Mengonversi GeoDataFrame poligon menjadi kumpulan sel H3 Hexagon terindeks."""
    hexagons = []
    for _, row in gdf_polygon.iterrows():
        geom = row.geometry
        # Ekstrak koordinat boundary poligon
        geojson_geom = geom.__geo_interface__
        h3_indexes = h3.polyfill(geojson_geom, resolution, geo_json_conformant=True)
        
        for h3_id in h3_indexes:
            boundary = h3.h3_to_geo_boundary(h3_id, geo_json=True)
            poly = Polygon(boundary)
            hexagons.append({
                "h3_index": h3_id,
                "resolution": resolution,
                "geometry": poly
            })
            
    gdf_h3 = gpd.GeoDataFrame(hexagons, crs="EPSG:4326")
    return gdf_h3.drop_duplicates(subset=["h3_index"])
```

---

## 2. Network Buffer Walkability (OSMnx)

Analisis jangkauan berjalan kaki aktual mengikuti jaringan jalan pedestrian (bukan jarak Euclidean garis lurus):

```python
import osmnx as ox
import networkx as nx
import geopandas as gpd
from shapely.geometry import Point

def generate_network_buffers(station_coords: tuple, distances: list = [400, 800, 1000]) -> dict:
    """Menghasilkan poligon isochrone walkability berbasis network jalan kaki."""
    # Download pedestrian graph di sekitar stasiun
    G = ox.graph_from_point(station_coords, dist=1500, network_type='walk')
    center_node = ox.distance.nearest_nodes(G, station_coords[1], station_coords[0])
    
    buffers = {}
    for dist in distances:
        subgraph = nx.ego_graph(G, center_node, radius=dist, distance='length')
        node_points = [Point((data['x'], data['y'])) for _, data in subgraph.nodes(data=True)]
        gdf_nodes = gpd.GeoDataFrame(geometry=node_points, crs="EPSG:4326")
        
        # Proyeksikan ke UTM (EPSG:32749 - WGS 84 / UTM zone 49S) untuk buffering akurat
        gdf_utm = gdf_nodes.to_crs(epsg=32749)
        poly_utm = gdf_utm.geometry.unary_union.convex_hull.buffer(25)
        poly_wgs = gpd.GeoSeries([poly_utm], crs="EPSG:32749").to_crs(epsg=4326).iloc[0]
        
        buffers[f"zone_{dist}m"] = poly_wgs
        
    return buffers
```

---

## 3. Kerangka 5D TOD & Skoring AHP (Analytic Hierarchy Process)

### Variabel 5 Dimensi TOD:
1. **Density ($D_1$)**: Kepadatan penduduk (SES MAPID Catalog) dan intensitas bangunan.
2. **Diversity ($D_2$)**: Percampuran guna lahan (*Land Use Mix / Shannon Entropy*) dan skala harga usaha (Menu Go).
3. **Design ($D_3$)**: Kualitas jalur pedestrian, ketersediaan *tactile paving*, zebra cross, dan peneduh (Activity Data).
4. **Destination Accessibility ($D_4$)**: Jangkauan ke POI esensial (pendidikan, perdagangan, perkantoran) dalam 15 menit.
5. **Distance to Transit ($D_5$)**: Jarak jaringan ke stasiun SRRL dan halte feeder terdekat.

### Validasi Konsistensi AHP ($CR \le 0{,}10$):
$$\text{Consistency Index (CI)} = \frac{\lambda_{\max} - n}{n - 1}, \quad \text{Consistency Ratio (CR)} = \frac{\text{CI}}{\text{RI}}$$
Untuk matriks berukuran $n = 5$, Nilai Random Index ($\text{RI}$) adalah $1{,}12$. Nilai $\text{CR}$ wajib $\le 0{,}10$.

```python
import numpy as np

def calculate_ahp_weights(pairwise_matrix: np.ndarray) -> tuple[np.ndarray, float]:
    """Menghitung bobot prioritas AHP dan Consistency Ratio (CR)."""
    n = pairwise_matrix.shape[0]
    # Normalisasi kolom
    col_sum = pairwise_matrix.sum(axis=0)
    norm_matrix = pairwise_matrix / col_sum
    # Vektor bobot prioritas
    weights = norm_matrix.mean(axis=1)
    
    # Hitung lambda max & CR
    lambda_max = np.sum(col_sum * weights)
    ci = (lambda_max - n) / (n - 1)
    ri_dict = {3: 0.58, 4: 0.90, 5: 1.12, 6: 1.24}
    cr = ci / ri_dict.get(n, 1.12)
    
    return weights, cr
```

---

## 4. Ekonometrika Spasial: Spatial Durbin Model (SDM)

Mengestimasi hubungan antara *TOD Readiness Score* ($X$) dengan Nilai Lahan/NJOP ($Y$) serta memperhitungkan *spatial spillover* dari kawasan tetangga:

$$Y = \rho W Y + \alpha + X \beta + W X \theta + \varepsilon$$

* $Y$: $\ln(\text{NJOP per m}^2)$
* $W$: Matriks bobot spasial k-nearest neighbors ($k=6$) atau Queen contiguity.
* $\rho$: Koefisien autoregresif spasial variabel terikat.
* $\beta$: Dampak langsung (*direct effect*) skor TOD lokal terhadap nilai tanah.
* $\theta$: Dampak limpahan (*spatial spillover*) skor TOD sel tetangga terhadap nilai tanah lokal.

### Implementasi PySAL (`spreg`):
```python
from pysal.lib import weights
from spreg import GM_Lag, ML_Lag, Spatial_Durbin

def fit_spatial_durbin_model(gdf: gpd.GeoDataFrame, y_col: str, x_cols: list):
    """Menjalankan regresi Spatial Durbin Model untuk estimasi %ΔNJOP."""
    w = weights.Queen.from_dataframe(gdf)
    w.transform = 'R'
    
    y = np.log(gdf[y_col].values.reshape(-1, 1))
    x = gdf[x_cols].values
    
    sdm_model = Spatial_Durbin(y, x, w=w, name_y=y_col, name_x=x_cols)
    return sdm_model
```

---

## 5. Skema PostgreSQL + PostGIS Terstandarisasi

```sql
-- Tabel Grid H3 & Hasil Analisis Spasial
CREATE TABLE h3_tod_analytics (
    h3_index VARCHAR(15) PRIMARY KEY,
    resolution INT NOT NULL,
    station_cluster VARCHAR(50),
    density_score NUMERIC(5,2),
    diversity_score NUMERIC(5,2),
    design_score NUMERIC(5,2),
    destination_score NUMERIC(5,2),
    distance_score NUMERIC(5,2),
    tod_readiness_score NUMERIC(5,2),
    typology VARCHAR(50),
    njop_m2 NUMERIC(12,2),
    predicted_njop_premium_pct NUMERIC(5,2),
    ci_lower_pct NUMERIC(5,2),
    ci_upper_pct NUMERIC(5,2),
    geom GEOMETRY(Polygon, 4326)
);

CREATE INDEX idx_h3_geom ON h3_tod_analytics USING GIST(geom);
CREATE INDEX idx_h3_station ON h3_tod_analytics(station_cluster);
```
