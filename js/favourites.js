const favouritesContainer = document.getElementById('favouritesContainer');
const favMessage = document.getElementById('favouritesMessage');

function createBookCard(book) {
  const description = book.description || 'No description available';

  const div = document.createElement('div');
  div.className = 'col-md-3';
  div.innerHTML = `
    <div class="card book-card h-100">
      <img src="${book.coverUrl}" alt="${book.title}" class="card-img-top"
           onerror="this.onerror=null; this.src='./../assets/images/img.jpg';" />
      <div class="card-body d-flex flex-column">
        <h5 class="card-title book-title">${book.title}</h5>
        <p class="card-text book-author">By ${book.authors}</p>
        <p class="card-text description flex-grow-1">${description.slice(0, 100)}${description.length > 100 ? '...' : ''}</p>
        <small class="text-muted">Source: ${book.source}</small>
        <button class="btn btn-outline-danger mt-2 remove-fav-btn">Remove from Favourites</button>
      </div>
    </div>
  `;

  const removeBtn = div.querySelector('.remove-fav-btn');
  removeBtn.addEventListener('click', () => {
    removeBtn.disabled = true;
    removeFromFavourites(book);
  });

  return div;
}



function removeFromFavourites(book) {
  let favs = JSON.parse(localStorage.getItem('favourites')) || [];
  favs = favs.filter((b) => !(b.id === book.id && b.source === book.source));
  localStorage.setItem('favourites', JSON.stringify(favs));
  renderFavourites();
}

function renderFavourites() {
  if (!favouritesContainer || !favMessage) return;
  favouritesContainer.innerHTML = '';
  const favs = JSON.parse(localStorage.getItem('favourites')) || [];
  if (favs.length === 0) {
    favMessage.textContent = 'No favourites added yet.';
    return;
  }
  favMessage.textContent = '';
  favs.forEach((book) => {
    favouritesContainer.appendChild(createBookCard(book));
  });
}

document.addEventListener('DOMContentLoaded', renderFavourites);
