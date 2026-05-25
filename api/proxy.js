const https = require('https');

module.exports = async (req, res) => {
    // السماح للتطبيق بالاتصال بالسيرفر بدون مشاكل CORS المزعجة
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-Secret-Key');
    res.setHeader('Content-Type', 'application/json; charset=utf-8');

    // التعامل مع طلبات الـ Preflight التي ترسلها المتصفحات تلقائياً
    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    // الرمز السري الخاص بتطبيقك للتحقق من الهوية وحمايته من الغرباء
    const APP_SECRET = "Q1w2e3r4t5y6u7i8o9p0M";
    const userSecret = req.headers['x-secret-key'];

    if (!userSecret || userSecret !== APP_SECRET) {
        res.status(403).json({ error: "غير مسموح بالدخول: الرمز السري غير صحيح أو مفقود." });
        return;
    }

    // مفتاح الـ API الحقيقي الخاص بك لجلب البيانات بأمان من الموقع الأصلي
    const API_KEY = "19b10cbe43c3403da9c7b0bd20964bed"; 

    const options = {
        hostname: 'api.football-data.org',
        path: '/v4/matches',
        method: 'GET',
        headers: {
            'X-Auth-Token': API_KEY
        }
    };

    // إرسال الطلب وجلب البيانات حية من موقع المباريات
    const apiReq = https.request(options, (apiRes) => {
        let data = '';
        apiRes.on('data', (chunk) => { data += chunk; });
        apiRes.on('end', () => {
            res.status(apiRes.statusCode).end(data);
        });
    });

    apiReq.on('error', (e) => {
        res.status(500).json({ error: "فشل الاتصال بالموقع الأصلي: " + e.message });
    });

    apiReq.end();
};
