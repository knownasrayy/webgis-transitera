-- TransitERA PostGIS Database Schema
CREATE EXTENSION IF NOT EXISTS postgis;

-- 1. Tabel Analisis H3 TOD & Dampak Nilai Lahan
CREATE TABLE IF NOT EXISTS h3_tod_analytics (
    h3_index VARCHAR(15) PRIMARY KEY,
    resolution INT NOT NULL DEFAULT 9,
    station_cluster VARCHAR(50) NOT NULL,
    density_score NUMERIC(5,2) NOT NULL,
    diversity_score NUMERIC(5,2) NOT NULL,
    design_score NUMERIC(5,2) NOT NULL,
    destination_score NUMERIC(5,2) NOT NULL,
    distance_score NUMERIC(5,2) NOT NULL,
    tod_readiness_score NUMERIC(5,2) NOT NULL,
    typology VARCHAR(50) NOT NULL,
    njop_m2 NUMERIC(12,2),
    predicted_njop_premium_pct NUMERIC(5,2),
    ci_lower_pct NUMERIC(5,2),
    ci_upper_pct NUMERIC(5,2),
    geom GEOMETRY(Polygon, 4326) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_h3_geom ON h3_tod_analytics USING GIST(geom);
CREATE INDEX IF NOT EXISTS idx_h3_station ON h3_tod_analytics(station_cluster);
CREATE INDEX IF NOT EXISTS idx_h3_score ON h3_tod_analytics(tod_readiness_score);

-- 2. Tabel Titik Simpul Stasiun SRRL
CREATE TABLE IF NOT EXISTS stations (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    latitude NUMERIC(9,6) NOT NULL,
    longitude NUMERIC(9,6) NOT NULL,
    tod_readiness_score NUMERIC(5,2) NOT NULL,
    density_score NUMERIC(5,2) NOT NULL,
    diversity_score NUMERIC(5,2) NOT NULL,
    design_score NUMERIC(5,2) NOT NULL,
    destination_score NUMERIC(5,2) NOT NULL,
    distance_score NUMERIC(5,2) NOT NULL,
    typology VARCHAR(50) NOT NULL,
    weakest_dimension VARCHAR(50) NOT NULL,
    strongest_dimension VARCHAR(50) NOT NULL,
    geom GEOMETRY(Point, 4326) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_stations_geom ON stations USING GIST(geom);

-- 3. Tabel Data Survei Lapangan (Activity & Mission)
CREATE TABLE IF NOT EXISTS survey_points (
    id VARCHAR(50) PRIMARY KEY,
    category VARCHAR(50) NOT NULL,
    survey_type VARCHAR(20) NOT NULL, -- 'activity' / 'mission'
    mission_subtype VARCHAR(30),      -- 'properti_go', 'struk_go', 'menu_go'
    name VARCHAR(255) NOT NULL,
    description TEXT,
    photo_url TEXT,
    condition VARCHAR(100),
    spending_amount NUMERIC(12,2),
    menu_price_range VARCHAR(50),
    property_price NUMERIC(15,2),
    transaction_type VARCHAR(20),     -- 'jual' / 'sewa'
    h3_index VARCHAR(15) REFERENCES h3_tod_analytics(h3_index),
    surveyed_at TIMESTAMP WITH TIME ZONE,
    geom GEOMETRY(Point, 4326) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_survey_geom ON survey_points USING GIST(geom);
CREATE INDEX IF NOT EXISTS idx_survey_type ON survey_points(survey_type, mission_subtype);
