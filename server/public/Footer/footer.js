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
}

export async function loadFooter() {
  try {
    const response = await fetch('../Footer/index.html');
    if (!response.ok) throw new Error(`HTTP ${response.status}`);

    const html = await response.text();
    const placeholder = document.getElementById('footer-placeholder');
    if (!placeholder) throw new Error('Footer placeholder not found');
    placeholder.innerHTML = html;
  } catch (error) {
    console.error('Navbar loading failed:', error);
    showErrorToUser(error.message);
  }
}

document.addEventListener('click', (event) => {
  if (event.target.id === 'impresum' || event.target.id === 'datenschutz') {
    const modal = document.getElementById('modal');
    const modalText = document.getElementById('modal-text');
    modalText.innerHTML = getModalContent(event.target.id);
    modal.classList.remove('hidden');
    modal.style.display = 'block';
  }

  if (event.target.id === 'close-modal' || event.target.id === 'modal') {
    document.getElementById('modal').classList.add('hidden');
    document.getElementById('modal').style.display = 'none';
  }
});

function getModalContent(id) {
  if (id === 'impresum') {
    return `
        <h2>Impressum</h2>
        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque nec mauris et ex tempor maximus eget sit amet massa. Curabitur suscipit est ac finibus vehicula. Vestibulum posuere ante ornare eros condimentum suscipit. Vivamus ultrices nibh ac nisi varius aliquam. Donec ultricies finibus dignissim. Etiam justo urna, malesuada eu eleifend at, posuere vitae lectus. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus.

Morbi id scelerisque magna. Vivamus porttitor malesuada dui ut blandit. Mauris eu urna at lectus semper imperdiet. Sed quis iaculis lorem. Ut finibus tempor elit, vel pretium arcu interdum vitae. Nulla quis bibendum metus, ac volutpat lectus. Pellentesque sodales malesuada sem vitae gravida. Vestibulum pellentesque aliquam scelerisque. Etiam dignissim dictum aliquam. Integer id pretium elit.

Phasellus tempor pulvinar neque id efficitur. In pretium, est in accumsan malesuada, risus leo posuere nunc, nec rutrum mi risus vitae turpis. Curabitur at ligula metus. Nam dolor ante, dictum eget magna vel, tempor dictum augue. Sed eget sollicitudin turpis. Etiam ultrices, quam vel aliquet viverra, diam dui eleifend lacus, id eleifend mauris sapien non nisl. Nunc rutrum sit amet eros at cursus.

Nunc at nibh imperdiet, efficitur nunc sed, vehicula dui. Aliquam erat volutpat. Etiam bibendum tortor in rutrum eleifend. Fusce placerat dui eros, ac suscipit orci malesuada eu. Donec mattis at dolor quis luctus. Ut at tincidunt arcu, ut gravida tortor. Donec non ornare urna. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas.

Duis gravida sodales dolor eget feugiat. Sed at magna dui. Praesent ultricies nunc sit amet dolor tempor lobortis. Suspendisse iaculis odio magna, porta dictum dolor commodo eu. Curabitur aliquet quis ex vitae ornare. Nulla in ante eu tortor aliquet maximus at nec tortor. Proin porttitor porttitor dui, sit amet rutrum orci gravida ut. Sed tempor sodales mollis. Suspendisse orci ligula, pharetra vel metus eget, maximus euismod nisl.</p>
      `;
  } else if (id === 'datenschutz') {
    return `
        <h2>Datenschutzerklärung</h2>
        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque nec mauris et ex tempor maximus eget sit amet massa. Curabitur suscipit est ac finibus vehicula. Vestibulum posuere ante ornare eros condimentum suscipit. Vivamus ultrices nibh ac nisi varius aliquam. Donec ultricies finibus dignissim. Etiam justo urna, malesuada eu eleifend at, posuere vitae lectus. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus.

Morbi id scelerisque magna. Vivamus porttitor malesuada dui ut blandit. Mauris eu urna at lectus semper imperdiet. Sed quis iaculis lorem. Ut finibus tempor elit, vel pretium arcu interdum vitae. Nulla quis bibendum metus, ac volutpat lectus. Pellentesque sodales malesuada sem vitae gravida. Vestibulum pellentesque aliquam scelerisque. Etiam dignissim dictum aliquam. Integer id pretium elit.

Phasellus tempor pulvinar neque id efficitur. In pretium, est in accumsan malesuada, risus leo posuere nunc, nec rutrum mi risus vitae turpis. Curabitur at ligula metus. Nam dolor ante, dictum eget magna vel, tempor dictum augue. Sed eget sollicitudin turpis. Etiam ultrices, quam vel aliquet viverra, diam dui eleifend lacus, id eleifend mauris sapien non nisl. Nunc rutrum sit amet eros at cursus.

Nunc at nibh imperdiet, efficitur nunc sed, vehicula dui. Aliquam erat volutpat. Etiam bibendum tortor in rutrum eleifend. Fusce placerat dui eros, ac suscipit orci malesuada eu. Donec mattis at dolor quis luctus. Ut at tincidunt arcu, ut gravida tortor. Donec non ornare urna. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas.

Duis gravida sodales dolor eget feugiat. Sed at magna dui. Praesent ultricies nunc sit amet dolor tempor lobortis. Suspendisse iaculis odio magna, porta dictum dolor commodo eu. Curabitur aliquet quis ex vitae ornare. Nulla in ante eu tortor aliquet maximus at nec tortor. Proin porttitor porttitor dui, sit amet rutrum orci gravida ut. Sed tempor sodales mollis. Suspendisse orci ligula, pharetra vel metus eget, maximus euismod nisl.</p>
      `;
  }
  return '';
}
