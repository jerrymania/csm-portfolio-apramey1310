(function () {
  var S = window.SITE || {};

  /* 1. Fill values from config.js. Empty value -> dashed spacer line. */
  document.querySelectorAll("[data-fill]").forEach(function (el) {
    var key = el.getAttribute("data-fill");
    var val = (S[key] || "").toString().trim();
    if (val) {
      el.textContent = val;
    } else {
      el.innerHTML = '<span class="blank" title="Set ' + key + ' in assets/js/config.js">&nbsp;</span>';
    }
  });

  /* Links that only appear when a value exists (email, linkedin, resume...) */
  document.querySelectorAll("[data-link]").forEach(function (el) {
    var key = el.getAttribute("data-link");
    var val = (S[key] || "").toString().trim();
    if (!val) { el.hidden = true; return; }
    if (key === "email") el.href = "mailto:" + val;
    else if (key === "phone") el.href = "tel:" + val.replace(/\s+/g, "");
    else el.href = val;
  });

  /* 2. Image placeholders: <figure class="ph" data-src="images/x.jpg" data-label="...">
        If the image exists it is shown; otherwise a labelled placeholder stays. */
  document.querySelectorAll(".ph[data-src]").forEach(function (fig) {
    var src = fig.getAttribute("data-src");
    var label = fig.getAttribute("data-label") || "Add image";
    if (!fig.querySelector(".ph-in")) {
      fig.innerHTML = '<div class="ph-in"><div class="ph-ico"></div><div class="ph-t"></div><div class="ph-f"></div></div>';
      fig.querySelector(".ph-t").textContent = label;
      fig.querySelector(".ph-f").textContent = src;
    }
    var img = new Image();
    img.alt = fig.getAttribute("data-alt") || label;
    img.onload = function () { fig.innerHTML = ""; fig.appendChild(img); fig.classList.add("has-img"); };
    img.src = src;
  });

  /* 3. Download buttons only show when the file is actually deployed */
  document.querySelectorAll("[data-file]").forEach(function (a) {
    var f = a.getAttribute("data-file");
    a.hidden = true;
    if (location.protocol === "file:") return;
    fetch(f, { method: "HEAD" }).then(function (r) {
      if (r.ok) { a.href = f; a.hidden = false; }
    }).catch(function () {});
  });

  /* 4. Mobile menu */
  var btn = document.querySelector(".menu-btn"), nav = document.querySelector(".nav");
  if (btn && nav) btn.addEventListener("click", function () { nav.classList.toggle("open"); });

  /* 5. Reveal on scroll */
  var els = document.querySelectorAll(".rv");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } });
    }, { rootMargin: "0px 0px -8% 0px" });
    els.forEach(function (e) { io.observe(e); });
  } else { els.forEach(function (e) { e.classList.add("in"); }); }

  /* 6. Stacked bar charts: <div class="bars" data-series='{...}'></div> */
  document.querySelectorAll(".bars").forEach(function (box) {
    var d = JSON.parse(box.getAttribute("data-series"));
    var a = d.a, b = d.b, labels = d.labels, n = a.length;
    var max = Math.max.apply(null, a.map(function (v, i) { return v + b[i]; }));
    var top = Math.ceil(max / 20) * 20;
    var W = 760, H = 300, L = 40, R = 10, T = 16, B = 34;
    var cw = (W - L - R) / n, bw = cw * 0.66;
    var y = function (v) { return T + (H - T - B) * (1 - v / top); };
    var s = '<svg viewBox="0 0 ' + W + " " + H + '" role="img" aria-label="' + (d.title || "chart") + '">';
    for (var g = 0; g <= top; g += 20) {
      s += '<line x1="' + L + '" x2="' + (W - R) + '" y1="' + y(g) + '" y2="' + y(g) + '" stroke="#C6D0D5" stroke-width="1"/>';
      s += '<text x="' + (L - 6) + '" y="' + (y(g) + 4) + '" text-anchor="end" font-family="JetBrains Mono" font-size="10" fill="#6B7A85">' + g + "</text>";
    }
    for (var i = 0; i < n; i++) {
      var x = L + i * cw + (cw - bw) / 2, tot = a[i] + b[i];
      if (tot > 0) {
        s += '<rect x="' + x + '" y="' + y(a[i]) + '" width="' + bw + '" height="' + (y(0) - y(a[i])) + '" fill="#1F4E79"/>';
        s += '<rect x="' + x + '" y="' + y(tot) + '" width="' + bw + '" height="' + (y(a[i]) - y(tot)) + '" fill="#E0661A"/>';
        if (d.peak && tot === max) s += '<text x="' + (x + bw / 2) + '" y="' + (y(tot) - 5) + '" text-anchor="middle" font-family="JetBrains Mono" font-size="11" font-weight="700" fill="#14212B">' + tot + "</text>";
      }
      if (i % (d.every || 1) === 0) s += '<text x="' + (x + bw / 2) + '" y="' + (H - B + 16) + '" text-anchor="middle" font-family="JetBrains Mono" font-size="10" fill="#6B7A85">' + labels[i] + "</text>";
    }
    s += '<line x1="' + L + '" x2="' + (W - R) + '" y1="' + y(0) + '" y2="' + y(0) + '" stroke="#14212B" stroke-width="1.5"/>';
    if (d.xlabel) s += '<text x="' + (W / 2) + '" y="' + (H - 2) + '" text-anchor="middle" font-family="JetBrains Mono" font-size="10" fill="#3A4954">' + d.xlabel + "</text>";
    s += "</svg>";
    box.innerHTML = s;
  });

  /* year */
  document.querySelectorAll("[data-year]").forEach(function (e) { e.textContent = new Date().getFullYear(); });
})();
