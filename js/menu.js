document.addEventListener("DOMContentLoaded", () => {
  const hamburger = document.querySelector(".hamburger");
  const menu = document.querySelector(".menu");

  if (!hamburger || !menu) return;

  // Hamburger click
  hamburger.addEventListener("click", () => {
    menu.classList.toggle("active");
    hamburger.classList.toggle("active");

    // Toggle icoon ☰ ↔ ✖
    hamburger.textContent = hamburger.classList.contains("active") ? "✖" : "☰";
  });

  // Sluit menu bij klik op link
  document.querySelectorAll(".menu a").forEach(link => {
    link.addEventListener("click", () => {
      menu.classList.remove("active");
      hamburger.classList.remove("active");
      hamburger.textContent = "☰";
    });
  });

  // Dropdown toggle voor mobiel
  document.querySelectorAll(".dropbtn").forEach(btn => {
    btn.addEventListener("click", e => {
      if (window.innerWidth <= 768) {
        e.preventDefault();
        const dropdownContent = btn.nextElementSibling;
        dropdownContent.style.display =
          dropdownContent.style.display === "block" ? "none" : "block";
      }
    });
  });
});
