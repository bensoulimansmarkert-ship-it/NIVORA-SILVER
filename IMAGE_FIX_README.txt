NIVORA SILVER — V3 IMAGE FIX
==============================

سبب عدم ظهور الصور في V2:
الصور كانت موجودة/مضافة كملفات، لكن صفحات الموقع لم تكن تستدعي مسارات الصور في HTML/JavaScript.

تم في V3:
1) ربط صور المنتجات بملف js/products.js.
2) ربط بطاقات المنتجات في js/app.js.
3) ربط صورة المنتج في صفحة product.html ديناميكيًا.
4) ربط صورة Hero في index.html.
5) ربط صور الفئات في الصفحة الرئيسية.
6) إضافة CSS لعرض الصور بشكل صحيح ومتجاوب.

مسار الصور المعتمد:
assets/images/...

مهم عند الرفع إلى GitHub:
يجب أن يكون:
index.html
assets/
  images/
    hero/
    products/
    categories/
    backgrounds/

ولا تضع مجلد assets داخل مجلد آخر بالخطأ.
