// script.js
const form = document.getElementById('bookForm');
const listaLivros = document.getElementById('listaLivros');
const filtroDisciplina = document.getElementById('filtroDisciplina');
const filtroAutor = document.getElementById('filtroAutor');

let livros = JSON.parse(localStorage.getItem('livros')) || [];

function salvarLivros() {
  localStorage.setItem('livros', JSON.stringify(livros));
}

function atualizarFiltroAutores() {
  const autores = [...new Set(livros.map(l => l.autor))];
  filtroAutor.innerHTML = '<option value="">Todos</option>' +
    autores.map(a => `<option value="${a}">${a}</option>`).join('');
}

function exibirLivros() {
  const disciplinaSelecionada = filtroDisciplina.value;
  const autorSelecionado = filtroAutor.value;

  const livrosFiltrados = livros.filter(livro => {
    const porDisciplina = !disciplinaSelecionada || livro.disciplina === disciplinaSelecionada;
    const porAutor = !autorSelecionado || livro.autor === autorSelecionado;
    return porDisciplina && porAutor;
  });

  listaLivros.innerHTML = livrosFiltrados.length ? livrosFiltrados.map((livro, index) => `
    <div class="book">
      <strong>${livro.titulo}</strong><br>
      Autor: ${livro.autor}<br>
      Disciplina: ${livro.disciplina}<br>
      Situação: ${livro.emprestado ? 'Emprestado' : 'Disponível'}
      <br>
      <button onclick="alternarEmprestimo(${index})">
        ${livro.emprestado ? 'Devolver' : 'Emprestar'}
      </button>
    </div>
  `).join('') : '<p>Nenhum livro disponível.</p>';
}

function alternarEmprestimo(index) {
  livros[index].emprestado = !livros[index].emprestado;
  salvarLivros();
  exibirLivros();
}

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

filtroDisciplina.addEventListener('change', exibirLivros);
filtroAutor.addEventListener('change', exibirLivros);

// Inicialização
atualizarFiltroAutores();
exibirLivros();