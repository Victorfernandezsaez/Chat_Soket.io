import { loadNavbar } from '../Navbar/loadNavbar.js';

document.addEventListener('DOMContentLoaded', async () => {
  await loadNavbar();

  const appsContainer = document.querySelector('.chat-apps-container');

  if (!appsContainer) return;

  // Create responsive iframes
  const createIframe = () => {
    const iframe = document.createElement('iframe');
    iframe.src = '../ChatApp/index.html';
    iframe.className = 'chat-iframe';
    iframe.title = 'Chat Application';

    // Dynamic height adjustment
    const updateHeight = () => {
      const isMobile = window.matchMedia('(max-width: 768px)').matches;
      iframe.style.height = isMobile ? '350px' : '500px';
    };

    window.addEventListener('resize', updateHeight);
    updateHeight(); // Set initial height

    return iframe;
  };

  // Create wrapper and iframes
  appsContainer.innerHTML = '<div class="chat-apps-wrapper"></div>';
  const wrapper = appsContainer.querySelector('.chat-apps-wrapper');

  wrapper.appendChild(createIframe());
  wrapper.appendChild(createIframe());
});
