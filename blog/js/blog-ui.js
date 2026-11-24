import { ADSENSE_CONFIG } from "./adsense-config.js";

document.addEventListener("DOMContentLoaded", () => {
  // 1. Theme Sync across Portfolio & Blog
  const savedTheme = localStorage.getItem("eslamtgd_theme") || "dark";
  applyTheme(savedTheme);

  document.getElementById("theme-toggle-btn")?.addEventListener("click", () => {
    const current = document.documentElement.getAttribute("data-theme") || "dark";
    applyTheme(current === "dark" ? "light" : "dark");
  });

  // 2. Live Search Filter on Category / Blog Index Pages
  const searchInput = document.getElementById("blog-search-input");
  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      const q = e.target.value.trim().toLowerCase();
      document.querySelectorAll("[data-article-card]").forEach((card) => {
        const text = card.textContent.toLowerCase();
        card.style.display = !q || text.includes(q) ? "" : "none";
      });
    });
  }

  // 3. One-Click Copy Prompt Buttons inside Articles
  document.querySelectorAll("[data-copy-prompt]").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const targetId = btn.getAttribute("data-copy-prompt");
      const pre = document.getElementById(targetId);
      if (!pre) return;
      await navigator.clipboard.writeText(pre.textContent.trim());
      const orig = btn.textContent;
      btn.textContent = "تم نسخ البرومبت بنجاح ✓";
      setTimeout(() => {
        btn.textContent = orig;
      }, 2200);
    });
  });

  // 4. Copy Article Link Button
  document.getElementById("copy-article-url")?.addEventListener("click", async (e) => {
    const btn = e.currentTarget;
    await navigator.clipboard.writeText(window.location.href);
    const orig = btn.textContent;
    btn.textContent = "تم نسخ الرابط ✓";
    setTimeout(() => {
      btn.textContent = orig;
    }, 2000);
  });

  // 5. Smart Google AdSense Loader & Owner Preview Mode (?preview_ads=1)
  initAdSenseSlots();
});

function applyTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);
  localStorage.setItem("eslamtgd_theme", theme);
  const icon = document.getElementById("theme-icon");
  if (icon) icon.textContent = theme === "dark" ? "☀" : "☾";
}

function initAdSenseSlots() {
  const previewMode = new URLSearchParams(window.location.search).get("preview_ads") === "1";
  const slots = document.querySelectorAll(".ad-slot");
  if (!slots.length) return;

  if (ADSENSE_CONFIG.ADSENSE_ACTIVE && ADSENSE_CONFIG.PUBLISHER_ID.startsWith("ca-pub-") && !ADSENSE_CONFIG.PUBLISHER_ID.endsWith("0000000")) {
    // Inject Google AdSense script once
    const script = document.createElement("script");
    script.async = true;
    script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CONFIG.PUBLISHER_ID}`;
    script.crossOrigin = "anonymous";
    document.head.appendChild(script);

    slots.forEach((slotEl) => {
      const slotKey = slotEl.getAttribute("data-ad-position") || "IN_ARTICLE";
      const adSlotId = ADSENSE_CONFIG.SLOTS[slotKey] || ADSENSE_CONFIG.SLOTS.IN_ARTICLE;
      slotEl.classList.add("ad-visible");
      slotEl.innerHTML = `
        <span class="ad-slot-label">إعلان</span>
        <ins class="adsbygoogle"
             style="display:block;width:100%"
             data-ad-client="${ADSENSE_CONFIG.PUBLISHER_ID}"
             data-ad-slot="${adSlotId}"
             data-ad-format="auto"
             data-full-width-responsive="true"></ins>
      `;
      try {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      } catch {
        // AdSense initializes asynchronously
      }
    });
  } else if (previewMode) {
    slots.forEach((slotEl) => {
      const pos = slotEl.getAttribute("data-ad-position") || "AD_UNIT";
      slotEl.classList.add("ad-visible");
      slotEl.innerHTML = `
        <span class="ad-slot-label">Google AdSense Slot Preview · ${pos}</span>
        <strong style="font-size:0.9rem;color:var(--accent)">مساحة إعلانية جاهزة لـ Google AdSense</strong>
        <span style="font-size:0.78rem;color:var(--text-secondary)">مخفية عن الزوار حالياً — تعمل تلقائياً فور تفعيل معرف الناشر في adsense-config.js</span>
      `;
    });
  }
}
