-- disable the pg_graphql extension
DROP EXTENSION IF EXISTS pg_graphql;

-- create a dedicated separate schema for location data
create schema if not exists "gis";

-- enable the "postgis" extension
create extension postgis with schema "gis";

-- grant usage on the "gis" schema to the "anon" and "authenticated" roles
grant usage on schema gis to anon, authenticated;

-- add the trgm extension
create extension if not exists pg_trgm with schema "public";
