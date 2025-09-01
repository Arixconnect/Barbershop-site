document.addEventListener("DOMContentLoaded", async () => {
  const container = document.getElementById("google-reviews");

  // Fallback reviews (worden getoond als de API niet werkt of leeg is)
  const fallbackReviews = [
    {
      author: "Lars",
      rating: 5,
      text: "Top service en strakke kapsels!"
    },
    {
      author: "Ali",
      rating: 5,
      text: "Super tevreden, erg professioneel en vriendelijk."
    },
    {
      author: "Hassan",
      rating: 4,
      text: "Goed geknipt en fijne sfeer in de barbershop."
    }
  ];

  // Place ID van Master Barbershop Arnhem
  const placeId = "ChIJ61dQgK6j4AR4GeTYWZsKkWw";

  // API key -> wordt via Netlify/omgeving geladen, niet hardcoded
  const apiKey = window.GOOGLE_API_KEY || ""; 

  // Google Places API URL
  const url = `https://places.googleapis.com/v1/places/${placeId}?fields=rating,reviews&key=${apiKey}`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (data.reviews && data.reviews.length > 0) {
      renderReviews(data.reviews.slice(0, 3));
    } else {
      console.warn("Geen Google reviews gevonden, toon fallback.");
      renderReviews(fallbackReviews);
    }
  } catch (err) {
    console.error("Fout bij laden reviews:", err);
    renderReviews(fallbackReviews);
  }

  // Render functie voor de reviews
  function renderReviews(reviews) {
    container.innerHTML = reviews.map(r => `
      <div class="review-card">
        <div class="stars">
          ${"★".repeat(Math.round(r.rating))}
          ${"☆".repeat(5 - Math.round(r.rating))}
        </div>
        <p class="review-text">"${r.text || r.originalText?.text || "Geen tekst"}"</p>
        <small>- ${r.authorName || r.author}</small>
      </div>
    `).join("");
  }
});
