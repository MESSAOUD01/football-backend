const axios = require('axios');

module.exports = async (req, res) => {
    // تفعيل الـ CORS لتسمح لتطبيق الهاتف بالاتصال بالسيرفر
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, X-Secret-Key');

    // التعامل مع طلبات الـ OPTIONS المبدئية من الهواتف
    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    // 1. حزام الأمان: التأكد من وجود الرمز السري الصحيح لحماية سيرفرك
    const secretKey = req.headers['x-secret-key'] || req.query.secret;
    const MY_SECRET = "Q1w2e3r4t5y6u7i8o9p0M";

    if (!secretKey || secretKey !== MY_SECRET) {
        return res.status(403).json({ error: "غير مسموح بالدخول: الرمز السري غير صحيح أو مفقود!" });
    }

    // 2. سحر الذاكرة المؤقتة (Cache) لمدة 30 ثانية لحماية حسابك من الحظر والتوقف
    res.setHeader('Cache-Control', 's-maxage=30, stale-while-revalidate');

    // 3. تحديد الرابط المطلوب (إما مباريات اليوم تلقائياً أو الترتيب حسب اختيار المستخدم)
    const endpoint = req.query.endpoint || 'matches';
    const targetUrl = `https://api.football-data.org/v4/${endpoint}`;
    const API_KEY = "19b10cbe43c3403da9c7b0bd20964bed";

    try {
        const response = await axios.get(targetUrl, {
            headers: { 'X-Auth-Token': API_KEY }
        });
        // إرسال البيانات للتطبيق بنجاح
        res.status(200).json(response.data);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "حدث خطأ أثناء جلب البيانات من الموقع العالمي" });
    }
};
