export async function loadNavbar() {
  try {
    const response = await fetch('../Navbar/navbar.html');
    const html = await response.text();
    document.getElementById('navbar-placeholder').innerHTML = html;

    // Initialize hamburger menu
    const hamburgerIcon = document.getElementById('hamburger-icon');
    const links = document.getElementById('hamburgerLinks');

    if (hamburgerIcon && links) {
      hamburgerIcon.addEventListener('click', (e) => {
        e.stopPropagation();
        links.style.display =
          links.style.display === 'block' ? 'none' : 'block';
      });

      document.addEventListener('click', (e) => {
        if (!links.contains(e.target) && !hamburgerIcon.contains(e.target)) {
          links.style.display = 'none';
        }
      });
    }
  } catch (error) {
    console.error('Error loading navbar:', error);
  }
}
