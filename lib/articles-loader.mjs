// ============================================================================
// ARTICLES LOADER — reads articles from content/blog/*.md
// كل مقال ملف ماركداون بسيط في مجلد content/blog — عدّله من Pages CMS أو يدوياً.
// الصيغة:
//   ---  (بيانات المقال بين سطرين ---)
//   slug: "english-url-name"
//   order: 1
//   category: "prompts"
//   title: "عنوان المقال"
//   ...
//   ---
//   ## عنوان أول قسم
//   فقرة نصية.
//   - نقطة
//   > نصيحة ختامية
// ============================================================================

import fs from "node:fs";
import path from "node:path";

function parseFrontMatter(raw) {
  const m = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  if (!m) throw new Error("Missing front matter (--- ... ---)");
  const data = {};
  for (const line of m[1].split(/\r?\n/)) {
    const kv = line.match(/^([A-Za-z]+):\s*(.*)$/);
    if (!kv) continue;
    let v = kv[2].trim();
    if (v.startsWith('"') && v.endsWith('"')) {
      v = v.slice(1, -1).replace(/\\"/g, '"').replace(/\\n/g, "\n").replace(/\\\\/g, "\\");
    }
    data[kv[1]] = v;
  }
  return { data, body: m[2] };
}

// تنسيقات بسيطة داخل السطر: **عريض** و [نص](رابط)
function inline(s) {
  return s
    .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
    .replace(/\[([^\]]+)\]\((https?:[^)\s]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>');
}

function bodyToSections(body) {
  const chunks = body.split(/^##[ \t]+/m).map((c) => c.trim()).filter(Boolean);
  return chunks.map((chunk) => {
    const nl = chunk.indexOf("\n");
    const h2 = nl === -1 ? chunk.trim() : chunk.slice(0, nl).trim();
    const rest = nl === -1 ? "" : chunk.slice(nl + 1);
    const sec = { h2, paragraphs: [] };
    const blocks = rest.split(/\r?\n\s*\r?\n/).map((b) => b.trim()).filter(Boolean);
    for (const block of blocks) {
      const lines = block.split(/\r?\n/);
      if (lines.every((l) => l.trim().startsWith("- "))) {
        sec.bullets = (sec.bullets || []).concat(lines.map((l) => inline(l.trim().slice(2))));
      } else if (lines.every((l) => l.trim().startsWith(">"))) {
        sec.tip = inline(lines.map((l) => l.trim().replace(/^>[ \t]?/, "")).join(" "));
      } else {
        sec.paragraphs.push(inline(lines.map((l) => l.trim()).join(" ")));
      }
    }
    return sec;
  });
}

export function loadArticles(dir) {
  if (!fs.existsSync(dir)) return [];
  const files = fs.readdirSync(dir).filter((f) => f.endsWith(".md")).sort();
  const articles = files.map((f) => {
    const { data, body } = parseFrontMatter(fs.readFileSync(path.join(dir, f), "utf8"));
    if (!data.slug || !data.category || !data.title) {
      throw new Error(`content/blog/${f}: slug و category و title حقول إجبارية`);
    }
    return {
      slug: data.slug,
      category: data.category,
      order: data.order ? Number(data.order) : 999,
      title: data.title,
      metaDesc: data.metaDesc || data.excerpt || "",
      date: data.date || "",
      dateAr: data.dateAr || data.date || "",
      readTime: data.readTime || "٥ دقائق قراءة",
      image: data.image || "",
      excerpt: data.excerpt || "",
      promptText: data.promptText || null,
      sections: bodyToSections(body)
    };
  });
  articles.sort((a, b) => (a.order - b.order) || a.slug.localeCompare(b.slug));
  return articles;
}
