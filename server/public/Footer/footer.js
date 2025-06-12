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
        <p>Hier steht das Impressum deiner Website. Z. B. Name, Adresse, Kontaktinformationen.</p>
      `;
  } else if (id === 'datenschutz') {
    return `
        <h2>Datenschutzerklärung</h2>
        <p>Hier findest du Informationen darüber, wie mit deinen Daten umgegangen wird.</p>
      `;
  }
  return '';
}
