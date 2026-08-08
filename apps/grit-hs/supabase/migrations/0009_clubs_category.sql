-- Clubs constellation visualization needs real category anchor nodes
-- (Red/Blue/Green/Yellow "lines" per the transit-map metaphor) — this adds
-- the field the UI groups by, rather than inferring a category client-side.

create type club_category as enum ('stem', 'arts', 'athletics', 'service', 'other');

alter table clubs
  add column category club_category not null default 'other';
