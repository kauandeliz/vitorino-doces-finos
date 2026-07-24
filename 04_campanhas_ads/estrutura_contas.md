---
id: TASK-010
titulo: Estrutura inicial de campanhas de anuncios
modulo: 04
status: em_revisao
responsavel: MarkOps PRO
criado_em: 2026-07-23
atualizado_em: 2026-07-23
versao: 1.0
objetivo: Definir base de midia paga para campanhas futuras
publico: Gestao de trafego e marketing
canal: Meta Ads e Google Ads
etapa_funil: frio
---

# Estrutura de Contas

## Objetivo de Midia

Gerar leads qualificados pelo WhatsApp para encomendas de doces finos, mesas de doces e produtos sazonais.

## Plataformas

- Meta Ads: Instagram e Facebook.
- Google Ads: pesquisa local e campanha de chamadas, apos confirmacao de endereco e site.

## Campanhas Recomendadas

| ID | Campanha | Objetivo | Status |
|---|---|---|---|
| CMP-001 | Eventos e Casamentos Curitiba | Leads pelo WhatsApp | A criar |
| CMP-002 | Páscoa Artesanal | Vendas/encomendas sazonais | Bloqueada ate sabores e ofertas atuais |
| CMP-003 | Presentes Corporativos | Leads B2B | A criar |
| CMP-004 | Remarketing Instagram | Reengajar visitantes e engajados | A criar |

## Publicos

- Pessoas em Curitiba interessadas em casamento, festa, formatura, eventos e doces.
- Noivas, cerimonialistas e fornecedores de eventos.
- Empresas, RH, marketing e administradores para presentes corporativos.
- Engajados com Instagram e visitantes da landing page.

## Eventos de Conversao

Eventos pendentes de configuracao:

- clique no WhatsApp;
- clique no telefone;
- envio de formulario, se houver;
- clique no Instagram;
- rolagem de pagina;
- visualizacao de produto.

## UTMs Padrao

```text
utm_source=meta
utm_medium=paid_social
utm_campaign={{campaign.name}}
utm_content={{ad.name}}
```

```text
utm_source=google
utm_medium=cpc
utm_campaign={{campaign.name}}
utm_content={{adgroup.name}}
```

## KPIs

- cliques no WhatsApp;
- custo por lead;
- taxa de conversao da landing page;
- mensagens iniciadas;
- CTR;
- CPC;
- frequencia;
- leads por campanha;
- pedidos fechados, quando houver integracao comercial.

## Bloqueios

- Orcamento de midia nao informado.
- Pixel, CAPI e GTM nao configurados.
- Site final e dominio nao confirmados.
- Ofertas e precos atuais nao confirmados.
- Area de atendimento nao confirmada.

