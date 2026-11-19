/* ============================================================
   MW 销售工程师训练营 · 站点逻辑
   无依赖、无构建、file:// 直接打开可用
   ============================================================ */
(function () {
  "use strict";

  var C = window.COURSE;
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

  /* ---------------- 工具 ---------------- */
  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  function md(s) {
    return esc(s)
      .replace(/\*\*([^*]+)\*\*/g, "<b>$1</b>")
      .replace(/`([^`]+)`/g, "<code>$1</code>");
  }
  function num(x, d) {
    if (x == null || !isFinite(x)) return "—";
    return Number(x.toFixed(d)).toLocaleString("zh-CN");
  }
  function pad(n) { return n < 10 ? "0" + n : "" + n; }
  function fmtDate(d) { return d.getFullYear() + "-" + pad(d.getMonth() + 1) + "-" + pad(d.getDate()); }
  function fmtCN(d) { return (d.getMonth() + 1) + " 月 " + d.getDate() + " 日"; }

  /* ---------------- 课表 ---------------- */
  var SCHEDULE = (function () {
    var out = [], d = new Date(C.meta.startDate + "T00:00:00");
    while (out.length < C.meta.totalDays) {
      var wd = d.getDay();
      if (wd !== 0 && wd !== 6) {
        out.push(new Date(d.getFullYear(), d.getMonth(), d.getDate(), C.meta.unlockHour, 0, 0));
      }
      d.setDate(d.getDate() + 1);
    }
    return out;
  })();

  function unlockAt(id) { return SCHEDULE[id - 1]; }
  function isUnlocked(id) { return !!(C.meta.allUnlocked) || Date.now() >= unlockAt(id).getTime(); }
  function todayId() {
    if (C.meta.allUnlocked) return 1;
    var id = 0;
    for (var i = 1; i <= C.meta.totalDays; i++) { if (isUnlocked(i)) id = i; }
    return id; // 0 表示还没开课
  }
  function hasContent(id) { return !!(C.content && C.content[id]); }

  /* ---------------- 状态 ---------------- */
  function load(k, def) {
    try { var v = localStorage.getItem(k); return v ? JSON.parse(v) : def; } catch (e) { return def; }
  }
  function save(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { } }

  var done = load("mw.done", []);
  if (!Array.isArray(done)) done = [];
  var theme = load("mw.theme", "light");
  var examStore = load("mw.exam", {});
  if (!examStore || typeof examStore !== "object") examStore = {};

  function applyTheme(t) {
    theme = t;
    document.documentElement.setAttribute("data-theme", t);
    save("mw.theme", t);
  }
  applyTheme(theme);

  /* ---------------- 路由 ---------------- */
  function route() {
    var h = location.hash.replace(/^#\/?/, "") || "home";
    var parts = h.split("/");
    return { name: parts[0] || "home", arg: parts[1] || "" };
  }

  function setActiveNav(name) {
    $$("[data-nav]").forEach(function (a) {
      a.classList.toggle("on", a.getAttribute("data-nav") === name);
    });
  }

  /* ---------------- 视图：首页 ---------------- */
  function viewHome() {
    var tid = todayId();
    var nextId = Math.min(tid + 1, C.meta.totalDays);
    var unlockedCount = C.meta.allUnlocked ? C.meta.totalDays : tid;
    var pct = Math.round(done.length / C.meta.totalDays * 100);

    var html = "";
    html += '<section class="hero">';
    html += '<p class="eyebrow">' + esc(C.meta.title) + "</p>";
    html += "<h1>从听懂客户，<br>到<em>敢说能做 / 不能做</em></h1>";
    html += "<p>60 个工作日，每天 1 小时。讲原理、判据和现场动作：<br>拿到图纸知道先问什么，客户问参数知道怎么拆。</p>";
    html += '<div class="hero-actions">';
    if (tid > 0) {
      html += '<a class="btn btn-primary" href="#/lesson/' + tid + '">' + (done.indexOf(tid) >= 0 ? "复习第 " + tid + " 课" : "开始第 " + tid + " 课") + "</a>";
    } else {
      html += '<a class="btn btn-primary" href="#/plan">查看课程表</a>';
    }
    html += '<a class="btn btn-ghost" href="#/plan">看完整课表</a>';
    html += "</div>";

    html += '<div class="stats">';
    html += '<div class="stat"><b>' + done.length + "</b><span>已完成课时</span></div>";
    html += '<div class="stat"><b>' + unlockedCount + "</b><span>已解锁</span></div>";
    html += '<div class="stat"><b>' + pct + "%</b><span>总进度</span></div>";
    html += "</div>";
    html += "</section>";

    // 今日
    if (tid > 0) {
      var L = C.content[tid] || {};
      var meta = C.lessons[tid - 1];
      html += '<section class="section">';
      html += '<div class="section-h"><h2>今日课程</h2><span class="more">' + fmtCN(unlockAt(tid)) + " 09:00 解锁</span></div>";
      html += '<div class="today">';
      html += "<div>";
      html += '<span class="today-tag">DAY ' + tid + " · 第 " + meta.week + " 模块</span>";
      html += "<h3>" + esc(L.title || meta.t) + "</h3>";
      html += "<p>" + esc(L.sub ? L.sub.slice(0, 62) + "…" : meta.focus) + "</p>";
      html += '<div class="today-meta"><span><i class="dot"></i>约 60 分钟</span><span>' + esc(meta.focus) + "</span></div>";
      html += "</div>";
      html += '<a class="btn btn-primary" href="#/lesson/' + tid + '">' + (done.indexOf(tid) >= 0 ? "已完成 · 去复习" : "进入学习") + "</a>";
      html += "</div></section>";
    } else {
      html += '<section class="section"><div class="today"><div><span class="today-tag">未开课</span><h3>第 1 课将在 ' + fmtCN(unlockAt(1)) + " 09:00 解锁</h3><p>可以先看看课程表，了解 9 章的路线。</p></div><a class=\"btn btn-primary\" href=\"#/plan\">查看课程表</a></div></section>";
    }

    // 本周
    var curWeek = tid > 0 ? C.lessons[tid - 1].week : 1;
    html += '<section class="section">';
    html += '<div class="section-h"><h2>本模块 · M' + curWeek + "</h2><span class=\"more\">" + esc(C.weeks[curWeek - 1].goal) + "</span></div>";
    html += '<div class="weeks">' + weekCard(curWeek) + "</div>";
    html += "</section>";

    // 下一课预告
    if (tid > 0 && nextId > tid) {
      var nm = C.lessons[nextId - 1];
      html += '<section class="section"><div class="section-h"><h2>下一课</h2><span class="more">' + fmtCN(unlockAt(nextId)) + " 09:00</span></div>";
      html += '<div class="today"><div><span class="today-tag">DAY ' + nextId + "</span><h3>" + esc(nm.t) + "</h3><p>" + esc(nm.focus) + "</p></div>";
      html += '<a class="btn btn-ghost" href="#/lesson/' + nextId + '">预览</a></div></section>';
    }

    return html;
  }

  function weekCard(n) {
    var w = C.weeks[n - 1];
    var ids = C.lessons.filter(function (l) { return l.week === n; });
    var doneN = ids.filter(function (l) { return done.indexOf(l.id) >= 0; }).length;
    var html = '<div class="week">';
    html += '<div class="week-h"><span class="week-n">M' + n + "</span><h3>" + esc(w.theme) + '</h3><span class="cnt">' + doneN + "/" + ids.length + "</span></div>";
    html += '<ul class="lessons">';
    ids.forEach(function (l) {
      var st = "锁定", cls = "locked", href = "#/lesson/" + l.id, tag = "🔒 " + fmtCN(unlockAt(l.id));
      if (done.indexOf(l.id) >= 0) { st = "已完成"; cls = "done"; tag = "✓ 已完成"; }
      else if (isUnlocked(l.id)) { st = "可学习"; cls = ""; tag = hasContent(l.id) ? "可学习" : "内容制作中"; }
      if (isUnlocked(l.id) && l.id === todayId()) { cls += " today"; }
      html += '<li><a class="lesson-row ' + cls + '" href="' + href + '">';
      html += '<span class="idx">' + l.id + "</span>";
      html += '<span class="t">' + esc(l.t) + "<small>" + esc(l.focus) + "</small></span>";
      html += '<span class="st">' + tag + "</span>";
      html += "</a></li>";
    });
    html += "</ul></div>";
    return html;
  }

  /* ---------------- 视图：课程表 ---------------- */
  function viewPlan() {
    var html = '<h1 style="font-size:clamp(22px,4vw,30px);margin:0 0 6px">60 个工作日，9 章</h1>';
    html += '<p style="color:var(--muted);margin:0 0 8px;max-width:64ch">九个章节：从参数、材料、标准，到波纹管结构、设计、制造，再到膨胀节、换热器、膜片膜盒、金属软管和检测。每课讲原理、判据和现场动作，不背参数；按工作日 09:00 解锁，周末不更新。</p>';
    html += '<p class="fine" style="margin-bottom:18px">进度会保存在本机浏览器；换设备不同步。</p>';
    var grouped = {};
    C.lessons.forEach(function (l) { (grouped[l.week] = grouped[l.week] || []).push(l); });
    html += '<div class="weeks">';
    for (var n = 1; n <= C.weeks.length; n++) html += weekCard(n);
    html += "</div>";
    return html;
  }

  /* ---------------- 视图：图纸基础 ---------------- */
  function viewBasics() {
    var body = window.BASICS_HTML || '<p>图纸基础内容加载失败，请刷新重试。</p>';
    return '<div class="lesson-wrap basics-wrap"><article class="article">' + body + "</article></div>";
  }

  /* ---------------- 视图：学习法 ---------------- */
  function viewMethod() {
    return '' +
      '<h1 style="font-size:clamp(22px,4vw,30px);margin:0 0 10px">怎么用这套课，才不白学</h1>' +
      '<p style="color:var(--muted);max-width:64ch;margin:0 0 22px">这不是“看完就行”的视频课。每天 1 小时，我建议你按下面的结构走。</p>' +
      '<div class="cards">' +
      '<div class="card"><h4>① 10 分钟 · 读概念</h4><p>先看开头和图示，别急着背参数。目标是“能用自己的话复述”。</p></div>' +
      '<div class="card"><h4>② 20 分钟 · 动手</h4><p>用页面里的计算器/模拟器改几个数，看结果怎么变。手感比记忆牢。</p></div>' +
      '<div class="card"><h4>③ 15 分钟 · 做题</h4><p>自测题先自己想，再点开答案。答错的，回去看对应小节。</p></div>' +
      '<div class="card"><h4>④ 10 分钟 · 说话</h4><p>把当天的话术念一遍，最好录音。销售的知识只有在“说出口”时才算掌握。</p></div>' +
      '<div class="card"><h4>⑤ 5 分钟 · 打卡</h4><p>点“完成本课”，写一句你今天最大的收获。进度会记住。</p></div>' +
      '<div class="card"><h4>周末 · 复盘</h4><p>周五的复盘课不要跳。它是把五天内容压成一张图的关键。</p></div>' +
      "</div>" +
      '<div class="callout key" style="margin-top:24px"><div class="co-t">一条原则</div><p>**宁可一天只学懂一个概念，也不要一天翻完十页。** 你的目标不是“看过”，是能在客户面前说出来。</p></div>' +
      '<h2 style="margin-top:34px;font-size:20px">关于更新</h2>' +
      '<p style="color:var(--ink-2)">课程按工作日 09:00 自动解锁。提前打开会看到锁定页和预计解锁时间，这是正常的。</p>' +
      '<p style="color:var(--ink-2)">所有图示与计算器都是离线可用的；断网、出差都不影响。</p>';
  }

  /* ---------------- 视图：课程 ---------------- */
  function viewLesson(id) {
    id = parseInt(id, 10);
    var meta = C.lessons[id - 1];
    if (!meta) return '<div class="locked-view"><h2>没有这一课</h2><p>课号应在 1–' + C.meta.totalDays + " 之间。</p><p style=\"margin-top:16px\"><a class=\"btn btn-ghost\" href=\"#/plan\">返回课程表</a></p></div>";

    if (!isUnlocked(id)) {
      return '<div class="crumb"><a href="#/plan">课程表</a> / 第 ' + id + " 课</div>" +
        '<div class="locked-view">' +
        '<div class="lock-ico"><svg viewBox="0 0 24 24" width="26" height="26"><rect x="4" y="10" width="16" height="10" rx="2" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M8 10V7a4 4 0 0 1 8 0v3" fill="none" stroke="currentColor" stroke-width="1.8"/></svg></div>' +
        "<h2>第 " + id + " 课还没解锁</h2>" +
        "<p>" + esc(meta.t) + "</p>" +
        '<p class="when">' + fmtCN(unlockAt(id)) + " 09:00 解锁</p>" +
        '<p class="fine">每课在工作日 09:00 自动开放，周末不更新。</p>' +
        '<p style="margin-top:18px"><a class="btn btn-ghost" href="#/lesson/' + Math.max(1, todayId()) + '">去看今天的课</a></p>' +
        "</div>";
    }

    var L = C.content[id];
    if (!L) {
      return '<div class="crumb"><a href="#/plan">课程表</a> / 第 ' + id + " 课</div>" +
        '<div class="locked-view"><div class="lock-ico">✎</div><h2>内容制作中</h2><p>' + esc(meta.t) + "</p>" +
        '<p class="fine">这一课已到解锁时间，但正文还在写。通常当天上午会补齐。</p>' +
        '<p style="margin-top:18px"><a class="btn btn-ghost" href="#/plan">返回课程表</a></p></div>';
    }

    var toc = [];
    L.blocks.forEach(function (b, i) { if (b.t === "h2") toc.push({ i: i, x: b.x }); });

    var html = '<div class="crumb"><a href="#/plan">课程表</a> / 第 ' + meta.week + ' 模块 / <span style="color:var(--ink-2)">DAY ' + id + "</span></div>";
    html += '<div class="lesson-wrap">';

    // 侧栏
    html += '<aside class="toc"><h4>本课目录</h4><ol>';
    toc.forEach(function (t, k) {
      html += '<li><a href="#/lesson/' + id + '" data-scroll="h-' + k + '">' + esc(t.x) + "</a></li>";
    });
    html += "</ol>";
    html += '<div class="toc-prog">' + (done.indexOf(id) >= 0 ? "✓ 已完成本课" : "约 60 分钟") + "</div>";
    html += "</aside>";

    // 正文
    html += '<article class="article">';
    html += '<header class="art-head">';
    html += '<div class="art-kicker"><span class="chip brand">DAY ' + id + '</span><span class="chip">第 ' + meta.week + ' 模块</span>';
    (L.tags || []).forEach(function (t) { html += '<span class="chip">' + esc(t) + "</span>"; });
    html += '<span class="chip warm">约 60 分钟</span></div>';
    html += "<h1>" + esc(L.title) + "</h1>";
    html += '<p class="sub">' + md(L.sub) + "</p>";
    html += "</header>";

    if (L.objectives && L.objectives.length) {
      html += '<div class="objectives"><h4>学完你会</h4><ol>';
      L.objectives.forEach(function (o) { html += "<li>" + md(o) + "</li>"; });
      html += "</ol></div>";
    }

    var hCount = 0;
    L.blocks.forEach(function (b) {
      if (b.t === "h2") { html += renderBlock(b, "h-" + (hCount++)); }
      else { html += renderBlock(b); }
    });

    if (L.exam) html += examSection(L.exam, id);
    if (window.HISTORY) html += historySection(id);

    html += '<div class="art-foot"><div class="done-row">';
    html += '<button class="done-btn' + (done.indexOf(id) >= 0 ? " is-done" : "") + '" id="doneBtn" type="button">' +
      (done.indexOf(id) >= 0 ? "✓ 已完成本课" : "标记完成本课") + "</button>";
    html += '<span class="fine">完成的课时会计入总进度</span>';
    html += "</div>";

    var prev = id > 1 ? id - 1 : null, next = id < C.meta.totalDays ? id + 1 : null;
    html += '<div class="nextnav">';
    html += prev
      ? '<a href="#/lesson/' + prev + '"><span class="lbl">上一课</span><span class="tt">' + esc(C.lessons[prev - 1].t) + "</span></a>"
      : '<a class="disabled"><span class="lbl">上一课</span><span class="tt">已经是第一课</span></a>';
    html += next
      ? '<a href="#/lesson/' + next + '"><span class="lbl">下一课</span><span class="tt">' + esc(C.lessons[next - 1].t) + "</span></a>"
      : '<a class="disabled"><span class="lbl">下一课</span><span class="tt">全部课程结束</span></a>';
    html += "</div></div>";
    html += "</article></div>";
    return html;
  }


  /* ---------------- 零件史 ---------------- */
  function histFig(name) {
    if (name === "hCoil") {
      var loops = "";
      for (var i = 0; i < 7; i++) {
        var x = 34 + i * 15;
        loops += '<ellipse cx="' + x + '" cy="52" rx="9" ry="24" fill="none" stroke="var(--brand)" stroke-width="2"/>';
      }
      loops += '<line x1="26" y1="52" x2="34" y2="52" stroke="var(--brand)" stroke-width="2"/>';
      loops += '<line x1="124" y1="52" x2="132" y2="52" stroke="var(--brand)" stroke-width="2"/>';
      var spiral = '<path d="M150 48 a6 6 0 1 1 12 0 a10 10 0 1 1 -20 0 a14 14 0 1 1 28 0" fill="none" stroke="var(--blue)" stroke-width="1.8"/>';
      return '<svg viewBox="0 0 200 120" role="img" aria-label="螺旋弹簧与摆轮游丝">' +
        loops + spiral +
        '<circle cx="150" cy="48" r="3" fill="var(--blue)"/>' +
        '<text x="78" y="104" text-anchor="middle" font-size="10" fill="var(--muted)">螺旋弹簧：存能量</text>' +
        '<text x="150" y="104" text-anchor="middle" font-size="10" fill="var(--muted)">游丝：定频率</text>' +
        "</svg>";
    }
    if (name === "hScrew") {
      var th = "";
      for (var i = 0; i < 7; i++) {
        var x = 46 + i * 9;
        th += '<line x1="' + x + '" y1="42" x2="' + (x + 5) + '" y2="78" stroke="var(--brand)" stroke-width="2.2"/>';
      }
      return '<svg viewBox="0 0 200 120" role="img" aria-label="螺纹">' +
        '<rect x="14" y="38" width="24" height="44" rx="4" fill="var(--line-2)"/>' +
        '<rect x="36" y="50" width="112" height="20" rx="3" fill="none" stroke="var(--ink-2)" stroke-width="1.4"/>' +
        th +
        '<rect x="120" y="34" width="34" height="52" rx="4" fill="none" stroke="var(--brand)" stroke-width="2"/>' +
        '<line x1="46" y1="92" x2="55" y2="92" stroke="var(--muted)" stroke-width="1"/>' +
        '<text x="86" y="108" text-anchor="middle" font-size="10" fill="var(--muted)">螺距 P</text>' +
        '<text x="160" y="70" font-size="10" fill="var(--brand)">螺母</text>' +
        "</svg>";
    }
    if (name === "hGear") {
      function gear(cx, cy, r, n, c) {
        var s = '<circle cx="' + cx + '" cy="' + cy + '" r="' + r + '" fill="none" stroke="' + c + '" stroke-width="2"/>';
        for (var i = 0; i < n; i++) {
          var t = (i / n) * Math.PI * 2;
          var x1 = cx + Math.cos(t) * r, y1 = cy + Math.sin(t) * r;
          var x2 = cx + Math.cos(t) * (r + 6), y2 = cy + Math.sin(t) * (r + 6);
          s += '<line x1="' + x1.toFixed(1) + '" y1="' + y1.toFixed(1) + '" x2="' + x2.toFixed(1) + '" y2="' + y2.toFixed(1) + '" stroke="' + c + '" stroke-width="3"/>';
        }
        s += '<circle cx="' + cx + '" cy="' + cy + '" r="4" fill="' + c + '"/>';
        return s;
      }
      return '<svg viewBox="0 0 200 120" role="img" aria-label="齿轮">' +
        gear(72, 60, 34, 14, "var(--brand)") + gear(132, 60, 22, 9, "var(--blue)") +
        '<text x="72" y="112" text-anchor="middle" font-size="10" fill="var(--muted)">主动轮</text>' +
        '<text x="132" y="112" text-anchor="middle" font-size="10" fill="var(--muted)">从动轮</text>' +
        "</svg>";
    }
    if (name === "hBearing") {
      var balls = "";
      for (var i = 0; i < 8; i++) {
        var t = (i / 8) * Math.PI * 2;
        balls += '<circle cx="' + (100 + Math.cos(t) * 30).toFixed(1) + '" cy="' + (60 + Math.sin(t) * 30).toFixed(1) + '" r="7" fill="var(--brand)"/>';
      }
      return '<svg viewBox="0 0 200 120" role="img" aria-label="滚珠轴承">' +
        '<circle cx="100" cy="60" r="48" fill="none" stroke="var(--ink-2)" stroke-width="3"/>' +
        '<circle cx="100" cy="60" r="38" fill="none" stroke="var(--ink-2)" stroke-width="2"/>' +
        '<circle cx="100" cy="60" r="22" fill="none" stroke="var(--ink-2)" stroke-width="2"/>' +
        balls +
        '<text x="100" y="113" text-anchor="middle" font-size="10" fill="var(--muted)">外圈 · 滚珠 · 内圈</text>' +
        "</svg>";
    }
    if (name === "hHooke") {
      return '<svg viewBox="0 0 200 120" role="img" aria-label="万向节">' +
        '<rect x="16" y="46" width="54" height="28" rx="5" fill="none" stroke="var(--ink-2)" stroke-width="2"/>' +
        '<rect x="130" y="46" width="54" height="28" rx="5" fill="none" stroke="var(--ink-2)" stroke-width="2"/>' +
        '<circle cx="86" cy="60" r="18" fill="none" stroke="var(--brand)" stroke-width="2.4"/>' +
        '<line x1="70" y1="60" x2="102" y2="60" stroke="var(--brand)" stroke-width="3"/>' +
        '<line x1="86" y1="44" x2="86" y2="76" stroke="var(--blue)" stroke-width="3"/>' +
        '<circle cx="86" cy="60" r="4" fill="var(--brand)"/>' +
        '<line x1="44" y1="82" x2="70" y2="66" stroke="var(--muted)" stroke-width="1.4" stroke-dasharray="3 3"/>' +
        '<line x1="156" y1="82" x2="102" y2="66" stroke="var(--muted)" stroke-width="1.4" stroke-dasharray="3 3"/>' +
        '<text x="100" y="108" text-anchor="middle" font-size="10" fill="var(--muted)">两轴成角，仍能传动</text>' +
        "</svg>";
    }
    return '<svg viewBox="0 0 200 120" role="img" aria-label="擒纵机构">' +
      '<circle cx="90" cy="66" r="30" fill="none" stroke="var(--ink-2)" stroke-width="2"/>' +
      '<path d="M90 36 L96 44 L90 46 Z M114 60 L108 66 L114 72 Z M90 96 L84 88 L90 86 Z M66 60 L72 66 L66 72 Z" fill="var(--brand)"/>' +
      '<path d="M54 30 L74 44 M126 30 L106 44" stroke="var(--brand)" stroke-width="3"/>' +
      '<path d="M54 30 Q90 20 126 30" fill="none" stroke="var(--brand)" stroke-width="2"/>' +
      '<line x1="90" y1="96" x2="90" y2="114" stroke="var(--ink-2)" stroke-width="2"/>' +
      '<circle cx="90" cy="114" r="4" fill="var(--ink-2)"/>' +
      '<text x="150" y="52" font-size="10" fill="var(--muted)">擒爪</text>' +
      '<text x="150" y="88" font-size="10" fill="var(--muted)">摆</text>' +
      "</svg>";
  }

  function historySection(id) {
    var H = window.HISTORY;
    if (!H || !H.byLesson) return "";
    var list = H.byLesson[id];
    if (!list || !list.length) return "";

    var stories = list.map(function (it, idx) {
      var figs = (it.figures || []).map(function (f) {
        return '<figure class="hs-fig">' + histFig(f.fig) + (f.cap ? "<figcaption>" + esc(f.cap) + "</figcaption>" : "") + "</figure>";
      }).join("");
      var secs = (it.sections || []).map(function (s) {
        return '<h4 class="hs-h">' + esc(s.h) + "</h4>" + (s.p || []).map(function (p) {
          return '<p class="hs-p">' + md(p) + "</p>";
        }).join("");
      }).join("");
      var srcs = (it.sources || []).map(function (s) {
        return '<a href="' + s.u + '" target="_blank" rel="noopener">' + esc(s.t) + "</a>";
      }).join("");
      return '<article class="hs">' +
        '<div class="hs-top"><span class="chip warm">零件史 ' + (idx + 1) + " / " + list.length + "</span>" +
        '<span class="hs-era">' + esc(it.era) + "</span></div>" +
        '<h3 class="hs-name">' + esc(it.name) + '<span class="hs-en">' + esc(it.en) + "</span></h3>" +
        '<p class="hs-lead">' + md(it.lead) + "</p>" +
        figs + secs +
        '<div class="hs-box"><span class="hs-label">原理一句话</span>' + md(it.principle) + "</div>" +
        '<div class="hs-box twist"><span class="hs-label">反常识</span>' + md(it.twist) + "</div>" +
        '<div class="hs-box sales"><span class="hs-label">讲给客户听</span>' + md(it.sales) + "</div>" +
        '<div class="hs-src">' + srcs + "</div>" +
        "</article>";
    }).join("");

    return '<section class="hist" id="hist"><div class="hist-head"><span class="chip warm">课后</span>' +
      "<h2>" + esc(H.title) + "</h2><p>" + esc(H.sub) + "</p></div>" + stories + "</section>";
  }

  /* ---------------- 课后测验（逐题作答） ---------------- */
  var quizRuns = {};

  function examSection(e, id) {
    var pass = e.pass || 80;
    var best = examStore[id];
    return '<section class="quizbox" id="exam" data-exam="' + id + '">' +
      '<div class="quiz-head"><div class="quiz-title">课后测验<span class="quiz-sub">' +
      e.questions.length + " 题 · 单选 · " + pass + " 分及格</span></div>" +
      '<div class="quiz-best">' + (best != null ? "最佳 " + best + " 分" : "") + "</div></div>" +
      '<div class="quiz-bar"><i></i></div>' +
      '<div class="quiz-stage"></div>' +
      "</section>";
  }

  function quizState(id, e) {
    var st = quizRuns[id];
    if (!st || st.total !== e.questions.length) {
      st = quizRuns[id] = {
        i: 0, ans: [], locked: [], done: false, start: 0, elapsed: 0,
        total: e.questions.length
      };
    }
    return st;
  }

  function initExam(root, id) {
    var box = $("[data-exam]", root);
    var e = C.content[id] && C.content[id].exam;
    if (!box || !e) return;
    quizState(id, e);
    renderQuiz(box, e, id);
    box.addEventListener("click", function (ev) { onQuizClick(ev, box, e, id); });
  }

  function onQuizClick(ev, box, e, id) {
    var st = quizState(id, e);
    var t = ev.target;
    var opt = t.closest ? t.closest(".q-opt") : null;

    if (opt) {
      if (st.done || st.locked[st.i]) return;
      st.ans[st.i] = parseInt(opt.getAttribute("data-i"), 10);
      renderQuiz(box, e, id);
      return;
    }
    if (t.closest(".q-confirm")) {
      if (st.ans[st.i] == null || st.ans[st.i] < 0) return;
      if (!st.start) st.start = Date.now();
      st.locked[st.i] = true;
      renderQuiz(box, e, id);
      return;
    }
    if (t.closest(".q-next")) {
      if (st.i < e.questions.length - 1) {
        st.i += 1;
        renderQuiz(box, e, id);
      } else {
        finishQuiz(st, e, id);
        renderQuiz(box, e, id);
      }
      return;
    }
    if (t.closest(".q-retry")) {
      quizRuns[id] = {
        i: 0, ans: [], locked: [], done: false, start: 0, elapsed: 0,
        total: e.questions.length
      };
      renderQuiz(box, e, id);
      return;
    }
  }

  function finishQuiz(st, e, id) {
    var correct = 0;
    st.ans.forEach(function (a, k) { if (a === e.questions[k].a) correct++; });
    var pct = Math.round(correct / e.questions.length * 100);
    st.elapsed = st.start ? Math.max(1, Math.round((Date.now() - st.start) / 1000)) : 0;
    st.done = true;
    var prev = examStore[id];
    if (prev == null || pct > prev) { examStore[id] = pct; save("mw.exam", examStore); }
  }

  function renderQuiz(box, e, id) {
    var st = quizState(id, e);
    var n = e.questions.length;
    var answered = 0;
    st.locked.forEach(function (x) { if (x) answered++; });
    var bar = $(".quiz-bar i", box);
    if (bar) bar.style.width = Math.round(answered / n * 100) + "%";

    var best = examStore[id];
    var bestEl = $(".quiz-best", box);
    if (bestEl) bestEl.textContent = best != null ? "最佳 " + best + " 分" : "";

    var stage = $(".quiz-stage", box);
    stage.innerHTML = st.done ? resultHTML(e, st, id) : questionHTML(e, st);
  }

  function questionHTML(e, st) {
    var n = e.questions.length;
    var q = e.questions[st.i];
    var locked = !!st.locked[st.i];
    var sel = st.ans[st.i];
    var h = '<div class="q-meta"><span class="q-num">第 ' + (st.i + 1) + " / " + n +
      '</span><span>·</span><span>单选</span></div>';
    h += '<h3 class="q-title">' + md(q.q) + "</h3>";
    h += '<div class="q-opts">';
    q.opts.forEach(function (o, k) {
      var cls = "q-opt";
      if (!locked && sel === k) cls += " sel";
      if (locked) {
        if (k === q.a) cls += " ok";
        else if (k === sel) cls += " bad";
      }
      h += '<button type="button" class="' + cls + '" data-i="' + k + '"' +
        (locked ? " disabled" : "") + ' aria-pressed="' + (sel === k) + '">' +
        '<span class="k">' + "ABCD".charAt(k) + '</span><span class="t">' + md(o) + "</span></button>";
    });
    h += "</div>";

    if (locked) {
      var ok = sel === q.a;
      h += '<div class="q-fb ' + (ok ? "ok" : "bad") + '">' +
        '<div class="q-fb-h">' + (ok ? "✓ 回答正确" : "✗ 回答错误，正确答案是 " + "ABCD".charAt(q.a)) + "</div>" +
        "<p><b>解析</b>　" + md(q.why) + "</p></div>";
    }

    h += '<div class="q-actions">';
    if (!locked) {
      h += '<button type="button" class="btn btn-primary q-confirm"' +
        (sel == null || sel < 0 ? " disabled" : "") + ">确认答案</button>";
    } else {
      h += '<button type="button" class="btn btn-primary q-next">' +
        (st.i === n - 1 ? "查看成绩" : "下一题") + "</button>";
    }
    h += "</div>";
    return h;
  }

  function resultHTML(e, st, id) {
    var n = e.questions.length, correct = 0;
    st.ans.forEach(function (a, k) { if (a === e.questions[k].a) correct++; });
    var pct = Math.round(correct / n * 100);
    var pass = e.pass || 80;
    var ok = pct >= pass;
    var circ = 2 * Math.PI * 56;
    var off = circ * (1 - pct / 100);
    var mins = Math.floor((st.elapsed || 0) / 60);
    var secs = (st.elapsed || 0) % 60;

    var h = '<div class="q-result">';
    h += '<div class="q-ring"><svg viewBox="0 0 132 132" aria-hidden="true">' +
      '<defs><linearGradient id="qgrad" x1="0" y1="0" x2="1" y2="1">' +
      '<stop offset="0" style="stop-color:var(--brand)"/>' +
      '<stop offset="1" style="stop-color:var(--brand-2)"/></linearGradient></defs>' +
      '<circle class="track" cx="66" cy="66" r="56"/>' +
      '<circle class="fill" cx="66" cy="66" r="56" stroke="url(#qgrad)" stroke-dasharray="' +
      circ.toFixed(1) + '" stroke-dashoffset="' + off.toFixed(1) + '"/></svg>' +
      '<div class="val">' + pct + "<span>分</span></div></div>";
    h += "<h3>" + (ok ? "通过" : "未通过") + "</h3>";
    h += '<p class="q-sum">答对 ' + correct + " / " + n + " 题 · 用时 " +
      (mins ? mins + " 分 " : "") + secs + " 秒 · 及格线 " + pass + " 分</p>";
    h += '<div class="q-actions"><button type="button" class="btn btn-primary q-retry">再考一次</button>' +
      '<a class="btn btn-ghost" href="#/plan">返回课程表</a></div>';
    h += reviewHTML(e, st);
    h += "</div>";
    return h;
  }

  function reviewHTML(e, st) {
    var h = '<div class="q-review"><h4>逐题解析</h4>';
    e.questions.forEach(function (q, k) {
      var a = st.ans[k];
      var ok = a === q.a;
      h += '<div class="rv ' + (ok ? "ok" : "bad") + '">';
      h += '<div class="rv-q">' + (k + 1) + ". " + md(q.q) + "</div>";
      h += '<div class="rv-a">你选：<b>' + (a == null || a < 0 ? "未作答" : "ABCD".charAt(a)) +
        '</b>　正确答案：<b>' + "ABCD".charAt(q.a) + "</b></div>";
      h += '<div class="rv-x"><b>解析</b>　' + md(q.why) + "</div>";
      h += "</div>";
    });
    h += "</div>";
    return h;
  }

  /* ---------------- 区块渲染 ---------------- */
  function renderBlock(b, anchor) {
    switch (b.t) {
      case "h2":
        return '<h2 id="' + (anchor || "") + '">' + md(b.x) + "</h2>";
      case "h3":
        return "<h3>" + md(b.x) + "</h3>";
      case "p":
        return "<p>" + md(b.x) + "</p>";
      case "lead":
        return '<p class="lead">' + md(b.x) + "</p>";
      case "callout":
        return '<div class="callout ' + esc(b.kind || "note") + '">' +
          (b.title ? '<div class="co-t">' + esc(b.title) + "</div>" : "") +
          "<p>" + md(b.x) + "</p></div>";
      case "quote":
        return '<blockquote class="quote">' + md(b.x) + "</blockquote>";
      case "list":
        var tag = b.ordered ? "ol" : "ul";
        return "<" + tag + ">" + b.items.map(function (i) { return "<li>" + md(i) + "</li>"; }).join("") + "</" + tag + ">";
      case "steps":
        return '<ol class="steps">' + b.items.map(function (s) {
          return typeof s === "string"
            ? "<li>" + md(s) + "</li>"
            : "<li><b>" + md(s.b) + "</b>" + md(s.x) + "</li>";
        }).join("") + "</ol>";
      case "table":
        var h = '<div class="tbl"><table><thead><tr>' +
          b.head.map(function (x) { return "<th>" + esc(x) + "</th>"; }).join("") + "</tr></thead><tbody>";
        h += b.rows.map(function (r) {
          return "<tr>" + r.map(function (c) { return "<td>" + md(c) + "</td>"; }).join("") + "</tr>";
        }).join("");
        h += "</tbody></table></div>";
        if (b.note) h += '<p class="fine">' + md(b.note) + "</p>";
        return h;
      case "kv":
        return '<div class="kv">' + b.items.map(function (r) {
          return '<div class="kv-row"><div class="kv-k">' + esc(r[0]) + '</div><div class="kv-v">' + md(r[1]) + "</div></div>";
        }).join("") + "</div>";
      case "cards":
        return '<div class="cards">' + b.items.map(function (c) {
          return '<div class="card"><h4>' + esc(c.h) + (c.tag ? '<span class="chip">' + esc(c.tag) + "</span>" : "") +
            "</h4><p>" + md(c.x) + "</p></div>";
        }).join("") + "</div>";
      case "details":
        return b.items.map(function (d) {
          return '<details class="acc"><summary>' + esc(d.s) + '</summary><div class="acc-b">' + md(d.x) + "</div></details>";
        }).join("");
      case "quiz":
        return '<div class="quiz">' + b.items.map(function (q, i) {
          return '<details class="q"><summary><span class="qn">Q' + (i + 1) + "</span>" + md(q.q) + "</summary>" +
            '<div class="ans">' + md(q.a) + "</div></details>";
        }).join("") + "</div>";
      case "figure":
        return '<figure class="fig" style="width:760px;max-width:100%">' + figure(b.name) +
          (b.cap ? "<figcaption>" + esc(b.cap) + "</figcaption>" : "") + "</figure>";
      case "widget":
        return widgetHTML(b);
      default:
        return "";
    }
  }

  /* ---------------- 示意图 ---------------- */
  function figure(name) {
    if (window.FIGS && window.FIGS[name]) return window.FIGS[name];
    if (name === "anatomy") return figAnatomy();
    if (name === "process") return figProcess();
    if (name === "tri") return figTri();
    if (name === "stiff") return figStiff();
    if (name === "failModes") return figFailModes();
    if (name === "couplingTypes") return figCouplingTypes();
    if (name === "servoJitter") return figServoJitter();
    if (name === "semiVacuum") return figSemiVacuum();
    if (name === "bellowWhy") return figBellowWhy();
    if (name === "tubeArea") return figTubeArea();
    if (name === "uhvMetrics") return figUhvMetrics();
    if (name === "map") return figMap();
    if (name === "springs") return figSprings();
    return "";
  }

  function bellowsD(x0, x1, cy, amp, waves, color) {
    var step = (x1 - x0) / waves;
    var top = "M" + x0 + "," + cy, bot = "M" + x0 + "," + cy;
    for (var i = 0; i < waves; i++) {
      var xs = x0 + i * step;
      top += " q" + (step * 0.25) + "," + (-amp) + " " + (step * 0.5) + ",0";
      top += " q" + (step * 0.25) + "," + amp + " " + (step * 0.5) + ",0";
      bot += " q" + (step * 0.25) + "," + amp + " " + (step * 0.5) + ",0";
      bot += " q" + (step * 0.25) + "," + (-amp) + " " + (step * 0.5) + ",0";
    }
    return '<path d="' + top + '" fill="none" stroke="' + color + '" stroke-width="3" stroke-linecap="round"/>' +
      '<path d="' + bot + '" fill="none" stroke="' + color + '" stroke-width="3" stroke-linecap="round"/>';
  }

  function figAnatomy() {
    var c = "var(--brand)";
    return '<svg viewBox="0 0 640 250" role="img" aria-label="波纹管结构示意图">' +
      '<rect x="30" y="70" width="26" height="110" rx="5" fill="var(--line-2)"/>' +
      '<rect x="584" y="70" width="26" height="110" rx="5" fill="var(--line-2)"/>' +
      '<rect x="56" y="72" width="528" height="106" rx="6" fill="var(--brand-soft)" opacity=".55"/>' +
      bellowsD(56, 584, 125, 26, 8, c) +
      // 标注
      '<line x1="56" y1="205" x2="584" y2="205" stroke="var(--muted)" stroke-width="1" stroke-dasharray="4 4"/>' +
      '<line x1="56" y1="199" x2="56" y2="211" stroke="var(--muted)" stroke-width="1"/>' +
      '<line x1="584" y1="199" x2="584" y2="211" stroke="var(--muted)" stroke-width="1"/>' +
      '<text x="320" y="226" text-anchor="middle" font-size="12" fill="var(--muted)">有效长度 L₀</text>' +
      '<circle cx="190" cy="99" r="4" fill="var(--accent)"/>' +
      '<text x="190" y="84" text-anchor="middle" font-size="12" fill="var(--accent)">波峰</text>' +
      '<circle cx="256" cy="151" r="4" fill="var(--blue)"/>' +
      '<text x="256" y="170" text-anchor="middle" font-size="12" fill="var(--blue)">波谷</text>' +
      '<text x="43" y="52" text-anchor="middle" font-size="12" fill="var(--muted)">端接</text>' +
      '<text x="597" y="52" text-anchor="middle" font-size="12" fill="var(--muted)">端接</text>' +
      '<path d="M43 58 L43 68" stroke="var(--muted)" stroke-width="1" marker-end=""/>' +
      '<path d="M597 58 L597 68" stroke="var(--muted)" stroke-width="1"/>' +
      "</svg>";
  }

  function figTubeArea() {
    var c = "var(--brand)";
    return '<svg viewBox="0 0 680 270" role="img" aria-label="圆环面积与展开矩形">' +
      '<text x="170" y="28" text-anchor="middle" font-size="13" font-weight="700" fill="var(--ink)">把管子横切开：看到的是圆环</text>' +
      '<path fill-rule="evenodd" d="M170 45 a85 85 0 1 0 0 170 a85 85 0 1 0 0 -170 Z M170 57 a73 73 0 1 1 0 146 a73 73 0 1 1 0 -146 Z" fill="var(--brand-soft)" stroke="' + c + '" stroke-width="2"/>' +
      '<line x1="85" y1="130" x2="255" y2="130" stroke="var(--muted)" stroke-width="1" stroke-dasharray="4 4"/>' +
      '<text x="170" y="122" text-anchor="middle" font-size="12" fill="var(--muted)">D = 32 mm</text>' +
      '<text x="170" y="150" text-anchor="middle" font-size="12" fill="var(--muted)">d = 31.7 mm</text>' +
      '<line x1="262" y1="52" x2="300" y2="52" stroke="var(--accent)" stroke-width="1.5"/>' +
      '<text x="306" y="56" font-size="12" fill="var(--accent)">t = 0.15 mm（画粗了）</text>' +
      '<text x="170" y="248" text-anchor="middle" font-size="12" fill="var(--muted)">A = 大圆 − 小圆 ≈ 804.2 − 789.2 = 15.0 mm²</text>' +
      '<text x="500" y="28" text-anchor="middle" font-size="13" font-weight="700" fill="var(--ink)">把薄环展开：变成长方形</text>' +
      '<rect x="375" y="95" width="250" height="26" rx="3" fill="var(--brand-soft)" stroke="' + c + '" stroke-width="2"/>' +
      '<line x1="375" y1="140" x2="625" y2="140" stroke="var(--muted)" stroke-width="1" stroke-dasharray="4 4"/>' +
      '<line x1="375" y1="134" x2="375" y2="146" stroke="var(--muted)" stroke-width="1"/>' +
      '<line x1="625" y1="134" x2="625" y2="146" stroke="var(--muted)" stroke-width="1"/>' +
      '<text x="500" y="160" text-anchor="middle" font-size="12" fill="var(--muted)">长 = πD ≈ 100.5 mm</text>' +
      '<text x="636" y="113" font-size="12" fill="var(--accent)">宽 = t</text>' +
      '<text x="500" y="220" text-anchor="middle" font-size="12" fill="var(--muted)">A ≈ 100.5 × 0.15 ≈ 15.1 mm²</text>' +
      '<text x="500" y="245" text-anchor="middle" font-size="11" fill="var(--muted)">两种算法差 0.5%，所以工程上用 πDt 估算</text>' +
      "</svg>";
  }

  function figProcess() {
    var c = "var(--brand)";
    return '<svg viewBox="0 0 660 240" role="img" aria-label="三种波纹管成形工艺">' +
      '<g transform="translate(10,10)">' +
      '<text x="95" y="14" text-anchor="middle" font-size="13" font-weight="700" fill="var(--ink)">① 液压成型</text>' +
      '<rect x="30" y="40" width="130" height="20" rx="6" fill="var(--line-2)"/>' +
      '<path d="M40 60 q15 40 30 0 q15 -40 30 0 q15 40 30 0" fill="none" stroke="' + c + '" stroke-width="3"/>' +
      '<path d="M40 120 q15 40 30 0 q15 -40 30 0 q15 40 30 0" fill="none" stroke="' + c + '" stroke-width="3"/>' +
      '<rect x="55" y="66" width="12" height="48" rx="6" fill="var(--accent)" opacity=".7"/>' +
      '<text x="95" y="160" text-anchor="middle" font-size="11" fill="var(--muted)">管内加压，鼓出波纹</text>' +
      '<text x="95" y="180" text-anchor="middle" font-size="11" fill="var(--muted)">便宜 · 行程大</text>' +
      "</g>" +
      '<g transform="translate(230,10)">' +
      '<text x="95" y="14" text-anchor="middle" font-size="13" font-weight="700" fill="var(--ink)">② 边缘焊接</text>' +
      [0, 1, 2, 3, 4].map(function (i) {
        var y = 50 + i * 18;
        return '<ellipse cx="95" cy="' + y + '" rx="46" ry="7" fill="none" stroke="' + c + '" stroke-width="2.4"/>';
      }).join("") +
      '<line x1="49" y1="50" x2="49" y2="122" stroke="var(--accent)" stroke-width="2" stroke-dasharray="3 3"/>' +
      '<line x1="141" y1="50" x2="141" y2="122" stroke="var(--accent)" stroke-width="2" stroke-dasharray="3 3"/>' +
      '<text x="95" y="160" text-anchor="middle" font-size="11" fill="var(--muted)">膜片内外缘交替焊接</text>' +
      '<text x="95" y="180" text-anchor="middle" font-size="11" fill="var(--muted)">寿命长 · 可进真空</text>' +
      "</g>" +
      '<g transform="translate(450,10)">' +
      '<text x="95" y="14" text-anchor="middle" font-size="13" font-weight="700" fill="var(--ink)">③ 电铸</text>' +
      '<rect x="70" y="40" width="50" height="76" rx="6" fill="var(--line-2)"/>' +
      '<rect x="66" y="40" width="58" height="76" rx="8" fill="none" stroke="' + c + '" stroke-width="3"/>' +
      '<path d="M70 40 v76 M120 40 v76" stroke="var(--accent)" stroke-width="1.4" stroke-dasharray="4 3"/>' +
      '<text x="95" y="160" text-anchor="middle" font-size="11" fill="var(--muted)">芯模电镀，溶芯脱模</text>' +
      '<text x="95" y="180" text-anchor="middle" font-size="11" fill="var(--muted)">极薄 · 极灵敏</text>' +
      "</g>" +
      "</svg>";
  }

  function figStiff() {
    var rows = [
      { l: "线径 d +10%", v: 46, t: "+46%", c: "var(--brand)" },
      { l: "中径 D +10%", v: -25, t: "−25%", c: "var(--blue)" },
      { l: "圈数 n +10%", v: -9, t: "−9%", c: "var(--muted)" }
    ];
    var zero = 250, scale = 3.2;
    var bars = rows.map(function (r, i) {
      var y = 78 + i * 62;
      var w = Math.abs(r.v) * scale;
      var x = r.v >= 0 ? zero : zero - w;
      return '<text x="24" y="' + (y + 5) + '" font-size="13" fill="var(--ink)">' + r.l + '</text>' +
        '<rect x="' + x + '" y="' + (y - 14) + '" width="' + w + '" height="28" rx="6" fill="' + r.c + '" opacity=".85"/>' +
        '<text x="' + (r.v >= 0 ? x + w + 10 : x - 10) + '" y="' + (y + 5) + '" text-anchor="' + (r.v >= 0 ? "start" : "end") + '" font-size="13" font-weight="700" fill="' + r.c + '">' + r.t + '</text>';
    }).join("");
    return '<svg viewBox="0 0 660 250" role="img" aria-label="三个参数对弹簧刚度的影响">' +
      '<text x="24" y="26" font-size="12" fill="var(--muted)">刚度变化（以原设计为 0）</text>' +
      '<line x1="' + zero + '" y1="46" x2="' + zero + '" y2="228" stroke="var(--line-2)" stroke-width="1"/>' +
      bars +
      '<text x="24" y="244" font-size="11" fill="var(--muted)">k ∝ d⁴ / (D³·n)：线径是四次方，改一点点就变很多</text>' +
      "</svg>";
  }

  function figSprings() {
    var items = [
      { t: "压缩弹簧", s: "轴向受压", k: "k ∝ d⁴/(D³·n)" },
      { t: "拉伸弹簧", s: "轴向受拉", k: "带初拉力" },
      { t: "扭转弹簧", s: "绕轴受扭", k: "扭矩 · 腿角" },
      { t: "碟形弹簧", s: "轴向受压", k: "小行程 · 大力" },
      { t: "波形弹簧", s: "轴向受压", k: "省高度" },
      { t: "恒力弹簧", s: "定力拉伸", k: "力近似恒定" }
    ];
    function glyph(i, cx, cy) {
      var c = "var(--brand)";
      if (i === 0) {
        return '<path d="M' + (cx - 40) + ' ' + cy + ' l10 -16 l10 32 l10 -32 l10 32 l10 -32 l10 32 l10 -16" fill="none" stroke="' + c + '" stroke-width="2.6"/>';
      }
      if (i === 1) {
        return '<path d="M' + (cx - 38) + ' ' + cy + ' l9 -15 l9 30 l9 -30 l9 30 l9 -30 l9 30 l9 -15" fill="none" stroke="' + c + '" stroke-width="2.6"/>' +
          '<circle cx="' + (cx - 46) + '" cy="' + cy + '" r="5" fill="none" stroke="' + c + '" stroke-width="2"/>' +
          '<circle cx="' + (cx + 46) + '" cy="' + cy + '" r="5" fill="none" stroke="' + c + '" stroke-width="2"/>';
      }
      if (i === 2) {
        return '<path d="M' + (cx - 30) + ' ' + (cy - 12) + ' q8 -10 16 0 q8 10 16 0 q8 -10 16 0 q8 10 16 0" fill="none" stroke="' + c + '" stroke-width="2.6"/>' +
          '<path d="M' + (cx - 30) + ' ' + (cy - 12) + ' v-16 M' + (cx + 34) + ' ' + (cy - 12) + ' v16" stroke="' + c + '" stroke-width="2.6"/>';
      }
      if (i === 3) {
        return '<path d="M' + (cx - 34) + ' ' + (cy + 10) + ' l14 -14 h40 l14 14 z" fill="none" stroke="' + c + '" stroke-width="2.4"/>' +
          '<path d="M' + (cx - 34) + ' ' + (cy - 4) + ' l14 -14 h40 l14 14 z" fill="none" stroke="' + c + '" stroke-width="2.4"/>';
      }
      if (i === 4) {
        return '<path d="M' + (cx - 40) + ' ' + cy + ' q10 -14 20 0 q10 14 20 0 q10 -14 20 0 q10 14 20 0" fill="none" stroke="' + c + '" stroke-width="2.6"/>' +
          '<path d="M' + (cx - 40) + ' ' + (cy + 12) + ' q10 -14 20 0 q10 14 20 0 q10 -14 20 0 q10 14 20 0" fill="none" stroke="' + c + '" stroke-width="2.6"/>';
      }
      return '<path d="M' + (cx - 6) + ' ' + (cy + 14) + ' a16 16 0 1 1 32 0 a12 12 0 1 1 -24 0 a8 8 0 1 1 16 0" fill="none" stroke="' + c + '" stroke-width="2.6"/>' +
        '<path d="M' + (cx - 6) + ' ' + (cy + 14) + ' h-26" stroke="' + c + '" stroke-width="2.6"/>';
    }
    var cells = items.map(function (it, i) {
      var col = i % 3, row = Math.floor(i / 3);
      var x = 18 + col * 212, y = 16 + row * 138;
      return '<g>' +
        '<rect x="' + x + '" y="' + y + '" width="196" height="122" rx="12" fill="var(--panel-2)" stroke="var(--line-2)"/>' +
        '<text x="' + (x + 98) + '" y="' + (y + 28) + '" text-anchor="middle" font-size="14" font-weight="700" fill="var(--ink)">' + it.t + "</text>" +
        glyph(i, x + 98, y + 66) +
        '<text x="' + (x + 98) + '" y="' + (y + 104) + '" text-anchor="middle" font-size="11" fill="var(--muted)">' + it.s + " · " + it.k + "</text>" +
        "</g>";
    }).join("");
    return '<svg viewBox="0 0 660 300" role="img" aria-label="六种弹簧的分工">' + cells + "</svg>";
  }

  function figFailModes() {
    var items = [
      { t: "断", s: "疲劳 / 过载 / 氢脆", k: "断口会说话" },
      { t: "软", s: "松弛 / 压矮", k: "量自由长度" },
      { t: "锈", s: "点蚀 / 缝隙腐蚀", k: "查介质与镀层" },
      { t: "响", s: "共振 / 并圈 / 间隙", k: "查频率与装配" }
    ];
    function icon(i, cx, cy) {
      var c = "var(--brand)";
      if (i === 0) {
        return '<path d="M' + (cx - 34) + ' ' + cy + ' q6 -14 12 0 q6 14 12 0 q6 -14 12 0" fill="none" stroke="' + c + '" stroke-width="2.6"/>' +
          '<path d="M' + (cx + 2) + ' ' + cy + ' l10 -10 M' + (cx + 2) + ' ' + cy + ' l10 10" stroke="var(--accent)" stroke-width="2.2"/>';
      }
      if (i === 1) {
        return '<path d="M' + (cx - 34) + ' ' + (cy - 8) + ' q6 -10 12 0 q6 10 12 0 q6 -10 12 0" fill="none" stroke="' + c + '" stroke-width="2.6"/>' +
          '<path d="M' + (cx - 34) + ' ' + (cy + 8) + ' q6 -10 12 0 q6 10 12 0 q6 -10 12 0" fill="none" stroke="' + c + '" stroke-width="2.6"/>' +
          '<path d="M' + (cx - 40) + ' ' + (cy + 22) + ' h18 M' + (cx + 22) + ' ' + (cy + 22) + ' h18" stroke="var(--muted)" stroke-width="1.4"/>';
      }
      if (i === 2) {
        return '<rect x="' + (cx - 34) + '" y="' + (cy - 10) + '" width="68" height="22" rx="3" fill="none" stroke="' + c + '" stroke-width="2"/>' +
          '<circle cx="' + (cx - 18) + '" cy="' + (cy + 1) + '" r="3" fill="var(--accent)"/><circle cx="' + (cx + 6) + '" cy="' + (cy - 3) + '" r="2.6" fill="var(--accent)"/>' +
          '<circle cx="' + (cx + 20) + '" cy="' + (cy + 4) + '" r="2.2" fill="var(--accent)"/>';
      }
      return '<path d="M' + (cx - 34) + ' ' + cy + ' q8 -12 16 0 q8 12 16 0 q8 -12 16 0" fill="none" stroke="' + c + '" stroke-width="2.2"/>' +
        '<path d="M' + (cx - 34) + ' ' + (cy + 12) + ' q8 12 16 0 q8 -12 16 0 q8 12 16 0" fill="none" stroke="' + c + '" stroke-width="2.2"/>' +
        '<text x="' + (cx + 30) + '" y="' + (cy - 8) + '" font-size="12" fill="var(--muted)">♪</text>';
    }
    var cells = items.map(function (it, i) {
      var col = i % 2, row = Math.floor(i / 2);
      var x = 20 + col * 305, y = 16 + row * 128;
      return '<g>' +
        '<rect x="' + x + '" y="' + y + '" width="286" height="112" rx="12" fill="var(--panel-2)" stroke="var(--line-2)"/>' +
        '<text x="' + (x + 26) + '" y="' + (y + 62) + '" font-size="22" font-weight="700" fill="var(--ink)">' + it.t + "</text>" +
        icon(i, x + 120, y + 56) +
        '<text x="' + (x + 26) + '" y="' + (y + 88) + '" font-size="11" fill="var(--muted)">' + it.s + " · " + it.k + "</text>" +
        "</g>";
    }).join("");
    return '<svg viewBox="0 0 630 270" role="img" aria-label="四种弹簧失效模式">' + cells + "</svg>";
  }

  function figCouplingTypes() {
    function hub(x, y) {
      return '<rect x="' + x + '" y="' + (y - 14) + '" width="18" height="28" rx="3" fill="var(--line-2)"/>';
    }
    // 螺旋梁：带斜槽的圆柱
    var beam = '<g transform="translate(10,0)">' +
      hub(18, 60) + hub(150, 60) +
      '<rect x="36" y="42" width="114" height="36" rx="18" fill="none" stroke="var(--brand)" stroke-width="2"/>' +
      [0, 1, 2, 3].map(function (i) {
        var x = 48 + i * 24;
        return '<line x1="' + x + '" y1="42" x2="' + (x + 16) + '" y2="78" stroke="var(--accent)" stroke-width="2.2"/>';
      }).join("") +
      '<text x="93" y="112" text-anchor="middle" font-size="11" font-weight="700" fill="var(--ink)">螺旋梁</text>' +
      '<text x="93" y="128" text-anchor="middle" font-size="9" fill="var(--muted)">零背隙 · 低惯量</text>' +
      "</g>";
    // 波纹管：波纹 + 轮毂
    var bell = '<g transform="translate(210,0)">' +
      hub(18, 60) + hub(150, 60) +
      [0, 1, 2, 3, 4, 5].map(function (i) {
        var x = 40 + i * 18;
        return '<path d="M' + x + ' 42 q9 18 0 36" fill="none" stroke="var(--brand)" stroke-width="2.2"/>';
      }).join("") +
      '<line x1="36" y1="42" x2="150" y2="42" stroke="var(--brand)" stroke-width="1.4"/>' +
      '<line x1="36" y1="78" x2="150" y2="78" stroke="var(--brand)" stroke-width="1.4"/>' +
      '<text x="93" y="112" text-anchor="middle" font-size="11" font-weight="700" fill="var(--ink)">波纹管</text>' +
      '<text x="93" y="128" text-anchor="middle" font-size="9" fill="var(--muted)">高刚度 · 三向补偿</text>' +
      "</g>";
    // 万向节：两个叉 + 十字
    var uj = '<g transform="translate(410,0)">' +
      '<rect x="16" y="46" width="42" height="28" rx="4" fill="none" stroke="var(--ink-2)" stroke-width="2"/>' +
      '<rect x="128" y="46" width="42" height="28" rx="4" fill="none" stroke="var(--ink-2)" stroke-width="2"/>' +
      '<circle cx="93" cy="60" r="14" fill="none" stroke="var(--brand)" stroke-width="2.2"/>' +
      '<line x1="79" y1="60" x2="107" y2="60" stroke="var(--brand)" stroke-width="2.6"/>' +
      '<line x1="93" y1="46" x2="93" y2="74" stroke="var(--blue)" stroke-width="2.6"/>' +
      '<text x="93" y="112" text-anchor="middle" font-size="11" font-weight="700" fill="var(--ink)">万向节</text>' +
      '<text x="93" y="128" text-anchor="middle" font-size="9" fill="var(--muted)">大角度 · 有背隙</text>' +
      "</g>";
    return '<svg viewBox="0 0 630 140" role="img" aria-label="三种联轴器示意">' + beam + bell + uj + "</svg>";
  }

  function figServoJitter() {
    var panels = [
      { x: 10, t: "健康", s: "平滑跟随", mode: 0 },
      { x: 215, t: "偏差", s: "1× 周期波动", mode: 1 },
      { x: 420, t: "背隙", s: "换向平顶", mode: 2 }
    ];
    function wave(x0, mode) {
      var pts = [];
      for (var i = 0; i <= 80; i++) {
        var t = i / 80;
        var y = 60 - 22 * Math.sin(t * Math.PI * 4);
        if (mode === 1) y += 6 * Math.sin(t * Math.PI * 8);
        if (mode === 2 && t > 0.45 && t < 0.55) y = 60 - 22 * Math.sin(0.45 * Math.PI * 4);
        pts.push((i === 0 ? "M" : "L") + (x0 + t * 180).toFixed(1) + " " + y.toFixed(1));
      }
      return pts.join(" ");
    }
    var cells = panels.map(function (q) {
      return '<g transform="translate(' + q.x + ',0)">' +
        '<rect x="0" y="14" width="200" height="100" rx="10" fill="var(--panel-2)" stroke="var(--line-2)"/>' +
        '<line x1="10" y1="60" x2="190" y2="60" stroke="var(--line-2)" stroke-width="1" stroke-dasharray="4 4"/>' +
        '<path d="' + wave(10, q.mode) + '" fill="none" stroke="var(--brand)" stroke-width="2.4"/>' +
        '<text x="100" y="132" text-anchor="middle" font-size="12" font-weight="700" fill="var(--ink)">' + q.t + "</text>" +
        '<text x="100" y="148" text-anchor="middle" font-size="10" fill="var(--muted)">' + q.s + "</text>" +
        "</g>";
    }).join("");
    return '<svg viewBox="0 0 630 160" role="img" aria-label="伺服波形对比">' + cells + "</svg>";
  }

  function figSemiVacuum() {
    var b = "var(--brand)", l = "var(--line-2)", m = "var(--muted)";
    function box(x, y, w, h, label, sub) {
      return '<rect x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" rx="8" fill="var(--panel-2)" stroke="' + l + '"/>' +
        '<text x="' + (x + w / 2) + '" y="' + (y + h / 2 - 2) + '" text-anchor="middle" font-size="12" font-weight="700" fill="var(--ink)">' + label + "</text>" +
        (sub ? '<text x="' + (x + w / 2) + '" y="' + (y + h / 2 + 13) + '" text-anchor="middle" font-size="9" fill="' + m + '">' + sub + "</text>" : "");
    }
    function zig(x, y, w, label) {
      return '<path d="M' + x + ' ' + y + ' l6 -8 l6 8 l6 -8 l6 8 l6 -8 l6 8" fill="none" stroke="' + b + '" stroke-width="2"/>' +
        '<text x="' + (x + w / 2) + '" y="' + (y + 18) + '" text-anchor="middle" font-size="9" fill="' + m + '">' + label + "</text>";
    }
    return '<svg viewBox="0 0 630 270" role="img" aria-label="半导体真空系统示意">' +
      box(18, 70, 130, 110, "Load Lock", "进片/出片") +
      box(170, 70, 52, 110, "闸阀", "Gate valve") +
      box(250, 40, 210, 170, "工艺腔", "Process chamber") +
      '<circle cx="355" cy="120" r="22" fill="none" stroke="' + b + '" stroke-width="2.2"/>' +
      '<text x="355" y="124" text-anchor="middle" font-size="9" fill="' + m + '">晶圆</text>' +
      '<path d="M300 160 h110" stroke="' + b + '" stroke-width="2" stroke-dasharray="5 4"/>' +
      '<text x="355" y="176" text-anchor="middle" font-size="9" fill="' + m + '">传输机械手</text>' +
      zig(196, 48, 0, "阀杆") +
      zig(83, 188, 0, "门") +
      '<path d="M355 40 v-16" stroke="' + b + '" stroke-width="2"/>' +
      '<text x="355" y="18" text-anchor="middle" font-size="9" fill="' + m + '">馈通</text>' +
      box(470, 180, 130, 62, "干泵 / 分子泵", "抽真空") +
      '<path d="M460 210 h10" stroke="' + b + '" stroke-width="2"/>' +
      '<text x="355" y="250" text-anchor="middle" font-size="9" fill="' + m + '">凡是“既要动、又要密封”的位置，都可能是波纹管</text>' +
      "</svg>";
  }

  function figBellowWhy() {
    var b = "var(--brand)", m = "var(--muted)", l = "var(--line-2)", a = "var(--accent)";
    return '<svg viewBox="0 0 660 270" role="img" aria-label="直管与波纹管受力对比">' +
      '<rect x="20" y="58" width="280" height="150" rx="12" fill="var(--panel-2)" stroke="' + l + '"/>' +
      '<text x="160" y="44" text-anchor="middle" font-size="14" font-weight="700" fill="var(--ink)">直管</text>' +
      '<rect x="34" y="88" width="12" height="90" rx="2" fill="var(--line-2)"/>' +
      '<line x1="46" y1="108" x2="250" y2="108" stroke="' + b + '" stroke-width="3"/>' +
      '<line x1="46" y1="158" x2="250" y2="158" stroke="' + b + '" stroke-width="3"/>' +
      '<rect x="250" y="100" width="10" height="66" rx="2" fill="var(--line-2)"/>' +
      '<path d="M300 133 h-26" stroke="' + a + '" stroke-width="3"/>' +
      '<path d="M274 133 l12 -7 v14 z" fill="' + a + '"/>' +
      '<text x="160" y="192" text-anchor="middle" font-size="10" fill="' + m + '">K ≈ EA / L　→　压 0.1 mm 要几 kN</text>' +
      '<rect x="340" y="58" width="300" height="150" rx="12" fill="var(--panel-2)" stroke="' + l + '"/>' +
      '<text x="490" y="44" text-anchor="middle" font-size="14" font-weight="700" fill="var(--ink)">波纹管</text>' +
      '<rect x="352" y="88" width="10" height="90" rx="2" fill="var(--line-2)"/>' +
      bellowsD(362, 598, 133, 22, 7, b) +
      '<rect x="598" y="100" width="10" height="66" rx="2" fill="var(--line-2)"/>' +
      '<path d="M640 133 h-26" stroke="' + a + '" stroke-width="3"/>' +
      '<path d="M614 133 l12 -7 v14 z" fill="' + a + '"/>' +
      '<text x="490" y="192" text-anchor="middle" font-size="10" fill="' + m + '">1/K = Σ 1/Kᵢ　→　位移被 n 个波分摊</text>' +
      "</svg>";
  }

  function figUhvMetrics() {
    var cols = [
      { t: "放气", s: "Outgassing", v: "Q_out × A", n: "表面积为王" },
      { t: "泄漏", s: "Leak rate", v: "< 1×10⁻⁹", n: "mbar·L/s" },
      { t: "洁净", s: "Cleanliness", v: "颗粒 / 碳氢", n: "指纹也是污染" }
    ];
    var cells = cols.map(function (c, i) {
      var x = 12 + i * 206;
      return '<g transform="translate(' + x + ',0)">' +
        '<rect x="0" y="10" width="190" height="118" rx="12" fill="var(--panel-2)" stroke="var(--line-2)"/>' +
        '<text x="20" y="42" font-size="16" font-weight="700" fill="var(--ink)">' + c.t + "</text>" +
        '<text x="20" y="58" font-size="9" fill="var(--muted)">' + c.s + "</text>" +
        '<text x="20" y="88" font-size="13" font-weight="700" fill="var(--brand)">' + c.v + "</text>" +
        '<text x="20" y="106" font-size="9" fill="var(--muted)">' + c.n + "</text>" +
        "</g>";
    }).join("");
    return '<svg viewBox="0 0 630 170" role="img" aria-label="UHV 三个指标">' + cells +
      '<text x="315" y="158" text-anchor="middle" font-size="10" fill="var(--muted)">P = (Q_out × A + Q_L) / S</text>' +
      "</svg>";
  }

  function figTri() {
    return '<svg viewBox="0 0 460 300" role="img" aria-label="选型三角">' +
      '<defs><linearGradient id="tg" x1="0" y1="0" x2="1" y2="1">' +
      '<stop offset="0" stop-color="var(--brand)" stop-opacity=".22"/>' +
      '<stop offset="1" stop-color="var(--blue)" stop-opacity=".05"/></linearGradient></defs>' +
      '<polygon points="230,34 408,268 52,268" fill="url(#tg)" stroke="var(--line-2)" stroke-width="1.5"/>' +
      '<circle cx="230" cy="34" r="6" fill="var(--brand)"/>' +
      '<circle cx="408" cy="268" r="6" fill="var(--accent)"/>' +
      '<circle cx="52" cy="268" r="6" fill="var(--blue)"/>' +
      '<text x="230" y="20" text-anchor="middle" font-size="13" font-weight="700" fill="var(--ink)">行程</text>' +
      '<text x="408" y="290" text-anchor="middle" font-size="13" font-weight="700" fill="var(--ink)">压力</text>' +
      '<text x="52" y="290" text-anchor="middle" font-size="13" font-weight="700" fill="var(--ink)">寿命</text>' +
      '<text x="230" y="150" text-anchor="middle" font-size="12" fill="var(--muted)">三个都要</text>' +
      '<text x="230" y="172" text-anchor="middle" font-size="12" fill="var(--muted)">必然加钱</text>' +
      '<text x="230" y="194" text-anchor="middle" font-size="12" fill="var(--muted)">或加尺寸</text>' +
      "</svg>";
  }

  function figMap() {
    var boxes = [
      { x: 20, y: 20, t: "结构", s: "波峰 / 波谷 / 端接" },
      { x: 250, y: 20, t: "工艺", s: "成型 · 焊接 · 电铸" },
      { x: 20, y: 150, t: "参数", s: "六个必问项" },
      { x: 250, y: 150, t: "取舍", s: "行程 · 压力 · 寿命" }
    ];
    var s = '<svg viewBox="0 0 480 290" role="img" aria-label="第一周知识地图">';
    s += '<defs><marker id="ar" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6" fill="var(--muted)"/></marker></defs>';
    boxes.forEach(function (b) {
      s += '<rect x="' + b.x + '" y="' + b.y + '" width="200" height="90" rx="14" fill="var(--panel-2)" stroke="var(--line-2)"/>';
      s += '<text x="' + (b.x + 100) + '" y="' + (b.y + 40) + '" text-anchor="middle" font-size="16" font-weight="700" fill="var(--ink)">' + b.t + "</text>";
      s += '<text x="' + (b.x + 100) + '" y="' + (b.y + 64) + '" text-anchor="middle" font-size="11.5" fill="var(--muted)">' + b.s + "</text>";
    });
    s += '<path d="M220 65 H246" stroke="var(--muted)" stroke-width="1.6" marker-end="url(#ar)"/>';
    s += '<path d="M120 110 V146" stroke="var(--muted)" stroke-width="1.6" marker-end="url(#ar)"/>';
    s += '<path d="M350 110 V146 H456" stroke="var(--muted)" stroke-width="1.6" fill="none" marker-end="url(#ar)"/>';
    s += "</svg>";
    return s;
  }

  /* ---------------- 交互组件 ---------------- */
  function widgetHTML(b) {
    if (b.kind === "bellows") {
      return '<div class="widget" data-widget="bellows">' +
        '<div class="widget-h"><h4>' + esc(b.title) + '</h4><span class="chip brand">拖动试试</span></div>' +
        '<p class="hint">' + md(b.hint) + "</p>" +
        '<svg id="bwSvg" viewBox="0 0 620 190" role="img" aria-label="波纹管压缩动画"></svg>' +
        '<input class="range" type="range" id="bwRange" min="0" max="55" value="12" step="1" aria-label="压缩行程">' +
        '<div class="wout" id="bwOut"></div>' +
        "</div>";
    }
    if (b.kind === "area") {
      return '<div class="widget" data-widget="area">' +
        '<div class="widget-h"><h4>' + esc(b.title) + '</h4><span class="chip brand">实时计算</span></div>' +
        '<p class="hint">' + md(b.hint) + "</p>" +
        '<div class="wgrid">' +
        '<label class="wfield">推力 F (N)<input type="number" id="arF" value="200" min="0" step="10" inputmode="decimal"></label>' +
        '<label class="wfield">压力 P (bar)<input type="number" id="arP" value="1" min="0" step="0.1" inputmode="decimal"></label>' +
        '<label class="wfield">外径 Do (mm)<input type="number" id="arD" value="60" min="1" step="1" inputmode="decimal"></label>' +
        "</div>" +
        '<div class="wout" id="arOut"></div>' +
        "</div>";
    }
    return "";
  }

  function initWidgets(root) {
    var bw = $('[data-widget="bellows"]', root);
    if (bw) {
      var range = $("#bwRange", bw), svg = $("#bwSvg", bw), out = $("#bwOut", bw);
      var draw = function () {
        var c = parseInt(range.value, 10);
        var x0 = 60, x1 = 560;
        var len = (x1 - x0) * (1 - c / 100);
        var xEnd = x0 + len;
        var amp = 26 * (1 + c / 110);
        var cy = 95;
        var g = bellowsD(x0, xEnd, cy, amp, 8, "var(--brand)");
        svg.innerHTML =
          '<rect x="26" y="52" width="24" height="86" rx="5" fill="var(--line-2)"/>' +
          '<rect x="' + (xEnd + 10) + '" y="52" width="24" height="86" rx="5" fill="var(--line-2)"/>' +
          '<rect x="' + (x0 - 4) + '" y="56" width="' + (len + 8) + '" height="78" rx="6" fill="var(--brand-soft)" opacity=".5"/>' +
          g +
          '<line x1="' + x0 + '" y1="158" x2="' + xEnd + '" y2="158" stroke="var(--muted)" stroke-width="1" stroke-dasharray="4 4"/>' +
          '<text x="' + (x0 + len / 2) + '" y="176" text-anchor="middle" font-size="11.5" fill="var(--muted)">压缩后长度</text>' +
          '<text x="310" y="24" text-anchor="middle" font-size="12" fill="var(--brand)" font-weight="700">' +
          (c === 0 ? "自由状态" : "压缩 " + c + "%") + "</text>";

        var ratio = c;
        var cls = ratio > 40 ? "bad" : ratio > 25 ? "mid" : "ok";
        var txt = ratio > 40 ? "行程比过高：多数工艺寿命会急剧下降，需要重新评估波数或直径。"
          : ratio > 25 ? "行程比偏高：焊接件尚可评估，成型/电铸要谨慎。"
            : "行程比温和：常规设计区间。";
        out.innerHTML =
          row("压缩量", c + " %") +
          row("剩余长度", Math.round(100 - c) + " %") +
          row("行程比", c + " / 100") +
          '<div class="wverdict"><span class="' + cls + '">' + txt + "</span></div>";
      };
      range.addEventListener("input", draw);
      draw();
    }

    var aw = $('[data-widget="area"]', root);
    if (aw) {
      var F = $("#arF", aw), P = $("#arP", aw), D = $("#arD", aw), o = $("#arOut", aw);
      var calc = function () {
        var f = parseFloat(F.value), p = parseFloat(P.value), d = parseFloat(D.value);
        if (!(f > 0) || !(p > 0)) {
          o.innerHTML = '<span class="bad">请输入大于 0 的推力与压力。</span>';
          return;
        }
        var A = f / (p * 0.1);              // bar → N/mm²
        var deq = Math.sqrt(4 * A / Math.PI);
        var full = d > 0 ? Math.PI * d * d / 4 : 0;
        var share = full > 0 ? A / full * 100 : 0;
        var cls = share > 85 ? "bad" : share > 70 ? "mid" : "ok";
        var txt = share > 85 ? "面积占比过高：外径偏小，实际做不出来，建议加大外径或降低推力。"
          : share > 70 ? "面积占比偏高：可行区间上沿，需要工程确认。"
            : "面积占比合理，方案有实现空间。";
        o.innerHTML =
          row("有效面积 A_eff", num(A, 0) + " mm²") +
          row("等效直径", num(deq, 1) + " mm") +
          (full > 0 ? row("外径全截面", num(full, 0) + " mm²") : "") +
          (full > 0 ? row("面积占比", num(share, 0) + " %") : "") +
          '<div class="wverdict"><span class="' + cls + '">' + txt + "</span></div>";
      };
      [F, P, D].forEach(function (el) { el.addEventListener("input", calc); });
      calc();
    }
  }

  function row(k, v) {
    return '<div class="wrow"><span class="k">' + k + '</span><span class="v">' + v + "</span></div>";
  }

  /* ---------------- 渲染 ---------------- */

  /* ---------------- Auto 专栏 ---------------- */
  function autoFig(name) {
    if (name === "pistonCurve") {
      var pts = [];
      var r = 1, l = 3.33, lam = r / l, S = 2 * r;
      for (var d = 0; d <= 360; d += 6) {
        var th = d * Math.PI / 180;
        var x = r * (1 - Math.cos(th)) + l * (1 - Math.sqrt(1 - lam * lam * Math.sin(th) * Math.sin(th)));
        var px = 80 + (d / 360) * 500;
        var py = 240 - (x / S) * 180;
        pts.push((d === 0 ? "M" : "L") + px.toFixed(1) + " " + py.toFixed(1));
      }
      var marks = [0, 90, 180, 270, 360].map(function (d) {
        return '<line x1="' + (80 + d / 360 * 500) + '" y1="240" x2="' + (80 + d / 360 * 500) + '" y2="246" stroke="var(--muted)" stroke-width="1"/>' +
          '<text x="' + (80 + d / 360 * 500) + '" y="262" text-anchor="middle" font-size="10" fill="var(--muted)">' + d + "°</text>";
      }).join("");
      return '<svg viewBox="0 0 620 300" role="img" aria-label="活塞位置曲线">' +
        '<line x1="80" y1="240" x2="590" y2="240" stroke="var(--line-2)" stroke-width="1.4"/>' +
        '<line x1="80" y1="240" x2="80" y2="50" stroke="var(--line-2)" stroke-width="1.4"/>' +
        '<text x="590" y="290" text-anchor="end" font-size="10.5" fill="var(--muted)">曲轴转角 θ</text>' +
        '<text x="72" y="56" text-anchor="end" font-size="10.5" fill="var(--muted)">活塞位置 x</text>' +
        '<path d="' + pts.join(" ") + '" fill="none" stroke="var(--brand)" stroke-width="2.8"/>' +
        marks +
        '<line x1="80" y1="60" x2="80" y2="240" stroke="var(--muted)" stroke-width="1" stroke-dasharray="3 3"/>' +
        '<text x="92" y="66" font-size="10" fill="var(--muted)">TDC</text>' +
        '<text x="92" y="234" font-size="10" fill="var(--muted)">BDC</text>' +
        "</svg>";
    }
    if (name === "rodForce") {
      return '<svg viewBox="0 0 660 320" role="img" aria-label="力的分解">' +
        '<line x1="292" y1="30" x2="292" y2="170" stroke="var(--ink-2)" stroke-width="2"/>' +
        '<line x1="368" y1="30" x2="368" y2="170" stroke="var(--ink-2)" stroke-width="2"/>' +
        '<rect x="296" y="56" width="68" height="20" rx="3" fill="var(--brand)" opacity=".85"/>' +
        '<line x1="330" y1="26" x2="330" y2="54" stroke="var(--brand)" stroke-width="3"/>' +
        '<text x="338" y="26" font-size="11" fill="var(--brand)">F 燃气力</text>' +
        '<circle cx="330" cy="76" r="4" fill="var(--ink)"/>' +
        '<line x1="330" y1="76" x2="392" y2="212" stroke="var(--brand)" stroke-width="3"/>' +
        '<circle cx="392" cy="212" r="5" fill="var(--brand)"/>' +
        '<circle cx="330" cy="212" r="34" fill="none" stroke="var(--ink-2)" stroke-width="1.6" stroke-dasharray="4 3"/>' +
        '<line x1="330" y1="76" x2="298" y2="76" stroke="var(--blue)" stroke-width="3"/>' +
        '<text x="120" y="64" font-size="11" fill="var(--blue)">Fn 侧向力</text>' +
        '<line x1="392" y1="212" x2="426" y2="188" stroke="var(--muted)" stroke-width="2.6"/>' +
        '<text x="432" y="184" font-size="11" fill="var(--muted)">Ft 切向力（产生扭矩）</text>' +
        '<text x="352" y="188" font-size="11" fill="var(--brand)">连杆</text>' +
        '<text x="286" y="252" text-anchor="end" font-size="10" fill="var(--muted)">缸壁</text>' +
        '<text x="330" y="300" text-anchor="middle" font-size="10.5" fill="var(--muted)">F → Fn（压缸壁）+ 连杆力 → Ft（转曲轴）</text>' +
        "</svg>";
    }
    if (name === "pistonPos") {
      return '<svg viewBox="0 0 660 320" role="img" aria-label="上止点与下止点">' +
        '<rect x="270" y="30" width="120" height="240" rx="8" fill="none" stroke="var(--ink-2)" stroke-width="2.5"/>' +
        '<rect x="278" y="42" width="104" height="26" rx="4" fill="var(--brand)" opacity=".25" stroke="var(--brand)" stroke-dasharray="4 3"/>' +
        '<rect x="278" y="232" width="104" height="26" rx="4" fill="var(--brand)" opacity=".85"/>' +
        '<line x1="330" y1="68" x2="330" y2="232" stroke="var(--brand)" stroke-width="2" stroke-dasharray="6 4"/>' +
        '<line x1="420" y1="55" x2="420" y2="245" stroke="var(--muted)" stroke-width="1.4"/>' +
        '<line x1="412" y1="55" x2="428" y2="55" stroke="var(--muted)" stroke-width="1.4"/>' +
        '<line x1="412" y1="245" x2="428" y2="245" stroke="var(--muted)" stroke-width="1.4"/>' +
        '<text x="436" y="156" font-size="12" fill="var(--ink-2)">行程 S = 2r</text>' +
        '<text x="150" y="60" text-anchor="end" font-size="12" fill="var(--muted)">上止点 TDC</text>' +
        '<text x="150" y="250" text-anchor="end" font-size="12" fill="var(--muted)">下止点 BDC</text>' +
        '<line x1="158" y1="56" x2="272" y2="56" stroke="var(--muted)" stroke-width="1" stroke-dasharray="4 3"/>' +
        '<line x1="158" y1="246" x2="272" y2="246" stroke="var(--muted)" stroke-width="1" stroke-dasharray="4 3"/>' +
        '<text x="330" y="300" text-anchor="middle" font-size="11" fill="var(--muted)">活塞走一个行程，曲轴转 180°</text>' +
        "</svg>";
    }
    if (name === "strokeSeq") {
      var panels = [
        { x: 10, t: "① 进气", down: true, i: 1, e: 0 },
        { x: 170, t: "② 压缩", down: false, i: 0, e: 0 },
        { x: 330, t: "③ 做功", down: true, i: 0, e: 0 },
        { x: 490, t: "④ 排气", down: false, i: 0, e: 1 }
      ];
      var out = panels.map(function (q) {
        var pv = q.down ? 58 : 34;
        return '<g transform="translate(' + q.x + ',0)">' +
          '<rect x="30" y="26" width="80" height="150" rx="6" fill="none" stroke="var(--ink-2)" stroke-width="2"/>' +
          '<rect x="36" y="' + pv + '" width="68" height="20" rx="3" fill="var(--brand)" opacity=".85"/>' +
          '<line x1="30" y1="26" x2="22" y2="12" stroke="' + (q.i ? "var(--blue)" : "var(--line-2)") + '" stroke-width="3"/>' +
          '<line x1="110" y1="26" x2="118" y2="12" stroke="' + (q.e ? "var(--blue)" : "var(--line-2)") + '" stroke-width="3"/>' +
          '<text x="70" y="206" text-anchor="middle" font-size="13" font-weight="700" fill="var(--ink)">' + q.t + "</text>" +
          '<text x="70" y="224" text-anchor="middle" font-size="10.5" fill="var(--muted)">' + (q.down ? "活塞下行" : "活塞上行") + "</text>" +
          "</g>";
      }).join("");
      return '<svg viewBox="0 0 660 250" role="img" aria-label="四个冲程示意">' + out +
        '<text x="330" y="244" text-anchor="middle" font-size="10.5" fill="var(--muted)">蓝色气门 = 打开；灰色 = 关闭</text>' +
        "</svg>";
    }
    if (name === "pvLoop") {
      return '<svg viewBox="0 0 660 300" role="img" aria-label="四冲程 P-V 图">' +
        '<line x1="80" y1="250" x2="620" y2="250" stroke="var(--line-2)" stroke-width="1.5"/>' +
        '<line x1="80" y1="250" x2="80" y2="40" stroke="var(--line-2)" stroke-width="1.5"/>' +
        '<text x="618" y="272" text-anchor="end" font-size="11" fill="var(--muted)">气缸容积 V</text>' +
        '<text x="72" y="36" text-anchor="end" font-size="11" fill="var(--muted)">压力 P</text>' +
        '<path d="M140 215 L590 215" fill="none" stroke="var(--blue)" stroke-width="2.6"/>' +
        '<path d="M590 215 C400 205 220 160 140 78" fill="none" stroke="var(--muted)" stroke-width="2.6"/>' +
        '<path d="M140 62 C260 74 430 120 580 186" fill="none" stroke="var(--brand)" stroke-width="2.8"/>' +
        '<path d="M580 207 L140 207" fill="none" stroke="var(--line-2)" stroke-width="2.6"/>' +
        '<text x="360" y="238" text-anchor="middle" font-size="11.5" fill="var(--blue)">① 进气</text>' +
        '<text x="300" y="120" text-anchor="middle" font-size="11.5" fill="var(--muted)">② 压缩</text>' +
        '<text x="360" y="92" text-anchor="middle" font-size="11.5" font-weight="700" fill="var(--brand)">③ 做功</text>' +
        '<text x="470" y="200" text-anchor="middle" font-size="11.5" fill="var(--muted)">④ 排气</text>' +
        '<text x="132" y="72" text-anchor="end" font-size="10" fill="var(--muted)">TDC</text>' +
        '<text x="596" y="230" font-size="10" fill="var(--muted)">BDC</text>' +
        '<text x="360" y="278" text-anchor="middle" font-size="10.5" fill="var(--muted)">四条线围出的面积 = 每循环的功</text>' +
        "</svg>";
    }
    if (name === "crankGeo") {
      return '<svg viewBox="0 0 660 320" role="img" aria-label="曲柄连杆机构">' +
        '<line x1="330" y1="26" x2="330" y2="300" stroke="var(--line-2)" stroke-width="1" stroke-dasharray="6 5"/>' +
        '<rect x="298" y="42" width="64" height="104" rx="6" fill="none" stroke="var(--ink-2)" stroke-width="2"/>' +
        '<rect x="304" y="58" width="52" height="22" rx="3" fill="var(--brand)" opacity=".85"/>' +
        '<circle cx="330" cy="69" r="4" fill="var(--ink)"/>' +
        '<circle cx="330" cy="226" r="54" fill="none" stroke="var(--ink-2)" stroke-width="2"/>' +
        '<line x1="330" y1="226" x2="366" y2="190" stroke="var(--brand)" stroke-width="3.4"/>' +
        '<circle cx="366" cy="190" r="6" fill="var(--brand)"/>' +
        '<line x1="330" y1="69" x2="366" y2="190" stroke="var(--brand)" stroke-width="3.4"/>' +
        '<path d="M330 176 A50 50 0 0 1 350 192" fill="none" stroke="var(--blue)" stroke-width="1.8"/>' +
        '<text x="344" y="172" font-size="11" fill="var(--blue)">θ</text>' +
        '<text x="380" y="214" font-size="11" fill="var(--muted)">曲柄 r</text>' +
        '<text x="282" y="142" font-size="11" fill="var(--brand)">连杆 l</text>' +
        '<text x="250" y="52" font-size="11" fill="var(--muted)">活塞</text>' +
        '<text x="236" y="290" font-size="11" fill="var(--muted)">曲轴</text>' +
        '<line x1="430" y1="58" x2="430" y2="146" stroke="var(--muted)" stroke-width="1.2"/>' +
        '<line x1="424" y1="58" x2="436" y2="58" stroke="var(--muted)" stroke-width="1.2"/>' +
        '<line x1="424" y1="146" x2="436" y2="146" stroke="var(--muted)" stroke-width="1.2"/>' +
        '<text x="440" y="106" font-size="11" fill="var(--ink-2)">行程 S = 2r</text>' +
        "</svg>";
    }
    if (name === "valvetrain") {
      return '<svg viewBox="0 0 660 260" role="img" aria-label="配气机构">' +
        '<ellipse cx="200" cy="66" rx="46" ry="30" fill="var(--brand)" opacity=".85"/>' +
        '<circle cx="200" cy="66" r="5" fill="var(--ink)"/>' +
        '<line x1="200" y1="66" x2="200" y2="40" stroke="var(--ink-2)" stroke-width="1.5" stroke-dasharray="3 3"/>' +
        '<rect x="193" y="96" width="14" height="70" rx="3" fill="var(--ink-2)"/>' +
        '<path d="M180 96 h40 l-8 18 h-24 z" fill="var(--brand)" opacity=".7"/>' +
        '<rect x="170" y="120" width="60" height="48" rx="6" fill="none" stroke="var(--line-2)" stroke-width="1.5"/>' +
        '<path d="M186 124 v40 M200 124 v40 M214 124 v40" stroke="var(--muted)" stroke-width="1.2"/>' +
        '<path d="M170 168 h60" stroke="var(--ink-2)" stroke-width="2"/>' +
        '<path d="M260 60 h120 M260 120 h120" stroke="var(--muted)" stroke-width="1" stroke-dasharray="4 4"/>' +
        '<text x="330" y="52" font-size="11" fill="var(--muted)">凸轮升程</text>' +
        '<text x="330" y="112" font-size="11" fill="var(--muted)">气门开启</text>' +
        '<text x="330" y="186" font-size="11" fill="var(--muted)">气门弹簧负责关闭</text>' +
        "</svg>";
    }
    if (name === "autoTimeline") {
      var nodes = [
        { x: 30, y: "1886", t: "Benz 三轮车" },
        { x: 150, y: "1913", t: "移动装配线" },
        { x: 270, y: "1975", t: "催化转化器" },
        { x: 390, y: "1997", t: "Prius 混动" },
        { x: 510, y: "2012", t: "纯电量产" },
        { x: 620, y: "2020s", t: "软件定义" }
      ];
      var dots = nodes.map(function (n, i) {
        var col = i < 3 ? "var(--blue)" : "var(--brand)";
        return '<circle cx="' + n.x + '" cy="70" r="6" fill="' + col + '"/>' +
          '<text x="' + n.x + '" y="46" text-anchor="middle" font-size="12" font-weight="700" fill="var(--ink)">' + n.y + "</text>" +
          '<text x="' + n.x + '" y="96" text-anchor="middle" font-size="10.5" fill="var(--muted)">' + n.t + "</text>";
      }).join("");
      return '<svg viewBox="0 0 660 130" role="img" aria-label="汽车百年时间线">' +
        '<line x1="20" y1="70" x2="640" y2="70" stroke="var(--line-2)" stroke-width="2"/>' + dots +
        '<text x="20" y="122" font-size="10" fill="var(--muted)">机械时代</text>' +
        '<text x="620" y="122" text-anchor="end" font-size="10" fill="var(--muted)">电动与软件时代</text>' +
        "</svg>";
    }
    return "";
  }

  function viewAuto(arg) {
    var A = window.AUTO;
    if (!A) return '<div class="locked-view"><h2>Auto 专栏未加载</h2></div>';

    if (arg && A.lessons[arg]) {
      var L = A.lessons[arg];
      var html = '<div class="crumb"><a href="#/auto">Auto</a> / ' + esc(L.kicker) + "</div>";
      html += '<article class="article auto-art">';
      html += '<header class="art-head"><div class="art-kicker"><span class="chip brand">Auto</span><span class="chip">' + esc(L.kicker) + "</span></div>";
      html += "<h1>" + esc(L.title) + "</h1>";
      html += '<p class="sub">' + md(L.lead) + "</p></header>";
      L.blocks.forEach(function (b) {
        if (b.t === "figure") {
          html += '<figure class="fig">' + autoFig(b.name) + (b.cap ? "<figcaption>" + esc(b.cap) + "</figcaption>" : "") + "</figure>";
        } else {
          html += renderBlock(b);
        }
      });
      if (L.exam) {
        html += '<h2>课后测验</h2>' + renderBlock({ t: "quiz", items: L.exam.questions.map(function (q) {
          return { q: q.q, a: "正确答案：" + q.opts[q.a] + "。" + q.why };
        }) });
      }
      if (L.sources) {
        html += '<div class="auto-src">' + L.sources.map(function (s) {
          return '<a href="' + s.u + '" target="_blank" rel="noopener">' + esc(s.t) + "</a>";
        }).join("") + "</div>";
      }
      html += '<p style="margin-top:22px"><a class="btn btn-ghost" href="#/auto">← 返回 Auto 目录</a></p>';
      html += "</article>";
      return html;
    }

    var chapters = A.chapters.map(function (ch) {
      var items = ch.lessons.map(function (l) {
        var ready = l.status === "ready";
        return ready
          ? '<a class="auto-li ready" href="#/auto/' + l.id + '"><span class="auto-dot2"></span>' + esc(l.t) + "</a>"
          : '<span class="auto-li"><span class="auto-dot2"></span>' + esc(l.t) + '<em>筹备中</em></span>';
      }).join("");
      return '<section class="auto-ch"><div class="auto-ch-h"><h3>' + esc(ch.t) + "</h3><p>" + esc(ch.d) + "</p></div>" +
        '<div class="auto-list">' + items + "</div></section>";
    }).join("");

    return '<div class="crumb">Auto</div>' +
      '<section class="auto-hero"><p class="eyebrow">Auto · 汽车工程</p><h1>' + esc(A.meta.title) + "</h1>" +
      "<p>" + esc(A.meta.intro) + "</p></section>" +
      '<div class="auto-grid">' + chapters + "</div>";
  }

  function render() {
    var r = route();
    var app = $("#app");
    var html = "";
    if (r.name === "lesson") { html = viewLesson(r.arg); }
    else if (r.name === "plan") { html = viewPlan(); }
    else if (r.name === "basics") { html = viewBasics(); }
    else if (r.name === "method") { html = viewMethod(); }
    else if (r.name === "lab") { html = window.LAB ? LAB.view() : "<p>实验室加载失败</p>"; }
    else if (r.name === "auto") { html = viewAuto(r.arg); }
    else { html = viewHome(); }

    app.innerHTML = html;
    setActiveNav(r.name === "lesson" ? "plan" : r.name);
    if (r.name === "lab" && window.LAB) { LAB.init(app); }

    if (r.name === "lesson") {
      initWidgets(app);
      initExam(app, parseInt(r.arg, 10));
      var btn = $("#doneBtn");
      if (btn) {
        btn.addEventListener("click", function () {
          var id = parseInt(r.arg, 10);
          var i = done.indexOf(id);
          if (i >= 0) { done.splice(i, 1); } else { done.push(id); }
          save("mw.done", done);
          btn.classList.toggle("is-done", done.indexOf(id) >= 0);
          btn.textContent = done.indexOf(id) >= 0 ? "✓ 已完成本课" : "标记完成本课";
          updateHeader();
          toast(done.indexOf(id) >= 0 ? "已记录，明天继续" : "已取消完成标记");
        });
      }
      window.scrollTo({ top: 0, behavior: "auto" });
    } else {
      window.scrollTo({ top: 0, behavior: "auto" });
    }
    updateHeader();
    document.title = r.name === "auto" ? "Auto · 汽车工程" : r.name === "lesson"
      ? "第 " + r.arg + " 课 · " + (C.lessons[r.arg - 1] ? C.lessons[r.arg - 1].t : "") + " · " + C.meta.title
      : C.meta.title;
  }

  function updateHeader() {
    var el = $("#hdrProgress");
    if (el) el.textContent = done.length + " / " + C.meta.totalDays;
  }

  /* ---------------- 杂项 ---------------- */
  var toastEl = null, toastTimer = null;
  function toast(msg) {
    if (!toastEl) {
      toastEl = document.createElement("div");
      toastEl.className = "toast";
      document.body.appendChild(toastEl);
    }
    toastEl.textContent = msg;
    toastEl.classList.add("on");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { toastEl.classList.remove("on"); }, 1800);
  }

  function onScroll() {
    var h = document.documentElement;
    var max = h.scrollHeight - h.clientHeight;
    var p = max > 0 ? (h.scrollTop || document.body.scrollTop) / max * 100 : 0;
    var bar = $("#scrollBar");
    if (bar) bar.style.width = p + "%";
  }

  /* ---------------- 启动 ---------------- */
  function init() {
    var q = (location.search || "").match(/theme=(dark|light)/);
    if (q) applyTheme(q[1]);
    var tb = $("#themeBtn");
    if (tb) {
      tb.addEventListener("click", function () {
        applyTheme(theme === "light" ? "dark" : "light");
      });
    }
    // 目录跳转：不能用 hash，否则会触发路由
    document.addEventListener("click", function (e) {
      var a = e.target.closest ? e.target.closest("[data-scroll]") : null;
      if (!a) return;
      e.preventDefault();
      var el = document.getElementById(a.getAttribute("data-scroll"));
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    });
    window.addEventListener("hashchange", render);
    window.addEventListener("scroll", onScroll, { passive: true });
    if (!location.hash) location.replace("#/home");
    render();
    onScroll();
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
