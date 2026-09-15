# Cloudflare + Firebase da Vitorino

O site continua estático e visualmente igual. A Cloudflare fica responsável pela hospedagem e o Firebase entra como banco/Auth do painel administrativo.

## Arquitetura

- Hospedagem: Cloudflare Pages, gerada por `npm run build`.
- Banco gratuito: Firebase Spark com Firestore.
- Authentication: Firebase Auth com email e senha, ativado pelo Console do Firebase.
- Storage: preparado no código, mas bucket novo do Firebase Storage exige plano Blaze para ser criado em projetos novos.
- Painel: `/admin/`, protegido por login do Firebase Auth.
- Landing: `/`, com conteúdo estático preservado. Se o Firebase não estiver configurado, a página segue funcionando com o HTML atual.
- GitHub: fica apenas como versionamento de código até o cutover final.
- Supabase: `supabase/schema.sql` foi mantido só como referência/legado, caso o cliente ainda queira uma conta Supabase separada.

## Estado atual

- Firebase project: `vitorino-doces-finos`.
- Firebase Web App: `1:460205382225:web:e4ca61557a7942a5613670`.
- Firestore: criado em `southamerica-east1` no free tier.
- Firestore rules/indexes: publicados.
- Seed inicial: carregado em `tenants/vitorino-doces-finos`.
- Cloudflare Pages project: `vitorino-doces-finos`.
- URL Cloudflare: `https://vitorino-doces-finos.pages.dev/`.
- Deploy de producao: `https://cac275a8.vitorino-doces-finos.pages.dev/`.
- Dominios adicionados na Cloudflare Pages: `vitorinodocesfinos.com.br` e `www.vitorinodocesfinos.com.br`.
- Status dos dominios: pendente de DNS.

## Cloudflare Pages

1. Entre na conta Cloudflare da Vitorino Doces Finos.
2. Rode `npx wrangler@4.128.0 login`.
3. Rode `npm run deploy:cloudflare`.
4. No painel da Cloudflare Pages, adicione `vitorinodocesfinos.com.br` e `www.vitorinodocesfinos.com.br` como domínios customizados.
5. Altere o DNS no provedor do domínio quando a Cloudflare mostrar os registros necessários:
   - `www`: CNAME para `vitorino-doces-finos.pages.dev`.
   - raiz/apex `vitorinodocesfinos.com.br`: adicione o domínio como zona na Cloudflare e aponte os nameservers do registrador/Wix para a Cloudflare.
6. Desative o GitHub Pages só depois que o domínio responder com HTTPS pela Cloudflare.

## Firebase

1. Use o projeto `vitorino-doces-finos`.
2. Mantenha o plano Spark gratuito.
3. Ative Authentication com provedor `Email/password` pelo Console do Firebase.
4. Use o Firestore ja criado em modo produção.
5. Crie o usuário administrador no Firebase Auth.
6. Copie o UID do usuário administrador e crie/ajuste o perfil admin em `profiles/{UID}` no Firestore.
7. A configuração pública do Web App já está em:
   - `03_landing_page/admin/config.js`
   - `03_landing_page/assets/js/vitorino-public-config.js`
8. Rode `firebase login`.
9. Publique regras e indexes com `npm run firebase:deploy`.
10. Use `firebase/seed-vitorino.json` como modelo para recriar documentos iniciais se precisar.

## Storage

O código do painel já está preparado para upload de imagens pelo Firebase Storage, mas o bucket padrão de Storage não foi criado porque projetos novos precisam de Blaze para criar bucket. Enquanto o projeto estiver no Spark, use URLs de imagens existentes ou faça upload das fotos por outro canal.

Quando o projeto estiver em Blaze e o bucket existir, rode `npm run firebase:deploy:storage` para publicar as regras.

## Segurança

- Nunca coloque senha, token privado, service account, chave secreta ou credencial pessoal no código.
- A configuração do Web App do Firebase é pública por natureza, mas as regras em `firebase/firestore.rules` e `firebase/storage.rules` controlam acesso real.
- O primeiro perfil admin precisa ser criado pelo Console do Firebase, porque antes dele nenhum usuário tem permissão de administração.
