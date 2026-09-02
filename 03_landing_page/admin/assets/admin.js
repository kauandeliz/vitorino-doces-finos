import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.112.4/+esm";

const leadStatuses = ["Novo", "Em contato", "Interessado", "Proposta enviada", "Fechado", "Perdido"];
const navNames = {
  dashboard: ["Dashboard", "Visão geral de acessos, leads e conversões da landing."],
  leads: ["Leads", "Acompanhe contatos recebidos, status e observações internas."],
  analytics: ["Analytics", "Configure rastreamento, campanhas e eventos de conversão."],
  funnel: ["Funil", "Veja a passagem de visitantes até leads fechados."],
  landing: ["Landing Page", "Edite conteúdo principal sem alterar o código-fonte."],
  forms: ["Formulários", "Configure campos, obrigatoriedade e mensagens."],
  integrations: ["Integrações", "Conecte ferramentas externas e webhooks."],
  seo: ["SEO", "Controle metadados, favicon e previews de busca/social."],
  scripts: ["Scripts", "Área restrita para scripts personalizados."],
  settings: ["Configurações", "Dados da empresa, WhatsApp, endereço e redes."],
  users: ["Usuários", "Gerencie usuários vinculados ao cliente atual."],
  history: ["Histórico", "Consulte publicações e alterações feitas no painel."]
};

const defaultDraft = {
  content: {
    hero: {
      title: "Vitorino Doces Finos",
      subtitle: "Doces finos artesanais para casamentos, festas, eventos corporativos e presentes. Produção sob encomenda, acabamento elegante e atendimento em Curitiba.",
      signatureTitle: "Atendimento em Curitiba",
      signatureText: "Doces finos para eventos, festas e presentes em Curitiba."
    },
    sections: {
      promotions: { title: "Promoções e destaques para encomendar.", copy: "Seleções especiais para presentes, eventos e datas comemorativas. Valores, disponibilidade e quantidade mínima são confirmados no atendimento." },
      events: { title: "Doces finos para festas e eventos em Curitiba.", copy: "Escolha a ocasião e conheça doces finos artesanais feitos sob encomenda para casamentos, eventos corporativos, aniversários e presentes." },
      gallery: { title: "Fotos dos doces e mesas de eventos.", copy: "Galeria com doces finos, bandejas e composições de mesa para conhecer o acabamento antes de solicitar o orçamento." },
      budget: { title: "Monte uma prévia do seu orçamento.", copy: "Preencha as informações principais e envie o resumo pelo WhatsApp. A confirmação final depende de sabores, data, embalagens e serviços." },
      contact: { title: "Atendimento em Curitiba.", copy: "Confira endereço, telefone, rota e avaliações antes de fazer sua encomenda." },
      faq: { title: "Dúvidas antes de encomendar." },
      finalCta: { title: "Solicite seu orçamento.", copy: "Envie data, quantidade e tipo de pedido. A Vitorino responde com disponibilidade, opções e próximos passos." }
    },
    events: [
      { title: "Casamentos", copy: "Que seu casamento seja um dia inesquecível.", image: "assets/img/official-web/casamentos-mesa.jpg", alt: "Mesa de doces finos para casamento" },
      { title: "Eventos Corporativos", copy: "Doces que marcam presença no seu evento.", image: "assets/img/official-web/eventos-corporativos-mesa.jpg", alt: "Mesa de doces finos para evento corporativo" },
      { title: "Aniversários", copy: "Todo aniversário merece ser memorável.", image: "assets/img/official-web/aniversarios-doces.jpg", alt: "Doces finos coloridos para aniversário" },
      { title: "Presentes", copy: "Um presente que surpreende e fica na lembrança.", image: "assets/img/official-web/presentes-caixa.jpg", alt: "Caixa de doces finos para presente" }
    ],
    reviews: [
      { title: "Atendimento", quote: "\"Atendimento ótimo e de alta qualidade.\"", author: "Helena R., Google" },
      { title: "Sabor", quote: "\"O bombom de uva verde é perfeito.\"", author: "Arthur Zarpellon, Google" },
      { title: "Curitiba", quote: "\"Os melhores de Curitiba.\"", author: "Kleber Junior, Google" }
    ],
    faq: [
      { question: "Como faço uma encomenda?", answer: "Envie data, tipo de evento, quantidade desejada, sabores de interesse e serviços que deseja consultar." },
      { question: "Quais eventos a Vitorino atende?", answer: "Casamentos, formaturas, eventos corporativos, aniversários, festas infantis, debutantes, presentes e datas especiais." },
      { question: "Vocês montam mesa no local?", answer: "Montagem de mesa, copeiras e aluguel de suportes podem ser consultados no orçamento." },
      { question: "A estimativa do site é o valor final?", answer: "Não. A estimativa ajuda na primeira conversa. O valor final depende de sabores, embalagens, serviços, data e logística." },
      { question: "Como conservar os doces?", answer: "Evite calor e mantenha os doces embalados até servir. Produtos com frutas ou cremes podem precisar de refrigeração." }
    ]
  },
  settings: {
    contact: {
      phone: "+554197327887",
      phoneLabel: "(41) 9732-7887",
      site: "https://vitorinodocesfinos.com.br/",
      instagram: "https://www.instagram.com/vitorinodocesfinos/",
      address: "R. Waldir Pontes, 175 - Cidade Industrial de Curitiba, Curitiba - PR, 81270-303",
      shortAddress: "R. Waldir Pontes, 175 - Cidade Industrial de Curitiba.",
      mapUrl: "https://www.google.com/maps/search/?api=1&query=R.%20Waldir%20Pontes%2C%20175%20-%20Cidade%20Industrial%20de%20Curitiba%2C%20Curitiba%20-%20PR%2C%2081270-303",
      mapEmbedUrl: "https://www.google.com/maps?q=R.%20Waldir%20Pontes%2C%20175%20-%20Cidade%20Industrial%20de%20Curitiba%2C%20Curitiba%20-%20PR%2C%2081270-303&output=embed"
    },
    whatsapp: {
      number: "554197327887",
      defaultMessage: "Olá, gostaria de solicitar um orçamento com a Vitorino Doces Finos.",
      messages: {}
    },
    tracking: { enabled: false },
    privacy: { requireConsent: false }
  },
  seo: {
    title: "Vitorino Doces Finos | Doces finos em Curitiba",
    description: "Doces finos artesanais em Curitiba para casamentos, aniversários, eventos corporativos e presentes. Produção sob encomenda e orçamento pelo WhatsApp.",
    canonicalUrl: "https://vitorinodocesfinos.com.br/",
    favicon: "assets/img/brand/favicon-round-32.png",
    ogTitle: "Vitorino Doces Finos | Doces finos em Curitiba",
    ogDescription: "Doces finos artesanais para casamentos, aniversários, eventos corporativos e presentes em Curitiba. Solicite seu orçamento pelo WhatsApp.",
    ogImage: "https://vitorinodocesfinos.com.br/assets/img/official-web/hero-mesa-eventos.jpg",
    ogImageAlt: "Mesa de doces finos artesanais da Vitorino em Curitiba"
  },
  integrations: {
    ga4: { enabled: false, measurementId: "" },
    gtm: { enabled: false, containerId: "" },
    metaPixel: { enabled: false, pixelId: "" },
    googleAds: { enabled: false, conversionId: "", conversionLabel: "", conversionEvent: "whatsapp_click" },
    webhook: { enabled: false, url: "", method: "POST" }
  },
  forms: {
    lead: {
      title: "Solicite seu orçamento",
      buttonText: "Enviar pedido",
      successMessage: "Pedido recebido. A Vitorino retornará com disponibilidade.",
      fields: [
        { name: "name", label: "Nome", enabled: true, required: true },
        { name: "phone", label: "Telefone", enabled: true, required: true },
        { name: "email", label: "E-mail", enabled: true, required: false },
        { name: "message", label: "Mensagem", enabled: true, required: false }
      ]
    }
  }
};

const state = {
  config: {},
  supabase: null,
  session: null,
  user: null,
  profile: null,
  tenant: null,
  landing: null,
  draft: structuredClone(defaultDraft),
  leads: [],
  events: [],
  logs: [],
  users: [],
  scripts: null,
  view: "dashboard",
  period: "30d",
  leadSearch: "",
  leadStatus: "all",
  charts: {}
};

const els = {
  authView: document.querySelector("[data-auth-view]"),
  appView: document.querySelector("[data-app-view]"),
  loginForm: document.querySelector("[data-login-form]"),
  configForm: document.querySelector("[data-config-form]"),
  setupWarning: document.querySelector("[data-setup-warning]"),
  resetPassword: document.querySelector("[data-reset-password]"),
  logout: document.querySelector("[data-logout]"),
  refresh: document.querySelector("[data-refresh]"),
  viewRoot: document.querySelector("[data-view-root]"),
  pageName: document.querySelector("[data-page-name]"),
  pageStatus: document.querySelector("[data-page-status]"),
  sidebar: document.querySelector(".sidebar"),
  sidebarToggle: document.querySelector("[data-sidebar-toggle]"),
  toast: document.querySelector("[data-toast]")
};

boot();

async function boot() {
  state.config = readConfig();
  hydrateConfigForm();
  bindGlobalEvents();

  if (!hasConnection(state.config)) {
    els.setupWarning.hidden = false;
    els.authView.hidden = false;
    return;
  }

  state.supabase = createClient(state.config.supabaseUrl, state.config.supabaseAnonKey, {
    auth: { persistSession: true, autoRefreshToken: true }
  });

  const { data } = await state.supabase.auth.getSession();
  state.session = data.session;
  state.supabase.auth.onAuthStateChange((_event, session) => {
    state.session = session;
    if (session) startApp();
    else showAuth();
  });

  if (state.session) await startApp();
  else showAuth();
}

function readConfig() {
  let local = {};
  try {
    local = JSON.parse(localStorage.getItem("vitorino_admin_config") || "{}");
  } catch {
    local = {};
  }
  return {
    supabaseUrl: "",
    supabaseAnonKey: "",
    landingSlug: "vitorino-doces-finos",
    ...(window.VITORINO_ADMIN_CONFIG || {}),
    ...local
  };
}

function hasConnection(config) {
  return /^https?:\/\//.test(config.supabaseUrl || "") && String(config.supabaseAnonKey || "").length > 30;
}

function hydrateConfigForm() {
  if (!els.configForm) return;
  els.configForm.supabaseUrl.value = state.config.supabaseUrl || "";
  els.configForm.supabaseAnonKey.value = state.config.supabaseAnonKey || "";
  els.configForm.landingSlug.value = state.config.landingSlug || "vitorino-doces-finos";
}

function bindGlobalEvents() {
  els.configForm?.addEventListener("submit", (event) => {
    event.preventDefault();
    const data = new FormData(els.configForm);
    localStorage.setItem("vitorino_admin_config", JSON.stringify({
      supabaseUrl: String(data.get("supabaseUrl") || "").trim(),
      supabaseAnonKey: String(data.get("supabaseAnonKey") || "").trim(),
      landingSlug: String(data.get("landingSlug") || "vitorino-doces-finos").trim()
    }));
    toast("Conexão salva neste navegador. Recarregando o painel...");
    setTimeout(() => location.reload(), 700);
  });

  els.loginForm?.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (!state.supabase) return toast("Configure o Supabase antes de entrar.");
    const data = new FormData(els.loginForm);
    const email = String(data.get("email") || "").trim();
    const password = String(data.get("password") || "");
    const { error } = await state.supabase.auth.signInWithPassword({ email, password });
    if (error) return toast(error.message);
    toast("Login realizado.");
  });

  els.resetPassword?.addEventListener("click", async () => {
    const email = String(new FormData(els.loginForm).get("email") || "").trim();
    if (!email) return toast("Informe o e-mail antes de pedir recuperação.");
    const { error } = await state.supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${location.origin}${location.pathname}`
    });
    toast(error ? error.message : "E-mail de recuperação enviado.");
  });

  els.logout?.addEventListener("click", async () => {
    await state.supabase?.auth.signOut();
  });

  els.refresh?.addEventListener("click", () => loadData(true));
  els.sidebarToggle?.addEventListener("click", () => els.sidebar?.classList.toggle("is-open"));

  document.querySelectorAll("[data-view]").forEach((button) => {
    button.addEventListener("click", () => {
      setView(button.dataset.view);
      els.sidebar?.classList.remove("is-open");
    });
  });
}

function showAuth() {
  els.appView.hidden = true;
  els.authView.hidden = false;
}

async function startApp() {
  els.authView.hidden = true;
  els.appView.hidden = false;
  await loadData();
}

async function loadData(isRefresh = false) {
  if (!state.supabase) return;
  try {
    if (isRefresh) toast("Atualizando dados...");
    const { data: userData, error: userError } = await state.supabase.auth.getUser();
    if (userError) throw userError;
    state.user = userData.user;

    const { data: profile, error: profileError } = await state.supabase
      .from("profiles")
      .select("*")
      .eq("id", state.user.id)
      .maybeSingle();
    if (profileError) throw profileError;
    if (!profile) {
      renderSetupNeeded("Usuário sem perfil", "Crie um perfil na tabela profiles vinculando este usuário ao tenant da Vitorino.");
      return;
    }
    state.profile = profile;

    const [
      tenantResult,
      landingResult,
      leadsResult,
      eventsResult,
      logsResult,
      usersResult
    ] = await Promise.all([
      state.supabase.from("tenants").select("*").eq("id", profile.tenant_id).maybeSingle(),
      state.supabase.from("landing_pages").select("*").eq("tenant_id", profile.tenant_id).eq("slug", state.config.landingSlug).maybeSingle(),
      state.supabase.from("leads").select("*").eq("tenant_id", profile.tenant_id).order("created_at", { ascending: false }).limit(1000),
      state.supabase.from("tracking_events").select("*").eq("tenant_id", profile.tenant_id).order("created_at", { ascending: false }).limit(3000),
      state.supabase.from("change_logs").select("*").eq("tenant_id", profile.tenant_id).order("created_at", { ascending: false }).limit(100),
      state.supabase.from("profiles").select("*").eq("tenant_id", profile.tenant_id).order("created_at", { ascending: false })
    ]);

    throwIfError(tenantResult.error);
    throwIfError(landingResult.error);
    throwIfError(leadsResult.error);
    throwIfError(eventsResult.error);
    throwIfError(logsResult.error);

    state.tenant = tenantResult.data;
    state.landing = landingResult.data;
    state.leads = leadsResult.data || [];
    state.events = eventsResult.data || [];
    state.logs = logsResult.data || [];
    state.users = usersResult.error ? [profile] : usersResult.data || [profile];

    if (!state.landing) {
      renderSetupNeeded("Landing não encontrada", "Rode o arquivo supabase/schema.sql no Supabase para criar a landing padrão.");
      return;
    }

    state.draft = {
      content: structuredClone(state.landing.draft_content || state.landing.content || defaultDraft.content),
      settings: structuredClone(state.landing.draft_settings || state.landing.settings || defaultDraft.settings),
      seo: structuredClone(state.landing.draft_seo || state.landing.seo || defaultDraft.seo),
      integrations: structuredClone(state.landing.draft_integrations || state.landing.integrations || defaultDraft.integrations),
      forms: structuredClone(state.landing.draft_forms || state.landing.forms || defaultDraft.forms)
    };

    await loadScripts();
    updateTopbar();
    render();
    if (isRefresh) toast("Dados atualizados.");
  } catch (error) {
    renderSetupNeeded("Erro ao carregar painel", error.message);
  }
}

async function loadScripts() {
  const { data, error } = await state.supabase
    .from("landing_scripts")
    .select("*")
    .eq("landing_page_id", state.landing.id)
    .maybeSingle();
  state.scripts = error ? null : data;
}

function throwIfError(error) {
  if (error) throw error;
}

function updateTopbar() {
  els.pageName.textContent = state.landing?.name || "Vitorino Doces Finos";
  const published = state.landing?.published_at ? formatDateTime(state.landing.published_at) : "sem publicação";
  els.pageStatus.textContent = `Status: ${state.landing?.status || "rascunho"} · Última publicação: ${published}`;
}

function setView(view) {
  state.view = view;
  document.querySelectorAll("[data-view]").forEach((button) => {
    button.classList.toggle("is-active", button.dataset.view === view);
  });
  render();
}

function render() {
  destroyCharts();
  const renderer = {
    dashboard: renderDashboard,
    leads: renderLeads,
    analytics: renderAnalytics,
    funnel: renderFunnel,
    landing: renderLandingEditor,
    forms: renderForms,
    integrations: renderIntegrations,
    seo: renderSeo,
    scripts: renderScripts,
    settings: renderSettings,
    users: renderUsers,
    history: renderHistory
  }[state.view] || renderDashboard;
  renderer();
}

function renderDashboard() {
  const metrics = getMetrics();
  els.viewRoot.innerHTML = `
    ${viewHeader("Dashboard", "Acompanhe o comportamento da landing, origem das visitas e oportunidades geradas.", periodToolbar())}
    <section class="grid cols-4">
      ${metric("Visitantes", metrics.visitors, "Sessões únicas", "V")}
      ${metric("Visualizações", metrics.pageViews, "Page views registradas", "PV")}
      ${metric("Leads", metrics.leads, `${metrics.newLeads} novos`, "L")}
      ${metric("Conversão", `${metrics.conversionRate}%`, "Leads / visitantes", "%")}
      ${metric("WhatsApp", metrics.whatsappClicks, "Cliques em conversa", "WA")}
      ${metric("CTAs", metrics.ctaClicks, "Cliques em botões", "CTA")}
      ${metric("Telefone", metrics.phoneClicks, "Cliques para ligar", "TEL")}
      ${metric("Campanhas", metrics.campaigns, "UTMs com tráfego", "UTM")}
    </section>
    <section class="grid cols-2" style="margin-top:14px">
      <article class="panel chart-card"><h2>Visitantes por dia</h2><canvas id="chart-visitors"></canvas></article>
      <article class="panel chart-card"><h2>Leads por dia</h2><canvas id="chart-leads"></canvas></article>
      <article class="panel chart-card"><h2>Origem do tráfego</h2><canvas id="chart-sources"></canvas></article>
      <article class="panel chart-card"><h2>Dispositivos</h2><canvas id="chart-devices"></canvas></article>
    </section>
    ${renderCampaignRanking()}
  `;
  bindPeriodToolbar();
  renderDashboardCharts(metrics);
}

function periodToolbar() {
  return `
    <div class="toolbar">
      <select data-period>
        ${[
          ["today", "Hoje"],
          ["yesterday", "Ontem"],
          ["7d", "Últimos 7 dias"],
          ["30d", "Últimos 30 dias"],
          ["month", "Este mês"],
          ["lastMonth", "Mês anterior"],
          ["all", "Todo período"]
        ].map(([value, label]) => `<option value="${value}" ${state.period === value ? "selected" : ""}>${label}</option>`).join("")}
      </select>
    </div>
  `;
}

function bindPeriodToolbar() {
  els.viewRoot.querySelector("[data-period]")?.addEventListener("change", (event) => {
    state.period = event.target.value;
    render();
  });
}

function metric(label, value, note, icon) {
  return `
    <article class="metric-card">
      <span><span>${label}</span><strong>${escapeHtml(String(value))}</strong><small>${escapeHtml(note)}</small></span>
      <b class="metric-icon">${escapeHtml(icon)}</b>
    </article>
  `;
}

function renderDashboardCharts(metrics) {
  makeChart("chart-visitors", "line", {
    labels: metrics.days.labels,
    datasets: [{ label: "Visitantes", data: metrics.days.visitors, borderColor: "#d8b26a", backgroundColor: "rgba(216,178,106,.14)", tension: .35, fill: true }]
  });
  makeChart("chart-leads", "bar", {
    labels: metrics.days.labels,
    datasets: [{ label: "Leads", data: metrics.days.leads, backgroundColor: "#c78655" }]
  });
  makeChart("chart-sources", "doughnut", {
    labels: Object.keys(metrics.sources),
    datasets: [{ data: Object.values(metrics.sources), backgroundColor: ["#d8b26a", "#c78655", "#8ea846", "#6ea8fe", "#cf4d4d", "#8f6be8", "#6f7278"] }]
  });
  makeChart("chart-devices", "doughnut", {
    labels: Object.keys(metrics.devices),
    datasets: [{ data: Object.values(metrics.devices), backgroundColor: ["#c78655", "#d8b26a", "#6ea8fe"] }]
  });
}

function makeChart(id, type, data) {
  const canvas = document.getElementById(id);
  if (!canvas || !window.Chart) return;
  state.charts[id] = new Chart(canvas, {
    type,
    data,
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { labels: { color: "#f8f4ef" } } },
      scales: type === "doughnut" ? {} : {
        x: { ticks: { color: "rgba(248,244,239,.62)" }, grid: { color: "rgba(248,244,239,.08)" } },
        y: { ticks: { color: "rgba(248,244,239,.62)" }, grid: { color: "rgba(248,244,239,.08)" }, beginAtZero: true }
      }
    }
  });
}

function destroyCharts() {
  Object.values(state.charts).forEach((chart) => chart.destroy());
  state.charts = {};
}

function renderCampaignRanking() {
  const metrics = getMetrics();
  const rows = Object.entries(metrics.campaignStats)
    .sort((a, b) => b[1].leads - a[1].leads || b[1].visitors - a[1].visitors)
    .slice(0, 8);
  return `
    <section class="panel" style="margin-top:14px">
      <h2>Campanhas que mais geraram leads</h2>
      ${rows.length ? `<div class="table-shell"><table><thead><tr><th>Campanha</th><th>Visitantes</th><th>Leads</th><th>Conversão</th></tr></thead><tbody>${rows.map(([name, item]) => `
        <tr><td>${escapeHtml(name)}</td><td>${item.visitors}</td><td>${item.leads}</td><td>${pct(item.leads, item.visitors)}%</td></tr>
      `).join("")}</tbody></table></div>` : `<p class="empty-state">Nenhuma campanha com UTM registrada ainda.</p>`}
    </section>
  `;
}

function renderLeads() {
  const rows = filteredLeads();
  els.viewRoot.innerHTML = `
    ${viewHeader("Leads", "Gerencie status, observações e contato pelo WhatsApp.", `
      <div class="toolbar">
        <input type="search" data-lead-search placeholder="Buscar lead" value="${escapeAttr(state.leadSearch)}">
        <select data-lead-status-filter>
          <option value="all">Todos os status</option>
          ${leadStatuses.map((status) => `<option value="${status}" ${state.leadStatus === status ? "selected" : ""}>${status}</option>`).join("")}
        </select>
        <button class="secondary-button" type="button" data-export-leads>Exportar CSV</button>
      </div>
    `)}
    <section class="table-shell">
      ${rows.length ? `
        <table>
          <thead><tr><th>Lead</th><th>Contato</th><th>Origem</th><th>Status</th><th>Observações</th><th>Data</th></tr></thead>
          <tbody>
            ${rows.map((lead) => `
              <tr>
                <td><strong>${escapeHtml(lead.name || "Sem nome")}</strong><br><small>${escapeHtml(lead.company || lead.city || "")}</small></td>
                <td>
                  ${lead.whatsapp || lead.phone ? `<a class="secondary-button" href="https://wa.me/${digits(lead.whatsapp || lead.phone)}" target="_blank" rel="noopener">WhatsApp</a>` : ""}
                  <div class="muted">${escapeHtml(lead.email || "")}</div>
                  <div class="muted">${escapeHtml(lead.phone || "")}</div>
                </td>
                <td>${escapeHtml(lead.source || sourceName(lead) || "Direto")}<br><small>${escapeHtml(lead.utm_campaign || lead.campaign || "")}</small></td>
                <td><select data-lead-status="${lead.id}">${leadStatuses.map((status) => `<option value="${status}" ${lead.status === status ? "selected" : ""}>${status}</option>`).join("")}</select></td>
                <td><textarea data-lead-notes="${lead.id}" rows="3">${escapeHtml(lead.internal_notes || "")}</textarea></td>
                <td>${formatDateTime(lead.created_at)}</td>
              </tr>
            `).join("")}
          </tbody>
        </table>
      ` : `<p class="empty-state">Nenhum lead encontrado para os filtros atuais.</p>`}
    </section>
  `;
  els.viewRoot.querySelector("[data-lead-search]")?.addEventListener("input", (event) => {
    state.leadSearch = event.target.value;
    renderLeads();
  });
  els.viewRoot.querySelector("[data-lead-status-filter]")?.addEventListener("change", (event) => {
    state.leadStatus = event.target.value;
    renderLeads();
  });
  els.viewRoot.querySelector("[data-export-leads]")?.addEventListener("click", () => exportLeads(rows));
  els.viewRoot.querySelectorAll("[data-lead-status]").forEach((select) => {
    select.addEventListener("change", () => updateLead(select.dataset.leadStatus, { status: select.value }));
  });
  els.viewRoot.querySelectorAll("[data-lead-notes]").forEach((field) => {
    field.addEventListener("change", () => updateLead(field.dataset.leadNotes, { internal_notes: field.value }));
  });
}

function filteredLeads() {
  const search = state.leadSearch.toLowerCase().trim();
  return periodFilter(state.leads).filter((lead) => {
    const statusOk = state.leadStatus === "all" || lead.status === state.leadStatus;
    const haystack = [lead.name, lead.phone, lead.whatsapp, lead.email, lead.company, lead.city, lead.utm_campaign, lead.source].join(" ").toLowerCase();
    return statusOk && (!search || haystack.includes(search));
  });
}

async function updateLead(id, patch) {
  const { error } = await state.supabase.from("leads").update(patch).eq("id", id);
  if (error) return toast(error.message);
  const lead = state.leads.find((item) => item.id === id);
  Object.assign(lead || {}, patch);
  await logChange("lead_update", `Lead atualizado: ${lead?.name || id}`, patch);
  toast("Lead atualizado.");
}

function exportLeads(rows) {
  const headers = ["Nome", "Telefone", "WhatsApp", "E-mail", "Data", "Origem", "Campanha", "UTM Source", "UTM Medium", "UTM Campaign", "Dispositivo", "Status", "Observações"];
  const body = rows.map((lead) => [
    lead.name, lead.phone, lead.whatsapp, lead.email, lead.created_at, lead.source, lead.campaign,
    lead.utm_source, lead.utm_medium, lead.utm_campaign, lead.device_type, lead.status, lead.internal_notes
  ]);
  downloadCsv("leads-vitorino.csv", [headers, ...body]);
}

function renderAnalytics() {
  els.viewRoot.innerHTML = `
    ${viewHeader("Analytics", "Ative rastreamentos sem editar código. Eventos internos usam o Supabase e ferramentas externas respeitam a configuração publicada.", saveActions())}
    <section class="grid cols-2">
      ${switchCard("Rastreamento interno", "Registra pageviews, cliques, scroll e visualização de seções no banco.", "settings.tracking.enabled")}
      ${switchCard("Consentimento LGPD", "Quando ativo, scripts de analytics/marketing aguardam consentimento salvo.", "settings.privacy.requireConsent")}
      ${integrationCard("Google Analytics 4", "GA4 Measurement ID", "G-XXXXXXXXXX", "integrations.ga4.enabled", "integrations.ga4.measurementId")}
      ${integrationCard("Google Tag Manager", "GTM Container ID", "GTM-XXXXXXX", "integrations.gtm.enabled", "integrations.gtm.containerId")}
      ${integrationCard("Meta Pixel", "Meta Pixel ID", "000000000000000", "integrations.metaPixel.enabled", "integrations.metaPixel.pixelId")}
      <article class="editor-card">
        <h2>Google Ads</h2>
        ${checkbox("Ativar Google Ads", "integrations.googleAds.enabled")}
        ${field("Conversion ID", "integrations.googleAds.conversionId", "AW-XXXXXXXXX")}
        ${field("Conversion Label", "integrations.googleAds.conversionLabel", "XXXXXXXX")}
        ${selectField("Evento de conversão", "integrations.googleAds.conversionEvent", [
          ["whatsapp_click", "Clique no WhatsApp"],
          ["phone_click", "Clique em telefone"],
          ["lead_submit", "Envio de formulário"],
          ["cta_click", "Clique em CTA"]
        ])}
      </article>
    </section>
  `;
  bindDraftInputs();
  bindSaveButtons();
}

function renderFunnel() {
  const metrics = getMetrics();
  const steps = [
    ["Visitantes", metrics.visitors],
    ["Interações", metrics.interactions],
    ["Cliques no CTA", metrics.ctaClicks + metrics.whatsappClicks],
    ["Formulários iniciados", metrics.formStarts],
    ["Leads", metrics.leads],
    ["Conversões", metrics.conversions]
  ];
  const max = Math.max(1, steps[0][1]);
  els.viewRoot.innerHTML = `
    ${viewHeader("Funil", "Entenda onde visitantes avançam ou saem antes de virar lead.", periodToolbar())}
    <section class="panel funnel">
      ${steps.map(([label, value], index) => {
        const previous = index === 0 ? value : steps[index - 1][1];
        const loss = index === 0 ? "" : `${Math.max(0, 100 - Number(pct(value, previous))).toFixed(1)}% de perda`;
        return `
          <div class="funnel-step">
            <strong>${label}</strong>
            <div class="funnel-bar"><span style="width:${Math.max(3, (value / max) * 100)}%"></span></div>
            <span>${value} <small>${loss}</small></span>
          </div>
        `;
      }).join("")}
      <p class="card-note">Taxa final de conversão: ${metrics.conversionRate}%</p>
    </section>
  `;
  bindPeriodToolbar();
}

function renderLandingEditor() {
  els.viewRoot.innerHTML = `
    ${viewHeader("Landing Page", "Edite textos e imagens mantendo o visual atual da página.", saveActions(true))}
    <section class="grid cols-2">
      <article class="editor-card">
        <h2>Topo</h2>
        ${field("Título principal", "content.hero.title")}
        ${area("Subtítulo", "content.hero.subtitle")}
        ${field("Chamada lateral", "content.hero.signatureTitle")}
        ${area("Texto lateral", "content.hero.signatureText")}
      </article>
      <article class="editor-card">
        <h2>Seções</h2>
        ${field("Título de eventos", "content.sections.events.title")}
        ${area("Texto de eventos", "content.sections.events.copy")}
        ${field("Título da galeria", "content.sections.gallery.title")}
        ${area("Texto da galeria", "content.sections.gallery.copy")}
        ${field("Título final", "content.sections.finalCta.title")}
        ${area("Texto final", "content.sections.finalCta.copy")}
      </article>
    </section>
    <section class="editor-card" style="margin-top:14px">
      <h2>Tipos de eventos</h2>
      <div class="array-list">
        ${arrayItems("content.events", ["title", "copy", "image", "alt"], ["Título", "Descrição", "Imagem", "Alt da imagem"])}
      </div>
    </section>
    <section class="grid cols-2" style="margin-top:14px">
      <article class="editor-card">
        <h2>Depoimentos</h2>
        <div class="array-list">${arrayItems("content.reviews", ["title", "quote", "author"], ["Título", "Texto", "Autor"])}</div>
      </article>
      <article class="editor-card">
        <h2>FAQ</h2>
        <div class="array-list">${arrayItems("content.faq", ["question", "answer"], ["Pergunta", "Resposta"])}</div>
      </article>
    </section>
  `;
  bindDraftInputs();
  bindSaveButtons();
}

function renderForms() {
  const fields = getPath(state.draft, "forms.lead.fields") || [];
  els.viewRoot.innerHTML = `
    ${viewHeader("Formulários", "Prepare campos para capturar leads no banco quando a landing receber formulários.", saveActions())}
    <section class="editor-card">
      <h2>Formulário de orçamento</h2>
      ${field("Título", "forms.lead.title")}
      ${field("Texto do botão", "forms.lead.buttonText")}
      ${area("Mensagem de sucesso", "forms.lead.successMessage")}
      <div class="array-list">
        ${fields.map((item, index) => `
          <div class="array-item">
            <h3>${escapeHtml(item.label || item.name || `Campo ${index + 1}`)}</h3>
            ${field("Nome técnico", `forms.lead.fields.${index}.name`)}
            ${field("Rótulo", `forms.lead.fields.${index}.label`)}
            ${checkbox("Exibir campo", `forms.lead.fields.${index}.enabled`)}
            ${checkbox("Campo obrigatório", `forms.lead.fields.${index}.required`)}
          </div>
        `).join("")}
      </div>
    </section>
  `;
  bindDraftInputs();
  bindSaveButtons();
}

function renderIntegrations() {
  els.viewRoot.innerHTML = `
    ${viewHeader("Integrações", "Configure ferramentas que receberão leads e eventos.", saveActions())}
    <section class="grid cols-2">
      <article class="editor-card">
        <h2>Webhook</h2>
        ${checkbox("Ativar envio de novos leads", "integrations.webhook.enabled")}
        ${field("URL do webhook", "integrations.webhook.url", "https://")}
        ${selectField("Método", "integrations.webhook.method", [["POST", "POST"]])}
        <p class="help-text">Novos leads podem ser enviados em JSON por integração futura via Edge Function ou automação externa.</p>
      </article>
      <article class="editor-card">
        <h2>CRM e automações</h2>
        ${checkbox("Preparar Zapier/Make", "integrations.automation.enabled")}
        ${field("RD Station", "integrations.rdStation.tokenLabel", "Identificação interna")}
        ${field("HubSpot", "integrations.hubspot.portalLabel", "Identificação interna")}
        <p class="help-text">Não insira tokens secretos aqui. Use apenas identificadores públicos ou conectores seguros.</p>
      </article>
    </section>
  `;
  bindDraftInputs();
  bindSaveButtons();
}

function renderSeo() {
  const seo = state.draft.seo || {};
  els.viewRoot.innerHTML = `
    ${viewHeader("SEO", "Controle como a landing aparece no Google e em compartilhamentos.", saveActions())}
    <section class="grid cols-2">
      <article class="editor-card">
        <h2>Metadados</h2>
        ${field("Meta title", "seo.title")}
        ${area("Meta description", "seo.description")}
        ${field("Canonical URL", "seo.canonicalUrl")}
        ${field("Favicon", "seo.favicon")}
        ${field("Imagem Open Graph", "seo.ogImage")}
        ${field("Título Open Graph", "seo.ogTitle")}
        ${area("Descrição Open Graph", "seo.ogDescription")}
        ${field("Alt da imagem social", "seo.ogImageAlt")}
        ${uploadControl("Enviar imagem social", "seo.ogImage")}
      </article>
      <div class="stack">
        <article class="preview-google">
          <div class="url">${escapeHtml(seo.canonicalUrl || "https://vitorinodocesfinos.com.br/")}</div>
          <div class="title">${escapeHtml(seo.title || "Vitorino Doces Finos")}</div>
          <div class="desc">${escapeHtml(seo.description || "")}</div>
        </article>
        <article class="preview-social">
          <img src="${escapeAttr(seo.ogImage || "../assets/img/official-web/hero-mesa-eventos.jpg")}" alt="">
          <div>
            <strong>${escapeHtml(seo.ogTitle || seo.title || "Vitorino Doces Finos")}</strong>
            <p>${escapeHtml(seo.ogDescription || seo.description || "")}</p>
            <small>vitorinodocesfinos.com.br</small>
          </div>
        </article>
      </div>
    </section>
  `;
  bindDraftInputs();
  bindSaveButtons();
  bindUploads();
}

function renderScripts() {
  if (!isAdmin()) {
    els.viewRoot.innerHTML = `${viewHeader("Scripts", "Área restrita a administradores.")}<section class="panel locked">Seu usuário não tem permissão para alterar scripts personalizados.</section>`;
    return;
  }
  const scripts = state.scripts || { enabled: false, head: "", body_start: "", body_end: "" };
  els.viewRoot.innerHTML = `
    ${viewHeader("Scripts", "Use somente scripts revisados. Código externo pode afetar segurança, SEO e desempenho.", `<button class="primary-button" type="button" data-save-scripts>Salvar scripts</button>`)}
    <section class="editor-card">
      <label class="switch-row"><span><strong>Ativar scripts publicados</strong><small>Quando ativo, a landing pode carregar scripts customizados.</small></span><input type="checkbox" data-script-field="enabled" ${scripts.enabled ? "checked" : ""}></label>
      <label>Head<textarea data-script-field="head" rows="8">${escapeHtml(scripts.head || "")}</textarea></label>
      <label>Início do body<textarea data-script-field="body_start" rows="8">${escapeHtml(scripts.body_start || "")}</textarea></label>
      <label>Final do body<textarea data-script-field="body_end" rows="8">${escapeHtml(scripts.body_end || "")}</textarea></label>
    </section>
  `;
  els.viewRoot.querySelector("[data-save-scripts]")?.addEventListener("click", saveScripts);
}

function renderSettings() {
  els.viewRoot.innerHTML = `
    ${viewHeader("Configurações", "Dados públicos usados na landing, WhatsApp e mapa.", saveActions())}
    <section class="grid cols-2">
      <article class="editor-card">
        <h2>Contato</h2>
        ${field("Telefone técnico", "settings.contact.phone")}
        ${field("Telefone exibido", "settings.contact.phoneLabel")}
        ${field("Site", "settings.contact.site")}
        ${field("Instagram", "settings.contact.instagram")}
        ${area("Endereço completo", "settings.contact.address")}
        ${field("Endereço curto", "settings.contact.shortAddress")}
        ${field("Link de rota", "settings.contact.mapUrl")}
        ${field("Mapa incorporado", "settings.contact.mapEmbedUrl")}
      </article>
      <article class="editor-card">
        <h2>WhatsApp</h2>
        ${field("Número com DDI", "settings.whatsapp.number")}
        ${area("Mensagem padrão", "settings.whatsapp.defaultMessage")}
        ${field("Mensagem botão orçamento", "settings.whatsapp.messages.orçamento")}
        ${field("Mensagem botão WhatsApp", "settings.whatsapp.messages.whatsapp")}
      </article>
    </section>
  `;
  bindDraftInputs();
  bindSaveButtons();
}

function renderUsers() {
  els.viewRoot.innerHTML = `
    ${viewHeader("Usuários", "Perfis vinculados ao tenant atual. O usuário precisa existir no Supabase Auth antes de receber perfil.", isAdmin() ? `<button class="primary-button" type="button" data-add-user>Adicionar perfil</button>` : "")}
    <section class="table-shell">
      <table>
        <thead><tr><th>Nome</th><th>User ID</th><th>Papel</th><th>Criado em</th></tr></thead>
        <tbody>
          ${state.users.map((user) => `
            <tr>
              <td>${escapeHtml(user.full_name || "Sem nome")}</td>
              <td><code>${escapeHtml(user.id)}</code></td>
              <td><span class="status-pill">${escapeHtml(user.role)}</span></td>
              <td>${formatDateTime(user.created_at)}</td>
            </tr>
          `).join("")}
        </tbody>
      </table>
    </section>
  `;
  els.viewRoot.querySelector("[data-add-user]")?.addEventListener("click", addUserProfile);
}

function renderHistory() {
  els.viewRoot.innerHTML = `
    ${viewHeader("Histórico", "Registro das alterações feitas no painel.")}
    <section class="table-shell">
      ${state.logs.length ? `<table><thead><tr><th>Data</th><th>Ação</th><th>Resumo</th><th>Usuário</th></tr></thead><tbody>${state.logs.map((log) => `
        <tr><td>${formatDateTime(log.created_at)}</td><td>${escapeHtml(log.action)}</td><td>${escapeHtml(log.summary || "")}</td><td><code>${escapeHtml(log.user_id || "")}</code></td></tr>
      `).join("")}</tbody></table>` : `<p class="empty-state">Nenhuma alteração registrada ainda.</p>`}
    </section>
  `;
}

function viewHeader(title, copy, actions = "") {
  return `
    <header class="view-header">
      <div>
        <h1>${escapeHtml(title)}</h1>
        <p>${escapeHtml(copy)}</p>
      </div>
      ${actions || ""}
    </header>
  `;
}

function renderSetupNeeded(title, message) {
  els.viewRoot.innerHTML = `
    ${viewHeader(title, message)}
    <section class="panel">
      <h2>Checklist de ativação</h2>
      <ol>
        <li>Crie ou reative um projeto gratuito no Supabase.</li>
        <li>Rode o arquivo <code>supabase/schema.sql</code> no SQL Editor.</li>
        <li>Crie um usuário em Authentication.</li>
        <li>Insira o perfil desse usuário na tabela <code>profiles</code> com papel <code>admin</code>.</li>
        <li>Preencha <code>admin/config.js</code> e <code>assets/js/vitorino-public-config.js</code> com URL e anon key públicas.</li>
      </ol>
    </section>
  `;
  els.authView.hidden = true;
  els.appView.hidden = false;
}

function saveActions(includePreview = false) {
  return `
    <div class="toolbar">
      ${includePreview ? `<button class="secondary-button" type="button" data-preview-draft>Preview</button>` : ""}
      <button class="secondary-button" type="button" data-save-draft>Salvar rascunho</button>
      <button class="primary-button" type="button" data-publish>Publicar</button>
    </div>
  `;
}

function integrationCard(title, label, placeholder, enabledPath, valuePath) {
  return `<article class="editor-card"><h2>${title}</h2>${checkbox(`Ativar ${title}`, enabledPath)}${field(label, valuePath, placeholder)}</article>`;
}

function switchCard(title, copy, path) {
  return `<article class="editor-card">${checkbox(title, path)}<p class="help-text">${copy}</p></article>`;
}

function field(labelText, path, placeholder = "") {
  return `
    <label>
      ${escapeHtml(labelText)}
      <input data-bind="${escapeAttr(path)}" value="${escapeAttr(getPath(state.draft, path) ?? "")}" placeholder="${escapeAttr(placeholder)}">
    </label>
  `;
}

function area(labelText, path) {
  return `
    <label>
      ${escapeHtml(labelText)}
      <textarea data-bind="${escapeAttr(path)}">${escapeHtml(getPath(state.draft, path) ?? "")}</textarea>
    </label>
  `;
}

function checkbox(labelText, path) {
  return `
    <label class="switch-row">
      <span><strong>${escapeHtml(labelText)}</strong></span>
      <input type="checkbox" data-bind="${escapeAttr(path)}" ${getPath(state.draft, path) ? "checked" : ""}>
    </label>
  `;
}

function selectField(labelText, path, options) {
  const value = getPath(state.draft, path);
  return `
    <label>
      ${escapeHtml(labelText)}
      <select data-bind="${escapeAttr(path)}">
        ${options.map(([optionValue, optionLabel]) => `<option value="${escapeAttr(optionValue)}" ${value === optionValue ? "selected" : ""}>${escapeHtml(optionLabel)}</option>`).join("")}
      </select>
    </label>
  `;
}

function uploadControl(labelText, targetPath) {
  return `
    <label class="upload-preview">
      <img src="${escapeAttr(getPath(state.draft, targetPath) || "../assets/img/official-web/hero-mesa-eventos.jpg")}" alt="">
      <span>
        ${escapeHtml(labelText)}
        <input type="file" data-upload="${escapeAttr(targetPath)}" accept="image/png,image/jpeg,image/webp,image/gif">
      </span>
    </label>
  `;
}

function arrayItems(path, keys, labels) {
  const items = getPath(state.draft, path) || [];
  return items.map((item, index) => `
    <div class="array-item">
      <h3>${escapeHtml(item.title || item.question || `Item ${index + 1}`)}</h3>
      ${keys.map((key, keyIndex) => key === "copy" || key === "answer" || key === "quote"
        ? area(labels[keyIndex], `${path}.${index}.${key}`)
        : field(labels[keyIndex], `${path}.${index}.${key}`)
      ).join("")}
    </div>
  `).join("");
}

function bindDraftInputs() {
  els.viewRoot.querySelectorAll("[data-bind]").forEach((fieldElement) => {
    fieldElement.addEventListener("input", () => writeBoundValue(fieldElement));
    fieldElement.addEventListener("change", () => writeBoundValue(fieldElement));
  });
}

function writeBoundValue(fieldElement) {
  const value = fieldElement.type === "checkbox" ? fieldElement.checked : fieldElement.value;
  setPath(state.draft, fieldElement.dataset.bind, value);
}

function bindSaveButtons() {
  els.viewRoot.querySelector("[data-save-draft]")?.addEventListener("click", saveDraft);
  els.viewRoot.querySelector("[data-publish]")?.addEventListener("click", publishDraft);
  els.viewRoot.querySelector("[data-preview-draft]")?.addEventListener("click", previewDraft);
}

function bindUploads() {
  els.viewRoot.querySelectorAll("[data-upload]").forEach((input) => {
    input.addEventListener("change", async () => {
      const file = input.files?.[0];
      if (!file) return;
      const safeName = file.name.toLowerCase().replace(/[^a-z0-9.-]+/g, "-");
      const path = `${state.profile.tenant_id}/${Date.now()}-${safeName}`;
      const { error } = await state.supabase.storage.from("landing-assets").upload(path, file, {
        cacheControl: "3600",
        upsert: false,
        contentType: file.type
      });
      if (error) return toast(error.message);
      const { data } = state.supabase.storage.from("landing-assets").getPublicUrl(path);
      setPath(state.draft, input.dataset.upload, data.publicUrl);
      toast("Imagem enviada.");
      render();
    });
  });
}

async function saveDraft() {
  const patch = {
    draft_content: state.draft.content,
    draft_settings: state.draft.settings,
    draft_seo: state.draft.seo,
    draft_integrations: state.draft.integrations,
    draft_forms: state.draft.forms
  };
  const { error } = await state.supabase.from("landing_pages").update(patch).eq("id", state.landing.id);
  if (error) return toast(error.message);
  await logChange("draft_saved", "Rascunho salvo pelo painel", patch);
  toast("Rascunho salvo.");
  await loadData();
}

async function publishDraft() {
  const patch = {
    content: state.draft.content,
    draft_content: state.draft.content,
    settings: state.draft.settings,
    draft_settings: state.draft.settings,
    seo: state.draft.seo,
    draft_seo: state.draft.seo,
    integrations: state.draft.integrations,
    draft_integrations: state.draft.integrations,
    forms: state.draft.forms,
    draft_forms: state.draft.forms,
    status: "published",
    published_at: new Date().toISOString()
  };
  const { error } = await state.supabase.from("landing_pages").update(patch).eq("id", state.landing.id);
  if (error) return toast(error.message);
  await logChange("published", "Landing publicada pelo painel", { published_at: patch.published_at });
  toast("Publicação enviada. A landing atualizará pelo banco.");
  await loadData();
}

function previewDraft() {
  const preview = {
    ...state.landing,
    content: state.draft.content,
    settings: state.draft.settings,
    seo: state.draft.seo,
    integrations: state.draft.integrations,
    forms: state.draft.forms
  };
  localStorage.setItem("vitorino_preview_draft", JSON.stringify(preview));
  window.open("../?preview=draft", "_blank", "noopener");
}

async function saveScripts() {
  const payload = {
    tenant_id: state.profile.tenant_id,
    landing_page_id: state.landing.id,
    enabled: els.viewRoot.querySelector("[data-script-field='enabled']")?.checked || false,
    head: els.viewRoot.querySelector("[data-script-field='head']")?.value || "",
    body_start: els.viewRoot.querySelector("[data-script-field='body_start']")?.value || "",
    body_end: els.viewRoot.querySelector("[data-script-field='body_end']")?.value || ""
  };
  const { error } = await state.supabase.from("landing_scripts").upsert(payload, { onConflict: "landing_page_id" });
  if (error) return toast(error.message);
  await logChange("scripts_saved", "Scripts personalizados atualizados", { enabled: payload.enabled });
  toast("Scripts salvos.");
  await loadData();
}

async function addUserProfile() {
  const userId = prompt("Cole o UUID do usuário criado no Supabase Auth:");
  if (!userId) return;
  const fullName = prompt("Nome do usuário:") || "";
  const role = prompt("Papel: admin ou client", "client") === "admin" ? "admin" : "client";
  const { error } = await state.supabase.from("profiles").insert({
    id: userId.trim(),
    tenant_id: state.profile.tenant_id,
    full_name: fullName,
    role
  });
  if (error) return toast(error.message);
  await logChange("user_profile_created", `Perfil criado para ${fullName || userId}`, { userId, role });
  toast("Perfil criado.");
  await loadData();
}

async function logChange(action, summary, payload = {}) {
  await state.supabase.from("change_logs").insert({
    tenant_id: state.profile.tenant_id,
    landing_page_id: state.landing?.id || null,
    user_id: state.user?.id || null,
    action,
    summary,
    payload
  });
}

function getMetrics() {
  const events = periodFilter(state.events);
  const leads = periodFilter(state.leads);
  const visitorSessions = unique(events.filter((event) => event.event_name === "page_view").map((event) => event.session_id));
  const allSessions = unique(events.map((event) => event.session_id));
  const visitors = Math.max(visitorSessions.length, allSessions.length);
  const pageViews = events.filter((event) => event.event_name === "page_view").length;
  const whatsappClicks = events.filter((event) => event.event_name === "whatsapp_click").length;
  const phoneClicks = events.filter((event) => event.event_name === "phone_click").length;
  const ctaClicks = events.filter((event) => event.event_name === "cta_click").length;
  const interactions = events.filter((event) => event.event_name !== "page_view").length;
  const formStarts = events.filter((event) => event.event_name === "form_start").length;
  const conversions = leads.filter((lead) => lead.status === "Fechado").length;
  const campaigns = unique(events.map((event) => event.utm_campaign).filter(Boolean)).length;
  const sources = countBy(events, sourceName);
  const devices = countBy(events, (event) => event.device_type || "desconhecido");
  const campaignStats = campaignRanking(events, leads);
  return {
    events,
    leads: leads.length,
    newLeads: leads.filter((lead) => lead.status === "Novo").length,
    visitors,
    pageViews,
    whatsappClicks,
    phoneClicks,
    ctaClicks,
    interactions,
    formStarts,
    conversions,
    campaigns,
    conversionRate: pct(leads.length, visitors),
    sources,
    devices,
    campaignStats,
    days: daySeries(events, leads)
  };
}

function periodFilter(items) {
  const [start, end] = periodRange(state.period);
  return items.filter((item) => {
    const date = new Date(item.created_at);
    return (!start || date >= start) && (!end || date < end);
  });
}

function periodRange(period) {
  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  if (period === "today") return [startOfToday, null];
  if (period === "yesterday") {
    const start = new Date(startOfToday);
    start.setDate(start.getDate() - 1);
    return [start, startOfToday];
  }
  if (period === "7d" || period === "30d") {
    const start = new Date(startOfToday);
    start.setDate(start.getDate() - (period === "7d" ? 6 : 29));
    return [start, null];
  }
  if (period === "month") return [new Date(now.getFullYear(), now.getMonth(), 1), null];
  if (period === "lastMonth") return [new Date(now.getFullYear(), now.getMonth() - 1, 1), new Date(now.getFullYear(), now.getMonth(), 1)];
  return [null, null];
}

function daySeries(events, leads) {
  const labels = [];
  const visitors = [];
  const leadCounts = [];
  const days = state.period === "7d" ? 7 : 14;
  for (let index = days - 1; index >= 0; index--) {
    const date = new Date();
    date.setDate(date.getDate() - index);
    const key = isoDay(date);
    labels.push(date.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" }));
    visitors.push(unique(events.filter((event) => isoDay(event.created_at) === key).map((event) => event.session_id)).length);
    leadCounts.push(leads.filter((lead) => isoDay(lead.created_at) === key).length);
  }
  return { labels, visitors, leads: leadCounts };
}

function campaignRanking(events, leads) {
  const rows = {};
  events.forEach((event) => {
    const name = event.utm_campaign || event.campaign || "Sem campanha";
    rows[name] ||= { visitors: new Set(), leads: 0 };
    rows[name].visitors.add(event.session_id);
  });
  leads.forEach((lead) => {
    const name = lead.utm_campaign || lead.campaign || "Sem campanha";
    rows[name] ||= { visitors: new Set(), leads: 0 };
    rows[name].leads += 1;
  });
  return Object.fromEntries(Object.entries(rows).map(([name, row]) => [name, { visitors: row.visitors.size, leads: row.leads }]));
}

function countBy(items, mapper) {
  const result = {};
  items.forEach((item) => {
    const key = mapper(item) || "Outros";
    result[key] = (result[key] || 0) + 1;
  });
  return result;
}

function sourceName(item) {
  const raw = `${item.utm_source || ""} ${item.referrer || ""}`.toLowerCase();
  if (raw.includes("google") && raw.includes("ads")) return "Google Ads";
  if (raw.includes("google")) return "Google";
  if (raw.includes("instagram")) return "Instagram";
  if (raw.includes("facebook") || raw.includes("fb.")) return "Facebook";
  if (raw.includes("tiktok")) return "TikTok";
  if (raw.includes("whatsapp")) return "WhatsApp";
  if (!item.referrer && !item.utm_source) return "Acesso direto";
  return "Outros";
}

function isAdmin() {
  return state.profile?.role === "admin";
}

function getPath(root, path) {
  return path.split(".").reduce((value, key) => value?.[key], root);
}

function setPath(root, path, value) {
  const keys = path.split(".");
  let target = root;
  keys.slice(0, -1).forEach((key, index) => {
    const nextKey = keys[index + 1];
    target[key] ??= /^\d+$/.test(nextKey) ? [] : {};
    target = target[key];
  });
  target[keys.at(-1)] = value;
}

function pct(value, total) {
  if (!total) return "0.0";
  return ((value / total) * 100).toFixed(1);
}

function unique(items) {
  return [...new Set(items.filter(Boolean))];
}

function isoDay(value) {
  return new Date(value).toISOString().slice(0, 10);
}

function digits(value) {
  return String(value || "").replace(/\D+/g, "");
}

function formatDateTime(value) {
  if (!value) return "-";
  return new Date(value).toLocaleString("pt-BR", { dateStyle: "short", timeStyle: "short" });
}

function downloadCsv(filename, rows) {
  const csv = rows.map((row) => row.map((value) => `"${String(value ?? "").replace(/"/g, '""')}"`).join(",")).join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

function escapeHtml(value) {
  return String(value ?? "").replace(/[&<>"']/g, (char) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;"
  }[char]));
}

function escapeAttr(value) {
  return escapeHtml(value).replace(/`/g, "&#096;");
}

function toast(message) {
  els.toast.textContent = message;
  els.toast.classList.add("is-visible");
  clearTimeout(toast.timer);
  toast.timer = setTimeout(() => els.toast.classList.remove("is-visible"), 2800);
}
