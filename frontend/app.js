const API_URL = "http://localhost:3000/articles";

// Get containers
const articlesContainer = document.getElementById("articles");
const featuredContainer = document.getElementById("featured");
const searchInput = document.getElementById("search");

// Fetch articles
fetch(API_URL)
  .then(res => res.json())
  .then(data => {
    renderArticles(data);
    renderFeatured(data);
  })
  .catch(err => console.error("Error:", err));

// Render all articles
function renderArticles(data) {
  articlesContainer.innerHTML = "";

  data.forEach(article => {
    articlesContainer.innerHTML += `
      <div>
        <h3>${article.title}</h3>
        <p>${article.summary}</p>
        <a href="article.html?slug=${article.slug}">
          Read Article →
        </a>
      </div>
    `;
  });
}

// Render featured article (latest one)
function renderFeatured(data) {
  if (!featuredContainer) return;

  const latest = data[data.length - 1];

  featuredContainer.innerHTML = `
    <div class="featured-card">
      <h2>⭐ Featured</h2>
      <h3>${latest.title}</h3>
      <p>${latest.summary}</p>
      <a href="article.html?slug=${latest.slug}">
        Read Now →
      </a>
    </div>
  `;
}

// Search functionality
if (searchInput) {
  searchInput.addEventListener("input", (e) => {
    const query = e.target.value.toLowerCase();

    fetch(API_URL)
      .then(res => res.json())
      .then(data => {
        const filtered = data.filter(article =>
          article.title.toLowerCase().includes(query) ||
          article.summary.toLowerCase().includes(query)
        );

        renderArticles(filtered);
      });
  });
}