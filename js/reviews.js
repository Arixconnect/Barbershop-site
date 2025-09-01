// js/reviews.js
// Veilige fallback voor reviews zonder Google API key

document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("google-reviews");

  if (container) {
    // Handmatig ingestelde fallback reviews
    const fallbackReviews = [
      {
        author: "Lars Leyh",
        rating: 5,
        text: "Mooie zaak, goed behandeld en strak geknipt!"
      },
      {
        author: "Muhannad Khattab",
        rating: 5,
        text: "Top service en strakke kapsels!"
      }
    ];

    container.innerHTML = fallbackReviews
      .map(
        (r) => `
        <div class="review-card">
          <div class="stars">${"★".repeat(r.rating)}</div>
          <p class="review-text">"${r.text}"</p>
          <small>- ${r.author}</small>
        </div>
      `
      )
      .join("");
  }
});
