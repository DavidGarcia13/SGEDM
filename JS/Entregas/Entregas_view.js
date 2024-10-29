window.onload = carregarEntregas;

async function carregarEntregas() {
    // Obter o token de autenticação
    let token = getTokenFromLocalStorage();
    desabilitarCampos()

    // Obter o ID da URL
    const idEntrega = getQueryParam('id');
    if (!idEntrega) {
        alert('ID da Entrega não foi fornecido.');
        return;
    }

    try { 
        // Fazer o fetch para a API com o ID do entregador
        const response = await fetch(`${urlBackend()}/api/v1/entrega?idEntrega=${idEntrega}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        if (response.ok) {
            const data = await response.json();

            document.getElementById('codigo').value = data.body.idEntrega || '';
            document.getElementById('nome-vendedor').value = data.body.nomeUser || '';
            document.getElementById('documento').value = data.body.cupomOrcamento || '';
            
            const dataHora = new Date(data.body.dataCadastroEntrega);
            document.getElementById('data').value = dataHora.toLocaleDateString('en-CA') || '';
            document.getElementById('hora').value = dataHora.toTimeString().split(' ')[0].substring(0, 5) || '';
        
            document.getElementById('valor').value = data.body.valorTotal || '';
            document.getElementById('valor-recebido').value = data.body.valorReceber || '';
            document.getElementById('troco').value = data.body.troco || '';
            document.getElementById('forma-pag').value = data.body.formaPagamento || '';
            document.getElementById('obs').value = data.body.observacao || '';
            document.getElementById('tipo-entrega').value = data.body.tipoEntrega || '';
            document.getElementById('filial').value = await GetEmpresas(data.body.idMatriz)|| '';
        
            // entregas
            const dataini = new Date(data.body.dataSelecaoEntrega);
            const datafim = new Date(data.body.dataFinalizacaoEntrega);
            document.getElementById('nome-entregador').value = data.body.nomeEntregador || '';
            document.getElementById('data-entrega').value = dataini.toLocaleDateString('en-CA') || '';
            document.getElementById('hora-entrega').value = dataini.toTimeString().split(' ')[0].substring(0, 5) || '';
            document.getElementById('data-inicio').value = datafim.toLocaleDateString('en-CA') || '';
            document.getElementById('inicio-entrega').value = datafim.toTimeString().split(' ')[0].substring(0, 5) || '';
            document.getElementById('status').value = data.body.statusEntrega || '';
            
            //Campos relacionados à assinatura e datas
            const dataass = new Date(data.body.dataAssinaturaEntrega);
            document.getElementById('vendedor-assinatura').value = data.body.nomeUserAssinatura || '';
            document.getElementById('data-assinatura').value = dataass.toLocaleDateString('en-CA') || '';
            document.getElementById('hora-assinatura').value = dataass.toTimeString().split(' ')[0].substring(0, 5) || '';
            
        } else {
            console.error('Erro ao buscar entrega:', response.statusText);
            alert('Erro ao buscar entrega: ' + response.statusText);
        }
    } catch (error) {
        console.error('Erro de conexão:', error);
        alert('Erro de conexão: ' + error.message);
    }
}

function desabilitarCampos() {
    // Seleciona todos os inputs dentro da div com id "nav-tabContent"
    const inputs = document.querySelectorAll('#nav-tabContent input');

    // Itera sobre todos os inputs e desabilita cada um
    inputs.forEach(input => {
        input.disabled = true;
    });
}