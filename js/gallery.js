document.addEventListener("DOMContentLoaded", () => {
  const carousel = document.querySelector(".carousel");
  const viewport = document.getElementById("gallery-carousel");
  if (!carousel || !viewport) return;

  const slides = [...viewport.querySelectorAll(".carousel__slide")];
  const dots = [...carousel.querySelectorAll(".carousel__navigation-button")];
  const previousButton = carousel.querySelector(".carousel__prev");
  const nextButton = carousel.querySelector(".carousel__next");
  const status = document.getElementById("gallery-status");
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  let activeIndex = 0;
  let autoplayTimer;
  let scrollFrame;
  let paused = false;

  const updateUI = index => {
    activeIndex = (index + slides.length) % slides.length;
    dots.forEach((dot, dotIndex) => {
      const active = dotIndex === activeIndex;
      dot.classList.toggle("is-active", active);
      if (active) dot.setAttribute("aria-current", "true");
      else dot.removeAttribute("aria-current");
    });
    if (status) status.textContent = `Foto ${activeIndex + 1} van ${slides.length}`;
  };

  const goToSlide = (index, smooth = true) => {
    const targetIndex = (index + slides.length) % slides.length;
    viewport.scrollTo({ left: targetIndex * viewport.clientWidth, behavior: smooth && !reducedMotion.matches ? "smooth" : "auto" });
    updateUI(targetIndex);
  };

  const stopAutoplay = () => window.clearInterval(autoplayTimer);
  const startAutoplay = () => {
    stopAutoplay();
    if (reducedMotion.matches || paused || slides.length < 2) return;
    autoplayTimer = window.setInterval(() => goToSlide(activeIndex + 1), 4500);
  };

  previousButton.addEventListener("click", () => { goToSlide(activeIndex - 1); startAutoplay(); });
  nextButton.addEventListener("click", () => { goToSlide(activeIndex + 1); startAutoplay(); });
  dots.forEach((dot, index) => dot.addEventListener("click", () => { goToSlide(index); startAutoplay(); }));

  viewport.addEventListener("scroll", () => {
    window.cancelAnimationFrame(scrollFrame);
    scrollFrame = window.requestAnimationFrame(() => {
      const index = Math.round(viewport.scrollLeft / Math.max(viewport.clientWidth, 1));
      if (index !== activeIndex) updateUI(index);
    });
  }, { passive: true });

  carousel.addEventListener("pointerenter", () => { paused = true; stopAutoplay(); });
  carousel.addEventListener("pointerleave", () => { paused = false; startAutoplay(); });
  carousel.addEventListener("focusin", () => { paused = true; stopAutoplay(); });
  carousel.addEventListener("focusout", event => {
    if (!carousel.contains(event.relatedTarget)) { paused = false; startAutoplay(); }
  });
  reducedMotion.addEventListener("change", startAutoplay);
  document.addEventListener("visibilitychange", () => document.hidden ? stopAutoplay() : startAutoplay());

  updateUI(0);
  startAutoplay();
});
