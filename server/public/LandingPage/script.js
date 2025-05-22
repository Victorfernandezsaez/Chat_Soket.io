/* document.addEventListener('DOMContentLoaded', () => {
  // Target the parent container for both chat instances
  const appsContainer = document.querySelector('.chat-apps-container'); // New container

  if (!appsContainer) {
    console.error('Chat apps container not found');
    return;
  }

  const wrapper = appsContainer.querySelector('.chat-apps-wrapper');

  // Create two iframes
  const iframe1 = createChatIframe();
  const iframe2 = createChatIframe();

  // Append iframes
  wrapper.appendChild(iframe1);
  wrapper.appendChild(iframe2);

  // Iframe creation helper
  function createChatIframe() {
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
    updateHeight();

    iframe.onerror = () => {
      iframe.style.display = 'none';
      const error = document.createElement('div');
      error.className = 'chat-error';
      error.textContent = 'Chat failed to load';
      wrapper.appendChild(error);
    };

    return iframe;
  }
});
 */

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
});
