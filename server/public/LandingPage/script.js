document.addEventListener('DOMContentLoaded', () => {
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

  const hamburgerIcon = document.getElementById('hamburger-icon');
  const links = document.getElementById('hamburgerLinks');

  function closeMenu() {
    links.style.display = 'none';
    document.removeEventListener('click', outsideClickListener);
  }

  function outsideClickListener(event) {
    if (
      !links.contains(event.target) &&
      !hamburgerIcon.contains(event.target)
    ) {
      closeMenu();
    }
  }

  if (hamburgerIcon && links) {
    hamburgerIcon.addEventListener('click', (event) => {
      event.stopPropagation();

      if (links.style.display === 'block') {
        closeMenu();
      } else {
        links.style.display = 'block';
        setTimeout(() => {
          document.addEventListener('click', outsideClickListener);
        }, 10);
      }
    });
  }
});
