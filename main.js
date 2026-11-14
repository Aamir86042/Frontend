import { config as C } from "./config2.js";
import { getToken, getUser, clearSession, loginUrl } from "./session.js";

const P = {
  megaphone: '<path d="m3 11 18-5v12L3 14v-3z"/><path d="M11.6 16.8a3 3 0 1 1-5.8-1.6"/>',
  search: '<circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/>',
  menu: '<path d="M4 6h16M4 12h16M4 18h16"/>',
  close: '<path d="M6 6l12 12M18 6 6 18"/>',
  chev: '<path d="m6 9 6 6 6-6"/>',
  arrow: '<path d="M5 12h14m-6-6 6 6-6 6"/>',
  building: '<path d="M3 21h18M5 21V10l7-5 7 5v11M9 21v-6h6v6"/>',
  cap: '<path d="m2 9 10-5 10 5-10 5z"/><path d="M6 11v5c0 1.5 3 3 6 3s6-1.5 6-3v-5"/>',
  doc: '<path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z"/><path d="M14 3v5h5M9 13h6M9 17h6"/>',
  cal: '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M16 3v4M8 3v4M3 11h18"/>',
  pen: '<path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z"/>',
  award: '<circle cx="12" cy="9" r="6"/><path d="m8.5 14-1.5 8 5-3 5 3-1.5-8"/>',
  download: '<path d="M12 3v12m-5-5 5 5 5-5M4 21h16"/>',
  play: '<path d="m7 4 13 8-13 8z"/>',
  pin: '<path d="M12 21s7-6.2 7-12a7 7 0 0 0-14 0c0 5.8 7 12 7 12z"/><circle cx="12" cy="9" r="2.5"/>',
  camera: '<path d="M4 8h3l2-3h6l2 3h3v12H4z"/><circle cx="12" cy="13" r="3.5"/>',
  globe: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a14 14 0 0 1 0 18 14 14 0 0 1 0-18"/>',
  link: '<path d="M10 14a5 5 0 0 0 7 0l3-3a5 5 0 0 0-7-7l-1 1M14 10a5 5 0 0 0-7 0l-3 3a5 5 0 0 0 7 7l1-1"/>',
  flask: '<path d="M9 3h6M10 3v6l-5 9a2 2 0 0 0 2 3h10a2 2 0 0 0 2-3l-5-9V3"/>',
  monitor: '<rect x="3" y="4" width="18" height="12" rx="2"/><path d="M8 20h8M12 16v4"/>',
  user: '<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>',
  mail: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/>',
  phone: '<path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z"/>',
  shield: '<path d="M12 3 4 6v6c0 5 3.5 8 8 9 4.5-1 8-4 8-9V6z"/>',
  grid: '<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>',
  chart: '<path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/>',
  spark: '<path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z"/><path d="M19 16l.8 2.2L22 19l-2.2.8L19 22l-.8-2.2L16 19l2.2-.8z"/>',
  send: '<path d="m22 2-11 11M22 2l-7 20-4-9-9-4z"/>',
};

const ic = (n) => `<svg class="ic" viewBox="0 0 24 24" aria-hidden="true">${P[n] || P.link}</svg>`;

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const el = (t, c, h) => {
  const e = document.createElement(t);
  if (c) e.className = c;
  if (h != null) e.innerHTML = h;
  return e;
};
const esc = (s) =>
  String(s ?? "").replace(/[&<>"]/g, (m) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[m]));
const ext = (u) => /^https?:/i.test(u || "");
const href = (u) => `href="${esc(u || "#")}"${ext(u) ? ' target="_blank" rel="noopener"' : ""}`;
const A = (i, c = "", inner) =>
  `<a ${href(i.url)}${c ? ` class="${c}"` : ""}>${inner ?? esc(i.title)}</a>`;
const setLink = (a, u) => {
  a.href = u || "#";
  if (ext(u)) {
    a.target = "_blank";
    a.rel = "noopener";
  }
};
const img = (src, alt = "", eager) =>
  src
    ? `<img src="${esc(src)}" alt="${esc(alt)}" ${eager ? 'fetchpriority="high"' : 'loading="lazy"'} decoding="async" referrerpolicy="no-referrer" onerror="this.style.display='none'">`
    : "";

$$("[data-ic]").forEach((e) => e.insertAdjacentHTML("afterbegin", ic(e.dataset.ic)));

const user = getUser();
const accountLink = () =>
  user
    ? `<a href="#" id="logout">${ic("user")} ${esc(String(user.name || "Account").split(" ")[0])} · Logout</a>`
    : `<a href="${C.auth.pages.login}">${ic("user")} Sign in</a>`;

const U = C.university;
const K = C.contact;
document.title = U.name;

const today = new Date().toLocaleDateString("en-IN", {
  weekday: "short",
  day: "numeric",
  month: "short",
  year: "numeric",
});

$("#topbar").innerHTML = `
  <div class="wrap">
    <div class="tb-l">
      <span class="hide-sm">${ic("cal")} ${today}</span>
      <a href="mailto:${esc(K.email)}">${ic("mail")} ${esc(K.email)}</a>
      <a class="hide-sm" href="tel:${esc(K.phone.replace(/\s/g, ""))}">${ic("phone")} ${esc(K.phone)}</a>
    </div>
    <div class="tb-r">
      ${C.social.map((s) => `<a class="soc" ${href(s.url)} aria-label="${esc(s.name)}">${esc(s.short)}</a>`).join("")}
      ${A(C.logins.student)}
      ${A(C.logins.faculty, "", ic("user") + " " + esc(C.logins.faculty.title))}
      ${accountLink()}
    </div>
  </div>`;

$("#logout")?.addEventListener("click", (e) => {
  e.preventDefault();
  clearSession();
  location.reload();
});

$("#brand").innerHTML = `
  <span class="lg" aria-hidden="true">${esc(U.logoText || U.short)}</span>
  <span class="bt"><b>${esc(U.name)}</b><small>${esc(U.tagline)}</small></span>`;

const dd = (title, kids, cls = "", icon = "") =>
  `<div class="dd">
    <button class="nb" aria-expanded="false" aria-haspopup="true">${icon}${esc(title)}${ic("chev")}</button>
    <div class="menu ${cls}">${kids.map((k) => A(k)).join("")}</div>
  </div>`;

const n = C.nav.length;
$("#nav").innerHTML =
  C.nav
    .map((x, i) =>
      x.children
        ? dd(x.title, x.children, i >= n - 2 ? "r" : "")
        : `<a ${href(x.url)}${i === 0 ? ' class="active"' : ""}>${esc(x.title)}</a>`
    )
    .join("") +
  dd(C.labels.campus || "Campuses", C.campuses.map((c) => ({ title: c.name, url: c.url })), "r", ic("building"));

const ann = $("#ann");
ann.innerHTML =
  `<h3>${ic("megaphone")} ${esc(C.labels.announcements)}</h3>` +
  Object.values(C.announcements)
    .map(
      (c) =>
        `<div class="ann-cat">${ic(c.icon)} ${esc(c.label)}</div>` +
        (c.items.length
          ? c.items.map((i) => A(i, "", ic("link") + `<span>${esc(i.title)}</span>`)).join("")
          : '<p class="empty">No items.</p>')
    )
    .join("");

const closeAnn = () => {
  ann.classList.remove("open");
  $$("[data-ann]").forEach((b) => b.setAttribute("aria-expanded", "false"));
};
const closeDD = () =>
  $$(".dd.open").forEach((d) => {
    d.classList.remove("open");
    d.firstElementChild.setAttribute("aria-expanded", "false");
  });
const closeNav = () => {
  $("#nav").classList.remove("open");
  $("#burger").setAttribute("aria-expanded", "false");
  document.body.classList.remove("lock");
};

$$("[data-ann]").forEach((b) =>
  b.addEventListener("click", () => {
    const open = !ann.classList.contains("open");
    closeAnn();
    closeDD();
    if (open) {
      const r = b.getBoundingClientRect();
      ann.style.top = r.bottom + 8 + "px";
      ann.style.maxHeight = Math.max(200, innerHeight - r.bottom - 24) + "px";
      ann.classList.add("open");
      b.setAttribute("aria-expanded", "true");
    }
  })
);

const grp = Array(3)
  .fill(C.latestLinks.map((l) => A(l)).join(""))
  .join("");
const run = $("#trun");
run.innerHTML = `<div class="g">${grp}</div><div class="g" aria-hidden="true">${grp.replace(/<a /g, '<a tabindex="-1" ')}</div>`;
requestAnimationFrame(() => {
  run.style.animationDuration = Math.max(25, run.firstElementChild.scrollWidth / 55) + "s";
});

const H = C.hero;
$("#ht").textContent = H.title;
$("#hs").textContent = H.subtitle;
$("#hb").innerHTML =
  H.buttons
    .map((b, i) => A(b, "btn " + (i ? "btn-blue" : "btn-white"), esc(b.title) + ic("arrow")))
    .join("") +
  `<button class="btn btn-ghost" id="wv">${ic("play")} ${esc(H.watchVideo.title)}</button>`;

$("#himg").style.backgroundImage = `url("${H.image}")`;
$("#camp").innerHTML = `
  <h2>${ic("building")} ${esc(C.labels.ourCampuses)}</h2>
  <ul>${C.campuses.map((c) => `<li>${A({ url: c.url }, "", ic("pin") + esc(c.name))}</li>`).join("")}</ul>`;

const vm = $("#vm");
const vwrap = $("#vwrap");
$("#wv").addEventListener("click", () => {
  const u = H.watchVideo.url;
  if (!u) return;
  const yt = u.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/))([\w-]{11})/);
  vwrap.innerHTML = "";
  if (yt) {
    const f = el("iframe");
    f.src = `https://www.youtube-nocookie.com/embed/${yt[1]}?autoplay=1&rel=0`;
    f.allow = "autoplay; encrypted-media; fullscreen";
    f.allowFullscreen = true;
    f.title = "Campus video";
    vwrap.append(f);
  } else {
    window.open(u, "_blank", "noopener");
    return;
  }
  vm.showModal();
});
$("#vmx").addEventListener("click", () => vm.close());
vm.addEventListener("close", () => {
  vwrap.innerHTML = "";
});
vm.addEventListener("click", (e) => {
  if (e.target === vm) vm.close();
});

$("#nlist").innerHTML = C.news
  .map(
    (x) =>
      `<li>${A(
        x,
        "ni",
        `<time class="dt"><b>${esc(x.day)}</b>${esc(x.month)}</time>
         <span class="nt">${esc(x.title)}${x.isNew ? '<em class="new">New</em>' : ""}</span>
         ${ic("arrow")}`
      )}</li>`
  )
  .join("");
setLink($("#nall"), C.newsViewAll);

function slider(root, list, render, ms = 5000) {
  const track = el("div", "sl-track");
  list.forEach((s) => track.append(render(s)));
  root.append(track);
  if (list.length < 2) return;
  const dots = el("div", "dots");
  let i = 0,
    t;
  const go = (k) => {
    i = (k + list.length) % list.length;
    track.style.transform = `translateX(-${i * 100}%)`;
    [...dots.children].forEach((d, j) => d.setAttribute("aria-current", j === i ? "true" : "false"));
  };
  list.forEach((_, k) => {
    const b = el("button");
    b.setAttribute("aria-label", "Slide " + (k + 1));
    b.onclick = () => go(k);
    dots.append(b);
  });
  root.append(dots);
  go(0);
  const stop = () => clearInterval(t);
  const play = () => {
    stop();
    if (!matchMedia("(prefers-reduced-motion: reduce)").matches) t = setInterval(() => go(i + 1), ms);
  };
  root.addEventListener("mouseenter", stop);
  root.addEventListener("mouseleave", play);
  root.addEventListener("focusin", stop);
  root.addEventListener("focusout", play);
  play();
}

slider($("#ban"), C.banners, (b) => {
  const a = el(
    "a",
    "slide",
    `${img(b.image, b.title)}<div class="bt2"><h2>${esc(b.title)}</h2><p>${esc(b.text)}</p><span class="btn btn-gold">${esc(b.button)}${ic("arrow")}</span></div>`
  );
  setLink(a, b.url);
  return a;
});

$("#qg").innerHTML = C.quickAccess
  .map((q) => A(q, "qi", `<span class="qic">${ic(q.icon)}</span>${esc(q.title)}`))
  .join("");

const g = C.campusLife;
$("#gall").innerHTML = esc(g.viewAll.title) + ic("arrow");
setLink($("#gall"), g.viewAll.url);
slider(
  $("#gal"),
  g.images,
  (x) => {
    const a = el("a", "slide", `${img(x.image, x.title)}<span class="cap">${esc(x.title)}</span>`);
    setLink(a, x.url);
    return a;
  },
  4500
);

const mk = (title, link) =>
  `<header class="ch"><h2>${title}</h2>${link ? A(link, "va", esc(link.title) + ic("arrow")) : ""}</header>`;

const AD = C.admissions;
const EQ = C.enquiry;
const FK = C.fake;

$("#secs").innerHTML =
  `<section class="card adm">
    <div>
      <h2 class="sh">${esc(AD.title)}</h2>
      <p>${esc(AD.text)}</p>
      <div class="adl">${AD.links.map((l) => A(l, "btn btn-blue", esc(l.title) + ic("arrow"))).join("")}</div>
      ${A(AD.more, "va", esc(AD.more.title) + ic("arrow"))}
    </div>
    <div class="adi">${img(AD.image, AD.title)}</div>
  </section>` +
  `<section class="stats">${C.stats
    .map(
      (x) =>
        `<div class="card sc"><h2>${esc(x.title)}</h2><dl>${x.items
          .map((i) => `<div><dt>${esc(i.label)}</dt><dd>${esc(i.value)}</dd></div>`)
          .join("")}</dl></div>`
    )
    .join("")}</section>` +
  `<section class="two">
    <div class="card">${mk(ic("cal") + " Upcoming Events", C.eventsAll)}
      <ul>${C.events
        .map(
          (e) =>
            `<li>${A(
              e,
              "ni",
              `<time class="dt"><b>${esc(e.day)}</b>${esc(e.month)}</time>
               <span class="nt">${esc(e.title)}<small>${esc(e.place)}</small></span>${ic("arrow")}`
            )}</li>`
        )
        .join("")}</ul>
    </div>
    <div class="card">${mk("In Focus", C.focusAll)}
      <div class="fgrid">${C.inFocus
        .map((f) => A(f, "fc", `<span class="fi">${img(f.image, f.title)}</span><span>${esc(f.title)}</span>`))
        .join("")}</div>
    </div>
  </section>` +
  `<section>
    <h2 class="sh">Explore the Campus</h2>
    <div class="xg">${C.explore
      .map((x) => A(x, "xt", `${img(x.image, x.title)}<b>${esc(x.title)}</b>`))
      .join("")}</div>
  </section>` +
  `<section class="card enq" id="enquiry">
    <h2 class="sh">${esc(EQ.title)}</h2>
    <form id="enqForm">
      <select name="programme" aria-label="Programme" required>
        <option value="">Select Programme</option>
        ${C.programmes.map((p) => `<option value="${esc(p)}">${esc(p)}</option>`).join("")}
      </select>
      <input name="name" placeholder="Full Name" required>
      <input name="email" type="email" placeholder="Email" required>
      <input name="phone" type="tel" placeholder="Mobile number" required>
      <button class="btn btn-blue" type="submit">${esc(EQ.button)}</button>
    </form>
    <p id="enqMsg" role="status"></p>
  </section>` +
  `<section class="card fake">
    <h2 class="sh">${esc(FK.title)}</h2>
    <p>${esc(FK.text)}</p>
    ${A(FK.link, "va", esc(FK.link.title) + ic("arrow"))}
  </section>`;

$("#enqForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const f = e.target;
  const m = $("#enqMsg");
  m.textContent = "Sending…";
  try {
    const r = await fetch(EQ.apiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(Object.fromEntries(new FormData(f))),
    });
    if (!r.ok) throw new Error(r.status);
    m.textContent = EQ.success;
    f.reset();
  } catch {
    m.textContent = EQ.error;
  }
});

const F = C.footer;
const cols = [
  ...F.columns,
  { title: "Campuses", links: C.campuses.map((c) => ({ title: c.name, url: c.url })) },
];

$("#ft").innerHTML = `
  <div class="wrap fg">
    <div>
      <div class="fb"><span class="lg" style="width:42px;height:42px;font-size:0.95rem">${esc(U.short)}</span><span>${esc(U.name)}</span></div>
      <p>${ic("pin")}<span>${esc(K.address)}</span></p>
      <p>${ic("phone")}<a href="tel:${esc(K.phone.replace(/\s/g, ""))}">${esc(K.phone)}</a></p>
      <p>${ic("mail")}<a href="mailto:${esc(K.email)}">${esc(K.email)}</a></p>
      <h3>Follow Us</h3>
      <div class="fsoc">${C.social.map((s) => `<a class="soc" ${href(s.url)} aria-label="${esc(s.name)}">${esc(s.short)}</a>`).join("")}</div>
    </div>
    ${cols.map((c) => `<div><h3>${esc(c.title)}</h3>${c.links.map((l) => A(l)).join("")}</div>`).join("")}
  </div>
  <div class="wrap fbot">
    <span>${esc(F.copyright.replace("{year}", new Date().getFullYear()))}</span>
    <span>${A(F.privacy)}${A(F.terms)}</span>
  </div>`;

const nav = $("#nav");
const burger = $("#burger");

burger.addEventListener("click", () => {
  const o = !nav.classList.contains("open");
  closeAnn();
  closeDD();
  nav.style.top = $("#hdr").getBoundingClientRect().bottom + "px";
  nav.classList.toggle("open", o);
  burger.setAttribute("aria-expanded", o);
  document.body.classList.toggle("lock", o);
});

document.addEventListener("click", (e) => {
  const nb = e.target.closest(".nb");
  if (nb) {
    const d = nb.parentElement;
    const o = !d.classList.contains("open");
    closeAnn();
    closeDD();
    d.classList.toggle("open", o);
    nb.setAttribute("aria-expanded", o);
    return;
  }
  if (!e.target.closest("#ann,[data-ann]")) closeAnn();
  if (!e.target.closest(".dd")) closeDD();
  if (e.target.closest(".menu a")) closeDD();
  if (e.target.closest("#nav a")) closeNav();
  if (e.target.closest("#ann a")) closeAnn();
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    closeAnn();
    closeDD();
    closeNav();
    $("#sform").hidden = true;
    if (window.toggleAI && !$("#aiPanel").hidden) window.toggleAI(false);
  }
});

addEventListener("resize", () => {
  closeAnn();
  if (innerWidth > 1360) closeNav();
});

const sf = $("#sform");
$("#sbtn").addEventListener("click", () => {
  sf.hidden = !sf.hidden;
  if (!sf.hidden) $("#sinput").focus();
});
sf.addEventListener("submit", (e) => {
  e.preventDefault();
  const q = $("#sinput").value.trim();
  if (q && C.search.url) location.href = C.search.url + encodeURIComponent(q);
});

const AI = C.ai;
if (!AI || !AI.enabled) {
  $("#aiBtn")?.remove();
  $("#aiPanel")?.remove();
} else {
  const panel = $("#aiPanel");
  const fab = $("#aiBtn");
  const box = $("#aiMsgs");
  const inp = $("#aiIn");
  const hist = [];

  $("#aiName").textContent = AI.name;

  const add = (t, who) => {
    const m = el("div", "m " + who);
    m.textContent = t;
    box.append(m);
    box.scrollTop = box.scrollHeight;
    return m;
  };

  const ask = async (q) => {
    add(q, "u");
    hist.push({ role: "user", content: q });
    const w = add("…", "b");
    let r = null;
    let err = "";
    try {
      if (AI.apiUrl) {
        const controller = new AbortController();
        const timer = setTimeout(() => controller.abort(), 40000);
        const res = await fetch(AI.apiUrl, {
          signal: controller.signal,
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: "Bearer " + getToken() },
          body: JSON.stringify({ message: q, history: hist.slice(-10) }),
        });
        if (res.status === 401) {
          clearSession();
          location.href = loginUrl(C.auth.pages.home + "#ai");
          return;
        }
        clearTimeout(timer);
        const d = await res.json().catch(() => ({}));
        if (res.ok) r = d.reply || d.message || d.text || d.answer;
        else err = d.error || `Server error (${res.status})`;
      }
    } catch (e) {
      console.warn("AI error:", e);
      err = e && e.name === "AbortError" ? "The AI is taking too long. Please try again." : "Cannot reach the server.";
    }
    r = r || err || AI.fallback;
    w.textContent = r;
    hist.push({ role: "assistant", content: r });
    box.scrollTop = box.scrollHeight;
  };

  add(AI.welcome, "b");
  $("#aiSug").innerHTML = AI.suggestions.map((t) => `<button type="button">${esc(t)}</button>`).join("");
  $("#aiSug").addEventListener("click", (e) => {
    const b = e.target.closest("button");
    if (b) ask(b.textContent);
  });
  $("#aiForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const q = inp.value.trim();
    if (q) {
      inp.value = "";
      ask(q);
    }
  });

  window.toggleAI = (o) => {
    panel.hidden = !o;
    fab.setAttribute("aria-expanded", o);
    if (o) inp.focus();
  };
  fab.addEventListener("click", () => {
    if (!getToken()) {
      location.href = loginUrl(C.auth.pages.home + "#ai");
      return;
    }
    toggleAI(panel.hidden);
  });
  if (getToken() && location.hash === "#ai") toggleAI(true);
  $("#aiX").addEventListener("click", () => toggleAI(false));
}
