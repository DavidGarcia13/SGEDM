
async function carregarEntregador() {
    // Obter o token de autenticação
    let token = getTokenFromLocalStorage();

    // Obter o ID da URL
    const entregadorId = getQueryParam('id');
    if (!entregadorId) {
        alert('ID do entregador não foi fornecido.');
        return;
    }

    try {
        // Fazer o fetch para a API com o ID do entregador
        const response = await fetch(`${urlBackend()}/api/v1/entregador/${entregadorId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        if (response.ok) {
            const data = await response.json();
            // Preencher os campos do formulário com os dados do entregador
            document.getElementById('codigo').value = data.body.idEntregador.toString().padStart(6, '0');;
            document.getElementById('nome').value = data.body.nome;
            document.getElementById('cpf').value = data.body.cpf;
            document.getElementById('turno').value = data.body.turno;
            document.getElementById('filial').value = await GetEmpresas(data.body.idMatriz);
            document.getElementById('usuario').value = data.body.usuario;
            document.getElementById('telefone').value = data.body.telefone;

            // Preencher o status
            const statusCheckbox = document.getElementById('status');
            statusCheckbox.checked = data.body.ativo;
            const statusLabel = document.getElementById('status-label');
            statusLabel.textContent = data.body.ativo ? 'Ativo' : 'Inativo';
            statusLabel.classList.toggle('ativo', data.body.ativo);
            statusLabel.classList.toggle('inativo', !data.body.ativo);

            // Desabilitar a edição dos campos
            document.getElementById('codigo').disabled = true;
            document.getElementById('nome').disabled = true;
            document.getElementById('cpf').disabled = true;
            document.getElementById('usuario').disabled = true;
            carregarFilialETurno();
        } else {
            console.error('Erro ao buscar entregador:', response.statusText);
            alert('Erro ao buscar entregador: ' + response.statusText);
        }
    } catch (error) {
        console.error('Erro de conexão:', error);
        alert('Erro de conexão: ' + error.message);
    }
}

async function EnviarUpdate() {
    let token = getTokenFromLocalStorage();
    const entregadorId = getQueryParam('id');
    // Montar o JSON com os dados do formulário
    const formData = {
        turno: document.getElementById('turno').value,
        filial: document.getElementById('filial').value,
        telefone: document.getElementById('telefone').value,
        ativo: document.getElementById('status').checked
    };

    try {
        // Realizar o fetch com o método POST
        const response = await fetch(`${urlBackend()}/api/v1/entregador/${entregadorId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(formData) // Enviar o corpo da requisição com os dados do formulário
        });

        // Verificar a resposta da requisição
        if (response.ok) {
            const data = await response.json();
            console.log('Entregador Alterado com sucesso:', data);
            alert('Entregador Alterado com sucesso!');
            window.location.href = 'Entregador.html';
        } else {
            console.error('Erro ao Alterar o entregador:', response.statusText);
            alert('Erro ao Alterar entregador: ' + response.statusText);
        }
    } catch (error) {
        console.error('Erro de conexão:', error);
        alert('Erro de conexão: ' + error.message);
    }
}
// Chamar a função assim que a página carregar
window.onload = carregarEntregador;

