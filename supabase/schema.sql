-- Pathly user database (Supabase/Postgres)
-- Auth identities live in auth.users. This table stores the Pathly application profile.
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  display_name text,
  profile jsonb not null default '{}'::jsonb,
  selected_program_ids text[] not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "Users can read their own Pathly profile"
on public.profiles for select using (auth.uid() = id);
create policy "Users can create their own Pathly profile"
on public.profiles for insert with check (auth.uid() = id);
create policy "Users can update their own Pathly profile"
on public.profiles for update using (auth.uid() = id) with check (auth.uid() = id);

create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists profiles_updated_at on public.profiles;
create trigger profiles_updated_at before update on public.profiles
for each row execute function public.set_updated_at();
