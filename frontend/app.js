const API_URL = "/articles";

/* ELEMENTS */
const articlesContainer = document.getElementById("articles");
const featuredContainer = document.getElementById("featured");
const searchInput = document.getElementById("search");

/* STORE ARTICLES */
let allArticles = [];

/* FETCH ARTICLES */
fetch(API_URL)
  .then(res => res.json())
  .then(data => {

    allArticles = data;

    renderFeatured(data);
    renderArticles(data);

  })
  .catch(err => console.error("Error loading articles:", err));

/* RENDER ARTICLES */
function renderArticles(data) {

  if (!articlesContainer) return;

  articlesContainer.innerHTML = "";

  if (data.length === 0) {
    articlesContainer.innerHTML = `<p>No articles found.</p>`;
    return;
  }

  data.forEach(article => {

    articlesContainer.innerHTML += `
      <div class="article-card">

        <img class="article-thumb" src="${article.image}" alt="${article.title}">

        <h3>${article.title}</h3>

        <p>${article.summary}</p>

        <a href="article.html?slug=${article.slug}">
          Read Article →
        </a>

      </div>
    `;
  });
}

/* FEATURED ARTICLE */
function renderFeatured(data) {

  if (!featuredContainer || data.length === 0) return;

  const latest = data[data.length - 1];

  featuredContainer.innerHTML = `
    <div class="featured-card">

      <h3>${latest.title}</h3>

      <p>${latest.summary}</p>

      <a href="article.html?slug=${latest.slug}">
        Read Article →
      </a>

    </div>
  `;
}

/* SEARCH */
if (searchInput) {

  searchInput.addEventListener("input", (e) => {

    const query = e.target.value.toLowerCase();

    const filtered = allArticles.filter(article => {

      return (
        article.title.toLowerCase().includes(query) ||
        article.summary.toLowerCase().includes(query)
      );

    });

    renderArticles(filtered);

  });

}

const articleTitle = document.getElementById("article-title");
const articleImage = document.getElementById("article-image");
const articleContent = document.getElementById("article-content");

const urlParams = new URLSearchParams(window.location.search);
const slug = urlParams.get("slug");

if (slug && articleTitle) {

  fetch(`/articles/${slug}`)
    .then(res => res.json())
    .then(article => {

      articleTitle.textContent = article.title;

      articleImage.src = article.image;
      articleImage.alt = article.title;

      articleContent.innerHTML = article.content;

    })
    .catch(err => console.error("Error loading article:", err));

}