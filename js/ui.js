// ui.js

// Adjust footer to stay at bottom if page content is short
function adjustFooter() {
  const footer = document.querySelector('footer');
  const main = document.querySelector('main'); // Main content area

  if (!footer || !main) return;

  // Reset footer position
  footer.style.position = '';
  footer.style.bottom = '';
  footer.style.width = '';

  // Get the total height: content + footer
  const totalHeight = document.body.scrollHeight;
  const viewportHeight = window.innerHeight;

  if (totalHeight < viewportHeight) {
    // Push footer to bottom
    footer.style.position = 'fixed';
    footer.style.bottom = '0';
    footer.style.left = '0';
    footer.style.width = '100%';

    // Optional: add padding to main so content doesn't get hidden
    main.style.paddingBottom = footer.offsetHeight + 'px';
  } else {
    footer.style.position = 'static';
    main.style.paddingBottom = '';
  }
}

window.addEventListener('load', adjustFooter);
window.addEventListener('resize', adjustFooter);


// Run on load and on window resize
window.addEventListener('load', adjustFooter);
window.addEventListener('resize', adjustFooter);
