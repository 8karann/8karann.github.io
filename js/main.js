/* KARAN BHATHAL — portfolio interactions */
(function () {
  "use strict";

  /* ---------- Smooth scroll (Lenis) ---------- */
  let lenis = null;
  if (window.Lenis) {
    lenis = new Lenis({ lerp: 0.1, smoothWheel: true });
    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);
  }

  if (window.gsap && window.ScrollTrigger) {
    gsap.registerPlugin(ScrollTrigger);
    if (lenis) lenis.on("scroll", ScrollTrigger.update);
  }

  /* ---------- Custom cursor ---------- */
  const dot = document.querySelector(".cursor-dot");
  const ring = document.querySelector(".cursor-ring");
  if (dot && ring && matchMedia("(hover:hover)").matches) {
    let x = 0, y = 0, rx = 0, ry = 0;
    addEventListener("mousemove", (e) => {
      x = e.clientX; y = e.clientY;
      document.body.classList.add("cursor-active");
    });
    (function loop() {
      rx += (x - rx) * 0.16;
      ry += (y - ry) * 0.16;
      dot.style.transform = `translate(${x - 3}px, ${y - 3}px)`;
      ring.style.transform = `translate(${rx - ring.offsetWidth / 2}px, ${ry - ring.offsetHeight / 2}px)`;
      requestAnimationFrame(loop);
    })();
    document.querySelectorAll("a, button, .tools__list span").forEach((el) => {
      el.addEventListener("mouseenter", () => ring.classList.add("is-hover"));
      el.addEventListener("mouseleave", () => ring.classList.remove("is-hover"));
    });
    document.querySelectorAll(".work-item").forEach((el) => {
      el.addEventListener("mouseenter", () => { ring.classList.add("is-view"); ring.textContent = "VIEW"; });
      el.addEventListener("mouseleave", () => { ring.classList.remove("is-view"); ring.textContent = ""; });
    });
  }

  /* ---------- Preloader (index only) ---------- */
  const pre = document.querySelector(".preloader");
  const heroIntro = () => {
    if (!window.gsap) return;
    gsap.timeline()
      .to(".hero__title .line-inner", { y: 0, duration: 1.15, ease: "expo.out", stagger: 0.09 }, 0.1)
      .to(".hero [data-reveal]", { opacity: 1, y: 0, duration: 1, ease: "power3.out", stagger: 0.08 }, 0.55);
  };

  if (pre && window.gsap) {
    document.body.style.overflow = "hidden";
    const pct = pre.querySelector(".preloader__pct");
    const bar = pre.querySelector(".preloader__bar i");
    const name = pre.querySelector(".preloader__name span");
    const state = { v: 0 };

    gsap.timeline({
      onComplete() {
        gsap.timeline({
          onComplete() {
            pre.remove();
            document.body.style.overflow = "";
            heroIntro();
          },
        })
          .to(pre.querySelectorAll(".preloader__top, .preloader__center, .preloader__bottom"), {
            opacity: 0, y: -30, duration: 0.5, ease: "power2.in", stagger: 0.06,
          })
          .to(pre, { clipPath: "inset(0 0 100% 0)", duration: 0.9, ease: "expo.inOut" }, "-=0.2");
      },
    })
      .to(name, { y: 0, duration: 1, ease: "expo.out" }, 0.15)
      .to(state, {
        v: 100, duration: 2.1, ease: "power2.inOut",
        onUpdate() {
          const n = Math.round(state.v);
          if (pct) pct.textContent = n;
          if (bar) bar.style.transform = `scaleX(${n / 100})`;
        },
      }, 0.3);
  } else if (window.gsap && document.querySelector(".hero")) {
    heroIntro();
  }

  /* ---------- Case page hero intro ---------- */
  if (window.gsap && document.querySelector(".case-hero")) {
    gsap.timeline()
      .from(".case-hero h1", { y: 60, opacity: 0, duration: 1.1, ease: "expo.out" }, 0.15)
      .from(".case-hero .lede, .case-hero .backlink, .case-meta", {
        y: 34, opacity: 0, duration: 0.9, ease: "power3.out", stagger: 0.1,
      }, 0.4);
  }

  /* ---------- Scroll reveals ---------- */
  if (window.gsap && window.ScrollTrigger) {
    document.querySelectorAll("[data-reveal]:not(.hero [data-reveal])").forEach((el) => {
      gsap.to(el, {
        opacity: 1, y: 0, duration: 1.1, ease: "power3.out",
        delay: (parseFloat(el.dataset.delay) || 0),
        scrollTrigger: { trigger: el, start: "top 88%" },
      });
    });

    /* Split-line reveals outside hero */
    document.querySelectorAll("[data-reveal-line]:not(.hero__title)").forEach((el) => {
      gsap.to(el.querySelectorAll(".line-inner"), {
        y: 0, duration: 1.1, ease: "expo.out", stagger: 0.09,
        scrollTrigger: { trigger: el, start: "top 88%" },
      });
    });

    /* About photo parallax */
    const aphoto = document.querySelector(".about__photo img");
    if (aphoto) {
      gsap.fromTo(aphoto, { yPercent: -8 }, {
        yPercent: 0, ease: "none",
        scrollTrigger: { trigger: ".about__photo", start: "top bottom", end: "bottom top", scrub: true },
      });
    }

    /* Counters */
    document.querySelectorAll("[data-count]").forEach((el) => {
      const target = parseFloat(el.dataset.count);
      const decimals = (el.dataset.count.split(".")[1] || "").length;
      const obj = { v: 0 };
      gsap.to(obj, {
        v: target, duration: 1.8, ease: "power2.out",
        scrollTrigger: { trigger: el, start: "top 90%" },
        onUpdate() { el.textContent = obj.v.toFixed(decimals); },
      });
    });
  }

  /* ---------- Bar charts ---------- */
  const barObserver = new IntersectionObserver((entries) => {
    entries.forEach((en) => {
      if (en.isIntersecting) { en.target.classList.add("is-inview"); barObserver.unobserve(en.target); }
    });
  }, { threshold: 0.4 });
  document.querySelectorAll(".bar-row").forEach((el) => barObserver.observe(el));

  /* ---------- Nav hide on scroll ---------- */
  const nav = document.querySelector(".nav");
  let lastY = 0;
  addEventListener("scroll", () => {
    const y = scrollY;
    if (nav && !document.body.classList.contains("menu-open")) {
      nav.classList.toggle("is-hidden", y > lastY && y > 300);
    }
    lastY = y;
  }, { passive: true });

  /* ---------- Mobile menu ---------- */
  const burger = document.querySelector(".nav__burger");
  const menu = document.querySelector(".menu");
  if (burger && menu) {
    burger.addEventListener("click", () => {
      const open = menu.classList.toggle("is-open");
      document.body.classList.toggle("menu-open", open);
    });
    menu.querySelectorAll("a").forEach((a) =>
      a.addEventListener("click", () => {
        menu.classList.remove("is-open");
        document.body.classList.remove("menu-open");
      })
    );
  }

  /* ---------- Anchor links via Lenis ---------- */
  document.querySelectorAll('a[href^="#"]').forEach((a) => {
    a.addEventListener("click", (e) => {
      const target = document.querySelector(a.getAttribute("href"));
      if (target && lenis) { e.preventDefault(); lenis.scrollTo(target, { offset: -60 }); }
    });
  });

  /* ---------- Rotating roles ---------- */
  const roles = document.querySelector(".hero__roles");
  if (roles && window.gsap) {
    const items = roles.querySelectorAll("span");
    let i = 0;
    setInterval(() => {
      i = (i + 1) % items.length;
      gsap.to(items, { y: -20 * i, duration: 0.7, ease: "expo.inOut" });
    }, 2400);
  }

  /* ---------- Dubai clock ---------- */
  const clock = document.querySelector("[data-clock]");
  if (clock) {
    const tick = () => {
      clock.textContent = new Intl.DateTimeFormat("en-GB", {
        hour: "2-digit", minute: "2-digit", second: "2-digit",
        timeZone: "Asia/Dubai", hour12: false,
      }).format(new Date()) + " GST";
    };
    tick();
    setInterval(tick, 1000);
  }
})();
