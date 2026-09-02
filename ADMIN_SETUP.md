# Painel administrativo da Vitorino

O painel fica em `/admin/` e a landing continua em `/`.

## Arquitetura

- Hospedagem: GitHub Pages, mantendo a landing estática atual.
- Banco gratuito: Supabase Free, com Postgres, Auth e Storage.
- Segurança: RLS no banco, login por Supabase Auth e nenhuma `service_role key` no frontend.
- Publicação: o painel salva rascunho, permite preview local e publica no banco.
- Landing: carrega o conteúdo publicado do banco somente quando `assets/js/vitorino-public-config.js` estiver configurado. Se não estiver, a página permanece com o conteúdo estático atual.

## Ativação

1. Crie ou reative um projeto gratuito no Supabase.
2. Abra o SQL Editor do Supabase e execute `supabase/schema.sql`.
3. Em Authentication, crie o usuário administrador.
4. Copie o UUID do usuário criado.
5. No SQL Editor, rode:

```sql
insert into public.profiles (id, tenant_id, full_name, role)
select
  'COLE_AQUI_O_UUID_DO_USUARIO',
  id,
  'Administrador',
  'admin'
from public.tenants
where slug = 'vitorino-doces-finos';
```

6. Preencha as chaves públicas nos dois arquivos:

```js
// 03_landing_page/admin/config.js
window.VITORINO_ADMIN_CONFIG = {
  supabaseUrl: "https://SEU-PROJETO.supabase.co",
  supabaseAnonKey: "SUA_CHAVE_PUBLICA_ANON",
  landingSlug: "vitorino-doces-finos"
};
```

```js
// 03_landing_page/assets/js/vitorino-public-config.js
window.VITORINO_PUBLIC_CONFIG = {
  supabaseUrl: "https://SEU-PROJETO.supabase.co",
  supabaseAnonKey: "SUA_CHAVE_PUBLICA_ANON",
  landingSlug: "vitorino-doces-finos",
  trackingEnabled: true,
  requireConsent: false
};
```

7. Publique o site novamente.

## Importante

- A `anon key` é pública e pode ficar no frontend.
- Nunca coloque `service_role key`, senha do banco, token privado, chave de API secreta ou credenciais pessoais no código.
- O schema já cria tenant e landing padrão com o conteúdo atual, para a página continuar igual ao ser conectada.
