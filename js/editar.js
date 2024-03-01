// Função para preencher os campos do formulário com os dados do livro
function preencherFormulario(livro) {
  document.querySelector("#titulo").value = livro.titulo;
  document.querySelector("#autor").value = livro.autor;
  // document.querySelector("#exemplares").value = livro.exemplares;
}

// Função para fazer uma requisição para obter os dados do livro a ser editado
async function carregarLivroParaEdicao() {
  try {
    // Supondo que você tenha o ID do livro que deseja editar
    const livroId = localStorage.getItem("id_livro"); // Substitua pelo ID do livro desejado

    // Faz uma requisição para obter os dados do livro com o ID desejado
    const response = await fetch(`http://localhost:8080/api/livros/${livroId}`);
    if (!response.ok) {
      throw new Error("Erro ao carregar livro para edição");
    }
    const livro = await response.json();

    // Preenche o formulário com os dados do livro
    preencherFormulario(livro);
  } catch (error) {
    console.error("Erro ao carregar livro para edição:", error);
    alert(
      "Ocorreu um erro ao carregar o livro para edição. Por favor, tente novamente."
    );
  }
}

// Chama a função para carregar o livro para edição quando a página carregar
document.addEventListener("DOMContentLoaded", carregarLivroParaEdicao);

// Evento de clique no botão "Editar Livro"
const botao = document.querySelector("[data-botao]");

botao.addEventListener("click", function (event) {
  event.preventDefault();

  // Obter os valores dos campos do formulário
  const titulo = document.querySelector("#titulo").value;
  const autor = document.querySelector("#autor").value;
  // const exemplares = document.querySelector("#exemplares").value;
  const ano_publicacao = document.querySelector("#ano_publicacao").value;


  // Objeto com os dados do livro para enviar no corpo da requisição PATCH
  const dadosLivro = {
    titulo: titulo,
    autor: autor,    
    ano_publicacao: ano_publicacao,
  };

  // ID do livro que está sendo editado (substitua pelo ID correto)
  const livroId = localStorage.getItem("id_livro");

  async function enviarSolicitacaoPatch(livroId, dadosLivro) {
    try {
      const response = await fetch(`http://localhost:8080/api/livros/${livroId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dadosLivro),
      });
      if (!response.ok) {
        throw new Error("Erro ao editar livro");
      }
      window.location.assign("/index.html");
    } catch (error) {
      console.error("Erro ao editar livro:", error);
      alert("Ocorreu um erro ao editar o livro. Por favor, tente novamente.");
    }
  }
  enviarSolicitacaoPatch(livroId, dadosLivro);
});
