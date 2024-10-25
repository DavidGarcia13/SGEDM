async function carregarVendedor() {

    let token = getTokenFromLocalStorage();

    const vendedorid = getQueryParam('id');
    if (!vendedorid) {
        alert('ID do entregador não foi fornecido.');
        return;
    }

    try {
        const response = await fetch(`${urlBackend()}/api/v1/usuario/${vendedorid}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        if (response.ok) {
            const data = await response.json();

            //document.getElementById('codigo').value = data.id.toString().padStart(6, '0');
            document.getElementById('nome').value = data.nome;
            //document.getElementById('cpf').value = data.cpf;
            //document.getElementById('turno').value = data.turno;
            //document.getElementById('filial').value = await GetEmpresas(data.idMatriz);
            document.getElementById('usuario').value = data.username;
            document.getElementById('senha').value = '********';
            //document.getElementById('telefone').value = data.body.telefone;

            // Preencher o status
            const statusCheckbox = document.getElementById('status');
            statusCheckbox.checked = true/*data.ativo*/;
            const statusLabel = document.getElementById('status-label');
            statusLabel.textContent = 'Ativo';
        
            // Desabilitar a edição dos campos
            //document.getElementById('codigo').disabled = true;
            document.getElementById('nome').disabled = true;
            document.getElementById('turno').disabled = true;
            document.getElementById('telefone').disabled = true;
            document.getElementById('cpf').disabled = true;
            document.getElementById('usuario').disabled = true;
            document.getElementById('filial').disabled = true;
            document.getElementById('senha').disabled = true;
        } else {
            console.error('Erro ao buscar entregador:', response.statusText);
            alert('Erro ao buscar entregador: ' + response.statusText);
        }
    } catch (error) {
        console.error('Erro de conexão:', error);
        alert('Erro de conexão: ' + error.message);
    }
}
// Chamar a função assim que a página carregar
window.onload = carregarVendedor;