const cache = {};

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  🆓 مصادر مجانية 100% بدون API Key
//  TheSportsDB - لا يحتاج مفتاح على الإطلاق
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

function todayStr() {
  return new Date().toISOString().split("T")[0];
}

// خريطة شعارات الفرق الشهيرة
const LOGOS = {
  "Cruz Azul":      "https://crests.football-data.org/cropped/466.png",
  "Pumas UNAM":     "https://upload.wikimedia.org/wikipedia/en/thumb/8/82/Pumas_UNAM_logo.svg/200px-Pumas_UNAM_logo.svg.png",
  "LA Galaxy":      "https://crests.football-data.org/cropped/1629.png",
  "Inter Miami":    "https://upload.wikimedia.org/wikipedia/en/thumb/a/a2/Inter_Miami_CF_crest.svg/200px-Inter_Miami_CF_crest.svg.png",
  "Seattle Sounders":"https://upload.wikimedia.org/wikipedia/en/thumb/1/1b/Seattle_Sounders_FC.svg/200px-Seattle_Sounders_FC.svg.png",
  "LAFC":           "https://upload.wikimedia.org/wikipedia/en/thumb/3/33/Los_Angeles_FC_logo.svg/200px-Los_Angeles_FC_logo.svg.png",
  "Flamengo":       "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2e/Flamengo_badge.svg/200px-Flamengo_badge.svg.png",
  "Palmeiras":      "https://upload.wikimedia.org/wikipedia/commons/thumb/1/10/Palmeiras_logo.svg/200px-Palmeiras_logo.svg.png",
  "Boca Juniors":   "https://crests.football-data.org/cropped/7784.png",
  "River Plate":    "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a8/River_Plate_logo.svg/200px-River_Plate_logo.svg.png",
};

function getLogo(teamName) {
  for (const [key, url] of Object.entries(LOGOS)) {
    if (teamName?.includes(key) || key?.includes(teamName)) return url;
  }
  return null;
}

// ━━ Source 1: TheSportsDB — مباريات اليوم ━━
async function fetchTheSportsDB() {
  const today = todayStr();
  const url = `https://www.thesportsdb.com/api/v1/json/3/eventsday.php?d=${today}&s=Soccer`;
  const r = await fetch(url);
  const d = await r.json();
  if (!d.events) return [];

  return d.events.map((e) => ({
    id: `tsdb_${e.idEvent}`,
    home: e.strHomeTeam,
    away: e.strAwayTeam,
    homeScore: e.intHomeScore !== null ? parseInt(e.intHomeScore) : null,
    awayScore: e.intAwayScore !== null ? parseInt(e.intAwayScore) : null,
    status:
      e.strStatus === "Match Finished" || e.strStatus === "FT"
        ? "FT"
        : e.strProgress && e.strProgress !== ""
        ? "LIVE"
        : "NS",
    minute: e.strProgress || null,
    league: e.strLeague,
    leagueCountry: e.strCountry,
    homeLogo:
      e.strHomeTeamBadge ||
      getLogo(e.strHomeTeam) ||
      `https://www.thesportsdb.com/images/media/team/badge/${e.idHomeTeam}.png`,
    awayLogo:
      e.strAwayTeamBadge ||
      getLogo(e.strAwayTeam) ||
      `https://www.thesportsdb.com/images/media/team/badge/${e.idAwayTeam}.png`,
    venue: e.strVenue,
    time: e.strTime,
    source: "thesportsdb",
  }));
}

// ━━ Source 2: TheSportsDB — دوري MLS ━━
async function fetchMLS() {
  // League ID 4346 = MLS
  const url = `https://www.thesportsdb.com/api/v1/json/3/eventsnextleague.php?id=4346`;
  const r = await fetch(url);
  const d = await r.json();
  if (!d.events) return [];

  return d.events.slice(0, 6).map((e) => ({
    id: `mls_${e.idEvent}`,
    home: e.strHomeTeam,
    away: e.strAwayTeam,
    homeScore: null,
    awayScore: null,
    status: "NS",
    minute: null,
    league: "MLS",
    leagueCountry: "USA",
    homeLogo: e.strHomeTeamBadge || getLogo(e.strHomeTeam),
    awayLogo: e.strAwayTeamBadge || getLogo(e.strAwayTeam),
    venue: e.strVenue,
    time: e.strTime,
    source: "thesportsdb",
  }));
}

// ━━ Source 3: TheSportsDB — آخر نتائج Liga MX ━━
async function fetchLigaMX() {
  // League ID 4350 = Liga MX
  const url = `https://www.thesportsdb.com/api/v1/json/3/eventspastleague.php?id=4350`;
  const r = await fetch(url);
  const d = await r.json();
  if (!d.events) return [];

  return d.events.slice(-5).map((e) => ({
    id: `lmx_${e.idEvent}`,
    home: e.strHomeTeam,
    away: e.strAwayTeam,
    homeScore: e.intHomeScore !== null ? parseInt(e.intHomeScore) : null,
    awayScore: e.intAwayScore !== null ? parseInt(e.intAwayScore) : null,
    status: "FT",
    minute: "90",
    league: "Liga MX",
    leagueCountry: "Mexico",
    homeLogo: e.strHomeTeamBadge || getLogo(e.strHomeTeam),
    awayLogo: e.strAwayTeamBadge || getLogo(e.strAwayTeam),
    venue: e.strVenue,
    time: e.strTime,
    source: "thesportsdb",
  }));
}

// ━━ Source 4: TheSportsDB — البرازيل Serie A ━━
async function fetchBrazil() {
  // League ID 4351 = Brazil Serie A
  const url = `https://www.thesportsdb.com/api/v1/json/3/eventsnextleague.php?id=4351`;
  const r = await fetch(url);
  const d = await r.json();
  if (!d.events) return [];

  return d.events.slice(0, 5).map((e) => ({
    id: `bra_${e.idEvent}`,
    home: e.strHomeTeam,
    away: e.strAwayTeam,
    homeScore: null,
    awayScore: null,
    status: "NS",
    minute: null,
    league: "Brazil Serie A",
    leagueCountry: "Brazil",
    homeLogo: e.strHomeTeamBadge || getLogo(e.strHomeTeam),
    awayLogo: e.strAwayTeamBadge || getLogo(e.strAwayTeam),
    venue: e.strVenue,
    time: e.strTime,
    source: "thesportsdb",
  }));
}

// ━━ Source 5: TheSportsDB — الأرجنتين ━━
async function fetchArgentina() {
  // League ID 4406 = Argentine Primera Division
  const url = `https://www.thesportsdb.com/api/v1/json/3/eventsnextleague.php?id=4406`;
  const r = await fetch(url);
  const d = await r.json();
  if (!d.events) return [];

  return d.events.slice(0, 5).map((e) => ({
    id: `arg_${e.idEvent}`,
    home: e.strHomeTeam,
    away: e.strAwayTeam,
    homeScore: null,
    awayScore: null,
    status: "NS",
    minute: null,
    league: "Argentina Primera",
    leagueCountry: "Argentina",
    homeLogo: e.strHomeTeamBadge || getLogo(e.strHomeTeam),
    awayLogo: e.strAwayTeamBadge || getLogo(e.strAwayTeam),
    venue: e.strVenue,
    time: e.strTime,
    source: "thesportsdb",
  }));
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  HANDLER رئيسي
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  if (req.method === "OPTIONS") return res.status(200).end();

  const { type = "all" } = req.query;
  const cacheKey = `matches_${type}`;
  const now = Date.now();
  const CACHE_MS = 30000; // 30 ثانية

  // ✅ Cache hit
  if (cache[cacheKey] && now - cache[cacheKey].time < CACHE_MS) {
    res.setHeader("X-Cache", "HIT");
    return res.status(200).json(cache[cacheKey].data);
  }

  try {
    // جلب من كل المصادر بالتوازي
    const [today, mls, ligamx, brazil, argentina] = await Promise.allSettled([
      fetchTheSportsDB(),
      fetchMLS(),
      fetchLigaMX(),
      fetchBrazil(),
      fetchArgentina(),
    ]);

    const allMatches = [
      ...(today.status === "fulfilled" ? today.value : []),
      ...(mls.status === "fulfilled" ? mls.value : []),
      ...(ligamx.status === "fulfilled" ? ligamx.value : []),
      ...(brazil.status === "fulfilled" ? brazil.value : []),
      ...(argentina.status === "fulfilled" ? argentina.value : []),
    ];

    // إزالة التكرار بالـ id
    const unique = Array.from(
      new Map(allMatches.map((m) => [m.id, m])).values()
    );

    // ترتيب: الحية أولاً ثم المجدولة ثم المنتهية
    const order = { LIVE: 0, NS: 1, FT: 2 };
    unique.sort((a, b) => (order[a.status] ?? 1) - (order[b.status] ?? 1));

    const result = {
      matches: unique,
      total: unique.length,
      live: unique.filter((m) => m.status === "LIVE").length,
      sources: ["thesportsdb×5"],
      timestamp: now,
      cached: false,
    };

    cache[cacheKey] = { data: result, time: now };
    res.setHeader("X-Cache", "MISS");
    return res.status(200).json(result);
  } catch (err) {
    // رجّع Cache قديم لو فشل كل شيء
    if (cache[cacheKey]) {
      res.setHeader("X-Cache", "STALE");
      return res.status(200).json({ ...cache[cacheKey].data, cached: true });
    }
    return res.status(500).json({ error: err.message });
  }
    }
