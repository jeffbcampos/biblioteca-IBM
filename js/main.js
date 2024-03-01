function criarElemento(tag, className) {
  const element = document.createElement(tag);
  element.className = className;
  return element;
}

function criarCardLivro(livro) {
  const cardLivro = criarElemento("div", "card_livro");
 cardLivro.id = livro.id;
 const tituloLivro = criarElemento("h3", "card_livro_titulo");
 tituloLivro.textContent = livro.titulo;
 const autorLivro = criarElemento("p", "card_livro_autor");
 autorLivro.textContent = livro.autor;
 const anoPublicacaoLivro = criarElemento("p", "card_livro_ano_publicacao");
 anoPublicacaoLivro.textContent = `Ano de Publicação: ${livro.ano_publicacao}`;
 const exemplaresLivro = criarElemento("p", "card_livro_exemplares");
 // Inicialmente, definimos como "Carregando exemplares..."
 exemplaresLivro.textContent = "Carregando exemplares...";
 const infosLivro = criarElemento("div", "card_livro_infos");
 const iconesLivro = criarElemento("div", "card_livro_icones");

  const editarIcone = criarElemento("img", "card_livro_icon");
  editarIcone.setAttribute("data-editar", "");
  editarIcone.src = "./assets/icon/editar.svg";
  editarIcone.alt = "icone lápis";
  editarIcone.addEventListener("click", () => {
    localStorage.setItem("id_livro", livro.id);
    window.location.assign("/pages/editar.html");
  });

  const excluirIcone = criarElemento("img", "card_livro_icon");
  excluirIcone.setAttribute("data-excluir", "");
  excluirIcone.src = "./assets/icon/excluir.svg";
  excluirIcone.alt = "icone de lixeira";
  excluirIcone.addEventListener("click", async () => {
    try {
      const response = await fetch(`http://localhost:8080/api/livros/${livro.id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("Erro ao excluir livro");
      }
      // Atualizar a UI removendo o card do livro excluído
      cardLivro.remove();
    } catch (error) {
      console.error("Erro ao excluir livro:", error);
      alert("Ocorreu um erro ao excluir o livro. Por favor, tente novamente.");
    }
  });

  const reservarIcone = criarElemento("img", "card_livro_icon");
  reservarIcone.setAttribute("data-reversar", "");
  reservarIcone.src = "./assets/icon/reserva.svg";
  reservarIcone.alt = "icone de reserva";
  // Abrir modal ao clicar no ícone de reserva
  reservarIcone.addEventListener("click", () => {
    localStorage.setItem("id_livro", livro.id);
    modal.style.display = "block";
  });

  // Quando o usuário clicar no botão de confirmar
  const confirmarBtn = document.querySelector("[data-confirmar]");
  confirmarBtn.addEventListener("click", async () => {
    const quantidade = document.querySelector("#quantidade").value;
    const dias = document.querySelector("#dias").value;
    const dadosReserva = {
      quantidade: quantidade,
      dias: dias,
    };

    try {
      // Enviar a solicitação PATCH para o servidor
      const response = await fetch(
        `http://localhost:8080/reservar_livro/${livro.id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(dadosReserva),
        }
      );

      if (!response.ok) {
        throw new Error("Erro ao reservar livro");
      }

      // Fechar o modal e atualizar a UI
      modal.style.display = "none";
      // Atualizar a UI conforme necessário
    } catch (error) {
      console.error("Erro ao reservar livro:", error);
      alert("Ocorreu um erro ao reservar o livro. Por favor, tente novamente.");
    }
  });

  // Fechar o modal quando o usuário clicar no botão de cancelar ou no ícone de fechar
  const cancelarBtn = document.querySelector("[data-cancelar]");
  cancelarBtn.addEventListener("click", () => {
    modal.style.display = "none";
  });

  window.addEventListener("click", (event) => {
    if (event.target == modal) {
      modal.style.display = "none";
    }
  });

  iconesLivro.appendChild(editarIcone);
  iconesLivro.appendChild(excluirIcone);
  iconesLivro.appendChild(reservarIcone);

  infosLivro.appendChild(tituloLivro);
  infosLivro.appendChild(autorLivro);
  infosLivro.appendChild(anoPublicacaoLivro);
  infosLivro.appendChild(exemplaresLivro);

  cardLivro.appendChild(infosLivro);
  cardLivro.appendChild(iconesLivro);

 return cardLivro;
}

async function buscarExemplares(livroId) {
 try {
    const response = await fetch(`http://localhost:8080/api/livros/exemplares`);
    if (!response.ok) {
      throw new Error("Erro ao buscar exemplares");
    }
    const data = await response.json();
    console.log("Dados retornados pela API:", data);

    // Percorrer a lista de livros para encontrar o livro com o livro_id especificado
    for (const item of data) {
      // Acessar o objeto livro dentro de cada item e comparar o id do livro com o livroId fornecido
      if (item.livro.id === livroId) {
        // Retornar a quantidade de exemplares do livro encontrado
        return item.quantidade;
      }
    }

    // Retornar 0 se o livro não for encontrado
    return 0;
 } catch (error) {
    console.error("Erro ao buscar exemplares:", error);
    return 0; // Retorna 0 em caso de erro
 }
}

// Função para adicionar os cards de livros à página
function renderLivros(livros) {
  const container = document.querySelector(".container_sessao");
  console.log(container);
  livros.forEach((livro) => {
    const cardLivro = criarCardLivro(livro);
    container.appendChild(cardLivro);
  });
}
async function buscarLivros() {
 try {
    const response = await fetch("http://localhost:8080/api/livros");
    if (!response.ok) {
      throw new Error("Erro ao buscar os livros");
    }
    const livros = await response.json();
    const container = document.querySelector(".container_sessao");
    livros.forEach(async (livro) => {
      const cardLivro = criarCardLivro(livro);
      const exemplares = await buscarExemplares(livro.id);
      const exemplaresLivro = cardLivro.querySelector(".card_livro_exemplares");
      exemplaresLivro.textContent = `Número de exemplares: ${exemplares}`;
      container.appendChild(cardLivro);
    });
 } catch (error) {
    console.error("Erro:", error);
    alert("Ocorreu um erro ao buscar os livros. Por favor, tente novamente.");
 }
}

// Chamada da função para buscar e renderizar os livros na página
buscarLivros();
