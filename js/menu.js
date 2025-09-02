document.addEventListener("DOMContentLoaded", () => {
  const hamburger = document.querySelector(".hamburger");
  const menu = document.querySelector(".menu");

  if (!hamburger || !menu) return;

  // Hamburger klik → menu openen/sluiten
  hamburger.addEventListener("click", () => {
    menu.classList.toggle("active");
    hamburger.classList.toggle("active");

    // Wissel icoon ☰ ↔ ✖
    hamburger.textContent = hamburger.classList.contains("active") ? "✖" : "☰";
  });

  // Klik op een link → menu sluiten
  document.querySelectorAll(".menu a").forEach(link => {
    link.addEventListener("click", () => {
      menu.classList.remove("active");
      hamburger.classList.remove("active");
      hamburger.textContent = "☰";
    });
  });

  // Dropdown toggle (alleen mobiel)
  document.querySelectorAll(".dropbtn").forEach(btn => {
    btn.addEventListener("click", e => {
      if (window.innerWidth <= 768) {
        e.preventDefault();
        const dropdown = btn.nextElementSibling;
        dropdown.style.display =
          dropdown.style.display === "block" ? "none" : "block";
      }
    });
  });
});

