(() => {
  const allBooksContainer = document.getElementById("allBooksContainer");
  const allBooksMessage = document.getElementById("allBooksMessage");
  const pagination = document.getElementById("pagination");
  const sortSelect = document.getElementById("sortSelect");

  const BOOKS_PER_PAGE = 8;
  let allBooks = [];
  let allBooksOriginal = [];
  let currentPage = 1;
  let currentSort = "popular";

  const loader = document.querySelector(".loader");

  // Show or hide loader
  function setLoading(isLoading) {
    loader.style.display = isLoading ? "flex" : "none";
  }

  // Create individual book card
  function createBookCard(book) {
    const div = document.createElement("div");
    div.className = "col-md-3";

    // Fallback local image path (use relative path for web deployment)
    const fallbackImage = "./../assets/images/img.jpg";

    // Use book.coverUrl if valid, else fallback image
    const coverImage = book.coverUrl ? book.coverUrl : fallbackImage;

    div.innerHTML = `
    <div class="card h-100 shadow-sm">
      <img src="${coverImage}" class="card-img-top" alt="${
      book.title
    }" onerror="this.onerror=null;this.src='${fallbackImage}';">
      <div class="card-body book-card-scroll d-flex flex-column">
        <h5 class="card-title">${book.title}</h5>
        <p class="card-text text-muted mb-1">By ${book.authors}</p>
        <p class="card-text flex-grow-1">
          ${book.description.slice(0, 80)}${
      book.description.length > 80 ? "..." : ""
    }
        </p>
        <small class="text-muted">Source: ${book.source}</small>
      </div>
      <div class="card-footer bg-transparent border-0">
        <a href="#" class="btn btn-sm btn-primary w-100 detail-link">View Details</a>
      </div>
    </div>
  `;

    div.querySelector(".detail-link").addEventListener("click", (e) => {
      e.preventDefault();
      localStorage.setItem("selectedBook", JSON.stringify(book));
      window.location.href = "./../pages/bookDetail.html";
    });

    return div;
  }

  // Render paginated books
  function renderBooksPage(page) {
    allBooksContainer.innerHTML = "";
    currentPage = page;

    const start = (page - 1) * BOOKS_PER_PAGE;
    const booksOnPage = allBooks.slice(start, start + BOOKS_PER_PAGE);

    if (booksOnPage.length === 0) {
      allBooksMessage.textContent = "No books found.";
      return;
    }

    allBooksMessage.textContent = "";
    booksOnPage.forEach((book) =>
      allBooksContainer.appendChild(createBookCard(book))
    );
    renderPaginationControls();
  }

  // Render pagination buttons
  function renderPaginationControls() {
    pagination.innerHTML = "";
    const totalPages = Math.ceil(allBooks.length / BOOKS_PER_PAGE);

    const prev = document.createElement("li");
    prev.className = `page-item ${currentPage === 1 ? "disabled" : ""}`;
    prev.innerHTML = `<a class="page-link" href="#">&laquo;</a>`;
    prev.addEventListener("click", (e) => {
      e.preventDefault();
      if (currentPage > 1) renderBooksPage(currentPage - 1);
    });
    pagination.appendChild(prev);

    for (let i = 1; i <= totalPages; i++) {
      const li = document.createElement("li");
      li.className = `page-item ${i === currentPage ? "active" : ""}`;
      li.innerHTML = `<a class="page-link" href="#">${i}</a>`;
      li.addEventListener("click", (e) => {
        e.preventDefault();
        renderBooksPage(i);
      });
      pagination.appendChild(li);
    }

    const next = document.createElement("li");
    next.className = `page-item ${
      currentPage === totalPages ? "disabled" : ""
    }`;
    next.innerHTML = `<a class="page-link" href="#">&raquo;</a>`;
    next.addEventListener("click", (e) => {
      e.preventDefault();
      if (currentPage < totalPages) renderBooksPage(currentPage + 1);
    });
    pagination.appendChild(next);
  }

  // Sort books by selected method
  function sortBooks(method) {
    if (method === "title") {
      allBooks.sort((a, b) => a.title.localeCompare(b.title));
    } else if (method === "author") {
      allBooks.sort((a, b) => a.authors.localeCompare(b.authors));
    } else {
      // Reset to original "popular" API order
      allBooks = [...allBooksOriginal];
    }
    renderBooksPage(1);
  }

  // Load books from all 3 APIs
  async function loadAllBooks() {
    setLoading(true);
    try {
      const [openLib, google, guten] = await Promise.all([
        fetchOpenLibraryBooks("book"),
        fetchGoogleBooks("book"),
        fetchGutenBooks("book"),
      ]);
      allBooksOriginal = [...openLib, ...google, ...guten];
      allBooks = [...allBooksOriginal];

      if (allBooks.length === 0) {
        allBooksMessage.textContent = "No books found.";
        setLoading(false);
        return;
      }

      sortBooks(currentSort); // Apply default sort
      setLoading(false);
    } catch (err) {
      console.error("Book Fetch Error:", err);
      allBooksMessage.textContent = "Error loading books.";
      setLoading(false);
    }
  }

  // Handle sort select change
  sortSelect.addEventListener("change", (e) => {
    currentSort = e.target.value;
    sortBooks(currentSort);
  });

  loadAllBooks();
})();
