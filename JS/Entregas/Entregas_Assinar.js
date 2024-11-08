// Função para carregar dados e popular a tabela
async function carregarDados() {
    const tabelaBody = document.getElementById('entregasBody');
    let nItens = 0;
    // Criar data de início, subtraindo 2 dias da data atual e ajustando a hora
    const dataInicio = document.getElementById('inputData').value;
    
    if (!dataInicio) {
        showAlert('Nenhuma Data Informada')
        return;
    }

    const ddataini = `${dataInicio}T00:00:00`
    const ddatafim = `${dataInicio}T23:59:59`
  
    tabelaBody.innerHTML = '';

    try {
        // Chama a função para obter os dados das entregas
        const entregas = await getEntregas(ddataini,ddatafim);

        // Itera sobre o array de entregas e cria as linhas da tabela
        entregas.forEach(entrega => {
            // Cria uma nova linha (<tr>)
            if(entrega.statusEntrega === 'Finalizada' ||  entrega.statusEntrega === 'Finalizada Manualmente'){
                nItens++;
                const row = document.createElement('tr');
                // Cria as células (<td>) e insere os dados
                const checkboxCell = document.createElement("td");
                const checkbox = document.createElement("input");
                checkbox.type = "checkbox";
                checkbox.name = "selecionarRegistro";
                

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
                checkboxCell.appendChild(checkbox);
                row.appendChild(checkboxCell);
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
            }
        });
        if(nItens == 0){
            showAlert('Nenhuma Entrega hapta para assinar nesta')
        }

    } catch (error) {
        console.error('Erro ao popular a tabela de Assinatura de entregas:', error);
    }
}

// Função para confirmar a seleção de itens marcados
function confirmarSelecao() {
    const checkboxes = document.querySelectorAll('#entregasBody input[type="checkbox"]:checked');
    
    // Cria um array para armazenar os códigos selecionados
    const codigosSelecionados = Array.from(checkboxes).map(checkbox => {
        // Navega até a linha (<tr>) pai do checkbox
        const row = checkbox.closest("tr");
        
        // Seleciona a célula da coluna "Código" (supondo que seja a terceira coluna)
        const codigo = row.cells[2].textContent.trim();
        
        return parseInt(codigo);
    });
    
    console.log("Códigos selecionados:", codigosSelecionados);
    return codigosSelecionados; 
}

async function AssinarEntrega() {
    const idVendedor = getIdNomeUser(2);
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
        body: `[${confirmarSelecao()}]`,
        mode: 'cors',
    };

    try {
        const response = await fetch(url, opcoes);

        if (!response.ok) {
            showAlert('Falha ao assinar as entregas.')
            throw new Error('Erro na requisição: ' + response.status);
        }
        showAlert('Entregas assinadas com sucesso.')
        window.location.href = 'Entregas.html'; 
        
    } catch (e) {
        console.log('Deu erro: ' + e.message);
        throw e; // Relança o erro para ser tratado onde a função for chamada
    }
   
}

// Selecionar ou desmarcar todos os itens
function selecionarTodos(source) {
    const checkboxes = document.querySelectorAll('#entregasBody input[type="checkbox"]');
    checkboxes.forEach(cb => cb.checked = source.checked);
}

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