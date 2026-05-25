const axios = require('axios');

module.exports = async (req, res) => {
    // 1. تفعيل حماية وهيدرز الـ CORS أولاً وقبل كل شيء ليقبل السيرفر اتصالات الهاتف
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, x-secret-key');
    res.setHeader('Content-Type', 'application/json; charset=utf-8');

    // 2. معالجة طلبات المزامنة المبدئية للمتصفحات (Preflight) بعد تعيين الهيدرز
    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    // 3. التحقق الذكي من الرمز السري وحماية سيرفرك (قراءة مرنة للحروف الكبيرة والصغيرة)
    const MY_SECRET = "Q1w2e3r4t5y6u7i8o9p0M";
    const secretKey = req.headers['x-secret-key'] || req.headers['X-Secret-Key'] || req.query.secret;

    if (!secretKey || secretKey !== MY_SECRET) {
        return res.status(403).json({ error: "غير مسموح بالدخول: الرمز السري غير صحيح أو مفقود." });
    }

    // 4. تحديد الرابط المطلوب بناءً على الـ endpoint المرسل من التطبيق
    const endpoint = req.query.endpoint || 'matches';
    const targetUrl = `https://api.football-data.org/v4/${endpoint}`;
    const API_KEY = "19b10cbe43c3403da9c7b0bd20964bed";

    // 5. حماية حسابك من الحظر (كاش مؤقت لمدة 30 ثانية لتقليل الضغط)
    res.setHeader('Cache-Control', 's-maxage=30, stale-while-revalidate');

    try {
        // جلب البيانات بطلقة واحدة وسريعة عبر axios
        const response = await axios.get(targetUrl, {
            headers: { 'X-Auth-Token': API_KEY }
        });
        
        // إرسال البيانات الناجحة لتطبيقك
        res.status(200).json(response.data);
    } catch (error) {
        console.error("Axios Error:", error.message);
        res.status(500).json({ error: "حدث خطأ أثناء جلب البيانات من الموقع العالمي." });
    }
};
