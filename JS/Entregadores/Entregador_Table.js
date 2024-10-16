//Função para obter os entregadores
async function getEntregadores() {
    let token = getTokenFromLocalStorage();
    
    if (!token){
        console.log('Não foi possivel obter o Token')
    }

    const url = `${urlBackend()}/api/v1/entregador`;
    const opcoes = {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        mode: 'cors',
    };

    try {
        const response = await fetch(url, opcoes);

        if (response.ok) {
            const data = await response.json();

            if (data && Array.isArray(data.body)) {
                return data.body;
            } else {
                console.log('Formato inesperado de resposta:', data);
                return [];
            }
        } else {
            throw new Error('Erro ao buscar entregadores: ' + response.statusText);
        }
    } catch (error) {
        
        return [];
    }
}

// Função para popular a tabela no HTML
async function populateTable() {
    const entregadores = await getEntregadores();

    const tableBody = document.getElementById('entregadoresBody');

    // Limpa o conteúdo existente
    tableBody.innerHTML = '';

    entregadores.forEach(entregador => {
        const row = document.createElement('tr');

        // Coluna Status (baseado no campo "ativo")
        const statusCell = document.createElement('td');
        statusCell.textContent = entregador.ativo ? 'Ativo' : 'Inativo';
        row.appendChild(statusCell);

        // Coluna Código (baseado no campo "idEntregador")
        const codigoCell = document.createElement('td');
        codigoCell.textContent = entregador.idEntregador.toString().padStart(6, '0');
        row.appendChild(codigoCell);

        // Coluna Nome do Entregador (baseado no campo "nome")
        const nomeCell = document.createElement('td');
        nomeCell.textContent = entregador.nome;
        row.appendChild(nomeCell);

        const filialCell = document.createElement('td');
        filialCell.textContent = entregador.nomeMatriz; // Adapte conforme necessário
        row.appendChild(filialCell);

        // Adiciona a linha à tabela
        tableBody.appendChild(row);
    });
}

document.addEventListener('DOMContentLoaded', function() {
    const tableBody = document.getElementById('entregadoresBody');

    tableBody.addEventListener('click', function(event) {
        const selectedRow = event.target.closest('tr'); // Seleciona a linha clicada

        if (selectedRow) {
            // Remove a classe 'selected' de qualquer linha selecionada anteriormente
            const previouslySelected = tableBody.querySelector('.selected');
            if (previouslySelected) {
                previouslySelected.classList.remove('selected');
            }

            // Adiciona a classe 'selected' à linha clicada
            selectedRow.classList.add('selected');
        }
    });
});

// Executa a função populateTable ao carregar a página
document.addEventListener('DOMContentLoaded', populateTable);

async function visualizarEntregador() {
    // Obter a linha selecionada na tabela
    let selectedRow = document.querySelector('#entregadoresBody .selected');
    if (!selectedRow) {
        alert('Por favor, selecione uma linha para visualizar.');
        return;
    }

    // Obter o ID do entregador na coluna "Código"
    let entregadorId = selectedRow.cells[1].textContent;  // Considerando que a segunda célula é o código (ID)
    window.location.href = `Entregador_View.html?id=${entregadorId}`;
}

async function AlterarEntregador() {
    // Obter a linha selecionada na tabela
    let selectedRow = document.querySelector('#entregadoresBody .selected');
    if (!selectedRow) {
        alert('Por favor, selecione uma linha para visualizar.');
        return;
    }

    // Obter o ID do entregador na coluna "Código"
    let entregadorId = selectedRow.cells[1].textContent;  // Considerando que a segunda célula é o código (ID)
    window.location.href = `Entregador_Update.html?id=${entregadorId}`;
}


