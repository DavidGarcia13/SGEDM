//Atualiza o status de ativo ou inativo do entregador
document.getElementById('status').addEventListener('change', atualizarStatus);

function atualizarStatus() {
    const checkbox = document.getElementById('status');
    const statusLabel = document.getElementById('status-label');
    
    if (checkbox.checked) {
        statusLabel.textContent = 'Ativo';
        statusLabel.classList.remove('inativo');
        statusLabel.classList.add('ativo');
    } else {
        statusLabel.textContent = 'Inativo';
        statusLabel.classList.remove('ativo');
        statusLabel.classList.add('inativo');
    }
}

async function cadastrarEntregador() {
    // Obter o token de autenticação do localStorage
    let token = getTokenFromLocalStorage();

    // Montar o JSON com os dados do formulário
    const formData = {
        nome: document.getElementById('nome').value,
        cpf: document.getElementById('cpf').value,
        turno: document.getElementById('turno').value,
        idMatriz: parseInt(document.getElementById('filial').value.substring(0, document.getElementById('filial').value.indexOf('-')), 10),//tratamento para o ID
        usuario: document.getElementById('usuario').value,
        senha: document.getElementById('senha').value,
        telefone: document.getElementById('telefone').value,
        ativo: document.getElementById('status').checked
    };

    try {
        // Realizar o fetch com o método POST
        const response = await fetch(`${urlBackend()}/api/v1/entregador`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(formData) // Enviar o corpo da requisição com os dados do formulário
        });

        // Verificar a resposta da requisição
        if (response.ok) {
            console.log('Entregador cadastrado com sucesso:');
            alert('Entregador cadastrado com sucesso!');
            window.location.href = 'Entregador.html';
        } else {
            console.error('Erro ao cadastrar entregador:', response.statusText);
            alert('Erro ao cadastrar entregador: ' + response.statusText);
        }
    } catch (error) {
    }
}

async function carregarFilialETurno() {
    const filialSelect = document.getElementById('filial');
    const turnoSelect = document.getElementById('turno');

    // Exemplo de dados para os comboboxes (pode ser substituído por uma chamada a API)
    const filiais = await GetEmpresas('')
    const turnos = ['Manhã', 'Tarde', 'Noite'];

    filiais.forEach(filial => {
        const option = document.createElement('option');
        option.value = filial.idMatriz + '-'+ filial.nome;
        option.textContent =  filial.idMatriz + '-'+ filial.nome;
        filialSelect.appendChild(option);
    });

    turnos.forEach(turno => {
        const option = document.createElement('option');
        option.value = turno;
        option.textContent = turno;
        turnoSelect.appendChild(option);
    });
}

// Função para alternar visualização da senha
document.getElementById('toggle-password').addEventListener('click', function() {
    const senhaInput = document.getElementById('senha');
    const icon = this.querySelector('i');
    
    if (senhaInput.type === 'password') {
        senhaInput.type = 'text';
        icon.classList.remove('fa-eye');
        icon.classList.add('fa-eye-slash');
    } else {
        senhaInput.type = 'password';
        icon.classList.remove('fa-eye-slash');
        icon.classList.add('fa-eye');
    }
});

// Chamada da função ao carregar a página
window.onload = carregarFilialETurno;

function gerarUsuario() {
    // Captura o valor do campo nome
    let nomeCompleto = document.getElementById('nome').value.trim();

    // Separa as palavras do nome
    let palavras = nomeCompleto.split(' ');

    // Pega a primeira e última palavra do nome
    let primeiraPalavra = palavras[0].toLowerCase();
    let ultimaPalavra = palavras[palavras.length - 1].toLowerCase();

    // Gera o nome de usuário no formato 'primeira.ultima'
    let usuario = `${primeiraPalavra}.${ultimaPalavra}`;

    // Define o valor do campo usuário com o nome gerado
    document.getElementById('usuario').value = usuario;
    document.getElementById('usuario').disabled = true;
}

/*Muda o focu do campo ao Pressionar enter*/

document.addEventListener('DOMContentLoaded', function() {
    const inputs = document.querySelectorAll('input');

    inputs.forEach((input, index) => {
        input.addEventListener('keydown', function(event) {
            if (event.key === 'Enter') {
                event.preventDefault();
                const nextInput = inputs[index + 1];
                if (nextInput) {
                    nextInput.focus();
                }
            }
        });
    });
});

document.addEventListener('DOMContentLoaded', function() {
    // Definir o status como "Ativo" ao carregar a página
    const checkbox = document.getElementById('status');
    checkbox.checked = true;
    atualizarStatus(); // Chama a função para atualizar o texto e as classes

    // Adiciona o evento para atualizar o status quando houver uma alteração
    checkbox.addEventListener('change', atualizarStatus);
});