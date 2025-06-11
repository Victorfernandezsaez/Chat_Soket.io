import { loadNavbar } from './Navbar/navbar.js';

document.addEventListener('DOMContentLoaded', async () => {
  await loadNavbar();

  const urlParams = new URLSearchParams(window.location.search);
  const page = urlParams.get('page') || 'landing';
  const mainContent = document.getElementById('main-content');

  const folderName = capitalizeFirst(page);
  const scriptName = `${page}.js`;

  const cssId = 'page-style';
  let existingLink = document.getElementById(cssId);
  if (existingLink) {
    existingLink.href = `./pages/${folderName}/style.css`;
  } else {
    const link = document.createElement('link');
    link.id = cssId;
    link.rel = 'stylesheet';
    link.href = `./pages/${folderName}/style.css`;
    document.head.appendChild(link);
  }

  try {
    const response = await fetch(`./pages/${folderName}/index.html`);
    if (!response.ok) throw new Error(`Page ${page} not found`);

    const html = await response.text();
    mainContent.innerHTML = html;

    const script = document.createElement('script');

    if (scriptName === 'weltkarte.js') {
      const leafletScript = document.createElement('script');
      leafletScript.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
      leafletScript.integrity =
        'sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo=';
      leafletScript.crossOrigin = '';

      leafletScript.onload = () => {
        script.src = `./pages/${folderName}/${scriptName}`;
        document.body.appendChild(script);
      };

      document.body.appendChild(leafletScript);
    } else {
      script.type = 'module';
      script.src = `./pages/${folderName}/${scriptName}`;
      document.body.appendChild(script);
    }

    document.body.appendChild(script);
  } catch (error) {
    mainContent.innerHTML = `<p style="color:red">Error loading page: ${error.message}</p>`;
  }
});

function capitalizeFirst(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
