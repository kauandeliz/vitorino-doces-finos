(function () {
  const config = window.VITORINO_PUBLIC_CONFIG || {};
  const endpoint = normalizeUrl(config.supabaseUrl);
  const anonKey = config.supabaseAnonKey || "";
  const landingSlug = config.landingSlug || "vitorino-doces-finos";
  const state = {
    landing: null,
    sessionId: getSessionId(),
    utm: readUtm(),
    trackedSections: new Set(),
    scrollMilestones: new Set()
  };

  const preview = readPreview();
  if (preview) {
    state.landing = preview;
    applyLanding(preview);
    return;
  }

  if (!endpoint || !anonKey) {
    return;
  }

  init();

  async function init() {
    try {
      const landing = await fetchLanding();
      if (!landing) return;
      state.landing = landing;
      window.VITORINO_LANDING_STATE = landing;
      applyLanding(landing);
      loadCustomScripts(landing);
      loadMarketingScripts(landing.integrations || {}, landing.settings || {});
      track("page_view", { eventType: "page_view" });
      bindTracking();
      bindSectionTracking();
    } catch (error) {
      console.warn("[Vitorino CMS] Não foi possível carregar configurações públicas.", error);
    }
  }

  function normalizeUrl(url) {
    return String(url || "").trim().replace(/\/+$/, "");
  }

  async function fetchLanding() {
    const query = new URLSearchParams({
      slug: `eq.${landingSlug}`,
      status: "eq.published",
      select: "id,tenant_id,slug,name,content,settings,seo,integrations,forms,published_at",
      limit: "1"
    });
    const response = await fetch(`${endpoint}/rest/v1/landing_pages?${query}`, {
      headers: supabaseHeaders(false)
    });
    if (!response.ok) throw new Error(`Supabase ${response.status}`);
    const rows = await response.json();
    return rows[0] || null;
  }

  function readPreview() {
    if (new URLSearchParams(location.search).get("preview") !== "draft") return null;
    try {
      return JSON.parse(localStorage.getItem("vitorino_preview_draft") || "null");
    } catch {
      return null;
    }
  }

  function supabaseHeaders(write) {
    const headers = {
      apikey: anonKey,
      Authorization: `Bearer ${anonKey}`
    };
    if (write) {
      headers["Content-Type"] = "application/json";
      headers.Prefer = "return=minimal";
    }
    return headers;
  }

  function applyLanding(landing) {
    const content = landing.content || {};
    const settings = landing.settings || {};
    const seo = landing.seo || {};

    applySeo(seo);
    text("h1", content.hero?.title);
    text(".hero-lead", content.hero?.subtitle);
    text(".hero-signature strong", content.hero?.signatureTitle);
    text(".hero-signature", content.hero?.signatureText, true);
    text("#promocoes .section-title", content.sections?.promotions?.title);
    text("#promocoes .section-copy", content.sections?.promotions?.copy);
    text("#eventos .section-title", content.sections?.events?.title);
    text("#eventos .section-copy", content.sections?.events?.copy);
    text("#galeria .section-title", content.sections?.gallery?.title);
    text("#galeria .section-copy", content.sections?.gallery?.copy);
    text("#orcamento .section-title", content.sections?.budget?.title);
    text("#orcamento .section-copy", content.sections?.budget?.copy);
    text("#atendimento .section-title", content.sections?.contact?.title);
    text("#atendimento .section-copy", content.sections?.contact?.copy);
    text("#faq .section-title", content.sections?.faq?.title);
    text("#contato .section-title", content.sections?.finalCta?.title);
    text("#contato .section-copy", content.sections?.finalCta?.copy);

    applyCards("#eventos .product-card", content.events, ({ root, item }) => {
      textIn(root, "h3", item.title);
      textIn(root, "p", item.copy);
      imageIn(root, "img", item.image, item.alt);
    });

    applyCards(".review-grid .review-card", content.reviews, ({ root, item }) => {
      textIn(root, "h3", item.title);
      textIn(root, "p", item.quote);
      textIn(root, "cite", item.author);
    });

    applyFaq(content.faq);
    applyContact(settings.contact || content.contact || {});
    applyWhatsapp(settings.whatsapp || {});
    applyGallery(content.gallery);
  }

  function applySeo(seo) {
    if (seo.title) document.title = seo.title;
    meta("description", seo.description);
    metaProperty("og:title", seo.ogTitle || seo.title);
    metaProperty("og:description", seo.ogDescription || seo.description);
    metaProperty("og:image", seo.ogImage);
    metaProperty("og:image:alt", seo.ogImageAlt);
    metaName("twitter:title", seo.ogTitle || seo.title);
    metaName("twitter:description", seo.ogDescription || seo.description);
    metaName("twitter:image", seo.ogImage);
    attr("link[rel='canonical']", "href", seo.canonicalUrl);
    attr("link[rel='icon'][sizes='32x32']", "href", seo.favicon);
  }

  function applyContact(contact) {
    if (contact.phoneLabel) {
      document.querySelectorAll("a[href^='tel:']").forEach((link) => {
        if (/^\(?\d/.test(link.textContent.trim())) link.textContent = contact.phoneLabel;
      });
    }
    if (contact.phone) {
      document.querySelectorAll("a[href^='tel:']").forEach((link) => {
        link.href = `tel:${digits(contact.phone)}`;
      });
    }
    if (contact.address) {
      const addressItems = [...document.querySelectorAll(".local-list li span")];
      const address = addressItems.find((item) => item.textContent.includes("Endereço"));
      if (address) address.innerHTML = `<strong>Endereço</strong>${escapeHtml(contact.address)}`;
      text(".map-card > p", contact.shortAddress || contact.address);
    }
    if (contact.site) {
      document.querySelectorAll("a[href*='vitorinodocesfinos.com.br']").forEach((link) => {
        if (!link.href.includes("maps")) {
          link.href = contact.site;
          link.textContent = contact.site.replace(/^https?:\/\//, "").replace(/\/$/, "");
        }
      });
    }
    if (contact.instagram) {
      document.querySelectorAll("a[href*='instagram.com']").forEach((link) => {
        link.href = contact.instagram;
      });
    }
    if (contact.mapUrl) {
      document.querySelectorAll("a[href*='google.com/maps']").forEach((link) => {
        link.href = contact.mapUrl;
      });
    }
    if (contact.mapEmbedUrl) {
      attr(".map-frame", "src", contact.mapEmbedUrl);
    }
  }

  function applyWhatsapp(whatsapp) {
    const number = digits(whatsapp.number || "");
    const defaultMessage = whatsapp.defaultMessage || "Olá, gostaria de solicitar um orçamento com a Vitorino Doces Finos.";
    if (!number && !whatsapp.defaultMessage) return;
    const update = () => {
      document.querySelectorAll("a[href*='wa.me']").forEach((link) => {
        const buttonKey = link.dataset.cta || link.textContent.trim().toLowerCase().replace(/\s+/g, "-");
        const message = whatsapp.messages?.[buttonKey] || defaultMessage;
        link.href = `https://wa.me/${number || "554197327887"}?text=${encodeURIComponent(message)}`;
      });
    };
    update();
    document.addEventListener("input", () => setTimeout(update, 0), true);
    document.addEventListener("change", () => setTimeout(update, 0), true);
  }

  function applyGallery(gallery) {
    if (!Array.isArray(gallery)) return;
    applyCards(".gallery-item", gallery, ({ root, item }) => {
      root.dataset.category = item.category || root.dataset.category || "doces";
      root.dataset.full = item.image || root.dataset.full || "";
      root.dataset.caption = item.caption || root.dataset.caption || "";
      imageIn(root, "img", item.image, item.alt || item.caption);
      textIn(root, ".gallery-label", item.label);
    });
  }

  function applyFaq(items) {
    if (!Array.isArray(items)) return;
    const details = [...document.querySelectorAll(".faq-list details")];
    items.slice(0, details.length).forEach((item, index) => {
      textIn(details[index], "summary", item.question);
      textIn(details[index], "p", item.answer);
    });
  }

  function applyCards(selector, items, updater) {
    if (!Array.isArray(items)) return;
    const roots = [...document.querySelectorAll(selector)];
    items.slice(0, roots.length).forEach((item, index) => updater({ root: roots[index], item, index }));
  }

  function text(selector, value, preserveStrong) {
    if (value == null || value === "") return;
    const element = document.querySelector(selector);
    if (!element) return;
    if (preserveStrong) {
      const strong = element.querySelector("strong")?.outerHTML || "";
      const copy = String(value).replace(element.querySelector("strong")?.textContent || "", "").trim();
      element.innerHTML = `${strong}${escapeHtml(copy || value)}`;
      return;
    }
    element.textContent = value;
  }

  function textIn(root, selector, value) {
    if (value == null || value === "") return;
    const element = root.querySelector(selector);
    if (element) element.textContent = value;
  }

  function imageIn(root, selector, src, alt) {
    const image = root.querySelector(selector);
    if (!image) return;
    if (src) image.src = src;
    if (alt) image.alt = alt;
  }

  function attr(selector, name, value) {
    if (!value) return;
    const element = document.querySelector(selector);
    if (element) element.setAttribute(name, value);
  }

  function meta(name, value) {
    metaName(name, value);
  }

  function metaName(name, value) {
    if (!value) return;
    let element = document.querySelector(`meta[name="${CSS.escape(name)}"]`);
    if (!element) {
      element = document.createElement("meta");
      element.setAttribute("name", name);
      document.head.appendChild(element);
    }
    element.setAttribute("content", value);
  }

  function metaProperty(property, value) {
    if (!value) return;
    let element = document.querySelector(`meta[property="${CSS.escape(property)}"]`);
    if (!element) {
      element = document.createElement("meta");
      element.setAttribute("property", property);
      document.head.appendChild(element);
    }
    element.setAttribute("content", value);
  }

  function loadMarketingScripts(integrations, settings) {
    if (!hasConsent(settings)) return;
    const ga4 = integrations.ga4 || {};
    const gtm = integrations.gtm || {};
    const metaPixel = integrations.metaPixel || {};
    const googleAds = integrations.googleAds || {};
    if (ga4.enabled && ga4.measurementId) loadGa4(ga4.measurementId);
    if (gtm.enabled && gtm.containerId) loadGtm(gtm.containerId);
    if (metaPixel.enabled && metaPixel.pixelId) loadMetaPixel(metaPixel.pixelId);
    if (googleAds.enabled && googleAds.conversionId) loadGa4(googleAds.conversionId);
  }

  async function loadCustomScripts(landing) {
    if (!landing?.id) return;
    try {
      const query = new URLSearchParams({
        landing_page_id: `eq.${landing.id}`,
        enabled: "eq.true",
        select: "head,body_start,body_end",
        limit: "1"
      });
      const response = await fetch(`${endpoint}/rest/v1/landing_scripts?${query}`, {
        headers: supabaseHeaders(false)
      });
      if (!response.ok) return;
      const rows = await response.json();
      const scripts = rows[0];
      if (!scripts) return;
      injectNodes(document.head, scripts.head);
      injectNodes(document.body, scripts.body_start, "prepend");
      injectNodes(document.body, scripts.body_end);
    } catch (error) {
      console.warn("[Vitorino CMS] Scripts personalizados não foram carregados.", error);
    }
  }

  function injectNodes(target, html, mode = "append") {
    if (!target || !String(html || "").trim()) return;
    const template = document.createElement("template");
    template.innerHTML = html;
    [...template.content.childNodes].forEach((node) => {
      const nextNode = node.nodeName.toLowerCase() === "script" ? executableScript(node) : node.cloneNode(true);
      if (mode === "prepend") target.prepend(nextNode);
      else target.append(nextNode);
    });
  }

  function executableScript(node) {
    const script = document.createElement("script");
    [...node.attributes].forEach((attr) => script.setAttribute(attr.name, attr.value));
    script.textContent = node.textContent;
    return script;
  }

  function hasConsent(settings) {
    const privacy = settings.privacy || {};
    const required = Boolean(config.requireConsent || privacy.requireConsent);
    if (!required) return true;
    try {
      const consent = JSON.parse(localStorage.getItem("vitorino_cookie_consent") || "{}");
      return consent.analytics === true || consent.marketing === true;
    } catch {
      return false;
    }
  }

  function loadGa4(id) {
    if (document.querySelector(`script[src*="${id}"]`)) return;
    window.dataLayer = window.dataLayer || [];
    window.gtag = window.gtag || function () { window.dataLayer.push(arguments); };
    window.gtag("js", new Date());
    window.gtag("config", id);
    const script = document.createElement("script");
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(id)}`;
    document.head.appendChild(script);
  }

  function loadGtm(id) {
    if (document.querySelector(`script[src*="gtm.js?id=${id}"]`)) return;
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({ "gtm.start": Date.now(), event: "gtm.js" });
    const script = document.createElement("script");
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtm.js?id=${encodeURIComponent(id)}`;
    document.head.appendChild(script);
  }

  function loadMetaPixel(id) {
    if (window.fbq) return;
    window.fbq = function () { window.fbq.callMethod ? window.fbq.callMethod.apply(window.fbq, arguments) : window.fbq.queue.push(arguments); };
    window.fbq.queue = [];
    window.fbq.loaded = true;
    window.fbq.version = "2.0";
    window.fbq("init", id);
    window.fbq("track", "PageView");
    const script = document.createElement("script");
    script.async = true;
    script.src = "https://connect.facebook.net/en_US/fbevents.js";
    document.head.appendChild(script);
  }

  function bindTracking() {
    document.addEventListener("click", (event) => {
      const link = event.target.closest("a, button");
      if (!link) return;
      const href = link.href || "";
      const label = link.textContent.trim().replace(/\s+/g, " ").slice(0, 120);
      let name = "click";
      if (href.includes("wa.me")) name = "whatsapp_click";
      if (href.startsWith("tel:")) name = "phone_click";
      if (href.startsWith("mailto:")) name = "email_click";
      if (href.includes("instagram.com")) name = "social_click";
      if (link.classList.contains("cta") || link.classList.contains("ghost-cta")) name = name === "click" ? "cta_click" : name;
      track(name, { eventType: "click", elementLabel: label, elementTarget: href || link.dataset.filter || "" });
    }, { capture: true });

    window.addEventListener("scroll", throttle(() => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      if (max <= 0) return;
      const progress = Math.round((window.scrollY / max) * 100);
      [25, 50, 75, 90].forEach((milestone) => {
        if (progress >= milestone && !state.scrollMilestones.has(milestone)) {
          state.scrollMilestones.add(milestone);
          track("scroll_depth", { eventType: "scroll", metadata: { milestone } });
        }
      });
    }, 600), { passive: true });
  }

  function bindSectionTracking() {
    if (!("IntersectionObserver" in window)) return;
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting || entry.intersectionRatio < 0.5 || !entry.target.id) return;
        if (state.trackedSections.has(entry.target.id)) return;
        state.trackedSections.add(entry.target.id);
        track("section_view", { eventType: "view", elementTarget: `#${entry.target.id}` });
      });
    }, { threshold: [0.5] });
    document.querySelectorAll("section[id]").forEach((section) => observer.observe(section));
  }

  function track(eventName, details = {}) {
    const enabled = Boolean(config.trackingEnabled || state.landing?.settings?.tracking?.enabled);
    if (!enabled || !state.landing?.id || !hasConsent(state.landing.settings || {})) return;
    const payload = {
      tenant_id: state.landing.tenant_id,
      landing_page_id: state.landing.id,
      session_id: state.sessionId,
      event_name: eventName,
      event_type: details.eventType || eventName,
      page: document.title,
      path: location.pathname,
      url: location.href,
      referrer: document.referrer || null,
      utm_source: state.utm.utm_source,
      utm_medium: state.utm.utm_medium,
      utm_campaign: state.utm.utm_campaign,
      utm_content: state.utm.utm_content,
      utm_term: state.utm.utm_term,
      element_label: details.elementLabel || null,
      element_target: details.elementTarget || null,
      device_type: deviceType(),
      browser: navigator.userAgent,
      metadata: details.metadata || {}
    };
    fetch(`${endpoint}/rest/v1/tracking_events`, {
      method: "POST",
      headers: supabaseHeaders(true),
      body: JSON.stringify(payload),
      keepalive: true
    }).catch(() => {});
  }

  function getSessionId() {
    const key = "vitorino_session_id";
    let value = sessionStorage.getItem(key);
    if (!value) {
      value = crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(16).slice(2)}`;
      sessionStorage.setItem(key, value);
    }
    return value;
  }

  function readUtm() {
    const params = new URLSearchParams(location.search);
    return {
      utm_source: params.get("utm_source"),
      utm_medium: params.get("utm_medium"),
      utm_campaign: params.get("utm_campaign"),
      utm_content: params.get("utm_content"),
      utm_term: params.get("utm_term")
    };
  }

  function deviceType() {
    const width = window.innerWidth;
    if (width < 700) return "mobile";
    if (width < 1080) return "tablet";
    return "desktop";
  }

  function throttle(fn, wait) {
    let timer = 0;
    return (...args) => {
      if (timer) return;
      timer = window.setTimeout(() => {
        timer = 0;
        fn(...args);
      }, wait);
    };
  }

  function digits(value) {
    return String(value || "").replace(/\D+/g, "");
  }

  function escapeHtml(value) {
    return String(value || "").replace(/[&<>"']/g, (char) => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#039;"
    }[char]));
  }
})();
