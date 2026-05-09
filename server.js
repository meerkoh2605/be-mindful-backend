
const express = require("express");
const app = express();

const articles = require("./data.json");

const PORT = process.env.PORT || 3000;

// HOME PAGE (this is where your /home goes)
app.get("/home", (req, res) => {
  let html = "<h1>Be Mindful 🧠</h1>";
  html += "<h2>Articles</h2>";

  articles.forEach(a => {
    html += `<p><a href="/articles/${a.slug}">${a.title}</a></p>`;
  });

  res.send(html);
});

// API routes
app.get("/articles", (req, res) => {
  res.json(articles);
});

app.get("/articles/:slug", (req, res) => {
  const article = articles.find(a => a.slug === req.params.slug);
  res.json(article);
});

// START SERVER (must be LAST)
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});