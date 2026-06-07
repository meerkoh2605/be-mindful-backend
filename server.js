const express = require("express");
const cors = require("cors");
const path = require("path");
const fs = require("fs");

const app = express();
const PORT = process.env.PORT || 3000;

// -------------------- MIDDLEWARE --------------------
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "frontend")));

// -------------------- HELPERS --------------------
function getArticles() {
  return JSON.parse(fs.readFileSync("./data.json", "utf-8"));
}

function saveArticles(data) {
  fs.writeFileSync("./data.json", JSON.stringify(data, null, 2));
}

// -------------------- ARTICLES (PUBLIC) --------------------

// all articles
app.get("/articles", (req, res) => {
  res.json(getArticles());
});

// single article
app.get("/articles/:slug", (req, res) => {
  const article = getArticles().find(a => a.slug === req.params.slug);
  res.json(article || null);
});

// -------------------- ADMIN ONLY (OPTIONAL) --------------------

// create article
app.post("/admin/create", (req, res) => {
  const articles = getArticles();

  articles.push({
    id: Date.now(),
    ...req.body
  });

  saveArticles(articles);
  res.json({ success: true });
});

// edit article
app.post("/admin/edit/:id", (req, res) => {
  const id = Number(req.params.id);
  const articles = getArticles();

  const index = articles.findIndex(a => a.id === id);

  if (index === -1) {
    return res.status(404).json({ success: false });
  }

  articles[index] = {
    ...articles[index],
    ...req.body,
    id
  };

  saveArticles(articles);
  res.json({ success: true });
});

// delete article
app.delete("/admin/delete/:id", (req, res) => {
  const id = Number(req.params.id);

  const articles = getArticles();
  const filtered = articles.filter(a => a.id !== id);

  saveArticles(filtered);

  res.json({ success: true });
});

// -------------------- HOME --------------------
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "frontend", "index.html"));
});

// -------------------- START --------------------
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});