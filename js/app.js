import {
  SITE_CONFIG,
  SELECTED_WORKS,
  BRAND_CAMPAIGNS,
  SERVICES,
  WORKFLOW_STEPS,
  PACKAGES,
  CLIENTS,
  TESTIMONIALS,
  FAQS,
  TECH_ARSENAL
} from "./data.js";
import { I18N } from "./i18n.js";

const isLiveDomain =
  window.location.hostname === "eslamtgd.top" ||
  window.location.hostname === "www.eslamtgd.top";

function resolveMediaUrl(itemPath, fallbackUrl) {
  // Local custom generated asset always loads from local assets/
  if (itemPath === "assets/ad-farghaly.jpg") {
    return itemPath;
  }
  return isLiveDomain ? itemPath : (fallbackUrl || `https://eslamtgd.top/${itemPath}`);
}

const state = {
  lang: localStorage.getItem("eslamtgd_lang") || "ar",
  theme: localStorage.getItem("eslamtgd_theme") || "dark",
  vaultFilter: "all",
  vaultQuery: "",
  clientFilter: "all",
  reelPlaying: true,
  reelIndex: 0,
  activeModalItem: null
};

let reelInterval = null;

/* ==========================================================================
   INITIALIZATION
   ========================================================================== */
document.addEventListener("DOMContentLoaded", () => {
  const urlLang = new URLSearchParams(window.location.search).get("lang");
  if (urlLang === "ar" || urlLang === "en") {
    state.lang = urlLang;
  }

  applyTheme(state.theme);
  bindGlobalEvents();
  applyLanguage(state.lang);
  startReelAutoplay();
  updateScrollProgress();
});

/* ==========================================================================
   THEME & LANGUAGE ENGINE
   ========================================================================== */
function applyTheme(theme) {
  state.theme = theme;
  document.documentElement.setAttribute("data-theme", theme);
  localStorage.setItem("eslamtgd_theme", theme);
  const iconEl = document.getElementById("theme-icon");
  if (iconEl) {
    iconEl.textContent = theme === "dark" ? "☀" : "☾";
  }
}

function applyLanguage(lang) {
  state.lang = lang;
  localStorage.setItem("eslamtgd_lang", lang);
  const dict = I18N[lang];
  const isAr = lang === "ar";

  document.documentElement.lang = lang;
  document.documentElement.dir = isAr ? "rtl" : "ltr";
  document.title = dict.metaTitle;

  const metaDesc = document.querySelector('meta[name="description"]');
  if (metaDesc) metaDesc.setAttribute("content", dict.metaDesc);

  // Update active language buttons
  document.querySelectorAll("[data-lang-switch]").forEach((btn) => {
    const active = btn.dataset.langSwitch === lang;
    btn.classList.toggle("active", active);
    btn.setAttribute("aria-pressed", String(active));
  });

  // Translate static [data-i18n] nodes
  document.querySelectorAll("[data-i18n]").forEach((el) => {
    const key = el.dataset.i18n;
    if (dict[key] !== undefined) {
      el.textContent = dict[key];
    }
  });

  // Translate placeholders
  document.querySelectorAll("[data-i18n-placeholder]").forEach((el) => {
    const key = el.dataset.i18nPlaceholder;
    if (dict[key] !== undefined) {
      el.setAttribute("placeholder", dict[key]);
    }
  });

  // Translate aria-labels
  document.querySelectorAll("[data-i18n-aria]").forEach((el) => {
    const key = el.dataset.i18nAria;
    if (dict[key] !== undefined) {
      el.setAttribute("aria-label", dict[key]);
    }
  });

  // Portrait image source
  const portraitImg = document.getElementById("hero-portrait-img");
  if (portraitImg) {
    portraitImg.src = isLiveDomain
      ? "assets/portrait.jpg"
      : "https://eslamtgd.top/assets/portrait.jpg";
  }

  // Transformation before/after images (Real VERTEX Desert campaign frame)
  const afterImg = document.getElementById("compare-after-img");
  const beforeImg = document.getElementById("compare-before-img");
  const showcaseSrc = isLiveDomain
    ? "assets/ad-11.jpg"
    : "https://eslamtgd.top/assets/ad-11.jpg";
  if (afterImg) afterImg.src = showcaseSrc;
  if (beforeImg) beforeImg.src = showcaseSrc;

  // Render dynamic sections
  renderDisciplines(dict);
  renderTicker(dict);
  renderTransformationLists(dict);
  renderVault();
  renderCampaignReel();
  renderServices();
  renderClients();
  renderWorkflow();
  renderTechArsenal();
  renderPackages(dict);
  renderTestimonials();
  renderFaqs();
  renderSocials();
  updateDirectWhatsAppLinks(dict);
  updateBriefPreview();
  updateReelPauseA11y();
}

/* ==========================================================================
   RENDERERS
   ========================================================================== */
function renderDisciplines(dict) {
  const wrap = document.getElementById("hero-disciplines");
  if (!wrap) return;
  wrap.innerHTML = dict.heroDisciplines
    .map((d) => `<div class="discipline-chip"><span>✳</span> ${d}</div>`)
    .join("");
}

function renderTicker(dict) {
  const track = document.getElementById("ticker-track");
  if (!track) return;
  const repeated = [...dict.tickerItems, ...dict.tickerItems, ...dict.tickerItems];
  track.innerHTML = repeated
    .map(
      (txt) =>
        `<span class="ticker-item">${txt} <span class="ticker-star">✳</span></span>`
    )
    .join("");
}

function renderTransformationLists(dict) {
  const beforeList = document.getElementById("before-card-list");
  const afterList = document.getElementById("after-card-list");
  if (beforeList) {
    beforeList.innerHTML = dict.beforeCardList.map((i) => `<li>${i}</li>`).join("");
  }
  if (afterList) {
    afterList.innerHTML = dict.afterCardList.map((i) => `<li>${i}</li>`).join("");
  }
}

function getAllVaultItems() {
  const films = SELECTED_WORKS.map((w) => ({
    ...w,
    sourceType: "film"
  }));
  const ads = BRAND_CAMPAIGNS.map((a, idx) => ({
    id: a.id,
    index: String(idx + 7).padStart(2, "0"),
    category: "ads",
    platform: a.platform,
    platformLabelAr: a.platformLabelAr,
    platformLabelEn: a.platformLabelEn,
    aspect: "vertical",
    duration: "00:35",
    viewsBadgeAr: a.clientAr,
    viewsBadgeEn: a.clientEn,
    image: a.image,
    fallbackUrl: a.fallbackUrl,
    url: a.url,
    youtubeId: null,
    titleAr: a.titleAr,
    titleEn: a.titleEn,
    descAr: a.descAr,
    descEn: a.descEn,
    tagsAr: [a.clientAr, a.marketAr, "إعلان AI"],
    tagsEn: [a.clientEn, a.marketEn, "AI Commercial"],
    sourceType: "ad"
  }));
  return [...films, ...ads];
}

function renderVault() {
  const grid = document.getElementById("vault-grid");
  if (!grid) return;
  const isAr = state.lang === "ar";
  const q = state.vaultQuery.trim().toLowerCase();

  const items = getAllVaultItems().filter((item) => {
    if (state.vaultFilter === "films" && item.category !== "films") return false;
    if (state.vaultFilter === "ads" && item.category !== "ads") return false;
    if (
      ["youtube", "tiktok", "instagram"].includes(state.vaultFilter) &&
      item.platform !== state.vaultFilter
    ) {
      return false;
    }
    if (q) {
      const hay = [
        item.titleAr,
        item.titleEn,
        item.descAr,
        item.descEn,
        ...(item.tagsAr || []),
        ...(item.tagsEn || [])
      ]
        .join(" ")
        .toLowerCase();
      return hay.includes(q);
    }
    return true;
  });

  grid.innerHTML = items
    .map((item) => {
      const imgSrc = resolveMediaUrl(item.image, item.fallbackUrl);
      const title = isAr ? item.titleAr : item.titleEn;
      const desc = isAr ? item.descAr : item.descEn;
      const platform = isAr ? item.platformLabelAr : item.platformLabelEn;
      const badge = isAr ? item.viewsBadgeAr : item.viewsBadgeEn;
      const tags = isAr ? item.tagsAr : item.tagsEn;

      return `
        <article class="work-card" data-aspect="${item.aspect}" data-open-item="${item.id}" tabindex="0" role="button" aria-label="${title}">
          <div class="work-media">
            <div class="work-media-blur" style="background-image:url('${imgSrc}')"></div>
            <img class="work-media-img" src="${imgSrc}" alt="${title}" loading="lazy" onerror="this.onerror=null;this.src='${item.fallbackUrl || imgSrc}'" />
            <div class="work-badges-top">
              <span class="platform-pill">${item.index} · ${platform}</span>
              <span class="highlight-pill">${badge}</span>
            </div>
            <div class="work-play-btn" aria-hidden="true">▶</div>
          </div>
          <div class="work-body">
            <div class="work-meta-row">
              <span>${item.youtubeId ? (isAr ? "تشغيل مباشر داخل الموقع" : "In-Site Cinema Stream") : (isAr ? "معاينة سينمائية" : "Cinema Preview")}</span>
              <span>${item.duration}</span>
            </div>
            <h3 class="work-title">${title}</h3>
            <p class="work-desc">${desc}</p>
            <div class="work-tags">
              ${tags.map((t) => `<span class="work-tag">${t}</span>`).join("")}
            </div>
          </div>
        </article>
      `;
    })
    .join("");
}

function getFilteredCampaigns() {
  if (state.clientFilter === "all") return BRAND_CAMPAIGNS;
  return BRAND_CAMPAIGNS.filter((c) => c.clientKey === state.clientFilter);
}

function renderCampaignReel() {
  const track = document.getElementById("campaigns-track");
  if (!track) return;
  const isAr = state.lang === "ar";
  const list = getFilteredCampaigns();

  track.innerHTML = list
    .map((ad, idx) => {
      const imgSrc = resolveMediaUrl(ad.image, ad.fallbackUrl);
      const title = isAr ? ad.titleAr : ad.titleEn;
      const client = isAr ? `${ad.clientAr} · ${ad.marketAr}` : `${ad.clientEn} · ${ad.marketEn}`;
      const desc = isAr ? ad.descAr : ad.descEn;
      const platform = isAr ? ad.platformLabelAr : ad.platformLabelEn;
      const num = String(idx + 1).padStart(2, "0");

      return `
        <article class="campaign-card" data-open-item="${ad.id}" tabindex="0" role="button" aria-label="${title}">
          <div class="campaign-poster">
            <img src="${imgSrc}" alt="${title}" loading="lazy" onerror="this.onerror=null;this.src='${ad.fallbackUrl}'" />
            <div class="campaign-poster-overlay">
              <div class="campaign-top-row">
                <span class="platform-pill">${num} · ${platform}</span>
              </div>
              <div class="campaign-play-single" aria-hidden="true">▶</div>
              <div class="campaign-bottom-info">
                <div class="campaign-client">${client}</div>
                <h3 class="campaign-title">${title}</h3>
                <p class="campaign-desc">${desc}</p>
              </div>
            </div>
          </div>
        </article>
      `;
    })
    .join("");

  state.reelIndex = 0;
  updateReelCounter(list.length);
}

function updateReelCounter(totalCount) {
  const total = totalCount || getFilteredCampaigns().length || 1;
  const current = Math.min(state.reelIndex + 1, total);
  const counterEl = document.getElementById("reel-counter");
  const fillEl = document.getElementById("reel-progress-fill");
  if (counterEl) {
    counterEl.textContent = `${String(current).padStart(2, "0")} / ${String(total).padStart(2, "0")}`;
  }
  if (fillEl) {
    fillEl.style.width = `${Math.max(12, (current / total) * 100)}%`;
  }
}

function renderServices() {
  const grid = document.getElementById("services-grid");
  if (!grid) return;
  const isAr = state.lang === "ar";

  grid.innerHTML = SERVICES.map((s) => {
    const title = isAr ? s.titleAr : s.titleEn;
    const desc = isAr ? s.descAr : s.descEn;
    const list = isAr ? s.deliverablesAr : s.deliverablesEn;
    return `
      <article class="service-card">
        <div class="service-top">
          <span class="service-num">${s.num}</span>
          <div class="service-icon" aria-hidden="true">${s.icon}</div>
        </div>
        <div class="service-code">${s.code}</div>
        <h3 class="service-title">${title}</h3>
        <p class="service-desc">${desc}</p>
        <div class="service-deliverables">
          ${list.map((d) => `<span>${d}</span>`).join("")}
        </div>
      </article>
    `;
  }).join("");
}

function renderClients() {
  const grid = document.getElementById("clients-grid");
  if (!grid) return;
  const isAr = state.lang === "ar";
  grid.innerHTML = CLIENTS.map(
    (c) => `
      <div class="client-tile">
        <span class="client-region">${isAr ? c.regionAr : c.regionEn} · ${isAr ? c.countAr : c.countEn}</span>
        <strong class="client-name">${isAr ? c.nameAr : c.nameEn}</strong>
        <span class="client-sector">${isAr ? c.sectorAr : c.sectorEn}</span>
      </div>
    `
  ).join("");
}

function renderWorkflow() {
  const grid = document.getElementById("workflow-grid");
  if (!grid) return;
  const isAr = state.lang === "ar";
  grid.innerHTML = WORKFLOW_STEPS.map(
    (w) => `
      <article class="workflow-step">
        <div class="workflow-top">
          <span class="workflow-num">${w.step}</span>
          <span class="workflow-day">${isAr ? w.durationAr : w.durationEn}</span>
        </div>
        <h3>${isAr ? w.titleAr : w.titleEn}</h3>
        <p>${isAr ? w.descAr : w.descEn}</p>
      </article>
    `
  ).join("");
}

function renderTechArsenal() {
  const wrap = document.getElementById("arsenal-bar");
  if (!wrap) return;
  wrap.innerHTML = TECH_ARSENAL.map(
    (item) => `<span class="arsenal-chip">✦ ${item}</span>`
  ).join("");
}

function renderPackages(dict) {
  const grid = document.getElementById("packages-grid");
  if (!grid) return;
  const isAr = state.lang === "ar";

  grid.innerHTML = PACKAGES.map((p) => {
    const name = isAr ? p.nameAr : p.nameEn;
    const sub = isAr ? p.subtitleAr : p.subtitleEn;
    const badge = isAr ? p.badgeAr : p.badgeEn;
    const turnaround = isAr ? `⏱ مدة التنفيذ: ${p.durationAr}` : `⏱ Turnaround: ${p.durationEn}`;
    const features = isAr ? p.featuresAr : p.featuresEn;

    return `
      <article class="package-card ${p.featured ? "featured" : ""}">
        <span class="package-badge">${badge}</span>
        <h3 class="package-name">${name}</h3>
        <p class="package-sub">${sub}</p>
        <div class="package-turnaround">${turnaround}</div>
        <ul class="package-features">
          ${features.map((f) => `<li>${f}</li>`).join("")}
        </ul>
        <button type="button" class="btn ${p.featured ? "btn-primary" : "btn-outline"}" data-select-package="${p.id}">
          ${dict.selectPackageBtn}
        </button>
      </article>
    `;
  }).join("");
}

function renderHubCategories(dict) {
  const grid = document.getElementById("hub-categories-grid");
  if (!grid) return;
  const isAr = state.lang === "ar";

  grid.innerHTML = HUB_CATEGORIES.map((cat) => {
    const name = isAr ? cat.nameAr : cat.nameEn;
    const desc = isAr ? cat.descAr : cat.descEn;
    const badge = isAr ? cat.badgeAr : cat.badgeEn;
    const count = isAr ? cat.countAr : cat.countEn;
    return `
      <a href="hub.html?cat=${cat.id}" class="hub-cat-card">
        <div class="hub-cat-top">
          <div class="hub-cat-icon" aria-hidden="true">${cat.icon}</div>
          <span class="hub-cat-badge">${badge}</span>
        </div>
        <h3 class="hub-cat-title">${name}</h3>
        <p class="hub-cat-desc">${desc}</p>
        <div class="hub-cat-footer">
          <span>${count}</span>
          <span>${dict.hubExploreCat}</span>
        </div>
      </a>
    `;
  }).join("");
}

function renderTestimonials() {
  const grid = document.getElementById("testimonials-grid");
  if (!grid) return;
  const isAr = state.lang === "ar";
  grid.innerHTML = TESTIMONIALS.map(
    (t) => `
      <article class="testimonial-card">
        <div>
          <div class="testimonial-stars" aria-label="5 stars">★★★★★</div>
          <p class="testimonial-quote" style="margin-top:12px">“${isAr ? t.quoteAr : t.quoteEn}”</p>
        </div>
        <div class="testimonial-author">
          <strong>${isAr ? t.authorAr : t.authorEn}</strong>
          <span>${isAr ? t.roleAr : t.roleEn}</span>
        </div>
      </article>
    `
  ).join("");
}

function renderFaqs() {
  const wrap = document.getElementById("faq-list");
  if (!wrap) return;
  const isAr = state.lang === "ar";
  wrap.innerHTML = FAQS.map(
    (f, idx) => `
      <div class="faq-item ${idx === 0 ? "open" : ""}">
        <button type="button" class="faq-trigger" aria-expanded="${idx === 0 ? "true" : "false"}">
          <span>${isAr ? f.qAr : f.qEn}</span>
          <span class="faq-icon" aria-hidden="true">+</span>
        </button>
        <div class="faq-answer">${isAr ? f.aAr : f.aEn}</div>
      </div>
    `
  ).join("");
}

function renderSocials() {
  const grid = document.getElementById("social-grid");
  if (!grid) return;
  const isAr = state.lang === "ar";
  grid.innerHTML = SITE_CONFIG.socials
    .map(
      (s) => `
      <a class="social-card" href="${s.url}" target="_blank" rel="noopener noreferrer">
        <div class="social-top">
          <span>${isAr ? s.nameAr : s.nameEn}</span>
          <span aria-hidden="true">↗</span>
        </div>
        <div class="social-count">${s.count}</div>
        <div class="social-unit">${isAr ? s.unitAr : s.unitEn} · ${s.handle}</div>
      </a>
    `
    )
    .join("");
}

function updateDirectWhatsAppLinks(dict) {
  const encoded = encodeURIComponent(dict.whatsappDefaultMsg);
  const href = `https://wa.me/${SITE_CONFIG.phone}?text=${encoded}`;
  document.querySelectorAll("[data-direct-wa]").forEach((a) => {
    a.setAttribute("href", href);
  });
}

/* ==========================================================================
   INTERACTIVE BRIEF BUILDER
   ========================================================================== */
function buildBriefText() {
  const isAr = state.lang === "ar";
  const typeSel = document.getElementById("brief-type");
  const countSel = document.getElementById("brief-count");
  const formatSel = document.getElementById("brief-format");
  const dialectSel = document.getElementById("brief-dialect");
  const brandInp = document.getElementById("brief-brand");
  const notesInp = document.getElementById("brief-notes");

  if (!typeSel) return "";

  const typeTxt = typeSel.options[typeSel.selectedIndex]?.text || "";
  const countTxt = countSel.options[countSel.selectedIndex]?.text || "";
  const formatTxt = formatSel.options[formatSel.selectedIndex]?.text || "";
  const dialectTxt = dialectSel.options[dialectSel.selectedIndex]?.text || "";
  const brand = brandInp.value.trim();
  const notes = notesInp.value.trim();

  if (isAr) {
    const lines = [
      "أهلاً يا إسلام، حابب أبدأ مشروع فيديو بالذكاء الاصطناعي بهذه التفاصيل:",
      `• نوع المشروع: ${typeTxt}`,
      `• العدد المطلوب: ${countTxt}`,
      `• المقاسات: ${formatTxt}`,
      `• الصوت / اللهجة: ${dialectTxt}`
    ];
    if (brand) lines.push(`• اسم البراند: ${brand}`);
    if (notes) lines.push(`• فكرة المشروع: ${notes}`);
    return lines.join("\n");
  } else {
    const lines = [
      "Hi Eslam! I'd love to commission an AI video project with the following specs:",
      `• Production Type: ${typeTxt}`,
      `• Volume: ${countTxt}`,
      `• Aspect Ratios: ${formatTxt}`,
      `• Voiceover / Audio: ${dialectTxt}`
    ];
    if (brand) lines.push(`• Brand Name: ${brand}`);
    if (notes) lines.push(`• Concept / Goal: ${notes}`);
    return lines.join("\n");
  }
}

function updateBriefPreview() {
  const box = document.getElementById("brief-live-box");
  const waBtn = document.getElementById("brief-wa-btn");
  const emailBtn = document.getElementById("brief-email-btn");
  if (!box) return;

  const text = buildBriefText();
  box.textContent = text;

  if (waBtn) {
    waBtn.href = `https://wa.me/${SITE_CONFIG.phone}?text=${encodeURIComponent(text)}`;
  }
  if (emailBtn) {
    const subject =
      state.lang === "ar"
        ? "طلب مشروع فيديو بالذكاء الاصطناعي — eslamtgd"
        : "AI Video Production Inquiry — eslamtgd";
    emailBtn.href = `mailto:${SITE_CONFIG.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(text)}`;
  }
}

/* ==========================================================================
   IN-SITE CINEMA THEATRE MODAL
   ========================================================================== */
function openCinemaModal(itemId) {
  const item = getAllVaultItems().find((i) => i.id === itemId);
  if (!item) return;

  state.activeModalItem = item;
  const isAr = state.lang === "ar";
  const dict = I18N[state.lang];
  const modal = document.getElementById("cinema-modal");
  const stage = document.getElementById("cinema-stage");
  const titleEl = document.getElementById("cinema-title");
  const descEl = document.getElementById("cinema-desc");
  const platformLink = document.getElementById("cinema-platform-link");
  const similarBtn = document.getElementById("cinema-similar-btn");

  const title = isAr ? item.titleAr : item.titleEn;
  const desc = isAr ? item.descAr : item.descEn;
  const imgSrc = resolveMediaUrl(item.image, item.fallbackUrl);

  titleEl.textContent = title;
  descEl.textContent = desc;
  platformLink.href = item.url;

  const similarMsg = isAr
    ? `أهلاً يا إسلام، أعجبني عمل "${item.titleAr}" وحابب أنفذ فيديو بنفس المستوى لبراند خاص بي.`
    : `Hi Eslam! I loved your piece "${item.titleEn}" and would like to create a similar AI video for my brand.`;
  similarBtn.href = `https://wa.me/${SITE_CONFIG.phone}?text=${encodeURIComponent(similarMsg)}`;

  if (item.youtubeId) {
    stage.innerHTML = `
      <iframe
        src="https://www.youtube-nocookie.com/embed/${item.youtubeId}?autoplay=1&rel=0"
        title="${title}"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowfullscreen
      ></iframe>
    `;
  } else {
    stage.innerHTML = `
      <div class="cinema-poster-preview">
        <div class="work-media-blur" style="background-image:url('${imgSrc}')"></div>
        <img src="${imgSrc}" alt="${title}" onerror="this.onerror=null;this.src='${item.fallbackUrl || imgSrc}'" />
      </div>
    `;
    descEl.textContent = `${desc} — ${dict.modalExternalHint}`;
  }

  modal.classList.add("open");
  modal.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
}

function closeCinemaModal() {
  const modal = document.getElementById("cinema-modal");
  const stage = document.getElementById("cinema-stage");
  if (!modal) return;
  modal.classList.remove("open");
  modal.setAttribute("aria-hidden", "true");
  stage.innerHTML = "";
  document.body.style.overflow = "";
  state.activeModalItem = null;
}

/* ==========================================================================
   CAMPAIGN REEL AUTOPLAY & CONTROLS
   ========================================================================== */
function stepReel(delta) {
  const track = document.getElementById("campaigns-track");
  const list = getFilteredCampaigns();
  if (!track || !list.length) return;

  state.reelIndex = (state.reelIndex + delta + list.length) % list.length;
  const card = track.children[state.reelIndex];
  if (card) {
    track.scrollTo({
      left: card.offsetLeft - track.offsetLeft,
      behavior: "smooth"
    });
  }
  updateReelCounter(list.length);
}

function startReelAutoplay() {
  stopReelAutoplay();
  if (!state.reelPlaying) return;
  reelInterval = setInterval(() => {
    stepReel(1);
  }, 4200);
}

function stopReelAutoplay() {
  if (reelInterval) {
    clearInterval(reelInterval);
    reelInterval = null;
  }
}

function updateReelPauseA11y() {
  const pauseBtn = document.getElementById("reel-pause-btn");
  if (!pauseBtn) return;
  const dict = I18N[state.lang];
  pauseBtn.textContent = state.reelPlaying ? "Ⅱ" : "▶";
  pauseBtn.setAttribute("aria-pressed", String(!state.reelPlaying));
  pauseBtn.setAttribute(
    "aria-label",
    state.reelPlaying ? dict.reelPause : dict.reelPlay
  );
}

function updateScrollProgress() {
  const bar = document.getElementById("scroll-progress");
  if (!bar) return;
  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const pct = docHeight > 0 ? Math.min(100, (scrollTop / docHeight) * 100) : 0;
  bar.style.width = `${pct}%`;
}

/* ==========================================================================
   EVENT LISTENERS
   ========================================================================== */
function bindGlobalEvents() {
  window.addEventListener("scroll", updateScrollProgress, { passive: true });

  // Language switcher
  document.querySelectorAll("[data-lang-switch]").forEach((btn) => {
    btn.addEventListener("click", () => {
      applyLanguage(btn.dataset.langSwitch);
    });
  });

  // Theme switcher
  const themeBtn = document.getElementById("theme-toggle-btn");
  if (themeBtn) {
    themeBtn.addEventListener("click", () => {
      applyTheme(state.theme === "dark" ? "light" : "dark");
    });
  }

  // Mobile menu toggle
  const menuToggle = document.getElementById("menu-toggle-btn");
  const mobileDrawer = document.getElementById("mobile-drawer");
  if (menuToggle && mobileDrawer) {
    menuToggle.addEventListener("click", () => {
      const open = mobileDrawer.classList.toggle("open");
      menuToggle.setAttribute("aria-expanded", String(open));
      menuToggle.textContent = open ? "✕" : "☰";
    });
    mobileDrawer.querySelectorAll("a").forEach((a) => {
      a.addEventListener("click", () => {
        mobileDrawer.classList.remove("open");
        menuToggle.setAttribute("aria-expanded", "false");
        menuToggle.textContent = "☰";
      });
    });
  }

  // Showreel hero button -> opens flagship film #1 in modal
  const showreelBtn = document.getElementById("hero-showreel-btn");
  if (showreelBtn) {
    showreelBtn.addEventListener("click", () => openCinemaModal("work-1"));
  }

  // Vault filter pills
  document.querySelectorAll("[data-vault-filter]").forEach((btn) => {
    btn.addEventListener("click", () => {
      state.vaultFilter = btn.dataset.vaultFilter;
      document.querySelectorAll("[data-vault-filter]").forEach((b) =>
        b.classList.toggle("active", b === btn)
      );
      renderVault();
    });
  });

  // Vault search
  const searchInput = document.getElementById("vault-search-input");
  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      state.vaultQuery = e.target.value;
      renderVault();
    });
  }

  // Campaign client filter pills
  document.querySelectorAll("[data-client-filter]").forEach((btn) => {
    btn.addEventListener("click", () => {
      state.clientFilter = btn.dataset.clientFilter;
      document.querySelectorAll("[data-client-filter]").forEach((b) =>
        b.classList.toggle("active", b === btn)
      );
      renderCampaignReel();
    });
  });

  // Reel Prev / Pause / Next
  document.getElementById("reel-prev-btn")?.addEventListener("click", () => {
    stepReel(-1);
  });
  document.getElementById("reel-next-btn")?.addEventListener("click", () => {
    stepReel(1);
  });
  document.getElementById("reel-pause-btn")?.addEventListener("click", () => {
    state.reelPlaying = !state.reelPlaying;
    updateReelPauseA11y();
    if (state.reelPlaying) startReelAutoplay();
    else stopReelAutoplay();
  });

  // Before / After Comparison Slider
  const compareRange = document.getElementById("compare-range");
  const compareBefore = document.getElementById("compare-before");
  const compareHandle = document.getElementById("compare-handle");
  if (compareRange && compareBefore && compareHandle) {
    compareRange.addEventListener("input", (e) => {
      const val = Number(e.target.value);
      compareBefore.style.clipPath = `inset(0 ${100 - val}% 0 0)`;
      compareHandle.style.left = `${val}%`;
    });
  }

  // Delegated click & keyboard handlers (Work cards, Packages, FAQ, Modal)
  document.addEventListener("click", (e) => {
    const card = e.target.closest("[data-open-item]");
    if (card) {
      openCinemaModal(card.dataset.openItem);
      return;
    }

    const pkgBtn = e.target.closest("[data-select-package]");
    if (pkgBtn) {
      const pkgId = pkgBtn.dataset.selectPackage;
      const countSel = document.getElementById("brief-count");
      const typeSel = document.getElementById("brief-type");
      if (countSel && typeSel) {
        if (pkgId === "starter") {
          countSel.value = "1";
          typeSel.value = "product";
        } else if (pkgId === "campaign") {
          countSel.value = "3";
          typeSel.value = "campaign";
        } else {
          countSel.value = "5";
          typeSel.value = "film";
        }
        updateBriefPreview();
      }
      document.getElementById("brief-builder")?.scrollIntoView({ behavior: "smooth" });
      return;
    }

    const faqBtn = e.target.closest(".faq-trigger");
    if (faqBtn) {
      const item = faqBtn.closest(".faq-item");
      const isOpen = item.classList.toggle("open");
      faqBtn.setAttribute("aria-expanded", String(isOpen));
      return;
    }

    if (e.target.id === "cinema-modal" || e.target.closest("#cinema-close-btn")) {
      closeCinemaModal();
    }
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      closeCinemaModal();
    }
    if (e.key === "Enter" || e.key === " ") {
      const card = document.activeElement?.closest?.("[data-open-item]");
      if (card) {
        e.preventDefault();
        openCinemaModal(card.dataset.openItem);
      }
    }
  });

  // Brief builder live inputs
  ["brief-type", "brief-count", "brief-format", "brief-dialect", "brief-brand", "brief-notes"].forEach(
    (id) => {
      const el = document.getElementById(id);
      if (el) {
        el.addEventListener("input", updateBriefPreview);
        el.addEventListener("change", updateBriefPreview);
      }
    }
  );

  // Copy brief button
  const copyBtn = document.getElementById("brief-copy-btn");
  if (copyBtn) {
    copyBtn.addEventListener("click", async () => {
      const dict = I18N[state.lang];
      try {
        await navigator.clipboard.writeText(buildBriefText());
        copyBtn.textContent = dict.copiedBriefMsg;
        setTimeout(() => {
          copyBtn.textContent = I18N[state.lang].copyBriefBtn;
        }, 2200);
      } catch {
        // Fallback selection
      }
    });
  }
}
