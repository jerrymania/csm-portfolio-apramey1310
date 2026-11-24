/* Progressive enhancement only: every page reads fine without JavaScript. */
(function () {
  var btn = document.querySelector(".sheets-btn"), menu = document.getElementById("sheets-menu");
  if (btn && menu) {
    btn.addEventListener("click", function (e) { e.stopPropagation(); var o = menu.classList.toggle("open"); btn.setAttribute("aria-expanded", o); });
    document.addEventListener("click", function (e) { if (!menu.contains(e.target)) { menu.classList.remove("open"); btn.setAttribute("aria-expanded", "false"); } });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") { menu.classList.remove("open"); btn.setAttribute("aria-expanded", "false"); } });
  }
  /* reveal */
  var els = document.querySelectorAll(".rv");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }); }, { rootMargin: "0px 0px -6% 0px" });
    els.forEach(function (e) { io.observe(e); });
  } else els.forEach(function (e) { e.classList.add("in"); });
  /* lightbox */
  var dlg = document.getElementById("lb");
  if (dlg && dlg.showModal) {
    var im = dlg.querySelector("img"), cap = dlg.querySelector("p");
    document.querySelectorAll("a[data-lb]").forEach(function (a) {
      a.addEventListener("click", function (ev) { ev.preventDefault(); im.src = a.getAttribute("href"); var i = a.querySelector("img"); im.alt = i ? i.alt : ""; cap.textContent = a.getAttribute("data-lb"); dlg.showModal(); });
    });
    dlg.querySelector(".lb-x").addEventListener("click", function () { dlg.close(); });
    dlg.addEventListener("click", function (e) { if (e.target === dlg) dlg.close(); });
  }
  /* progress + scrollspy */
  var bar = document.querySelector(".progress"), links = [].slice.call(document.querySelectorAll(".toc a"));
  var secs = links.map(function (a) { return document.querySelector(a.getAttribute("href")); });
  function onScroll() {
    var h = document.documentElement, max = h.scrollHeight - h.clientHeight;
    if (bar) bar.style.width = (max > 0 ? h.scrollTop / max * 100 : 0) + "%";
    var cur = -1; secs.forEach(function (s, i) { if (s && s.getBoundingClientRect().top < 140) cur = i; });
    links.forEach(function (a, i) { a.classList.toggle("on", i === cur); });
  }
  window.addEventListener("scroll", onScroll, { passive: true }); onScroll();
  /* stacked bar charts: <div class="bars" data-series='{...}'> */
  document.querySelectorAll(".bars").forEach(function (box) {
    var d = JSON.parse(box.getAttribute("data-series")), a = d.a, b = d.b, labels = d.labels, n = a.length;
    var max = Math.max.apply(null, a.map(function (v, i) { return v + b[i]; })), top = Math.ceil(max / 20) * 20;
    var W = 760, H = 300, L = 40, R = 10, T = 16, B = 34, cw = (W - L - R) / n, bw = cw * 0.62;
    var y = function (v) { return T + (H - T - B) * (1 - v / top); };
    var s = '<svg viewBox="0 0 ' + W + " " + H + '" role="img" aria-label="' + (d.title || "chart") + '">';
    for (var g = 0; g <= top; g += 20) {
      s += '<line x1="' + L + '" x2="' + (W - R) + '" y1="' + y(g) + '" y2="' + y(g) + '" stroke="#DFD7C8" stroke-dasharray="2 4"/>';
      s += '<text x="' + (L - 6) + '" y="' + (y(g) + 4) + '" text-anchor="end" font-family="Geist Mono,monospace" font-size="10" fill="#86817A">' + g + "</text>";
    }
    for (var i = 0; i < n; i++) {
      var x = L + i * cw + (cw - bw) / 2, tot = a[i] + b[i];
      if (tot > 0) {
        s += '<rect x="' + x + '" y="' + y(a[i]) + '" width="' + bw + '" height="' + (y(0) - y(a[i])) + '" rx="2" fill="#2E4A3B"/>';
        s += '<rect x="' + x + '" y="' + y(tot) + '" width="' + bw + '" height="' + (y(a[i]) - y(tot)) + '" rx="2" fill="#B4603A"/>';
        if (d.peak && tot === max) s += '<text x="' + (x + bw / 2) + '" y="' + (y(tot) - 6) + '" text-anchor="middle" font-family="Newsreader,serif" font-size="15" font-style="italic" fill="#1C1B18">' + tot + "</text>";
      }
      if (i % (d.every || 1) === 0) s += '<text x="' + (x + bw / 2) + '" y="' + (H - B + 16) + '" text-anchor="middle" font-family="Geist Mono,monospace" font-size="10" fill="#86817A">' + labels[i] + "</text>";
    }
    s += '<line x1="' + L + '" x2="' + (W - R) + '" y1="' + y(0) + '" y2="' + y(0) + '" stroke="#1C1B18"/>';
    if (d.xlabel) s += '<text x="' + (W / 2) + '" y="' + (H - 2) + '" text-anchor="middle" font-family="Geist Mono,monospace" font-size="10" fill="#4A473F">' + d.xlabel + "</text>";
    box.innerHTML = s + "</svg>";
  });
  document.querySelectorAll("[data-year]").forEach(function (e) { e.textContent = new Date().getFullYear(); });
})();
