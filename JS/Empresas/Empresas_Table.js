// Função para popular a tabela no HTML
async function populateTableEmp() {
    const empresas = await GetEmpresas(); 

    const tableBody = document.getElementById('empresasBody');

    // Limpa o conteúdo existente
    tableBody.innerHTML = '';

    empresas.forEach(empresa => {
        const row = document.createElement('tr');

        // Coluna Código (baseado no campo "idempresa")
        const codigoCell = document.createElement('td');
        codigoCell.textContent = empresa.idMatriz.toString().padStart(6, '0');
        row.appendChild(codigoCell);

        // Coluna Nome do empresa (baseado no campo "nome")
        const nomeCell = document.createElement('td');
        nomeCell.textContent = empresa.nome;
        row.appendChild(nomeCell);

        const CnpjCell = document.createElement('td');
        CnpjCell.textContent = empresa.cnpj; // Adapte conforme necessário
        row.appendChild(CnpjCell);

        const logrador = document.createElement('td');
        logrador.textContent = empresa.logradouro; // Adapte conforme necessário
        row.appendChild(logrador);


        // Adiciona a linha à tabela
        tableBody.appendChild(row);
    });
    selecionarPrimeiraLinha('empresasBody');
}

document.addEventListener('DOMContentLoaded', function() {
    const tableBody = document.getElementById('empresasBody');

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
document.addEventListener('DOMContentLoaded', populateTableEmp);

async function visualizarEmpresa() {
    // Obter a linha selecionada na tabela
    let selectedRow = document.querySelector('#empresasBody .selected');
    if (!selectedRow) {
        alert('Por favor, selecione uma linha para visualizar.');
        return;
    }

    // Obter o ID do empresa na coluna "Código"
    let empresaId = selectedRow.cells[1].textContent;  // Considerando que a segunda célula é o código (ID)
    window.location.href = `Empresa_View.html?id=${empresaId}`;
}

async function AlterarEmpresa() {
    // Obter a linha selecionada na tabela
    let selectedRow = document.querySelector('#empresasBody .selected');
    if (!selectedRow) {
        alert('Por favor, selecione uma linha para visualizar.');
        return;
    }

    // Obter o ID do empresa na coluna "Código"
    let empresaId = selectedRow.cells[1].textContent;  // Considerando que a segunda célula é o código (ID)
    window.location.href = `Empresa_Update.html?id=${empresaId}`;
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
    const tabela = document.getElementById('empresasBody');
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
                    colunaIndex = 1;
                    break;
                case 'codigo':
                    colunaIndex = 0;
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
    const tabela = document.getElementById('empresasBody');
    const linhas = tabela.getElementsByTagName('tr');

    for (let i = 0; i < linhas.length; i++) {
        linhas[i].style.display = ''; // Mostra todas as linhas
    }
}