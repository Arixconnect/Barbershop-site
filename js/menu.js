document.addEventListener("DOMContentLoaded", () => {
  const hamburger = document.querySelector(".hamburger");
  const menu = document.querySelector(".menu");

  if (!hamburger || !menu) return;

  const scrollToTarget = targetId => {
    const target = document.getElementById(targetId);
    if (!target) return;

    const header = document.querySelector("header");
    const headerHeight = header ? header.offsetHeight : 0;
    const targetTop = target.getBoundingClientRect().top + window.pageYOffset - headerHeight - 12;

    window.scrollTo({ top: targetTop, behavior: "smooth" });
    history.pushState(null, "", `#${targetId}`);
  };

  const closeMenu = () => {
    menu.classList.remove("active");
    hamburger.classList.remove("active");
    hamburger.textContent = "☰";
  };

  // Hamburger klik → menu openen/sluiten
  hamburger.addEventListener("click", () => {
    menu.classList.toggle("active");
    hamburger.classList.toggle("active");

    // Wissel icoon ☰ ↔ ✖
    hamburger.textContent = hamburger.classList.contains("active") ? "✖" : "☰";
  });

  // Klik op een link → netjes scrollen en menu sluiten
  document.querySelectorAll('.menu a[href^="#"]').forEach(link => {
    link.addEventListener("click", e => {
      const targetId = link.getAttribute("href").slice(1);
      e.preventDefault();
      scrollToTarget(targetId);
      closeMenu();
    });
  });

  // Dropdown toggle (alleen mobiel) + Diensten als eigen anker laten werken
  document.querySelectorAll(".dropbtn").forEach(btn => {
    btn.addEventListener("click", e => {
      e.preventDefault();
      scrollToTarget("diensten");

      if (window.innerWidth <= 768) {
        const dropdown = btn.nextElementSibling;
        dropdown.style.display =
          dropdown.style.display === "block" ? "none" : "block";
      }
    });
  });
});
