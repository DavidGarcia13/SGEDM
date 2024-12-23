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
async function getEntregas(ddataini,ddatafim) {
    let token = getTokenFromLocalStorage();

    if (!ddataini || !ddatafim) {
        alert('Por favor, preencha ambas as datas.');
        return;
    }else if(ddataini > ddatafim){
        alert('A Data inicial não pode ser maior que a data final.');
        return;
    } 
    
    if (!token){
        console.log('Não foi possivel obter o Token')
    }

    const url = `${urlBackend()}/api/v1/entrega?dataInicio=${ddataini}&dataTermino=${ddatafim}`;
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

function formatarData(data) {
    const ano = data.getFullYear();
    const mes = String(data.getMonth() + 1).padStart(2, '0');
    const dia = String(data.getDate()).padStart(2, '0');
    const horas = String(data.getHours()).padStart(2, '0');
    const minutos = String(data.getMinutes()).padStart(2, '0');
    const segundos = String(data.getSeconds()).padStart(2, '0');

    return `${ano}-${mes}-${dia}T${horas}:${minutos}:${segundos}`;
}

document.addEventListener('DOMContentLoaded', populateTableEntregas);


async function populateTableEntregas() {
    const tabelaBody = document.getElementById('entregasBody');
    const dataAtual = new Date();

    // Criar data de início, subtraindo 2 dias da data atual e ajustando a hora
    const dataInicio = new Date(dataAtual);
    dataInicio.setDate(dataAtual.getDate() - 2);
    dataInicio.setHours(0, 0, 1);

    // Ajustar a data de fim para o final do dia
    const dataFim = new Date(dataAtual);
    dataFim.setHours(23, 59, 59);

    const formatarData = (data) =>
        data.toISOString().slice(0, 19);

    const ddataini = formatarData(dataInicio);
    const ddatafim = formatarData(dataFim);

    tabelaBody.innerHTML = '';

    try {
        // Chama a função para obter os dados das entregas
        const entregas = await getEntregas(ddataini,ddatafim);

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
            valorVendaCell.textContent = (entrega.valorTotal ?? 0).toFixed(2);
            
            const valorRecebidoCell = document.createElement('td');
            valorRecebidoCell.textContent = (entrega.valorReceber ?? 0).toFixed(2);
            
            const valorTrocoCell = document.createElement('td');
            valorTrocoCell.textContent = (entrega.troco ?? 0).toFixed(2);

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
        selecionarPrimeiraLinha('entregasBody')

    } catch (error) {
        console.error('Erro ao popular a tabela de entregas:', error);
    }
}

async function visualizarEntrega() {
    // Obter a linha selecionada na tabela
    let selectedRow = document.querySelector('#entregasBody .selected');
    if (!selectedRow) {
        showAlert('Por favor, selecione uma linha para visualizar.');
        //alert('Por favor, selecione uma linha para visualizar.');
        return;
    }
    let entregaId = selectedRow.cells[1].textContent;  // Considerando que a segunda célula é o código (ID)
    window.location.href = `Entregas_View.html?id=${entregaId}`;
}


//----------------------------------------------Local da Entrega Maps-------------------------------------------------------------------------\\
document.getElementById('abrirmaps').addEventListener('click', openModal)

function openModal(){
    let selectedRow = document.querySelector('#entregasBody .selected');
    if (!selectedRow) {
        showAlert('Por favor, selecione uma entrega para visualizar.');
        //alert('Por favor, selecione uma entrega para visualizar.');
        return;
    }
    let status = selectedRow.cells[0].textContent;
    if (status === 'Finalizada' ||  status === 'Finalizada e Assinada') {
        $('#googleMapsModal').modal('show');
    }else{
        showAlert('Apenas entregas finalizadas contemplam coordenadas geograficas');
        //alert('Apenas entregas finalizadas contemplam coordenadas geograficas');
    }
} 

function openGoogleMaps(latitude, longitude) {
    const url = `https://www.google.com/maps?q=${latitude},${longitude}`;
    window.open(url, '_blank');
}

function getIdEntrega(){
    let selectedRow = document.querySelector('#entregasBody .selected');
    if (!selectedRow) {
        showAlert('Por favor, selecione uma linha para visualizar.');
        //alert('Por favor, selecione uma linha para visualizar.');
        return;
    }
    let idEntrega = selectedRow.cells[1].textContent;
    
    if (!idEntrega) {
        showAlert('ID da Entrega não foi fornecido.');
        //alert('ID da Entrega não foi fornecido.');
        return;
    }else{
        return idEntrega;
    }
}

async function getCordenadas() {
    let token = getTokenFromLocalStorage();
    let idEntrega = getIdEntrega()
    
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
              voltarPrincipal('Entregas')

        } else {
            console.error('Erro ao buscar entrega:', response.statusText);
            showAlert('Erro ao buscar entrega: ' + response.statusText);
            //alert('Erro ao buscar entrega: ' + response.statusText);
        }
    } catch (error) {
        console.error('Erro de conexão:', error);
        showAlert('Erro de conexão: ' + error.message);
        //alert('Erro de conexão: ' + error.message);
    }
}

//----------------------------------------------Atribuir Entregador-------------------------------------------------------------------------\\
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

async function preencherComboEntregadores() {
    // Pegando o combo select pelo ID
    const selectEntregador = document.getElementById("select-entregador");

    // Limpando as opções atuais (exceto a primeira)
    selectEntregador.innerHTML = '<option value="">Selecione o Entregador</option>';

    // Chama a função GetEntregadores e preenche o combo com as opções
    const entregadores = await getEntregadores();

    // Itera sobre os entregadores e cria um option para cada um
    entregadores.forEach(entregador => {
        const option = document.createElement("option");
        option.value = entregador.idEntregador; // Valor será o ID do entregador
        option.textContent = entregador.nome; // Texto visível será o nome do entregador
        selectEntregador.appendChild(option);
    });
}

document.getElementById('atribuirentregador').addEventListener('show.bs.modal', preencherComboEntregadores);
document.getElementById('atribuirent').addEventListener('click', modalAtribuirEnt)

function modalAtribuirEnt(){
    let selectedRow = document.querySelector('#entregasBody .selected');
    if (!selectedRow) {
        showAlert('Por favor, selecione uma entrega para visualizar.');
        //alert('Por favor, selecione uma entrega para visualizar.');
        return;
    }
    let status = selectedRow.cells[0].textContent;
    if (status === 'Aberta') {
        $('#atribuirentregador').modal('show');
    }else{
        showAlert('Apenas entregas em aberto podem ser atribuidas');
        //alert('Apenas entregas em aberto podem ser atribuidas');
    }
} 

async function atribuirEntregador() {
    // Captura o valor do entregador selecionado no combo
    const selectEntregador = document.getElementById("select-entregador");
    const idEntregador = selectEntregador.options[selectEntregador.selectedIndex].value;
    let idEntrega = getIdEntrega();
    let token = getTokenFromLocalStorage();

    // Verifica se um entregador foi selecionado
    if (idEntregador === "") {
        showAlert('Por favor, selecione um entregador.');
        //alert("Por favor, selecione um entregador.");
        return;
    }
    
    const url = `${urlBackend()}/api/v1/entrega/atribuir/${parseInt(idEntrega)}`;

    const opcoes = {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
            id: parseInt(idEntregador)
        }),
        mode: 'cors',
    };

    try {
        const response = await fetch(url, opcoes);

        if (!response.ok) {
            throw new Error('Erro na requisição: ' + response.status);
        }

        window.location.href = 'Entregas.html'; 
        
    } catch (e) {
        console.log('Deu erro: ' + e.message);
        throw e; // Relança o erro para ser tratado onde a função for chamada
    }
   
}

// Associa a função ao botão "Confirmar" no modal
document.getElementById("confirmar-entregador").addEventListener("click", atribuirEntregador);

//----------------------------------------------Finalizar Entrega-------------------------------------------------------------------------\\

async function finalizarEntrega() {
    let selectStatusEntrega = document.getElementById("select-status-entrega");
    let idEntrega = getIdEntrega();
    let token = getTokenFromLocalStorage();


    if (!selectStatusEntrega) {
        console.error("Elemento select-status-entrega não encontrado.");
        return;
    }

    let statusEntrega = selectStatusEntrega.value;

    if (statusEntrega === "") {
        showAlert('Por favor, selecione o status da entrega.');
        //alert("Por favor, selecione o status da entrega.");
        return;
    }else{
        if(statusEntrega === "entregue"){
            statusEntrega = "FINALIZADA_MANUAL"
        }else{
             statusEntrega = "NAO_ENTREGUE"
        }
    }
 
    const url = `${urlBackend()}/api/v1/entrega/finalizar/${parseInt(idEntrega)}/${statusEntrega}`;

    const opcoes = {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        mode: 'cors',
    };

    try {
        const response = await fetch(url, opcoes);

        if (!response.ok) {
            throw new Error('Erro na requisição: ' + response.status);
        }

        window.location.href = 'Entregas.html'; 
        
    } catch (e) {
        console.log('Deu erro: ' + e.message);
        throw e; // Relança o erro para ser tratado onde a função for chamada
    }

}

document.getElementById('finentrega').addEventListener('click', modalFinalizaEnt)

function modalFinalizaEnt(){
    let selectedRow = document.querySelector('#entregasBody .selected');
    if (!selectedRow) {
        showAlert('Por favor, selecione uma entrega para visualizar.');
        //alert('Por favor, selecione uma entrega para visualizar.');
        return;
    }
    let status = selectedRow.cells[0].textContent;
    if (status === 'Em rota') {
        $('#finalizarEntregaModal').modal('show');
    }else{
        showAlert('Apenas entregas atribuidas podem ser finalizadas');
        //alert('Apenas entregas atribuidas podem ser finalizadas');
    }
} 

//----------------------------------------------Assinatura da Entrega-------------------------------------------------------------------------\\

document.getElementById('assentrega').addEventListener('click', modalAssinaEnt)

function modalAssinaEnt(){
    let selectedRow = document.querySelector('#entregasBody .selected');
    if (!selectedRow) {
        showAlert('Por favor, selecione uma entrega para visualizar.');
        //alert('Por favor, selecione uma entrega para visualizar.');
        return;
    }
    let status = selectedRow.cells[0].textContent;
    if (status === 'Finalizada' || status === 'Finalizada Manualmente') {
        $('#assinaEntregaModal').modal('show');
    } else {
        showAlert('Apenas entregas atribuídas podem ser finalizadas');
        //alert('Apenas entregas atribuídas podem ser finalizadas');
    }
} 

async function AssinarEntrega() {
    const idVendedor = getIdNomeUser(2);
    let idEntrega = getIdEntrega();
    let token = getTokenFromLocalStorage();

    // Verifica se um entregador foi selecionado
    if (idVendedor === "") {
        showAlert('Usuario não Autenticado!');
        return;
    }
    
    const url = `${urlBackend()}/api/v1/entrega/assinar/${parseInt(idVendedor)}`;

    const opcoes = {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: `[${parseInt(idEntrega)}]`,
        mode: 'cors',
    };

    try {
        const response = await fetch(url, opcoes);

        if (!response.ok) {
            throw new Error('Erro na requisição: ' + response.status);
        }

        window.location.href = 'Entregas.html'; 
        
    } catch (e) {
        console.log('Deu erro: ' + e.message);
        throw e; // Relança o erro para ser tratado onde a função for chamada
    }
   
}

//----------------------------------------------Inativar Entrega-------------------------------------------------------------------------\\

document.getElementById('btnexcluir').addEventListener('click', modalCancelEnt)

function modalCancelEnt(){
    let selectedRow = document.querySelector('#entregasBody .selected');
    if (!selectedRow) {
        showAlert('Por favor, selecione uma entrega para visualizar.');
        //alert('Por favor, selecione uma entrega para visualizar.');
        return;
    }
    let status = selectedRow.cells[0].textContent;
    if (status === 'Aberta' || status === 'Em rota') {
        $('#cancelEntregaModal').modal('show');
    } else {
        showAlert('Apenas entregas não finalizadas podem ser canceladas.');
        //alert('Apenas entregas não finalizadas podem ser excluidas');
    }
} 

async function CancelarEntrega() {
    let idEntrega = getIdEntrega();
    let token = getTokenFromLocalStorage();

    const url = `${urlBackend()}/api/v1/entrega/cancelar/${parseInt(idEntrega)}`;

    const opcoes = {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        mode: 'cors',
    };

    try {
        const response = await fetch(url, opcoes);

        if (!response.ok) {
            throw new Error('Erro na requisição: ' + response.status);
        }

        window.location.href = 'Entregas.html'; 
        
    } catch (e) {
        console.log('Deu erro: ' + e.message);
        throw e; // Relança o erro para ser tratado onde a função for chamada
    }
   
}

//-------------------------------------------------------FILTROS-------------------------------------------------------

document.getElementById('Inputfind').addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
        filtrarTabela();
    }
});

function filtrarTabela() {
    const valorInput = document.getElementById('Inputfind').value.toLowerCase();
    const filtros = document.querySelectorAll('.filter-checkbox:checked');
    const tabela = document.getElementById('entregasBody');
    const linhas = tabela.getElementsByTagName('tr');

    if (filtros.length === 0 || !valorInput) {
        showAlert('Selecione ao menos um filtro e preencha o campo de busca.');
        //alert('Selecione ao menos um filtro e preencha o campo de busca.');
        return;
    }

    for (let i = 0; i < linhas.length; i++) {
        let mostrarLinha = false;

        filtros.forEach(filtro => {
            const filtroId = filtro.id;
            let colunaIndex = -1;

            switch (filtroId) {
                case 'status':
                    colunaIndex = 0;
                    break;
                case 'codigo':
                    colunaIndex = 1;
                    break;
                case 'documento':
                    colunaIndex = 2;
                    break;
                case 'entregador':
                    colunaIndex = 8;
                    break;
                case 'vendedor':
                    colunaIndex = 9;
                    break;
            }

            if (colunaIndex > -1) {
                const conteudoColuna = linhas[i].getElementsByTagName('td')[colunaIndex].textContent.toLowerCase();
                if (conteudoColuna.includes(valorInput)) {
                    mostrarLinha = true;
                }
            }
        });

        linhas[i].style.display = mostrarLinha ? '' : 'none';
    }
}

document.getElementById('Inputfind').addEventListener('input', function() {
    if (this.value === '') {
        removerFiltros();
    }
});

function removerFiltros() {
    const tabela = document.getElementById('entregasBody');
    const linhas = tabela.getElementsByTagName('tr');

    for (let i = 0; i < linhas.length; i++) {
        linhas[i].style.display = ''; // Mostra todas as linhas
    }
}

//--------------------------------------------------------Alterar Entrega--------------------------------------------------------------------
async function AlterarEntrega() {
    // Obter a linha selecionada na tabela
    let selectedRow = document.querySelector('#entregasBody .selected');
    if (!selectedRow) {
        showAlert('Por favor, selecione uma linha para visualizar.');
        //alert('Por favor, selecione uma linha para visualizar.');
        return;
    }

    // Obter o ID do entregador na coluna "Código"
    let entregaId = selectedRow.cells[1].textContent;  // Considerando que a segunda célula é o código (ID)
    window.location.href = `Entregas_Update.html?id=${entregaId}`;
}
