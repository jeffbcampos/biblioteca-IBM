const formLivro = document.querySelector("[data-form]");
console.log(formLivro);
formLivro.addEventListener("submit", async function (event) {
 event.preventDefault();

 const titulo = document.querySelector("#titulo").value;
 const autor = document.querySelector("#autor").value;
 const exemplares = document.querySelector("#exemplares").value;
 const anoPublicacao = document.querySelector("#anoPublicacao").value;

 const livro = {
 titulo: titulo,
 autor: autor,
 exemplares: exemplares,
 ano_publicacao: anoPublicacao, // Adicionando o campo anoPublicacao
};

 try {
    // Enviar a solicitação POST para o servidor
    const response = await fetch("http://localhost:8080/api/livros", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(livro),
    });

    if (!response.ok) {
      // Se a resposta não for bem-sucedida, exiba uma mensagem de erro
      throw new Error("Erro ao cadastrar livro");
    }

    // Capturar o ID do livro retornado pela API
    const data = await response.json();
    const livroId = data.id; // Supondo que a resposta inclua o ID do livro

    // Enviar a solicitação POST para a rota de exemplares usando o ID do livro
    const responseExemplares = await fetch(`http://localhost:8080/api/livros/${livroId}/exemplares`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ quantidade: exemplares }),
    });

    if (!responseExemplares.ok) {
      throw new Error("Erro ao adicionar exemplares ao livro");
    }

    // Se a resposta da requisição for bem-sucedida, redirecione para outra página
    window.location.assign("/index.html");
 } catch (error) {
    console.error("Erro ao cadastrar livro ou adicionar exemplares:", error);
    alert("Ocorreu um erro ao cadastrar o livro ou adicionar exemplares. Por favor, tente novamente.");
 }
});
