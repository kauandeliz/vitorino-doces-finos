# Cloudflare + Firebase da Vitorino

O site continua estático e visualmente igual. A Cloudflare fica responsável pela hospedagem e o Firebase entra como banco/Auth/Storage do painel administrativo.

## Arquitetura

- Hospedagem: Cloudflare Pages, gerada por `npm run build`.
- Banco gratuito: Firebase Spark com Firestore, Authentication e Storage.
- Painel: `/admin/`, protegido por login do Firebase Auth.
- Landing: `/`, com conteúdo estático preservado. Se o Firebase não estiver configurado, a página segue funcionando com o HTML atual.
- GitHub: fica apenas como versionamento de código até o cutover final.
- Supabase: `supabase/schema.sql` foi mantido só como referência/legado, caso o cliente ainda queira uma conta Supabase separada.

## Cloudflare Pages

1. Entre na conta Cloudflare da Vitorino Doces Finos.
2. Rode `npx wrangler@4.128.0 login`.
3. Rode `npm run deploy:cloudflare`.
4. No painel da Cloudflare Pages, adicione `vitorinodocesfinos.com.br` e `www.vitorinodocesfinos.com.br` como domínios customizados.
5. Altere o DNS no provedor do domínio quando a Cloudflare mostrar os registros necessários.
6. Desative o GitHub Pages só depois que o domínio responder com HTTPS pela Cloudflare.

## Firebase

1. Crie um projeto Firebase no nome `Vitorino Doces Finos`.
2. Use o plano Spark gratuito.
3. Ative Authentication com provedor `Email/password`.
4. Ative Firestore em modo produção.
5. Ative Storage.
6. Crie um Web App e copie a configuração pública para:
   - `03_landing_page/admin/config.js`
   - `03_landing_page/assets/js/vitorino-public-config.js`
7. Rode `firebase login`.
8. Selecione o projeto com `firebase use --add`.
9. Publique as regras com `npm run firebase:deploy`.
10. Crie o usuário administrador no Firebase Auth.
11. Use `firebase/seed-vitorino.json` como modelo para criar os documentos iniciais no Firestore, trocando o UID do admin.

## Segurança

- Nunca coloque senha, token privado, service account, chave secreta ou credencial pessoal no código.
- A configuração do Web App do Firebase é pública por natureza, mas as regras em `firebase/firestore.rules` e `firebase/storage.rules` controlam acesso real.
- O primeiro perfil admin precisa ser criado pelo Console do Firebase, porque antes dele nenhum usuário tem permissão de administração.
