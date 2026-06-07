let editMode = false;
let editId = null;

// -------------------- CREATE / EDIT --------------------

document.getElementById("publishBtn").addEventListener("click", async () => {

  const article = {
    title: document.getElementById("title").value,
    slug: document.getElementById("slug").value,
    summary: document.getElementById("summary").value,
    image: document.getElementById("image").value,
    content: document.getElementById("content").value
  };

  let url = "/admin/create";

  if (editMode) {
    url = `/admin/edit/${editId}`;
  }

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(article)
  });

  const data = await res.json();

  if (data.success) {
    alert(editMode ? "Article updated!" : "Article created!");
    location.reload();
  }
});

// -------------------- LOAD ARTICLES --------------------

async function loadArticles() {
  const res = await fetch("/articles");
  const articles = await res.json();

  const list = document.getElementById("articleList");

  list.innerHTML = "";

  articles.forEach(a => {
    list.innerHTML += `
      <div>
        <b>${a.title}</b>

        <button onclick="editArticle(${a.id})">Edit</button>
        <button onclick="deleteArticle(${a.id})">Delete</button>
      </div>
    `;
  });
}

// -------------------- EDIT --------------------

async function editArticle(id) {
  const res = await fetch("/articles");
  const articles = await res.json();

  const article = articles.find(a => a.id === id);

  document.getElementById("title").value = article.title;
  document.getElementById("slug").value = article.slug;
  document.getElementById("summary").value = article.summary;
  document.getElementById("image").value = article.image;
  document.getElementById("content").value = article.content;

  editMode = true;
  editId = id;

  document.getElementById("publishBtn").innerText = "Update Article";
}

// -------------------- DELETE --------------------

async function deleteArticle(id) {

  const ok = confirm("Delete this article?");
  if (!ok) return;

  const res = await fetch(`/admin/delete/${id}`, {
    method: "DELETE"
  });

  const data = await res.json();

  if (data.success) {
    alert("Deleted!");
    location.reload();
  }
}

// -------------------- INIT --------------------

loadArticles();