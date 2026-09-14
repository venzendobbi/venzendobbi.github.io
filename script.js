// ============================================================
// Srishti & Manas — website configuration
// ============================================================

// 1. Create your Google Form.
// 2. Click "Send" -> Link -> copy the form URL.
// 3. Paste it between the quotes below.
// Example:
// const GOOGLE_FORM_URL = "https://docs.google.com/forms/d/e/XXXXXXXX/viewform";
const GOOGLE_FORM_URL = "https://forms.gle/pXWGGPSC7BGVWjNo9";

const weddingDate = new Date("2026-11-21T20:00:00+05:30");

window.addEventListener("load", () => {
  setTimeout(() => document.getElementById("preloader").classList.add("hide"), 1500);
});

// Countdown
function updateCountdown() {
  const diff = weddingDate - new Date();
  const values = {days:0, hours:0, minutes:0, seconds:0};
  if (diff > 0) {
    const total = Math.floor(diff / 1000);
    values.days = Math.floor(total / 86400);
    values.hours = Math.floor((total % 86400) / 3600);
    values.minutes = Math.floor((total % 3600) / 60);
    values.seconds = total % 60;
  }
  Object.entries(values).forEach(([id, value]) => {
    const el = document.getElementById(id);
    const next = String(value).padStart(2, "0");
    if (el.textContent === next) return;
    el.textContent = next;
    // Seconds are left alone — a pulse every tick reads as flicker, not life.
    if (id !== "seconds") {
      el.classList.remove("tick");
      void el.offsetWidth;
      el.classList.add("tick");
    }
  });
}
updateCountdown();
setInterval(updateCountdown, 1000);

// Reveal sections as they scroll into view. The `js` class gates the hidden
// starting state so the page still renders fully if this script never runs.
document.documentElement.classList.add("js");

const revealTargets = [
  ...document.querySelectorAll(".events-head, .event-card, .countdown-inner, .details, .map-section, .rsvp-copy"),
];
revealTargets.forEach((el) => el.classList.add("reveal"));

document.querySelectorAll(".event-card").forEach((card, i) => {
  card.style.setProperty("--rd", `${i * 0.12}s`);
});

const revealer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add("in");
    revealer.unobserve(entry.target);
  });
}, { threshold: 0.12, rootMargin: "0px 0px -60px 0px" });
revealTargets.forEach((el) => revealer.observe(el));

// Wing colours: [upper wing, lower wing, body/outline].
const WINGS = {
  rose:       ["#e3a6b3", "#cb8493", "#8d4c5b"],
  amber:      ["#ecc478", "#dca64a", "#9a6c1f"],
  terracotta: ["#e09674", "#c67351", "#8c4527"],
  plum:       ["#c08fa4", "#a36d86", "#6b3e52"],
  mehendi:    ["#a8b891", "#8da370", "#546a3c"],
  gold:       ["#f3ddab", "#e6c684", "#a8843f"],
  blush:      ["#f2ccd2", "#e3aab4", "#a76b75"],
  cream:      ["#f6ece0", "#e8d5c2", "#b08f72"],
};

// Each section gets a flock. `zones` are the bands of the section that stay clear
// of text — butterflies are only ever placed inside one, so they never sit on copy.
// `light: true` marks a dark section, which only takes the pale wing colours.
const FLOCK = [
  {host:".cover",       count:14, zones:[[1,20,5,94],[80,99,5,94]]},
  {host:".events",      count:10, zones:[[1,12,4,96],[88,99,4,96]]},
  {host:".countdown",   count:9,  light:true, zones:[[3,20,10,90],[80,97,10,90],[24,76,74,92]]},
  {host:".details",     count:8,  zones:[[1,12,6,94],[88,99,6,94]]},
  {host:".map-section", count:6,  zones:[[0,10,6,94],[90,100,4,40]]},
  {host:".rsvp-art",    count:10, zones:[[6,40,6,94],[62,94,6,94]]},
  {host:"footer",       count:7,  light:true, zones:[[2,24,12,88],[76,98,12,88]]},
];

const LIGHT_WINGS = ["gold", "blush", "cream"];
const DARK_WINGS = ["rose", "amber", "terracotta", "plum", "mehendi"];

// Seeded so the layout is identical on every load — a reshuffle on each refresh
// reads as the page glitching rather than as butterflies moving.
let seed = 20261121;
const rnd = () => ((seed = (seed * 1103515245 + 12345) & 0x7fffffff) / 0x7fffffff);
const between = (lo, hi) => lo + rnd() * (hi - lo);
const pick = (arr) => arr[Math.floor(rnd() * arr.length)];

const BUTTERFLY_SVG = `<svg viewBox="0 0 240 210" fill="none" aria-hidden="true">
  <g class="wing-left">
    <path class="wing-fill" d="M118 86C92 22 22 12 14 68c-6 42 38 58 102 34Z"/>
    <path class="wing-fill lower" d="M116 96C74 102 32 128 46 168c8 22 40 10 62-28 10-18 14-34 16-42Z"/>
    <circle class="wing-spot" cx="54" cy="56" r="9"/>
  </g>
  <g class="wing-right">
    <path class="wing-fill" d="M122 86C148 22 218 12 226 68c6 42-38 58-102 34Z"/>
    <path class="wing-fill lower" d="M124 96C166 102 208 128 194 168c-8 22-40 10-62-28-10-18-14-34-16-42Z"/>
    <circle class="wing-spot" cx="186" cy="56" r="9"/>
  </g>
  <ellipse class="butterfly-body" cx="120" cy="104" rx="4.5" ry="38"/>
  <circle class="butterfly-body" cx="120" cy="60" r="7"/>
  <path class="antenna" d="M116 54Q98 26 80 18"/>
  <path class="antenna" d="M124 54Q142 26 160 18"/>
  <circle class="antenna-tip" cx="80" cy="18" r="4"/>
  <circle class="antenna-tip" cx="160" cy="18" r="4"/>
</svg>`;

const flockHosts = [];
let flitIndex = 0;

FLOCK.forEach((group) => {
  const host = document.querySelector(group.host);
  if (!host) return;
  flockHosts.push(host);

  for (let n = 0; n < group.count; n++) {
    const [x1, x2, y1, y2] = pick(group.zones);
    const [w1, w2, wd] = WINGS[pick(group.light ? LIGHT_WINGS : DARK_WINGS)];
    const size = Math.round(between(20, 46));
    // Keep the drift short enough that it never carries one out of its zone.
    const dx = (rnd() < 0.5 ? -1 : 1) * between(5, 14);
    const dy = (rnd() < 0.5 ? -1 : 1) * between(5, 16);

    const wrap = document.createElement("div");
    // Two thirds are desktop-only; the full flock is too busy on a phone.
    wrap.className = "flit" + (n % 3 ? " wide-only" : "");
    wrap.style.cssText =
      `left:${between(x1, x2).toFixed(2)}%;top:${between(y1, y2).toFixed(2)}%;` +
      `--par:${between(-70, 70).toFixed(0)}px`;

    const drift = document.createElement("div");
    drift.className = "flit-drift";
    drift.style.cssText =
      `--s:${size}px;--dx:${dx.toFixed(1)}vw;--dy:${dy.toFixed(1)}vh;` +
      `--dur:${between(28, 62).toFixed(0)}s;--delay:${(-between(0, 60)).toFixed(0)}s;` +
      `--o:${between(0.34, 0.66).toFixed(2)};--tilt:${between(-32, 32).toFixed(0)}deg;` +
      `--flap:${between(2.6, 5.2).toFixed(2)}s;--w1:${w1};--w2:${w2};--wd:${wd}`;
    drift.innerHTML = BUTTERFLY_SVG;

    wrap.appendChild(drift);
    host.appendChild(wrap);
    flitIndex++;
  }
});

// Scroll parallax. Computed once per section per frame (not per butterfly), and
// applied through an inherited custom property, so 60 of them stay cheap.
if (matchMedia("(prefers-reduced-motion: no-preference)").matches) {
  let queued = false;
  const applyParallax = () => {
    const vh = window.innerHeight;
    flockHosts.forEach((host) => {
      const r = host.getBoundingClientRect();
      const centre = r.top + r.height / 2;
      const p = Math.max(-1, Math.min(1, (vh / 2 - centre) / vh));
      host.style.setProperty("--scroll-p", p.toFixed(3));
    });
    queued = false;
  };
  addEventListener("scroll", () => {
    if (queued) return;
    queued = true;
    requestAnimationFrame(applyParallax);
  }, { passive: true });
  addEventListener("resize", applyParallax, { passive: true });
  applyParallax();
}


// Google Forms RSVP
const rsvpButton = document.getElementById("rsvpButton");
const rsvpHelp = document.getElementById("rsvpHelp");

if (GOOGLE_FORM_URL.trim()) {
  rsvpButton.href = GOOGLE_FORM_URL;
  rsvpHelp.style.display = "none";
} else {
  rsvpButton.classList.add("disabled");
  rsvpButton.addEventListener("click", (e) => {
    e.preventDefault();
    alert("Add your Google Form URL in script.js first.");
  });
}
