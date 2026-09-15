import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

// تفعيل CORS للسماح بالاتصال من الواجهة
app.use(cors());

// رفع الحد الأقصى لحجم البيانات لاستقبال صور الوجبات بصيغة Base64
app.use(express.json({ limit: '15mb' }));

// نقطة فحص للتأكد من عمل السيرفر في المتصفح
app.get('/', (req, res) => {
  res.send('FitSmart Backend is running successfully!');
});

// المسار الرئيسي لمعالجة طلبات الذكاء الاصطناعي
app.post('/api/gemini', async (req, res) => {
  try {
    const { payload, model = 'gemini-3.6-flash' } = req.body;

    if (!payload) {
      return res.status(400).json({ error: 'البيانات المرسلة غير مكتملة' });
    }

    if (!GEMINI_API_KEY) {
      return res.status(500).json({ error: 'مفتاح GEMINI_API_KEY غير معرّف في بيئة السيرفر' });
    }

        const modelsToTry = [model, 'gemini-2.5-flash', 'gemini-2.0-flash'];
    let apiResponse;
    let data;

    for (const currentModel of modelsToTry) {
      const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${currentModel}:generateContent?key=${GEMINI_API_KEY}`;
      apiResponse = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      data = await apiResponse.json();

      if (apiResponse.ok && !data.error) {
        break;
      }

      const errText = JSON.stringify(data.error || '');
      if (!errText.includes('high demand') && !errText.includes('overloaded') && apiResponse.status !== 503) {
        break;
      }
    }

    if (!apiResponse || !apiResponse.ok || data.error) {
      return res.status(apiResponse ? apiResponse.status : 500).json({
        error: data && data.error ? data.error.message : 'فشل الرد من خوادم الذكاء الاصطناعي'
      });
    }

    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'خطأ داخلي في الخادم: ' + error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
