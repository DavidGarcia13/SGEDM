function configureCheckboxes() {
    const checkboxes = document.querySelectorAll('.filter-checkbox');

    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            if (this.checked) {
                checkboxes.forEach(otherCheckbox => {
                    if (otherCheckbox !== this) {
                        otherCheckbox.checked = false;
                    }
                });
            }
        });
    });
}

document.addEventListener('DOMContentLoaded', function() {
    const tableBody = document.getElementById('entregasBody');

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

// Evento para carregar a função quando clicar no botão dropdownFilterButton
document.getElementById('dropdownFilterButton').addEventListener('click', function() {
    configureCheckboxes(); // Chama a função para configurar os checkboxes
});

//Retorna o Array de Entregas
async function getEntregas() {
    let token = getTokenFromLocalStorage();
    
    if (!token){
        console.log('Não foi possivel obter o Token')
    }

    const url = `${urlBackend()}/api/v1/entrega`;
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
            throw new Error('Erro ao buscar Entregas: ' + response.statusText);
        }
    } catch (error) {
        
        return [];
    }
}

document.addEventListener('DOMContentLoaded', populateTableEntregas);

async function populateTableEntregas() {
    const tabelaBody = document.getElementById('entregasBody');
    
    // Limpa o conteúdo da tabela antes de preenchê-la novamente
    tabelaBody.innerHTML = '';

    try {
        // Chama a função para obter os dados das entregas
        const entregas = await getEntregas();

        // Itera sobre o array de entregas e cria as linhas da tabela
        entregas.forEach(entrega => {
            // Cria uma nova linha (<tr>)
            const row = document.createElement('tr');

            // Cria as células (<td>) e insere os dados
            const statusCell = document.createElement('td');
            statusCell.textContent = entrega.statusEntrega || 'N/A';

            const codigoCell = document.createElement('td');
            codigoCell.textContent = entrega.idEntrega.toString().padStart(6, '0');

            const documentoCell = document.createElement('td');
            documentoCell.textContent = entrega.cupomOrcamento || 'N/A';

            const valorVendaCell = document.createElement('td');
            valorVendaCell.textContent = entrega.valorTotal.toFixed(2);

            const valorRecebidoCell = document.createElement('td');
            valorRecebidoCell.textContent = entrega.valorReceber.toFixed(2);

            const valorTrocoCell = document.createElement('td');
            valorTrocoCell.textContent = entrega.troco.toFixed(2);

            const dataCell = document.createElement('td');
            dataCell.textContent = new Date(entrega.dataCadastroEntrega).toLocaleDateString();

            const horaCell = document.createElement('td');
            horaCell.textContent = new Date(entrega.dataCadastroEntrega).toLocaleTimeString();

            const nomeEntregadorCell = document.createElement('td');
            nomeEntregadorCell.textContent = entrega.nomeEntregador || 'N/A';

            const nomeVendedorCell = document.createElement('td');
            nomeVendedorCell.textContent = entrega.nomeUser;

            // Adiciona as células à linha
            row.appendChild(statusCell);
            row.appendChild(codigoCell);
            row.appendChild(documentoCell);
            row.appendChild(valorVendaCell);
            row.appendChild(valorRecebidoCell);
            row.appendChild(valorTrocoCell);
            row.appendChild(dataCell);
            row.appendChild(horaCell);
            row.appendChild(nomeEntregadorCell);
            row.appendChild(nomeVendedorCell);

            // Adiciona a linha ao body da tabela
            tabelaBody.appendChild(row);
        });

    } catch (error) {
        console.error('Erro ao popular a tabela de entregas:', error);
    }
}

async function visualizarEntrega() {
    // Obter a linha selecionada na tabela
    let selectedRow = document.querySelector('#entregasBody .selected');
    if (!selectedRow) {
        alert('Por favor, selecione uma linha para visualizar.');
        return;
    }
    let entregaId = selectedRow.cells[1].textContent;  // Considerando que a segunda célula é o código (ID)
    window.location.href = `Entregas_View.html?id=${entregaId}`;
}

document.getElementById('abrirmaps').addEventListener('click', openModal)

function openModal(){
    let selectedRow = document.querySelector('#entregasBody .selected');
    if (!selectedRow) {
        alert('Por favor, selecione uma entrega para visualizar.');
        return;
    }
    let status = selectedRow.cells[0].textContent;
    if (status === 'Finalizada') {
        $('#googleMapsModal').modal('show');
    }else{
        alert('Apenas entregas finalizadas contemplam coordenadas geograficas');
    }
} 

function openGoogleMaps(latitude, longitude) {
    const url = `https://www.google.com/maps?q=${latitude},${longitude}`;
    window.open(url, '_blank');
}

async function getCordenadas() {
    let token = getTokenFromLocalStorage();
    
    let selectedRow = document.querySelector('#entregasBody .selected');
    if (!selectedRow) {
        alert('Por favor, selecione uma linha para visualizar.');
        return;
    }
    let idEntrega = selectedRow.cells[1].textContent;
    
    if (!idEntrega) {
        alert('ID da Entrega não foi fornecido.');
        return;
    }

    try {
        const response = await fetch(`${urlBackend()}/api/v1/entrega?idEntrega=${idEntrega}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        if (response.ok) {
            const data = await response.json();

            const latitude = data.body.latitude || '';
            const longitude = data.body.longitude || '';
            
            openGoogleMaps(latitude, longitude)
            fecharEntregas()

        } else {
            console.error('Erro ao buscar entrega:', response.statusText);
            alert('Erro ao buscar entrega: ' + response.statusText);
        }
    } catch (error) {
        console.error('Erro de conexão:', error);
        alert('Erro de conexão: ' + error.message);
    }
}



