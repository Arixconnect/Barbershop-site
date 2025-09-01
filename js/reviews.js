/* === Reviews sectie === */
.reviews-section {
  padding: 60px 20px;
  background: url('../img/marble-bg.jpg') center/cover no-repeat fixed;
  color: #fff;
  text-align: center;
}

.reviews-section .section-title {
  font-size: 2.2rem;
  font-weight: bold;
  margin-bottom: 30px;
  text-shadow: 0 2px 5px rgba(0,0,0,0.4);
}

.reviews-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 20px;
  margin-top: 20px;
}

.review-card {
  background: rgba(0, 0, 0, 0.6);
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 4px 8px rgba(0,0,0,0.3);
  transition: transform 0.2s;
}

.review-card:hover {
  transform: translateY(-5px);
}

.stars {
  color: #FFD700;
  font-size: 1.2rem;
  margin-bottom: 10px;
}

.review-text {
  font-style: italic;
  margin-bottom: 10px;
}

.review-card small {
  display: block;
  color: #bbb;
}

.gallery-grid img:hover {
  transform: scale(1.03);
  box-shadow: 0 6px 16px rgba(0,0,0,0.7);
}

document.addEventListener("DOMContentLoaded", () => {
  const reviews = [
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

  const container = document.getElementById("google-reviews");

  container.innerHTML = reviews.map(r => `
    <div class="review-card">
      <div class="stars">${"★".repeat(r.rating)}${"☆".repeat(5 - r.rating)}</div>
      <p class="review-text">"${r.text}"</p>
      <small>- ${r.author}</small>
    </div>
  `).join("");
});
