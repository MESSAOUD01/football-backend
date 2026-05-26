<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1">
<title>MatchPulse ⚽</title>
<link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Cairo:wght@400;600;700;900&display=swap" rel="stylesheet">
<style>
*{box-sizing:border-box;margin:0;padding:0;-webkit-tap-highlight-color:transparent}
html,body{height:100%;overflow:hidden;background:#07090f;color:#ddeeff;font-family:'Cairo',sans-serif}
@keyframes spin{to{transform:rotate(360deg)}}
@keyframes blink{0%,100%{opacity:1}50%{opacity:.3}}
@keyframes fadeUp{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:none}}
header{display:flex;align-items:center;justify-content:space-between;padding:13px 16px;border-bottom:1px solid rgba(0,212,255,0.12);background:rgba(7,9,15,0.98);position:sticky;top:0;z-index:50}
.logo{display:flex;align-items:center;gap:9px}
.logo-icon{width:34px;height:34px;background:linear-gradient(135deg,#00d4ff,#0077aa);border-radius:9px;display:flex;align-items:center;justify-content:center;font-size:18px;box-shadow:0 0 16px rgba(0,212,255,0.35)}
.logo-text{font-family:'Bebas Neue',sans-serif;font-size:24px;letter-spacing:2px;background:linear-gradient(90deg,#00d4ff,#fff);-webkit-background-clip:text;-webkit-text-fill-color:transparent}
.live-pill{display:flex;align-items:center;gap:5px;background:rgba(255,51,85,0.12);border:1px solid rgba(255,51,85,0.35);border-radius:20px;padding:4px 11px;font-size:11px;font-weight:700;color:#ff3355}
.live-dot{width:6px;height:6px;background:#ff3355;border-radius:50%;animation:blink 1.1s infinite}
.tabs{display:flex;border-bottom:1px solid rgba(0,212,255,0.1);background:#0d1220;flex-shrink:0}
.tab{flex:1;padding:11px 6px;font-family:'Cairo',sans-serif;font-size:13px;font-weight:700;color:#4a6580;border:none;background:none;border-bottom:2px solid transparent;cursor:pointer;transition:all .2s}
.tab.active{color:#00d4ff;border-bottom-color:#00d4ff}
.comp-strip{display:flex;gap:6px;padding:8px 12px;overflow-x:auto;background:#0d1220;border-bottom:1px solid rgba(0,212,255,0.1);flex-shrink:0}
.comp-strip::-webkit-scrollbar{display:none}
.cp{padding:4px 12px;border-radius:16px;border:1px solid rgba(0,212,255,0.12);background:#111827;font-size:11px;font-weight:700;color:#4a6580;cursor:pointer;white-space:nowrap;transition:all .2s}
.cp.active,.cp:hover{border-color:#00d4ff;color:#00d4ff;background:rgba(0,212,255,0.07)}
.scroll{flex:1;overflow-y:auto;padding:8px 12px 80px}
.scroll::-webkit-scrollbar{width:3px}
.scroll::-webkit-scrollbar-thumb{background:rgba(0,212,255,0.1);border-radius:3px}
.sh{display:flex;align-items:center;gap:8px;margin:14px 0 7px}
.sh-name{font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:1.5px;color:#4a6580}
.sh-line{flex:1;height:1px;background:rgba(0,212,255,0.1)}
.mc{background:#111827;border:1px solid rgba(0,212,255,0.1);border-radius:13px;padding:13px 15px;margin-bottom:7px;display:grid;grid-template-columns:1fr auto 1fr;align-items:center;gap:8px;animation:fadeUp .3s ease both;position:relative;overflow:hidden}
.mc.live-card{border-color:rgba(255,51,85,.3);background:linear-gradient(135deg,#111827,#140f1a)}
.mc.live-card::after{content:'';position:absolute;top:0;left:0;right:0;height:2px;background:linear-gradient(90deg,transparent,#ff3355,transparent);animation:blink 2s infinite}
.team{display:flex;flex-direction:column;align-items:center;gap:5px;text-align:center}
.tlogo{width:40px;height:40px;object-fit:contain;filter:drop-shadow(0 2px 6px rgba(0,0,0,.6))}
.tph{width:40px;height:40px;border-radius:50%;background:#0d1220;border:1px solid rgba(0,212,255,0.1);display:flex;align-items:center;justify-content:center;font-size:18px}
.tname{font-size:12px;font-weight:700;line-height:1.2;max-width:76px}
.sc{display:flex;flex-direction:column;align-items:center;gap:3px;min-width:76px}
.snum{font-family:'Bebas Neue',sans-serif;font-size:30px;letter-spacing:3px;color:#fff;line-height:1}
.stime{font-size:10px;font-weight:700;letter-spacing:.8px}
.t-live{color:#ff3355;animation:blink 1.2s infinite}
.t-sched{color:#00d4ff}
.t-done{color:#4a6580}
.scomp{font-size:9px;color:#4a6580;margin-top:1px;text-align:center}
.loader{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:12px;padding:60px 0}
.spinner{width:38px;height:38px;border:3px solid rgba(0,212,255,0.1);border-top-color:#00d4ff;border-radius:50%;animation:spin .8s linear infinite}
.empty{text-align:center;padding:50px 20px;color:#4a6580}
.empty-icon{font-size:44px;margin-bottom:10px;opacity:.4}
.err{background:rgba(255,51,85,.1);border:1px solid rgba(255,51,85,.3);border-radius:12px;padding:14px;margin:10px 0;text-align:center;color:#ff3355;font-size:13px}
.last-upd{text-align:center;font-size:10px;color:#4a6580;padding:6px 0}
.toast{position:fixed;bottom:76px;left:50%;transform:translateX(-50%) translateY(20px);background:#00d4ff;color:#000;padding:8px 16px;border-radius:20px;font-weight:700;font-size:12px;opacity:0;transition:all .35s;z-index:200;white-space:nowrap;pointer-events:none}
.toast.show{opacity:1;transform:translateX(-50%) translateY(0)}
.bnav{display:flex;position:fixed;bottom:0;left:0;right:0;background:rgba(7,9,15,.98);backdrop-filter:blur(14px);border-top:1px solid rgba(0,212,255,0.1);z-index:100}
.ni{flex:1;display:flex;flex-direction:column;align-items:center;gap:3px;padding:9px 4px;cursor:pointer;font-size:9px;color:#4a6580;font-weight:700;border:none;background:none;transition:color .2s}
.ni.active{color:#00d4ff}
.ni .ic{font-size:19px}
body{display:flex;flex-direction:column}
</style>
</head>
<body>

<div class="toast" id="toast"></div>

<header>
  <div class="logo">
    <div class="logo-icon">⚽</div>
    <div class="logo-text">MATCHPULSE</div>
  </div>
  <div style="display:flex;align-items:center;gap:8px">
    <div class="live-pill"><div class="live-dot"></div>LIVE</div>
    <button onclick="loadMatches(true)" style="background:none;border:1px solid rgba(0,212,255,0.15);border-radius:8px;padding:5px 10px;color:#4a6580;font-size:16px;cursor:pointer" id="rfbtn">↻</button>
  </div>
</header>

<div class="tabs">
  <button class="tab active" onclick="setTab('LIVE',this)">🔴 مباشر</button>
  <button class="tab" onclick="setTab('SCHEDULED',this)">📅 القادمة</button>
  <button class="tab" onclick="setTab('FINISHED',this)">✅ النتائج</button>
</div>

<div class="comp-strip" id="compStrip">
  <div class="cp active" onclick="setComp(null,this)">🌍 الكل</div>
</div>

<div class="scroll" id="scrollArea">
  <div class="loader" id="loader"><div class="spinner"></div><p style="color:#4a6580;font-size:13px">جارٍ التحميل...</p></div>
  <div id="matchList" style="display:none"></div>
  <div class="last-upd" id="lastUpd" style="display:none"></div>
</div>

<div class="bnav">
  <button class="ni active" id="nav0" onclick="navClick(0)"><span class="ic">⚽</span>مباريات</button>
  <button class="ni" id="nav1" onclick="navClick(1)"><span class="ic">🏆</span>ترتيب</button>
  <button class="ni" id="nav2" onclick="navClick(2)"><span class="ic">📊</span>إحصاء</button>
  <button class="ni" id="nav3" onclick="navClick(3)"><span class="ic">🔔</span>تنبيه</button>
</div>

<script>
const PROXY = "https://football-backend-umber.vercel.app";

// البطولات المدعومة في الخطة المجانية
const COMPS = [
  {id:2021, name:"Premier League", flag:"🏴󠁧󠁢󠁥󠁮󠁧󠁿"},
  {id:2014, name:"La Liga",        flag:"🇪🇸"},
  {id:2002, name:"Bundesliga",     flag:"🇩🇪"},
  {id:2019, name:"Serie A",        flag:"🇮🇹"},
  {id:2015, name:"Ligue 1",        flag:"🇫🇷"},
  {id:2001, name:"Champions League",flag:"⭐"},
  {id:2017, name:"Primeira Liga",  flag:"🇵🇹"},
  {id:2003, name:"Eredivisie",     flag:"🇳🇱"},
];

let currentStatus = "LIVE";
let currentComp   = null;
let allMatches    = [];
let autoTimer     = null;

function navClick(i) {
  for(let j=0;j<4;j++) document.getElementById("nav"+j).classList.remove("active");
  document.getElementById("nav"+i).classList.add("active");
  if(i===0) { /* مباريات — المشهد الحالي */ }
  else toast("قريباً ✨");
}

async function loadMatches(manual=false) {
  showLoader(true);
  if(manual) animSpin();
  try {
    let params;
    if(currentStatus === "LIVE") {
      params = { status: "IN_PLAY,PAUSED,HALFTIME" };
    } else {
      const today = new Date().toISOString().slice(0,10);
      params = { status: currentStatus, dateFrom: today, dateTo: today };
    }
    // إذا اختار المستخدم بطولة معينة
    if(currentComp) params.competitions = currentComp;

    const qs = new URLSearchParams(params).toString();
    const res = await fetch(`${PROXY}/api/football?path=/matches&${qs}`);
    const data = await res.json();
    allMatches = data.matches || [];
    buildCompFilter(allMatches);
    renderMatches(allMatches);
    updateTime();
    if(manual) toast("✅ تم التحديث — " + allMatches.length + " مباراة");
    clearInterval(autoTimer);
    if(currentStatus==="LIVE") autoTimer = setInterval(()=>loadMatches(), 45000);
  } catch(e) {
    showError("تعذّر الاتصال: " + e.message);
  }
  showLoader(false);
}

function renderMatches(matches) {
  const list = document.getElementById("matchList");
  if(!matches.length) {
    let msg = currentStatus==="LIVE"
      ? "لا توجد مباريات مباشرة الآن<br><small>جرّب تبويب القادمة أو النتائج</small>"
      : "لا توجد مباريات اليوم<br><small>جرّب تاريخاً آخر</small>";
    list.innerHTML = `<div class="empty"><div class="empty-icon">⚽</div><p>${msg}</p></div>`;
    return;
  }
  const groups = {};
  matches.forEach(m => {
    const k = m.competition?.id || "?";
    if(!groups[k]) groups[k] = { comp: m.competition, list: [] };
    groups[k].list.push(m);
  });
  let html = "";
  Object.values(groups).forEach(g => {
    const flag = COMPS.find(c=>c.id===g.comp?.id)?.flag || "🏆";
    html += `<div class="sh"><span style="font-size:15px">${flag}</span><span class="sh-name">${g.comp?.name||"بطولة"}</span><div class="sh-line"></div></div>`;
    g.list.forEach((m,i) => { html += buildCard(m,i); });
  });
  list.innerHTML = html;
}

function buildCard(m, idx) {
  const isLive = ["IN_PLAY","PAUSED","HALFTIME"].includes(m.status);
  const isDone = m.status === "FINISHED";
  const hs = m.score?.fullTime?.home ?? m.score?.halfTime?.home;
  const as = m.score?.fullTime?.away ?? m.score?.halfTime?.away;
  const score = (isLive||isDone) && hs!==null ? `${hs}–${as}` : "vs";
  let tc="t-sched", tl="";
  if(isLive) { tc="t-live"; tl=m.minute?`🔴 ${m.minute}'`:m.status==="HALFTIME"?"استراحة":"🔴 مباشر"; }
  else if(isDone) { tc="t-done"; tl="انتهت"; }
  else { tl=new Date(m.utcDate).toLocaleTimeString("ar",{hour:"2-digit",minute:"2-digit",hour12:false}); }
  const hl = m.homeTeam?.crest
    ? `<img class="tlogo" src="${m.homeTeam.crest}" onerror="this.outerHTML='<div class=tph>🏠</div>'">`
    : `<div class="tph">🏠</div>`;
  const al = m.awayTeam?.crest
    ? `<img class="tlogo" src="${m.awayTeam.crest}" onerror="this.outerHTML='<div class=tph>✈️</div>'">`
    : `<div class="tph">✈️</div>`;
  const goals = m.goals||[];
  const hg = goals.filter(g=>g.team?.id===m.homeTeam?.id).map(g=>`⚽${g.scorer?.name?.split(" ").pop()||""} ${g.minute}'`).join(" ");
  const ag = goals.filter(g=>g.team?.id===m.awayTeam?.id).map(g=>`⚽${g.scorer?.name?.split(" ").pop()||""} ${g.minute}'`).join(" ");
  return `<div class="mc ${isLive?"live-card":""}" style="animation-delay:${idx*.05}s">
    <div class="team">${hl}<div class="tname">${m.homeTeam?.shortName||m.homeTeam?.name||"؟"}</div>${hg?`<div style="font-size:9px;color:rgba(0,212,255,.7);text-align:center;line-height:1.6;max-width:80px">${hg}</div>`:""}</div>
    <div class="sc"><div class="snum">${score}</div><div class="stime ${tc}">${tl}</div><div class="scomp">${m.competition?.name||""}</div></div>
    <div class="team">${al}<div class="tname">${m.awayTeam?.shortName||m.awayTeam?.name||"؟"}</div>${ag?`<div style="font-size:9px;color:rgba(0,212,255,.7);text-align:center;line-height:1.6;max-width:80px">${ag}</div>`:""}</div>
  </div>`;
}

function buildCompFilter(matches) {
  const strip = document.getElementById("compStrip");
  const seen = {};
  matches.forEach(m => { if(m.competition) seen[m.competition.id]=m.competition; });
  let html = `<div class="cp ${!currentComp?"active":""}" onclick="setComp(null,this)">🌍 الكل</div>`;
  Object.values(seen).forEach(c => {
    const flag = COMPS.find(x=>x.id===c.id)?.flag||"🏆";
    html += `<div class="cp ${currentComp===c.id?"active":""}" onclick="setComp(${c.id},this)">${flag} ${c.name}</div>`;
  });
  strip.innerHTML = html;
}

function setTab(s, btn) {
  currentStatus = s; currentComp = null;
  document.querySelectorAll(".tab").forEach(t=>t.classList.remove("active"));
  btn.classList.add("active");
  loadMatches();
}

function setComp(id, el) {
  currentComp = id;
  document.querySelectorAll(".cp").forEach(p=>p.classList.remove("active"));
  el.classList.add("active");
  if(id) {
    const f = allMatches.filter(m=>m.competition?.id==id);
    renderMatches(f);
  } else {
    renderMatches(allMatches);
  }
}

function showLoader(show) {
  document.getElementById("loader").style.display = show?"flex":"none";
  document.getElementById("matchList").style.display = show?"none":"block";
  document.getElementById("lastUpd").style.display = show?"none":"block";
}
function showError(msg) {
  document.getElementById("matchList").innerHTML = `<div class="err">⚠️ ${msg}</div>`;
  document.getElementById("matchList").style.display="block";
  document.getElementById("loader").style.display="none";
}
function updateTime() {
  const el=document.getElementById("lastUpd");
  el.style.display="block";
  el.textContent="آخر تحديث: "+new Date().toLocaleTimeString("ar");
}
function animSpin() {
  const b=document.getElementById("rfbtn");
  b.style.animation="spin .7s linear";
  setTimeout(()=>b.style.animation="",700);
}
let toastT;
function toast(msg) {
  const t=document.getElementById("toast");t.textContent=msg;t.classList.add("show");
  clearTimeout(toastT);toastT=setTimeout(()=>t.classList.remove("show"),2500);
}

loadMatches();
</script>
</body>
</html>
