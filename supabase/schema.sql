-- Users table
create table users (
  id uuid not null default extensions.uuid_generate_v4(),
  username text not null,
  email text not null,
  is_admin boolean null default false,
  created_at timestamp with time zone null default timezone('utc'::text, now()),
  pfp text null,
  constraint users_pkey primary key (id),
  constraint users_email_key unique (email)
);


-- Refolio Sections table
create table refolio_sections (
  username text not null,
  id uuid null default gen_random_uuid(),
  name text not null,
  email text not null,
  nav jsonb null default '{}'::jsonb,
  intro jsonb null,
  stacks jsonb null default '[{"id": "1", "src": "", "name": "", "description": ""}]'::jsonb,
  projects jsonb null default '[{"id": "1", "src": "", "href": "", "title": "", "description": ""}]'::jsonb,
  languages jsonb null default '[{"id": "1", "name": "", "proficiency": ""}]'::jsonb,
  experiences jsonb null default '[{"id": "1", "src": "", "title": "", "company": "", "duration": ""}]'::jsonb,
  education jsonb null default '[{"id": "1", "title": "", "duration": "", "description": "", "institution": ""}]'::jsonb,
  certificates jsonb null default '[{"id": "1", "title": "", "duration": "", "description": "", "institution": ""}]'::jsonb,
  awards jsonb null default '[{"id": "1", "name": "", "year": "", "description": ""}]'::jsonb,
  summary jsonb null default '{"paragraph": "", "socialLinks": {"github": "", "twitter": "", "linkedin": ""}}'::jsonb,
  created_at timestamp with time zone null default now(),
  updated_at timestamp with time zone null default now(),
  can_change_username boolean null default true,
  is_password_protected boolean null default false,
  refolio_password text null,
  github_username text null,
  is_published boolean null default false,
  notice text null,
  constraint refolio_sections_pkey primary key (username)
);
