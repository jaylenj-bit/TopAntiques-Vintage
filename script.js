// Helpers
const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

// Year
$("#year").textContent = new Date().getFullYear();

// Mobile nav
const navToggle = $("#navToggle");
const navMenu = $("#navMenu");

navToggle?.addEventListener("click", () => {
  const isOpen = navMenu.classList.toggle("is-open");
  navToggle.setAttribute("aria-expanded", String(isOpen));
});

// Close menu on link click (mobile)
$$(".nav__link", navMenu).forEach((a) => {
  a.addEventListener("click", () => {
    navMenu.classList.remove("is-open");
    navToggle.setAttribute("aria-expanded", "false");
  });
});

// Scroll progress bar + toTop visibility
const fill = $("#scrollFill");
const toTop = $("#toTop");

function onScroll() {
  const doc = document.documentElement;
  const scrollTop = doc.scrollTop;
  const height = doc.scrollHeight - doc.clientHeight;
  const pct = height > 0 ? (scrollTop / height) * 100 : 0;
  fill.style.width = pct.toFixed(2) + "%";

  if (scrollTop > 700) toTop.classList.add("is-show");
  else toTop.classList.remove("is-show");
}
window.addEventListener("scroll", onScroll, { passive: true });
onScroll();

toTop?.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));

// Reveal on scroll
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        e.target.classList.add("is-in");
        observer.unobserve(e.target);
      }
    });
  },
  { threshold: 0.12 }
);
$$(".reveal").forEach((el) => observer.observe(el));

// Subtle parallax ornaments
const ornaments = $$("[data-parallax]");
let lastY = 0;

function parallax() {
  const y = window.scrollY || 0;
  if (Math.abs(y - lastY) < 2) return;
  lastY = y;

  ornaments.forEach((el) => {
    const amt = parseFloat(el.getAttribute("data-parallax") || "0.15");
    el.style.transform = `translate3d(0, ${y * amt * -0.08}px, 0)`;
  });
}
window.addEventListener("scroll", parallax, { passive: true });
parallax();

// Gallery lightbox
const lightbox = $("#lightbox");
const lbClose = $("#lbClose");
const lbImg = $("#lbImg");
const lbCap = $("#lbCap");

const mapCaption = {
  one: "Gold-framed mirrors & classic decor",
  two: "Lighting that sets the room’s mood",
  three: "Vintage items with stories you can feel",
  four: "Books, prints & paper ephemera",
  five: "Limited edition shoes",
  six: "Art & statement pieces"
};

const bgForShot = (btn) => {
  // Pull the background-image from the ::before is hard, so we mirror sources here:
  const idx = $$(".shot").indexOf(btn);
 const sources = [
  "monalisa.png", // Paintings
  "chandelier_light_bulbs_light.jpg", // Chandelier
  "vintage.jpg", // Vintage
  "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=2200&q=80", // Books
  "vintshoes.jpg", // Shoes
  "art.jpg"  // Art
];

  return sources[idx] || sources[0];
};

$$(".shot").forEach((btn) => {
  btn.addEventListener("click", () => {
    const key = btn.getAttribute("data-full") || "one";
    const url = bgForShot(btn);
    lbImg.style.backgroundImage = `url("${url}")`;
    lbCap.textContent = mapCaption[key] || "Gallery image";
    lightbox.classList.add("is-open");
    lightbox.setAttribute("aria-hidden", "false");
  });
});

function closeLB() {
  lightbox.classList.remove("is-open");
  lightbox.setAttribute("aria-hidden", "true");
}
lbClose?.addEventListener("click", closeLB);
lightbox?.addEventListener("click", (e) => {
  if (e.target === lightbox) closeLB();
});
window.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && lightbox.classList.contains("is-open")) closeLB();
});

// Testimonial slider
const track = $("#sliderTrack");
const dotsWrap = $("#dots");
const slides = track ? Array.from(track.children) : [];
let current = 0;

function buildDots() {
  if (!dotsWrap) return;
  dotsWrap.innerHTML = "";
  slides.forEach((_, i) => {
    const d = document.createElement("div");
    d.className = "dot" + (i === 0 ? " is-active" : "");
    d.addEventListener("click", () => goTo(i));
    dotsWrap.appendChild(d);
  });
}
function setDots(i) {
  $$(".dot", dotsWrap).forEach((d, idx) => d.classList.toggle("is-active", idx === i));
}
function goTo(i) {
  if (!track) return;
  current = (i + slides.length) % slides.length;
  track.style.transform = `translateX(-${current * 100}%)`;
  setDots(current);
}
$("#prev")?.addEventListener("click", () => goTo(current - 1));
$("#next")?.addEventListener("click", () => goTo(current + 1));
buildDots();

// Auto-advance (soft)
setInterval(() => {
  // Only auto-advance if user is near the slider section on page
  const slider = $("#slider");
  if (!slider) return;
  const r = slider.getBoundingClientRect();
  const inView = r.top < window.innerHeight * 0.8 && r.bottom > window.innerHeight * 0.2;
  if (inView) goTo(current + 1);
}, 6500);
