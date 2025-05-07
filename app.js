// Conexão com Google Sheets
const SCRIPT_URL = 'SUA_URL_DE_SCRIPT_AQUI';

document.addEventListener('DOMContentLoaded', () => {
  loadEmpresas();
  setupForm();
});

function loadEmpresas() {
  fetch(`${SCRIPT_URL}?action=getEmpresas`)
    .then(response => response.json())
    .then(data => {
      const select = document.getElementById('empresa');
      select.innerHTML = data.map(e => `<option value="${e}">${e}</option>`);
    });
}

function setupForm() {
  document.getElementById('salvar').addEventListener('click', () => {
    const data = {
      empresa: document.getElementById('empresa').value,
      participante: document.getElementById('participante').value
      // Adicione outros campos
    };

    fetch(`${SCRIPT_URL}?action=salvar`, {
      method: 'POST',
      body: JSON.stringify(data)
    })
    .then(showToast('Dados salvos com sucesso!'));
  });
}

function showToast(message) {
  const toast = document.getElementById('toast');
  toast.textContent = message;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 3000);
}