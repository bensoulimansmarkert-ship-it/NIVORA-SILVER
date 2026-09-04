# NIVORA SILVER — Complete GitHub Pages Foundation

هذا المشروع جاهز للرفع إلى GitHub Pages كواجهة متجر RTL فاخرة ومتجاوبة، ويحتوي على:
- الرئيسية
- المتجر والفلترة والبحث
- تفاصيل المنتج
- السلة والدفع
- لوحة إدارة ومحاسبة
- إعداد هامش ربح افتراضي 10%
- إدارة Vodafone Cash وIBAN من لوحة الإعدادات
- قائمة طلبات ومبيعات
- قائمة روابط AliExpress للاستيراد للمراجعة

## مهم جدًا بخصوص AliExpress
GitHub Pages استضافة Static، لذلك لا يجب وضع مفاتيح API السرية أو بيانات اعتماد AliExpress داخل ملفات JavaScript العامة. كذلك لا يمكن الاعتماد على المتصفح مباشرة لسحب صور/بيانات AliExpress بسبب CORS وسياسات الوصول.

الربط الإنتاجي المقترح:
AliExpress/DSers → Backend آمن → NIVORA → العميل

DSers يدعم استيراد منتجات AliExpress وربط الموردين ومزامنة الطلبات والتتبع، ويمكن استخدامه كطبقة dropshipping. راجع التوثيق الرسمي قبل تفعيل الحساب.

## هامش الربح
الإعداد الافتراضي 10%. السعر النهائي في النسخة التجريبية هو السعر المخزن في المنتج. عند إضافة Backend، اجعل المعادلة الإنتاجية تعتمد على:
تكلفة المنتج + تكلفة الشحن + الرسوم المؤكدة، ثم تطبيق سياسة الربح التي تعتمدها.

## الإدارة
البيانات الافتراضية للنسخة التجريبية:
Username: admin
Password: 123456

غيّرها قبل الاستخدام الحقيقي. هذا الدخول Frontend/localStorage وليس نظام مصادقة إنتاجي. للإطلاق التجاري يجب نقل المصادقة إلى Backend وقاعدة بيانات مع كلمات مرور مجزأة وجلسات آمنة.

## الدفع
Vodafone Cash: 01065859268
يمكن حفظ IBAN من لوحة الإعدادات، لكن IBAN ليس Payment Gateway. للدفع التلقائي نحتاج مزود دفع/بوابة دفع تدعم البلد والطريقة المطلوبة مع API/Webhook.

## الرفع
ارفع محتويات مجلد المشروع إلى مستودع GitHub، ثم فعّل GitHub Pages من Settings → Pages → Deploy from branch.
ابدأ من index.html.

## الملفات المهمة
index.html
shop.html
product.html
checkout.html
admin/login.html
admin/index.html
css/main.css
js/products.js
js/app.js
js/admin.js
data/products.json
api/README.md
