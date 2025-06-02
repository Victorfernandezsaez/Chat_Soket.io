// Initialize hamburger menu (reusable across all pages)

export function initHamburgerMenu() {
  const hamburgerIcon = document.getElementById('hamburger-icon');
  const links = document.getElementById('hamburgerLinks');

  if (!hamburgerIcon || !links) return;

  hamburgerIcon.addEventListener('click', (e) => {
    e.stopPropagation();
    const isExpanded = links.style.display === 'block';
    links.style.display = isExpanded ? 'none' : 'block';
    hamburgerIcon.setAttribute('aria-expanded', !isExpanded);
  });

  // Close when clicking outside
  document.addEventListener('click', (e) => {
    if (!links.contains(e.target) && !hamburgerIcon.contains(e.target)) {
      links.style.display = 'none';
      hamburgerIcon.setAttribute('aria-expanded', 'false');
    }
  });
}

// Highlight active link (optional)
export function highlightActiveNavLink() {
  const current = window.location.pathname.split('/').pop();
  document.querySelectorAll('#navbar a').forEach((link) => {
    if (link.getAttribute('href') === current) {
      link.classList.add('active');
    }
  });
}
