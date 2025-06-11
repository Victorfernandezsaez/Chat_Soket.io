const appsContainer = document.querySelector('.chat-apps-container');

if (!appsContainer) {
  console.error('Chat apps container not found');
} else {
  const socketScript = document.createElement('script');
  socketScript.src =
    'https://cdnjs.cloudflare.com/ajax/libs/socket.io/4.8.1/socket.io.min.js';
  document.head.appendChild(socketScript);

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
}
