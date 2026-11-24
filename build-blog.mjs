import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DOMAIN = "https://eslamtgd.top";
const EMAIL = "eslamthabet@gmail.com";

export const CATEGORIES = [
  {
    slug: "prompts",
    icon: "⌘",
    name: "برومبتات الذكاء الاصطناعي",
    shortName: "البرومبتات",
    badge: "جاهز للنسخ",
    seoTitle: "برومبتات الذكاء الاصطناعي الجاهزة للصور والفيديو | مدونة eslamtgd",
    desc: "مكتبة متجددة من أقوى أوامر الذكاء الاصطناعي (Prompts) المجربة لتوليد الصور السينمائية، إعلانات المنتجات، والشخصيات الواقعية بدقة 4K."
  },
  {
    slug: "courses",
    icon: "🎓",
    name: "كورسات مجانية وتعلّم ذاتي",
    shortName: "كورسات مجانية",
    badge: "تعلّم مجاناً",
    seoTitle: "أفضل الكورسات المجانية لتعلم الذكاء الاصطناعي وصناعة المحتوى | eslamtgd",
    desc: "دليلك الشامل لأقوى الكورسات المجانية والشهادات المعتمدة لتعلّم الذكاء الاصطناعي، المونتاج، التصميم، وصناعة الفيديو من الصفر."
  },
  {
    slug: "ai-tools",
    icon: "✦",
    name: "مواقع وأدوات AI مجانية",
    shortName: "أدوات AI مجانية",
    badge: "مواقع مجانية",
    seoTitle: "أفضل مواقع وأدوات الذكاء الاصطناعي المجانية | مدونة eslamtgd",
    desc: "مراجعات عملية وروابط مباشرة لأفضل مواقع الذكاء الاصطناعي المجانية لتوليد الفيديو، تحسين الصوت، التصميم، ورفع الإنتاجية."
  },
  {
    slug: "tech",
    icon: "⚡",
    name: "تقنية وأخبار التكنولوجيا",
    shortName: "التقنية",
    badge: "تكنولوجيا",
    seoTitle: "أخبار التقنية والذكاء الاصطناعي والتحول الرقمي | مدونة eslamtgd",
    desc: "تغطية معمقة لأحدث تطورات التكنولوجيا، نماذج توليد الفيديو الجديدة، الأجهزة، ومستقبل الصناعات الإبداعية الرقمية."
  },
  {
    slug: "tutorials",
    icon: "🎬",
    name: "شروحات وتقنيات صناعة المحتوى",
    shortName: "شروحات وتقنيات",
    badge: "دروس تطبيقية",
    seoTitle: "شروحات صناعة الفيديو بالذكاء الاصطناعي والمونتاج السينمائي | eslamtgd",
    desc: "خطوات عملية لتثبيت ملامح الشخصيات، حركة الكاميرا السينمائية، الهندسة الصوتية، ومونتاج الفيديوهات القصيرة الاحترافية."
  },
  {
    slug: "income",
    icon: "💼",
    name: "الربح والعمل الحر بالـ AI",
    shortName: "الربح والعمل الحر",
    badge: "عمل حر",
    seoTitle: "الربح من الذكاء الاصطناعي والعمل الحر لصناع المحتوى | مدونة eslamtgd",
    desc: "استراتيجيات واقعية لتحويل مهاراتك في الذكاء الاصطناعي وصناعة الفيديو إلى خدمات مطلوبة ومشاريع عمل حر مع الشركات والبراندات."
  }
];

// المقالات بتتقرأ من ملفات ماركداون في content/blog/ (شغّالة مع Pages CMS و GitHub Actions)
import { loadArticles } from "./lib/articles-loader.mjs";
export const ARTICLES = loadArticles(path.join(__dirname, "content", "blog"));

function renderHeader(relRoot, activeSlug = "") {
  return `
  <header class="site-header shell">
    <div class="header-inner">
      <a href="${relRoot}blog/" class="brand" aria-label="مدونة eslamtgd">
        <span class="brand-mark">e.</span>
        <span class="brand-text">
          <span class="brand-name">ESLAMTGD BLOG</span>
          <span class="brand-role">مدونة التقنية والذكاء الاصطناعي</span>
        </span>
      </a>

      <nav class="main-nav" aria-label="روابط المدونة الرئيسية">
        <a href="${relRoot}blog/" class="nav-link ${activeSlug === "home" ? "active" : ""}">رئيسية المدونة</a>
        <a href="${relRoot}blog/prompts/" class="nav-link ${activeSlug === "prompts" ? "active" : ""}">البرومبتات</a>
        <a href="${relRoot}blog/courses/" class="nav-link ${activeSlug === "courses" ? "active" : ""}">كورسات مجانية</a>
        <a href="${relRoot}blog/ai-tools/" class="nav-link ${activeSlug === "ai-tools" ? "active" : ""}">أدوات AI</a>
        <a href="${relRoot}blog/tech/" class="nav-link ${activeSlug === "tech" ? "active" : ""}">تقنية</a>
        <a href="${relRoot}blog/tutorials/" class="nav-link ${activeSlug === "tutorials" ? "active" : ""}">شروحات</a>
      </nav>

      <div class="header-actions">
        <button type="button" class="icon-btn" id="theme-toggle-btn" aria-label="تبديل المظهر">
          <span id="theme-icon" aria-hidden="true">☀</span>
        </button>
        <a href="${relRoot}" class="btn btn-outline btn-sm header-cta-desktop">الموقع الشخصي وأعمالي ↗</a>
      </div>
    </div>
  </header>

  <div class="blog-subnav">
    <div class="shell blog-subnav-list">
      <a href="${relRoot}blog/" class="cat-pill-link ${activeSlug === "home" ? "active" : ""}">🏠 الكل</a>
      ${CATEGORIES.map(
        (c) =>
          `<a href="${relRoot}blog/${c.slug}/" class="cat-pill-link ${activeSlug === c.slug ? "active" : ""}">${c.icon} ${c.shortName}</a>`
      ).join("")}
    </div>
  </div>`;
}

function renderSidebar(relRoot) {
  return `
  <aside class="mag-sidebar">
    <div class="ad-slot" data-ad-position="SIDEBAR_RECTANGLE"></div>

    <div class="sidebar-widget">
      <h3>أقسام المدونة المتخصصة</h3>
      <ul class="sidebar-cat-list">
        ${CATEGORIES.map((c) => {
          const count = ARTICLES.filter((a) => a.category === c.slug).length;
          return `<li><a href="${relRoot}blog/${c.slug}/"><span>${c.icon} ${c.name}</span><span class="mono-tag">${count}</span></a></li>`;
        }).join("")}
      </ul>
    </div>

    <div class="sidebar-widget" style="border-color:var(--border-accent);background:linear-gradient(160deg,var(--bg-card),var(--accent-soft))">
      <h3>هل تحتاج إعلان AI لبراندك؟</h3>
      <p style="font-size:0.9rem;color:var(--text-secondary);margin-bottom:14px">
        استوديو إسلام ثابت ينفذ إعلانات المنتجات والأفلام القصيرة بالذكاء الاصطناعي بجودة سينمائية 4K.
      </p>
      <a href="${relRoot}#brief-builder" class="btn btn-primary btn-sm" style="width:100%">اطلب مشروعك الآن ↗</a>
    </div>

    <div class="sidebar-widget">
      <h3>روابط مهمة</h3>
      <ul class="sidebar-cat-list">
        <li><a href="${relRoot}about/"><span>من نحن ورسالة المدونة</span><span>←</span></a></li>
        <li><a href="${relRoot}contact/"><span>اتصل بنا</span><span>←</span></a></li>
        <li><a href="${relRoot}privacy-policy/"><span>سياسة الخصوصية</span><span>←</span></a></li>
        <li><a href="${relRoot}terms/"><span>شروط الاستخدام</span><span>←</span></a></li>
      </ul>
    </div>
  </aside>`;
}

function renderFooter(relRoot) {
  return `
  <footer class="site-footer shell">
    <div class="footer-inner">
      <a href="${relRoot}blog/" class="footer-wordmark">eslamtgd<span>.</span>blog</a>
      <div style="display:flex;gap:14px;flex-wrap:wrap;font-size:0.86rem;color:var(--text-secondary)">
        <a href="${relRoot}">معرض الأعمال الشخصي</a>
        <span>·</span>
        <a href="${relRoot}about/">من نحن</a>
        <span>·</span>
        <a href="${relRoot}privacy-policy/">سياسة الخصوصية</a>
        <span>·</span>
        <a href="${relRoot}terms/">شروط الاستخدام</a>
        <span>·</span>
        <a href="${relRoot}contact/">اتصل بنا</a>
      </div>
      <p style="color:var(--text-muted);font-size:0.82rem">© ٢٠٢٦ جميع الحقوق محفوظة · ${EMAIL}</p>
    </div>
  </footer>`;
}

function renderArticleCard(a, relRoot) {
  const cat = CATEGORIES.find((c) => c.slug === a.category);
  return `
  <article class="article-card" data-article-card>
    <a href="${relRoot}blog/${a.category}/${a.slug}/" class="article-thumb">
      <img src="${a.image}" alt="${a.title}" loading="lazy" />
    </a>
    <div class="article-body">
      <div class="article-meta">
        <a href="${relRoot}blog/${a.category}/" class="highlight-pill">${cat ? cat.shortName : ""}</a>
        <span>${a.readTime}</span>
      </div>
      <h3 class="article-title">
        <a href="${relRoot}blog/${a.category}/${a.slug}/">${a.title}</a>
      </h3>
      <p class="article-excerpt">${a.excerpt}</p>
      <div class="hub-cat-footer" style="margin-top:8px">
        <span>${a.dateAr}</span>
        <a href="${relRoot}blog/${a.category}/${a.slug}/">اقرأ المقال كاملاً ←</a>
      </div>
    </div>
  </article>`;
}

function baseHead({ title, desc, canonical, relRoot, jsonLd = "" }) {
  return `<!DOCTYPE html>
<html lang="ar" dir="rtl" data-theme="dark">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${title}</title>
  <meta name="description" content="${desc}" />
  <link rel="canonical" href="${canonical}" />
  <meta property="og:type" content="article" />
  <meta property="og:title" content="${title}" />
  <meta property="og:description" content="${desc}" />
  <meta property="og:url" content="${canonical}" />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;800;900&family=JetBrains+Mono:wght@500;700&family=Plus+Jakarta+Sans:wght@400;600;700;800&display=swap" rel="stylesheet" />
  <link rel="stylesheet" href="${relRoot}css/styles.css" />
  <link rel="stylesheet" href="${relRoot}blog/css/blog.css" />
  ${jsonLd}
</head>`;
}

function writeFileEnsured(relFilePath, content) {
  const full = path.join(__dirname, relFilePath);
  fs.mkdirSync(path.dirname(full), { recursive: true });
  fs.writeFileSync(full, content, "utf8");
}

// 1. Build /blog/index.html
function buildBlogHome() {
  const relRoot = "../";
  const featured = ARTICLES[0];
  const html = `${baseHead({
    title: "مدونة إسلام ثابت للتقنية والذكاء الاصطناعي | برومبتات، كورسات مجانية، وأدوات AI",
    desc: "منصة معرفية متخصصة في شرح تقنيات الذكاء الاصطناعي، البرومبتات الجاهزة، الكورسات المجانية، وأدوات صناعة المحتوى والربح الرقمي.",
    canonical: `${DOMAIN}/blog/`,
    relRoot
  })}
<body>
  ${renderHeader(relRoot, "home")}
  <main class="shell" style="padding-block:42px 72px">
    <div class="ad-slot" data-ad-position="TOP_LEADERBOARD"></div>

    <!-- Featured Hero Article -->
    <section class="featured-post-banner">
      <div>
        <span class="status-pill" style="margin-bottom:12px">✦ مقال مميز · جاهز للتطبيق</span>
        <h1 style="font-size:clamp(1.6rem,2.8vw,2.35rem);font-weight:900;line-height:1.28;margin-bottom:12px">
          <a href="prompts/${featured.slug}/">${featured.title}</a>
        </h1>
        <p style="color:var(--text-secondary);margin-bottom:20px">${featured.excerpt}</p>
        <div style="display:flex;gap:12px;flex-wrap:wrap">
          <a href="prompts/${featured.slug}/" class="btn btn-primary">اقرأ الدليل وانسخ البرومبت ←</a>
          <input type="search" id="blog-search-input" placeholder="ابحث في مقالات وأقسام المدونة..." style="padding:11px 18px;border-radius:999px;background:var(--bg-elevated);border:1px solid var(--border-subtle);min-width:250px" />
        </div>
      </div>
      <a href="prompts/${featured.slug}/" class="featured-post-thumb">
        <img src="${featured.image}" alt="${featured.title}" />
      </a>
    </section>

    <!-- 6 Standalone Sub-URL Category Portals -->
    <section style="margin-bottom:52px">
      <div class="section-head" style="margin-bottom:24px">
        <span class="section-index">تصفّح الأقسام المستقلة</span>
        <h2 class="section-title" style="font-size:clamp(1.6rem,2.6vw,2.2rem)">اختر مسارك المعرفي <span class="text-accent">وادخل القسم مباشرة.</span></h2>
      </div>
      <div class="hub-categories-grid">
        ${CATEGORIES.map(
          (c) => `
          <a href="${c.slug}/" class="hub-cat-card">
            <div class="hub-cat-top">
              <div class="hub-cat-icon">${c.icon}</div>
              <span class="hub-cat-badge">${c.badge}</span>
            </div>
            <h3 class="hub-cat-title">${c.name}</h3>
            <p class="hub-cat-desc">${c.desc}</p>
            <div class="hub-cat-footer">
              <span class="mono-tag" style="direction:ltr">/blog/${c.slug}/</span>
              <span>دخول القسم ←</span>
            </div>
          </a>`
        ).join("")}
      </div>
    </section>

    <!-- Latest Articles + Sidebar -->
    <div class="mag-layout">
      <section>
        <h2 style="font-size:1.55rem;font-weight:900;margin-bottom:22px">أحدث المقالات والشروحات المنشورة</h2>
        <div class="articles-grid" style="grid-template-columns:repeat(2,1fr)">
          ${ARTICLES.map((a) => renderArticleCard(a, relRoot)).join("")}
        </div>
        <div class="ad-slot" data-ad-position="BOTTOM_MULTIPLEX"></div>
      </section>
      ${renderSidebar(relRoot)}
    </div>
  </main>
  ${renderFooter(relRoot)}
  <script type="module" src="${relRoot}blog/js/blog-ui.js"></script>
</body>
</html>`;

  writeFileEnsured("blog/index.html", html);
}

// 2. Build 6 Category Sub-URLs (/blog/<slug>/index.html)
function buildCategoryPages() {
  const relRoot = "../../";
  for (const cat of CATEGORIES) {
    const catArticles = ARTICLES.filter((a) => a.category === cat.slug);
    const jsonLd = `<script type="application/ld+json">${JSON.stringify({
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      name: cat.name,
      description: cat.desc,
      url: `${DOMAIN}/blog/${cat.slug}/`
    })}</script>`;

    const html = `${baseHead({
      title: cat.seoTitle,
      desc: cat.desc,
      canonical: `${DOMAIN}/blog/${cat.slug}/`,
      relRoot,
      jsonLd
    })}
<body>
  ${renderHeader(relRoot, cat.slug)}
  <main class="shell" style="padding-block:38px 72px">
    <nav class="breadcrumbs" aria-label="Breadcrumb">
      <a href="${relRoot}">الرئيسية</a><span>/</span>
      <a href="${relRoot}blog/">المدونة</a><span>/</span>
      <strong>${cat.name}</strong>
    </nav>

    <div class="ad-slot" data-ad-position="TOP_LEADERBOARD"></div>

    <div class="section-head" style="margin-bottom:32px">
      <span class="section-index">${cat.icon} قسم متخصص · /blog/${cat.slug}/</span>
      <h1 class="section-title">${cat.name}</h1>
      <p class="section-sub">${cat.desc}</p>
    </div>

    <div class="mag-layout">
      <section>
        <div class="articles-grid" style="grid-template-columns:repeat(2,1fr)">
          ${catArticles.map((a) => renderArticleCard(a, relRoot)).join("")}
        </div>
        <div class="ad-slot" data-ad-position="BOTTOM_MULTIPLEX"></div>
      </section>
      ${renderSidebar(relRoot)}
    </div>
  </main>
  ${renderFooter(relRoot)}
  <script type="module" src="${relRoot}blog/js/blog-ui.js"></script>
</body>
</html>`;

    writeFileEnsured(`blog/${cat.slug}/index.html`, html);
  }
}

// 3. Build Standalone SEO Article Pages (/blog/<cat>/<slug>/index.html)
function buildArticlePages() {
  const relRoot = "../../../";
  for (const art of ARTICLES) {
    const cat = CATEGORIES.find((c) => c.slug === art.category);
    const canonical = `${DOMAIN}/blog/${art.category}/${art.slug}/`;
    const related = ARTICLES.filter((x) => x.slug !== art.slug).slice(0, 2);

    const jsonLd = `<script type="application/ld+json">${JSON.stringify({
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "BlogPosting",
          headline: art.title,
          description: art.metaDesc,
          image: art.image,
          datePublished: art.date,
          dateModified: art.date,
          author: {
            "@type": "Person",
            name: "إسلام ثابت (Eslam Thabet)",
            url: `${DOMAIN}/`
          },
          publisher: {
            "@type": "Organization",
            name: "eslamtgd",
            url: `${DOMAIN}/`
          },
          mainEntityOfPage: canonical
        },
        {
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "المدونة", item: `${DOMAIN}/blog/` },
            { "@type": "ListItem", position: 2, name: cat.name, item: `${DOMAIN}/blog/${cat.slug}/` },
            { "@type": "ListItem", position: 3, name: art.title, item: canonical }
          ]
        }
      ]
    })}</script>`;

    const tocHtml = `
      <div class="toc-box">
        <strong>فهرس محتويات المقال:</strong>
        <ol>
          ${art.sections.map((s, idx) => `<li><a href="#sec-${idx + 1}">${s.h2}</a></li>`).join("")}
        </ol>
      </div>`;

    const promptHtml = art.promptText
      ? `
      <div class="prompt-box">
        <div class="prompt-box-head">
          <span>PROMPT · جاهز للنسخ الفوري</span>
          <button type="button" class="btn btn-primary btn-sm" data-copy-prompt="article-prompt-code">نسخ البرومبت</button>
        </div>
        <pre id="article-prompt-code">${art.promptText}</pre>
      </div>`
      : "";

    const bodyHtml = art.sections
      .map(
        (s, idx) => `
        <section id="sec-${idx + 1}">
          <h2>${s.h2}</h2>
          ${s.paragraphs.map((p) => `<p>${p}</p>`).join("")}
          ${s.bullets ? `<ul>${s.bullets.map((b) => `<li>${b}</li>`).join("")}</ul>` : ""}
          ${s.tip ? `<div class="article-tip-box"><strong>💡 خلاصة تنفيذية:</strong> ${s.tip}</div>` : ""}
          ${idx === 0 ? `<div class="ad-slot" data-ad-position="IN_ARTICLE"></div>` : ""}
        </section>`
      )
      .join("");

    const html = `${baseHead({
      title: `${art.title} | مدونة eslamtgd`,
      desc: art.metaDesc,
      canonical,
      relRoot,
      jsonLd
    })}
<body>
  ${renderHeader(relRoot, art.category)}
  <main class="shell" style="padding-block:34px 72px">
    <nav class="breadcrumbs" aria-label="Breadcrumb">
      <a href="${relRoot}">الرئيسية</a><span>/</span>
      <a href="${relRoot}blog/">المدونة</a><span>/</span>
      <a href="${relRoot}blog/${cat.slug}/">${cat.name}</a><span>/</span>
      <span>${art.title}</span>
    </nav>

    <div class="ad-slot" data-ad-position="TOP_LEADERBOARD"></div>

    <div class="mag-layout">
      <article class="article-shell">
        <div class="article-header-meta">
          <a href="${relRoot}blog/${cat.slug}/" class="highlight-pill">${cat.name}</a>
          <span>📅 ${art.dateAr}</span>
          <span>⏱ ${art.readTime}</span>
          <span>✍️ بقلم: إسلام ثابت</span>
        </div>

        <h1 class="article-h1">${art.title}</h1>
        <p style="font-size:1.08rem;color:var(--text-secondary)">${art.excerpt}</p>

        <div class="article-hero-img">
          <img src="${art.image}" alt="${art.title}" fetchpriority="high" />
        </div>

        ${tocHtml}
        ${promptHtml}

        <div class="article-content">
          ${bodyHtml}
        </div>

        <div class="share-bar">
          <strong>شارك المقال:</strong>
          <a class="btn btn-outline btn-sm" target="_blank" rel="noopener noreferrer" href="https://wa.me/?text=${encodeURIComponent(art.title + " " + canonical)}">واتساب ↗</a>
          <a class="btn btn-outline btn-sm" target="_blank" rel="noopener noreferrer" href="https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(canonical)}">فيسبوك ↗</a>
          <button type="button" class="btn btn-outline btn-sm" id="copy-article-url">نسخ رابط المقال 🔗</button>
        </div>

        <div class="author-card">
          <img src="https://eslamtgd.top/assets/portrait.jpg" alt="إسلام ثابت" />
          <div>
            <strong style="font-size:1.1rem;display:block;margin-bottom:4px">إسلام ثابت (@eslamtgd)</strong>
            <p style="font-size:0.9rem;color:var(--text-secondary);margin:0">
              مخرج وصانع أفلام وإعلانات بالذكاء الاصطناعي. أشارك في هذه المدونة خلاصة التجارب العملية في الهندسة البصرية، البرومبتات، وأدوات صناعة المحتوى الحديثة.
            </p>
          </div>
        </div>

        <div class="ad-slot" data-ad-position="BOTTOM_MULTIPLEX"></div>

        <section style="margin-top:36px">
          <h2 style="font-size:1.35rem;font-weight:900;margin-bottom:18px">مقالات ذات صلة قد تهمك</h2>
          <div class="articles-grid" style="grid-template-columns:repeat(2,1fr)">
            ${related.map((r) => renderArticleCard(r, relRoot)).join("")}
          </div>
        </section>
      </article>

      ${renderSidebar(relRoot)}
    </div>
  </main>
  ${renderFooter(relRoot)}
  <script type="module" src="${relRoot}blog/js/blog-ui.js"></script>
</body>
</html>`;

    writeFileEnsured(`blog/${art.category}/${art.slug}/index.html`, html);
  }
}

// 4. Build Mandatory Google AdSense Compliance Pages (/privacy-policy/, /terms/, /about/, /contact/)
function buildCompliancePages() {
  const relRoot = "../";

  const privacyHtml = `${baseHead({
    title: "سياسة الخصوصية | eslamtgd.top",
    desc: "سياسة الخصوصية وملفات تعريف الارتباط وإعلانات Google AdSense الخاصة بموقع ومدونة eslamtgd.top.",
    canonical: `${DOMAIN}/privacy-policy/`,
    relRoot
  })}
<body>
  ${renderHeader(relRoot, "")}
  <main class="shell" style="padding-block:48px 72px">
    <div class="legal-card">
      <h1>سياسة الخصوصية (Privacy Policy)</h1>
      <p>تاريخ آخر تحديث: ٢٤ نوفمبر ٢٠٢٦</p>
      <p>نحن في موقع ومدونة <strong>eslamtgd.top</strong> نولي خصوصية زوارنا أهمية قصوى. توضح هذه الوثيقة أنواع المعلومات الشخصية التي يتم جمعها وكيفية استخدامها وحمايتها.</p>

      <h2>١. ملفات السجل (Log Files)</h2>
      <p>يتبع موقع eslamtgd.top الإجراءات القياسية لاستخدام ملفات السجل، وتشمل عناوين بروتوكول الإنترنت (IP)، نوع المتصفح، مزود خدمة الإنترنت، طابع التاريخ والوقت، وصفحات الإحالة والخروج لتحليل الاتجاهات وإدارة الموقع وتحسين تجربة المستخدم دون ربطها بأي معلومات تحدد الهوية الشخصية.</p>

      <h2>٢. ملفات تعريف الارتباط وإعلانات Google AdSense</h2>
      <ul>
        <li>تستخدم شركة <strong>Google</strong>، بصفتها مورّداً خارجياً، ملفات تعريف الارتباط (Cookies) لعرض الإعلانات على موقعنا بناءً على زيارات المستخدمين السابقة لموقعنا أو لمواقع أخرى على الإنترنت.</li>
        <li>يمكّن استخدام Google لملف تعريف الارتباط <strong>DoubleClick DART</strong> وشركائها من عرض إعلانات مخصصة للمستخدمين استناداً إلى اهتماماتهم وتصفحهم.</li>
        <li>يمكن للمستخدمين اختيار تعطيل استخدام الإعلانات المخصصة في أي وقت من خلال زيارة صفحة إعدادات الإعلانات الخاصة بشركة جوجل عبر الرابط الرسمي: <a href="https://adssettings.google.com" target="_blank" rel="noopener noreferrer" style="color:var(--accent);text-decoration:underline">https://adssettings.google.com</a>.</li>
      </ul>

      <h2>٣. سياسات الخصوصية للأطراف الثالثة</h2>
      <p>قد يحتوي موقعنا على روابط خارجية لمواقع ومنصات أخرى (مثل يوتيوب، تيك توك، أو أدوات تقنية نشرحها). لا تشمل سياسة الخصوصية الخاصة بنا تلك المواقع الخارجية، وننصح بمراجعة سياسات الخصوصية الخاصة بكل موقع تزوره.</p>

      <h2>٤. حقوق المستخدم والموافقة</h2>
      <p>باستخدامك لموقعنا، فإنك توافق على سياسة الخصوصية الخاصة بنا وتقر بشروطها. لأي استفسارات تتعلق بالخصوصية أو طلبات البيانات، يسعدنا تواصلك المباشر عبر البريد الرسمي: <strong>${EMAIL}</strong>.</p>
    </div>
  </main>
  ${renderFooter(relRoot)}
  <script type="module" src="${relRoot}blog/js/blog-ui.js"></script>
</body>
</html>`;

  const termsHtml = `${baseHead({
    title: "شروط الاستخدام | eslamtgd.top",
    desc: "شروط وأحكام استخدام موقع ومدونة إسلام ثابت (eslamtgd.top) وحقوق الملكية الفكرية.",
    canonical: `${DOMAIN}/terms/`,
    relRoot
  })}
<body>
  ${renderHeader(relRoot, "")}
  <main class="shell" style="padding-block:48px 72px">
    <div class="legal-card">
      <h1>شروط الاستخدام (Terms of Use)</h1>
      <p>مرحباً بك في <strong>eslamtgd.top</strong>. بتصفحك لهذا الموقع أو استخدامك للمحتوى المنشور في المدونة، فإنك توافق على الالتزام بشروط الاستخدام التالية:</p>

      <h2>١. حقوق الملكية الفكرية والاستخدام المسموح</h2>
      <p>جميع المقالات، الشروحات، الصور الحصرية، والأفلام المعروضة في الموقع محمية بموجب حقوق الملكية الفكرية لإسلام ثابت (eslamtgd). يُسمح بنسخ واستخدام «الأوامر النصية / البرومبتات» المنشورة في قسم البرومبتات في مشاريعك الإبداعية بحرية، بينما يُمنع نسخ المقالات الكاملة وإعادة نشرها في مواقع أخرى دون إذن كتابي مسبق أو ذكر المصدر برابط صريح.</p>

      <h2>٢. طبيعة المحتوى التعليمي والتقني</h2>
      <p>تُقدم الشروحات ومراجعات أدوات الذكاء الاصطناعي والكورسات المجانية لأغراض تعليمية ومعرفية؛ وقد تتغير خطط الأسعار أو المزايا المجانية للمواقع الخارجية التي نستعرضها وفقاً لسياسات الشركات المالكة لها.</p>

      <h2>٣. التواصل والخدمات الإعلانية</h2>
      <p>تخضع طلبات تنفيذ الفيديوهات التجارية والحملات الإعلانية للاتفاق المباشر على نطاق العمل والجدول الزمني عبر قنوات التواصل الرسمية الموضحة في الموقع.</p>
    </div>
  </main>
  ${renderFooter(relRoot)}
  <script type="module" src="${relRoot}blog/js/blog-ui.js"></script>
</body>
</html>`;

  const aboutHtml = `${baseHead({
    title: "من نحن ورسالة المنصة | eslamtgd.top",
    desc: "تعرف على إسلام ثابت (@eslamtgd) ورسالة مدونة التقنية والذكاء الاصطناعي العربية.",
    canonical: `${DOMAIN}/about/`,
    relRoot
  })}
<body>
  ${renderHeader(relRoot, "")}
  <main class="shell" style="padding-block:48px 72px">
    <div class="legal-card">
      <h1>من نحن — عن منصة ومدونة eslamtgd</h1>
      <p>منصة <strong>eslamtgd.top</strong> أسسها <strong>إسلام ثابت (Eslam Thabet)</strong>، مخرج وصانع أفلام وإعلانات بالذكاء الاصطناعي يتابعه أكثر من ١٨٨ ألف متابع عبر منصات التواصل الاجتماعي في العالم العربي.</p>

      <h2>رسالتنا التحريرية في المدونة</h2>
      <p>نسعى إلى إثراء المحتوى العربي التقني بمقالات تطبيقية عالية الجودة، بعيدة عن الحشو والترجمة الحرفية، لمساعدة المصممين، المونتيرين، وصناع المحتوى على إتقان أدوات الذكاء الاصطناعي الحديثة مجاناً وبأسلوب احترافي عملي.</p>

      <h2>ماذا نقدم في أقسام المدونة الستة؟</h2>
      <ul>
        <li><strong>برومبتات الذكاء الاصطناعي:</strong> أوامر مجربة وجاهزة للنسخ لتوليد صور ولقطات سينمائية.</li>
        <li><strong>كورسات مجانية:</strong> مسارات تعلم ذاتي منتقاة بعناية لتطوير المهارات الرقمية.</li>
        <li><strong>أدوات ومواقع AI مجانية:</strong> مراجعات أمينة لأفضل البدائل المجانية اليومية.</li>
        <li><strong>شروحات وتقنيات الفيديو:</strong> أسرار ثبات الشخصيات، الإضاءة، والهندسة الصوتية.</li>
        <li><strong>أخبار التقنية والربح الرقمي:</strong> قراءة لمستقبل التكنولوجيا والعمل الحر الإبداعي.</li>
      </ul>
    </div>
  </main>
  ${renderFooter(relRoot)}
  <script type="module" src="${relRoot}blog/js/blog-ui.js"></script>
</body>
</html>`;

  const contactHtml = `${baseHead({
    title: "اتصل بنا | eslamtgd.top",
    desc: "تواصل مع إدارة موقع ومدونة إسلام ثابت (eslamtgd.top) للاستفسارات التقنية أو التعاون الإعلاني.",
    canonical: `${DOMAIN}/contact/`,
    relRoot
  })}
<body>
  ${renderHeader(relRoot, "")}
  <main class="shell" style="padding-block:48px 72px">
    <div class="legal-card">
      <h1>اتصل بنا (Contact Us)</h1>
      <p>نسعد دائماً بتواصلكم سواء للاستفسار عن الشروحات التقنية المنشورة في المدونة، اقتراح مواضيع جديدة، الإعلانات والرعايات، أو طلب إنتاج فيديو بالذكاء الاصطناعي لعلامتكم التجارية.</p>

      <h2>قنوات التواصل الرسمية المباشرة</h2>
      <ul>
        <li><strong>البريد الإلكتروني الرسمي:</strong> <a href="mailto:${EMAIL}" style="color:var(--accent)">${EMAIL}</a></li>
        <li><strong>واتساب للأعمال والمشاريع:</strong> <a href="https://wa.me/201015772369" target="_blank" rel="noopener noreferrer" style="color:var(--accent);direction:ltr;display:inline-block">+20 101 577 2369</a></li>
      </ul>

      <h2>نموذج المراسلة السريع</h2>
      <form onsubmit="event.preventDefault(); const s=encodeURIComponent(this.subj.value||'رسالة من موقع eslamtgd.top'); const b=encodeURIComponent('الاسم: '+this.uname.value+'\\n\\n'+this.msg.value); window.location.href='mailto:${EMAIL}?subject='+s+'&body='+b;" style="display:grid;gap:14px;margin-top:16px">
        <div class="field-group">
          <label>الاسم الكريم</label>
          <input type="text" name="uname" required placeholder="اكتب اسمك..." />
        </div>
        <div class="field-group">
          <label>عنوان الرسالة</label>
          <input type="text" name="subj" required placeholder="استفسار، تعاون إعلاني، اقتراح مقال..." />
        </div>
        <div class="field-group">
          <label>تفاصيل الرسالة</label>
          <textarea name="msg" rows="4" required placeholder="اكتب رسالتك هنا..."></textarea>
        </div>
        <button type="submit" class="btn btn-primary" style="justify-self:start">إرسال الرسالة عبر البريد ✉</button>
      </form>
    </div>
  </main>
  ${renderFooter(relRoot)}
  <script type="module" src="${relRoot}blog/js/blog-ui.js"></script>
</body>
</html>`;

  writeFileEnsured("privacy-policy/index.html", privacyHtml);
  writeFileEnsured("terms/index.html", termsHtml);
  writeFileEnsured("about/index.html", aboutHtml);
  writeFileEnsured("contact/index.html", contactHtml);
}

// 5. Build ads.txt & Complete Sitemap
function buildAdsAndSitemap() {
  const adsTxt = `# Google AdSense ads.txt for eslamtgd.top
# استبدل pub-0000000000000000 برقم الناشر الخاص بك فور تفعيل حساب Google AdSense
google.com, pub-0000000000000000, DIRECT, f08c47fec0942fa0
`;
  writeFileEnsured("ads.txt", adsTxt);

  const urls = [
    { loc: `${DOMAIN}/`, priority: "1.0" },
    { loc: `${DOMAIN}/blog/`, priority: "0.95" },
    ...CATEGORIES.map((c) => ({ loc: `${DOMAIN}/blog/${c.slug}/`, priority: "0.85" })),
    ...ARTICLES.map((a) => ({ loc: `${DOMAIN}/blog/${a.category}/${a.slug}/`, priority: "0.80" })),
    { loc: `${DOMAIN}/about/`, priority: "0.60" },
    { loc: `${DOMAIN}/contact/`, priority: "0.60" },
    { loc: `${DOMAIN}/privacy-policy/`, priority: "0.50" },
    { loc: `${DOMAIN}/terms/`, priority: "0.50" }
  ];

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((u) => `  <url>\n    <loc>${u.loc}</loc>\n    <priority>${u.priority}</priority>\n  </url>`).join("\n")}
</urlset>
`;
  writeFileEnsured("sitemap.xml", sitemap);
}

// Clean up deprecated single-page hub files if present
for (const oldFile of ["hub.html", "js/hub.js", "js/articles-data.js"]) {
  const full = path.join(__dirname, oldFile);
  if (fs.existsSync(full)) fs.unlinkSync(full);
}

buildBlogHome();
buildCategoryPages();
buildArticlePages();
buildCompliancePages();
buildAdsAndSitemap();
console.log("Successfully generated /blog/, 6 category sub-URLs, 6 SEO articles, 4 AdSense policy pages, ads.txt, and sitemap.xml!");
