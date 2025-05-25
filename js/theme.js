// theme.js

const themeToggleBtn = document.getElementById('themeToggleBtn');

// Apply saved theme on page load
window.addEventListener('load', () => {
  const darkMode = localStorage.getItem('darkMode') === 'true';
  setTheme(darkMode);
});

// Toggle theme on button click
themeToggleBtn.addEventListener('click', () => {
  const isDark = document.body.classList.contains('dark-mode');
  setTheme(!isDark);
});

function setTheme(darkMode) {
  // Add transition for smooth theme change
  document.body.style.transition = 'background-color 0.4s ease, color 0.4s ease';

  // Force reflow to restart transition if needed
  void document.body.offsetWidth;

  document.body.classList.toggle('dark-mode', darkMode);

  // Change navbar and footer styles accordingly
  const navbar = document.querySelector('nav.navbar');
  const footer = document.querySelector('footer');

  if (darkMode) {
    navbar.classList.remove('navbar-light', 'bg-light');
    navbar.classList.add('navbar-dark', 'bg-dark');
    footer.classList.remove('bg-light');
    footer.classList.add('bg-dark', 'text-light');
    themeToggleBtn.textContent = 'Light Mode';
  } else {
    navbar.classList.remove('navbar-dark', 'bg-dark');
    navbar.classList.add('navbar-light', 'bg-light');
    footer.classList.remove('bg-dark', 'text-light');
    footer.classList.add('bg-light');
    themeToggleBtn.textContent = 'Dark Mode';
  }

  localStorage.setItem('darkMode', darkMode);
}
