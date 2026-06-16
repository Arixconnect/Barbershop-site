document.addEventListener("DOMContentLoaded", async () => {
  const container = document.getElementById("google-reviews");
  if (!container) return;

  const placeId = "ChIJ61dQgK6j4AR4GeTYWZsKkWw";
  const googleReviewsUrl = `https://search.google.com/local/reviews?placeid=${placeId}`;
  const apiKey = window.GOOGLE_API_KEY || "";

  const escapeHTML = value => String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");

  const stars = rating => {
    const rounded = Math.max(0, Math.min(5, Math.round(Number(rating) || 0)));
    return "★".repeat(rounded) + "☆".repeat(5 - rounded);
  };

  const renderReviewSummary = ({ rating = 5, totalReviews = "190+" } = {}) => {
    container.innerHTML = `
      <div class="review-card">
        <div class="stars">${stars(rating)}</div>
        <p class="review-text">Meer dan ${escapeHTML(totalReviews)} klanten beoordelen Master Barbershop via Google.</p>
        <small>Google reviews</small>
        <a class="review-button" href="${googleReviewsUrl}" target="_blank" rel="noopener">Bekijk alle reviews</a>
      </div>
    `;
  };

  const getReviewText = review => review.text?.text || review.originalText?.text || review.text || "";
  const getReviewAuthor = review => review.authorAttribution?.displayName || review.authorName || "Google review";

  const renderGoogleReviews = place => {
    const reviews = Array.isArray(place.reviews) ? place.reviews.slice(0, 3) : [];
    const totalReviews = place.userRatingCount || "190+";
    const rating = place.rating || 5;

    const summaryCard = `
      <div class="review-card">
        <div class="stars">${stars(rating)}</div>
        <p class="review-text">${escapeHTML(rating)} uit 5 op basis van ${escapeHTML(totalReviews)} Google reviews.</p>
        <small>Master Barbershop Arnhem</small>
        <a class="review-button" href="${place.googleMapsUri || googleReviewsUrl}" target="_blank" rel="noopener">Bekijk alle reviews</a>
      </div>
    `;

    const reviewCards = reviews.map(review => `
      <div class="review-card">
        <div class="stars">${stars(review.rating)}</div>
        <p class="review-text">"${escapeHTML(getReviewText(review))}"</p>
        <small>- ${escapeHTML(getReviewAuthor(review))}</small>
      </div>
    `).join("");

    container.innerHTML = summaryCard + reviewCards;
  };

  if (!apiKey) {
    renderReviewSummary();
    return;
  }

  try {
    const fields = "rating,userRatingCount,reviews,googleMapsUri";
    const url = `https://places.googleapis.com/v1/places/${placeId}?fields=${fields}&key=${apiKey}`;
    const response = await fetch(url);

    if (!response.ok) throw new Error(`Google Places response ${response.status}`);

    const data = await response.json();
    renderGoogleReviews(data);
  } catch (err) {
    console.error("Fout bij laden Google reviews:", err);
    renderReviewSummary();
  }
});
