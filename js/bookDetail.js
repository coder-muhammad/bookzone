document.addEventListener("DOMContentLoaded", () => {
  const book = JSON.parse(localStorage.getItem("selectedBook"));

  if (!book || !book.id) {
    document.getElementById("bookDetail").innerHTML =
      "<p class='text-danger'>Book details not found.</p>";
    return;
  }

  displayBookDetail(book);
  setupAddToFavourites(book);
});

function displayBookDetail(book) {
  const coverImg = document.getElementById("bookCover");
  const fallbackImage = "./../assets/images/img.jpg"; // Use your relative path here

  coverImg.src = book.coverUrl || fallbackImage;

  // If image fails to load, replace with fallback image
  coverImg.onerror = () => {
    coverImg.onerror = null; // prevent infinite loop if fallback also fails
    coverImg.src = fallbackImage;
  };

  document.getElementById("bookTitle").textContent = book.title;
  document.getElementById("bookAuthor").textContent = "by " + book.authors;
  document.getElementById("bookPublishDate").textContent = book.source
    ? `Source: ${book.source}`
    : "";
  document.getElementById("bookDescription").textContent = book.description;
}


function setupAddToFavourites(book) {
  const modalMessage = document.getElementById("favouriteModalMessage");
  const favouriteModal = new bootstrap.Modal(document.getElementById("favouriteModal"));

  document.getElementById("addToFavourites").addEventListener("click", () => {
    const favourites = JSON.parse(localStorage.getItem("favourites")) || [];
    const exists = favourites.some((b) => b.id === book.id);

    if (!exists) {
      favourites.push(book);
      localStorage.setItem("favourites", JSON.stringify(favourites));
      modalMessage.textContent = "Book added to favourites!";
    } else {
      modalMessage.textContent = "This book is already in your favourites.";
    }

    favouriteModal.show();
  });
}

