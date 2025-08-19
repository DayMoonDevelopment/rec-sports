create table locations (
    id text primary key default nanoid('loc'),
    name text not null,
    street text null,
    city text null,
    county text null,
    state text null,
    country text null,
    postal_code text null,
    location gis.geography(POINT) not null,
    sport_tags text array,
    created_at timestamp with time zone default now(),
    updated_at timestamp with time zone default now()
);

-- Enable Row Level Security
alter table locations enable row level security;

-- Allow read access to everyone (authenticated and anonymous users)
create policy "locations_select_policy" on locations for select using (true);

-- geo index for locations
create index locations_geo_index
  on public.locations
  using GIST (location);
