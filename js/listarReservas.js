async function buscarReservas(livroId) {
 try {
    const response = await fetch(`http://localhost:8080/api/livros/${livroId}/reservas`);
    if (!response.ok) {
      throw new Error("Erro ao buscar reservas");
    }
    const reservas = await response.json();
    renderReservas(reservas);
 } catch (error) {
    console.error("Erro ao buscar reservas:", error);
    alert("Ocorreu um erro ao buscar as reservas. Por favor, tente novamente.");
 }
}

function renderReservas(reservas) {
 const container = document.querySelector(".container_sessao");
 reservas.forEach((reserva) => {
    const cardReserva = criarCardReserva(reserva);
    container.appendChild(cardReserva);
 });
}

function criarElemento(tag, className) {
  const element = document.createElement(tag);
  element.className = className;
  return element;
}


function criarCardReserva(reserva) {
 const cardReserva = criarElemento("div", "card_reserva");
 cardReserva.id = reserva.id; // Supondo que a reserva tenha um ID

 const tituloLivro = criarElemento("h2", "card_reserva_titulo");
 tituloLivro.textContent = reserva.livro.titulo;

 const usuarioReserva = criarElemento("p", "card_reserva_usuario");
 usuarioReserva.textContent = `Usuário: ${reserva.usuario}`;

 const dataInicioReserva = criarElemento("p", "card_reserva_data_inicio");
 dataInicioReserva.textContent = `Data de Retirada: ${reserva.data_inicio}`;

 const dataFimReserva = criarElemento("p", "card_reserva_data_fim");
 dataFimReserva.textContent = `Data de Entrega: ${reserva.data_fim}`;

 const infosReserva = criarElemento("div", "card_reserva_infos");
 infosReserva.appendChild(tituloLivro);
 infosReserva.appendChild(usuarioReserva);
 infosReserva.appendChild(dataInicioReserva);
 infosReserva.appendChild(dataFimReserva);

 cardReserva.appendChild(infosReserva);

 return cardReserva;
}

document.addEventListener("DOMContentLoaded", function() {
 const livroId = localStorage.getItem("id_livro"); // Substitua pelo método correto de obter o ID do livro
 buscarReservas(livroId);
});
