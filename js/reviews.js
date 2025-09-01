<script>
  async function loadReviews() {
    const apiKey = "AIzaSyC5evVf7PTXC-tjhICxAVbUD3U2DjpTmgE"; // vervang dit met jouw beveiligde key
    const placeId = "ChIJ61dQgK6j4AR4GeTYWZsKkWw"; // Master Barbershop Arnhem
    const url = `https://places.googleapis.com/v1/places/${placeId}?fields=id,displayName,rating,reviews&key=${apiKey}`;

    try {
      const response = await fetch(url);
      const data = await response.json();
      console.log("Google Places API response:", data);

      if (data.reviews && data.reviews.length > 0) {
        const container = document.getElementById("google-reviews");
        container.innerHTML = data.reviews.slice(0, 3).map(r => `
          <div class="review-card">
            <div class="stars">${"★".repeat(Math.round(r.rating))}</div>
            <p class="review-text">"${r.text}"</p>
            <small>- ${r.authorAttribution.displayName}</small>
          </div>
        `).join("");
      } else {
        document.getElementById("google-reviews").innerHTML = "<p>Geen reviews gevonden.</p>";
      }
    } catch (err) {
      console.error("Error loading reviews:", err);
      document.getElementById("google-reviews").innerHTML = "<p>Reviews konden niet geladen worden.</p>";
    }
  }

  loadReviews();
</script>
