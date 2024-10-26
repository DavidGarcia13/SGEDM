function selecionarPrimeiraLinha() {
    const tabela = document.querySelector('#bodyavulsas');
    const primeiraLinha = tabela.querySelector('tr');
    
    if (primeiraLinha) {
        primeiraLinha.classList.add('selected');
    }
}

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
    const tableBody = document.getElementById('bodyavulsas');

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
async function getEntregasAvulsas() {
    let token = getTokenFromLocalStorage();
    
    if (!token){
        console.log('Não foi possivel obter o Token')
    }

    const url = `${urlBackend()}/api/v1/entrega/avulsas`;
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

            if (data) {
                return data;
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

function calcularTempoGasto(inicio, fim) {
    const inicioData = new Date(inicio);
    const fimData = new Date(fim);
    const diferenca = new Date(fimData - inicioData);

    const horas = diferenca.getUTCHours().toString().padStart(2, '0');
    const minutos = diferenca.getUTCMinutes().toString().padStart(2, '0');
    const segundos = diferenca.getUTCSeconds().toString().padStart(2, '0');

    return `${horas}:${minutos}:${segundos}`;
}

// Função para formatar data e hora
function formatarDataHora(dataHora) {
    const dataObj = new Date(dataHora);
    const dataFormatada = dataObj.toLocaleDateString();
    const horaFormatada = dataObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    return { data: dataFormatada, hora: horaFormatada };
}

//Salva detalhes em Local Storage
function salvarDetalhesEntregaLocalStorage(entrega) {
    const detalhes = {
        descricaoServico: entrega.descricaoServico,
        observacaoServico: entrega.observacaoServico
    };
    localStorage.setItem(`entrega_${entrega.id}`, JSON.stringify(detalhes));
}
    
// Função para popular a tabela de entregas avulsas
document.addEventListener('DOMContentLoaded', populateTableAvulsas);

async function populateTableAvulsas() {
    const entregas = await getEntregasAvulsas();

    const tbody = document.getElementById("bodyavulsas");
    tbody.innerHTML = ""; 

    entregas.forEach(entrega => {
        // Formata a data e hora de início e término
        const inicio = formatarDataHora(entrega.dataHoraInicioServico);
        const fim = formatarDataHora(entrega.dataHoraTerminoServico);

        // Calcula o tempo gasto entre início e término
        const tempoGasto = calcularTempoGasto(entrega.dataHoraInicioServico, entrega.dataHoraTerminoServico);

        salvarDetalhesEntregaLocalStorage(entrega)

        // Cria a linha da tabela com os dados da entrega
        const linha = document.createElement("tr");
        linha.innerHTML = `
            <td>${entrega.id}</td>
            <td>${entrega.userId}</td>
            <td>${inicio.data}</td>
            <td>${inicio.hora}</td>
            <td>${fim.data}</td>
            <td>${fim.hora}</td>
            <td>${tempoGasto}</td>
        `;
        
        // Adiciona a linha ao corpo da tabela
        tbody.appendChild(linha);
    });
    selecionarPrimeiraLinha('bodyavulsas')
}

//------------------------------------------------------------Modal Detalhes da Entrega Avulsa ------------------------------------------------
function abrirModalComDetalhes() {
    
    const tbody = document.getElementById("bodyavulsas");
    let selectedRow = document.querySelector('#bodyavulsas .selected');
    if (!selectedRow) {
        alert('Por favor, selecione uma linha para visualizar.');
        return;
    }
    
    let entregaid = selectedRow.cells[0].textContent;  // Considerando que a segunda célula é o código (ID)
  
    // Preenche os campos do modal com os dados da linha selecionada
    document.getElementById("modalIdEntrega").textContent = entregaid;
    document.getElementById("modalNomeEntregador").textContent = selectedRow.cells[1].textContent;
    document.getElementById("modalDataInicio").textContent = selectedRow.cells[2].textContent;
    document.getElementById("modalHoraInicio").textContent = selectedRow.cells[3].textContent;
    document.getElementById("modalDataFim").textContent = selectedRow.cells[4].textContent;
    document.getElementById("modalHoraFim").textContent = selectedRow.cells[5].textContent;
    document.getElementById("modalTempoGasto").textContent = selectedRow.cells[6].textContent;

    // Recupera a descrição e observação do localStorage usando o ID da entrega
    const detalhes = recuperarDetalhesEntrega(entregaid);
    document.getElementById("modalDescricaoServico").textContent = detalhes.descricaoServico || "N/A";
    document.getElementById("modalObservacaoServico").textContent = detalhes.observacaoServico || "N/A";

    // Exibe o modal
    $('#detalhesModal').modal('show');
}


function fecharModal() {
    document.getElementById("detalhesModal").style.display = "none";
}

function recuperarDetalhesEntrega(id) {
    return JSON.parse(localStorage.getItem(`entrega_${id}`)) || {};
}
