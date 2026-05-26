export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  if (req.method === "OPTIONS") return res.status(200).end();

  const { path, ...params } = req.query;
  
  if (!path) {
    return res.status(400).json({ error: "Missing path" });
  }

  const apiKey = process.env.FOOTBALL_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: "API key not set" });
  }

  const qs = new URLSearchParams(params).toString();
  const url = `https://api.football-data.org/v4${path}${qs ? "?" + qs : ""}`;

  try {
    const response = await fetch(url, {
      headers: { "X-Auth-Token": apiKey }
    });
    const data = await response.json();
    return res.status(response.status).json(data);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
