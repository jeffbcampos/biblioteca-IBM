document.addEventListener('DOMContentLoaded', function() {
    const modal = document.getElementById('modal');
    const botaoConfirmar = document.getElementById('confirmar');
    const botaoCancelar = document.getElementById('cancelar');

    document.getElementById('dataRetirada').addEventListener('change', function() {
        const dataRetirada = new Date(this.value);
        const dataEntrega = new Date(dataRetirada);
        dataEntrega.setDate(dataRetirada.getDate() + 3); // Adiciona 3 dias à data de retirada
        document.getElementById('dataEntrega').value = dataEntrega.toISOString().split('T')[0]; // Atualiza o valor do campo de data de entrega
    });

    botaoConfirmar.addEventListener('click', function(event) {
        event.preventDefault();     
        const usuario = document.getElementById('usuario').value;
        const dataInicio = document.getElementById('dataRetirada').value;
        const dataFim = document.getElementById('dataEntrega').value;
        const livroId = localStorage.getItem("id_livro");    

        if (!usuario || !dataInicio || !dataFim) {
            alert('Por favor, preencha todos os campos.');
            return;
        }

        const dadosReserva = {
            usuario: usuario,
            data_inicio: dataInicio,
            data_fim: dataFim
        };

        enviarReserva(livroId, dadosReserva);
        excluirExemplo(livroId)
        window.location.assign("/index.html");
    });

    botaoCancelar.addEventListener('click', function() {
        modal.style.display = 'none'; // Fecha o modal
    });

    async function enviarReserva(livroId, dadosReserva) {
    try {
        const livroId = localStorage.getItem("id_livro");
        const responseReserva = await fetch(`http://localhost:8080/api/livros/${livroId}/reservas`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(dadosReserva),
        });

        if (!responseReserva.ok) {
            throw new Error('Erro ao enviar a reserva.');
        }

        // Chama a função de exclusão após a reserva ser confirmada        

        alert('Reserva realizada com sucesso!');
        modal.style.display = 'none'; // Fecha o modal após a reserva ser enviada
    } catch (error) {        
        alert('Ocorreu um erro ao tentar realizar a reserva. Exemplar não disponível.');
    }
}

async function excluirExemplo(livroId) {
    try {
        const responseExemplares = await fetch(`http://localhost:8080/api/livros/${livroId}/exemplares`, {
            method: 'DELETE',
        });

        if (!responseExemplares.ok) {
            throw new Error('Erro ao remover o exemplo do livro do estoque.');
        }
        console.log("Exemplo removido com sucesso");
    } catch (error) {
        console.error('Erro ao remover o exemplo:', error);
    }
}

});
