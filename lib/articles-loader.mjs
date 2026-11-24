// ============================================================================
// ARTICLES LOADER — reads articles from content/blog/*.md
// كل مقال ملف ماركداون بسيط في مجلد content/blog — عدّله من Pages CMS أو يدوياً.
//
// الحقول الإجبارية في الملف: title و category فقط.
// كل الباقي بيتعمل تلقائياً وقت البناء لو مش موجود:
//   slug     ← من اسم الملف (Pages CMS بيسمي الملف من العنوان)
//   date     ← تاريخ اليوم (بتوقيت القاهرة)
//   dateAr   ← مشتق من date (٢٥ نوفمبر ٢٠٢٦)
//   readTime ← محسوبة من عدد كلمات المقال
//   excerpt  ← أول فقرة في المقال
//   metaDesc ← نفس المقدمة مختصرة لـ ١٥٥ حرف
//   image    ← صورة افتراضية حسب القسم
//   order    ← المقالات بدون ترتيب تظهر بعد المرتبة (الأحدث أولاً)
//   promptText ← اختياري، لو مش موجود لا يظهر صندوق البرومبت
//
// الصيغة:
//   ---
//   title: "عنوان المقال"
//   category: "tutorials"
//   ---
//   ## عنوان أول قسم
//   فقرة نصية.
//   - نقطة
//   > نصيحة ختامية
// ============================================================================

import fs from "node:fs";
import path from "node:path";

const AR_MONTHS = ["يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو", "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر"];
const AR_DIGITS = "٠١٢٣٤٥٦٧٨٩";
const toArDigits = (s) => String(s).replace(/\d/g, (d) => AR_DIGITS[Number(d)]);

// صورة غلاف افتراضية لكل قسم (من صور الموقع الموجودة)
const DEFAULT_IMAGE = {
  prompts: "https://eslamtgd.top/assets/ad-10.jpg",
  courses: "https://eslamtgd.top/assets/work-2.jpg",
  "ai-tools": "https://eslamtgd.top/assets/work-4.jpg",
  tech: "https://eslamtgd.top/assets/ad-11.jpg",
  tutorials: "https://eslamtgd.top/assets/work-1.jpg",
  income: "https://eslamtgd.top/assets/ad-6.jpg"
};

function todayCairo() {
  return new Date(Date.now() + 2 * 3600 * 1000).toISOString().slice(0, 10);
}

function dateToAr(date) {
  const [y, m, d] = date.split("-").map(Number);
  return `${toArDigits(d)} ${AR_MONTHS[m - 1]} ${toArDigits(y)}`;
}

function readTimeFrom(body) {
  const words = body
    .replace(/^##[ \t]+.*$/gm, " ")
    .replace(/[#>*`\-\[\]()]/g, " ")
    .split(/\s+/).filter(Boolean).length;
  const mins = Math.max(3, Math.round(words / 180));
  if (mins === 1) return "دقيقة قراءة";
  if (mins === 2) return "دقيقتان قراءة";
  if (mins <= 10) return `${toArDigits(mins)} دقائق قراءة`;
  return `${toArDigits(mins)} دقيقة قراءة`;
}

function stripMd(s) {
  return s
    .replace(/\*\*([^*]+)\*\*/g, "$1")
    .replace(/\*([^*\n]+)\*/g, "$1")
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .trim();
}

function firstParagraph(body) {
  const blocks = body.split(/\r?\n\s*\r?\n/).map((b) => b.trim()).filter(Boolean);
  for (const b of blocks) {
    if (b.startsWith("#") || b.startsWith("- ") || b.startsWith(">")) continue;
    return stripMd(b.split(/\r?\n/).map((l) => l.trim()).join(" "));
  }
  return "";
}

function cap(s, max) {
  if (s.length <= max) return s;
  const cut = s.slice(0, max);
  const sp = cut.lastIndexOf(" ");
  return (sp > 40 ? cut.slice(0, sp) : cut).trim() + "…";
}

function parseFrontMatter(raw) {
  const m = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  if (!m) throw new Error("Missing front matter (--- ... ---)");
  const data = {};
  let key = null;
  for (const line of m[1].split(/\r?\n/)) {
    const kv = line.match(/^([A-Za-z]+):\s*(.*)$/);
    if (kv) {
      key = kv[1];
      data[key] = kv[2].trim();
    } else if (key && /^\s+\S/.test(line)) {
      // Pages CMS يلف القيم الطويلة على سطر زيادة مُزاح بمسافات — السطر المُزاح تكملة للقيمة
      data[key] += " " + line.trim();
    }
  }
  for (const k of Object.keys(data)) {
    let v = data[k];
    if (v.startsWith('"') && v.endsWith('"')) {
      v = v.slice(1, -1).replace(/\\"/g, '"').replace(/\\n/g, "\n").replace(/\\\\/g, "\\");
    }
    data[k] = v;
  }
  return { data, body: m[2] };
}

// تنسيقات بسيطة داخل السطر: **عريض** أو *عريض* و [نص](رابط) و ![صورة](رابط)
function inline(s) {
  return s
    .replace(/!\[([^\]]*)\]\((https?:[^)\s]+)\)/g, '<img src="$2" alt="$1" loading="lazy">')
    .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
    .replace(/\*([^*\n]+)\*/g, "<strong>$1</strong>")
    .replace(/\[([^\]]+)\]\((https?:[^)\s]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>');
}

function fillSection(sec, rest) {
  const blocks = rest.split(/\r?\n\s*\r?\n/).map((b) => b.trim()).filter(Boolean);
  for (const block of blocks) {
    const lines = block.split(/\r?\n/);
    if (lines.every((l) => /^!\[[^\]]*\]\([^)]+\)\s*$/.test(l.trim()))) {
      // صورة أو أكثر في سطر مستقل (صيغة بلوجسبوت/ماركداون)
      for (const l of lines) {
        const m = l.trim().match(/^!\[([^\]]*)\]\(([^)]+)\)$/);
        sec.images = (sec.images || []).concat({ src: m[2], alt: m[1] });
      }
    } else if (lines.every((l) => /^\d+[.)]\s+/.test(l.trim()))) {
      // قائمة مرقمة
      sec.ordered = (sec.ordered || []).concat(lines.map((l) => inline(l.trim().replace(/^\d+[.)]\s+/, ""))));
    } else if (lines.every((l) => l.trim().startsWith("- "))) {
      sec.bullets = (sec.bullets || []).concat(lines.map((l) => inline(l.trim().slice(2))));
    } else if (lines.every((l) => l.trim().startsWith(">"))) {
      sec.tip = inline(lines.map((l) => l.trim().replace(/^>[ \t]?/, "")).join(" "));
    } else {
      sec.paragraphs.push(inline(lines.map((l) => l.trim()).join(" ")));
    }
  }
  return sec;
}

function bodyToSections(body) {
  // أي عنوان ماركداون (## أو ### أو أكثر) يفتح قسماً جديداً
  const parts = body.split(/^#{2,6}[ \t]+/m);
  const sections = [];
  const intro = parts[0].trim();
  if (intro) {
    // محتوى قبل أول عنوان: مقدمة المقال بدون عنوان قسم
    sections.push(fillSection({ h2: "", paragraphs: [] }, intro));
  }
  for (const chunk of parts.slice(1).map((c) => c.trim()).filter(Boolean)) {
    const nl = chunk.indexOf("\n");
    let h2 = nl === -1 ? chunk.trim() : chunk.slice(0, nl).trim();
    h2 = inline(h2.replace(/[ \t]+#+$/, "")); // تنظيف # الختامية وتفعيل الروابط والتنسيق داخل العنوان
    const rest = nl === -1 ? "" : chunk.slice(nl + 1);
    sections.push(fillSection({ h2, paragraphs: [] }, rest));
  }
  return sections;
}

export function loadArticles(dir) {
  if (!fs.existsSync(dir)) return [];
  const files = fs.readdirSync(dir).filter((f) => f.endsWith(".md")).sort();
  const articles = files.map((f) => {
    const { data, body } = parseFrontMatter(fs.readFileSync(path.join(dir, f), "utf8"));
    if (!data.category || !data.title) {
      throw new Error(`content/blog/${f}: title و category حقول إجبارية`);
    }
    const slug = data.slug || f.replace(/\.md$/, "");
    const date = data.date || todayCairo();
    const excerpt = data.excerpt || cap(firstParagraph(body), 240);
    return {
      slug,
      category: data.category,
      order: data.order ? Number(data.order) : 999,
      title: data.title,
      metaDesc: data.metaDesc || cap(excerpt, 155),
      date,
      dateAr: data.dateAr || dateToAr(date),
      readTime: data.readTime || readTimeFrom(body),
      image: data.image || DEFAULT_IMAGE[data.category] || "",
      excerpt,
      promptText: data.promptText || null,
      sections: bodyToSections(body)
    };
  });
  articles.sort((a, b) =>
    (a.order - b.order) ||
    String(b.date).localeCompare(String(a.date)) ||
    a.slug.localeCompare(b.slug)
  );
  return articles;
}
