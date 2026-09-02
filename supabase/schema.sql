create extension if not exists pgcrypto;

create table if not exists public.tenants (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  full_name text,
  role text not null default 'client' check (role in ('admin', 'client')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.landing_pages (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  slug text not null,
  name text not null,
  status text not null default 'draft' check (status in ('draft', 'published', 'archived')),
  content jsonb not null default '{}'::jsonb,
  draft_content jsonb not null default '{}'::jsonb,
  settings jsonb not null default '{}'::jsonb,
  draft_settings jsonb not null default '{}'::jsonb,
  seo jsonb not null default '{}'::jsonb,
  draft_seo jsonb not null default '{}'::jsonb,
  integrations jsonb not null default '{}'::jsonb,
  draft_integrations jsonb not null default '{}'::jsonb,
  forms jsonb not null default '{}'::jsonb,
  draft_forms jsonb not null default '{}'::jsonb,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (tenant_id, slug)
);

create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  landing_page_id uuid not null references public.landing_pages(id) on delete cascade,
  name text,
  phone text,
  whatsapp text,
  email text,
  company text,
  city text,
  message text,
  source text,
  campaign text,
  utm_source text,
  utm_medium text,
  utm_campaign text,
  utm_content text,
  utm_term text,
  origin_page text,
  device_type text,
  status text not null default 'Novo' check (status in ('Novo', 'Em contato', 'Interessado', 'Proposta enviada', 'Fechado', 'Perdido')),
  internal_notes text,
  viewed_at timestamptz,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.tracking_events (
  id bigint generated always as identity primary key,
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  landing_page_id uuid not null references public.landing_pages(id) on delete cascade,
  session_id text not null,
  event_name text not null,
  event_type text,
  page text,
  path text,
  url text,
  referrer text,
  utm_source text,
  utm_medium text,
  utm_campaign text,
  utm_content text,
  utm_term text,
  element_label text,
  element_target text,
  device_type text,
  browser text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.consent_events (
  id bigint generated always as identity primary key,
  tenant_id uuid references public.tenants(id) on delete cascade,
  landing_page_id uuid references public.landing_pages(id) on delete cascade,
  session_id text,
  essential boolean not null default true,
  analytics boolean not null default false,
  marketing boolean not null default false,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.landing_scripts (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  landing_page_id uuid not null references public.landing_pages(id) on delete cascade,
  enabled boolean not null default false,
  head text not null default '',
  body_start text not null default '',
  body_end text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (landing_page_id)
);

create table if not exists public.change_logs (
  id bigint generated always as identity primary key,
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  landing_page_id uuid references public.landing_pages(id) on delete cascade,
  user_id uuid references auth.users(id) on delete set null,
  action text not null,
  summary text,
  payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists landing_pages_slug_idx on public.landing_pages (slug, status);
create index if not exists leads_landing_created_idx on public.leads (landing_page_id, created_at desc);
create index if not exists leads_status_idx on public.leads (status);
create index if not exists tracking_events_landing_created_idx on public.tracking_events (landing_page_id, created_at desc);
create index if not exists tracking_events_name_idx on public.tracking_events (event_name);
create index if not exists change_logs_landing_created_idx on public.change_logs (landing_page_id, created_at desc);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create schema if not exists app_private;

create or replace function app_private.current_tenant_id()
returns uuid
language sql
stable
security definer
set search_path = public
as $$
  select p.tenant_id
  from public.profiles p
  where p.id = (select auth.uid())
  limit 1
$$;

create or replace function app_private.current_role()
returns text
language sql
stable
security definer
set search_path = public
as $$
  select p.role
  from public.profiles p
  where p.id = (select auth.uid())
  limit 1
$$;

revoke all on schema app_private from public;
grant usage on schema app_private to authenticated;
revoke all on function app_private.current_tenant_id() from public;
revoke all on function app_private.current_role() from public;
grant execute on function app_private.current_tenant_id() to authenticated;
grant execute on function app_private.current_role() to authenticated;

drop trigger if exists tenants_set_updated_at on public.tenants;
create trigger tenants_set_updated_at
before update on public.tenants
for each row execute function public.set_updated_at();

drop trigger if exists profiles_set_updated_at on public.profiles;
create trigger profiles_set_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();

drop trigger if exists landing_pages_set_updated_at on public.landing_pages;
create trigger landing_pages_set_updated_at
before update on public.landing_pages
for each row execute function public.set_updated_at();

drop trigger if exists leads_set_updated_at on public.leads;
create trigger leads_set_updated_at
before update on public.leads
for each row execute function public.set_updated_at();

drop trigger if exists landing_scripts_set_updated_at on public.landing_scripts;
create trigger landing_scripts_set_updated_at
before update on public.landing_scripts
for each row execute function public.set_updated_at();

alter table public.tenants enable row level security;
alter table public.profiles enable row level security;
alter table public.landing_pages enable row level security;
alter table public.leads enable row level security;
alter table public.tracking_events enable row level security;
alter table public.consent_events enable row level security;
alter table public.landing_scripts enable row level security;
alter table public.change_logs enable row level security;

drop policy if exists "Tenant members can read their tenant" on public.tenants;
create policy "Tenant members can read their tenant"
on public.tenants for select
to authenticated
using (
  exists (
    select 1
    from public.profiles p
    where p.id = (select auth.uid())
      and p.tenant_id = tenants.id
  )
);

drop policy if exists "Users can read own profile" on public.profiles;
drop policy if exists "Tenant admins can read tenant profiles" on public.profiles;
drop policy if exists "Users can read tenant profiles" on public.profiles;
create policy "Users can read tenant profiles"
on public.profiles for select
to authenticated
using (
  id = (select auth.uid())
  or (
    tenant_id = app_private.current_tenant_id()
    and app_private.current_role() = 'admin'
  )
);

drop policy if exists "Users can update own profile name" on public.profiles;

drop policy if exists "Tenant admins can insert profiles" on public.profiles;
create policy "Tenant admins can insert profiles"
on public.profiles for insert
to authenticated
with check (
  tenant_id = app_private.current_tenant_id()
  and app_private.current_role() = 'admin'
);

drop policy if exists "Tenant admins can update profiles" on public.profiles;
create policy "Tenant admins can update profiles"
on public.profiles for update
to authenticated
using (
  tenant_id = app_private.current_tenant_id()
  and app_private.current_role() = 'admin'
)
with check (
  tenant_id = app_private.current_tenant_id()
  and app_private.current_role() = 'admin'
);

drop policy if exists "Tenant admins can delete profiles" on public.profiles;
create policy "Tenant admins can delete profiles"
on public.profiles for delete
to authenticated
using (
  tenant_id = app_private.current_tenant_id()
  and app_private.current_role() = 'admin'
);

drop policy if exists "Public can read published landing pages" on public.landing_pages;
create policy "Public can read published landing pages"
on public.landing_pages for select
to anon
using (status = 'published');

drop policy if exists "Tenant members can read landing pages" on public.landing_pages;
create policy "Tenant members can read landing pages"
on public.landing_pages for select
to authenticated
using (
  exists (
    select 1
    from public.profiles p
    where p.id = (select auth.uid())
      and p.tenant_id = landing_pages.tenant_id
  )
);

drop policy if exists "Tenant editors can insert landing pages" on public.landing_pages;
create policy "Tenant editors can insert landing pages"
on public.landing_pages for insert
to authenticated
with check (
  exists (
    select 1
    from public.profiles p
    where p.id = (select auth.uid())
      and p.tenant_id = landing_pages.tenant_id
      and p.role in ('admin', 'client')
  )
);

drop policy if exists "Tenant editors can update landing pages" on public.landing_pages;
create policy "Tenant editors can update landing pages"
on public.landing_pages for update
to authenticated
using (
  exists (
    select 1
    from public.profiles p
    where p.id = (select auth.uid())
      and p.tenant_id = landing_pages.tenant_id
      and p.role in ('admin', 'client')
  )
)
with check (
  exists (
    select 1
    from public.profiles p
    where p.id = (select auth.uid())
      and p.tenant_id = landing_pages.tenant_id
      and p.role in ('admin', 'client')
  )
);

drop policy if exists "Admins can delete landing pages" on public.landing_pages;
create policy "Admins can delete landing pages"
on public.landing_pages for delete
to authenticated
using (
  exists (
    select 1
    from public.profiles p
    where p.id = (select auth.uid())
      and p.tenant_id = landing_pages.tenant_id
      and p.role = 'admin'
  )
);

drop policy if exists "Public can create leads for published landing pages" on public.leads;
create policy "Public can create leads for published landing pages"
on public.leads for insert
to anon, authenticated
with check (
  exists (
    select 1
    from public.landing_pages lp
    where lp.id = leads.landing_page_id
      and lp.tenant_id = leads.tenant_id
      and lp.status = 'published'
  )
);

drop policy if exists "Tenant members can read leads" on public.leads;
create policy "Tenant members can read leads"
on public.leads for select
to authenticated
using (
  exists (
    select 1
    from public.profiles p
    where p.id = (select auth.uid())
      and p.tenant_id = leads.tenant_id
  )
);

drop policy if exists "Tenant members can update leads" on public.leads;
create policy "Tenant members can update leads"
on public.leads for update
to authenticated
using (
  exists (
    select 1
    from public.profiles p
    where p.id = (select auth.uid())
      and p.tenant_id = leads.tenant_id
  )
)
with check (
  exists (
    select 1
    from public.profiles p
    where p.id = (select auth.uid())
      and p.tenant_id = leads.tenant_id
  )
);

drop policy if exists "Public can record events for published landing pages" on public.tracking_events;
create policy "Public can record events for published landing pages"
on public.tracking_events for insert
to anon, authenticated
with check (
  exists (
    select 1
    from public.landing_pages lp
    where lp.id = tracking_events.landing_page_id
      and lp.tenant_id = tracking_events.tenant_id
      and lp.status = 'published'
  )
);

drop policy if exists "Tenant members can read events" on public.tracking_events;
create policy "Tenant members can read events"
on public.tracking_events for select
to authenticated
using (
  exists (
    select 1
    from public.profiles p
    where p.id = (select auth.uid())
      and p.tenant_id = tracking_events.tenant_id
  )
);

drop policy if exists "Public can store cookie consent" on public.consent_events;
create policy "Public can store cookie consent"
on public.consent_events for insert
to anon, authenticated
with check (
  landing_page_id is null
  or exists (
    select 1
    from public.landing_pages lp
    where lp.id = consent_events.landing_page_id
      and lp.tenant_id = consent_events.tenant_id
      and lp.status = 'published'
  )
);

drop policy if exists "Tenant members can read consent events" on public.consent_events;
create policy "Tenant members can read consent events"
on public.consent_events for select
to authenticated
using (
  exists (
    select 1
    from public.profiles p
    where p.id = (select auth.uid())
      and p.tenant_id = consent_events.tenant_id
  )
);

drop policy if exists "Public can read enabled landing scripts" on public.landing_scripts;
create policy "Public can read enabled landing scripts"
on public.landing_scripts for select
to anon
using (
  enabled = true
  and exists (
    select 1
    from public.landing_pages lp
    where lp.id = landing_scripts.landing_page_id
      and lp.tenant_id = landing_scripts.tenant_id
      and lp.status = 'published'
  )
);

drop policy if exists "Tenant members can read landing scripts" on public.landing_scripts;
create policy "Tenant members can read landing scripts"
on public.landing_scripts for select
to authenticated
using (
  exists (
    select 1
    from public.profiles p
    where p.id = (select auth.uid())
      and p.tenant_id = landing_scripts.tenant_id
  )
);

drop policy if exists "Admins can write landing scripts" on public.landing_scripts;
create policy "Admins can write landing scripts"
on public.landing_scripts for all
to authenticated
using (
  exists (
    select 1
    from public.profiles p
    where p.id = (select auth.uid())
      and p.tenant_id = landing_scripts.tenant_id
      and p.role = 'admin'
  )
)
with check (
  exists (
    select 1
    from public.profiles p
    where p.id = (select auth.uid())
      and p.tenant_id = landing_scripts.tenant_id
      and p.role = 'admin'
  )
);

drop policy if exists "Tenant members can read change logs" on public.change_logs;
create policy "Tenant members can read change logs"
on public.change_logs for select
to authenticated
using (
  exists (
    select 1
    from public.profiles p
    where p.id = (select auth.uid())
      and p.tenant_id = change_logs.tenant_id
  )
);

drop policy if exists "Tenant members can create change logs" on public.change_logs;
create policy "Tenant members can create change logs"
on public.change_logs for insert
to authenticated
with check (
  user_id = (select auth.uid())
  and exists (
    select 1
    from public.profiles p
    where p.id = (select auth.uid())
      and p.tenant_id = change_logs.tenant_id
  )
);

insert into public.tenants (slug, name)
values ('vitorino-doces-finos', 'Vitorino Doces Finos')
on conflict (slug) do update set name = excluded.name;

insert into public.landing_pages (
  tenant_id,
  slug,
  name,
  status,
  content,
  draft_content,
  settings,
  draft_settings,
  seo,
  draft_seo,
  integrations,
  draft_integrations,
  forms,
  draft_forms,
  published_at
)
select
  t.id,
  'vitorino-doces-finos',
  'Vitorino Doces Finos',
  'published',
  default_content.content,
  default_content.content,
  default_content.settings,
  default_content.settings,
  default_content.seo,
  default_content.seo,
  default_content.integrations,
  default_content.integrations,
  default_content.forms,
  default_content.forms,
  now()
from public.tenants t
cross join (
  select
    '{
      "hero": {
        "title": "Vitorino Doces Finos",
        "subtitle": "Doces finos artesanais para casamentos, festas, eventos corporativos e presentes. Produção sob encomenda, acabamento elegante e atendimento em Curitiba.",
        "signatureTitle": "Atendimento em Curitiba",
        "signatureText": "Doces finos para eventos, festas e presentes em Curitiba."
      },
      "sections": {
        "promotions": {
          "title": "Promoções e destaques para encomendar.",
          "copy": "Seleções especiais para presentes, eventos e datas comemorativas. Valores, disponibilidade e quantidade mínima são confirmados no atendimento."
        },
        "events": {
          "title": "Doces finos para festas e eventos em Curitiba.",
          "copy": "Escolha a ocasião e conheça doces finos artesanais feitos sob encomenda para casamentos, eventos corporativos, aniversários e presentes."
        },
        "gallery": {
          "title": "Fotos dos doces e mesas de eventos.",
          "copy": "Galeria com doces finos, bandejas e composições de mesa para conhecer o acabamento antes de solicitar o orçamento."
        },
        "budget": {
          "title": "Monte uma prévia do seu orçamento.",
          "copy": "Preencha as informações principais e envie o resumo pelo WhatsApp. A confirmação final depende de sabores, data, embalagens e serviços."
        },
        "contact": {
          "title": "Atendimento em Curitiba.",
          "copy": "Confira endereço, telefone, rota e avaliações antes de fazer sua encomenda."
        },
        "faq": {
          "title": "Dúvidas antes de encomendar."
        },
        "finalCta": {
          "title": "Solicite seu orçamento.",
          "copy": "Envie data, quantidade e tipo de pedido. A Vitorino responde com disponibilidade, opções e próximos passos."
        }
      },
      "events": [
        {
          "title": "Casamentos",
          "copy": "Que seu casamento seja um dia inesquecível.",
          "image": "assets/img/official-web/casamentos-mesa.jpg",
          "alt": "Mesa de doces finos para casamento"
        },
        {
          "title": "Eventos Corporativos",
          "copy": "Doces que marcam presença no seu evento.",
          "image": "assets/img/official-web/eventos-corporativos-mesa.jpg",
          "alt": "Mesa de doces finos para evento corporativo"
        },
        {
          "title": "Aniversários",
          "copy": "Todo aniversário merece ser memorável.",
          "image": "assets/img/official-web/aniversarios-doces.jpg",
          "alt": "Doces finos coloridos para aniversário"
        },
        {
          "title": "Presentes",
          "copy": "Um presente que surpreende e fica na lembrança.",
          "image": "assets/img/official-web/presentes-caixa.jpg",
          "alt": "Caixa de doces finos para presente"
        }
      ],
      "reviews": [
        {
          "title": "Atendimento",
          "quote": "\"Atendimento ótimo e de alta qualidade.\"",
          "author": "Helena R., Google"
        },
        {
          "title": "Sabor",
          "quote": "\"O bombom de uva verde é perfeito.\"",
          "author": "Arthur Zarpellon, Google"
        },
        {
          "title": "Curitiba",
          "quote": "\"Os melhores de Curitiba.\"",
          "author": "Kleber Junior, Google"
        }
      ],
      "faq": [
        {
          "question": "Como faço uma encomenda?",
          "answer": "Envie data, tipo de evento, quantidade desejada, sabores de interesse e serviços que deseja consultar."
        },
        {
          "question": "Quais eventos a Vitorino atende?",
          "answer": "Casamentos, formaturas, eventos corporativos, aniversários, festas infantis, debutantes, presentes e datas especiais."
        },
        {
          "question": "Vocês montam mesa no local?",
          "answer": "Montagem de mesa, copeiras e aluguel de suportes podem ser consultados no orçamento."
        },
        {
          "question": "A estimativa do site é o valor final?",
          "answer": "Não. A estimativa ajuda na primeira conversa. O valor final depende de sabores, embalagens, serviços, data e logística."
        },
        {
          "question": "Como conservar os doces?",
          "answer": "Evite calor e mantenha os doces embalados até servir. Produtos com frutas ou cremes podem precisar de refrigeração."
        }
      ]
    }'::jsonb as content,
    '{
      "contact": {
        "phone": "+554197327887",
        "phoneLabel": "(41) 9732-7887",
        "site": "https://vitorinodocesfinos.com.br/",
        "instagram": "https://www.instagram.com/vitorinodocesfinos/",
        "address": "R. Waldir Pontes, 175 - Cidade Industrial de Curitiba, Curitiba - PR, 81270-303",
        "shortAddress": "R. Waldir Pontes, 175 - Cidade Industrial de Curitiba.",
        "mapUrl": "https://www.google.com/maps/search/?api=1&query=R.%20Waldir%20Pontes%2C%20175%20-%20Cidade%20Industrial%20de%20Curitiba%2C%20Curitiba%20-%20PR%2C%2081270-303",
        "mapEmbedUrl": "https://www.google.com/maps?q=R.%20Waldir%20Pontes%2C%20175%20-%20Cidade%20Industrial%20de%20Curitiba%2C%20Curitiba%20-%20PR%2C%2081270-303&output=embed"
      },
      "whatsapp": {
        "number": "554197327887",
        "defaultMessage": "Olá, gostaria de solicitar um orçamento com a Vitorino Doces Finos.",
        "messages": {}
      },
      "tracking": {
        "enabled": false
      },
      "privacy": {
        "requireConsent": false
      }
    }'::jsonb as settings,
    '{
      "title": "Vitorino Doces Finos | Doces finos em Curitiba",
      "description": "Doces finos artesanais em Curitiba para casamentos, aniversários, eventos corporativos e presentes. Produção sob encomenda e orçamento pelo WhatsApp.",
      "canonicalUrl": "https://vitorinodocesfinos.com.br/",
      "favicon": "assets/img/brand/favicon-round-32.png",
      "ogTitle": "Vitorino Doces Finos | Doces finos em Curitiba",
      "ogDescription": "Doces finos artesanais para casamentos, aniversários, eventos corporativos e presentes em Curitiba. Solicite seu orçamento pelo WhatsApp.",
      "ogImage": "https://vitorinodocesfinos.com.br/assets/img/official-web/hero-mesa-eventos.jpg",
      "ogImageAlt": "Mesa de doces finos artesanais da Vitorino em Curitiba"
    }'::jsonb as seo,
    '{
      "ga4": {
        "enabled": false,
        "measurementId": ""
      },
      "gtm": {
        "enabled": false,
        "containerId": ""
      },
      "metaPixel": {
        "enabled": false,
        "pixelId": ""
      },
      "googleAds": {
        "enabled": false,
        "conversionId": "",
        "conversionLabel": "",
        "conversionEvent": "whatsapp_click"
      },
      "webhook": {
        "enabled": false,
        "url": "",
        "method": "POST"
      }
    }'::jsonb as integrations,
    '{
      "lead": {
        "title": "Solicite seu orçamento",
        "buttonText": "Enviar pedido",
        "successMessage": "Pedido recebido. A Vitorino retornará com disponibilidade.",
        "fields": [
          {"name": "name", "label": "Nome", "enabled": true, "required": true},
          {"name": "phone", "label": "Telefone", "enabled": true, "required": true},
          {"name": "email", "label": "E-mail", "enabled": true, "required": false},
          {"name": "message", "label": "Mensagem", "enabled": true, "required": false}
        ]
      }
    }'::jsonb as forms
) default_content
where t.slug = 'vitorino-doces-finos'
on conflict (tenant_id, slug) do update set
  name = excluded.name,
  status = excluded.status,
  content = excluded.content,
  draft_content = excluded.draft_content,
  settings = excluded.settings,
  draft_settings = excluded.draft_settings,
  seo = excluded.seo,
  draft_seo = excluded.draft_seo,
  integrations = excluded.integrations,
  draft_integrations = excluded.draft_integrations,
  forms = excluded.forms,
  draft_forms = excluded.draft_forms,
  published_at = excluded.published_at;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'landing-assets',
  'landing-assets',
  true,
  10485760,
  array['image/png', 'image/jpeg', 'image/webp', 'image/gif']
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Public can read landing assets" on storage.objects;
create policy "Public can read landing assets"
on storage.objects for select
to anon, authenticated
using (bucket_id = 'landing-assets');

drop policy if exists "Tenant editors can upload landing assets" on storage.objects;
create policy "Tenant editors can upload landing assets"
on storage.objects for insert
to authenticated
with check (
  bucket_id = 'landing-assets'
  and exists (
    select 1
    from public.profiles p
    where p.id = (select auth.uid())
      and p.role in ('admin', 'client')
      and split_part(storage.objects.name, '/', 1) = p.tenant_id::text
  )
);

drop policy if exists "Tenant editors can update landing assets" on storage.objects;
create policy "Tenant editors can update landing assets"
on storage.objects for update
to authenticated
using (
  bucket_id = 'landing-assets'
  and exists (
    select 1
    from public.profiles p
    where p.id = (select auth.uid())
      and p.role in ('admin', 'client')
      and split_part(storage.objects.name, '/', 1) = p.tenant_id::text
  )
)
with check (
  bucket_id = 'landing-assets'
  and exists (
    select 1
    from public.profiles p
    where p.id = (select auth.uid())
      and p.role in ('admin', 'client')
      and split_part(storage.objects.name, '/', 1) = p.tenant_id::text
  )
);

drop policy if exists "Tenant editors can delete landing assets" on storage.objects;
create policy "Tenant editors can delete landing assets"
on storage.objects for delete
to authenticated
using (
  bucket_id = 'landing-assets'
  and exists (
    select 1
    from public.profiles p
    where p.id = (select auth.uid())
      and p.role in ('admin', 'client')
      and split_part(storage.objects.name, '/', 1) = p.tenant_id::text
  )
);
