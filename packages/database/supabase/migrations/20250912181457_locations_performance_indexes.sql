-- Performance optimization indexes for locations queries
-- Addresses performance issues with 100k+ location datasets

-- =======================
-- GEOGRAPHIC QUERY INDEXES
-- =======================

-- High-performance lat/lon indexes for simple bounds filtering
-- Used when bounding box is very large (>10 degrees)
CREATE INDEX CONCURRENTLY IF NOT EXISTS locations_lat_idx ON locations (lat);
CREATE INDEX CONCURRENTLY IF NOT EXISTS locations_lon_idx ON locations (lon);

-- Composite index for lat/lon range queries (most efficient for large area searches)
CREATE INDEX CONCURRENTLY IF NOT EXISTS locations_lat_lon_idx ON locations (lat, lon);

-- =======================
-- TEXT SEARCH INDEXES
-- =======================

-- Prefix search indexes - critical for fast autocomplete and exact matches
-- Uses text_pattern_ops for LIKE 'prefix%' queries
CREATE INDEX CONCURRENTLY IF NOT EXISTS locations_name_prefix_idx ON locations (LOWER(name) text_pattern_ops);
CREATE INDEX CONCURRENTLY IF NOT EXISTS locations_city_prefix_idx ON locations (LOWER(city) text_pattern_ops);
CREATE INDEX CONCURRENTLY IF NOT EXISTS locations_state_prefix_idx ON locations (LOWER(state) text_pattern_ops);

-- Additional trigram indexes for fuzzy search (complement existing name index)
CREATE INDEX CONCURRENTLY IF NOT EXISTS locations_city_trgm_idx ON locations USING GIN(city gin_trgm_ops);
CREATE INDEX CONCURRENTLY IF NOT EXISTS locations_state_trgm_idx ON locations USING GIN(state gin_trgm_ops);

-- =======================
-- PAGINATION INDEXES
-- =======================

-- Critical for cursor-based pagination performance
-- Matches the ordering used in LocationsService (created_at DESC, id ASC)
CREATE INDEX CONCURRENTLY IF NOT EXISTS locations_created_at_id_idx ON locations (created_at DESC, id ASC);

-- Index for search result ordering (search_rank DESC, created_at DESC, id ASC)
-- Note: search_rank is computed dynamically, but this helps with the secondary sort
CREATE INDEX CONCURRENTLY IF NOT EXISTS locations_created_at_desc_id_asc_idx ON locations (created_at DESC, id ASC);

-- =======================
-- COMPOSITE FILTER INDEXES
-- =======================

-- Combined geographic + pagination index for filtered queries
CREATE INDEX CONCURRENTLY IF NOT EXISTS locations_lat_lon_created_idx ON locations (lat, lon, created_at DESC);

-- Sport tags + geographic index for filtered location searches
CREATE INDEX CONCURRENTLY IF NOT EXISTS locations_sport_geo_idx ON locations USING GIN(sport_tags) INCLUDE (lat, lon, created_at);

-- Sport tags + text fields for combined filtering
CREATE INDEX CONCURRENTLY IF NOT EXISTS locations_sport_city_idx ON locations USING GIN(sport_tags) INCLUDE (city, created_at);

-- =======================
-- FACILITY PERFORMANCE INDEXES
-- =======================

-- Optimize facilities queries by location
CREATE INDEX CONCURRENTLY IF NOT EXISTS location_facilities_location_sport_idx ON location_facilities (location_id, sport);

-- Geographic index for facility-level searches
CREATE INDEX CONCURRENTLY IF NOT EXISTS location_facilities_lat_lon_idx ON location_facilities (lat, lon);

-- =======================
-- QUERY PERFORMANCE COMMENTS
-- =======================

COMMENT ON INDEX locations_lat_lon_idx IS
'Critical for large bounding box queries. Used when area > 10° in any dimension to avoid expensive PostGIS operations.';

COMMENT ON INDEX locations_name_prefix_idx IS
'Enables fast prefix matching for autocomplete. Used in simplified search ranking for exact and prefix matches.';

COMMENT ON INDEX locations_created_at_id_idx IS
'Primary pagination index. Matches LocationsService ordering pattern for consistent cursor-based pagination.';

COMMENT ON INDEX locations_sport_geo_idx IS
'Composite index for sport-filtered geographic queries. Includes lat/lon to avoid index lookup.';

-- =======================
-- STATISTICS UPDATE
-- =======================

-- Force statistics update for the query planner
ANALYZE locations;
ANALYZE location_facilities;
