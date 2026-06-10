const articlesContainer = document.getElementById("articles");
const featuredContainer = document.getElementById("featured");
const searchInput = document.getElementById("search");

let allArticles = [];

function init() {
  const tryLoad = () => {
    if (!window.articles) {
      setTimeout(tryLoad, 50);
      return;
    }

    allArticles = window.articles;

    renderFeatured(allArticles);
    renderArticles(allArticles);
    setupSearch();
    loadArticlePage();
  };

  tryLoad();
}

window.addEventListener("DOMContentLoaded", init);

/* ---------------- ARTICLES LIST ---------------- */

function renderArticles(data) {
  if (!articlesContainer) return;

  articlesContainer.innerHTML = "";

  if (!data.length) {
    articlesContainer.innerHTML = "<p>No articles found.</p>";
    return;
  }

  data.forEach(article => {
    articlesContainer.innerHTML += `
      <div class="article-card">
        <img class="article-thumb" src="${article.image}" alt="${article.title}">
        <h3>${article.title}</h3>
        <p>${article.summary}</p>
        <a href="article.html?slug=${article.slug}">Read Article →</a>
      </div>
    `;
  });
}

/* ---------------- FEATURED ---------------- */

function renderFeatured(data) {
  if (!featuredContainer || !data.length) return;

  const latest = data[data.length - 1];

  featuredContainer.innerHTML = `
    <div class="featured-card">
      <h3>${latest.title}</h3>
      <p>${latest.summary}</p>
      <a href="article.html?slug=${latest.slug}">Read Article →</a>
    </div>
  `;
}

/* ---------------- SEARCH ---------------- */

function setupSearch() {
  if (!searchInput) return;

  searchInput.addEventListener("input", e => {
    const query = e.target.value.toLowerCase();

    const filtered = allArticles.filter(a =>
      a.title.toLowerCase().includes(query) ||
      a.summary.toLowerCase().includes(query)
    );

    renderArticles(filtered);
  });
}

/* ---------------- ARTICLE PAGE ---------------- */

function loadArticlePage() {
  const articleBox = document.getElementById("article");
  if (!articleBox) return;

  const slug = new URLSearchParams(window.location.search).get("slug");

  const article = window.articles?.find(a => a.slug === slug);

  if (!article) {
    articleBox.innerHTML = "<p>Article not found.</p>";
    return;
  }

  document.title = `${article.title} | Be Mindful`;

  articleBox.innerHTML = `
    <a href="index.html">← Back</a>

    <h1>${article.title}</h1>

    <img src="${article.image}" style="width:100%; border-radius:10px; margin:15px 0;" />

    <div class="article-content">
      ${article.content}
    </div>
  `;
}