// api.js

// Helper function to normalize book objects to a common format
// Each book: { id, title, authors, coverUrl, description, source }
function normalizeOpenLibrary(book) {
  return {
    id: book.key,
    title: book.title,
    authors: book.author_name ? book.author_name.join(', ') : 'Unknown',
    coverUrl: book.cover_i
      ? `https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg`
      : 'https://via.placeholder.com/128x193?text=No+Cover',
    description: book.first_sentence ? book.first_sentence.join(' ') : 'No description available.',
    source: 'Open Library',
  };
}

function normalizeGoogleBook(book) {
  const volInfo = book.volumeInfo;
  return {
    id: book.id,
    title: volInfo.title,
    authors: volInfo.authors ? volInfo.authors.join(', ') : 'Unknown',
    coverUrl: volInfo.imageLinks?.thumbnail || 'https://via.placeholder.com/128x193?text=No+Cover',
    description: volInfo.description || 'No description available.',
    source: 'Google Books',
  };
}

function normalizeGutenBook(book) {
  return {
    id: book.id.toString(),
    title: book.title,
    authors: book.authors && book.authors.length > 0
      ? book.authors.map(a => a.name).join(', ')
      : 'Unknown',
    coverUrl: book.formats['image/jpeg'] || 'https://via.placeholder.com/128x193?text=No+Cover',
    description: 'Public domain classic from Project Gutenberg.',
    source: 'Project Gutenberg',
  };
}

// Fetch Open Library search results
async function fetchOpenLibraryBooks(query, signal) {
  try {
    const response = await fetch(`https://openlibrary.org/search.json?q=${encodeURIComponent(query)}&limit=10`, { signal });
    if (!response.ok) throw new Error('Open Library fetch error');
    const data = await response.json();
    return data.docs.map(normalizeOpenLibrary);
  } catch (error) {
    if (error.name === 'AbortError') console.warn('Open Library request aborted');
    else console.error('Open Library Error:', error);
    return [];
  }
}


// Fetch Google Books search results (no key, limited usage)
async function fetchGoogleBooks(query, signal) {
  try {
    const response = await fetch(`https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}&maxResults=10`, { signal });
    if (!response.ok) throw new Error('Google Books fetch error');
    const data = await response.json();
    return data.items ? data.items.map(normalizeGoogleBook) : [];
  } catch (error) {
    if (error.name === 'AbortError') console.warn('Google Books request aborted');
    else console.error('Google Books Error:', error);
    return [];
  }
}


// Fetch Gutendex books (public domain classics)
async function fetchGutenBooks(query, signal) {
  try {
    const response = await fetch(`https://gutendex.com/books/?search=${encodeURIComponent(query)}`, { signal });
    if (!response.ok) throw new Error('Gutenberg fetch error');
    const data = await response.json();
    return data.results.map(normalizeGutenBook);
  } catch (error) {
    if (error.name === 'AbortError') {
      console.warn('Gutenberg request aborted');
    } else {
      console.error('Gutenberg Error:', error);
    }
    return [];
  }
}


// Export functions globally for non-module environments
window.fetchOpenLibraryBooks = fetchOpenLibraryBooks;
window.fetchGoogleBooks = fetchGoogleBooks;
window.fetchGutenBooks = fetchGutenBooks;
