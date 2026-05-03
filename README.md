# Statia Real Estate - Deployment Guide

دليل شامل لنشر تطبيق Statia على Vercel

## 📋 المحتويات

```
vercel_deploy/
├── api/                 # Backend API (Node.js + Express)
│   ├── server.js
│   ├── package.json
│   └── .env
├── src/                 # Frontend (React + Vite)
│   ├── components/
│   ├── context/
│   ├── pages/
│   └── assets/
├── public/              # Static assets
├── index.html
├── package.json
├── vite.config.js
└── vercel.json        # Vercel configuration
```

## 🚀 خطوات النشر

### 1. إعداد Git Repository

**إذا كان Git repository موجود مسبقاً:**

**لـ Linux/Mac:**
```bash
rm -rf .git
git init
git add .
git commit -m "Initial commit"
git branch -M main
```

**لـ Windows (PowerShell):**
```powershell
Remove-Item -Recurse -Force .git
git init
git add .
git commit -m "Initial commit"
git branch -M main
```

**أو للمشروع جديد:**

```bash
cd vercel_deploy
git init
git add .
git commit -m "Initial commit"
git branch -M main
```

### 2. إنشاء Repository على GitHub

**مهم جداً:** يجب إنشاء repository على GitHub أولاً قبل ربطه

**الخطوات بالتفصيل:**

1. افتح المتصفح واذهب إلى: https://github.com/new
2. تأكد من أنك مسجل الدخول بحسابك
3. املأ البيانات التالية:
   - **Repository name**: اكتب `statia-app` (بدون مسافات)
   - **Description**: اكتب `Statia Real Estate Application`
   - **Public/Private**: اختر حسب تفضيلك
4. انقر على زر **"Create repository"**
5. ستظهر صفحة جديدة مع URL للrepository
6. **مهم**: تأكد أن Repository name هو `statia-app` وليس أي شيء آخر

**بعد إنشاء Repository:**

الآن يمكنك ربط المشروع المحلي بهذا Repository باستخدام الأوامر في القسم التالي.

### 3. ربط بـ GitHub

```bash
git remote add origin https://github.com/MarcusKaram-source/statia-app.git
```

**إذا كان remote موجود مسبقاً:**
```bash
git remote set-url origin https://github.com/MarcusKaram-source/statia-app.git
```

**إذا كان remote موجود مسبقاً:**

```bash
git remote set-url origin https://github.com/MarcusKaram-source/statia-app.git
```

ثم ارفع الكود:

```bash
git push -u origin main
```

### 3. إعداد Vercel

1. سجل في [Vercel](https://vercel.com)
2. انقر "Add New Project"
3. استيراد من GitHub
4. اختر repository `statia-app`

### 4. إعداد متغيرات البيئة

في Vercel Dashboard، أضف المتغيرات التالية:

#### للمشروع الرئيسي:
```
VITE_API_URL=/api
```

#### للـ API:
```
PORT=3000
JWT_SECRET=your-production-secret-key-here
DATABASE_URL=postgresql://user:password@host:port/database
CORS_ORIGIN=https://your-app.vercel.app
```

### 5. نشر المشروع

Vercel سيقوم تلقائياً بنشر المشروع عند كل push إلى GitHub.

## 🔧 التكوين

### Frontend (Vite + React)
- **Framework**: Vite
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`

### Backend (Express + Node.js)
- **Framework**: Node.js
- **Build Command**: (لا يوجد)
- **Output Directory**: `.`
- **Install Command**: `npm install`

## 📝 هيكلية الـ API

### نقاط النهاية المتاحة:

#### المصادقة (Authentication)
- `POST /api/auth/login` - تسجيل الدخول
- `POST /api/auth/register` - إنشاء حساب جديد
- `PATCH /api/auth/profile` - تحديث الملف الشخصي
- `PATCH /api/auth/password` - تغيير كلمة المرور

#### العقارات (Properties)
- `GET /api/properties` - جلب جميع العقارات
- `GET /api/properties/:id` - جلب عقار محدد

#### الاستفسارات (Leads)
- `POST /api/leads` - إنشاء استفسار جديد
- `GET /api/leads` - جلب جميع الاستفسارات (Admin فقط)

#### المفضلة (Favorites)
- `POST /api/favorites` - إضافة للمفضلة
- `GET /api/favorites/check/:propertyId` - التحقق من المفضلة
- `DELETE /api/favorites/:propertyId` - حذف من المفضلة

#### المقارنة (Comparisons)
- `POST /api/comparisons` - إضافة للمقارنة
- `GET /api/comparisons/check/:propertyId` - التحقق من المقارنة
- `DELETE /api/comparisons/:propertyId` - حذف من المقارنة

#### الإشعارات (Notifications)
- `GET /api/notifications` - جلب الإشعارات
- `PUT /api/notifications/:id/read` - تعليم كـ مقروء
- `PUT /api/notifications/read-all` - تعليم الكل كـ مقروء
- `DELETE /api/notifications/:id` - حذف إشعار

#### الصحة (Health)
- `GET /api/health` - التحقق من حالة الخادم

## 🎨 الميزات

### Frontend
- ✅ React 18 مع Vite
- ✅ React Router للتوجيه
- ✅ دعم متعدد اللغات (English/Arabic)
- ✅ تصميم متجاوب (Responsive)
- ✅ دعم عملات متعددة (EGP/SAR/AED)
- ✅ نظام البحث والفلترة المتقدم
- ✅ نظام المفضلة والمقارنة

### Backend
- ✅ Express.js
- ✅ JWT للمصادقة
- ✅ CORS للـ cross-origin requests
- ✅ RESTful API design
- ✅ Error handling شامل

## 🔐 بيانات الدخول للتجربة

### حساب المسؤول:
```
Email: admin@statia.com
Password: admin
```

### حساب المستخدم:
```
Email: user@statia.com
Password: User@2025
```

## 📚 التبعيات

### Frontend
```json
{
  "react": "^18.2.0",
  "react-dom": "^18.2.0",
  "react-router-dom": "^7.14.2",
  "lucide-react": "^0.344.0",
  "vite": "^5.1.4"
}
```

### Backend
```json
{
  "express": "^4.18.2",
  "cors": "^2.8.5",
  "dotenv": "^16.3.1",
  "jsonwebtoken": "^9.0.2",
  "bcryptjs": "^2.4.3"
}
```

## 🌐 البيئة

### Development
```bash
# Frontend
cd vercel_deploy
npm run dev

# Backend
cd api
npm run dev
```

### Production
يتم النشر تلقائياً على Vercel عند كل push إلى GitHub.

## 📧 الصيانة

### تحديث التبعيات
```bash
npm install
```

### تشغيل الاختبار
```bash
npm run dev
```

## 🐛 حل المشاكل الشائعة

### خطأ في الاتصال بالـ API
- تأكد من أن `VITE_API_URL` مضبوط في متغيرات البيئة
- تحقق من أن الـ API يعمل على المنفذ الصحيح

### خطأ في المصادقة
- تأكد من أن الـ token يتم إرسله في header
- تحقق من صحة JWT_SECRET

### خطأ في البناء
```bash
rm -rf node_modules
rm package-lock.json
npm install
npm run build
```

## 📞 الدعم

للدعم الفني، يرجى:
1. فتح issue في GitHub
2. التواصل عبر البريد الإلكتروني

## 📄 الترخيص

هذا المشروع مفتوح المصدر ومتاح للاستخدام تحت رخصة MIT.

---

**Statia Real Estate** © 2025
>>>>>>> 00e07a39788a71866660d4414b5aecd4de807ca4
