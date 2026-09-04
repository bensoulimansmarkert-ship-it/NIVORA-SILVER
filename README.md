# NIVORA SILVER — COMPLETE STORE FOUNDATION

هذه نسخة كاملة كبنية تشغيلية لمتجر فضة فاخر RTL، مع:
- Home / Shop / Product / Checkout
- تصميم داكن فاخر قريب من المرجع
- سلة محلية
- لوحة إدارة
- تسجيل دخول
- منتجات / طلبات / محاسبة / إعدادات
- هامش ربح افتراضي 10%
- Vodafone Cash
- IBAN كبيانات حساب، وليس بوابة دفع تلقائية
- بنية AliExpress/DSers
- Backend Node/Express
- PHP bridge بسيط للاستضافة التي تدعم PHP

## مهم قبل الإنتاج
1. غيّر كلمة مرور الإدارة.
2. استخدم HTTPS.
3. لا ترفع API keys أو secrets إلى GitHub.
4. ربط AliExpress الحقيقي يحتاج API/DSers معتمد.
5. الدفع التلقائي يحتاج بوابة دفع/API تدعم الطريقة المطلوبة؛ Vodafone Cash اليدوي في هذه النسخة يعتمد على مراجعة الإدارة.
6. GitHub Pages يشغّل الواجهة الثابتة فقط، وليس Node.js server.

## تشغيل الخادم
cd server
npm install
npm start

ثم اجعل الواجهة تتصل بعنوان الخادم الحقيقي بدل المسار المحلي عند الاستضافة.

## رفع GitHub
ارفع محتويات هذا المجلد إلى جذر المستودع بحيث يكون index.html في الجذر.
