# Eslam Thabet (@eslamtgd) — Portfolio Studio + AdSense-Ready Tech & AI Magazine

منظومة موقعك المتكاملة والجاهزة للرفع المباشر على **`eslamtgd.top`**.

## ١. هيكل الروابط الفرعية المستقلة (معزولة تماماً عن صفحتك الشخصية)

- **الموقع الشخصي ومعرض الأعمال (بدون أي تشتيت):**
  - `https://eslamtgd.top/` (`index.html`) — يحتوي فقط على زر واحد أنيق (`المدونة والأقسام ↗`) ينقل الزائر إلى المدونة.
- **المدونة والأقسام الفرعية المستقلة (مهيأة لـ SEO و Google AdSense):**
  - `https://eslamtgd.top/blog/` — رئيسية المدونة
  - `https://eslamtgd.top/blog/prompts/` — قسم برومبتات الذكاء الاصطناعي
  - `https://eslamtgd.top/blog/courses/` — قسم الكورسات المجانية والتعلّم الذاتي
  - `https://eslamtgd.top/blog/ai-tools/` — قسم مواقع وأدوات AI المجانية
  - `https://eslamtgd.top/blog/tech/` — قسم التقنية وأخبار التكنولوجيا
  - `https://eslamtgd.top/blog/tutorials/` — قسم شروحات وتقنيات صناعة المحتوى
  - `https://eslamtgd.top/blog/income/` — قسم الربح من الإنترنت والعمل الحر بالـ AI
- **صفحات القبول الإلزامية في Google AdSense:**
  - `https://eslamtgd.top/privacy-policy/` — سياسة الخصوصية (تتضمن بنود Google AdSense وملفات DART نصياً)
  - `https://eslamtgd.top/terms/` — شروط الاستخدام
  - `https://eslamtgd.top/about/` — من نحن ورسالة المنصة
  - `https://eslamtgd.top/contact/` — اتصل بنا (`eslamthabet@gmail.com`)
  - `https://eslamtgd.top/ads.txt` — ملف تعريف الناشر الرسمي

## ٢. كيف تفعّل إعلانات Google AdSense بعد القبول؟
1. افتح الملف `blog/js/adsense-config.js` وضع رقم الناشر الخاص بك بدلاً من `ca-pub-0000000000000000` وغيّر `ADSENSE_ACTIVE` إلى `true`.
2. حدّث نفس الرقم في ملف `ads.txt`.
3. لمعاينة أماكن ظهور الإعلانات الآن قبل التفعيل، أضف `?preview_ads=1` في نهاية أي رابط بالمدونة (مثال: `/blog/?preview_ads=1`).

## ٣. كيف تنشر مقالات جديدة بدون كود؟
- افتح الأداة البصرية المدمجة: `/blog/publisher.html`، اكتب المقال واختر القسم، ثم اضغط **تحميل ملف `index.html`** وارفعه داخل مجلد القسم المقابل!
