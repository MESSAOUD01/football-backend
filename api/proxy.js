const cache = {};
const CACHE_DURATION = {
  LIVE: 30,
  SCHEDULED: 300,
  FINISHED: 600,
  DEFAULT: 60,
};

// 🆓 مصادر مجانية بدون API Key
const FREE_SOURCES = [
  {
    id: "thesportsdb",
    fetchLive: async () => {
  fetchLive: async () => {
  const today = new Date().toISOString().split('T')[0];
  const r = await fetch(
    `https://www.thesportsdb.com/api/v1/json/3/eventsday.php?d=${today}&s=Soccer`
  );
      );
      const d = await r.json();
      return (d.events || []).map(e => ({
        id: e.idEvent,
        home: e.strHomeTeam,
        away: e.strAwayTeam,
        homeScore: e.intHomeScore,
        awayScore: e.intAwayScore,
        status: e.strStatus === "Match Finished" ? "FINISHED" :
                e.strProgress ? "LIVE" : "SCHEDULED",
        minute: e.strProgress || null,
        league: e.strLeague,
        homeLogo: `https://www.thesportsdb.com/images/media/team/badge/${e.idHomeTeam}.png`,
        awayLogo: `https://www.thesportsdb.com/images/media/team/badge/${e.idAwayTeam}.png`,
        source: "thesportsdb",
      }));
    }
  },
  {
    id: "openfootball",
    fetchLive: async () => {
      const r = await fetch(
        "https://raw.githubusercontent.com/openfootball/football.json/master/2024-25/en.1.json"
      );
      const d = await r.json();
      const matches = [];
      (d.rounds || []).forEach(round => {
        (round.matches || []).forEach(m => {
          matches.push({
            id: `of_${m.date}_${m.team1?.name}`,
            home: m.team1?.name || "",
            away: m.team2?.name || "",
            homeScore: m.score?.ft?.[0] ?? null,
            awayScore: m.score?.ft?.[1] ?? null,
            status: m.score?.ft ? "FINISHED" : "SCHEDULED",
            minute: null,
            league: "Premier League",
            homeLogo: null,
            awayLogo: null,
            source: "openfootball",
          });
        });
      });
      return matches;
    }
  }
];

let sourceIndex = 0;

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  if (req.method === "OPTIONS") return res.status(200).end();

  const cacheKey = "matches_" + (req.query.league || "all");
  const now = Date.now();

  // ✅ رجّع من Cache لو لسه صالح
  if (cache[cacheKey] && (now - cache[cacheKey].time) < 30000) {
    res.setHeader("X-Cache", "HIT");
    res.setHeader("X-Source", cache[cacheKey].source);
    return res.status(200).json(cache[cacheKey].data);
  }

  // 🔄 جرّب المصادر بالتناوب
  const tried = new Set();
  while (tried.size < FREE_SOURCES.length) {
    const src = FREE_SOURCES[sourceIndex % FREE_SOURCES.length];
    sourceIndex++;
    if (tried.has(src.id)) continue;
    tried.add(src.id);

    try {
      const matches = await src.fetchLive();
      const result = { matches, source: src.id, timestamp: now };
      cache[cacheKey] = { data: result, time: now, source: src.id };
      res.setHeader("X-Cache", "MISS");
      res.setHeader("X-Source", src.id);
      return res.status(200).json(result);
    } catch (err) {
      console.error(`Source ${src.id} failed:`, err.message);
    }
  }

  // ❌ كل المصادر فشلت — رجّع Cache القديم لو موجود
  if (cache[cacheKey]) {
    res.setHeader("X-Cache", "STALE");
    return res.status(200).json(cache[cacheKey].data);
  }

  return res.status(500).json({ error: "All sources failed" });
}
