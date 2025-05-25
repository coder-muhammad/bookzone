document.addEventListener("DOMContentLoaded", () => {
  showFavouritesCount();
  loadRecentSearches();
  loadFeaturedBook();
});

// Show total favourites count
function showFavouritesCount() {
  const favs = JSON.parse(localStorage.getItem("favourites")) || [];
  const countEl = document.getElementById("favouritesCount");
  if (countEl) countEl.textContent = favs.length;
}

// Show last 5 recent searches
function loadRecentSearches() {
  const searches = JSON.parse(localStorage.getItem("recentSearches")) || [];
  const list = document.getElementById("recentSearches");
  if (!list) return;

  list.innerHTML = "";
  if (searches.length === 0) {
    const li = document.createElement("li");
    li.className = "list-group-item";
    li.textContent = "No recent searches.";
    list.appendChild(li);
  } else {
    searches.slice(-5).reverse().forEach((term) => {
      const li = document.createElement("li");
      li.className = "list-group-item";
      li.textContent = term;
      list.appendChild(li);
    });
  }
}

// Load a random featured book from Open Library
async function loadFeaturedBook() {
  try {
    const books = await fetchOpenLibraryBooks("bestseller");
    if (books && books.length > 0) {
      const book = books[Math.floor(Math.random() * books.length)];

      // Populate featured book section
      const featuredImg = document.getElementById("featuredImage");
      featuredImg.src = book.coverUrl;
      featuredImg.onerror = () => {
        featuredImg.onerror = null;
        featuredImg.src = "../assets/images/img.jpg";
      };

      document.getElementById("featuredTitle").textContent = book.title;
      document.getElementById("featuredAuthor").textContent = `by ${book.authors}`;
      document.getElementById("featuredBook").classList.remove("d-none");

      // Read More button event
      const detailLink = document.getElementById("detailLink");
      if (detailLink) {
        detailLink.addEventListener("click", (e) => {
          e.preventDefault();
          localStorage.setItem("selectedBook", JSON.stringify(book));
          window.location.href = "../pages/bookDetail.html";
        });
      }
    }
  } catch (e) {
    console.error("Failed to load featured book", e);
  }
}
