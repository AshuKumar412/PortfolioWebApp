-- ============================================================
-- Portfolio Website — Supabase Schema
-- Run this in the Supabase SQL Editor (supabase.com/dashboard)
-- ============================================================

-- Enable UUID generation
create extension if not exists "pgcrypto";

-- ── profile ──────────────────────────────────────────────────
create table if not exists public.profile (
  id                uuid primary key default gen_random_uuid(),
  name              text,
  title             text,
  tagline           text,
  bio               text,
  bio_extended      text,
  email             text,
  location          text,
  github_url        text,
  linkedin_url      text,
  avatar_url        text,
  resume_url        text,
  years_experience  integer,
  projects_count    integer,
  clients_count     integer,
  coffee_count      text,
  is_available      boolean default true,
  updated_at        timestamptz default now()
);

-- Seed one profile row so upsert can target it
insert into public.profile (name, title, bio, is_available)
select 'Your Name', 'Full-Stack Developer', 'Welcome to my portfolio.', true
where not exists (select 1 from public.profile);

-- ── projects ─────────────────────────────────────────────────
create table if not exists public.projects (
  id            uuid primary key default gen_random_uuid(),
  title         text not null,
  description   text,
  problem       text,
  features      jsonb   default '[]',
  tech_stack    jsonb   default '[]',
  category      text,
  github_url    text,
  demo_url      text,
  image_url     text,
  is_featured   boolean default false,
  is_published  boolean default true,
  display_order integer default 0,
  created_at    timestamptz default now(),
  updated_at    timestamptz default now()
);

-- ── skills ───────────────────────────────────────────────────
create table if not exists public.skills (
  id            uuid primary key default gen_random_uuid(),
  name          text not null,
  category      text not null default 'Other',
  icon_name     text,
  proficiency   integer default 80,
  display_order integer default 0,
  is_published  boolean default true,
  created_at    timestamptz default now()
);

-- ── education ────────────────────────────────────────────────
create table if not exists public.education (
  id            uuid primary key default gen_random_uuid(),
  institution   text not null,
  degree        text,
  field         text,
  start_date    date,
  end_date      date,
  location      text,
  description   text,
  achievements  jsonb   default '[]',
  is_current    boolean default false,
  display_order integer default 0,
  is_published  boolean default true,
  created_at    timestamptz default now()
);

-- ── experience ───────────────────────────────────────────────
create table if not exists public.experience (
  id            uuid primary key default gen_random_uuid(),
  company       text not null,
  role          text not null,
  start_date    date,
  end_date      date,
  location      text,
  description   text,
  achievements  jsonb   default '[]',
  is_current    boolean default false,
  display_order integer default 0,
  is_published  boolean default true,
  created_at    timestamptz default now()
);

-- ── certifications ───────────────────────────────────────────
create table if not exists public.certifications (
  id              uuid primary key default gen_random_uuid(),
  name            text not null,
  issuer          text not null,
  issue_date      date,
  expiry_date     date,
  credential_url  text,
  image_url       text,
  display_order   integer default 0,
  is_published    boolean default true,
  created_at      timestamptz default now()
);

-- ── achievements ─────────────────────────────────────────────
create table if not exists public.achievements (
  id            uuid primary key default gen_random_uuid(),
  title         text not null,
  description   text,
  date          text,
  icon          text default '🏆',
  display_order integer default 0,
  is_published  boolean default true,
  created_at    timestamptz default now()
);

-- ── services ─────────────────────────────────────────────────
create table if not exists public.services (
  id            uuid primary key default gen_random_uuid(),
  title         text not null,
  description   text,
  icon          text default '⚡',
  display_order integer default 0,
  is_published  boolean default true,
  created_at    timestamptz default now()
);

-- ── social_links ─────────────────────────────────────────────
create table if not exists public.social_links (
  id            uuid primary key default gen_random_uuid(),
  platform      text not null,
  url           text not null,
  display_order integer default 0,
  is_visible    boolean default true,
  created_at    timestamptz default now()
);

-- ── contact_messages ─────────────────────────────────────────
create table if not exists public.contact_messages (
  id         uuid primary key default gen_random_uuid(),
  name       text not null,
  email      text not null,
  subject    text not null,
  message    text not null,
  is_read    boolean default false,
  created_at timestamptz default now()
);

-- ── Auto-update timestamps ────────────────────────────────────
create or replace function public.handle_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_projects_updated_at on public.projects;
create trigger trg_projects_updated_at
  before update on public.projects
  for each row execute procedure public.handle_updated_at();

drop trigger if exists trg_profile_updated_at on public.profile;
create trigger trg_profile_updated_at
  before update on public.profile
  for each row execute procedure public.handle_updated_at();
