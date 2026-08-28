(() => {
  "use strict";

  const CAMPAIGN_END = new Date("2026-08-29T05:30:00+02:00").getTime();
  const DISMISSED_KEY = "masterbarbershop_anniversary_2026_dismissed";
  const modal = document.getElementById("anniversary-modal");
  if (!modal || Date.now() >= CAMPAIGN_END || localStorage.getItem(DISMISSED_KEY)) return;

  const canvas = modal.querySelector(".fireworks-canvas");
  const context = canvas.getContext("2d");
  const closeButton = modal.querySelector(".anniversary-close");
  const particles = [];
  let animationFrame;
  let burstTimer;

  const resize = () => {
    const ratio = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = window.innerWidth * ratio;
    canvas.height = window.innerHeight * ratio;
    canvas.style.width = `${window.innerWidth}px`;
    canvas.style.height = `${window.innerHeight}px`;
    context.setTransform(ratio, 0, 0, ratio, 0, 0);
  };

  const burst = () => {
    const colors = ["#f4df9b", "#d6b35a", "#ffffff", "#bfc3c7"];
    const x = window.innerWidth * (0.18 + Math.random() * 0.64);
    const y = window.innerHeight * (0.12 + Math.random() * 0.42);
    for (let i = 0; i < 42; i += 1) {
      const angle = (Math.PI * 2 * i) / 42;
      const speed = 1.4 + Math.random() * 3.3;
      particles.push({ x, y, vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed, life: 1, color: colors[i % colors.length] });
    }
  };

  const animate = () => {
    context.clearRect(0, 0, window.innerWidth, window.innerHeight);
    for (let i = particles.length - 1; i >= 0; i -= 1) {
      const particle = particles[i];
      particle.x += particle.vx;
      particle.y += particle.vy;
      particle.vy += 0.025;
      particle.vx *= 0.992;
      particle.life -= 0.014;
      if (particle.life <= 0) { particles.splice(i, 1); continue; }
      context.globalAlpha = particle.life;
      context.fillStyle = particle.color;
      context.beginPath();
      context.arc(particle.x, particle.y, 2, 0, Math.PI * 2);
      context.fill();
    }
    context.globalAlpha = 1;
    animationFrame = requestAnimationFrame(animate);
  };

  const stopFireworks = () => {
    cancelAnimationFrame(animationFrame);
    clearInterval(burstTimer);
    window.removeEventListener("resize", resize);
  };

  const close = () => {
    localStorage.setItem(DISMISSED_KEY, "true");
    modal.classList.remove("is-visible");
    stopFireworks();
    window.setTimeout(() => { modal.hidden = true; }, 300);
  };

  const show = () => {
    if (!modal.hidden || Date.now() >= CAMPAIGN_END || localStorage.getItem(DISMISSED_KEY)) return;
    modal.hidden = false;
    window.setTimeout(() => modal.classList.add("is-visible"), 20);
    closeButton.focus();
    if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      resize();
      window.addEventListener("resize", resize);
      burst();
      burstTimer = window.setInterval(burst, 850);
      animate();
    }
  };

  closeButton.addEventListener("click", close);
  modal.addEventListener("click", event => { if (event.target === modal) close(); });
  document.addEventListener("keydown", event => { if (event.key === "Escape" && !modal.hidden) close(); });
  window.addEventListener("masterbarbershop:consent-decided", () => window.setTimeout(show, 700), { once: true });

  if (localStorage.getItem("masterbarbershop_cookie_consent")) window.setTimeout(show, 900);
})();
