// search.js

const searchForm = document.getElementById('searchForm');
const searchInput = document.getElementById('searchInput');
const searchResults = document.getElementById('searchResults');
const searchMessage = document.getElementById('searchMessage');
const loader = document.querySelector('.loader');
const cancelSearchBtn = document.getElementById('cancelSearchBtn');

let abortController = null;

function createBookCard(book) {
  const div = document.createElement('div');
  div.className = 'col-md-4 col-lg-3 mb-4'; 

  div.innerHTML = `
    <div class="card h-100 shadow-sm">
      <img 
        src="${book.coverUrl}" 
        class="card-img-top" 
        alt="${book.title}" 
        style="height: 250px; object-fit: cover;" 
        onerror="this.onerror=null; this.src='./../assets/images/img.jpg';"
      />
      <div class="card-body d-flex flex-column">
        <h5 class="card-title">${book.title}</h5>
        <p class="card-text text-truncate">By ${book.authors}</p>
        <p class="card-text flex-grow-1 text-truncate">${book.description}</p>
        <small class="text-muted mb-2">Source: ${book.source}</small>
        <button class="btn btn-primary mt-auto view-details-btn">View Details</button>
      </div>
    </div>
  `;

  const detailBtn = div.querySelector('.view-details-btn');
  detailBtn.addEventListener('click', () => {
    localStorage.setItem('selectedBook', JSON.stringify(book));
    window.location.href = '../pages/bookDetail.html';
  });

  return div;
}

function addToFavourites(book) {
  let favs = JSON.parse(localStorage.getItem('favourites')) || [];
  if (favs.find((b) => b.id === book.id && b.source === book.source)) {
    alert('Book already in favourites!');
    return;
  }
  favs.push(book);
  localStorage.setItem('favourites', JSON.stringify(favs));
  alert('Book added to favourites!');
}

function showLoader() {
  loader.style.display = 'block';
  cancelSearchBtn.style.display = 'inline-block';
}

function hideLoader() {
  loader.style.display = 'none';
  cancelSearchBtn.style.display = 'none';
}
hideLoader();

async function performSearch(query) {
  abortController = new AbortController();
  const timeout = setTimeout(() => abortController.abort(), 10000); // 10 seconds

  showLoader();
  searchResults.innerHTML = '';

  try {
    const [olBooks, gBooks] = await Promise.all([
      fetchOpenLibraryBooks(query, abortController.signal),
      fetchGoogleBooks(query, abortController.signal),
    ]);

    const combined = [...olBooks, ...gBooks];
    if (combined.length === 0) {
      searchMessage.textContent = 'No results found.';
      return;
    }

    searchMessage.textContent = '';
    combined.forEach((book) => {
      searchResults.appendChild(createBookCard(book));
    });

  } catch (error) {
    if (abortController.signal.aborted) {
      searchMessage.textContent = 'Search cancelled.';
    } else {
      searchMessage.textContent = 'Error searching books. Please try again later.';
    }
  } finally {
    clearTimeout(timeout);
    hideLoader();
    abortController = null;
  }
}

searchForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const query = searchInput.value.trim();
  if (query) {
    saveSearchQuery(query); // Save the search term to localStorage
    performSearch(query);
  }
});

cancelSearchBtn.addEventListener('click', () => {
  if (abortController) {
    abortController.abort();
    hideLoader();
    searchMessage.textContent = 'Search cancelled.';
  }
});

function saveSearchQuery(query) {
  let searches = JSON.parse(localStorage.getItem('recentSearches')) || [];

  // Remove duplicates (case-insensitive)
  searches = searches.filter((term) => term.toLowerCase() !== query.toLowerCase());

  // Add latest query to the end
  searches.push(query);

  // Keep only the last 10 searches
  if (searches.length > 10) {
    searches = searches.slice(-10);
  }

  localStorage.setItem('recentSearches', JSON.stringify(searches));
}
