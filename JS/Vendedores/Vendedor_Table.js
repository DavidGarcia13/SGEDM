//Função para obter os entregadores
async function getVendedores() {
    let token = getTokenFromLocalStorage();
    
    if (!token){
        console.log('Não foi possivel obter o Token')
    }

    const url = `${urlBackend()}/api/v1/usuario`;
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
            throw new Error('Erro ao buscar vendedores: ' + response.statusText);
        }
    } catch (error) {
        
        return [];
    }
}

async function populateTable() {
    const vendedores = await getVendedores();

    const tableBody = document.getElementById('vendedoresBody');

    tableBody.innerHTML = '';

    vendedores.forEach(vendedor => {
        const row = document.createElement('tr');

       //sempre ativo ate liberação do campo
        const statusCell = document.createElement('td');
        statusCell.textContent =  'Ativo';
        row.appendChild(statusCell);

    
        const codigoCell = document.createElement('td');
        codigoCell.textContent = vendedor.id.toString().padStart(6, '0');
        row.appendChild(codigoCell);

        const nomeCell = document.createElement('td');
        nomeCell.textContent = vendedor.nome;
        row.appendChild(nomeCell);

        //sempre Ambas até adaptação do programa
        const filialCell = document.createElement('td');
        filialCell.textContent = 'Ambas'; 
        row.appendChild(filialCell);


        tableBody.appendChild(row);
    });
    selecionarPrimeiraLinha('vendedoresBody');
}

document.addEventListener('DOMContentLoaded', function() {
    const tableBody = document.getElementById('vendedoresBody');

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

async function visualizarVendedor() {
    // Obter a linha selecionada na tabela
    let selectedRow = document.querySelector('#vendedoresBody .selected');
    if (!selectedRow) {
        alert('Por favor, selecione uma linha para visualizar.');
        return;
    }

    // Obter o ID do entregador na coluna "Código"
    let vendedorId = selectedRow.cells[1].textContent;  // Considerando que a segunda célula é o código (ID)
    window.location.href = `Vendedor_View.html?id=${vendedorId}`;
}

async function AlterarVendedor() {
    // Obter a linha selecionada na tabela
    let selectedRow = document.querySelector('#vendedoresBody .selected');
    if (!selectedRow) {
        alert('Por favor, selecione uma linha para visualizar.');
        return;
    }

    // Obter o ID do entregador na coluna "Código"
    let vendedorId = selectedRow.cells[1].textContent;  // Considerando que a segunda célula é o código (ID)
    window.location.href = `Vendedor_Update.html?id=${vendedorId}`;
}

//-------------------------------------------------------FILTROS-------------------------------------------------------

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

document.getElementById('dropdownFilterButton').addEventListener('click', function() {
    configureCheckboxes(); // Chama a função para configurar os checkboxes
});


document.getElementById('Inputfind').addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
        filtrarTabela();
    }
});

function filtrarTabela() {
    const valorInput = document.getElementById('Inputfind').value.toLowerCase();
    const filtros = document.querySelectorAll('.filter-checkbox:checked');
    const tabela = document.getElementById('vendedoresBody');
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
                case 'nome':
                    colunaIndex = 2;
                    break;
                case 'codigo':
                    colunaIndex = 1;
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
    const tabela = document.getElementById('vendedoresBody');
    const linhas = tabela.getElementsByTagName('tr');

    for (let i = 0; i < linhas.length; i++) {
        linhas[i].style.display = ''; // Mostra todas as linhas
    }
}