const API_URL = 'https://script.google.com/macros/s/AKfycbzD5j2vVfLn7RfcPXR6L2zOZ9GfJV7BhiVNGvpbUWxTks5GqbxpB8w19sqoNxc5JpSEAg/exec'; // Substitua pelo seu ID
const DOM = {
  form: document.getElementById('presencaForm'),
  empresa: document.getElementById('empresa'),
  correcao: document.getElementById('correcao'),
  participante: document.getElementById('participante'),
  email: document.getElementById('email'),
  contacto: document.getElementById('contacto'),
  funcao: document.getElementById('funcao'),
  genero: document.getElementById('genero'),
  toast: document.getElementById('toast'),
  loading: document.getElementById('loading'),
  btnText: document.getElementById('btnText'),
  btnLoading: document.getElementById('btnLoading')
};

// Função para carregar detalhes da empresa
async function carregarDetalhesEmpresa() {
  try {
    const empresaSelecionada = DOM.empresa.value;
    if (!empresaSelecionada) return;

    mostrarLoading(true);
    const resposta = await fetch(`${API_URL}?action=getDetalhes&empresa=${encodeURIComponent(empresaSelecionada)}`);
    const detalhes = await resposta.json();

    DOM.participante.value = detalhes.participante || '';
    DOM.email.value = detalhes.email || '';
    DOM.contacto.value = detalhes.contacto || '';
    DOM.funcao.value = detalhes.funcao || '';
    DOM.genero.value = detalhes.genero || '';

  } catch (error) {
    mostrarToast('Erro ao carregar detalhes da empresa');
    console.error('Erro:', error);
  } finally {
    mostrarLoading(false);
  }
}

// Inicialização do app
document.addEventListener('DOMContentLoaded', async () => {
  await carregarEmpresas();
  DOM.empresa.addEventListener('change', carregarDetalhesEmpresa);
  DOM.form.addEventListener('submit', enviarFormulario);
});

// Carregar lista de empresas
async function carregarEmpresas() {
  try {
    mostrarLoading(true);
    const resposta = await fetch(`${API_URL}?action=getEmpresas&cache=${Date.now()}`);
    const empresas = await resposta.json();
    
    DOM.empresa.innerHTML = empresas
      .map(empresa => `<option value="${empresa}">${empresa}</option>`)
      .join('');

  } catch (error) {
    mostrarToast('Erro ao carregar empresas');
    console.error(error);
  } finally {
    mostrarLoading(false);
  }
}

// Enviar formulário
async function enviarFormulario(e) {
  e.preventDefault();
  
  const dados = {
    action: 'salvarDados',
    empresaOriginal: DOM.empresa.value.trim(),       // Nome original (para busca)
    empresa: DOM.correcao.value.trim() || DOM.empresa.value.trim(), // Nome corrigido
    participante: DOM.participante.value.trim(),
    email: DOM.email.value.trim(),
    contacto: DOM.contacto.value.trim(),
    funcao: DOM.funcao.value.trim(),
    genero: DOM.genero.value
  };

  try {
    alterarEstadoBotao(true);
    mostrarLoading(true);
    
    const params = new URLSearchParams(dados).toString();
    const resposta = await fetch(`${API_URL}?${params}`);
    const resultado = await resposta.json();

    if (resultado.status === 'success') {
      DOM.form.reset();
      DOM.correcao.value = '';
      setTimeout(() => carregarEmpresas(), 1000); // Recarrega empresas após 1s
    }

    mostrarToast(resultado.message || 'Dados salvos!');

  } catch (error) {
    mostrarToast('Erro na conexão com o servidor');
    console.error('Erro:', error);
  } finally {
    alterarEstadoBotao(false);
    mostrarLoading(false);
  }
}

// Funções auxiliares
function mostrarToast(mensagem, duracao = 3000) {
  DOM.toast.textContent = mensagem;
  DOM.toast.classList.add('toast-visible');
  setTimeout(() => DOM.toast.classList.remove('toast-visible'), duracao);
}

function mostrarLoading(ativo) {
  DOM.loading.style.display = ativo ? 'flex' : 'none';
}

function alterarEstadoBotao(carregando) {
  DOM.btnText.style.display = carregando ? 'none' : 'inline';
  DOM.btnLoading.style.display = carregando ? 'inline' : 'none';
  DOM.form.querySelector('button').disabled = carregando;
}