/**
 * Tests whether a string ends with a given suffix
 */
function endsWith(value, suffix) {
  if (typeof value !== 'string' || typeof suffix !== 'string') return false;
  return (
    value.length >= suffix.length &&
    value.slice(value.length - suffix.length) === suffix
  );
}

/**
 * Filters items using a test function
 */
function filter(items, test) {
  if (!Array.isArray(items)) return [];
  if (typeof test !== 'function') return [...items];
  return items.filter(test); // Using native filter for simplicity
}

// Hamburger Menu Functionality
/**
 * Initializes hamburger menu functionality
 */

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

  // Close when clicking outside the menu
  document.addEventListener('click', (e) => {
    if (!links.contains(e.target) && !hamburgerIcon.contains(e.target)) {
      links.style.display = 'none';
      hamburgerIcon.setAttribute('aria-expanded', 'false');
    }
  });
}

/**
 * Shows error message to user
 * @param {string} message - Error message to display
 */
function showErrorToUser(message) {
  const errorDiv = document.createElement('div');
  errorDiv.className = 'navbar-error';
  errorDiv.textContent = `Navigation Error: ${message}`;
  errorDiv.style.cssText = `
    padding: 1rem;
    background: #ffebee;
    color: #c62828;
    border: 1px solid #c62828;
    margin: 0.5rem;
  `;

  document.body.prepend(errorDiv);
  setTimeout(() => errorDiv.remove(), 5000);
}

/**
 * Improved active link detection with edge case handling
 */
export function highlightActiveNavLink() {
  try {
    const path = window.location.pathname + window.location.search;
    const links = document.querySelectorAll('#navbar a, #hamburgerLinks a');

    if (!links.length) return;

    const linksArray = Array.from(links);
    const filteredLinks = filter(linksArray, (link) => link.href);

    filteredLinks.forEach((link) => {
      const linkUrl = new URL(link.href);
      const linkPath = linkUrl.pathname + linkUrl.search;
      const isActive =
        path === linkPath ||
        (endsWith(path, '/') && path.slice(0, -1) === linkPath) ||
        (endsWith(linkPath, '/') && path === linkPath.slice(0, -1));

      link.classList.toggle('active', isActive);
      if (isActive) link.setAttribute('aria-current', 'page');
    });
  } catch (error) {
    console.warn('Active link highlighting failed:', error);
  }
}

// Main Export
/**
 * Loads navbar HTML and initializes all components
 */
export async function loadNavbar() {
  try {
    const response = await fetch('../Navbar/navbar.html');
    if (!response.ok) throw new Error(`HTTP ${response.status}`);

    const html = await response.text();
    const placeholder = document.getElementById('navbar-placeholder');
    if (!placeholder) throw new Error('Navbar placeholder not found');

    placeholder.innerHTML = html;
    initHamburgerMenu();
    highlightActiveNavLink();

    // Navbar Logo Click Handler
    const logo = document.getElementById('logo-icon');
    if (logo) {
      logo.addEventListener('click', () => {
        window.location.href = '?page=landing';
      });
    }
  } catch (error) {
    console.error('Navbar loading failed:', error);
    showErrorToUser(error.message);
  }
}
