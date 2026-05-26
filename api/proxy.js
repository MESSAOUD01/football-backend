// Cache في الذاكرة — يخزن النتائج ويوزعها لكل المستخدمين
const cache = {};

// مدة الـ Cache لكل نوع طلب (بالثواني)
const CACHE_DURATION = {
  LIVE: 30,        // مباريات مباشرة: 30 ثانية
  SCHEDULED: 300,  // مباريات قادمة: 5 دقائق  
  FINISHED: 600,   // نتائج: 10 دقائق
  DEFAULT: 60,
};

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  if (req.method === "OPTIONS") return res.status(200).end();

  const { path, ...params } = req.query;
  if (!path) return res.status(400).json({ error: "Missing path" });

  const apiKey = process.env.FOOTBALL_API_KEY;
  if (!apiKey) return res.status(500).json({ error: "API key not set" });

  // مفتاح الـ Cache = المسار + الباراميترات
  const cacheKey = path + JSON.stringify(params);
  
  // تحديد مدة الـ Cache حسب نوع الطلب
  const status = params.status || "DEFAULT";
  let duration = CACHE_DURATION.DEFAULT;
  if (status.includes("IN_PLAY") || status.includes("LIVE")) duration = CACHE_DURATION.LIVE;
  else if (status === "SCHEDULED") duration = CACHE_DURATION.SCHEDULED;
  else if (status === "FINISHED") duration = CACHE_DURATION.FINISHED;

  // تحقق من الـ Cache — إذا موجود وما انتهت مدته، أرسله مباشرة
  const now = Date.now();
  if (cache[cacheKey] && (now - cache[cacheKey].time) < duration * 1000) {
    res.setHeader("X-Cache", "HIT"); // مؤشر أن البيانات من الـ Cache
    return res.status(200).json(cache[cacheKey].data);
  }

  // طلب جديد من API (يحصل مرة واحدة فقط لكل الفترة)
  const qs = new URLSearchParams(params).toString();
  const url = `https://api.football-data.org/v4${path}${qs ? "?" + qs : ""}`;

  try {
    const response = await fetch(url, {
      headers: { "X-Auth-Token": apiKey }
    });
    const data = await response.json();

    // خزّن في الـ Cache
    cache[cacheKey] = { data, time: now };

    res.setHeader("X-Cache", "MISS"); // مؤشر أن البيانات جديدة من API
    return res.status(response.status).json(data);
  } catch (err) {
    // إذا فشل الطلب وعندنا cache قديم، أرسله كاحتياط
    if (cache[cacheKey]) {
      res.setHeader("X-Cache", "STALE");
      return res.status(200).json(cache[cacheKey].data);
    }
    return res.status(500).json({ error: err.message });
  }
}
