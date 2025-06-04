const form = document.getElementById('bookForm');
const listaLivros = document.getElementById('listaLivros');
const filtroDisciplina = document.getElementById('filtroDisciplina');
const filtroAutor = document.getElementById('filtroAutor');

let livros = JSON.parse(localStorage.getItem('livros')) || [];

// Variáveis do menu inicial
const nomeUsuario = document.getElementById('nomeUsuario');
const btnEntrar = document.getElementById('btnEntrar');
const tituloMenu = document.getElementById('tituloMenu');
const menuInicial = document.getElementById('menuInicial');
const mainHeader = document.getElementById('mainHeader');
const mainContent = document.getElementById('mainContent');

// Função pra salvar livros no localStorage
function salvarLivros() {
  localStorage.setItem('livros', JSON.stringify(livros));
}

// Atualiza filtro de autores, baseado nos livros cadastrados
function atualizarFiltroAutores() {
  const autores = [...new Set(livros.map(l => l.autor))];
  filtroAutor.innerHTML = '<option value="">Todos</option>' +
    autores.map(a => `<option value="${a}">${a}</option>`).join('');
}

// Exibe os livros filtrados na tela
function exibirLivros() {
  const disciplinaSelecionada = filtroDisciplina.value;
  const autorSelecionado = filtroAutor.value;

  const livrosFiltrados = livros.filter(livro => {
    const porDisciplina = !disciplinaSelecionada || livro.disciplina === disciplinaSelecionada;
    const porAutor = !autorSelecionado || livro.autor === autorSelecionado;
    return porDisciplina && porAutor;
  });

  listaLivros.innerHTML = livrosFiltrados.length ? livrosFiltrados.map(livro => `
    <div class="book">
      <strong>${livro.titulo}</strong><br>
      Autor: ${livro.autor}<br>
      Disciplina: ${livro.disciplina}<br>
      Situação: ${livro.emprestado ? 'Emprestado' : 'Disponível'}
      <br>
      <button onclick="alternarEmprestimo(${livros.indexOf(livro)})">
        ${livro.emprestado ? 'Devolver' : 'Emprestar'}
      </button>
    </div>
  `).join('') : '<p>Nenhum livro disponível.</p>';
}

// Alterna situação do livro (emprestado/disponível)
function alternarEmprestimo(index) {
  livros[index].emprestado = !livros[index].emprestado;
  salvarLivros();
  exibirLivros();
}

// Eventos do formulário de cadastro de livro
form.addEventListener('submit', e => {
  e.preventDefault();
  const titulo = document.getElementById('titulo').value.trim();
  const autor = document.getElementById('autor').value.trim();
  const disciplina = document.getElementById('disciplina').value;

  if (titulo && autor && disciplina) {
    livros.push({ titulo, autor, disciplina, emprestado: false });
    salvarLivros();
    form.reset();
    atualizarFiltroAutores();
    exibirLivros();
  }
});

// Eventos de filtros
filtroDisciplina.addEventListener('change', exibirLivros);
filtroAutor.addEventListener('change', exibirLivros);

// Habilita/desabilita botão Entrar conforme input nome
nomeUsuario.addEventListener('input', () => {
  btnEntrar.disabled = nomeUsuario.value.trim().length === 0;
});

// Botão entrar: saudação + esconde menu + mostra sistema
btnEntrar.addEventListener('click', () => {
  const nome = nomeUsuario.value.trim();
  if (!nome) return;

  tituloMenu.textContent = `Bem-vindo(a) , ${nome}!`;

  setTimeout(() => {
    menuInicial.style.display = 'none';
    mainHeader.style.display = 'block';
    mainContent.style.display = 'block';
  }, 1300);
});

// Inicialização
atualizarFiltroAutores();
exibirLivros();

