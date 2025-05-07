// Configuração
const API_URL = 'https://script.google.com/macros/s/AKfycbwbCaDnt26A-z5jgEbWrxncYreOyrs9pH7EA_Zsq8nid1QK2bNoanClFg_ydCh4_6BKAw/exec';

// Elementos DOM
const form = document.getElementById('presencaForm');
const empresaSelect = document.getElementById('empresa');
const toast = document.getElementById('toast');

// Carregar empresas ao iniciar
document.addEventListener('DOMContentLoaded', () => {
  loadEmpresas();
});

// Carregar lista de empresas
async function loadEmpresas() {
  try {
    const response = await fetch(`${API_URL}?action=getEmpresas`);
    const data = await response.json();
    
    if (data.status === 'success') {
      empresaSelect.innerHTML = data.data.map(empresa => 
        `<option value="${empresa}">${empresa}</option>`
      ).join('');
    } else {
      showToast('Erro ao carregar empresas');
    }
  } catch (error) {
    showToast('Falha na conexão');
    console.error('Erro:', error);
  }
}

// Enviar formulário
form.addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const formData = {
    empresa: empresaSelect.value,
    participante: document.getElementById('participante').value,
    // Adicione outros campos conforme necessário
  };

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData)
    });
    
    const result = await response.json();
    
    if (result.status === 'success') {
      showToast('Presença registrada!');
      form.reset();
    } else {
      showToast('Erro ao salvar: ' + result.message);
    }
  } catch (error) {
    showToast('Falha na conexão');
    console.error('Erro:', error);
  }
});

// Mostrar notificação
function showToast(message) {
  toast.textContent = message;
  toast.classList.remove('toast-hidden');
  toast.classList.add('toast-visible');
  
  setTimeout(() => {
    toast.classList.remove('toast-visible');
    toast.classList.add('toast-hidden');
  }, 3000);
}