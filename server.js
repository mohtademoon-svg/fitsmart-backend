import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

// إعدادات الوسائط وCORS
app.use(cors());
app.use(express.json({ limit: '15mb' }));

// =========================================================================
// قائمة الأكواد السرية الـ 300 (المخزنة على السيرفر فقط)
// =========================================================================
const monthlyCodes = [
  "MTH-9K4X-7R2Q","MTH-2N8L-5W9P","MTH-6T1Z-8K3V","MTH-4X7B-9L1M","MTH-8J2P-4V7C",
  "MTH-1W9R-6Q8T","MTH-5L3K-7N2Z","MTH-9C8V-2X5B","MTH-3P7M-1T4R","MTH-7K2W-8L9N",
  "MTH-2V6C-9J1X","MTH-8R4T-3K7P","MTH-4N1L-6W8Z","MTH-6B9X-2M5Q","MTH-1Z7K-4T8V",
  "MTH-5P2R-8C3W","MTH-9T6M-1L7N","MTH-3K8V-5X2B","MTH-7W1Z-9P4R","MTH-2C5Q-6J8T",
  "MTH-8L9N-4K2X","MTH-4V7P-8T1M","MTH-6X3B-2R9W","MTH-1M8K-7Z4C","MTH-5T2L-9V6P",
  "MTH-9R6W-3C8T","MTH-3Z1V-6K7N","MTH-7P8M-2X4B","MTH-2N4T-8L1Q","MTH-8C7K-5W9Z",
  "MTH-4K2P-9M6V","MTH-6L8R-1T3X","MTH-1V5W-7C9B","MTH-5X9Z-2N8T","MTH-9M3T-4K7L",
  "MTH-3T7K-8P2W","MTH-7B1R-6V4M","MTH-2W8L-9Z3C","MTH-8P5N-2T6Q","MTH-4Z9V-7M1K",
  "MTH-6C3T-8X2R","MTH-1K7W-4L9P","MTH-5R2M-6N8V","MTH-9V8B-1K4Z","MTH-3X4L-7T2W",
  "MTH-7N1P-9C5M","MTH-2T6Z-8K3R","MTH-8M9W-2V7Q","MTH-4L3X-5P8T","MTH-6W7R-1N2K",
  "MTH-1P4V-8T9C","MTH-5K8M-3L2W","MTH-9Z2T-7X6P","MTH-3C9L-4V1R","MTH-7V5W-8K3N",
  "MTH-2R1K-6M8Z","MTH-8T7P-2C4V","MTH-4M2B-9T5W","MTH-6N8X-1L7Q","MTH-1L9Z-3K4P",
  "MTH-5W3R-8V2M","MTH-9P7T-6C1K","MTH-3B2W-4N8Z","MTH-7T8L-9X3V","MTH-2K5M-7P1R",
  "MTH-8V1C-3W6T","MTH-4X9P-8L2N","MTH-6Z4T-5K7B","MTH-1C8V-2M9W","MTH-5M6K-7T3P",
  "MTH-9L2N-8R4Z","MTH-3W7X-1P5C","MTH-7R9M-4V8T","MTH-2T3B-6K1L","MTH-8K8W-9N2V",
  "MTH-4P5Z-7C3M","MTH-6V1T-2X8K","MTH-1N7L-8W4P","MTH-5C2R-9M6T","MTH-9X8K-3V1Z",
  "MTH-3L4P-6T7W","MTH-7M9V-2B5R","MTH-2Z3K-8P1N","MTH-8T6W-4L9C","MTH-4W8M-7R2T",
  "MTH-6K1Z-9C4V","MTH-1T5P-3N8X","MTH-5B9R-6K2L","MTH-9V4T-8W7M","MTH-3P2M-5L1K",
  "MTH-7L8W-4Z6R","MTH-2X1C-9T3P","MTH-8N7V-6M2W","MTH-4C3K-1L8Z","MTH-6M9T-5P4V",
  "MTH-5Z3T-7R8K","MTH-8B2W-1N4L","MTH-4K6V-9X5C","MTH-7T1M-3L8P","MTH-2R9P-6W3Z"
];

const yearlyCodes = [
  "YEA-8K2R-4W9M","YEA-3T7V-1X8L","YEA-7M9P-6C2K","YEA-2W4L-8Z5T","YEA-9C1X-3K7R",
  "YEA-5P8Z-7M4V","YEA-1L3T-9N2W","YEA-6V7K-2P8C","YEA-4Z2W-5L9X","YEA-8R6M-1T3P",
  "YEA-2T9C-7K4L","YEA-9W1P-8V6Z","YEA-3M5K-4R2W","YEA-7X8L-6T1M","YEA-1V4Z-3P9C",
  "YEA-6N2T-8W5K","YEA-4C9R-7L3V","YEA-8L1W-2M6P","YEA-2P7M-9T4Z","YEA-9K3V-5C8L",
  "YEA-5T8L-1W7R","YEA-1Z4P-6K2M","YEA-7R2C-8V9T","YEA-3W6M-4Z1K","YEA-8X9T-7P5W",
  "YEA-4M1K-2L8V","YEA-6P5W-9T3C","YEA-2V8R-1M7L","YEA-9L4Z-6W2P","YEA-5C7T-3K9M",
  "YEA-1T3M-8R4V","YEA-7K9W-5P1Z","YEA-3Z2L-7T8C","YEA-8V6P-4M2W","YEA-4W8T-9L5K",
  "YEA-6R1Z-3C7M","YEA-2M4V-8K9P","YEA-9P7L-2W3T","YEA-5X2T-6M8V","YEA-1K8W-4Z2C",
  "YEA-7L6M-9T1P","YEA-3C4Z-5R7K","YEA-8T9P-1W6L","YEA-4P2V-7L8M","YEA-6W7K-3M1T",
  "YEA-2Z1R-8C5W","YEA-9M8T-4V2Z","YEA-5L3P-6W9C","YEA-1V9K-7T4M","YEA-7T5W-2L8R",
  "YEA-3R8Z-9P3V","YEA-8C2M-5K7L","YEA-4K7L-1T9W","YEA-6X3T-8M4C","YEA-2W9P-7V1K",
  "YEA-9T1M-3L6Z","YEA-5Z6V-8P2T","YEA-1P4K-9W7C","YEA-7M2R-4Z8L","YEA-3V8T-6K5W",
  "YEA-8L5W-2T3M","YEA-4T9C-7M1V","YEA-6K2Z-5L8P","YEA-2R7L-3W9T","YEA-9W3M-8C4K",
  "YEA-5C8V-1P6Z","YEA-1M1T-4R7W","YEA-7Z9P-2K3L","YEA-3P6W-8V4T","YEA-8T2K-6M9C",
  "YEA-4V8L-9Z1M","YEA-6L4T-7W2P","YEA-2K7M-1C8V","YEA-9R5W-3T9L","YEA-5W2Z-8L4K",
  "YEA-1C9P-6M3T","YEA-7T3K-2V7W","YEA-3M8V-4P1Z","YEA-8Z4L-9R6C","YEA-4L1W-5T8M",
  "YEA-6P6T-3K2V","YEA-2W8C-7M4P","YEA-9K2L-1W9T","YEA-5M7Z-8R3V","YEA-1R4W-6P2L",
  "YEA-7V1T-9L5C","YEA-3T9M-2Z8K","YEA-8C3P-7W4L","YEA-4Z8K-1M6T","YEA-6M2V-9T7W",
  "YEA-2P5W-4R1Z","YEA-9L7C-8K3M","YEA-5T1Z-3P9V","YEA-1W6L-7C2T","YEA-7K4M-5W8P",
  "YEA-8Z5R-2T1L","YEA-4M3V-6K9X","YEA-7W7P-3C8M","YEA-2X2L-9R4T","YEA-5N8C-1P6W"
];

const lifetimeCodes = [
  "LIFE-7X9K-3M2W","LIFE-2V4T-8L1Z","LIFE-9P8C-5W7M","LIFE-4L2W-7K9P","LIFE-8T6M-1V3R",
  "LIFE-3M1Z-9P4K","LIFE-7W5L-2T8C","LIFE-1K9T-6R2V","LIFE-6C3W-4M8P","LIFE-5R7P-8Z1L",
  "LIFE-9Z2M-7L4W","LIFE-4T8K-3C9V","LIFE-8V1L-5P7T","LIFE-2M6W-9R3K","LIFE-7P4Z-1M8C",
  "LIFE-3L9T-6W2P","LIFE-6W1C-8K5M","LIFE-1T7V-4L2Z","LIFE-5K3P-9T8W","LIFE-8R8M-2Z4L",
  "LIFE-2Z5W-7M1K","LIFE-9C4L-8V6T","LIFE-4P1T-5W9M","LIFE-7M8V-3K2P","LIFE-3V2Z-6L7W",
  "LIFE-8L6C-1P4T","LIFE-6T9M-7W3K","LIFE-1W4K-2R8V","LIFE-5M2P-9Z6L","LIFE-9R7L-4T1C",
  "LIFE-2K3W-8M5Z","LIFE-7T8V-6P2W","LIFE-4Z1M-9L7K","LIFE-8P9T-2C4V","LIFE-3C5K-7W8M",
  "LIFE-6L2R-1Z9P","LIFE-1V8W-5M3T","LIFE-5W4Z-8T2K","LIFE-9M1P-6L7C","LIFE-2T7L-4V9W",
  "LIFE-8K9M-3P1Z","LIFE-4W3C-7R8L","LIFE-7Z6T-2K4M","LIFE-3P2V-9W5T","LIFE-6M8K-1L3C",
  "LIFE-1L5W-8T7P","LIFE-5T1Z-4M2V","LIFE-9V9P-7C6K","LIFE-2C4T-3W8L","LIFE-8W7L-5Z1M",
  "LIFE-4R2M-6K9T","LIFE-7K8P-1V4W","LIFE-3T3Z-9L8C","LIFE-6Z5W-2P7M","LIFE-1M9K-4T3L",
  "LIFE-5P6L-7W1Z","LIFE-9L4C-8M2V","LIFE-2W8T-5K9P","LIFE-8T2Z-3R7W","LIFE-4V7M-1L8K",
  "LIFE-7C1P-9T4M","LIFE-3K6W-4Z2L","LIFE-6M3L-8V9T","LIFE-1R8T-7P5C","LIFE-5Z2V-6W1K",
  "LIFE-9T7M-2L4P","LIFE-2P4K-9C8Z","LIFE-8W1Z-5T3M","LIFE-4L8P-7M2W","LIFE-7M5T-3V6L",
  "LIFE-3V9L-8K1C","LIFE-6C2W-4P7T","LIFE-1T4M-6Z8K","LIFE-5K8Z-9W3L","LIFE-9R3P-2T7V",
  "LIFE-2L1T-7M9W","LIFE-8Z6V-4K2C","LIFE-4M7C-1W5P","LIFE-7W2L-8T9M","LIFE-3T8P-5R4Z",
  "LIFE-6P4W-3L1K","LIFE-1K3Z-9V8T","LIFE-5C9T-2M6W","LIFE-9V2K-7P3L","LIFE-2M7L-6T8C",
  "LIFE-8T5W-4Z1P","LIFE-4W8M-3L9V","LIFE-7L1C-5K2T","LIFE-3Z6P-8W4M","LIFE-6K4T-9M7Z",
  "LIFE-1P2V-7T8L","LIFE-5M7W-6R3K","LIFE-9T3L-1V5P","LIFE-2C8Z-4W9T","LIFE-8L4M-2P1C",
  "LIFE-4V9K-8T6W","LIFE-7W2T-3L8Z","LIFE-3M6C-9P4K","LIFE-6T1P-7W2V","LIFE-1Z8L-4M5T"
];

// دمج الأكواد في جدول مرجعي
const serverLicenseKeys = {};
monthlyCodes.forEach(c => serverLicenseKeys[c] = { type: 'monthly', days: 30, name: 'شهري' });
yearlyCodes.forEach(c => serverLicenseKeys[c] = { type: 'yearly', days: 365, name: 'سنوي' });
lifetimeCodes.forEach(c => serverLicenseKeys[c] = { type: 'lifetime', days: 99999, name: 'مدى الحياة' });

// =========================================================================
// سجل الأكواد المستخدمة عالمياً (يمنع استخدام الكود لأكثر من شخص)
// =========================================================================
const usedCodesGlobal = new Set();

// فحص جاهزية السيرفر
app.get('/', (req, res) => {
  res.send('FitSmart Backend is running successfully!');
});

// =========================================================================
// 1. مسار التحقق الآمن مع حرق الكود لمرة واحدة فقط
// =========================================================================
app.post('/api/verify-code', (req, res) => {
  const { code } = req.body;
  if (!code) {
    return res.status(400).json({ valid: false, message: 'يرجى إدخال الكود' });
  }

  const cleanCode = code.trim().toUpperCase();

  // 1. التحقق هل الكود مستهلك عالمياً مسبقاً
  if (usedCodesGlobal.has(cleanCode)) {
    return res.status(400).json({
      valid: false,
      message: 'عذراً، تم استخدام هذا الكود وتفعيله مسبقاً!'
    });
  }

  // 2. التحقق من وجود الكود في قاعدة السيرفر
  const planInfo = serverLicenseKeys[cleanCode];

  if (planInfo) {
    // تسجيل الكود كمستهلك فوراً داخل السيرفر لمنع استخدامه ثانية
    usedCodesGlobal.add(cleanCode);

    return res.json({
      valid: true,
      type: planInfo.type,
      days: planInfo.days,
      name: planInfo.name
    });
  } else {
    return res.status(404).json({
      valid: false,
      message: 'كود التفعيل غير صالح، تأكد من كتابته بدقة.'
    });
  }
});

// =========================================================================
// 2. مسار معالجة طلبات الذكاء الاصطناعي (Gemini 3.6-flash)
// =========================================================================
app.post('/api/gemini', async (req, res) => {
  try {
    const { payload, model = 'gemini-3.6-flash' } = req.body;

    if (!payload) {
      return res.status(400).json({ error: 'البيانات المرسلة غير مكتملة' });
    }

    if (!GEMINI_API_KEY) {
      return res.status(500).json({ error: 'مفتاح GEMINI_API_KEY غير معرّف في بيئة السيرفر' });
    }

    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${GEMINI_API_KEY}`;
    const apiResponse = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const data = await apiResponse.json();

    if (!apiResponse.ok || data.error) {
      return res.status(apiResponse.status || 500).json({
        error: data.error ? (data.error.message || data.error) : 'فشل الرد من خوادم الذكاء الاصطناعي'
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
